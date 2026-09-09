# Three live files still say the dataset holds 904 records

## What I need from you

**One choice, and I recommend the first.**

1. Untick a criterion and send this card back to `todo/`, so a session guards the three numbers the
   new check does not read. That is three lines in `scripts/selftest.js`.
2. Or write on the thread that those three numbers should be deleted from the comment instead, and
   send it back for that.

**What's wrong.** The three stale `904`s are fixed and the reviewer counted the shipped file to
confirm it. The problem is what the fix left behind. The comment above `safeHref` in `app/core.js`
now carries **four** numbers: 550 records with a link, 274 English, 276 Scottish, 630 car parks. The
new guard this card built reads back only the 550. Add ten Scottish forests and three of those four
numbers quietly go wrong while the suite still passes. The card exists to stop numbers drifting in
comments, and it made the unguarded surface bigger.

**Cause.** The rewrite added detail to the comment and the guard was written against the sentence as
it stood before, not after.

**Pass** is either route above, recorded here with today's date, and then a session doing it.

**Fail** is neither. The boxes stay ticked, no session finds anything open, and the loop promotes the
card again on the ticks.

**Why it needs you.** Only you may untick a criterion. There is also a real choice underneath: a
comment that carries four checked numbers is more useful to a reader than one that carries a single
checked number, and it costs three more lines of test to keep honest.

**Note on length.** This section takes the card past the 100-line budget. `## Comments` and the
review verdicts are append-only, so nothing here could be cut to make room.

## Why
`app/data/sites.json` holds **1,180 records** today: 630 car parks and 550 forests. Three files that
a reader treats as current still describe it as **904**, which is what it held before card `0016`
added Forestry and Land Scotland. Measured 2026-09-06 against the shipped file.

- `app/api/nearest.php:6` - "ranking 904 sites in-app would take far too long". This is the stated
  reason the endpoint exists at all.
- `docs/build/IOS-SHORTCUT.md:7` - "too slow to rank 904 sites on device". Same claim, second copy.
- `app/core.js:233` - "Every one of the 904 records is an https:// forestryengland.uk page today".
  **This one is wrong twice.** 550 records carry a `url`, not 904, and 276 of those 550 are
  `forestryandland.gov.scot` pages rather than `forestryengland.uk` ones.

What it costs. The first two overstate the on-device workload by a quarter, so anybody re-costing the
Shortcut decision starts from a number that is too small in the wrong direction: the real figure is
1,180 and the argument for the endpoint is *stronger* than the comment claims. The third is the
justification written above `safeHref()` for why that guard covers "a door that is already shut". A
reader checking that sentence finds it false and has no way to tell whether the guard is stale too.
**It is not**: `safeHref()` tests the scheme and never the host, so both upstreams pass it and
nothing is unguarded. The defect is that the comment no longer describes the data it is about, which
is the one thing a reader cannot verify without doing the count themselves.

How it came to be this way. Card `0016` grew the dataset from 904 to 1,180 and added a second
agency. It updated `docs/HANDOVER.md` and `docs/DATA-MODEL.md`, which is where counts were expected
to live. Nothing re-reads a number written into a code comment, and no test asserts one.

## Links

**Relates to**
- `0016` - added the 276 Scottish forests that moved the count from 904 to 1,180. Not a fault on that
  card: these three numbers were in comments, and nothing points from the dataset to them.
- `0032` - checked every count `docs/HANDOVER.md` carries against the thing it counts, and fixed that
  file. It did not look outside it, so these three survived.
- `0034` - found these while re-timing the endpoint against the grown dataset.

## Not this card
Not changing `safeHref()` or any other code path. The guard is correct; only the comment above it is
stale. Not touching `docs/DECISIONS.md:392`, which says 904 inside a dated 2026-08-10 entry and is
append-only: it was true when written and rewriting it would falsify the record. **Not touching
`docs/DATA-MODEL.md:89`, where `"counts_by_country": { "England": 904 }` is CORRECT** - England
really does hold 904 of the 1,180, being 274 English forests plus 630 car parks. That collision is
the trap on this card: two of the 904s in the tree are right.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN a reader opens `app/api/nearest.php`, `docs/build/IOS-SHORTCUT.md` or `app/core.js`,
      THE FILE SHALL state the record count `app/data/sites.json` holds today rather than 904.
      proves: `dataset counts in comments match sites.json`
