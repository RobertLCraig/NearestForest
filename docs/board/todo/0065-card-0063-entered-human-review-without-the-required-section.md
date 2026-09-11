# Card `0063` entered `human-review/` without the required section

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One card in the lane does not have it, measured 2026-09-11 after
the section card `0064` carried was written, with
`grep -rLE '^## What I need from you' docs/board/human-review/*.md`:

- `0063-card-0060-entered-human-review-without-the-required-section.md`

**What it costs.** A person opening the lane meets a card with no ask and has to read to the bottom
of it to find the reviewer's findings and work out what is being asked of them.

**How it came to be this way.** The scheduler moved the card from `todo/` into the lane on
2026-09-11, after this batch's scope had been fixed on one named path. Nothing in the move adds the
section, so the card that exists to fix this fault arrived carrying it. That is the sixth time a
card in this series has done so, and the repair has never once been cheaper than the card that
schedules it.

## Links

**Relates to**
- `0063` - the card missing the section. It is a returned build whose ask is already at the bottom of
  its own thread, and nothing else about it is in scope here.
- `0064` - the card that measured this. Its scope was the single path `0062`, fixed on 2026-09-11,
  and `0063` was already in the lane when that scope was set, so it was written up rather than fixed
  in passing.
- `0062`, `0060`, `0059`, `0056`, `0053` - the same defect, earlier batches. Read them in order to
  see the series repeat rather than converge.
- `0055` - owns the one deliberate failure in `node scripts/selftest.js`. Read it before treating
  that failure as anything this card caused.

## Not this card
Not acting on any reviewer finding inside `0063`, not unticking any of its criteria, and not moving
it out of the lane: that is the very call the new section will be asking Rob for. Not a check that
refuses a card entering the lane without the section: that lives in `C:\Dev\ProgressBoard`, outside
this repository, and it is where this series actually ends.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0063-card-0060-entered-human-review-without-the-required-section.md`
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

**2026-09-11** Raised by card `0064` on its last task, re-running the anchored grep over the lane
after writing the section it carried. That card's scope was the single path `0062`, and `0063` was
already in the lane when that scope was set, so it was written up rather than fixed in passing.

**2026-09-11** **The series is the finding, not this card.** Six cards now exist whose whole content
is that the previous one arrived in the lane without its ask. Each is correct, each is cheap, and
together they have produced nothing a user of the app can see. The mover that promotes a bounced
card into `human-review/` is what would end it, and that mover is in `C:\Dev\ProgressBoard`, fenced
out above. Worth putting to Rob before a seventh is written.

**2026-09-11**
RESULT: done
TESTS: +0 new, all green. Criterion #1 is `proves: none` and criterion #2 is `proves: manual`, so
neither takes a test and the build-it-test-first rule does not apply to either. The repository suite
is `node scripts/selftest.js`: `306 passed, 1 failed`, exactly what `## Plan` predicts, the failure
being the card-`0020` file-size assertion that `docs/HANDOVER.md` declares deliberate and card `0055`
carries. **The suite does read the board and this change is inside what it measures**, so that run is
evidence rather than a formality: the card grew and the lane-walking size block still passes on it.
There is no PHP suite here, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and
were not run.
TOUCHED: docs/board/human-review/0063-card-0060-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/in-progress/0065-card-0063-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/todo/0066-card-0064-entered-human-review-without-the-required-section.md (new)
OUT-OF-SCOPE: 0066

**The check was watched going from nothing to one.** `grep -c '^## What I need from you'` against the
one named path printed `0` before the edit and prints `1` after it, and the anchored sweep over
`docs/board/human-review/*.md` named that path before and does not name it now. So the check is not
one that always passes. The harness cannot express this as a suite assertion either way: the suite
asserts nothing about card headings, which is what `proves: none` records.

**The ask is the one already at the bottom of the card, not an invented one.** The reviewer graded
acceptance and scope sound and returned the card on breakage: a build note claims the suite cannot
read the board, and it can. Neither criterion mentions the suite, so nothing there is proposed here
for unticking. The new section puts the two routes the scheduler's stanza names, an untick with a
return to the build lane or a line on the thread saying the finding changes no criterion, and leaves
the choice to Rob.

**The card is past the 100-line budget and the section does not say so.** It is 217 lines after the
edit and was 193 before. Nothing can be done about that from here: `## Comments` is append-only and
is most of the file, the same tension card `0024` waits on Rob to settle. The figure is recorded here
rather than in the new section, because a hand-typed figure inside the ask is what a reviewer
returned an earlier card in this series for.

