#!/usr/bin/env python3
"""Stage 1b: fetch the campsite sources to data/raw/. Resumable, rate-limited, loud on failure.

Two sources, both fetched once and cached, so iterating on parse_campsites.py costs
nobody any requests:

  1. OpenStreetMap via Overpass, one query per country, because asking per country is
     the only way to get the country onto the record without guessing it from a bounding
     box. Wales and England share too long a border for a box to be honest about it.
  2. Forestry and Land Scotland's "Stay the Night" scheme: forest car parks where a
     self-contained campervan may park overnight. The list page carries no coordinates,
     so it is joined to the destinations index, which carries all 278 in one attribute.

OSM data is ODbL, not OGL like the rest of this project. See DECISIONS 2026-08-15 and
docs/board/todo/0020: the extract is kept in its own file for that reason.
"""
import json, os, re, sys, time, html
import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "data", "raw")
OSM_DIR = os.path.join(RAW, "osm")
FLS_DIR = os.path.join(RAW, "fls")

OVERPASS = "https://overpass-api.de/api/interpreter"
FLS_BASE = "https://forestryandland.gov.scot"
FLS_STN = FLS_BASE + "/visit/stay-the-night/stay-the-night-destinations"
FLS_INDEX = FLS_BASE + "/visit/destinations"

# A real contact address, because Overpass and FLS are both entitled to know who is
# calling and neither is being paid to serve us.
UA = "NearestForest/1.0 (+https://forestlocator.enhanceify.co.uk; djinni.rc@gmail.com)"
HEADERS = {"User-Agent": UA}

COUNTRIES = [("England", "GB-ENG"), ("Scotland", "GB-SCT"), ("Wales", "GB-WLS")]
DELAY = 5.0            # Overpass is a donated public service. One query per 5 seconds.
RETRIES = 5            # 429 means "all slots busy", which is a wait, not a failure
BACKOFF = 30.0         # seconds, doubling: 30, 60, 120, 240

# Measured 2026-08-15: England 6083ish, Wales 1729ish, Scotland 684ish by crude box.
# These floors are deliberately well below that: they catch a broken query or a
# truncated response, not normal week-to-week movement in OSM.
EXPECT_MIN = {"England": 3000, "Scotland": 300, "Wales": 700}
EXPECT_MIN_STN = 30    # 44 published on 2026-08-15

failures = []


def log(msg):
    print(msg, flush=True)


def query_for(iso):
    return (
        '[out:json][timeout:600];\n'
        'area["ISO3166-2"="%s"]->.a;\n'
        '(\n'
        '  nwr["tourism"="camp_site"](area.a);\n'
        '  nwr["tourism"="caravan_site"](area.a);\n'
        ');\n'
        'out center tags;\n' % iso
    )


def fetch_osm(country, iso, n, total):
    """One Overpass query. Cached: a re-run costs zero requests."""
    path = os.path.join(OSM_DIR, "campsites-%s.json" % iso.lower())
    if os.path.exists(path) and os.path.getsize(path) > 50_000:
        d = json.load(open(path, encoding="utf-8"))
        log("      [%d/%d] %-8s cached (%d elements)" % (n, total, country, len(d["elements"])))
        return d

    log("      [%d/%d] %-8s querying Overpass ..." % (n, total, country))
    # Overpass hands out a fixed number of slots and answers 429 when they are all in
    # use. That is the service working correctly, not an error, so it is waited out
    # rather than failed on. 504 is the same shape of answer from a busy backend.
    r = None
    for attempt in range(1, RETRIES + 1):
        time.sleep(DELAY if attempt == 1 else BACKOFF * (2 ** (attempt - 2)))
        r = requests.post(OVERPASS, data=query_for(iso).encode("utf-8"),
                          headers=HEADERS, timeout=900)
        if r.status_code not in (429, 504):
            break
        wait = BACKOFF * (2 ** (attempt - 1))
        log("      [%d/%d] %-8s HTTP %d from Overpass (all slots busy); "
            "waiting %ds, attempt %d of %d"
            % (n, total, country, r.status_code, wait, attempt, RETRIES))
    r.raise_for_status()

    # Overpass answers 200 with an HTML error body when it is busy or the query is
    # rejected, and 200 with a truncated body on timeout. Neither is an exception,
    # which is exactly why both are checked here rather than trusted.
    try:
        d = r.json()
    except ValueError:
        raise RuntimeError("Overpass returned non-JSON (%d bytes): %s"
                           % (len(r.content), r.text[:200].replace("\n", " ")))
    if "remark" in d:
        raise RuntimeError("Overpass remark (query did not complete): %s" % d["remark"])
    if "elements" not in d:
        raise RuntimeError("Overpass response has no elements key")

    n_el = len(d["elements"])
    floor = EXPECT_MIN[country]
    if n_el < floor:
        raise RuntimeError("%s returned %d elements, expected at least %d. Refusing to "
                           "cache a short answer." % (country, n_el, floor))

    json.dump(d, open(path, "w", encoding="utf-8"), ensure_ascii=False)
    log("      [%d/%d] %-8s %d elements, osm base %s"
        % (n, total, country, n_el, d.get("osm3s", {}).get("timestamp_osm_base", "?")))
    return d


