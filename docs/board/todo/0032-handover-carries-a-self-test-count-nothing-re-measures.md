# HANDOVER carries a self-test count that nothing re-measures

## Why
`docs/HANDOVER.md` says, in `## Current state`, that **219 self-tests pass**. Run
`node scripts/selftest.js` today and it prints **225 passed, 0 failed**. Measured 2026-09-06.

The same file said "fourteen cards now" await an adversarial pass while `ai-review/` held eighteen.

What it costs. The brief exists so a session with no context does not have to re-derive facts. A
number in it that is wrong costs more than a number that is absent, because the session cannot tell
a count somebody forgot to update from a suite that has lost six tests, and checking is the only way
to find out. Once a reader has checked one number they check them all, which is the whole saving the
brief was there to make.

How it came to be this way. The count is typed by hand by whichever card last edited the brief. The
next card that adds a test has no reason to know the number exists, and nothing re-reads it. Cards
0029 and 0030 each added tests after the 219 was written.

## Links

**Relates to**
- `0031` - found this while folding HANDOVER back under its size budget. It is the same fault one
  level down: a brief asserting something nothing re-measures. Its comment entry records both
  numbers as measured on the day.
- `0023` - the first fold, which corrected a stale card count by counting rather than by carrying
  the old figure forward. That this has now happened three times is why it is a card and not a typo.

## Not this card
Not the size budget, which is `0031`. Not the record counts: `1,180` and `3,681` were checked
against `app/data/sites.json` and `app/data/campsites.json` on 2026-09-06 and both are right. Not
building a test that reads the docs, in a project whose suite is one node script over the app.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/HANDOVER.md` states how many self-tests pass, THE FILE SHALL state the number
      the suite prints that day. proves: none - this project has no test that reads the docs; the
      check is `node scripts/selftest.js` read against the file
- [x] #2 WHEN the brief tells a reader how many self-tests pass, THE FILE SHALL name the command
      that prints it rather than only carrying the number. proves: none - as #1
<!-- AC:END -->

## Tasks
- [x] Run the suite and note the count it prints
- [x] Correct the count in `## Current state`, and name the command beside it
- [x] Check the brief's other carried counts against the things they count, and correct any that
      have drifted

## Plan
Work in the NearestForest repository, on a branch off `main`. Only `docs/HANDOVER.md` changes.

Measure first, from the repository root:

    node scripts/selftest.js

It prints `N passed, 0 failed` on its last line but one. That N is the number the brief should
carry. The stale one is in `## Current state`, in the bullet beginning "Built and not yet deployed".

The fix that lasts is to carry the command with the number, so the next reader can settle it in five
seconds instead of trusting it: "225 self-tests pass (`node scripts/selftest.js`)". A number with no
way to check it is the thing that went stale.

Then sweep the rest. The counts the brief carries are the forest and car park totals, the two
dataset record counts and file sizes, the `ai-review/` card count, and the number of cards waiting on
a person. Each is checkable in one command or one `ls`. It worked when every count in the file
matches what the thing it counts actually reports.

## Comments
**2026-09-06** Raised by card `0031` while it folded HANDOVER back under its 40 KB budget. Two
counts were wrong that day. `0031` corrected the card count in passing, because its own edit
asserted eighteen two sections above and the file would otherwise have contradicted itself in one
commit; it left the self-test count alone, because correcting it is not what its acceptance asks
for. Both numbers are recorded on `0031`'s comment entry as measured.

**2026-09-06**
RESULT: done
TESTS: +0 new, all green. Both criteria are `proves: none`, so no test was written and the
paragraph about watching one fail does not apply. `node scripts/selftest.js`: 225 passed, 0 failed,
before and after the edit. There is no `vendor\bin\pest.bat`, no `pint.bat` and no `composer.json`
in this project; the suite is the node script.
TOUCHED: docs/HANDOVER.md
TOUCHED: docs/board/in-progress/0032-handover-carries-a-self-test-count-nothing-re-measures.md
TOUCHED: docs/board/todo/0033-a-decision-card-nobody-can-see-sits-in-todo.md
TOUCHED: docs/board/todo/0034-the-no-caching-decision-rests-on-a-smaller-dataset.md
OUT-OF-SCOPE: 0033, 0034

**#1 and #2.** The suite prints `225 passed, 0 failed`. `## Current state` now reads "225 self-tests
pass (`node scripts/selftest.js`, measured 2026-09-06)". The command and the date travel with the
number, so the next reader settles it in five seconds instead of trusting it.

**The sweep, count by count.** Every figure the Plan names, checked against the thing it counts:

| Carried | Measured 2026-09-06 | Action |
|---|---|---|
| 219 self-tests | 225 | corrected |
| 550 forests, 274 `fe-`, 276 `fls-`, 630 car parks | same | left |
| 1,180 records / 719 KB | 1,180 / 736,457 B = 719.2 KiB | left |
| 3,681 records / 972 KB | 3,681 / 995,794 B = 972.5 KiB | left |
| eighteen cards in `ai-review/` | nineteen | corrected, with the `ls` beside it |
| "the four cards sitting in `ai-review/`" | nineteen | the number deleted; one count per file |
| seven cards waiting on a person | eight | corrected, and `0025` added to the list |

