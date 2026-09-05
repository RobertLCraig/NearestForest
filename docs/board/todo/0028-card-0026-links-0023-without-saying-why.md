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
- [ ] #1 WHEN `0026` is read, THE CARD SHALL carry `0023` in its `## Links` with one line saying what
      the relationship is. proves: none - no check in this repository reads a card's links
- [ ] #2 WHEN the convention check is re-run, THE BOARD SHALL report zero open cards failing.
      proves: none - the command lives in another repository, named in `## Plan`
<!-- AC:END -->

## Tasks
- [ ] Add a `0023` entry under `**Relates to**` in `docs/board/todo/0026-scraped-at-says-the-parse-date-not-the-fetch-date.md`
- [ ] Re-run the convention check and confirm the board is back at zero

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
