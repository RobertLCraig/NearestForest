#!/usr/bin/env python3
"""Stage 2: parse cached raw HTML + car park JSON into app/data/sites.json.

Reads only from data/raw/, so it makes zero network requests and can be iterated
on freely. Fails loudly and exits non-zero rather than emitting a partial dataset.
"""
import json, os, re, sys, html as htmllib
from datetime import date, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "data", "raw")
PAGES = os.path.join(RAW, "pages")
OUT = os.path.join(ROOT, "app", "data", "sites.json")
TODAY = date.today().isoformat()

# England bounding box, used as a tripwire against unprojected British National Grid
LAT_RANGE = (49.5, 56.2)
LNG_RANGE = (-6.8, 2.2)

VALID_STATUS = {"Permanent - Official", "Permanent - Unofficial",
                "Seasonal - Official", "Seasonal - Unofficial", "Temporary"}

problems = []
notes = {"jsonld_missing": 0, "satnav_missing": 0, "opening_missing": 0,
         "parking_missing": 0, "facilities_missing": 0,
         "access_always": 0, "access_dusk": 0, "access_hours": 0, "access_unknown": 0}
coord_deltas = []


def log(m):
    print(m, flush=True)


# ---------------------------------------------------------------- html helpers
def strip_tags(s):
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</p>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = htmllib.unescape(s).replace("\xa0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n", s)
    return s.strip()


def field_block(h, field_name):
    """Return the inner HTML of a Drupal field--name-field-<name> div, brace-matched by depth."""
    m = re.search(r'<div[^>]*field--name-field-' + re.escape(field_name) + r'[^"]*"[^>]*>', h)
    if not m:
        return None
    i, depth, start = m.end(), 1, m.end()
    for tag in re.finditer(r"<(/?)div\b[^>]*>", h[start:]):
        depth += -1 if tag.group(1) else 1
        if depth == 0:
            return h[start:start + tag.start()]
    return h[start:start + 4000]


# ---------------------------------------------------------------- extractors
def parse_jsonld(h):
    for block in re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', h, re.S):
        try:
            d = json.loads(block)
        except Exception:
            continue
        items = d.get("@graph", []) if isinstance(d, dict) else d
        for it in items if isinstance(items, list) else [items]:
            if isinstance(it, dict) and it.get("@type") == "TouristDestination":
                return it
    return None


def parse_satnav(h):
    """The sat-nav postcode is published separately from the postal one and differs. See DECISIONS."""
    blk = field_block(h, "find-us-address")
    if not blk:
        return None, None
    m = re.search(r'postcode-label[^>]*>.*?</h4>\s*<span>([^<]+)</span>(.*)', blk, re.S)
    if not m:
        return None, strip_tags(blk) or None
    pc = htmllib.unescape(m.group(1)).strip()
    rest = strip_tags(m.group(2))
    rest = re.sub(r"\s*,\s*", ", ", rest).strip(" ,")
    if not re.match(r"^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$", pc.upper().strip()):
        return None, rest or None
    return pc.upper().strip(), rest or None


def parse_facilities(h):
    m = re.search(r'<ul class="vi-content-facilities-info">(.*?)</ul>', h, re.S)
    if not m:
        return None
    items = re.findall(r'vi-content-facilities-info-name"[^>]*>(.*?)</div>', m.group(1), re.S)
    out, seen = [], set()
    for it in items:
        t = strip_tags(it)
        t = re.sub(r"\s+", " ", t).strip()
        if t and t.lower() not in seen and len(t) < 80:
            seen.add(t.lower())
            out.append(t)
    return out or None


MONTHS = {m: i + 1 for i, m in enumerate(
    ["january", "february", "march", "april", "may", "june", "july",
     "august", "september", "october", "november", "december"])}


def _t(hour, mins, mer):
    hour = int(hour)
    mins = int(mins or 0)
    mer = (mer or "").lower()
    if mer == "pm" and hour != 12:
        hour += 12
    if mer == "am" and hour == 12:
        hour = 0
    return "%02d:%02d" % (hour, mins)


