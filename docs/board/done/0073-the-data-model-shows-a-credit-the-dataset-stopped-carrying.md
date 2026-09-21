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

### 2026-09-12 review (v20260912144056-0186)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: unclear**

API Error: Can't reach the API server ÔÇö check your internet or DNS (ENOTFOUND)

**scope: unclear**

API Error: Can't reach the API server ÔÇö check your internet or DNS (ENOTFOUND)

**breakage: unclear**

API Error: Can't reach the API server ÔÇö check your internet or DNS (ENOTFOUND)


**2026-09-17** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-20** Moved to `ai-review/` rather than answered.

**Why this card stopped, and why it is not a question anybody needs to answer.** The ask on it
reduces to "untick what the reviewer disproved". Until 2026-09-12 no reviewer could do that:
ProgressBoard's card `0083` criterion #6 forbade a reviewer from touching acceptance at all, on the
reasoning that a reviewer which can untick a box can tick one. So a review that found a real defect
returned the card with every box still ticked, the next build session found nothing open to do, the
promote gate read acceptance as fully met and promoted it, and after the second lap the loop parked
the card in `human-review/` with an ask only a person could action.

**That is fixed upstream, and the fix post-dates this card's last review.** ProgressBoard card
`0162`, committed 2026-09-12, added the `UNMET: #N <reason>` line to `bin/prompts/review-work.md`
and the unticking to `bin/review-card.ps1`, superseding `0083` criterion #6. The reviewing agent
still only reports a number and a sentence; the script does the writing, and the only edit it knows
how to make is `[x]` to `[ ]`, so a reviewer still cannot mark its own paper. Every NearestForest
card sitting in this lane on the "all N criteria ticked" pattern was last reviewed on or before
2026-09-11. Every card reviewed since (`0021`, `0070`, `0072`, `0074`) came back with criteria
genuinely reopened and a reason written beside each.

**So a fresh pass settles this card rather than a person doing so.** It will either reopen a
criterion and send this to `todo/` with something a builder can act on, or pass it to `done/`.

**This is the same call Rob made on 2026-09-10** for thirteen cards in this position, commit
`9fcf175`. It did not take, and the reason is measurable rather than a guess: those re-reviews all
ran on 2026-09-11, one day before the capability existed, and every one of the thirteen came back
"all N criteria ticked" a second time. That one day is the whole of what has changed.

**On this card in particular, the reason is different and simpler.** Its 2026-09-12 review returned
`unclear` on all three lenses, each with `API Error: Can't reach the API server (ENOTFOUND)`. That
is an infrastructure failure, not a finding. There is nothing here for a person to answer and
nothing for a builder to act on, because this card has never actually had an adversarial pass. That
pass is the whole of what it is owed.

### 2026-09-21 review (v20260921041345-a58a)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I tried to break both criteria and could not.

**#1: met.** The `sites.json` example in `docs/DATA-MODEL.md` holds exactly the `attribution` string and the `generated_at` value that `app/data/sites.json` carries. I checked this myself rather than relying on the build note. I pulled the fenced JSON block after the `data/sites.json` heading and looked for each shipped value, JSON-encoded, inside it. Both were there, byte for byte, ┬® sign included. The `Ôö¼┬«` in the diff is only how the terminal displayed that sign.

**#2: met.** The check is the `the data model example matches the shipped dataset header` assertion in `scripts/selftest.js`, in the card 0036 block:
- It reads the example block and pulls each key out as a JSON string literal.
- It compares `attribution` and `generated_at` separately against the parsed `app/data/sites.json`. Any value that differs is named, with what the example says against what the file holds.
- A missing key or a missing fenced block is reported as a failure too, so a gap cannot pass.
- The fence matcher accepts both CRLF and LF line endings, so on this Windows checkout it cannot fail for the wrong reason.

When I ran the suite this assertion passed.

**One limit.** I did not re-do the builder's red-proof (breaking one character of the credit and watching the run fail), because I cannot edit files in this review. But the comparison is strict equality on each value separately, so any change to either value fails it and names it.

VERDICT: sound

**scope: sound**

**Scope review of card 0073 (the data model shows a credit the dataset stopped carrying)**

I looked for work outside the card's fence and for anything left half done, and found neither.

**What this card changed.** It touched two files, and both are named in the Plan:
- **`scripts/selftest.js`.** One new check, `the data model example matches the shipped dataset header`. It sits in the card 0036 block, as the Plan asks. It compares `attribution` and `generated_at` in the example with the parsed `DATA`, and names each value that differs.
- **`docs/DATA-MODEL.md`.** The example now holds the shipped credit and the shipped date. It also gained one new bullet saying both values are pinned by that check. The Plan asked the builder to say so on the card, so this bullet is a small addition, not scope growth.

**The "Not this card" fence holds.** `scripts/parse.py`, the footer in `app/index.html` and `app/data/sites.json` are unchanged by this card. The `counts` lines in the example are untouched, and the pipeline was not re-run.

**Nothing is half done.** The date is pinned knowingly, which is one of the two options the Plan allowed, and the card says why.

**The rest of the diff is other cards' work.** HANDOVER, PRD, `requirements.txt`, `.gitignore` and the lane moves all belong to other cards merged on this branch. This card's build note does not claim any of them.

No criterion is disproved.

VERDICT: sound

**breakage: sound**

I tried to break this and couldn't.

- **The check in `scripts/selftest.js`** (`the data model example matches the shipped dataset header`) takes the first fenced ```` ```json ```` block after the `` `data/sites.json` `` heading. It reads `attribution` and `generated_at` as JSON string literals and compares both exactly against the parsed `app/data/sites.json`. If either key is missing, or no block is found, it fails and says so. It can't pass on an empty block, and it lists each value that differs on its own.
- **The CRLF edge case is handled** by `\r?\n`. If the heading ever disappears, `indexOf` returns -1 and the slice finds no fence, so the check fails loudly rather than passing.
- **No stale copies are left.** The old one-line credit and `"2026-08-29"` appear nowhere outside `docs/board/`. The only other `attribution` and `generated_at` literals in `docs/DATA-MODEL.md` belong to the campsites example. That is a different file under a different licence, and this card leaves it out of scope.
- **Nothing in the app reads the doc**, so no caller could break. `scripts/parse.py`, the footer and the shipped file are untouched.
- **The one new rule is written down.** Re-running the pipeline now means updating the doc's date. That rule is stated in the doc's own bullet under the example and in the comment above the check. The check enforces it, so nothing drifts silently.

No criterion is disproved.

VERDICT: sound

