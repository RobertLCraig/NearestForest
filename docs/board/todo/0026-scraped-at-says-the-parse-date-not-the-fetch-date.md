# `scraped_at` says when the parser ran, not when the page was read

## Why
Every forest and car park record carries a `scraped_at` date, and DATA-MODEL says that field exists
to make staleness visible. It does not. `scripts/parse.py` sets `TODAY = date.today()` at line 16 and
stamps it onto every record it writes, so the date says when the parser last ran, not when the page
behind the record was actually downloaded.

What it costs. `scripts/fetch.py` caches raw HTML to `data/raw/` on purpose, and re-running the
parser over that cache costs zero requests, which is the intended way to work. Every such re-run
silently makes the whole dataset look a day old when the pages behind it may be months old. It
already happened: on 2026-08-29 all 904 records read `2026-08-29` while the HTML they were built from
had been fetched on 2026-08-08, three weeks earlier. Anyone deciding whether a re-scrape is due reads
a date that always says "today", so the one field meant to answer that question can never answer it.

How it came to be this way. The parser was written before the fetcher had a cache, when parsing and
fetching happened in the same run and the two dates were the same date. The cache was added later and
nobody went back to the stamp. Card 0004 found this on 2026-08-29 and recorded it as out of its own
scope; it sat in HANDOVER's prose until card 0023 moved it into DATA-MODEL's divergences.

## Links

**Relates to**
- `0004` - found this while deriving car park names, and correctly left it alone as out of scope.

## Not this card
Not `scripts/parse_campsites.py`, which takes its stamp from the Overpass response rather than from
the clock and is not affected. Not adding a staleness warning to the app: this card makes the
recorded date honest and nothing more. Not re-fetching anything.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN `scripts/fetch.py` writes a page into `data/raw/`, THE FETCHER SHALL record the date it
      downloaded that page, in a form the parser can read back per page. proves: `fetch records a
      download date alongside every cached page`
- [ ] #2 WHEN `scripts/parse.py` builds a record from a cached page, THE PARSER SHALL set
      `scraped_at` to that page's recorded download date rather than to today. proves: `scraped_at is
      the page's download date, not the parse date`
- [ ] #3 WHEN a cached page has no recorded download date, because it was cached before this change,
      THE PARSER SHALL fail loudly and name the page rather than falling back to today. proves:
      `parse fails loudly on a cached page with no download date`
<!-- AC:END -->

## Tasks
- [ ] Have `fetch.py` record a per-page download date beside the cached HTML
- [ ] Have `parse.py` read it back and use it for `scraped_at`, for both the English and Scottish builds
- [ ] Make a missing date a loud failure, never a silent fallback to today
- [ ] Re-run the pipeline and close the divergence in `docs/DATA-MODEL.md`

## Plan
Work in the NearestForest repository, on a branch off `main`. Only `scripts/fetch.py`,
`scripts/parse.py`, `scripts/selftest.js` and `docs/DATA-MODEL.md` are touched.

The stamp is `TODAY` at `scripts/parse.py:16`, used at lines 340, 501 and 575 — the English forests,
the car parks and the Scottish forests. All three need the same treatment.

`scripts/fetch.py` currently records no date at all. The cheapest place to put one is a sidecar the
fetcher already controls: either the file modification time of the cached page, or one JSON index
under `data/raw/` mapping page to download date. Prefer the explicit index — a modification time is
changed by any file copy, and this worktree is itself a copy, so it would lie the first time somebody
moved the repository.

`data/raw/` is gitignored and is a 142MB cache on Rob's machine only, so pages cached before this
change will have no date. That is criterion #3: name the page and exit non-zero, per this project's
"nothing fails silently" rule in `CLAUDE.md`. Do not fall back to today, which is the exact bug.

Run it with `python scripts/fetch.py && python scripts/parse.py`, then `node scripts/selftest.js`.
It worked when the suite is green and `scraped_at` in `app/data/sites.json` reads the date the HTML
was downloaded rather than the date you ran the parser.

## Comments
**2026-09-05** Raised from card 0023, which folded the note out of HANDOVER's prose and into
DATA-MODEL's divergences. 0023 did not fix it; the fault is exactly as card 0004 first measured it.
