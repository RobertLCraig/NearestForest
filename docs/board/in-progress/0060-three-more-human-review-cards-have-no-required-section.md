# Three more `human-review/` cards have no `## What I need from you`, and one of them lost the section it had

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. Three cards in the lane do not have it, measured 2026-09-11 after
card `0059` cleared the five it carried, with
`grep -rLE '^## What I need from you' docs/board/human-review/*.md`:

- `0019-use-forestry-englands-own-attribution-wording.md`
- `0021-rewrite-this-board-s-cards-for-the-reader.md`
- `0058-the-link-check-reports-zero-while-nine-cards-carry-a-bare-number.md`

What it costs. A person sweeping the lane opens three cards and has to read to the bottom of each to
find out what is being asked.

How it came to be this way. Two of the three are the ordinary cause: the scheduler moves a returned
card into the lane and nothing in the move adds the section. **`0019` is a new shape and is the
reason this card exists rather than being folded into the series.** It had the section, Rob answered
it on the thread on 2026-09-10, and a later session deleted the answered block as stale. The card
then came back to the lane on a fresh reviewer finding, with nothing under its title. So the section
is not only missing on arrival, it is removable on the way out and the removal is not noticed the
next time round.

## Links

**Relates to**
- `0059` - the previous batch, which cleared the five cards in the lane on 2026-09-11 and re-ran the
  anchored grep afterwards, which is how these three were found. Its scope was those five paths.
- `0056`, `0053` - the same defect, earlier batches, and the cards whose `proves:` line named the
  blind substring check that hid cards of exactly this kind.
- `0019`, `0021`, `0058` - the three cards missing the section. Each is a returned build whose ask is
  already at the bottom of its own thread; none of them is otherwise edited.

## Not this card
Not acting on any reviewer finding inside the three, not unticking any criterion, and not moving
anything out of the lane: that is the very call each new section will be asking Rob for. Not a check
that refuses a card entering the lane without the section, and not one that refuses the section's
deletion: both live in `C:\Dev\ProgressBoard`, outside this repository.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN each of the three card files named above is searched for the heading
      `## What I need from you` anchored to the start of a line, THE CARD SHALL return exactly one
      hit, directly under its title. proves: none - this project's suite is one node script over the
      app and cannot read the board; the check is `grep -c '^## What I need from you' <path>` per
      file, run against the three paths rather than against a lane
- [ ] #2 WHEN a reader opens any of the three, THE CARD SHALL state the ask, what a pass is and what
      a fail is, within the first three lines under the title. proves: manual - whether an ask is
      legible in three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [ ] For each card, read its last comment entry and the review verdicts above it, and use the ask
      already there rather than inventing one
- [ ] Write `## What I need from you` under each title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [ ] For `0019`, read the 2026-09-10 answer on its thread before writing, and say on the card that
      the previous section was answered and then deleted
- [ ] Check each card is still inside the 100-line budget afterwards, and say on it if it is not
- [ ] Re-run the anchored grep over the whole lane and report which cards still miss the heading

## Plan
Work in the NearestForest repository, on the branch the session was given. Only the three card files
change; nothing under `app/` or `scripts/` is involved, so `node scripts/selftest.js` cannot see this
either way. Run it anyway to show the change broke nothing. There is no PHP suite here: no `vendor/`,
no `pest.bat`, no `pint.bat`.

**Anchor the grep, and name the files by path, not by lane.** From the repository root:

    grep -rLE '^## What I need from you' docs/board/human-review/*.md

`grep -L` without `-E '^...'` is a substring search and matches a card's own prose, which is how
earlier cards in this series certified themselves as compliant while carrying no heading.

**Each ask is already on its card, at the bottom.** Do not invent one. Read the `defect` verdicts
above the scheduler's stanza to say which finding is stuck, and say plainly whether clearing it needs
an untick or only a builder.

**`0019` is the awkward one.** Its thread carries Rob's 2026-09-10 answer and the later deletion of
the block that held it. Write the new section against the finding that returned the card this time,
not against the question he has already answered.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing them.** It gives the field table and a worked example.

**Do not write a count into a section.** Point at the folder instead: hand-typed figures in these
sections have gone stale within three commits before.

It worked when the anchored grep over `docs/board/human-review/*.md` names no files, and when each of
the three states the ask, the pass and the fail in the first three lines under its title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-11** Raised by card `0059` on its last task, re-running the anchored grep over the lane
after writing the five sections it carried. `0059`'s scope was those five paths, so these three were
written up rather than fixed in passing. `0019` losing a section it already had is new, and is
written into `## Why` because it is a different failure from the scheduler's move.
