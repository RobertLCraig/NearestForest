# The data model shows a credit the dataset stopped carrying

## Why
**The document a person reads before touching the generator shows the wrong credit.**
`docs/DATA-MODEL.md` illustrates the shape of `app/data/sites.json` with a worked example, and at
line 90 that example reads:

    "attribution": "Contains public sector information licensed under the Open Government Licence v3.0.",

That string no longer exists anywhere. The shipped file carries a four-part sentence naming Forestry
England, Forestry and Land Scotland and the Forestry Commission, written into it by the
`ATTRIBUTION` constant in `scripts/parse.py`. The same example's `generated_at` reads `2026-08-29`
against a shipped `2026-09-10`.

**What it costs.** The credit is a licence statement, not a label. Forestry England's own wording
and the Open Government Licence attribution for two more agencies are what this dataset is allowed
to ship under, and the only document describing that field shows a version that credits one agency
by name and none of the three. A reader changing the parser reads this file first.

**And nothing catches it.** Card `0019` built a three-way pin over that string: a check on the
shipped file, a check that the footer in `app/index.html` and the `ATTRIBUTION` constant name the
same agencies, and checks on the footer itself. The document is the fourth copy and no check reads
it, so it can keep contradicting the other three indefinitely.

**How it came to be this way.** Card `0019` replaced the one-line credit with the named one and
updated the generator, the shipped file and the footer. A reviewer named `docs/DATA-MODEL.md`
alongside the parser and the guard; the build answered the parser and the guard and said nothing
about the document.

## Links

**Relates to**
- `0019` - the card that retired the wording and left this copy behind. Its 2026-09-11 review is
  the finding this card comes from, and that card is in `human-review/` waiting on a different
  question, so the finding would not have been picked up off its thread.
- `0069` - the merge that carried that review onto the surviving copy of `0019` and raised this.

## Not this card
**Not changing the credit itself.** `ATTRIBUTION` in `scripts/parse.py`, the footer and the shipped
file agree with each other and are right. Only the document disagrees.

**Not re-running the pipeline.** `app/data/sites.json` is not touched, so no dataset changes and
nothing needs a cache bump.

**Not auditing the rest of `docs/DATA-MODEL.md`.** The `counts` and `counts_by_country` values in
the same example block are correct against the shipped file and were checked while raising this.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 THE `sites.json` EXAMPLE in `docs/DATA-MODEL.md` SHALL carry the `attribution` string and
      the `generated_at` value that `app/data/sites.json` holds. proves: `the data model example
      matches the shipped dataset header`
- [x] #2 WHEN the self-test suite runs, THE SUITE SHALL fail if either value in that example
      differs from the shipped file, naming which. proves: `the data model example matches the
      shipped dataset header`
<!-- AC:END -->

## Tasks
- [x] Write the assertion first and watch it name both the credit and the date before editing the doc
- [x] Copy the shipped `attribution` and `generated_at` into the example block
- [x] Re-run the suite

## Plan
**Where to stand.** This repository, on a branch of `main`. There is no PHP suite here and no
`vendor/`, so `pest` and `pint` do not exist. The suite is `node scripts/selftest.js`. It is red at
HEAD on three assertions that are not yours: two are the undeclared `requests` module, which is card
`0071`, and one is a board card over the file-reader size limit, which is card `0055`.

**Confirm the defect**, from the repository root in PowerShell:

    node -e "const d=require('./app/data/sites.json'); console.log(d.attribution); console.log(d.generated_at)"

Then read lines 86 to 93 of `docs/DATA-MODEL.md` and compare. The credit differs outright; the date
is eleven days behind.

**The check goes in `scripts/selftest.js`**, in the block that already reads counts carried in prose
for card `0036`, which is where every other "a document repeats a dataset fact" assertion on this
project lives. It reads the fenced JSON block under the `data/sites.json` heading in
`docs/DATA-MODEL.md`, pulls `attribution` and `generated_at` out of it, and compares both against
the parsed `app/data/sites.json`. Name it exactly `the data model example matches the shipped
dataset header`.

**The cost of pinning the date, and take it knowingly.** Once the check is in, re-running the
pipeline changes `generated_at` and turns the suite red until one line of the document is updated.
That is the same shape as `CACHE` in `app/sw.js` having to match `BUILD` in `app/core.js`, which
this project already enforces for the same reason: a document that is allowed to drift is one that
has drifted. If a builder judges the date not worth the upkeep, the alternative is to drop
`generated_at` from the example rather than to leave a stale literal in it, and to say so on this
card. Do not leave it showing a date nobody maintains.

**Red-proof it on the real defect.** Both values are wrong at HEAD, so the first run of a correct
check is red naming both, before the document is touched. Then fix the document and watch it go
green. Then, to show it is not a check that passes on anything, change one character of the credit
in the document and confirm the run names it.

## Comments

**2026-09-11** WRITTEN AFTER THE FINDING, NOT AFTER THE WORK. The criteria are the reviewer's
finding turned into checks and nothing here is built yet, so every box is honestly unticked. The
finding itself is the `scope: defect` verdict of the 2026-09-11 review on card `0019`, which is
quoted in full on that card's thread.

**2026-09-12**
RESULT: done
TESTS: +1 new, all green
TOUCHED: scripts/selftest.js, docs/DATA-MODEL.md, docs/board/in-progress/0073-the-data-model-shows-a-credit-the-dataset-stopped-carrying.md
OUT-OF-SCOPE: none

The check went in first, in the card 0036 block as the Plan asks, named `the data model example
matches the shipped dataset header`. It finds the fenced JSON example after the `data/sites.json`
heading, pulls `attribution` and `generated_at` back out of it as JSON string literals, and compares
both against the parsed `app/data/sites.json`.

**Red-proofed three ways.** Its first run at HEAD failed naming both values: the example's one-line
Open Government Licence credit against the shipped four-part sentence, and `2026-08-29` against
`2026-09-10`. Then the document was corrected and it went green. Then one word of the credit in the
document was changed to `Forestry Englando` and the run named it again, so it is not a check that
passes on anything. The restored file is green.

**One honest false start, recorded because it is the failure mode this board keeps finding.** The
fence matcher was first written `/```json\n/`, which matches nothing in a CRLF checkout, so the
first red run failed with `no fenced json example found` rather than on the defect. That is a red
for the wrong reason and would have been a check that could never pass, not one that could never
fail. It is now `\r?\n`, with a comment saying why.

**The date is pinned and the upkeep is taken knowingly**, per the Plan. Re-running the pipeline
moves `generated_at` and turns the suite red until one line of the document moves with it, the same
bargain as `CACHE` in `app/sw.js` matching `BUILD` in `app/core.js`. Dropping the date from the
example was the offered alternative and was not taken: a worked example showing counts and a credit
but no date reads as though the field were optional. A bullet under the example now says both values
are pinned and by which test, so a reader who re-runs the pipeline learns it from the document
rather than from a red run.

**Suite state.** `node scripts/selftest.js` reports 311 passed, 1 failed. The one failure is `no
board card is too large for the agent file reader` on card `0020` at 209.9 KB, which HANDOVER names
as deliberately red and card `0055` carries. The two `requests`-module assertions the Plan expected
to be red are green here, because this worktree has the module installed; nothing on this card
touches them. No PHP suite exists in this repository, so `pest` and `pint` were not run.

**Not touched:** `app/data/sites.json`, `scripts/parse.py`, the footer. The credit itself was
already right in all three.
