# Card 0055 is blocked by a card that was answered

## Why
**A card in the queue says it cannot start, and the thing it is waiting for arrived.** Card `0055`
carries `needs: 0025` in its frontmatter and a matching `Blocked by` line reading "it settles where a
card's ask sits". `0025` was answered on 2026-09-10 and sits in `done/`. Nothing is stopping `0055`.

**What it costs.** `needs:` is the board's work order and is read in both directions, so a stale one
misreports what is stuck behind what. The practical loss here is small because a renderer treats
`done/` as settled, and the real cost is to the reader: anyone opening `0055` is told to go and read
a blocker before starting, and spends the page load finding out it was answered. `0055` also holds
the one assertion keeping the suite red, so it is a card people open.

**How it came to be this way.** The run that removed `needs: 0025` from card `0021` on 2026-09-11
removed it from that card only. Both cards named the same blocker for the same reason and only one
was cleared. The 2026-09-11 adversarial pass on `0021` recorded this as a defect in prose on that
card's thread, and prose is not a card, which is why it is still here a day later.

**Nothing checks for it.** No assertion on this board reads whether an open card's `needs:` names a
card that is already settled, so a blocker can outlive its answer indefinitely and the board will
keep reporting it.

## Links

**Relates to**
- `0055` - the card carrying the stale blocker. Its own acceptance and its ask are untouched by
  this; only the frontmatter and one `## Links` line change.
- `0025` - the answered card. Its `## Comments` entry of 2026-09-10 is the answer, and it names
  `0055` as one of the two cards it unblocks.
- `0021` - the card whose reviewer found this, and the card that cleared the same stale blocker
  from itself and nowhere else.
- `0069` - `0055` currently exists as two files, in `todo/` and in `human-review/`, and both carry
  the stale blocker. Resolving that duplication first means fixing this once instead of twice.

## Not this card
**Not answering or building `0055`.** Its open criterion asks Rob whether card `0020`'s comment
thread may be pruned, and that stays open and untouched.

**Not a sweep of every frontmatter key.** One key on one card is stale; the check below generalises
it, and a rule written from one example beyond that is a rule nobody measured.

**Not editing `## Comments` on any card.** The thread is append-only.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 THE CARD `0055` SHALL carry no `needs:` naming a settled card, and its `## Links` SHALL
      record `0025` as answered rather than as a blocker. proves: `no open card is blocked by a
      settled card`
- [ ] #2 WHEN the self-test suite runs, THE SUITE SHALL fail naming every open card whose `needs:`
      lists a card number found only in `done/` or `discarded/`. proves: `no open card is blocked
      by a settled card`
<!-- AC:END -->

## Tasks
- [ ] Write the assertion first and watch it name `0055` before changing `0055`
- [ ] Remove `needs: 0025` and move the `Blocked by` line to `Relates to` with the answer on it
- [ ] Re-run the suite and the board convention check

## Plan
**Where to stand.** This repository, on a branch of `main`. There is no PHP suite here and no
`vendor/`, so `pest` and `pint` do not exist. The suite is `node scripts/selftest.js`. It is
deliberately red today on `no board card is too large for the agent file reader`, which
`docs/HANDOVER.md` explains; that red is not yours.

**The check goes in `scripts/selftest.js`**, beside the board-shape checks already there near lines
2824 and 2855. Both already walk the lane folders. What is new: read the `needs:` line out of each
open card's frontmatter, and for each number it lists, fail if a file matching `<number>-*.md` is
found only under `done/` or `discarded/`. Settled means answered, so `done/` and `discarded/` count
and no other lane does, per `docs/board/README.md` under "The three permitted fields". Name it
exactly `no open card is blocked by a settled card`.

**Red-proof it on the real defect.** `0055` is stale at HEAD, so a correct check is red naming
`0055` on its first run, before any edit. That is the proof, and it is the whole reason to write the
check before touching the card. Then fix `0055` and watch the same run go green. If `0069` has not
been worked yet there are two copies of `0055`, in `todo/` and in `human-review/`, and the check
should name both.

**What the fix on `0055` looks like.** Delete the `needs: 0025` frontmatter block. Under `## Links`,
move the `0025` entry out of `Blocked by` and into `Relates to`, with the answer as its reason line:
Option 1, 2026-09-10, the ask stays directly under the title. Remove the `Blocked by` heading if
nothing is left under it, because `Blocked by` must agree with `needs:` in both directions.

**The other measurement, from this board's directory in PowerShell:**

    php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards

It should still report the same number of failing cards after this work as before it. This card does
not change that count; it is a staleness fault the convention check does not look for.

## Comments

**2026-09-11** Raised by an unattended run of card `0021`. The 2026-09-11 adversarial pass on that
card recorded this as its second defect, on that card's thread rather than as a card, and the run
after it could not act on a finding written in prose about a different card.
