#!/usr/bin/env python3
"""Generate the app icons as PNGs with no image library.

Pure zlib + struct PNG encoding, because the project must stay dependency-free and
Pillow is not installed. Draws a conifer on a dark green ground, supersampled 4x for
smooth edges.
"""
import os, sys, zlib, struct

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "app", "icons")
SIZES = [180, 192, 512]          # 180 = apple-touch-icon, 192/512 = manifest
SS = 4                           # supersample factor

BG = (15, 26, 18)
TREE = (111, 208, 140)
TRUNK = (86, 62, 40)


def png(path, w, h, rgb_rows):
    """rgb_rows: list of h rows, each a list of w (r,g,b) tuples."""
    raw = bytearray()
    for row in rgb_rows:
        raw.append(0)                                  # filter type 0 (None)
        for (r, g, b) in row:
            raw += bytes((r, g, b))

    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)   # 8-bit truecolour
    blob = (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) +
            chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b""))
    open(path, "wb").write(blob)
    return len(blob)


def in_tree(x, y, n):
    """Signed test for a three-tier conifer in a unit-ish box scaled to n."""
    fx, fy = x / n, y / n
    cx = 0.5
    # trunk
    if 0.74 <= fy <= 0.88 and abs(fx - cx) <= 0.055:
        return TRUNK
    # three stacked triangles
    tiers = [(0.14, 0.42, 0.20), (0.32, 0.60, 0.27), (0.50, 0.78, 0.34)]
    for top, bot, halfw in tiers:
        if top <= fy <= bot:
            t = (fy - top) / (bot - top)
            if abs(fx - cx) <= halfw * t:
                return TREE
    return None


def build(size):
    n = size * SS
    rows = []
    for y in range(size):
        row = []
        for x in range(size):
            rs = gs = bs = 0
            for sy in range(SS):
                for sx in range(SS):
                    c = in_tree(x * SS + sx, y * SS + sy, n) or BG
                    rs += c[0]; gs += c[1]; bs += c[2]
            k = SS * SS
            row.append((rs // k, gs // k, bs // k))
        rows.append(row)
    return rows


def main():
    os.makedirs(OUT, exist_ok=True)
    total = 0
    for s in SIZES:
        path = os.path.join(OUT, "icon-%d.png" % s)
        try:
            n = png(path, s, s, build(s))
        except Exception as e:
            print("FAIL writing %s: %s" % (path, e), flush=True)
            sys.exit(1)
        total += 1
        print("  wrote icon-%d.png (%d bytes)" % (s, n), flush=True)
    print("Generated %d icons in %s" % (total, OUT), flush=True)


if __name__ == "__main__":
    main()