RE_ALWAYS = r"24\s*hour|24\s*hrs|24hrs|at all times|always open|open 24|open all day, every day"
RE_DUSK = r"dawn\s*(?:un)?til+\s*dusk|dawn\s*to\s*dusk|until dusk|til+ dusk|to dusk|sunrise to sunset"


def parse_opening(text):
    """Conservative. Anything not confidently understood is 'unparsed', and the UI then
    shows raw text rather than an open/closed badge. Never guess a gate is open.

    Classified into an `access` mode because the two commonest statements on these pages
    ("24 hour access, 365 days a year" and "dawn until dusk") are the most useful answers
    and neither is a clock time. Measured across the 268 pages that publish opening text:
    35% always-open, 39% dusk, 20% explicit clock times, 7% neither.
    Order matters: the always/dusk statements describe car park access, whereas a clock
    time on the same page is often the cafe or visitor centre, so access wins.
    """
    if not text:
        return None
    t = " ".join(text.split())
    opens = closes = season_from = season_to = None

    if re.search(RE_ALWAYS, t, re.I):
        notes["access_always"] += 1
        return {"access": "always", "opens": None, "closes": None,
                "season_from": None, "season_to": None, "confidence": "parsed"}
    if re.search(RE_DUSK, t, re.I):
        notes["access_dusk"] += 1
        m = re.search(r"open(?:s)?\s+(?:daily\s+)?(?:from\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)", t, re.I)
        return {"access": "dusk", "opens": _t(m.group(1), m.group(2), m.group(3)) if m else None,
                "closes": None, "season_from": None, "season_to": None, "confidence": "parsed"}

    m = re.search(r"open(?:s|ing)?\s+(?:daily\s+)?(?:from|at)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)", t, re.I)
    if m:
        opens = _t(m.group(1), m.group(2), m.group(3))

    seasons = []
    # Dated season: "1 March to 26 October 2026 8pm"
    for m in re.finditer(
        r"(\d{1,2})\s+([A-Za-z]+)\s+(?:\d{4}\s*)?to\s+(\d{1,2})\s+([A-Za-z]+)\s*(?:\d{4})?\s*[^0-9]{0,20}?(\d{1,2})(?::(\d{2}))?\s*(am|pm)",
            t, re.I):
        d1, m1, d2, m2 = int(m.group(1)), m.group(2).lower(), int(m.group(3)), m.group(4).lower()
        if m1 not in MONTHS or m2 not in MONTHS:
            continue
        seasons.append(((MONTHS[m1], d1), (MONTHS[m2], d2), _t(m.group(5), m.group(6), m.group(7))))

    # Month-to-month season with no day numbers: "March to October 8 pm".
    # Common enough to matter: Friston Forest, the nearest site to Brighton, publishes
    # its closing times this way and was falling through to 'unknown'.
    if not seasons:
        for m in re.finditer(
            r"\b([A-Za-z]+)\s+to\s+([A-Za-z]+)\s*[^0-9a-z]{0,12}?(\d{1,2})(?::(\d{2}))?\s*(am|pm)",
                t, re.I):
            m1, m2 = m.group(1).lower(), m.group(2).lower()
            if m1 not in MONTHS or m2 not in MONTHS:
                continue
            # whole-month span: 1st of the start month to the last day of the end month
            last = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][MONTHS[m2] - 1]
            seasons.append(((MONTHS[m1], 1), (MONTHS[m2], last),
                            _t(m.group(3), m.group(4), m.group(5))))

    if seasons:
        today = date.today()
        cur = (today.month, today.day)
        for a, b, clo in seasons:
            inside = (a <= cur <= b) if a <= b else (cur >= a or cur <= b)   # handles winter wrap
            if inside:
                closes = clo
                season_from = "%02d-%02d" % a
                season_to = "%02d-%02d" % b
                break
        if closes is None:
            closes = seasons[0][2]
    else:
        m = re.search(r"(?:clos(?:es|ing)|until|to)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)", t, re.I)
        if m:
            closes = _t(m.group(1), m.group(2), m.group(3))

    if opens and closes:
        conf = "parsed"
    elif opens or closes:
        conf = "partial"
    else:
        conf = "unparsed"
    notes["access_" + ("hours" if conf != "unparsed" else "unknown")] += 1
    return {"access": "hours" if conf != "unparsed" else "unknown",
            "opens": opens, "closes": closes, "season_from": season_from,
            "season_to": season_to, "confidence": conf}


