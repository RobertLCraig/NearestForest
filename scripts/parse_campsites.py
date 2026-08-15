#!/usr/bin/env python3
"""Stage 2b: normalise the campsite sources into app/data/campsites.json.

Kept in its own file, separate from sites.json, and that separation is load-bearing
rather than tidy-mindedness. OSM is ODbL and the other two sources are OGL. ODbL 1.0
section 4.5(a) exempts a "Collective Database" -- independent databases assembled into
a collective whole -- from share-alike, while a single merged file invites the argument
that the OGL data became a derivative of the ODbL one. Two files, two licence blocks.
Do not merge them. See docs/DECISIONS.md 2026-08-15.

What survives the filter, decided by Rob on 2026-08-15: a site is listed only if it is
NAMED and EXPLICITLY takes a caravan or a motorhome. A campervan being turned away at
a gate is the failure this tab exists to prevent, and a list read while driving is worth
more short and recognisable than long and speculative.
"""
import json, os, re, sys, math
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OSM_DIR = os.path.join(ROOT, "data", "raw", "osm")
FLS_DIR = os.path.join(ROOT, "data", "raw", "fls")
OUT = os.path.join(ROOT, "app", "data", "campsites.json")

COUNTRIES = [("England", "gb-eng"), ("Scotland", "gb-sct"), ("Wales", "gb-wls")]

# Great Britain, not England. Widened from parse.py's England box because Scotland and
# Wales are in scope now; NOT removed, because it is the tripwire that catches an
# unprojected British National Grid coordinate before it ships. Shetland is 60.9N and
# the Isles of Scilly are 49.9N, so this is snug rather than generous.
LAT_RANGE = (49.5, 61.2)
LNG_RANGE = (-8.8, 2.2)

# Operators and brand names whose sites are static-caravan holiday parks. You cannot
# pull a campervan onto a static pitch, and these are the loudest false positives in
# the source: Parkdean alone is 58 records.
STATIC_BRANDS = ("parkdean", "haven holiday", "haven ", "park holidays", "royale resort",
                 "away resorts", "john fowler", "darwin escapes", "coastal holidays",
                 "static caravan")

FLS_STN_NOTE = ("Forestry and Land Scotland 'Stay the Night': overnight parking only, "
                "6pm to 10am, no return within 48 hours. Self-contained motorhomes and "
                "campervans only, so no tents and no toilet set up beside the vehicle. "
                "First come, first served.")

problems = []
notes = {"seen": 0, "unnamed": 0, "no_rv": 0, "private": 0, "scout": 0, "static": 0,
         "no_coord": 0, "bad_url": 0, "stn_merged": 0, "cross_border": 0, "same_site": 0}

# Five decimal places is ~1.1 m. sites.json keeps 7 because those coordinates are
# published points; most of these are the centroid of a hand-drawn polygon, so digits
# six and seven would be precision this data does not have. Keeping them cost 40 KB.
DP = 5


def compact(rec):
    """Drop keys that are null or empty before writing.

    The app reads an absent key and a null key identically -- every consumer tests
    `value == null` or truthiness -- and at 3,700 records the nulls were 60% of the
    file. Documented in DATA-MODEL: in campsites.json, an absent key means "not known",
    which is the same contract sites.json states with an explicit null.
    """
    return {k: v for k, v in rec.items() if v is not None and v != [] and v is not False}


def log(msg):
    print(msg, flush=True)


def centroid(el):
    if el["type"] == "node":
        return el.get("lat"), el.get("lon")
    c = el.get("center") or {}
    return c.get("lat"), c.get("lon")


def haversine_mi(a_lat, a_lng, b_lat, b_lng):
    r = 3958.7613
    p1, p2 = math.radians(a_lat), math.radians(b_lat)
    dp = p2 - p1
    dl = math.radians(b_lng - a_lng)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def looks_static(tags):
    if tags.get("permanent_camping") == "only":
        return True
    blob = " ".join([tags.get("operator", ""), tags.get("name", "")]).lower()
    return any(b in blob for b in STATIC_BRANDS)


def takes_a_van(tags):
    """Explicit only. An untagged camp_site is not evidence that a van can get in."""
    if tags.get("caravans") == "no" and tags.get("motorhome") == "no":
        return False
    if tags.get("tents") == "only" or tags.get("backcountry") == "yes":
        return False
    if tags.get("tourism") == "caravan_site":
        return tags.get("caravans") != "no"
    return tags.get("caravans") == "yes" or tags.get("motorhome") == "yes"