**No count and no bare card number went into the section.** The reviewer finding is described in
words, and the lane, the thread and the test script are named by what they are rather than by number.

**`board:convention --path=$PWD --cards` reports `NearestForest 0 39 0067`**, the last column being
this worktree rather than `C:\Dev\NearestForest`. No open card fails the checks after the new one was
added.

**Raised rather than fixed: `0064` is now in the lane and carries no section.** It is the card that
raised this one, and the scheduler moved it into `human-review/` after this card's scope was fixed to
one named path. That is card `0066`, and it is the seventh in this series.

**Could not settle from the repository:** whether the reviewer's breakage finding on `0063` should
cost that card a tick. That is exactly the call the new section asks for, and this build does not
make it.

### 2026-09-11 review (v20260911053131-7a22)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Both criteria trace to the real file.

**Criterion #1.** In `docs/board/human-review/0063-card-0060-entered-human-review-without-the-required-section.md`, the check named by the criterion itself, `grep -c '^## What I need from you'`, returns `1`. The heading sits on line three of the file, directly under the title, with the next heading `## Why` far below. Exactly one hit, in the right place.

**Criterion #2.** The ask, the pass and the fail all sit in the first bold paragraph under the heading, in one unbroken block. The ask is the untick-or-correction question. The pass names the two routes. The fail names leaving the card as it stands. Counted as strict text lines the block runs to five, because the heading and two blank lines come first. The criterion is marked `proves: manual`, so it asks a reader's judgement, and a reader meets all three parts in one paragraph before anything else.

I tried to break it on the earlier reviewer's ground, which faulted card `0062` because its pass sat far below its ask, after a rule and two paragraphs. That fault does not exist here. Ask, pass and fail are in the same paragraph, above the rule.

I found nothing to fault.

VERDICT: sound

**scope: sound**

I attacked the scope of this build and could not break it.

**What the build commit actually touched.** Commit `f8a150a` names three paths, all markdown under `docs/board/`: the target card `0063` in `human-review/`, the build's own card `0065`, and a new `0066` in `todo/`. Nothing under `app/`, `scripts/` or `data/`.

**Every fence in `## Not this card` held.** The diff of the `0063` card is a single insertion hunk between the title and `## Why`. Its `AC:BEGIN` block is byte-identical, both boxes still `[x]`, its thread untouched, and it is still in `human-review/` as a modify rather than a rename. No lane check was built and nothing in `C:\Dev\ProgressBoard` was touched.

**The previous build's scope defect is not repeated.** The `0064` build moved its own card between lanes inside its build commit. Here every lane move is a separate scheduler commit: `af08e54`, `8c43ef0`, `9f7cdcd`. The build commit moves nothing.

**Raising `0066` is declared, not quiet.** It is marked `OUT-OF-SCOPE` on the thread, and it is a faithful renumber of the raised card, 19 lines changed against 19.

**The lane re-grep matches what the note reports.** Only the `0064` card is still named, and it entered the lane before this build.

VERDICT: sound

**breakage: defect**

**breakage: defect**

**Finding: the repair the last reviewer named was not made, and the faulty sentence was copied forward into the card this build raised.**

The review at the bottom of `docs/board/human-review/0064-card-0062-entered-human-review-without-the-required-section.md`, finding 4, says the new card names card `0020` in its `## Plan` while `0020` is absent from that card's `## Links`, and states the repair as "one `## Links` line on `0065`".

In `docs/board/ai-review/0065-card-0063-entered-human-review-without-the-required-section.md`, `## Plan` still reads "the deliberate `0020` file-size red", and its `## Links` lists `0063`, `0064`, `0062`, `0060`, `0059`, `0056`, `0053`, `0055` and no `0020`. The build then wrote the identical sentence into `docs/board/todo/0066-card-0064-entered-human-review-without-the-required-section.md`, whose `## Links` also omits `0020`. Same file also hard-codes `306 passed, 1 failed`, a figure that rots the first time a test is added, on a card in a series about figures going stale.

That is the series' own inheritance fault repeating: a rule held in one card's `## Links` and broken in the next.

The edit to `0063` itself is accurate: 193 to 217 lines, one anchored hit, and the suite claim it corrects matches `scripts/selftest.js`.

VERDICT: defect

