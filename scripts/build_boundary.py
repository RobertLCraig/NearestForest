#!/usr/bin/env python3
"""Stage 3: build the offline map outline into app/data/boundary.json.

The map view has to draw a recognisable Great Britain with no network, so the
coastline ships in the bundle. Everything here is about making that outline as
small as it can be while still being recognisable at the zoom where you choose
between two forests.

Source is Natural Earth 1:10m "map subunits", which is public domain and, unlike
the plain countries file, splits the UK into England / Wales / Scotland. That
split is worth having: it draws the England-Wales and England-Scotland borders
for free, and those are the strongest orientation cues on an otherwise blank map.

Re-running costs zero requests once the source is cached in data/raw/, matching
scripts/fetch.py. Fails loudly and exits non-zero rather than emitting a partial
or unrecognisable outline, matching scripts/parse.py.
"""
import json, math, os, sys, datetime

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "data", "raw")
OUT = os.path.join(ROOT, "app", "data", "boundary.json")

SRC_NAME = "ne_10m_admin_0_map_subunits.geojson"
SRC_URL = ("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/"
           "master/geojson/" + SRC_NAME)

# Great Britain only. Northern Ireland is deliberately out: no Forestry England
# site is within 100 miles of it, so it is all cost and no orientation.
WANT = ["Scotland", "Wales", "England"]      # drawn in this order, England last

PRECISION = 10000        # coordinates stored as integers at 1e-4 deg (~11m)
SIMPLIFY_TOL = 0.004     # degrees, ~450m. Tuned by eye against the vertex budget.
MIN_RING_AREA = 0.004    # square degrees; drops islets, keeps Wight and Anglesey

# Sanity bounds for Great Britain. An outline outside these means the source
# changed shape or the wrong features were picked, and a wrong coastline is
# worse than none: it would put markers in the sea and look authoritative.
GB_BBOX = (-8.8, 49.8, 2.1, 61.0)
MAX_VERTICES = 6000      # budget; over this the file is too heavy for the bundle
MIN_VERTICES = 800       # under this the coast has been simplified into nonsense

failures = []


def log(msg):
    print(msg, flush=True)


def fetch_source():
    """Download the Natural Earth subunits file, or reuse the cached copy."""
    log("[1/5] Fetching Natural Earth subunits ...")
    os.makedirs(RAW, exist_ok=True)
    path = os.path.join(RAW, SRC_NAME)
    if os.path.exists(path) and os.path.getsize(path) > 1_000_000:
        log(f"      cached ({os.path.getsize(path):,} bytes)")
        return path
    log(f"      downloading {SRC_URL}")
    r = requests.get(SRC_URL, timeout=120)
    r.raise_for_status()
    with open(path, "wb") as fh:
        fh.write(r.content)
    log(f"      saved ({os.path.getsize(path):,} bytes)")
    return path


def ring_area(ring):
    """Unsigned shoelace area in square degrees. Only used to rank islands by
    size, so the lack of a projection does not matter."""
    a = 0.0
    for i in range(len(ring) - 1):
        a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
    return abs(a) / 2.0


