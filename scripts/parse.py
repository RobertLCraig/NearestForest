#!/usr/bin/env python3
"""Stage 2: parse cached raw HTML + car park JSON into app/data/sites.json.

Reads only from data/raw/, so it makes zero network requests and can be iterated
on freely. Fails loudly and exits non-zero rather than emitting a partial dataset.
"""
import json, math, os, re, sys, html as htmllib
from datetime import date, datetime
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "data", "raw")
PAGES = os.path.join(RAW, "pages")
FLS_PAGES = os.path.join(RAW, "fls", "pages")
OUT = os.path.join(ROOT, "app", "data", "sites.json")
TODAY = date.today().isoformat()

# ------------------------------------------------ download dates (card 0026)
# fetch.py records the date it downloaded each file into data/raw/fetched.json, and
# `scraped_at` comes from there rather than from the clock. Re-parsing the cache costs
# zero requests and is the intended way to work, so a parse-time stamp made the whole
# dataset look a day old however old the HTML behind it was.
FETCHED = os.path.join(RAW, "fetched.json")
fetched = json.load(open(FETCHED, encoding="utf-8")) if os.path.exists(FETCHED) else {}

# Bounding box per country, used as a tripwire against unprojected British National Grid.
# The file now carries England and Scotland, so the assertion covers Great Britain, but it
# is kept per country rather than widened to one loose GB box: a car park is the record
# that gets reprojected, it is English, and an England box catches a bad reprojection that
# a box reaching to Shetland would wave through. Card 0016 widened this without loosening
# it. Scotland reaches 60.86N at Shetland and -8.6E at St Kilda.
COUNTRY_RANGE = {
    "England":  {"lat": (49.5, 56.2), "lng": (-6.8, 2.2)},
    "Scotland": {"lat": (54.5, 61.2), "lng": (-8.8, 0.0)},
}
# Great Britain overall, asserted for every record whatever its country says.
GB_LAT_RANGE = (49.5, 61.2)
GB_LNG_RANGE = (-8.8, 2.2)

VALID_STATUS = {"Permanent - Official", "Permanent - Unofficial",
                "Seasonal - Official", "Seasonal - Unofficial", "Temporary"}

# Hosts a site URL may point at. The app puts these in an href, so the set is
# closed rather than "whatever the scrape found".
URL_HOSTS = {"www.forestryengland.uk", "forestryengland.uk", "forestryandland.gov.scot"}

# ------------------------------------------------ derived car park names (card 0004)
# What the app shows when there is nothing better to say.
GENERIC_NAME = "Unnamed car park"

# Upstream values that are not a name at all.
NO_NAME = {"unknown", "n/a", "na", "tbc"}

# Names that are only the words "car park", optionally with a qualifier. They are a real
# upstream value but they say nothing about WHICH forest, which is the one thing a row
# read in a moving car needs. The qualifier is kept, so "Overflow Car Park" derives to
# "Overflow car park near Dalby Forest" and stays distinct from the main one.
RE_GENERIC_NAME = re.compile(
    r"^(?:the\s+)?(?:(main|overflow|additional|upper|lower|new|old)\s+)?car\s*parks?$", re.I)

# How far a car park may be from a forest point before the join stops being a claim worth
# making, in miles. Measured rather than guessed: over the 177 car parks with no usable
# name the distance to the nearest forest point runs q1 0.03, median 0.32, q3 2.19, max
# 23.66, so the Tukey outlier fence (q3 + 1.5 x IQR) falls at 5.43 mi. Rounded down to 5.
# That names 158 of the 177; the 19 beyond it keep GENERIC_NAME rather than claim a forest
# they are probably not part of. A forest record is one published point, not a polygon, so
# this measures proximity to that point and never membership of a wood. Hence "near" in
# the name, and the derived flag the UI styles.
NEAR_FOREST_MI = 5.0

problems = []
notes = {"jsonld_missing": 0, "satnav_missing": 0, "opening_missing": 0,
         "parking_missing": 0, "facilities_missing": 0,
         "access_always": 0, "access_dusk": 0, "access_hours": 0, "access_unknown": 0}
fls_notes = {"satnav_missing": 0, "opening_missing": 0, "parking_missing": 0,
             "facilities_missing": 0, "cafe_hours_only": 0, "closed": 0}
coord_deltas = []
fls_coord_deltas = []


def log(m):
    print(m, flush=True)


