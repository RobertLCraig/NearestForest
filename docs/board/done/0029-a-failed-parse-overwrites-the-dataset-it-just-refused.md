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

### 2026-09-08 review (v20260908102947-daf0)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I traced all three criteria to real code.

**#1** ÔÇö `main()` in `scripts/parse.py`: the `if problems:` block, ending in `sys.exit(1)`, now sits above `os.makedirs`/`open(OUT, "w")`. `OUT` is opened in exactly one place, so a failing run cannot touch `app/data/sites.json`.

**#2** ÔÇö same function: the clean path still builds `payload` and does `json.dump` with every summary and coverage `log()` line kept.

**#3** ÔÇö `main()` in `scripts/parse_campsites.py`: same order, same single write of `OUT`.

Tests: `scripts/selftest.js`, block `--- a refused dataset does not overwrite the last good one (card 0029) ---`. It copies each parser into a temp tree with a synthetic `data/raw/`, runs it clean, saves the bytes with `readFileSync`, breaks the fixture (missing `fetched.json` date for the forests; `lat: 12.3` for the campsites), re-runs, and asserts `before.equals(after)` plus non-zero exit. The real tree is never parsed, which is what the card asked.

I tried to break it by looking for a second, earlier write of either output file. There is none in either script.

VERDICT: sound

**scope: sound**

Scope check on the real card commit (`42876cf`), not the branch-wide diff shown to me ÔÇö the rest of that diff belongs to other cards (0020, 0022, 0026, 0028).

What that commit touched: `scripts/parse.py` (`main`), `scripts/parse_campsites.py` (`main`), `scripts/selftest.js` (the new `card 0029` block), `docs/HANDOVER.md`, and the card file. Nothing else.

Fence check against "## Not this card":
- No change to `scripts/fetch.py`.
- No change to `scraped_at` or `data/raw/`.
- No check softened: in both `main` functions the `problems` list is built by the same `validate` calls as before; only the `if problems:` block moved above `os.makedirs`/`json.dump`.
- `scripts/build_boundary.py` was read and left alone.

Half-done check: the self-test runs copies of both parsers in a temp tree, never the real one, and asserts byte equality. `build_boundary.py`'s `build` already returns before its write.

One small thing, declared not quiet: `docs/HANDOVER.md` was edited although the plan said only three scripts. The three edits all correct statements this work made false, and the card comment says so.

Nothing crossed the fence.

VERDICT: sound

**breakage: sound**

I read both parsers and the new tests.

**What I checked**

- `main()` in `scripts/parse.py`: `validate()` and every `problems.append` site run before the gate, and the gate sits above `os.makedirs`/`json.dump`. No append happens after it, so nothing is judged too late.
- `main()` in `scripts/parse_campsites.py`: same shape; `validate()` and the two "missing raw file" appends all run before the gate.
- The only other `sys.exit` in the pipeline is in `build()` in `scripts/build_boundary.py`, which already returns before its own write.
- Callers: nothing runs the parsers except `scripts/deploy.ps1` and the run line in `CLAUDE.md`, and neither depends on a file being written on a failed run.
- Comments made false: the docstring of `scripts/parse.py` ("fails loudly and exits non-zero rather than emitting a partial dataset") is now more true, not less. The `# Rebuild the dataset` block in `docs/HANDOVER.md` and item 2 above it both name the new behaviour.
- The two new checks in `scripts/selftest.js` build their own temp tree and copy the parser in, so they never touch `app/data/`. Failure messages distinguish "wrote too early" from "deleted the file".

I tried to find a path that writes before the gate, or a caller expecting a file after a refusal. There is none.

VERDICT: sound

