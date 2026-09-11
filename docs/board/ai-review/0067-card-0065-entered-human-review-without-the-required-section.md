# Card `0065` entered `human-review/` without the required section

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One card in the lane does not have it, measured 2026-09-11 after
the section card `0066` carried was written, with
`grep -rLE '^## What I need from you' docs/board/human-review/*.md`:

- `0065-card-0063-entered-human-review-without-the-required-section.md`

**What it costs.** A person opening the lane meets a card with no ask and has to read to the bottom
of it to find the reviewer's findings and work out what is being asked of them.

**How it came to be this way.** The scheduler moved the card from `todo/` into the lane on
2026-09-11, after this batch's scope had been fixed on one named path. Nothing in the move adds the
section, so the card that exists to fix this fault arrived carrying it. That is the eighth time a
card in this series has done so.

## Links

**Relates to**
- `0065` - the card missing the section. It is a returned build whose ask is already at the bottom of
  its own thread, and nothing else about it is in scope here.
- `0066` - the card that measured this. Its scope was the single path `0064`, fixed on 2026-09-11,
  and `0065` was already in the lane when that scope was set, so it was written up rather than fixed
  in passing.
- `0064`, `0063`, `0062`, `0060`, `0059`, `0056`, `0053` - the same defect, earlier batches. Read
  them in order to see the series repeat rather than converge.
- `0055` - owns the one deliberate failure in `node scripts/selftest.js`. Read it before treating
  that failure as anything this card caused.
- `0020` - the card that failure names. It is oversized and only Rob may prune it.

## Not this card
Not acting on any reviewer finding inside `0065`, not unticking any of its criteria, and not moving
it out of the lane: that is the very call the new section will be asking Rob for. Not a check that
refuses a card entering the lane without the section: that lives in `C:\Dev\ProgressBoard`, outside
this repository, and it is where this series actually ends.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0065-card-0063-entered-human-review-without-the-required-section.md`
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
and the block above it reads a board card too. Growing a card is inside what it measures. The suite
is red on exactly that one assertion, for card `0020`, which `docs/HANDOVER.md` declares and card
`0055` carries; read the run rather than a figure written here, because a count written into a card
rots. There is no PHP suite here: no `vendor/`, no `pest.bat`, no `pint.bat`.

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

**2026-09-11** Raised by card `0066` on its last task, re-running the anchored grep over the lane
after writing the section it carried. That card's scope was the single path `0064`, and `0065` was
already in the lane when that scope was set, so it was written up rather than fixed in passing.

**2026-09-11** **The series is the finding, not this card.** Eight cards now exist whose whole
content is that the previous one arrived in the lane without its ask. Each is correct, each is cheap,
and together they have produced nothing a user of the app can see. The mover that promotes a bounced
card into `human-review/` is what would end it, and that mover is in `C:\Dev\ProgressBoard`, fenced
out above. Every previous card in the series said the same and it is still worth putting to Rob
before a ninth is written.

**2026-09-11**
RESULT: done
TESTS: +0 new, all green. Criterion #1 is `proves: none` and criterion #2 is `proves: manual`, so
neither takes a test and the test-first rule does not apply to either. The repository suite is
`node scripts/selftest.js` and it ran here: `306 passed, 1 failed`, the one failure being the
card-`0020` file-size assertion that `docs/HANDOVER.md` declares deliberate and card `0055` carries.
The suite does read the board, so that run is evidence rather than a formality: the edited card grew
and the lane-walking size block still passes on it. There is no PHP suite in this repository, so
`.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
TOUCHED: docs/board/human-review/0065-card-0063-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/in-progress/0067-card-0065-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/todo/0068-card-0066-entered-human-review-without-the-required-section.md (new)
OUT-OF-SCOPE: 0068

**The check was watched going from nothing to one.** `grep -c '^## What I need from you'` against the
one named path printed `0` before the edit and prints `1` after it, and the anchored sweep over
`docs/board/human-review/*.md` named that path before and does not name it now. So the check is not
one that always passes. The harness cannot express this as a suite assertion either way: the suite
asserts nothing about card headings, which is what `proves: none` records.

**The ask is the one already at the bottom of the card, not an invented one.** The reviewer graded
acceptance and scope sound and returned the card on breakage, and the scheduler's stanza under that
review names the two routes out: untick what the reviewer disproved and return the card to the build
lane, or write on its thread why the finding changes no criterion. The new section puts that choice
to Rob and makes neither call.

**Both files were counted against the 100-line budget.** The edited card is over it, at 226 lines
after the edit against 206 before. Nothing can be done about that from here: `## Comments` is
append-only and is most of the file, which is the tension card `0024` waits on Rob to settle. The new
card raised below is 100 lines, counted before committing, which is the repair the reviewer asked for
after an earlier card in this series was born at 103 lines with nothing said about it.

**No count and no bare card number went into the section.** The reviewer finding is described in
words, and the lane, the thread and the cards are named by what they are rather than by number.

**`board:convention --path=$PWD --cards` reports `NearestForest 0 41 0069`**, the last column being
this worktree rather than `C:\Dev\NearestForest`. No open card fails the checks after the new one was
added.

**Raised rather than fixed: `0066` is now in the lane and carries no section.** It is the card that
raised this one, and the scheduler moved it into `human-review/` after this card's scope was fixed to
one named path. That is card `0068`, and it is the ninth in this series.

**Could not settle from the repository:** whether the reviewer's breakage finding on `0065` should
cost that card a tick. That is exactly the call the new section asks for, and this build does not
make it.
