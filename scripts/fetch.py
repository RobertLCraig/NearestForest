#!/usr/bin/env python3
"""Stage 1: fetch raw sources to data/raw/. Resumable, rate-limited, loud on failure.

Re-running costs zero requests for anything already cached, so the parser can be
iterated on without touching forestryengland.uk again.
"""
import json, os, re, sys, threading, time, html
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date
import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "data", "raw")
PAGES = os.path.join(RAW, "pages")
BASE = "https://www.forestryengland.uk"
SEARCH = BASE + "/search-forests"
CARPARK_URL = ("https://services2.arcgis.com/mHXjwgl3OARRqqD4/arcgis/rest/services/"
               "Forestry_England_Recreation_Areas/FeatureServer/0/query")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
HEADERS = {"User-Agent": UA}
WORKERS = 4
DELAY = 0.35          # per-worker politeness delay
EXPECT_MIN = 250      # fail the build if the search page yields fewer than this

# ------------------------------------------------------------------ Scotland (card 0016)
# Forestry and Land Scotland is the direct analogue of Forestry England, and it is cheaper
# to scrape: the whole index of destinations is one HTML attribute on one page, so the
# index costs a single request rather than a page of the pager per 9 sites.
# data/raw/fls/ is shared with fetch_campsites.py, which already caches the same index
# page for the Stay the Night coordinate join. Whichever runs first pays for it.
FLS_BASE = "https://forestryandland.gov.scot"
FLS_INDEX = FLS_BASE + "/visit/destinations"
FLS_DIR = os.path.join(RAW, "fls")
FLS_PAGES = os.path.join(FLS_DIR, "pages")
# A real contact address: FLS is entitled to know who is calling and is not paid to serve us.
FLS_UA = "NearestForest/1.0 (+https://forestlocator.enhanceify.co.uk; djinni.rc@gmail.com)"
FLS_HEADERS = {"User-Agent": FLS_UA}
EXPECT_MIN_FLS = 250      # 278 published on 2026-08-29

# ------------------------------------------------------------------ Wales (card 0079)
# Natural Resources Wales lists its visitor sites on one page per region, and the regions
# are linked from one top page. Neither carries a coordinate: each site page publishes an
# OS grid reference in prose, which parse.py converts. Same contact address as FLS.
NRW_BASE = "https://naturalresources.wales"
NRW_INDEX = NRW_BASE + "/days-out/places-to-visit/?lang=en"
NRW_DIR = os.path.join(RAW, "nrw")
NRW_PAGES = os.path.join(NRW_DIR, "pages")
EXPECT_MIN_NRW = 100      # 116 published on 2026-10-05, in five regions
RE_NRW_REGION = re.compile(r'href="/days-out/places-to-visit/([a-z-]+-wales)/\?lang=en"')

failures = []

# ------------------------------------------------------------------ download dates (card 0026)
# One JSON index under data/raw/, mapping each cached file to the date it was downloaded,
# so parse.py can stamp a record with the age of the page behind it rather than with the
# date the parser happened to run. It has to be written here, at the moment of the
# request, because nothing downstream can recover it: re-parsing the cache costs zero
# requests and is the intended way to work, and a file modification time is rewritten by
# any copy of the tree, including a build worktree.
FETCHED = "fetched.json"
_dates_lock = threading.Lock()
_dates = {}


def record_fetch(path):
    """Record today as the download date of a file just written into data/raw/.

    Keyed by the path relative to data/raw/ with forward slashes, so an index written on
    Windows reads the same on the server. Rewritten after every page rather than once at
    the end: a run that dies half way leaves cached HTML on disk, and HTML whose date was
    never recorded is HTML the parser has to reject for ever.
    """
    rel = os.path.relpath(path, RAW).replace(os.sep, "/")
    idx = os.path.join(RAW, FETCHED)
    with _dates_lock:
        if not _dates and os.path.exists(idx):
            _dates.update(json.load(open(idx, encoding="utf-8")))
        _dates[rel] = date.today().isoformat()
        with open(idx + ".tmp", "w", encoding="utf-8") as fh:
            json.dump(_dates, fh, indent=1, sort_keys=True)
        os.replace(idx + ".tmp", idx)     # never leave a half-written index behind


def log(msg):
    print(msg, flush=True)


def get(url, **kw):
    r = requests.get(url, headers=HEADERS, timeout=45, **kw)
    r.raise_for_status()
    return r


