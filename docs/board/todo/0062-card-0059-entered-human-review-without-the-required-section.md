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
- [ ] #1 WHEN `docs/board/human-review/0059-five-human-review-cards-have-no-required-section-again.md`
      is searched for the heading `## What I need from you` anchored to the start of a line, THE CARD
      SHALL return exactly one hit, directly under its title. proves: none - this project's suite is
      one node script over the app and cannot read the board; the check is
      `grep -c '^## What I need from you' <path>`, run against that path rather than against a lane
- [ ] #2 WHEN a reader opens the card, THE CARD SHALL state the ask, what a pass is and what a fail
      is, within the first three lines under the title. proves: manual - whether an ask is legible in
      three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [ ] Read the card's last comment entry and the review verdicts above it, and use the ask already
      there rather than inventing one
- [ ] Write `## What I need from you` under the title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [ ] Check the card is still inside the 100-line budget afterwards, and say on it if it is not
- [ ] Re-run the anchored grep over the whole lane and report which cards still miss the heading

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