def fetch_html(url, path, min_bytes, label):
    if os.path.exists(path) and os.path.getsize(path) > min_bytes:
        h = open(path, encoding="utf-8").read()
        log("      %-22s cached (%s bytes)" % (label, format(len(h), ",")))
        return h
    time.sleep(1.0)
    r = requests.get(url, headers=HEADERS, timeout=60)
    r.raise_for_status()
    r.encoding = "utf-8"          # Gaelic diacritics; do not let requests guess
    open(path, "w", encoding="utf-8").write(r.text)
    log("      %-22s downloaded (%s bytes)" % (label, format(len(r.text), ",")))
    return r.text


def fetch_fls():
    """The 44 Stay the Night slugs, plus the index that knows where they are."""
    log("[2/2] Fetching Forestry and Land Scotland Stay the Night ...")
    stn = fetch_html(FLS_STN, os.path.join(FLS_DIR, "stay-the-night.html"),
                     100_000, "stay-the-night")
    idx = fetch_html(FLS_INDEX, os.path.join(FLS_DIR, "destinations.html"),
                     100_000, "destinations index")

    slugs = sorted(set(re.findall(r"/visit/destinations/[a-z0-9-]+", stn)))
    if len(slugs) < EXPECT_MIN_STN:
        raise RuntimeError("only %d Stay the Night destinations found, expected at least "
                           "%d. The page markup has probably changed." % (len(slugs), EXPECT_MIN_STN))

    m = re.search(r'data-forest-search-map="([^"]*)"', idx)
    if not m:
        raise RuntimeError("data-forest-search-map attribute is gone from the FLS "
                           "destinations index; the coordinate join has no source.")
    index = json.loads(html.unescape(m.group(1)))

    by_link = {d["link"].rstrip("/"): d for d in index}
    missing = [s for s in slugs if s not in by_link]
    if missing:
        # Not fatal on its own, but it must be visible: a slug with no coordinate is a
        # site the app would otherwise silently drop.
        log("      WARNING: %d Stay the Night slugs are absent from the destinations "
            "index and will be dropped: %s" % (len(missing), ", ".join(missing)))

    out = []
    for s in slugs:
        d = by_link.get(s)
        if not d:
            continue
        out.append({"slug": s.rsplit("/", 1)[-1], "name": d["title"],
                    "url": FLS_BASE + s,
                    "lat": float(d["latitude"]), "lng": float(d["longitude"])})

    json.dump(out, open(os.path.join(FLS_DIR, "stay-the-night.json"), "w",
                        encoding="utf-8"), ensure_ascii=False, indent=1)
    log("      %d Stay the Night car parks resolved to coordinates (of %d listed)"
        % (len(out), len(slugs)))
    return out


def main():
    os.makedirs(OSM_DIR, exist_ok=True)
    os.makedirs(FLS_DIR, exist_ok=True)

    log("[1/2] Fetching OpenStreetMap campsites (ODbL) via Overpass, one query per country ...")
    totals = {}
    for i, (country, iso) in enumerate(COUNTRIES, 1):
        try:
            d = fetch_osm(country, iso, i, len(COUNTRIES))
            totals[country] = len(d["elements"])
        except Exception as e:
            failures.append((country, "%s: %s" % (type(e).__name__, e)))
            log("      FAIL %s: %s" % (country, e))

    stn = []
    try:
        stn = fetch_fls()
    except Exception as e:
        failures.append(("stay-the-night", "%s: %s" % (type(e).__name__, e)))
        log("      FAIL stay-the-night: %s" % e)

    log("")
    log("SUMMARY: %s OSM elements (%s), %d Stay the Night car parks, %d failures"
        % (format(sum(totals.values()), ","),
           ", ".join("%s %s" % (k, format(v, ",")) for k, v in totals.items()),
           len(stn), len(failures)))
    if failures:
        log("FAILED:")
        for what, err in failures:
            log("  - %s: %s" % (what, err))
        log("Exiting non-zero: the campsite dataset would be incomplete.")
        sys.exit(1)
    log("Stage 1b complete.")


if __name__ == "__main__":
    main()