- [x] #2 WHEN `app/core.js` names the upstream that dataset URLs come from, THE FILE SHALL name both
      agencies, since 276 of the 550 URLs are `forestryandland.gov.scot`.
      proves: `dataset counts in comments match sites.json`
- [x] #3 WHEN a future card grows the dataset again, THE SUITE SHALL fail if one of these carried
      counts no longer matches `app/data/sites.json`, so the next drift is caught by a run rather
      than by somebody reading. proves: `dataset counts in comments match sites.json`
<!-- AC:END -->

## Tasks
- [x] Write the failing self-test first: assert the counts named in those three files against the
      counts read out of `app/data/sites.json`, and watch it fail on today's 904s
- [x] Correct the three numbers, and the single-agency claim in `app/core.js`
- [x] Leave `docs/DECISIONS.md` and `docs/DATA-MODEL.md` alone; see `## Not this card`

## Plan
Work in the NearestForest repository, on a branch off `main`. From the repository root, the numbers
this card asserts are read straight out of the shipped file:

    node -e "const d=require('./app/data/sites.json');console.log(d.sites.length)"

which prints 1180 today, and the per-source and per-host splits are in `## Why` above.

The suite is `node scripts/selftest.js` and it already reads `app/data/sites.json`; there is no PHP
suite in this project, no `vendor/`, no Pest. It also already greps every tracked file for a
committed key, so a test that reads a source file and checks a number against the data is the shape
the file is used to. `app/core.js` is `require()`d by the tests, so the comment lives in a file the
suite already loads.

**Bumping `CACHE` in `app/sw.js`.** `app/core.js` is a shipped file, so changing it is an `app/`
change and `scripts/deploy.ps1` refuses to ship one without a bump; `core.js` `BUILD` must match the
new cache name and a self-test enforces it. A comment-only edit still changes the bytes served.

It worked when `node scripts/selftest.js` passes, the new test fails if any of the three numbers is
put back to 904, and no number outside those three files moved.

## Comments
**2026-09-06** Raised by card `0034` while it re-timed `api/nearest.php` against the grown dataset.
`0034` only changed `docs/HANDOVER.md`, so correcting comments in shipped files was outside it.

**2026-09-06** RESULT: done
TESTS: +2 new, all green (227 passed, 0 failed — `node scripts/selftest.js`)
TOUCHED: scripts/selftest.js
TOUCHED: app/api/nearest.php
TOUCHED: docs/build/IOS-SHORTCUT.md
TOUCHED: app/core.js
TOUCHED: app/sw.js
TOUCHED: docs/board/todo/0038-the-forestry-england-briefing-counts-predate-scotland.md
TOUCHED: docs/board/todo/0039-data-model-counts-the-stale-date-stamps-as-904.md
TOUCHED: docs/board/in-progress/0036-the-904-record-count-outlived-card-0016.md
OUT-OF-SCOPE: 0038, 0039

Test first, and it was red for the stated reason before any file moved: a new section
`--- dataset counts carried in prose (card 0036) ---` reads the claimed number back out of each of
the three files with a regex, and compares it to `app/data/sites.json`. On the unfixed tree it
reported `nearest.php: says 904, dataset holds 1180`, the same for `IOS-SHORTCUT.md`,
`core.js: says 904, dataset holds 550`, and `core.js names only one upstream agency`. After the
fix I put 904 and the single-agency wording back into `core.js` and watched it go red again, so
the test catches the drift rather than merely agreeing with today's file.

The regexes are deliberately loose about the digits and tight about the surrounding words
(`ranking ([\d,]+) sites`, `rank ([\d,]+) sites on device`, `Every one of the ([\d,]+) records`),
so a future count change is caught and a reworded sentence that drops the number fails too. It is
one `ok()` named exactly as the acceptance cites it, with the per-file detail in its failure
message, because three separately named checks would not match the name the card asked for.

Measured, not assumed: 1,180 records, 550 with a `url` (274 `www.forestryengland.uk`, 276
`forestryandland.gov.scot`), 630 car parks with no `url` at all. The `core.js` comment now says all
of that, and also says out loud that `safeHref()` checks the scheme and never the host — the point
the card makes in `## Why` and the thing a reader could not otherwise tell.

`CACHE` in `app/sw.js` and `BUILD` in `app/core.js` bumped `v16-2026-09-05` -> `v17-2026-09-06`, as
`## Plan` requires: two shipped files changed, `deploy.ps1` refuses an unbumped `app/` change, and a
self-test enforces that the two strings match.

There is no PHP suite in this project, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not
exist and `vendor/` is absent; the suite is `node scripts/selftest.js`, run from this worktree.

