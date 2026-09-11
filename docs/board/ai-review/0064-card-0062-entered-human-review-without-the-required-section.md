# Card `0062` entered `human-review/` without the required section

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One card in the lane does not have it, measured 2026-09-11 after
the section card `0063` carried was written, with
`grep -rLE '^## What I need from you' docs/board/human-review/*.md`:

- `0062-card-0059-entered-human-review-without-the-required-section.md`

**What it costs.** A person opening the lane meets a card with no ask and has to read to the bottom
of it to find the reviewer's findings and work out what is being asked of them.

**How it came to be this way.** The scheduler moved the card from `todo/` into the lane on
2026-09-11, after this batch's scope had been fixed on one named path. Nothing in the move adds the
section, so the card that exists to fix this fault arrived carrying it. That is the fifth time a
card in this series has done so.

## Links

**Relates to**
- `0062` - the card missing the section. It is a returned build whose ask is already at the bottom of
  its own thread, and nothing else about it is in scope here.
- `0063` - the card that measured this. Its scope was the single path `0060`, fixed on 2026-09-11,
  and `0062` was already in the lane when that scope was set, so it was written up rather than fixed
  in passing.
- `0060`, `0059`, `0056`, `0053` - the same defect, earlier batches, and the cards whose `proves:`
  line named the blind substring check that hid cards of exactly this kind.
- `0055` - owns the one deliberate failure in `node scripts/selftest.js`. Read it before treating
  that failure as anything this card caused.

## Not this card
Not acting on any reviewer finding inside `0062`, not unticking any of its criteria, and not moving
it out of the lane: that is the very call the new section will be asking Rob for. Not a check that
refuses a card entering the lane without the section: that lives in `C:\Dev\ProgressBoard`, outside
this repository.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0062-card-0059-entered-human-review-without-the-required-section.md`
      is searched for the heading `## What I need from you` anchored to the start of a line, THE CARD
      SHALL return exactly one hit, directly under its title. proves: none - this project's suite is
      one node script over the app and cannot read the board; the check is
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
and the block above it reads a board card too. Growing a card is inside what it measures. There is
no PHP suite here: no `vendor/`, no `pest.bat`, no `pint.bat`.

_(The first draft of this paragraph said the suite could not see this either way. A reviewer
disproved that on card `0063` on 2026-09-11, and the sentence was corrected here on the same day
rather than copied forward again.)_

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

**2026-09-11** Raised by card `0063` on its last task, re-running the anchored grep over the lane
after writing the section it carried. That card's scope was the single path `0060`, and `0062` was
already in the lane when that scope was set, so it was written up rather than fixed in passing.

**2026-09-11**
RESULT: done
TESTS: +0 new. `node scripts/selftest.js` reports 306 passed, 1 failed. The one failure is the
deliberate red `docs/HANDOVER.md` declares and card `0055` carries, `no board card is too large for
the agent file reader`, card `0020` at 206.8 KB. It was red before this work.
TOUCHED: docs/board/human-review/0062-card-0059-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/todo/0064-card-0062-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/todo/0065-card-0063-entered-human-review-without-the-required-section.md (new)
OUT-OF-SCOPE: 0065

**The check was watched going from nothing to one.** Criterion #1 is `proves: none`, so no test was
written and none was asked for. Its own named check was run against the one named path:
`grep -c '^## What I need from you' <path>` printed `0` before the edit and `1` after it. The
anchored sweep `grep -rLE '^## What I need from you' docs/board/human-review/*.md` named that path
before the edit and does not name it after, so the check is not one that always passes.

**The suite does read the board, and that was checked rather than assumed.** `scripts/selftest.js`
walks every lane and fails a card over 200 KB. The edited card is 15.2 KB after growing by 34 lines,
so it is nowhere near the limit, and the suite result is unchanged at 306 / 1. **Criterion #1's own
parenthetical says the suite "cannot read the board" and that is imprecise**; it is left alone
because acceptance text is not this card's to edit, and the criterion's named check is the grep,
which is what settles it. `## Plan` carried the same false sentence and was corrected in place, with
the correction marked, so the next card in the series does not inherit it. A reviewer disproved that
sentence on card `0063` the same day.

**The ask was taken from the card, not invented.** `0062` came back with both criteria graded
`sound` and two lenses graded `defect`, and the scheduler's stanza then asked for an untick or a
reason the finding is wrong. **Neither is available from here, and the section says so.** A reviewer
graded both criteria sound, so unticking one would record a failure that did not happen. Both
defects are about prose the card wrote into card `0059`'s section: hand-typed figures its own plan
forbade, and card numbers named outside that card's `## Links`. Both are a builder's edit behind a
fully ticked card, so the section asks Rob to choose between sending `0062` back to `todo/` for that
edit and raising a new card for it.

**Nothing inside `0062` was acted on, unticked or moved**, per this card's `## Not this card` fence.
No acceptance box, thread entry, verdict or lane changed, and nothing under `app/` or `scripts/` was
touched. The only change to that file is the new section at the top.

**No count and no bare card number is written into the new section.** It names `0059` once, which is
already in this card's `## Links` with its reason. No figure, no lane total and no other number
appears.

**The card is past the 100-line budget and this pass could not bring it back.** It was 198 lines
before and is 232 after. The new section says so under "Note on length". `## Comments` is
append-only and holds most of the file, which is the same tension card `0024` is waiting on Rob to
settle.

**Lane re-grep, anchored, after the change.** One file is still named, `0063`. It was already in the
lane when this card's scope was fixed to the single path `0062`, so it was raised as `0065` in
`todo/` rather than fixed in passing.

**Could not settle from the repository:** whether either reviewer finding on `0062` is right, and
whether this series should continue at all. The first is the call the new section asks for. The
second is written on `0065` and is Rob's, because the mover that creates the fault is in
`C:\Dev\ProgressBoard`, outside this repository and outside every card in the series.
