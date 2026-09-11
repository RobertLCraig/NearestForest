# Three live files still say the dataset holds 904 records

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
- [x] #4 WHEN the comment above `safeHref` carries a number, THE SUITE SHALL check that number
      against `app/data/sites.json`, so all four of them are guarded rather than only the first.
      proves: `dataset counts in comments match sites.json`
<!-- AC:END -->

## Tasks
- [x] Write the failing self-test first: assert the counts named in those three files against the
      counts read out of `app/data/sites.json`, and watch it fail on today's 904s
- [x] Correct the three numbers, and the single-agency claim in `app/core.js`
- [x] Leave `docs/DECISIONS.md` and `docs/DATA-MODEL.md` alone; see `## Not this card`
- [x] Guard the other three numbers in the `safeHref` comment, the per-agency split and the count of
      records with no url, in the same `carried` list the first one uses

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
TESTS: +2 new, all green (227 passed, 0 failed, `node scripts/selftest.js`)
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
of that, and also says out loud that `safeHref()` checks the scheme and never the host, the point
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
changed, the diff under `app/` is two comments and two version strings.
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

**2026-09-10** Rob's call, answering the queue: **re-run this card through `ai-review/`.** It met
its own acceptance - the reviewer graded that lens `sound` - and the finding that returned it is
next door to the card rather than inside it. A builder could not act on it and a reviewer may not
untick a box, so the card sat here fully ticked while every unattended run promoted it again. It is
not closed and it is not reopened. It goes back for a fresh adversarial pass with the earlier
verdicts still on the thread, and that pass decides whether the finding is this card's to carry.

### 2026-09-10 review

**suite**

`node scripts/selftest.js` from the repository root: **280 passed, 0 failed**, before and after. The
test all three criteria name, `dataset counts in comments match sites.json`, ran under
`--- dataset counts carried in prose (card 0036) ---`. I read that off the run log.

Counted from `app/data/sites.json` myself, not taken from the card: **1,180** records, **550**
carrying a `url`, **274** `www.forestryengland.uk`, **276** `forestryandland.gov.scot`, **630** with
no `url`. The card's figures are right.

**acceptance: defect**

**#1 and #2 hold, and I proved them red.** Changed `Every one of the 550 records` to `551` in
`app/core.js`: RED, *"app/core.js: says 551, dataset holds 550"*. Replaced
`forestryandland.gov.scot` with another host in the same comment: RED, *"app/core.js names only one
upstream agency for its dataset URLs"*. Both restored, green. `app/api/nearest.php` and
`docs/build/IOS-SHORTCUT.md` both read 1,180 and the guard reads both back.

**#3 is disproved, and this is the finding.** It promises: *"THE SUITE SHALL fail if one of these
carried counts no longer matches `app/data/sites.json`"*. The comment this card wrote above
`safeHref()` carries four counts. I falsified the other three at once - 274 to **999**, 276 to
**888**, 630 to **777** - so the comment then read that 999 records are on forestryengland.uk, 888
on forestryandland.gov.scot and 777 car parks carry no url, out of 550 records total, which is
arithmetic nobody could defend. The suite said:

    PASS  dataset counts in comments match sites.json
    PASS  both upstreams really are in the data

Restored, green. So three of the four counts in the guarded comment are not guarded. The `carried`
table reads exactly one number out of `core.js`, `/Every one of the ([\d,]+) records/`, and the
second check only tests that both host *names* appear as strings - it never looks at the numbers
beside them.

This is the card's own promise measured against the card's own artefact, not a wish read into it.
The earlier reviewer called the same thing a soft spot under `acceptance: sound` and a break under
`breakage`; having actually falsified the numbers and watched the suite stay green, I put it under
acceptance, because #3 says "one of these carried counts" and three of them are unreachable.

I am not unticking anything - a reviewer may not. Recording it so a person can.

VERDICT: defect

**scope: sound**

Stated up front: **no git command was run**, so I could not re-open the earlier scope finding, which
was that the branch carried other cards' commits. That complaint has since dissolved on its own:
0020 and 0034 have landed, and the tree on `main` today is coherent.