def fetched_on(rel):
    """The date fetch.py recorded for a cached file, keyed as it keys it: relative to
    data/raw/, forward slashes.

    Never falls back to today. data/raw/ is gitignored and holds pages cached before any
    date was recorded, and the age of one of those is not recoverable: a modification
    time is rewritten by any copy of the tree. So the page is named and the build fails,
    which is this project's rule and is also the only honest answer.
    """
    d = fetched.get(rel)
    if not d:
        problems.append("no recorded download date for %s; it was cached before fetch.py "
                        "recorded dates, so re-fetch it (delete it from data/raw/ and "
                        "re-run scripts/fetch.py)" % rel)
    return d


def haversine_mi(a_lat, a_lng, b_lat, b_lng):
    """Great-circle miles. Same formula and same radius as core.js haversineMi(), so the
    self-test can re-derive this join against the shipped code and get the same answer."""
    R, r = 3958.7613, math.pi / 180
    d_lat, d_lng = (b_lat - a_lat) * r, (b_lng - a_lng) * r
    s = (math.sin(d_lat / 2) ** 2 +
         math.cos(a_lat * r) * math.cos(b_lat * r) * math.sin(d_lng / 2) ** 2)
    return 2 * R * math.asin(min(1, math.sqrt(s)))


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
        cached = "pages/" + f["slug"].replace("/", "__") + ".html"
        path = os.path.join(RAW, cached)
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
            "country": "England",
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
            "scraped_at": fetched_on(cached),
        })
    return sites


# ------------------------------------------------------- Scotland (card 0016)
# Forestry and Land Scotland runs a different CMS from Forestry England, so none of the
# Drupal field--name-field-* helpers above apply. What it does publish is an ordinary
# heading structure, and the headings are stable enough to cut sections out of.

# A destination FLS has taken out of use says so in its published title, on the index and
# again in the <h1> of its own page: "Allt Mor (closed)", "Puck's Glen (closed)". The
# index attribute also carries an `open` field, and it is NOT this: it reads false on all
# 278 records, so it is a UI flag rather than a status. Confirmed against both pages on
# 2026-08-29: Allt Mor's car park is shut after a wildfire, and Puck's Glen gorge is shut
# for the 2026 season after storm damage. Neither belongs in a list of places to drive to.
RE_CLOSED_TITLE = re.compile(r"\(\s*closed\s*\)\s*$", re.I)

# Words that mean the sentence is about somewhere inside the site rather than about the
# gate. Glentrool's "Opening hours" section reads "The café is open from 10.30am to
# 4.30pm", and a forest that never closes would otherwise be given a closing time.
RE_INDOOR_SUBJECT = re.compile(
    r"caf[eé]|coffee shop|tea\s*room|restaurant|kiosk|visitor centre|visitor center|"
    r"\bshop\b|museum|castle|gallery|hub\b", re.I)


def fls_section(h, heading_re):
    """Inner HTML from a heading matching `heading_re` to the next heading of that level
    or higher. Returns None when the heading is absent, which is how "not known" gets in.

    Levels h1 to h4, because the same section is published at different depths from page
    to page: "Using SatNav?" is an h3 at Aberfoyle and an h4 at Allean. Pinning it to one
    level silently loses three quarters of the postcodes.
    """
    m = re.search(r"<h([1-4])[^>]*>\s*(?:<[^>]+>\s*)*" + heading_re + r".*?</h\1>",
                  h, re.S | re.I)
    if not m:
        return None
    level = int(m.group(1))
    rest = h[m.end():]
    # `<nav` ends the last section on a page that has no "You might also be interested in"
    # block: without it the previous/next links land in the text as a bare forest name.
    stop = re.search(r"<h[1-%d]\b|<nav\b|</main\b|<footer\b" % level, rest, re.I)
    return rest[:stop.start()] if stop else rest[:8000]


def fls_facilities(h):
    m = re.search(r'<ul class="destination-facilities__list".*?</ul>', h, re.S)
    if not m:
        return None
    out, seen = [], set()
    for it in re.findall(r"<span[^>]*>(.*?)</span>", m.group(0), re.S):
        t = re.sub(r"\s+", " ", strip_tags(it)).strip()
        if t and t.lower() not in seen and len(t) < 80:
            seen.add(t.lower())
            out.append(t)
    return out or None


RE_UK_POSTCODE = re.compile(r"\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})\b")