def fetch_index():
    """Parse the 274 named forests out of the search page's geolocation markup."""
    log("[1/7] Fetching Forestry England forest index ...")
    path = os.path.join(RAW, "search-forests.html")
    if os.path.exists(path) and os.path.getsize(path) > 100_000:
        h = open(path, encoding="utf-8", errors="replace").read()
        log(f"      cached ({len(h):,} bytes)")
    else:
        h = get(SEARCH).text
        open(path, "w", encoding="utf-8").write(h)
        record_fetch(path)
        log(f"      downloaded ({len(h):,} bytes)")

    forests = []
    for b in re.split(r"(?=<div\s+data-views-row-index=)", h):
        lat = re.search(r'data-lat="(-?\d+\.?\d*)"', b)
        lng = re.search(r'data-lng="(-?\d+\.?\d*)"', b)
        if not (lat and lng):
            continue
        t = (re.search(r'component-teaser-card__title[^>]*>\s*<a href="([^"]+)"[^>]*>(.*?)</a>', b, re.S)
             or re.search(r'<h[23][^>]*>\s*<a href="([^"]+)"[^>]*>(.*?)</a>', b, re.S))
        if not t:
            continue                                    # map-centre div, no name: not a forest
        href = t.group(1)
        name = html.unescape(re.sub(r"<[^>]+>", "", t.group(2))).strip()
        eid = re.search(r'data-entity-id="(\d+)"', b)
        if not name or not href.startswith("/"):
            continue
        forests.append({"id": eid.group(1) if eid else None, "name": name,
                        "slug": href.strip("/"), "url": BASE + href,
                        "lat": float(lat.group(1)), "lng": float(lng.group(1))})

    seen, uniq = set(), []
    for f in forests:
        if f["slug"] in seen:
            continue
        seen.add(f["slug"])
        uniq.append(f)

    log(f"      parsed {len(uniq)} named forests")
    if len(uniq) < EXPECT_MIN:
        log(f"FAIL: expected >= {EXPECT_MIN} forests, got {len(uniq)}. "
            f"The search page markup has probably changed. Refusing to emit a short index.")
        sys.exit(1)
    json.dump(uniq, open(os.path.join(RAW, "index.json"), "w", encoding="utf-8"), indent=1)
    return uniq


def fetch_page(f, i, total):
    path = os.path.join(PAGES, f["slug"].replace("/", "__") + ".html")
    if os.path.exists(path) and os.path.getsize(path) > 20_000:
        return ("cached", f["slug"], 0)
    try:
        time.sleep(DELAY)
        r = get(f["url"])
        open(path, "w", encoding="utf-8").write(r.text)
        record_fetch(path)
        return ("ok", f["slug"], len(r.text))
    except Exception as e:
        return ("fail", f["slug"], f"{type(e).__name__}: {e}")


def fetch_pages(forests):
    log(f"[2/7] Fetching {len(forests)} Forestry England pages "
        f"({WORKERS} workers, {DELAY}s delay) ...")
    t0, done, ok, cached = time.time(), 0, 0, 0
    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futs = {ex.submit(fetch_page, f, i, len(forests)): f for i, f in enumerate(forests)}
        for fut in as_completed(futs):
            status, slug, info = fut.result()
            done += 1
            if status == "ok":
                ok += 1
            elif status == "cached":
                cached += 1
            else:
                failures.append((slug, info))
                log(f"      FAIL {slug}: {info}")
            if done % 20 == 0 or done == len(forests):
                el = time.time() - t0
                eta = (el / done) * (len(forests) - done)
                log(f"      {done}/{len(forests)}  new={ok} cached={cached} "
                    f"failed={len(failures)}  elapsed={el:0.0f}s eta={eta:0.0f}s")
    log(f"      done: {ok} downloaded, {cached} already cached, {len(failures)} failed")