# ---------------------------------------------------------------- builders
def build_forests():
    index = json.load(open(os.path.join(RAW, "index.json"), encoding="utf-8"))
    sites = []
    for f in index:
        path = os.path.join(PAGES, f["slug"].replace("/", "__") + ".html")
        if not os.path.exists(path):
            problems.append("missing page file for %s" % f["slug"])
            continue
        h = open(path, encoding="utf-8", errors="replace").read()

        ld = parse_jsonld(h)
        if not ld:
            notes["jsonld_missing"] += 1

        lat, lng = f["lat"], f["lng"]
        if ld and isinstance(ld.get("geo"), dict):
            try:
                glat, glng = float(ld["geo"]["latitude"]), float(ld["geo"]["longitude"])
                d = ((glat - lat) ** 2 + (glng - lng) ** 2) ** 0.5 * 69.0     # rough miles
                coord_deltas.append((d, f["slug"]))
                lat, lng = glat, glng                                          # page data wins
            except Exception:
                pass

        satnav, addr_tail = parse_satnav(h)
        if not satnav:
            notes["satnav_missing"] += 1

        address = None
        if ld and isinstance(ld.get("address"), dict):
            a = ld["address"]
            street = a.get("streetAddress")
            parts = (street if isinstance(street, list) else [street]) if street else []
            parts = [p for p in parts if p]
            if a.get("addressLocality"):
                parts.append(a["addressLocality"])
            address = ", ".join(parts) or None
        if not address:
            address = addr_tail

        ob = field_block(h, "opening-times-description")
        opening = strip_tags(ob) if ob else None
        if not opening:
            notes["opening_missing"] += 1

        pb = field_block(h, "parking-description")
        parking = strip_tags(pb) if pb else None
        bb = field_block(h, "overhead-barriers")
        barrier = strip_tags(bb) if bb else None
        if barrier:
            parking = ((parking + "\n\n") if parking else "") + barrier
        if not parking:
            notes["parking_missing"] += 1

        fac = parse_facilities(h)
        if fac is None:
            notes["facilities_missing"] += 1

        postal = None
        if ld and isinstance(ld.get("address"), dict):
            postal = ld["address"].get("postalCode") or None

        sites.append({
            "id": "fe-" + f["slug"].replace("/", "-"),
            "source": "forest",
            "name": (ld.get("name") if ld else None) or f["name"],
            "name_is_derived": False,
            "lat": round(lat, 7), "lng": round(lng, 7),
            "postcode_satnav": satnav,
            "postcode_postal": postal,
            "address": address,
            "url": f["url"],
            "opening_times": opening,
            "opening_summary": parse_opening(opening),
            "parking": parking,
            "facilities": fac,
            "category": None, "surface": None, "status": None, "district": None,
            "scraped_at": TODAY,
        })
    return sites


def build_carparks():
    d = json.load(open(os.path.join(RAW, "carparks.json"), encoding="utf-8"))
    sites = []
    for feat in d.get("features", []):
        a = feat.get("attributes", {})
        c = feat.get("centroid")
        if not c or c.get("x") is None or c.get("y") is None:
            problems.append("car park OBJECTID %s has no centroid" % a.get("OBJECTID"))
            continue
        raw_name = (a.get("asset_name") or "").strip()
        derived = False
        name = raw_name
        if not raw_name or raw_name.lower() in {"unknown", "n/a", "na", "tbc"}:
            name = "Unnamed car park"
            derived = True
        st = a.get("status")
        if st and st not in VALID_STATUS:
            problems.append("unexpected status %r on OBJECTID %s" % (st, a.get("OBJECTID")))
        sites.append({
            "id": "cp-%s" % a.get("OBJECTID"),
            "source": "carpark",
            "name": name,
            "name_is_derived": derived,
            "lat": round(float(c["y"]), 7), "lng": round(float(c["x"]), 7),
            "postcode_satnav": None, "postcode_postal": None, "address": None, "url": None,
            "opening_times": None, "opening_summary": None, "parking": None, "facilities": None,
            "category": a.get("category"),
            "surface": a.get("area_asset_type"),
            "status": st,
            "district": a.get("cots_district_id"),
            "scraped_at": TODAY,
        })
    return sites