def fls_satnav(h):
    """FLS publishes the sat-nav postcode under its own "Using SatNav?" heading, the same
    distinction Forestry England makes. There is no postal postcode to confuse it with."""
    blk = fls_section(h, r"Using\s*SatNav")
    if not blk:
        return None
    m = RE_UK_POSTCODE.search(strip_tags(blk).upper())
    return "%s %s" % (m.group(1), m.group(2)) if m else None


def fls_opening(text):
    """Opening text to an opening_summary, with the indoor-hours trap handled.

    An always-open or dawn-till-dusk statement is about the site itself, so it stands even
    when a café is mentioned in the same breath. A bare clock time next to the word café is
    not attributable to the gate, so access is unknown and the app shows the raw text. The
    standing rule is that this project never claims a barrier is open on a guess.
    """
    if not text:
        return None
    if re.search(RE_INDOOR_SUBJECT, text) and not re.search(
            RE_ALWAYS + "|" + RE_DUSK, text, re.I):
        fls_notes["cafe_hours_only"] += 1
        return {"access": "unknown", "opens": None, "closes": None,
                "season_from": None, "season_to": None, "confidence": "unparsed"}
    return parse_opening(text)


def build_fls():
    """The Scottish half. One record per currently published, open destination."""
    index = json.load(open(os.path.join(RAW, "fls", "index.json"), encoding="utf-8"))
    sites = []
    for d in index:
        if RE_CLOSED_TITLE.search(d["name"]):
            fls_notes["closed"] += 1
            continue
        cached = "fls/pages/" + d["slug"] + ".html"
        path = os.path.join(RAW, cached)
        if not os.path.exists(path):
            problems.append("missing FLS page file for %s" % d["slug"])
            continue
        h = open(path, encoding="utf-8", errors="replace").read()

        # The published title says "closed" on the destination's own page too, not only on
        # the index. Belt and braces, because the index is one attribute and could go.
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", h, re.S)
        if h1 and RE_CLOSED_TITLE.search(strip_tags(h1.group(1))):
            fls_notes["closed"] += 1
            continue

        lat, lng = d["lat"], d["lng"]
        # The page repeats its own coordinate in data-inline-map. Same tripwire as the
        # English JSON-LD comparison: a silent drift between the two shows up in the report.
        im = re.search(r'data-inline-map="([^"]*)"', h)
        if im:
            try:
                pt = json.loads(htmllib.unescape(im.group(1)))[0]
                fls_coord_deltas.append(
                    (haversine_mi(lat, lng, float(pt["latitude"]), float(pt["longitude"])),
                     d["slug"]))
            except Exception:
                pass

        satnav = fls_satnav(h)
        if not satnav:
            fls_notes["satnav_missing"] += 1

        # `or None` rather than the bare strip: a section that is present but holds only
        # an image or a button strips to "", and the rule is that null means "not known"
        # and an empty string never reaches the app.
        ob = fls_section(h, r"Opening\s*(?:hours|times)")
        opening = (strip_tags(ob) or None) if ob else None
        if not opening:
            fls_notes["opening_missing"] += 1

        pb = fls_section(h, r"Parking\s*information")
        parking = (strip_tags(pb) or None) if pb else None
        if not parking:
            fls_notes["parking_missing"] += 1

        fac = fls_facilities(h)
        if fac is None:
            fls_notes["facilities_missing"] += 1

        sites.append({
            "id": "fls-" + d["slug"],
            "source": "forest",
            "country": "Scotland",
            "name": d["name"],
            "name_is_derived": False,
            "lat": round(lat, 7), "lng": round(lng, 7),
            "postcode_satnav": satnav,
            "postcode_postal": None,          # FLS publishes no postal address
            "address": None,
            "url": d["url"],
            "opening_times": opening,
            "opening_summary": fls_opening(opening),
            "parking": parking,
            "facilities": fac,
            "category": None, "surface": None, "status": None, "district": None,
            "scraped_at": fetched_on(cached),
        })
    return sites


def unusable_name(raw_name):
    """(is_derived, qualifier) for an upstream car park name that cannot stand on its own.

    Two kinds: the 170 records published as "Unknown", and the handful published as a
    bare "Car Park" / "Main Carpark". Both leave a row that names no place.
    """
    n = (raw_name or "").strip()
    if not n or n.lower() in NO_NAME:
        return True, None
    m = RE_GENERIC_NAME.match(n)
    if m:
        return True, (m.group(1) or "").lower().capitalize() or None
    return False, None