def perp_dist(p, a, b):
    x0, y0 = p
    x1, y1 = a
    x2, y2 = b
    dx, dy = x2 - x1, y2 - y1
    if dx == 0 and dy == 0:
        return math.hypot(x0 - x1, y0 - y1)
    t = ((x0 - x1) * dx + (y0 - y1) * dy) / (dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    return math.hypot(x0 - (x1 + t * dx), y0 - (y1 + t * dy))


def simplify(ring, tol):
    """Ramer-Douglas-Peucker, iterative. A recursive version overflows the stack
    on Scotland's 4,700-point coastline."""
    n = len(ring)
    if n < 4:
        return ring[:]
    keep = [False] * n
    keep[0] = keep[n - 1] = True
    stack = [(0, n - 1)]
    while stack:
        first, last = stack.pop()
        worst, worst_i = 0.0, -1
        for i in range(first + 1, last):
            d = perp_dist(ring[i], ring[first], ring[last])
            if d > worst:
                worst, worst_i = d, i
        if worst > tol:
            keep[worst_i] = True
            stack.append((first, worst_i))
            stack.append((worst_i, last))
    return [ring[i] for i in range(n) if keep[i]]


def encode(ring):
    """Flat delta-encoded integers: [x0, y0, dx1, dy1, ...].

    Deltas between neighbouring coastline points are small, so most end up as
    one- or two-digit numbers. That is roughly a third of the bytes of the same
    ring written as [lng, lat] pairs, and it decodes in one pass in the browser.
    """
    out = []
    px = py = 0
    for lng, lat in ring:
        x = int(round(lng * PRECISION))
        y = int(round(lat * PRECISION))
        out.append(x - px)
        out.append(y - py)
        px, py = x, y
    return out


def build():
    path = fetch_source()

    log("[2/5] Extracting Great Britain subunits ...")
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)

    by_name = {}
    for feat in data.get("features", []):
        props = feat.get("properties", {})
        if props.get("ADM0_A3") != "GBR":
            continue
        name = props.get("SUBUNIT")
        if name in WANT:
            by_name[name] = feat

    missing = [n for n in WANT if n not in by_name]
    if missing:
        failures.append("Natural Earth did not yield these subunits: " + ", ".join(missing))
        return None
    log("      found " + ", ".join(WANT))

    log("[3/5] Dropping islets and simplifying ...")
    parts = []
    total_before = total_after = 0
    for name in WANT:
        geom = by_name[name]["geometry"]
        polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
        rings = []
        dropped = 0
        for poly in polys:
            outer = poly[0]                      # holes are irrelevant at this zoom
            if ring_area(outer) < MIN_RING_AREA:
                dropped += 1
                continue
            total_before += len(outer)
            s = simplify(outer, SIMPLIFY_TOL)
            if len(s) < 4:
                dropped += 1
                continue
            total_after += len(s)
            rings.append(s)
        if not rings:
            failures.append(f"{name} simplified away to nothing, which cannot be right.")
            return None
        log(f"      {name:<9} {len(rings):>2} ring(s), {dropped:>2} islet(s) dropped")
        parts.append({"name": name, "rings": rings})

    log(f"      {total_before:,} vertices -> {total_after:,} after simplification")

    log("[4/5] Checking the result is actually Great Britain ...")
    xs = [p[0] for part in parts for ring in part["rings"] for p in ring]
    ys = [p[1] for part in parts for ring in part["rings"] for p in ring]
    bbox = [min(xs), min(ys), max(xs), max(ys)]
    lo_x, lo_y, hi_x, hi_y = GB_BBOX
    if not (lo_x <= bbox[0] and bbox[2] <= hi_x and lo_y <= bbox[1] and bbox[3] <= hi_y):
        failures.append(f"Outline bbox {bbox} falls outside Great Britain {list(GB_BBOX)}. "
                        "Either the source changed or the coordinates are not WGS84.")
    if total_after > MAX_VERTICES:
        failures.append(f"{total_after:,} vertices exceeds the {MAX_VERTICES:,} budget. "
                        "Raise SIMPLIFY_TOL or the bundle grows.")
    if total_after < MIN_VERTICES:
        failures.append(f"Only {total_after:,} vertices left, under the {MIN_VERTICES:,} floor. "
                        "The coast has been simplified into nonsense.")
    if failures:
        return None
    log(f"      bbox {[round(v, 3) for v in bbox]}, inside Great Britain")

    log("[5/5] Encoding and writing ...")
    doc = {
        "generated_at": datetime.date.today().isoformat(),
        "source": "Natural Earth 1:10m admin-0 map subunits (public domain)",
        "note": "Generated by scripts/build_boundary.py. Never hand-edit; re-run the script.",
        "precision": PRECISION,
        "simplify_tolerance_deg": SIMPLIFY_TOL,
        "vertices": total_after,
        "bbox": [round(v, 4) for v in bbox],
        "parts": [{"name": p["name"], "rings": [encode(r) for r in p["rings"]]} for p in parts],
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(doc, fh, separators=(",", ":"))
    return os.path.getsize(OUT)


def main():
    log("Building app/data/boundary.json")
    size = None
    try:
        size = build()
    except Exception as exc:                       # noqa: BLE001 - report, never swallow
        failures.append(f"{type(exc).__name__}: {exc}")

    if failures or size is None:
        log("")
        log("FAILED. boundary.json was not written:")
        for f in failures:
            log(f"  - {f}")
        sys.exit(1)

    log("")
    log(f"OK  {OUT}")
    log(f"    {size:,} bytes")
    sys.exit(0)


if __name__ == "__main__":
    main()