What I could check held. The two fenced files are correct and untouched in substance:
`docs/DATA-MODEL.md:89` still reads `"counts_by_country": { "England": 904 }`, and I confirmed that
is the trap the card warned about rather than a miss - 274 English forests plus 630 English car parks
is exactly **904**. `docs/DECISIONS.md` still carries its 904 inside the dated 2026-08-10 entry,
which is right, because rewriting an append-only record would falsify it. `safeHref()` itself is
unchanged: `/^https:\/\/[^\s/?#]/i`, scheme only, never the host - which is what the comment now says
out loud.

The guard has grown since this card built it, and the growth is other cards' and properly attributed
in the source: rows for `docs/DATA-MODEL.md`'s stale-date sentence (card 0039) and for both halves of
`app/app.js`'s campsite hours sentence (card 0020). The mechanism this card built is being reused,
which is the best evidence it was the right shape.

VERDICT: sound

**breakage: defect**

Same break as under acceptance, stated as drift rather than as a promise: add ten Scottish forests
tomorrow and 274, 276 and 630 all become false while `node scripts/selftest.js` prints
`281 passed, 0 failed`. That is precisely the failure this card exists to stop, and the card's own
rewrite is what enlarged the surface - the comment had one number before it and has four now.

**What a builder does, and it needs no untick.** Three more rows in the `carried` table in
`scripts/selftest.js` around line 2487, in the shape already there:

    ['app/core.js', /- (\d+)\s*\n?\s*on forestryengland\.uk/, 274-equivalent live count]
    ['app/core.js', /on forestryandland\.gov\.scot/, 276-equivalent live count]
    ['app/core.js', /The other ([\d,]+)\s*\n?\s*records, the car parks/, no-url count]

with the expected values computed live from `sites.json` the way the existing rows are, never
hard-coded. Mind that the comment wraps mid-sentence between numbers and their words, so the
patterns have to tolerate a newline - that is the reason the existing single row is anchored on
`Every one of the ([\d,]+) records`, which happens not to wrap. The alternative the card's
`## What I need from you` offers - delete the three numbers from the comment - also closes it, and
costs a reader the detail. I would add the rows.

**Security, per the board README's three questions.** The code this card produced is two comments,
two version strings and a test.

1. **Weakest point.** Not the change - the thing the change describes. `safeHref()` checks the
   scheme and never the host, so any https URL in the dataset becomes a live link. That is fine
   while `parse.py` holds `URL_HOSTS` closed to three hosts, and it is the coupling to watch: loosen
   the parser's allowlist and `safeHref()` will not notice. The comment now says this in the file,
   which is an improvement on a reader having to derive it.
2. **Unchecked.** The comment's counts, which is the finding above. Nothing else: the new test reads
   repository files at development time, takes no input, and runs nowhere near a request.
3. **Leak on failure.** Record counts and file paths into a developer's terminal. Nothing that
   identifies a person and nothing an outside party sees.

**No UI surface, and I am claiming it rather than skipping it.** Two shipped files changed and
neither changes a pixel: a comment in `app/core.js` and the `CACHE` string in `app/sw.js`. `BUILD` in
`core.js` and `CACHE` in `sw.js` both read `v24-2026-09-08` and match, which the suite enforces and
which is green. There is no screen whose behaviour differs, so a browser pass would photograph an
unchanged app.

VERDICT: defect

**2026-09-10** RESULT: done
TESTS: 3 rows added to the existing check, all green (285 passed, 0 failed)
TOUCHED: scripts/selftest.js
OUT-OF-SCOPE: none

Picked up as part of the brief's "What's next" item 1, the tests that cannot fail. **One criterion
was added and was written before the code.** No existing box was touched. Rob's own note on this
card offered two routes and recommended guarding the three numbers rather than deleting them, so
that is what was done.

**The fault is worth naming precisely, because it is subtle.** This card's first build was correct:
it found three stale `904`s, fixed them, and wrote a guard so the next drift would fail a run. But
the rewrite grew the `safeHref` comment from one number to four, and the guard was written against
the sentence as it stood before. So a card whose whole purpose is stopping numbers rotting in
comments left three more numbers rotting in a comment, and the suite would have said nothing. Adding
ten Scottish forests would have made three of the four false on a green run.