def fetch_fls_index():
    """All 278 Scottish destinations, from one HTML attribute on one page.

    The index is HTML-escaped JSON in `data-forest-search-map`, repeated identically on
    every page of the 31-page pager, so there is nothing to walk. sitemap.xml lists the
    same 278 destination URLs, which is the cross-check that this is the whole set and
    not a filtered view of it.
    """
    log("[4/7] Fetching Forestry and Land Scotland destination index ...")
    path = os.path.join(FLS_DIR, "destinations.html")
    if os.path.exists(path) and os.path.getsize(path) > 100_000:
        h = open(path, encoding="utf-8").read()
        log(f"      cached ({len(h):,} bytes)")
    else:
        time.sleep(1.0)
        r = requests.get(FLS_INDEX, headers=FLS_HEADERS, timeout=60)
        r.raise_for_status()
        r.encoding = "utf-8"        # Gaelic diacritics; never let requests guess
        open(path, "w", encoding="utf-8").write(r.text)
        record_fetch(path)
        h = r.text
        log(f"      downloaded ({len(h):,} bytes)")

    m = re.search(r'data-forest-search-map="([^"]*)"', h)
    if not m:
        log("FAIL: the data-forest-search-map attribute is gone from the FLS destinations "
            "index. The whole Scottish index came from it; refusing to guess a replacement.")
        sys.exit(1)
    index = json.loads(html.unescape(m.group(1)))

    dests, seen = [], set()
    for d in index:
        link = (d.get("link") or "").rstrip("/")
        title = (d.get("title") or "").strip()
        if not link.startswith("/visit/destinations/") or not title:
            continue
        slug = link.rsplit("/", 1)[-1]
        if slug in seen:
            continue
        seen.add(slug)
        dests.append({"slug": slug, "name": title, "url": FLS_BASE + link,
                      "lat": float(d["latitude"]), "lng": float(d["longitude"])})

    log(f"      parsed {len(dests)} destinations")
    if len(dests) < EXPECT_MIN_FLS:
        log(f"FAIL: expected >= {EXPECT_MIN_FLS} FLS destinations, got {len(dests)}. "
            f"The index attribute has probably changed shape. Refusing to emit a short index.")
        sys.exit(1)
    json.dump(dests, open(os.path.join(FLS_DIR, "index.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    return dests


def fetch_fls_page(d):
    """The visitor-information tab, which carries the fields parse.py already models."""
    path = os.path.join(FLS_PAGES, d["slug"] + ".html")
    if os.path.exists(path) and os.path.getsize(path) > 20_000:
        return ("cached", d["slug"], 0)
    try:
        time.sleep(DELAY)
        r = requests.get(d["url"] + "/visitor-information", headers=FLS_HEADERS, timeout=45)
        r.raise_for_status()
        r.encoding = "utf-8"
        open(path, "w", encoding="utf-8").write(r.text)
        record_fetch(path)
        return ("ok", d["slug"], len(r.text))
    except Exception as e:
        return ("fail", d["slug"], f"{type(e).__name__}: {e}")


def fetch_fls_pages(dests):
    log(f"[5/7] Fetching {len(dests)} FLS destination pages "
        f"({WORKERS} workers, {DELAY}s delay) ...")
    t0, done, ok, cached, failed = time.time(), 0, 0, 0, 0
    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futs = [ex.submit(fetch_fls_page, d) for d in dests]
        for fut in as_completed(futs):
            status, slug, info = fut.result()
            done += 1
            if status == "ok":
                ok += 1
            elif status == "cached":
                cached += 1
            else:
                failed += 1
                failures.append((slug, info))
                log(f"      FAIL {slug}: {info}")
            if done % 20 == 0 or done == len(dests):
                el = time.time() - t0
                eta = (el / done) * (len(dests) - done)
                log(f"      {done}/{len(dests)}  new={ok} cached={cached} "
                    f"failed={failed}  elapsed={el:0.0f}s eta={eta:0.0f}s")
    log(f"      done: {ok} downloaded, {cached} already cached, {failed} failed")


def nrw_get_cached(url, path, min_size):
    """One NRW page through the cache. Returns its text."""
    if os.path.exists(path) and os.path.getsize(path) > min_size:
        return open(path, encoding="utf-8").read()
    time.sleep(1.0)
    r = requests.get(url, headers=FLS_HEADERS, timeout=60)
    r.raise_for_status()
    r.encoding = "utf-8"        # Welsh circumflexes; never let requests guess
    open(path, "w", encoding="utf-8").write(r.text)
    record_fetch(path)
    return r.text


def fetch_nrw_index():
    """Every site on NRW's places-to-visit index: the top page names the regions, and each
    region's page lists its sites, each a link wrapped around an <h2 class="name">."""
    log("[6/7] Fetching Natural Resources Wales places-to-visit index ...")
    top = nrw_get_cached(NRW_INDEX, os.path.join(NRW_DIR, "places-to-visit.html"), 20_000)
    regions = sorted(set(RE_NRW_REGION.findall(top)))
    log(f"      {len(regions)} regions: {', '.join(regions)}")
    if len(regions) < 5:
        log(f"FAIL: expected 5 NRW regions, found {len(regions)}. The index page has probably "
            f"changed shape. Refusing to emit a short index.")
        sys.exit(1)

    sites, seen = [], set()
    for reg in regions:
        h = nrw_get_cached(f"{NRW_BASE}/days-out/places-to-visit/{reg}/?lang=en",
                           os.path.join(NRW_DIR, "regions", reg + ".html"), 20_000)
        n = 0
        for slug, inner in re.findall(
                r'<a href="/days-out/places-to-visit/' + re.escape(reg) +
                r'/([a-z0-9-]+)/\?lang=en"[^>]*>(.*?)</a>', h, re.S):
            name = re.search(r'<h2 class="name">(.*?)</h2>', inner, re.S)
            if not name or slug in seen:
                continue                    # a nav link, not a site card; or a repeat
            seen.add(slug)
            n += 1
            sites.append({"slug": slug, "region": reg,
                          "name": " ".join(html.unescape(name.group(1)).split()),
                          "url": f"{NRW_BASE}/days-out/places-to-visit/{reg}/{slug}/?lang=en"})
        log(f"      {reg}: {n} sites")

    log(f"      parsed {len(sites)} sites")
    if len(sites) < EXPECT_MIN_NRW:
        log(f"FAIL: expected >= {EXPECT_MIN_NRW} NRW sites, got {len(sites)}. The region pages "
            f"have probably changed shape. Refusing to emit a short index.")
        sys.exit(1)
    json.dump(sites, open(os.path.join(NRW_DIR, "index.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    return sites


def fetch_nrw_page(s):
    path = os.path.join(NRW_PAGES, s["slug"] + ".html")
    if os.path.exists(path) and os.path.getsize(path) > 20_000:
        return ("cached", s["slug"], 0)
    try:
        time.sleep(DELAY)
        r = requests.get(s["url"], headers=FLS_HEADERS, timeout=45)
        r.raise_for_status()
        r.encoding = "utf-8"
        open(path, "w", encoding="utf-8").write(r.text)
        record_fetch(path)
        return ("ok", s["slug"], len(r.text))
    except Exception as e:
        return ("fail", s["slug"], f"{type(e).__name__}: {e}")


def fetch_nrw_pages(nrw):
    log(f"[7/7] Fetching {len(nrw)} NRW site pages ({WORKERS} workers, {DELAY}s delay) ...")
    t0, done, ok, cached, failed = time.time(), 0, 0, 0, 0
    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        for fut in as_completed([ex.submit(fetch_nrw_page, s) for s in nrw]):
            status, slug, info = fut.result()
            done += 1
            if status == "ok":
                ok += 1
            elif status == "cached":
                cached += 1
            else:
                failed += 1
                failures.append((slug, info))
                log(f"      FAIL {slug}: {info}")
            if done % 20 == 0 or done == len(nrw):
                log(f"      {done}/{len(nrw)}  new={ok} cached={cached} failed={failed}  "
                    f"elapsed={time.time() - t0:0.0f}s")
    log(f"      done: {ok} downloaded, {cached} already cached, {failed} failed")


def fetch_carparks():
    log("[3/7] Fetching car park features from ArcGIS (OGL v3) ...")
    params = {"where": "category='Car Parks'", "outFields": "*", "returnCentroid": "true",
              "returnGeometry": "false", "outSR": "4326", "f": "json",
              "resultRecordCount": "2000"}
    r = get(CARPARK_URL, params=params)
    d = r.json()
    feats = d.get("features", [])
    if d.get("exceededTransferLimit"):
        log("FAIL: ArcGIS reported exceededTransferLimit; pagination needed. Not silently truncating.")
        sys.exit(1)
    if not feats:
        log("FAIL: car park query returned zero features.")
        sys.exit(1)
    cp_path = os.path.join(RAW, "carparks.json")
    json.dump(d, open(cp_path, "w", encoding="utf-8"))
    record_fetch(cp_path)
    log(f"      {len(feats)} car park features saved")
    return feats


def main():
    os.makedirs(PAGES, exist_ok=True)
    os.makedirs(FLS_PAGES, exist_ok=True)
    os.makedirs(NRW_PAGES, exist_ok=True)
    os.makedirs(os.path.join(NRW_DIR, "regions"), exist_ok=True)
    forests = fetch_index()
    fetch_pages(forests)
    carparks = fetch_carparks()
    dests = fetch_fls_index()
    fetch_fls_pages(dests)
    nrw = fetch_nrw_index()
    fetch_nrw_pages(nrw)
    log("")
    log(f"SUMMARY: {len(forests)} English forests indexed, {len(carparks)} car parks, "
        f"{len(dests)} Scottish destinations indexed, {len(nrw)} Welsh sites indexed, "
        f"{len(failures)} page failures")
    if failures:
        log("FAILED PAGES:")
        for slug, err in failures:
            log(f"  - {slug}: {err}")
        log("Exiting non-zero: the dataset would be incomplete.")
        sys.exit(1)
    log("Stage 1 complete.")


if __name__ == "__main__":
    main()