def safe_url(u):
    """A campsite's own website, from a source anybody may edit. The app renders this
       into an href, so the scheme is checked here as well as at render time. Anything
       that is not a plain https URL is dropped, and the record is kept without it."""
    if not u:
        return None
    u = u.strip()
    if len(u) > 300 or "@" in u or any(c in u for c in " <>\"'\\\n\r\t"):
        return None
    if not u.startswith("https://"):
        # Plenty of small campsites are still http. Upgrade rather than drop: the link
        # is opened in a browser, which will redirect or warn, and dropping it loses
        # the only contact detail many of these records have.
        if u.startswith("http://"):
            u = "https://" + u[len("http://"):]
        else:
            return None
    p = urlparse(u)
    if not p.hostname or "." not in p.hostname:
        return None
    return u


# OSM tag -> the facility label the app already renders as a tag chip.
FACILITY_TAGS = [
    ("toilets", ("yes", "customers"), "toilets"),
    ("shower", ("yes", "hot", "cold", "customers"), "showers"),
    ("drinking_water", ("yes",), "drinking water"),
    ("power_supply", ("yes", "cee_17_blue"), "electric hook-up"),
    ("sanitary_dump_station", ("yes", "customers"), "chemical disposal"),
    ("waste_disposal", ("yes",), "waste disposal"),
    ("internet_access", ("wlan", "yes", "terminal"), "wifi"),
    ("laundry", ("yes",), "laundry"),
    ("bbq", ("yes",), "bbq"),
    ("openfire", ("yes",), "campfires allowed"),
]

ACCESS_NOTE = {
    "customers": "Customers only",
    "permit": "Permit needed",
    "members": "Members only",
    "permissive": "Permissive access",
}


def vehicles_for(tags):
    v = []
    if tags.get("caravans") == "yes" or (tags.get("tourism") == "caravan_site"
                                         and tags.get("caravans") != "no"):
        v.append("caravans")
    if tags.get("motorhome") in ("yes", "designated"):
        v.append("motorhomes")
    if tags.get("tents") in ("yes", "only"):
        v.append("tents")
    return v


def fee_text(tags):
    f = tags.get("fee")
    if f is None:
        return None
    if f == "yes":
        return "Charges apply"
    if f == "no":
        return "Free"
    return f            # some records publish the actual price; pass it through as published


def build_osm():
    sites, scraped, seen_ids = [], {}, {}
    for country, iso in COUNTRIES:
        path = os.path.join(OSM_DIR, "campsites-%s.json" % iso)
        if not os.path.exists(path):
            problems.append("missing raw file %s; run scripts/fetch_campsites.py first" % path)
            continue
        raw = json.load(open(path, encoding="utf-8"))
        # The records' age is OSM's own snapshot time, not the day we happened to run.
        stamp = (raw.get("osm3s", {}).get("timestamp_osm_base") or "")[:10] or None
        scraped[country] = stamp
        kept = 0
        for el in raw.get("elements", []):
            notes["seen"] += 1
            tags = el.get("tags") or {}
            lat, lng = centroid(el)
            if lat is None or lng is None:
                notes["no_coord"] += 1
                continue
            # A site sitting on the England/Wales border comes back from both country
            # queries. Same OSM id, so first country wins and the second is counted
            # rather than shipped twice under one id.
            oid = "os-%s%s" % (el["type"][0], el["id"])
            if oid in seen_ids:
                notes["cross_border"] += 1
                continue
            seen_ids[oid] = country

            name = (tags.get("name") or "").strip()
            if not name:
                notes["unnamed"] += 1
                continue
            if not takes_a_van(tags):
                notes["no_rv"] += 1
                continue
            if tags.get("access") in ("private", "no"):
                notes["private"] += 1
                continue
            if tags.get("scout") in ("yes", "only") or tags.get("group_only") == "yes":
                notes["scout"] += 1
                continue
            if looks_static(tags):
                notes["static"] += 1
                continue

            url = safe_url(tags.get("website") or tags.get("contact:website"))
            if (tags.get("website") or tags.get("contact:website")) and not url:
                notes["bad_url"] += 1

            facilities = []
            for key, good, label in FACILITY_TAGS:
                if tags.get(key) in good:
                    facilities.append(label)
            if tags.get("dog") in ("yes", "leashed", "unleashed"):
                facilities.append("dogs welcome")

            addr = " ".join(x for x in [tags.get("addr:housenumber"), tags.get("addr:street"),
                                        tags.get("addr:city")] if x).strip()

            sites.append({
                "id": oid,
                "source": "campsite",
                "name": name,
                "name_is_derived": False,
                "lat": round(float(lat), DP), "lng": round(float(lng), DP),
                "postcode_satnav": tags.get("addr:postcode"),
                "postcode_postal": None,
                "address": addr or None,
                "url": url,
                # 96 of 8,496 records publish any hours at all, so this is almost always
                # null and the app must never show an open/closed badge on a campsite.
                "opening_times": tags.get("opening_hours"),
                "opening_summary": None,
                "parking": fee_text(tags),
                "facilities": facilities,
                "category": "Caravan site" if tags.get("tourism") == "caravan_site" else "Campsite",
                "surface": None,
                "status": None,
                "district": None,
                "country": country,
                "vehicles": vehicles_for(tags),
                "access_note": ACCESS_NOTE.get(tags.get("access")),
                "operator": tags.get("operator"),
                "phone": tags.get("phone") or tags.get("contact:phone"),
                "stay_the_night": False,
                "scraped_at": stamp,
            })
            kept += 1
        log("      %-8s %5d elements -> %4d kept   (osm snapshot %s)"
            % (country, len(raw.get("elements", [])), kept, stamp))
    return sites, scraped