**Three rows added to the same `carried` list**, not a second test beside it. The list already
carries file, pattern and expected value per row, so this is the shape it was built for, and all
four numbers now report through one named check with per-file detail in the failure message. The new
patterns use `\s+` where the sentence wraps across three lines, so re-wrapping that comment cannot
silently unhook a check. That is the same trap the `records now read` regex hit today on card `0019`.

**Proved red before it was trusted.** Changing all three numbers at once in `app/core.js`, 274 to
284, 276 to 226 and 630 to 730, gave `FAIL dataset counts in comments match sites.json, app/core.js:
says 284, dataset holds 274 | app/core.js: says 226, dataset holds 276 | app/core.js: says 730,
dataset holds 630`. All three named separately, which is what makes the failure actionable.
Restored, and `git diff` confirms `app/core.js` byte-identical.

**Nothing under `app/` changed**, so `CACHE` and `BUILD` are untouched at `v26-2026-09-10` and there
is nothing to deploy. **No browser check, and that is a claim rather than a skip**: the only file
this build touched is `scripts/selftest.js`, which the app never loads.

**The counts are today's, re-measured after the dataset rebuild** earlier on 2026-09-10: 1,180
records, 550 with a `url`, 274 on `forestryengland.uk`, 276 on `forestryandland.gov.scot`, 630 with
no `url`. The rebuild did not move any of them, which the check now proves on every run rather than
leaving to a reader.

### 2026-09-11 review (v20260911025445-07f3)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

**AC1 ÔÇö the three files say today's count.** `app/api/nearest.php` header comment and `docs/build/IOS-SHORTCUT.md` both read 1,180. The `safeHref()` comment in `app/core.js` reads 550 records with a url. The shipped file holds 1,180 records, 550 with a url. Match.

**AC2 ÔÇö both agencies named.** The same `safeHref()` comment names forestryengland.uk and forestryandland.gov.scot. A second check in `scripts/selftest.js`, in the block "dataset counts carried in prose (card 0036)", pushes a failure if either host string is missing from `app/core.js`.

**AC3 ÔÇö the suite fails on drift.** The `carried` table in that block holds a row per claimed number, each expected value computed live from `sites.json`, reported through one check named `dataset counts in comments match sites.json`.

**AC4 ÔÇö all four numbers above `safeHref` are guarded.** This was the open finding. Three rows now exist for 274, 276 and 630, beside the original 550 row. I re-ran every pattern against `app/core.js` and the live data: 274/274, 276/276, 630/630, 550/550. The wrap-tolerant `\s+` is present where the sentence breaks lines.

The earlier defect is closed.

VERDICT: sound

**scope: sound**

Scope check of the latest pass on card 0036.

The only commit for this card since the last review is `bd137bd`. It changes two things: the `carried` table inside the `dataset counts carried in prose (card 0036)` block in `scripts/selftest.js`, and the card file itself. Nothing else moved.

The fence holds. In `docs/DATA-MODEL.md` the `counts_by_country` block still reads `England: 904`, which the card says is correct and must stay. In `docs/DECISIONS.md` both 904s still sit inside their dated entries, untouched. `safeHref` in `app/core.js` is unchanged, still scheme-only.

The earlier scope complaint about unrelated files (`app/map.js`, `app/api/tiles.php`, `app/data/campsites.json`, the outreach briefing) is not this card's work. Those arrived on other cards' commits and are attributed as such in the same `carried` table, with rows named for cards 0038, 0039, 0054.

Nothing left half done in this lens. The three extra numbers in the `safeHref` comment, 274, 276 and 630, all now have a row in the same table, computed live from `app/data/sites.json`, and they match the comment text as it stands.

VERDICT: sound

**breakage: sound**

**breakage**

I attacked the new guard, not the whole branch.

What I did:

- Read the `carried` table in `scripts/selftest.js` and the `safeHref` docblock in `app/core.js`.
- Ran each of the four patterns against `app/core.js` myself. They return 550, 274, 276, 630.
- Counted the shipped file myself: 1,180 records, 550 with a `url`, 274 `www.forestryengland.uk`, 276 `forestryandland.gov.scot`, 630 with none. All four match.

Tries that failed to break it:

- **A host the row filters miss.** The 274 row allows `www.` and the 276 row does not. `URL_HOSTS` in `scripts/parse.py` is a closed set of exactly those three spellings, so no record can dodge both rows today.
- **A re-wrap unhooking a check.** The two wrapping rows use `\s+`. A wrap in the one place without it makes the pattern miss, and a miss reports `no count matching`, which fails loudly, not silently.
- **A comment made false by the change.** The block comment in `scripts/selftest.js` names the fault and the reason for `\s+`, and both are true of the code beside it. The `safeHref` docblock claim that the check reads the scheme and never the host matches `safeHref` in `app/core.js`.
- **A stale sibling.** Both `app/api/nearest.php` and `docs/build/IOS-SHORTCUT.md` read 1,180 and both are in the table.

I could not make it pass while wrong.

VERDICT: sound

### 2026-09-11 review (v20260911193239-366f)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Traced each criterion to code in `scripts/selftest.js`, block `dataset counts carried in prose (card 0036)`, and to the `safeHref` docblock in `app/core.js`.

**#1** The `carried` table rows for `app/api/nearest.php` (`ranking ([\d,]+) sites`) and `docs/build/IOS-SHORTCUT.md` (`rank ([\d,]+) sites on device`) compare against `sites.length`; both files read 1,180. The `core.js` row compares against the count of records with a `url`, and the docblock says 550. Measured from the shipped file: 1,180 records, 550 with a url.

**#2** The `safeHref` docblock names both `forestryengland.uk` and `forestryandland.gov.scot`, with 274 and 276 beside them. I counted 274 and 276.

**#3 and #4** The earlier finding is closed. The `carried` table now holds three further `app/core.js` rows, for the two host splits and `The other ([\d,]+)\s+records, the car parks`, each with its expected value computed live from `sites.json` rather than hard-coded. All four numbers in that docblock are now read back. The patterns use `\s+` where the sentence wraps, so re-wrapping cannot unhook them, and `no count matching` is reported as a failure rather than passing silently.

The named check `dataset counts in comments match sites.json` and `both upstreams really are in the data` both pass. The suite's three current failures are elsewhere: a missing Python `requests` module in two fetch stubs, and card 0020 exceeding the file-reader size limit. Neither touches this card.

VERDICT: sound

**scope: sound**

**What the last build did.** In `scripts/selftest.js`, inside the `dataset counts carried in prose (card 0036)` block, it added exactly three rows to the `carried` table: the `forestryengland.uk` split, the `forestryandland.gov.scot` split, and the no-url car park count. That is verbatim the card's fourth `## Tasks` bullet. No new file, no new test function, no code path.

**Fences held.** `docs/DATA-MODEL.md` still carries `"counts_by_country": { "England": 904, "Scotland": 276 }`, which is correct and is the trap the card named. `docs/DECISIONS.md` is untouched by this pass. `safeHref` in `app/core.js` is unchanged; only the comment above it is read by the new rows.

**The wider diff is not this card's growth.** The other rows in the same `carried` table are attributed in source to their own cards: the three briefing rows to `0038`, the stale-date row to `0039`, both campsite-hours rows to `0020`. Those are reuse of the mechanism this card built, each landing with its own card.

**Nothing left half done.** All four numbers in the `safeHref` comment now report through the one named check, which is what the returning finding asked for.

VERDICT: sound

**breakage: defect**

**Finding: `counterDir()` in `app/api/tiles.php` disagrees with `readKey()` about where the key lives.**

`readKey()` accepts three sources: the `THUNDERFOREST_KEY` environment variable, `../../../tiles.key`, and `../../tiles.key` for the case where the docroot is the repository root. `counterDir()` tests only the first file path. On either of the other two supported layouts the layer works and serves tiles, but the counter directory silently falls back to the system temp directory. That is precisely the world-writable co-tenant case the new docblock above `counterDir()` says it exists to avoid, and its own sentence, "where tiles.key is readable, that directory is ours by construction", is false on those layouts because the key is readable by a route the function never asks about. Nothing fails, nothing logs, and the rate limit is seedable again. The docblock reads as a guarantee the code does not make.

Card 0036's own surface holds. I tried the count rows in `scripts/selftest.js` against the four numbers in the `safeHref()` docblock in `app/core.js`, including the two that wrap mid-sentence, and each has a row with a live expected value. `mapHint()` and `dataChecked()` are both called and both covered.

VERDICT: defect
