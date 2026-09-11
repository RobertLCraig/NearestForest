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

## Not this card
Not acting on any reviewer finding inside `0064`, not unticking any of its criteria, and not moving
it out of the lane: that is the very call the new section will be asking Rob for. Not a check that
refuses a card entering the lane without the section: that lives in `C:\Dev\ProgressBoard`, outside
this repository, and it is where this series actually ends.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN `docs/board/human-review/0064-card-0062-entered-human-review-without-the-required-section.md`
      is searched for the heading `## What I need from you` anchored to the start of a line, THE CARD
      SHALL return exactly one hit, directly under its title. proves: none - the suite here is one
      node script and asserts nothing about card headings; the check is
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
