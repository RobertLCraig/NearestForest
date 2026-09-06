# A failed parse overwrites the dataset it has just refused to trust

## Why
Both parsers write their output file and check `problems` afterwards. `scripts/parse.py` writes
`app/data/sites.json` at line 741 and only reaches the `if problems:` block at line 746;
`scripts/parse_campsites.py` has the same order, writing `app/data/campsites.json` at line 445 and
checking at line 451. So a build that decides the dataset is not trustworthy has already put it on
disk, on top of the last one that was.

What it costs. Both files are committed and are what the app ships, so the previous good copy is the
only copy. Measured on 2026-09-05 while building card 0026: `python scripts/parse.py` exited 1 as it
should, and left all 1,180 records in `app/data/sites.json` reading `"scraped_at": null`. Getting the
shipped dataset back took `git checkout -- app/data/sites.json`. Anyone without that instinct is one
failed parse away from committing a broken dataset, and `deploy.ps1` would ship it, because it runs
`node scripts/selftest.js` against whatever is on disk rather than against what the parser thought of
it.

It also makes the loud-failure rule quieter than it reads. `CLAUDE.md` says nothing fails silently,
and this does fail loudly; what it does not do is fail safely, and a build that destroys its own last
good output fails twice for one fault.

How it came to be this way. The write came first and the validation was added around it, so the exit
was appended at the end of `main()` where every other summary line lives, rather than moved ahead of
the write.

## Links

**Relates to**
- `0026` - found this while making `scraped_at` the fetch date. `0026` made the parser reject a cache
  with no recorded download dates, which is what turned a rare failure path into the ordinary one and
  exposed this. It restored the file by hand and left the fault alone as out of its scope.

## Not this card
Not `scraped_at`, and not re-fetching `data/raw/`: both are `0026`'s. Not changing what either parser
counts as a problem, and not softening any of the existing checks. Not `scripts/fetch.py`, which
writes a cache rather than a shipped file.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `scripts/parse.py` finds problems, THE PARSER SHALL exit non-zero with the previous
      `app/data/sites.json` still on disk unchanged. proves: `a failed parse leaves the previous
      dataset untouched`
- [x] #2 WHEN `scripts/parse.py` finds no problems, THE PARSER SHALL write the dataset exactly as it
      does now. proves: `a clean parse still writes the dataset`
- [x] #3 WHEN `scripts/parse_campsites.py` finds problems, THE PARSER SHALL exit non-zero with the
      previous `app/data/campsites.json` still on disk unchanged. proves: `a failed campsite parse
      leaves the previous dataset untouched`
<!-- AC:END -->

## Tasks
- [x] Move the `if problems:` block ahead of the write in `scripts/parse.py`
- [x] Do the same in `scripts/parse_campsites.py`
- [x] Cover both in `scripts/selftest.js`, against a fixture tree rather than the real one

## Plan
Work in the NearestForest repository, on a branch off `main`. Only `scripts/parse.py`,
`scripts/parse_campsites.py` and `scripts/selftest.js` are touched.

The change is an ordering one: report and `sys.exit(1)` before `json.dump`, so a failing run leaves
the last good file alone. Keep every line the summary already prints, including the coverage report,
because those numbers are how a shortfall gets read; only the write moves behind the gate.

The self-test harness for this already exists. `scripts/selftest.js` builds a synthetic `data/raw/`
in a temp directory, copies the parser into it and runs it there, under
`--- staleness: scraped_at is the fetch date ---`. Reuse that: write a good dataset, break the
fixture, re-run, and assert the file's bytes did not change. **Do not run either parser against the
real tree from a test**, which is the fault this card is about.

It worked when `node scripts/selftest.js` is green and a deliberately broken fixture leaves the
previous output byte-identical.

## Comments
**2026-09-05** Raised by card `0026`, which hit this on its own acceptance run: the parser correctly
refused a cache with no download dates, and the refusal cost the committed `sites.json`. Recorded
here rather than fixed, because a fix belongs to a card somebody reviewed.

**2026-09-06** RESULT: done
TESTS: +3 new, all green (225 passed, 0 failed)
TOUCHED: scripts/parse.py, scripts/parse_campsites.py, scripts/selftest.js, docs/HANDOVER.md
OUT-OF-SCOPE: none

The `if problems:` block now sits ahead of `json.dump` in both parsers, and its last line names
the file it did not touch. Every summary and coverage line is where it was; only the write moved.

The two failure tests were watched red first, against a fixture tree in a temp directory, and both
failed for the fault rather than for a missing anything: `parse.py exited 1 but had already
replaced sites.json (1425 bytes -> 1417 bytes)` and the same for `campsites.json`. The forest
fixture is broken the way the real tree broke, a cached page with no download date; the campsite
one with a latitude of 12.3, which is what the Great Britain box exists to catch. #2 is a
no-regression criterion and was green from the start, since nothing could have made a working
write fail before the change.

Checked and deliberately left alone: `scripts/build_boundary.py` has the same shape but is already
safe, because `build()` returns `None` before its write when it has failures. No PHP suite exists
here, so the suite is `node scripts/selftest.js`; there is no `vendor/bin/pest.bat` to run.

HANDOVER touched for three lines this made false, and nothing else: it is over its 40 KB budget and
card `0031` already carries that.
