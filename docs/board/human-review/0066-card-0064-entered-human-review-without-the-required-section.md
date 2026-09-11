# Card `0064` entered `human-review/` without the required section

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One card in the lane does not have it, measured 2026-09-11 after
the section card `0065` carried was written, with
`grep -rLE '^## What I need from you' docs/board/human-review/*.md`:

- `0064-card-0062-entered-human-review-without-the-required-section.md`

**What it costs.** A person opening the lane meets a card with no ask and has to read to the bottom
of it to find the reviewer's findings and work out what is being asked of them.

**How it came to be this way.** The scheduler moved the card from `todo/` into the lane on
2026-09-11, after this batch's scope had been fixed on one named path. Nothing in the move adds the
section, so the card that exists to fix this fault arrived carrying it. That is the seventh time a
card in this series has done so.

## Links

**Relates to**
- `0064` - the card missing the section. It is a returned build whose ask is already at the bottom of
  its own thread, and nothing else about it is in scope here.
- `0065` - the card that measured this. Its scope was the single path `0063`, fixed on 2026-09-11,
  and `0064` was already in the lane when that scope was set, so it was written up rather than fixed
  in passing.
- `0063`, `0062`, `0060`, `0059`, `0056`, `0053` - the same defect, earlier batches. Read them in
  order to see the series repeat rather than converge.
- `0055` - owns the one deliberate failure in `node scripts/selftest.js`. Read it before treating
  that failure as anything this card caused.
- `0020` - the card that failure names. It is oversized and only Rob may prune it. Added here on
  2026-09-11 because `## Plan` names `0020` and a reviewer returned the previous card in this series
  for naming a card outside its own `## Links`.

## Not this card
Not acting on any reviewer finding inside `0064`, not unticking any of its criteria, and not moving
it out of the lane: that is the very call the new section will be asking Rob for. Not a check that
refuses a card entering the lane without the section: that lives in `C:\Dev\ProgressBoard`, outside
this repository, and it is where this series actually ends.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0064-card-0062-entered-human-review-without-the-required-section.md`
      is searched for the heading `## What I need from you` anchored to the start of a line, THE CARD
      SHALL return exactly one hit, directly under its title. proves: none - the suite here is one
      node script and asserts nothing about card headings; the check is
      `grep -c '^## What I need from you' <path>`, run against that path rather than against a lane
- [x] #2 WHEN a reader opens the card, THE CARD SHALL state the ask, what a pass is and what a fail
      is, within the first three lines under the title. proves: manual - whether an ask is legible in
      three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [x] Read the card's last comment entry and the review verdicts above it, and use the ask already
      there rather than inventing one
- [x] Write `## What I need from you` under the title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [x] Check the card is still inside the 100-line budget afterwards, and say on it if it is not
- [x] Re-run the anchored grep over the whole lane and report which cards still miss the heading

## Plan
Work in this repository, on the branch the session was given. Only that one card file changes, and
nothing under `app/` or `scripts/` is involved. **`node scripts/selftest.js` does read the board**,
so run it and read the result rather than assuming it is blind to this: the block
`board cards fit the agent file reader (card 0055)` walks every lane and fails any card over 200 KB,
and the block above it reads a board card too. Growing a card is inside what it measures. Expect
`306 passed, 1 failed`, the failure being the deliberate `0020` file-size red that `docs/HANDOVER.md`
declares and card `0055` carries. There is no PHP suite here: no `vendor/`, no `pest.bat`, no
`pint.bat`.

