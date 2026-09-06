# Card 0026 names 0023 in a sentence and never says what the relationship is

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
docs/board/todo/0031-handover-is-over-budget-again-and-0023-is-ticked-as-under.md, this card
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

Raised `0031` as well. The orient hook reports `docs/HANDOVER.md` over the ~40 KB budget on every
session start, and the first draft of this entry said no card carried that. Checking before asserting
it showed otherwise, and showed something worse: `0023` is in `ai-review/` with "SHALL be under 40 KB"
and "the hook SHALL NOT report the file as over budget" both ticked, while the file measures 41,522
bytes and the hook did report it this morning. `0026`'s four HANDOVER edits are what took it back
over, and they are correct and should stay. The gap between a ticked criterion and the live
measurement is the finding, and it is `0031`.