`docs/DECISIONS.md` and `docs/DATA-MODEL.md:89` untouched, per `## Not this card`. Two other stale
904s turned up outside the three files and are raised rather than fixed: `0038` for the outward-facing
Forestry England briefing, which lists `904 locations, 274 forests` in a table marked **Verified**,
and `0039` for `docs/DATA-MODEL.md:168`, which says 904 records carry the stale `2026-08-29` stamp
when 1,180 do. Both cards ask for a row added to this card's `carried` table rather than a new test.

Not checked in a browser: this is a worktree and Herd serves `C:\Dev\NearestForest`. Nothing visual
changed — the diff under `app/` is two comments and two version strings.
</content>

### 2026-09-08 review (v20260908115742-c766)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I checked each box against real code.

**AC1 ÔÇö the three files say today's count.**
`app/api/nearest.php` header comment says "ranking 1,180 sites". `docs/build/IOS-SHORTCUT.md` says "rank 1,180 sites on device". `app/core.js`, in the comment above `safeHref()`, says 550 records carry a url. `sites.json` holds 1180 records, 550 with a url. All match.

**AC2 ÔÇö both agencies named.**
The same `safeHref()` comment names `forestryengland.uk` (274) and `forestryandland.gov.scot` (276). I counted the data: 274 and 276. Correct.

**AC3 ÔÇö the suite fails on future drift.**
`scripts/selftest.js`, block "dataset counts carried in prose (card 0036)", builds a `carried` table of file + regex + expected count and compares to `sites.json`. The check `ok('dataset counts in comments match sites.json', ...)` is named exactly as the acceptance cites. A second check pushes a failure if `core.js` does not mention both hosts. I ran it: 237 passed, 0 failed.

One soft spot, not an AC breach: the 274/276 split inside the `core.js` comment is not itself asserted, only the 550 is. Those two numbers can drift silently.

VERDICT: sound

**scope: defect**

Scope findings, against the card's fence.

The change as git records it is far wider than the card. The card names five files plus its own board cards. The diff also carries:

- `app/core.js` ÔÇö a whole new `mapHint()` function and the `TILE_CREDIT` / `OSM_CREDIT` / `PLAIN_HINT` constants, plus a new export. The card says "Not changing `safeHref()` or any other code path." A new exported function is a new code path.
- `app/map.js` and `app/app.js` ÔÇö `app.js` rewrites the campsite hours comment (3,723 ÔåÆ 3,675). Not one of the three named files.
- `app/data/campsites.json` ÔÇö regenerated data, with `scripts/parse_campsites.py` changed. The card touches no generator and no dataset.
- `docs/DATA-MODEL.md` ÔÇö fenced explicitly by `## Not this card`, yet it is in the diff, and its stale-stamp line now reads 1,180, which the card said it was raising as `0039` rather than fixing.
- `docs/DECISIONS.md` ÔÇö fenced as append-only, yet it shows 4 changed lines.
- `docs/PRD.md`, `docs/outreach/forestry-england-handover.md` ÔÇö the outreach file is exactly what `0038` was raised to defer.

Half done: the card claims those two other 904s were raised, not fixed. The tree shows them fixed anyway, so the raised cards and the work no longer agree.

Either the branch carries other cards' work, or this card grew past its own fence. Both need sorting before it lands.

VERDICT: defect

**breakage: defect**

What I did: I attacked the change, not the whole branch.

Holds up: `app/api/nearest.php` header comment, `docs/build/IOS-SHORTCUT.md` and the `safeHref()` docblock in `app/core.js` all read 1,180 / 550 today; I counted the shipped file and got 1180 records, 550 with a `url`, 274 `forestryengland.uk`, 276 `forestryandland.gov.scot`, 630 with no `url`. `CACHE` in `app/sw.js` and `BUILD` in `app/core.js` match.

One break:

The rewritten `safeHref()` docblock in `app/core.js` now carries **four** numbers: 550, 274, 276 and 630. The new self-test block "dataset counts carried in prose (card 0036)" in `scripts/selftest.js` only reads back the 550, with `/Every one of the ([\d,]+) records/`. Add ten Scottish forests and 276 and 630 become false while the suite stays green ÔÇö the same silent drift the card exists to stop. The change made the unguarded surface bigger, not smaller.

What to do next: add rows for the two host splits and the no-url count, or drop those numbers from the comment.

VERDICT: defect


**2026-09-08** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 3 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 3 of 3 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.