def build_stn():
    """Forestry and Land Scotland's Stay the Night car parks."""
    path = os.path.join(FLS_DIR, "stay-the-night.json")
    if not os.path.exists(path):
        problems.append("missing %s; run scripts/fetch_campsites.py first" % path)
        return []
    raw = json.load(open(path, encoding="utf-8"))
    out = []
    for d in raw:
        out.append({
            "id": "fls-stn-%s" % d["slug"],
            "source": "campsite",
            "name": "%s (Stay the Night)" % d["name"],
            "name_is_derived": False,
            "lat": round(float(d["lat"]), DP), "lng": round(float(d["lng"]), DP),
            "postcode_satnav": None, "postcode_postal": None, "address": None,
            "url": d["url"],
            "opening_times": "Overnight parking 6pm to 10am only.",
            "opening_summary": None,
            "parking": FLS_STN_NOTE,
            "facilities": [],
            "category": "Forest car park",
            "surface": None, "status": None, "district": None,
            "country": "Scotland",
            "vehicles": ["motorhomes"],
            "access_note": "Self-contained vehicles only",
            "operator": "Forestry and Land Scotland",
            "phone": None,
            "stay_the_night": True,
            "scraped_at": None,
        })
    return out


def dedupe_same_site(sites):
    """One campsite mapped twice: as a node and again as the area around it.

    Both survive the filter with different OSM ids, so the id check cannot see them,
    and the result is the same name twice in a row in a list read while driving. It
    was visible immediately: Housedean Farm Campsite was the nearest and the second
    nearest to Brighton.

    THRESHOLD_MI comes from the distribution, not from taste. Across the 153 pairs
    sharing a name, 47 sit within 0.3 mi, one at 0.38, one at 0.55, then the next is
    1.43 mi and the rest are tens of miles apart. Half a mile sits inside that gap:
    wide enough for a big holiday park's node and its polygon centroid, far short of
    two genuinely different sites that happen to share a name.
    """
    THRESHOLD_MI = 0.5
    groups = {}
    for s in sites:
        groups.setdefault(s["name"].strip().lower(), []).append(s)

    keep = []
    for name, g in groups.items():
        if len(g) == 1:
            keep.append(g[0])
            continue
        # Richest record wins, so the merge never loses a postcode or a website.
        g.sort(key=lambda s: (-sum(1 for v in s.values() if v not in (None, [], False)), s["id"]))
        chosen = []
        for s in g:
            twin = next((c for c in chosen
                         if haversine_mi(s["lat"], s["lng"], c["lat"], c["lng"]) < THRESHOLD_MI), None)
            if twin:
                notes["same_site"] += 1
                continue
            chosen.append(s)
        keep.extend(chosen)
    return keep


def dedupe(osm, stn):
    """An FLS car park and an OSM record can describe the same tarmac. Where they do,
       keep the FLS one: it is first-party and it carries the scheme's rules, which
       are the part somebody could get fined for not knowing."""
    keep = []
    for s in osm:
        hit = next((f for f in stn if haversine_mi(s["lat"], s["lng"],
                                                   f["lat"], f["lng"]) < 0.1), None)
        if hit:
            notes["stn_merged"] += 1
            log("      merged: OSM %r sits within 160m of FLS %r; keeping the FLS record"
                % (s["name"], hit["name"]))
            continue
        keep.append(s)
    return keep