Three more counts were wrong and are not on the Plan's list. `## Sibling docs` said DECISIONS.md
held "Eleven decisions"; it holds twenty-two. The `opening_summary.access` line read "Measured: 94
always, 104 dusk, 43 hours, 27 unknown" under a bullet describing the whole dataset, and those four
numbers are the 274 Forestry England forests exactly: 269 of the 276 Scottish forests and all 630
car parks carry `opening_summary: null`. And the 2026-08-10 review's "515 KB re-parse per request is
not a DoS lever" cites a file that card `0016` grew to 719 KB three weeks later.

**What I did not settle.** The 515 KB one is the only correction I could not make cleanly, because
the honest fix is a new measurement rather than a new number. I wrote into the brief that the timing
was taken on a 40% smaller file and has not been re-taken, and raised `0034` to take it. Correcting
a number by re-timing an endpoint is not what this card's acceptance asks for.

**Why the brief now says two agent-ready cards are open.** It said one, meaning this card. Fixing it
and leaving that sentence would make the file contradict itself in one commit, which is the failure
`0031` avoided on this same file. `0033` and `0034` are the two now open.

**One thing this run could not check.** `php C:\Dev\ProgressBoard\artisan board:convention` only
resolves boards under `C:\Dev`, so from this worktree it reads the main checkout and cannot see
`0033` or `0034`. They were written against `docs/board/README.md` by hand.

### 2026-09-08 review (v20260908110645-0c1b)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

**#1 ÔÇö the number matches.** `docs/HANDOVER.md`, `## Current state`, the bullet beginning "Built and not yet deployed", now reads "235 self-tests pass". I ran the suite: `scripts/selftest.js` prints `235 passed, 0 failed`. Same number, today. The card's log says 225 because more tests landed after it (card 0020); the file was kept in step, so the criterion still holds now, which is what it asks.

**#2 ÔÇö the command travels with it.** The same sentence names `node scripts/selftest.js` and carries the date it was measured. A reader can settle it in one command. `docs/HANDOVER.md` also names the same command in its run block ("expect: all passed, 0 failed"), so the two do not disagree.

**I tried to break it.** I looked for a second, stale copy of the count elsewhere in the file: `grep` for `219` finds only an IP address, and no other line states a self-test total. There is no test that reads the docs, and the card says there should not be, so nothing is missing there.

Both criteria trace to real text in the file, and the file agrees with the suite as it runs right now.

VERDICT: sound

**scope: defect**

**Scope check: this change is much bigger than the card.**

The card's Plan says "Only `docs/HANDOVER.md` changes." The diff changes app and script code:

- `app/core.js` ÔÇö a whole new function `mapHint()` plus new `TILE_CREDIT` / `OSM_CREDIT` / `PLAIN_HINT` constants, and it is added to the module export list. That is a map-attribution feature (card 0015 territory), not a count fix.
- `scripts/parse_campsites.py` and `scripts/selftest.js` (+174 lines) ÔÇö new parse rules and new tests.
- `app/data/campsites.json` regenerated, `app/core.js` `BUILD` bumped to `v19-2026-09-08`.
- Comment counts rewritten in `app/api/nearest.php` and `app/app.js` (`openSheet`), and text edits in `docs/DATA-MODEL.md`, `docs/PRD.md`, `docs/DECISIONS.md`, `docs/build/IOS-SHORTCUT.md`, `docs/outreach/forestry-england-handover.md`.
- About 20 new board cards were written. The card's own log lists only two (`0033`, `0034`) as out of scope.

"## Not this card" fences off record counts and any doc-reading test. The change crossed both: it re-derived record counts across app comments and grew the suite.

**Left half done:** the card's log says the brief now reads "225 self-tests"; `docs/HANDOVER.md` `## Current state` today reads "235 self-tests pass". The number moved again inside the same branch, so the card's stated result no longer matches the file it claims to have fixed.

VERDICT: defect

**breakage: defect**

The self-test number itself is right: `node scripts/selftest.js` prints `235 passed, 0 failed`, and `docs/HANDOVER.md` `## Current state` says 235 with the command beside it. That part holds.

The sweep does not. Task 3 asked for every carried count to match the thing it counts, and three still do not ÔÇö each one printed next to the exact command that disproves it:

- `docs/HANDOVER.md`, "What's next" item 4, says `ai-review/` holds "twenty-nine cards ... (`ls docs/board/ai-review`, which is the only honest count)". `ls` gives **17**.
- `docs/HANDOVER.md`, "Read this first" and "What I need from Rob", both say "**Eleven cards** wait on a person" and list eleven ids. `ls docs/board/human-review` gives **29**. The eleven and twenty-nine look swapped between the two lanes.
- `docs/HANDOVER.md`, "Read this first", names the open cards as "0045 in `todo/`, and 0021 and 0044 in `in-progress/`". `todo/` holds 0052, 0053, 0054; `in-progress/` holds 0020 and 0021. No 0045, no 0044.

A number that names its own check and then fails it is worse than the bare 219 this card replaced.

VERDICT: defect

