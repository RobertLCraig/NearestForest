# Card `0059` entered `human-review/` without the required section

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One card in the lane does not have it, measured 2026-09-11 after
the three that card `0060` carried were written, with
`grep -rLE '^## What I need from you' docs/board/human-review/*.md`:

- `0059-five-human-review-cards-have-no-required-section-again.md`

**What it costs.** A person opening the lane meets a card with no ask and has to read 216 lines to
the bottom to find the reviewer's finding and work out what is being asked of them.

**How it came to be this way.** The scheduler moved the card from `todo/` into the lane on
2026-09-11, after this batch was scoped to three named paths. Nothing in the move adds the section,
so the card that exists to fix this fault arrived carrying it. That is the third time a card in this
series has done so.

## Links

**Relates to**
- `0059` - the card missing the section. It is a returned build whose ask is already at the bottom
  of its own thread, and nothing else about it is in scope here.
- `0060` - the batch that measured this. Its scope was three named paths, fixed on 2026-09-11, and
  this card arrived in the lane after that scope was set, so it was written up rather than fixed in
  passing.
- `0056`, `0053` - the same defect, earlier batches, and the cards whose `proves:` line named the
  blind substring check that hid cards of exactly this kind.

## Not this card
Not acting on the reviewer finding inside `0059`, not unticking any of its criteria, and not moving
it out of the lane: that is the very call the new section will be asking Rob for. Not a check that
refuses a card entering the lane without the section: that lives in `C:\Dev\ProgressBoard`, outside
this repository.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0059-five-human-review-cards-have-no-required-section-again.md`
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
Work in this repository, on the branch the session was given. Only that one card file changes;
nothing under `app/` or `scripts/` is involved, so `node scripts/selftest.js` cannot see this either
way. Run it anyway to show the change broke nothing. There is no PHP suite here: no `vendor/`, no
`pest.bat`, no `pint.bat`.

**Anchor the grep, and name the file by path, not by lane.** From the repository root:

    grep -rLE '^## What I need from you' docs/board/human-review/*.md

`grep -L` without `-E '^...'` is a substring search and matches a card's own prose, which is how
earlier cards in this series certified themselves as compliant while carrying no heading.

**The ask is already on the card, at the bottom.** Its reviewer returned it on the breakage lens
with two findings about sentences written into other cards' sections, and the scheduler's stanza
under that says what is stuck. Say plainly whether clearing it needs an untick or only a builder.
Do not invent an ask.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example.

**Do not write a count into the section.** Point at the folder instead: hand-typed figures in these
sections have gone stale within three commits before.

It worked when the anchored grep over `docs/board/human-review/*.md` names no files, and when the
card states the ask, the pass and the fail in the first three lines under its title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-11** Raised by card `0060` on its last task, re-running the anchored grep over the lane
after writing the three sections it carried. That card's scope was three named paths, and this one
entered the lane after those were chosen, so it was written up rather than fixed in passing.

**2026-09-11** RESULT: done
TESTS: +0 new, unchanged at 306 passed / 1 failed - the known deliberate `0020` file-size red
TOUCHED: docs/board/human-review/0059-five-human-review-cards-have-no-required-section-again.md
TOUCHED: docs/board/todo/0063-card-0060-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/in-progress/0062-card-0059-entered-human-review-without-the-required-section.md
OUT-OF-SCOPE: 0063

**No test was written, and neither criterion asked for one.** `#1` says `proves: none` and `#2` says
`proves: manual`, so the test-first rule does not apply to either. **The harness cannot express `#1`
in any case**, and that is a fact about this repository rather than an excuse: the suite is
`node scripts/selftest.js` over `app/` and `scripts/`, and the only board file it opens is to measure
card sizes. What was run instead is the criterion's own named check, watched at zero before the
change:

    grep -c '^## What I need from you' docs/board/human-review/0059-...-again.md   # 0 before, 1 after

The suite was run to show nothing broke: 306 passed, 1 failed. **The one failure is the deliberate
red** the brief names, `no board card is too large for the agent file reader`, card `0020` at
209.8 KB. It was red before this work and is untouched by it. There is no PHP suite here, so
`.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.

**The ask was taken from the card, not invented.** `0059` came back with both criteria graded
`sound` and one `breakage: defect`, and the scheduler's stanza then asked for an untick or a reason
the finding is wrong. **Neither is available here, and the section says so.** A reviewer graded both
criteria sound, so unticking one would record a failure that did not happen. The defect is two untrue
sentences the card wrote into other cards' sections: that `0056`'s eleven subjects have all left the
lane, when `0032` and `0038` are still in it, and that `0056` and `0053` "carry the heading nowhere",
which this card's own work had just made false. Both are a builder's edit behind a fully ticked card,
so the section asks Rob to choose between sending `0059` back to `todo/` for that edit and raising a
new card for it.

**The reviewer's finding was re-measured, not copied.** `0032` and `0038` are both in
`docs/board/human-review/` today, so the two-still-in-the-lane claim holds.

**Nothing inside `0059` was acted on, unticked or moved**, per this card's `## Not this card` fence.
No acceptance block, thread, verdict or lane changed, and nothing under `app/` or `scripts/` was
touched.

**No count is written into the new section.** It names `0032` and `0038` because the finding is about
those two files, and both are named in `0059`'s own `## Links` chain; no figure and no lane total
appears.

**The card is past the 100-line budget and this pass could not bring it back.** It was 216 lines
before and is 254 after. The new section says so under "Note on length". `## Comments` is append-only
and holds most of the file.

**Lane re-grep, anchored, after the change.** `grep -rLE '^## What I need from you'
docs/board/human-review/*.md` names one file, `0060`. It was already in the lane when this card's
scope was set to the single path `0059`, so it was raised as `0063` in `todo/` rather than fixed in
passing.