def validate(sites):
    for s in sites:
        if not (LAT_RANGE[0] <= s["lat"] <= LAT_RANGE[1]):
            problems.append("%s lat %s outside Great Britain (unprojected coords?)"
                            % (s["id"], s["lat"]))
        if not (LNG_RANGE[0] <= s["lng"] <= LNG_RANGE[1]):
            problems.append("%s lng %s outside Great Britain (unprojected coords?)"
                            % (s["id"], s["lng"]))
        for k in ("id", "source", "name", "lat", "lng", "country"):
            if s.get(k) in (None, ""):
                problems.append("%s missing required field %s" % (s.get("id"), k))
        if s["source"] != "campsite":
            problems.append("%s has source %r in the campsite file" % (s["id"], s["source"]))
        if s.get("opening_summary") is not None:
            problems.append("%s carries an opening_summary; campsites publish no hours "
                            "we can trust and must never show an open/closed badge" % s["id"])
        if not s.get("vehicles"):
            problems.append("%s lists no vehicle type, so it does not belong in this tab"
                            % s["id"])
        u = s.get("url")
        if u is not None and not (isinstance(u, str) and u.startswith("https://")):
            problems.append("%s url is not https: %r" % (s["id"], u))
    ids = [s["id"] for s in sites]
    if len(ids) != len(set(ids)):
        dupes = {i for i in ids if ids.count(i) > 1}
        problems.append("duplicate ids: %s" % sorted(dupes)[:5])


def main():
    log("[1/3] Parsing OpenStreetMap campsites (ODbL) ...")
    osm, scraped = build_osm()
    osm = dedupe_same_site(osm)
    log("      %d kept from %d elements (%d were the same site mapped twice)"
        % (len(osm), notes["seen"], notes["same_site"]))

    log("[2/3] Parsing Forestry and Land Scotland Stay the Night ...")
    stn = build_stn()
    log("      %d Stay the Night car parks" % len(stn))
    osm = dedupe(osm, stn)

    sites = osm + stn
    sites.sort(key=lambda s: s["name"].lower())

    log("[3/3] Validating ...")
    validate(sites)

    by_country = {}
    for s in sites:
        by_country[s["country"]] = by_country.get(s["country"], 0) + 1

    log("")
    log("FILTER (why %d of %d OSM elements were dropped)" % (notes["seen"] - len(osm), notes["seen"]))
    log("  %5d no name published" % notes["unnamed"])
    log("  %5d no explicit caravan or motorhome access" % notes["no_rv"])
    log("  %5d private or no public access" % notes["private"])
    log("  %5d scout or group-only" % notes["scout"])
    log("  %5d static-caravan holiday park" % notes["static"])
    log("  %5d no coordinate" % notes["no_coord"])
    log("  %5d merged into an FLS Stay the Night record" % notes["stn_merged"])
    log("  %5d already counted in a neighbouring country (border sites)" % notes["cross_border"])
    log("  %5d the same site mapped twice (node and area)" % notes["same_site"])
    log("  %5d website dropped as unsafe or malformed (record kept)" % notes["bad_url"])

    log("")
    log("FIELD COVERAGE (n=%d)" % len(sites))
    for k, label in [("postcode_satnav", "postcode"), ("url", "website"),
                     ("phone", "phone"), ("parking", "fee/charges"),
                     ("address", "address"), ("opening_times", "opening text")]:
        have = len([s for s in sites if s.get(k)])
        log("  %-14s %4d/%d present" % (label, have, len(sites)))
    fac = len([s for s in sites if s.get("facilities")])
    log("  %-14s %4d/%d present" % ("facilities", fac, len(sites)))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    payload = {
        "generated_at": max([v for v in scraped.values() if v] or ["unknown"]),
        "counts": {"campsite": len(sites)},
        "counts_by_country": by_country,
        "licence": "ODbL 1.0",
        "attribution": ("Campsite data © OpenStreetMap contributors, available under the "
                        "Open Database License. Stay the Night car parks from Forestry and "
                        "Land Scotland."),
        "attribution_url": "https://www.openstreetmap.org/copyright",
        # Said out loud in the artefact itself, because the next person to touch this
        # will be holding the file, not the decision record.
        "note": ("Kept separate from sites.json on purpose: that file is Open Government "
                 "Licence, this one is ODbL, and two independent databases shipped side by "
                 "side are a Collective Database under ODbL 1.0 s4.5(a). Do not merge them."),
        "sites": [compact(s) for s in sites],
    }
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, separators=(",", ":"))
    kb = os.path.getsize(OUT) / 1024
    log("")
    log("WROTE %s  (%d campsites, %.0f KB)" % (OUT, len(sites), kb))
    log("  by country: %s" % ", ".join("%s %d" % (k, v) for k, v in sorted(by_country.items())))

    if problems:
        log("")
        log("PROBLEMS (%d):" % len(problems))
        for p in problems[:40]:
            log("  - %s" % p)
        if len(problems) > 40:
            log("  ... and %d more" % (len(problems) - 40))
        log("Exiting non-zero: dataset is not trustworthy.")
        sys.exit(1)
    log("Stage 2b complete, no problems.")


if __name__ == "__main__":
    main()