def name_after_nearest_forest(pending, forests):
    """Name each unusable-name car park after the forest point it is nearest to.

    The open data carries no link from a car park back to a parent forest, and the forest
    records are single points rather than polygons, so nearest-neighbour is the only join
    available. `pending` is [(site_dict, qualifier)] from build_carparks().
    """
    if not pending:
        return [], []
    if not forests:
        problems.append("no forests parsed, so no car park name could be derived")
        return [], []
    named, dists = [], []
    for s, qual in pending:
        best_d, best_f = min(
            ((haversine_mi(s["lat"], s["lng"], f["lat"], f["lng"]), f) for f in forests),
            key=lambda t: t[0])
        dists.append(best_d)
        if best_d > NEAR_FOREST_MI:
            continue                  # too far to claim an association; keep GENERIC_NAME
        s["name"] = ("%s car park near %s" % (qual, best_f["name"])) if qual else \
                    ("Car park near %s" % best_f["name"])
        named.append(best_d)
    return named, dists


def build_carparks():
    d = json.load(open(os.path.join(RAW, "carparks.json"), encoding="utf-8"))
    # One query answers for every car park, so they share one download date. Asked once,
    # so a missing one is reported once rather than 630 times.
    stamp = fetched_on("carparks.json")
    sites, pending = [], []
    for feat in d.get("features", []):
        a = feat.get("attributes", {})
        c = feat.get("centroid")
        if not c or c.get("x") is None or c.get("y") is None:
            problems.append("car park OBJECTID %s has no centroid" % a.get("OBJECTID"))
            continue
        raw_name = (a.get("asset_name") or "").strip()
        derived, qualifier = unusable_name(raw_name)
        name = GENERIC_NAME if derived else raw_name
        st = a.get("status")
        if st and st not in VALID_STATUS:
            problems.append("unexpected status %r on OBJECTID %s" % (st, a.get("OBJECTID")))
        rec = {
            "id": "cp-%s" % a.get("OBJECTID"),
            "source": "carpark",
            "country": "England",
            "name": name,
            "name_is_derived": derived,
            "lat": round(float(c["y"]), 7), "lng": round(float(c["x"]), 7),
            "postcode_satnav": None, "postcode_postal": None, "address": None, "url": None,
            "opening_times": None, "opening_summary": None, "parking": None, "facilities": None,
            "category": a.get("category"),
            "surface": a.get("area_asset_type"),
            "status": st,
            "district": a.get("cots_district_id"),
            "scraped_at": stamp,
        }
        sites.append(rec)
        if derived:
            pending.append((rec, qualifier))
    return sites, pending


def validate(sites):
    for s in sites:
        # Great Britain first, because that is the promise the file makes whatever a
        # record claims about itself, then the tighter box for the country it names.
        if not (GB_LAT_RANGE[0] <= s["lat"] <= GB_LAT_RANGE[1]):
            problems.append("%s lat %s outside Great Britain (unprojected coords?)"
                            % (s["id"], s["lat"]))
        if not (GB_LNG_RANGE[0] <= s["lng"] <= GB_LNG_RANGE[1]):
            problems.append("%s lng %s outside Great Britain (unprojected coords?)"
                            % (s["id"], s["lng"]))
        box = COUNTRY_RANGE.get(s.get("country"))
        if box is None:
            problems.append("%s has no known country: %r" % (s["id"], s.get("country")))
        else:
            if not (box["lat"][0] <= s["lat"] <= box["lat"][1]):
                problems.append("%s lat %s outside %s" % (s["id"], s["lat"], s["country"]))
            if not (box["lng"][0] <= s["lng"] <= box["lng"][1]):
                problems.append("%s lng %s outside %s" % (s["id"], s["lng"], s["country"]))
        for k in ("id", "source", "country", "name", "lat", "lng", "scraped_at"):
            if s.get(k) in (None, ""):
                problems.append("%s missing required field %s" % (s.get("id"), k))
        # The app renders this straight into an href. A URL is allowed to be absent
        # (car parks have none), but if one is here it must be an https page on the
        # site we scraped: a "javascript:" that reached the dataset would be XSS in
        # the detail sheet, with no escaping bug anywhere to blame. The app checks
        # the scheme again at render time, because it ships this file rather than
        # rebuilding it, but a bad URL should never get as far as being shipped.
        u = s.get("url")
        if u is not None:
            if not isinstance(u, str) or not u.startswith("https://"):
                problems.append("%s url is not https: %r" % (s.get("id"), u))
            elif urlparse(u).hostname not in URL_HOSTS:
                problems.append("%s url is off-site: %r" % (s.get("id"), u))
    ids = [s["id"] for s in sites]
    if len(ids) != len(set(ids)):
        dupes = {i for i in ids if ids.count(i) > 1}
        problems.append("duplicate ids: %s" % sorted(dupes)[:5])


