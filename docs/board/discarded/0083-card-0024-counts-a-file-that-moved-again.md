# Card 0024 counts a file that moved again

## Why
**`0024`'s `## Plan` tells its reader to count with
`wc -l docs/board/todo/0018-write-to-forestry-england.md`, and that path does not exist.** `0018` is
in `docs/board/done/`. The command errors, in a card whose job is counting that file.

**How it came to be this way.** Card `0037` moved `0018` to `human-review/` and broke the path. Its
2026-09-29 `Decided` entry said the fault was gone because `0018` had moved back to `todo/` that day.
`0018` has since moved to `done/`, so the path is broken again. A path to a card names its lane, and
the lane changes.

## Links

**Relates to**
- `0024` - the card carrying the broken path, in `human-review/`.
- `0018` - the card being counted, now in `done/`.
- `0037` - first broke the path, and its 2026-09-29 entry recorded it as fixed.

## Not this card
Not re-deciding `0024`'s line budget or its pass condition. Not editing `0018`.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 THE CARD `0024` SHALL name no path to `0018` that does not exist, and SHALL count `0018`
      by a command that does not depend on which lane it sits in. proves: none - a card's text is
      not reached by this project's suite; the check is running the command `0024` names
<!-- AC:END -->

## Plan
In `docs/board/human-review/0024-two-cards-are-over-the-line-budget.md`, `## Plan`, replace the
`wc -l docs/board/todo/0018-write-to-forestry-england.md` path with a lane-free form such as
`wc -l docs/board/*/0018-*.md`. Leave `## Comments` alone. Run the command and see it print a count.

## Comments

**2026-10-05** Raised by an unattended run of card `0037`, which found the path broken while
checking the fault its own ask named.

**2026-10-07** Discarded: its subject card (0024) was discarded on 2026-10-07 in the human-review clean-up, so there is nothing left to fix.
