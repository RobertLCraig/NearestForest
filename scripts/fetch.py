#!/usr/bin/env python3
"""Stage 1: fetch raw sources to data/raw/. Resumable, rate-limited, loud on failure.

Re-running costs zero requests for anything already cached, so the parser can be
iterated on without touching forestryengland.uk again.
"""
import json, os, re, sys, time, html
from concurrent.futures import ThreadPoolExecutor, as_completed
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

failures = []


def log(msg):
    print(msg, flush=True)


def get(url, **kw):
    r = requests.get(url, headers=HEADERS, timeout=45, **kw)
    r.raise_for_status()
    return r


def fetch_index():
    """Parse the 274 named forests out of the search page's geolocation markup."""
    log("[1/3] Fetching forest index ...")
    path = os.path.join(RAW, "search-forests.html")
    if os.path.exists(path) and os.path.getsize(path) > 100_000:
        h = open(path, encoding="utf-8", errors="replace").read()
        log(f"      cached ({len(h):,} bytes)")
    else:
        h = get(SEARCH).text
        open(path, "w", encoding="utf-8").write(h)
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
        return ("ok", f["slug"], len(r.text))
    except Exception as e:
        return ("fail", f["slug"], f"{type(e).__name__}: {e}")


def fetch_pages(forests):
    log(f"[2/3] Fetching {len(forests)} forest pages ({WORKERS} workers, {DELAY}s delay) ...")
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


def fetch_carparks():
    log("[3/3] Fetching car park features from ArcGIS (OGL v3) ...")
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
    json.dump(d, open(os.path.join(RAW, "carparks.json"), "w", encoding="utf-8"))
    log(f"      {len(feats)} car park features saved")
    return feats


def main():
    os.makedirs(PAGES, exist_ok=True)
    forests = fetch_index()
    fetch_pages(forests)
    carparks = fetch_carparks()
    log("")
    log(f"SUMMARY: {len(forests)} forests indexed, {len(carparks)} car parks, "
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