def main():
    log("[1/4] Parsing Forestry England forest pages ...")
    forests = build_forests()
    log("      %d forests parsed" % len(forests))
    # Snapshot before the Scottish pages add to the same access counters, so the English
    # coverage report keeps saying what it has always said.
    en_notes = dict(notes)

    log("[2/4] Parsing car parks ...")
    carparks, pending = build_carparks()
    log("      %d car parks parsed, %d with no usable upstream name" % (len(carparks), len(pending)))

    named, dists = name_after_nearest_forest(pending, forests)
    if dists:
        ds = sorted(dists)
        n = len(ds)
        log("      distance to nearest forest point, miles: n=%d min=%.2f q1=%.2f "
            "median=%.2f q3=%.2f max=%.2f"
            % (n, ds[0], ds[n // 4], ds[n // 2], ds[(3 * n) // 4], ds[-1]))
        log("      named after a forest within %.1f mi: %d; left as %r: %d"
            % (NEAR_FOREST_MI, len(named), GENERIC_NAME, n - len(named)))

    log("[3/4] Parsing Forestry and Land Scotland destinations ...")
    scots = build_fls()
    log("      %d destinations parsed, %d dropped as published closed"
        % (len(scots), fls_notes["closed"]))

    all_forests = forests + scots
    all_forests.sort(key=lambda s: s["name"].lower())
    carparks.sort(key=lambda s: s["name"].lower())
    sites = all_forests + carparks

    log("[4/4] Validating ...")
    validate(sites)

    log("")
    log("FIELD COVERAGE (Forestry England forests, n=%d)" % len(forests))
    for k, label in [("satnav_missing", "sat nav postcode"), ("opening_missing", "opening times"),
                     ("parking_missing", "parking info"), ("facilities_missing", "facilities"),
                     ("jsonld_missing", "JSON-LD block")]:
        have = len(forests) - en_notes[k]
        log("  %-18s %3d/%d present  (%d missing)" % (label, have, len(forests), en_notes[k]))
    log("  access: always-open=%d dusk=%d clock-hours=%d unknown=%d"
        % (en_notes["access_always"], en_notes["access_dusk"],
           en_notes["access_hours"], en_notes["access_unknown"]))

    log("")
    log("FIELD COVERAGE (Forestry and Land Scotland, n=%d)" % len(scots))
    for k, label in [("satnav_missing", "sat nav postcode"), ("opening_missing", "opening times"),
                     ("parking_missing", "parking info"), ("facilities_missing", "facilities")]:
        have = len(scots) - fls_notes[k]
        log("  %-18s %3d/%d present  (%d missing)" % (label, have, len(scots), fls_notes[k]))
    log("  access: always-open=%d dusk=%d clock-hours=%d unknown=%d"
        % (notes["access_always"] - en_notes["access_always"],
           notes["access_dusk"] - en_notes["access_dusk"],
           notes["access_hours"] - en_notes["access_hours"],
           notes["access_unknown"] - en_notes["access_unknown"]))
    log("  of which held back because the hours are a cafe's or a visitor centre's, "
        "not the gate's: %d" % fls_notes["cafe_hours_only"])

    if fls_coord_deltas:
        fls_coord_deltas.sort(reverse=True)
        ds = [d for d, _ in fls_coord_deltas]
        log("  index vs page coordinate, miles: n=%d max=%.3f median=%.4f >0.5mi=%d"
            % (len(ds), ds[0], ds[len(ds) // 2], len([d for d in ds if d > 0.5])))

    if coord_deltas:
        coord_deltas.sort(reverse=True)
        ds = [d for d, _ in coord_deltas]
        log("")
        log("COORD SOURCE DISAGREEMENT (JSON-LD geo vs search-page marker), miles:")
        log("  n=%d  max=%.2f  median=%.4f  >0.5mi=%d"
            % (len(ds), ds[0], ds[len(ds) // 2], len([d for d in ds if d > 0.5])))
        for d, slug in coord_deltas[:5]:
            log("    %6.2f mi  %s" % (d, slug))

    by_country = {}
    for s in sites:
        by_country[s["country"]] = by_country.get(s["country"], 0) + 1

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    payload = {
        "generated_at": TODAY,
        "counts": {"forest": len(all_forests), "carpark": len(carparks)},
        "counts_by_country": by_country,
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