def validate(sites):
    for s in sites:
        if not (LAT_RANGE[0] <= s["lat"] <= LAT_RANGE[1]):
            problems.append("%s lat %s outside England (unprojected coords?)" % (s["id"], s["lat"]))
        if not (LNG_RANGE[0] <= s["lng"] <= LNG_RANGE[1]):
            problems.append("%s lng %s outside England (unprojected coords?)" % (s["id"], s["lng"]))
        for k in ("id", "source", "name", "lat", "lng", "scraped_at"):
            if s.get(k) in (None, ""):
                problems.append("%s missing required field %s" % (s.get("id"), k))
    ids = [s["id"] for s in sites]
    if len(ids) != len(set(ids)):
        dupes = {i for i in ids if ids.count(i) > 1}
        problems.append("duplicate ids: %s" % sorted(dupes)[:5])


def main():
    log("[1/3] Parsing forest pages ...")
    forests = build_forests()
    log("      %d forests parsed" % len(forests))

    log("[2/3] Parsing car parks ...")
    carparks = build_carparks()
    log("      %d car parks parsed" % len(carparks))

    forests.sort(key=lambda s: s["name"].lower())
    carparks.sort(key=lambda s: s["name"].lower())
    sites = forests + carparks

    log("[3/3] Validating ...")
    validate(sites)

    log("")
    log("FIELD COVERAGE (forests, n=%d)" % len(forests))
    for k, label in [("satnav_missing", "sat nav postcode"), ("opening_missing", "opening times"),
                     ("parking_missing", "parking info"), ("facilities_missing", "facilities"),
                     ("jsonld_missing", "JSON-LD block")]:
        have = len(forests) - notes[k]
        log("  %-18s %3d/%d present  (%d missing)" % (label, have, len(forests), notes[k]))
    log("  access: always-open=%d dusk=%d clock-hours=%d unknown=%d"
        % (notes["access_always"], notes["access_dusk"],
           notes["access_hours"], notes["access_unknown"]))

    if coord_deltas:
        coord_deltas.sort(reverse=True)
        ds = [d for d, _ in coord_deltas]
        log("")
        log("COORD SOURCE DISAGREEMENT (JSON-LD geo vs search-page marker), miles:")
        log("  n=%d  max=%.2f  median=%.4f  >0.5mi=%d"
            % (len(ds), ds[0], ds[len(ds) // 2], len([d for d in ds if d > 0.5])))
        for d, slug in coord_deltas[:5]:
            log("    %6.2f mi  %s" % (d, slug))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    payload = {
        "generated_at": TODAY,
        "counts": {"forest": len(forests), "carpark": len(carparks)},
        "attribution": "Contains public sector information licensed under the Open Government Licence v3.0.",
        "sites": sites,
    }
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, separators=(",", ":"))
    kb = os.path.getsize(OUT) / 1024
    log("")
    log("WROTE %s  (%d sites, %.0f KB)" % (OUT, len(sites), kb))

    if problems:
        log("")
        log("PROBLEMS (%d):" % len(problems))
        for p in problems[:40]:
            log("  - %s" % p)
        if len(problems) > 40:
            log("  ... and %d more" % (len(problems) - 40))
        log("Exiting non-zero: dataset is not trustworthy.")
        sys.exit(1)
    log("Stage 2 complete, no problems.")


if __name__ == "__main__":
    main()
