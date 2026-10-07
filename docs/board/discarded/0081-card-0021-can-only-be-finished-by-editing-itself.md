---
not_for_the_loop: the fix is an edit to card 0021's own body, and the unattended brief forbids a session editing the card it is working
---
# Card 0021 can only be finished by editing itself

## Why
**Card `0021` cannot be closed by the loop that keeps dispatching it.** Its 2026-09-12 review
reopened `#1`, `#3` and `#6`, and every fix that review names is on `0021` itself:

- `#1`: delete the superseded `## What I need from you` block, 47 lines of answered ask that sit
  above `## Why` while the card is outside `human-review/`, and still order the reader to untick
  `#6` and move the card to `todo/`.
- `#3`: that same block names `0058` in a sentence, and `0058` is not in `0021`'s `## Links`.
  Deleting the block clears it; so would a `## Links` line.
- `#3`, second half: `0070` names `0020` in a sentence. `0070` is in `done/`, and `0021`'s own
  `## Not this card` forbids rewriting `done/`, so that half needs no edit, only a line saying so.

The unattended brief says "DO NOT EDIT THE CARD", because the scheduler writes the build report onto
it and a session's edit would collide at merge. On 2026-10-05 a session was dispatched at `0021`,
found nothing it was allowed to do, and returned it unmet. Without a change, every later dispatch
does the same, and each one spends a session for nothing.

`#6` is not part of this card. It reads zero only because the link check cannot see a backticked
number, which is card `0058`.

## Links

**Relates to**
- `0021` - the card that is stuck; its 2026-09-12 review lists the three reopened criteria.
- `0058` - owns the link-check blind spot that keeps `0021`'s `#6` from being a real measurement.
- `0070` - in `done/`, carries the bare `0020` mention the review named, and is out of reach.

## Not this card
Not the link checker in ProgressBoard, which is `0058`. Not `0070` or anything else in `done/`. Not
the unattended brief itself, which lives in ProgressBoard and not in this repository.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN `0021` is next read, IT SHALL have no `## What I need from you` section, and nothing
      else on it SHALL be removed. proves: none - an edit to one card, checked by `git diff` showing
      deletions only inside that section
- [ ] #2 WHEN `0021`'s thread is read, IT SHALL say that `0070` is in `done/` and out of scope for
      `#3`. proves: none - prose
<!-- AC:END -->

## Plan
An attended session, or Rob, deletes the section on `0021` and appends one `## Comments` line for
`#2`. Then `0021` can be sent back to `ai-review/`. The other route is `not_for_the_loop:` on `0021`
itself, which stops the wasted dispatches and leaves the edit for later.

**2026-10-07** Discarded: its subject card (0021) was discarded on 2026-10-07 in the human-review clean-up, so there is nothing left to fix.