**Anchor the grep, and name the file by path, not by lane.** From the repository root:

    grep -rLE '^## What I need from you' docs/board/human-review/*.md

`grep -L` without `-E '^...'` is a substring search and matches a card's own prose, which is how
earlier cards in this series certified themselves as compliant while carrying no heading.

**The ask is already on the card, at the bottom.** Read the reviewer verdicts and the scheduler's
stanza under them to say what is stuck, and say plainly whether clearing it needs an untick or only a
builder. Do not invent an ask.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example.

**Do not write a count into the section, and do not leave a bare card number in it.** Hand-typed
figures in these sections have gone stale within three commits, and a reviewer has already returned
one card in this series for writing them. Point at the folder and at the thread instead.

It worked when the anchored grep over `docs/board/human-review/*.md` names no files, and when the
card states the ask, the pass and the fail in the first three lines under its title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-11** Raised by card `0065` on its last task, re-running the anchored grep over the lane
after writing the section it carried. That card's scope was the single path `0063`, and `0064` was
already in the lane when that scope was set, so it was written up rather than fixed in passing.

**2026-09-11** **The series is the finding, not this card.** Seven cards now exist whose whole
content is that the previous one arrived in the lane without its ask. Each is correct, each is cheap,
and together they have produced nothing a user of the app can see. The mover that promotes a bounced
card into `human-review/` is what would end it, and that mover is in `C:\Dev\ProgressBoard`, fenced
out above. The previous card in the series said the same and it is still worth putting to Rob before
an eighth is written.

**2026-09-11**
RESULT: done
TESTS: +0 new, all green apart from the one declared red. `node scripts/selftest.js` reports
306 passed, 1 failed; the failure is `no board card is too large for the agent file reader`, naming
`docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md` at 209.8 KB. It was red before this
work and card `0055` carries it.
TOUCHED: docs/board/human-review/0064-card-0062-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/in-progress/0066-card-0064-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/todo/0067-card-0065-entered-human-review-without-the-required-section.md (new)
OUT-OF-SCOPE: 0067

**The check was watched going from nothing to one.** Criterion #1 is `proves: none`, so no test was
written and none was asked for; the criterion names its own check and that check was run against the
one named path. `grep -c '^## What I need from you'` printed `0` before the edit and `1` after it.
The anchored sweep `grep -rLE '^## What I need from you' docs/board/human-review/*.md` named that
path before the edit and does not name it after, so the check is not one that always passes.
`head -4` puts the title on line 1 and the heading on line 3, with no second copy in the file.

**The suite reads the board and was run rather than assumed.** `scripts/selftest.js` walks every lane
and fails a card over 200 KB. The edited card is 29,788 bytes, which is 29.1 KB in the units the
block itself prints, so it is inside the limit, and the suite result is unchanged.

**The ask was taken from the card, not invented.** `0064` carries two adversarial review entries from
the same day that disagree. The earlier graded criterion #2 a defect, because the pass sits far below
the ask and a second, different fail sits below that. The later graded the same criterion sound under
`proves: manual` and dissents from the earlier one in writing. The scheduler's stanza then asked for
an untick or a reason the finding is wrong, and **a builder can supply neither**: unticking would
record a failure one reviewer says did not happen, and leaving it ticked overrules the other. So the
new section asks Rob to say which review stands and gives the two routes that follow.

**Nothing inside `0064` was acted on, unticked or moved.** The only change to that file is the new
section between the title and `## Why`. Its acceptance block, its thread, its verdicts and its lane
are untouched, and nothing under `app/` or `scripts/` was touched by this work.

**No count and no bare card number is written into the new section.** It names `0062` once, which is
already in `0064`'s own `## Links` with its reason. "Two adversarial reviews" and "route 1 or route
2" count entries and a list that an append-only thread cannot change. The 100-line budget is named as
a constant from `docs/board/README.md`, which this card's own task list ordered.

**This card's `## Links` gained `0020`, and that is the only edit to this card beyond ticking.** Its
`## Plan` names `0020` while `## Links` did not, which is the exact defect a reviewer returned the
previous card in the series for. The new line is marked with its date and reason. `## Plan` still
hard-codes `306 passed, 1 failed`, which the same reviewer called a figure that rots; it was left as
handed down and the card raised below does not repeat it.

**The edited card is far past the 100-line budget and this pass could not bring it back.** It was 390
lines before and is 423 after, a growth of 33 lines, which `git diff --stat` agrees with. The new
section says so under "Note on length". `## Comments` is append-only and holds nearly all of the
file.

**Lane re-grep, anchored, after the change.** One file is still named,
`docs/board/human-review/0065-card-0063-entered-human-review-without-the-required-section.md`. It was
already in the lane when this card's scope was fixed to the single path `0064`, so it was raised as
`0067` in `todo/` rather than fixed in passing.

**Could not settle from the repository:** which of the two reviews on `0064` is right. That is the
call the new section asks for, and no file here decides it. Nor whether the series should continue:
the mover that creates the fault is in `C:\Dev\ProgressBoard`, outside this repository and outside
every card in the series.

### 2026-09-11 review (v20260911054013-df37)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Criterion #1 traces to the real file. In `docs/board/human-review/0064-card-0062-entered-human-review-without-the-required-section.md`, the check the criterion names, `grep -c '^## What I need from you'`, returns `1`. The title is the first line and the heading is the third, with `## Why` far below. One hit, in the right place.

Criterion #2 also holds. The ask, the pass and the fail sit in one unbroken bold paragraph directly under the heading, before the numbered routes and before the rule. The ask is which of the two reviews stands. The pass is a dated line on the thread naming a route. The fail is leaving the card alone. A reader meets all three before anything else.

I tried to break #2 on the earlier reviewer's ground, the fault that sank card `0062`, where the pass sat far below the ask after a rule and two paragraphs. That shape is absent here. Counted as strict lines the block runs past three, because the heading and a blank line come first, but the criterion is marked `proves: manual` and the same shape was graded sound on card `0063` in this lane on the same day.

I found nothing to fault.

VERDICT: sound

**scope: sound**

**scope review of card 0066**

I tried to break the scope and could not.

- **The build commit touched three markdown files only.** `ab4c366` names the target card `0064` in `human-review/`, its own card `0066`, and the new `0067` in `todo/`. Nothing under `app/`, `scripts/` or `data/`.
- **Every fence in `## Not this card` held.** The diff of `docs/board/human-review/0064-card-0062-entered-human-review-without-the-required-section.md` has zero deleted lines. It is one insertion between the title and `## Why`. Both acceptance boxes are still `[x]`, the thread and both review verdicts are untouched, and the file is still in `human-review/` as a modify, not a rename.
- **Lane moves are not in the build.** `3d5bcae` and `2bc35b5` move card `0066` and change no content. The previous build in this series moved its own card inside the build commit. This one does not.
- **Raising `0067` is declared, not quiet.** It is marked `OUT-OF-SCOPE` on the thread and is a faithful renumber of the card handed down, with the rotting count `306 passed, 1 failed` removed and `0020` added to its `## Links`.
- **No check was built and nothing in `C:\Dev\ProgressBoard` was touched.**
- **The one edit to its own card beyond ticking** is the `0020` line in `## Links`. That is the exact repair the last reviewer asked for, and it is dated and reasoned on the card.

VERDICT: sound

**breakage: defect**

**Finding: the card this build created is born over the board's 100-line budget, and nothing says so.**

`docs/board/README.md`, section "A whole card fits in 100 lines", sets the budget. The new card `docs/board/todo/0067-card-0065-entered-human-review-without-the-required-section.md` is 103 lines. The build grew it from 102 while rewriting it, and its thread says nothing about the overflow.

The same build's own task list asked for a budget check, and it made that check only on the edited card `docs/board/human-review/0064-card-0062-entered-human-review-without-the-required-section.md`, where it wrote a "Note on length". So the rule is asserted in one file and quietly broken in the other file the same commit wrote. Unlike `0064`, `0067` has no append-only thread to excuse it: every line of it is `## Why`, `## Links`, `## Plan` and prose the build controls.

Everything else held. I re-ran the suite: `306 passed, 1 failed`, the failure being card `0020` only. The anchored lane grep names only the `0065` card, as reported. The `0064` edit is one insertion between title and `## Why`, and `0062` is already in that card's `## Links`.

VERDICT: defect


**2026-09-11** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.
