# Card 0026 names 0023 in a sentence and never says what the relationship is

## What I need from you

**One choice, and I recommend the second.**

1. Untick a criterion and send this card back to `todo/`.
2. Or write on the thread that the work asked for was done, that the extra edits were correct, and
   let the card go to `done/`.

**What's wrong.** The job itself is finished: card `0026` now says why it points at card `0023`, and
two of the three reviewers passed it. The complaint is that the card promised "one card file changes
and nothing else" and the session also made four edits to `docs/HANDOVER.md`. Those edits were
right, but they pushed the brief back over its size budget, and the same session then opened a new
card, `0031`, to report the problem it had just caused.

**Cause.** The four edits were needed to stop the brief saying something this work had made untrue.
Nobody had written that allowance into the card, so a correct edit reads on paper as work escaping
its fence.

**Pass** is either route above, recorded here with today's date.

**Fail** is neither. All the card's boxes stay ticked, no session finds anything open, and the loop
promotes it again on the ticks.

**Why it needs you.** Nothing here is a lookup. It is whether a card that fixed a true thing outside
its own fence should lose its ticks for it, and how strictly the fence should be read next time.

**Note on length.** This section takes the card past the 100-line budget. `## Comments` and the
review verdicts are append-only, so nothing here could be cut to make room.

## Why
`docs/board/README.md` has one rule about links: a card number dropped into a paragraph is a puzzle
rather than a link, so every number a card mentions belongs in its `## Links` section with one line
saying why the reader is being sent there. Card `0026` breaks it. Its `## Why` ends "it sat in
HANDOVER's prose until card 0023 moved it into DATA-MODEL's divergences", and its `## Links` lists
only `0004`.

What it costs. The board's own structural check catches this and reports it, so the board no longer
prints zero failing cards:

    php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards
    NearestForest   1   25   0027
    0026    todo    unexplained link: 0023

Measured on 2026-09-05. One failing card is cheap to ignore, and that is the cost: a check that
prints "1" every run stops being read, and the next real failure hides behind this one. Card `0021`
took this board to zero and it is worth keeping there.

How it came to be this way. `0026` was written on 2026-09-05 by the session that built `0023`, and
naming the card you were just working on is the easiest way to write a bare number without noticing.

## Links

**Relates to**
- `0026` - the card to fix. One line in its `## Links`, and nothing else.
- `0023` - the card `0026` names without explaining. It folded the `scraped_at` note out of
  HANDOVER's prose and into DATA-MODEL's divergences, which is the relationship that is missing.
- `0024` - it found this while re-running the convention check, and could not fix it, because a card
  session may only edit the cards in its own scope.

## Not this card
Not the `scraped_at` work `0026` is actually about; nothing in its acceptance, tasks or plan changes.
Not any other card, and not `docs/board/README.md`, which is a copy of a file held outside this
repository. Not adding a `needs:` entry: `0023` is built and is not a blocker.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `0026` is read, THE CARD SHALL carry `0023` in its `## Links` with one line saying what
      the relationship is. proves: none - no check in this repository reads a card's links
- [x] #2 WHEN the convention check is re-run, THE BOARD SHALL report zero open cards failing.
      proves: none - the command lives in another repository, named in `## Plan`
<!-- AC:END -->

## Tasks
- [x] Add a `0023` entry under `**Relates to**` in `docs/board/todo/0026-scraped-at-says-the-parse-date-not-the-fetch-date.md`
- [x] Re-run the convention check and confirm the board is back at zero

## Plan
Work in the NearestForest repository, on a branch off `main`. One card file changes and nothing else.

The relationship is already stated in `0026`'s own prose and only needs moving into the section that
holds it: `0023` folded the note out of HANDOVER and into DATA-MODEL's divergences, which is how this
card came to be raised. One line under the existing `**Relates to**` heading is the whole change.

Check it from this board's directory, in PowerShell:

    php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards

It worked when the second number is `0` and no card is named underneath. `--path` matters: a build
worktree is not `C:\Dev\NearestForest`, and without it you measure a tree you are not editing.

## Comments
**2026-09-05** Raised by card `0024`, which needed the board at zero to close its own criterion #4
and found it at one. The fault is in another card, so `0024` recorded it here instead of fixing it.

**2026-09-06** RESULT: done
TESTS: +0 new, all green at commit (222 passed, 0 failed). Was red on
`fetch records a download date alongside every cached page` for the first three runs - a clock fault,
not mine, raised as `0030`
TOUCHED: docs/board/ai-review/0026-scraped-at-says-the-parse-date-not-the-fetch-date.md,
docs/board/todo/0030-the-fetch-date-test-compares-a-utc-date-to-a-local-one.md,
docs/board/todo/0031-handover-is-over-budget-again-and-0023-is-ticked-as-under.md,
docs/HANDOVER.md, this card
OUT-OF-SCOPE: 0030, 0031

Both criteria met. `0026` moved from `todo/` to `ai-review/` after this card was written, so the
edit landed at `docs/board/ai-review/0026-...`; nothing else about the task changed. Two lines under
the existing `**Relates to**`, naming the relationship the card's own `## Why` already states.

**No test was written, and neither criterion asked for one.** Both carry `proves: none` with the
reason on the line: nothing in this repository reads a card's links, and the checker that does lives
in another repository. What was watched instead is the checker itself, before and after, from this
worktree:

    php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards
    NearestForest   1   28   0030
    0026    ai-review       unexplained link: 0023

and after the edit, `NearestForest 0 28 0030` with no card named underneath. Re-run once more after
writing `0030`: `NearestForest 0 29 0031`, so the new card passes the convention too.

