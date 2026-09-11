# Card `0060` entered `human-review/` without the required section

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One card in the lane does not have it, measured 2026-09-11 after
the section card `0062` carried was written, with
`grep -rLE '^## What I need from you' docs/board/human-review/*.md`:

- `0060-three-more-human-review-cards-have-no-required-section.md`

**What it costs.** A person opening the lane meets a card with no ask and has to read to the bottom
of it to find two reviewer findings and work out what is being asked of them.

**How it came to be this way.** The scheduler moved the card from `todo/` into the lane on
2026-09-11, in commit `1fba17c`, after its scope had been fixed on one named path. Nothing in the
move adds the section, so the card that exists to fix this fault arrived carrying it. That is the
fourth time a card in this series has done so.

## Links

**Relates to**
- `0060` - the card missing the section. It is a returned build whose ask is already at the bottom of
  its own thread, and nothing else about it is in scope here.
- `0062` - the card that measured this. Its scope was the single path `0059`, fixed on 2026-09-11,
  and `0060` was already in the lane when that scope was set, so it was written up rather than fixed
  in passing.
- `0059`, `0056`, `0053` - the same defect, earlier batches, and the cards whose `proves:` line named
  the blind substring check that hid cards of exactly this kind.

## Not this card
Not acting on either reviewer finding inside `0060`, not unticking any of its criteria, and not
moving it out of the lane: that is the very call the new section will be asking Rob for. Not a check
that refuses a card entering the lane without the section: that lives in `C:\Dev\ProgressBoard`,
outside this repository.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0060-three-more-human-review-cards-have-no-required-section.md`
      is searched for the heading `## What I need from you` anchored to the start of a line, THE CARD
      SHALL return exactly one hit, directly under its title. proves: none - this project's suite is
      one node script over the app and cannot read the board; the check is
      `grep -c '^## What I need from you' <path>`, run against that path rather than against a lane
- [x] #2 WHEN a reader opens the card, THE CARD SHALL state the ask, what a pass is and what a fail
      is, within the first three lines under the title. proves: manual - whether an ask is legible in
      three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [x] Read the card's last comment entry and the two review verdicts above it, and use the ask
      already there rather than inventing one
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

**The ask is already on the card, at the bottom.** Its reviewer returned it with two findings, one on
acceptance and one on breakage, and the scheduler's stanza under those says what is stuck. Say
plainly whether clearing it needs an untick or only a builder. Do not invent an ask.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example.

**Do not write a count into the section, and do not leave a bare card number in it.** Hand-typed
figures in these sections have gone stale within three commits, and the last pass to write one of
these sections broke `0021`'s own `## Links` rule by naming two cards in prose. Point at the folder
and at the thread instead.

It worked when the anchored grep over `docs/board/human-review/*.md` names no files, and when the
card states the ask, the pass and the fail in the first three lines under its title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-11** Raised by card `0062` on its last task, re-running the anchored grep over the lane
after writing the section it carried. That card's scope was the single path `0059`, and `0060` was
already in the lane when that scope was set, so it was written up rather than fixed in passing.

**2026-09-11**
RESULT: done
TESTS: +0 new, all green. Criterion #1 is `proves: none` and criterion #2 is `proves: manual`, so
neither gets a test and the build-it-test-first rule does not apply to either. The repository suite
is `node scripts/selftest.js`: 306 passed, 1 failed, the failure being the card-`0020` file-size
assertion that `docs/HANDOVER.md` declares deliberate and card `0055` carries. It was red on that
same single assertion before this work, and this card touched nothing the suite reads. There is no
PHP suite here, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
TOUCHED: docs/board/human-review/0060-three-more-human-review-cards-have-no-required-section.md
TOUCHED: docs/board/in-progress/0063-card-0060-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/todo/0064-card-0062-entered-human-review-without-the-required-section.md (new)
OUT-OF-SCOPE: 0064

**The check was watched going from nothing to one.** Criterion #1 is `proves: none`, so there is no
test to write, and the harness cannot express this case either way: the suite is one node script over
`app/` and cannot read the board. What was run instead, against the one named path,
`git show HEAD:<path> | grep -c '^## What I need from you'` printed `0` before the edit and
`grep -c '^## What I need from you' <path>` prints `1` after it. The anchored sweep over the lane
named the path before the edit and does not name it after, so the check is not one that always
passes.

**The ask is the one already at the bottom of the card.** Its reviewer graded acceptance sound and
checked both boxes itself, then returned the card on the scope and breakage lenses. Neither finding
disproves either criterion, so nothing there is proposed for unticking. The section says plainly that
clearing it needs a builder rather than an untick, and offers the alternative of saying on the thread
that a finding is wrong. It does not answer the question for Rob.

**The card is past the 100-line budget and the section does not say so.** It is 239 lines after the
edit and was 205 before. Nothing can be done about that from here: `## Comments` is append-only and
is most of the file, which is the same tension card `0024` is waiting on Rob to settle. The budget is
recorded here rather than in the new section, because a figure inside the ask is the very thing the
reviewer returned the previous card for.

**No count and no bare card number is written into the section**, per `## Plan`. The two reviewer
findings are described in words, the acceptance box totals the reviewer quoted are left out, and the
sections it refers to are named by lane and by heading rather than by card number.

**`board:convention --path=$PWD --cards` reports `NearestForest 0 37 0065`**, the last column showing
this worktree rather than `C:\Dev\NearestForest`. Zero open cards fail the checks after the new card
was added.

**Raised rather than fixed: `0062` is now in the lane and carries no section.** It is the card that
raised this one, and the scheduler moved it into `human-review/` after this card's scope was fixed to
one named path. That is card `0064`, and it is the fifth in this series.

**Could not settle from the repository:** whether either reviewer finding on `0060` is right. That is
the call the new section asks for, and this build does not make it.