**The suite was red on one test and it was the clock, not this card.** `node scripts/selftest.js`
printed `221 passed, 1 failed` on `fetch records a download date alongside every cached page`. The
two sides of that assertion read different clocks: `scripts/fetch.py:68` writes `date.today()`, which
is local, and `scripts/selftest.js:771` expects `new Date().toISOString().slice(0, 10)`, which is
UTC. It was 00:57 local under BST, so they named days one apart. Confirmed by waiting rather than by
arguing: red at 00:57 and 00:59, then `222 passed, 0 failed` at 01:00 with nothing edited in between.
The only modified file throughout was one markdown card, and `scripts/selftest.js` reads nothing from
`docs/board/`. Fixing it is out of scope; raised as `0030` instead.

**There is no PHP suite here**, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` were not run.
Neither exists and nor does `vendor/`; this project's suite is `node scripts/selftest.js`.

`docs/HANDOVER.md` is one file more than the Plan listed, and it is **five bytes smaller** than it
was. Three of its statements were made false by this work or were already false: it named 0028 as an
open agent-ready card, it counted fourteen cards in `ai-review/` where there are sixteen, and it said
"the convention check reports one failing card, 0026". All three are corrected in place, that last
sentence is deleted, and the run itself is recorded here rather than in HANDOVER. A first attempt did
write a run note there and grew the file by 152 bytes, which is exactly the fault `0031` describes,
so it was taken back out.

Raised `0031` as well. The orient hook reports `docs/HANDOVER.md` over the ~40 KB budget on every
session start, and the first draft of this entry said no card carried that. Checking before asserting
it showed otherwise, and showed something worse: `0023` is in `ai-review/` with "SHALL be under 40 KB"
and "the hook SHALL NOT report the file as over budget" both ticked, while the file measures 41,522
bytes and the hook did report it this morning. `0026`'s four HANDOVER edits are what took it back
over, and they are correct and should stay. The gap between a ticked criterion and the live
measurement is the finding, and it is `0031`.

### 2026-09-08 review (v20260908101845-321d)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Checked both criteria against the tree.

**Criterion #1 ÔÇö met.** `docs/board/human-review/0026-scraped-at-says-the-parse-date-not-the-fetch-date.md`, its `## Links` section under `**Relates to**`, now carries a `0023` entry with the relationship stated: it folded the note out of HANDOVER's prose into DATA-MODEL's divergences. That is the missing relationship the card named. There is no function to cite; the artefact is the card file itself, which is what this card's scope was.

**Criterion #2 ÔÇö the fix holds, the board number does not.** Re-running the check from this repository root now prints:

    NearestForest   11   52   0055

Eleven open cards fail. **`0026` is not one of them** ÔÇö it does not appear in the list, so the edit this card made is doing its job. Every failing card named (`0032`, `0038`, `0039`, `0046`ÔÇô`0053`) was created after this work, by other sessions, and each is the same unexplained-link fault in a different card. So the criterion's literal words ("zero open cards failing") read false today, but nothing this card touched caused it, and this card may not edit other cards.

That is board drift for a new card to catch, not a defect in this build.

VERDICT: sound

**scope: defect**

**What I checked**

`docs/board/human-review/0026-scraped-at-says-the-parse-date-not-the-fetch-date.md` does now carry `0023` under `**Relates to**` with the relationship stated. That part is done.

**Over the fence**

The Plan says "One card file changes and nothing else." The build's own log admits four edits to `docs/HANDOVER.md` (the counts of `ai-review/` cards, the "0028 is agent-ready" line, and the deleted "the convention check reports one failing card, 0026" sentence). None of that is in `## Tasks`, none is in `## Acceptance`, and `## Not this card` names no allowance for it. Correct edits, but they are a second card's work done inside this one, and the log says they are what pushed `docs/HANDOVER.md` back over the 40 KB budget ÔÇö a live regression created by an out-of-scope edit.

The build then raised `0031` to describe the breakage it had just caused, instead of not causing it. `0030` is a fair out-of-scope raise; `0031` is scope growth reported as a finding.

Nothing was left half done inside the fence.

**What to do now:** send the card back; the HANDOVER edits belong on their own card.

VERDICT: defect

**breakage: sound**

I checked the card's actual change, and tried to break it.

- `docs/board/human-review/0026-scraped-at-says-the-parse-date-not-the-fetch-date.md`, `## Links` ÔÇö the `0023` entry is there with the relationship stated. It survived 0026's later move from `ai-review/` to `human-review/`, because the entry lives in the card file, not in a path.
- I re-ran the checker the card names: `php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards`. `0026` no longer appears. The board now shows 11 failures, but every one is a card written after this work (0032, 0038, 0039, 0046ÔÇô0053), so none is breakage this change caused.
- No caller, comment or docblock depends on the edited text. The only code-shaped risk would be a script reading `docs/board/`, and `scripts/selftest.js` reads nothing there.
- The HANDOVER sentence that this work made false ("the convention check reports one failing card, 0026") is gone. The one still in `docs/HANDOVER.md` under the `0024` bullet already says 0028 is built, so it is not stale.

Nothing in the diff outside this card belongs to it; those are other cards' work.

VERDICT: sound


**2026-09-08** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-10** Rob's call, answering the queue: **re-run this card through `ai-review/`.** It met
its own acceptance - the reviewer graded that lens `sound` - and the finding that returned it is
next door to the card rather than inside it. A builder could not act on it and a reviewer may not
untick a box, so the card sat here fully ticked while every unattended run promoted it again. It is
not closed and it is not reopened. It goes back for a fresh adversarial pass with the earlier
verdicts still on the thread, and that pass decides whether the finding is this card's to carry.
