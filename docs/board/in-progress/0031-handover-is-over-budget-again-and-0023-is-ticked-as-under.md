# HANDOVER is over the 40 KB budget again, and the card that fixed it is ticked as under

## Why
The orient hook fires on every session start in this repository and reports:

    HANDOVER.md IS 41 KB, over the ~40 KB a fresh session can afford to load, so the brief is
    already failing at its only job. Fold ONE stale block out before anything else.

Measured on 2026-09-06: `docs/HANDOVER.md` is 41,522 bytes, against a 40,960-byte budget. It is over
by 562 bytes.

What it costs. Every session in this project opens with an instruction to stop and fold a block out
of HANDOVER before doing anything else. A card session cannot obey it, because HANDOVER is not in its
scope, so each one spends its opening reading the demand and writing down why it is declining. That
has now happened twice and it will happen on every run until somebody takes it. The hook is right and
nothing is acting on it.

There is a second cost, and it is the one a reviewer will hit. Card `0023` sits in `ai-review/` with
all three of its criteria ticked, including "THE FILE SHALL be under 40 KB" and "WHEN the orient hook
next fires in this repository, THE HOOK SHALL NOT report the file as over budget". The hook fired
this morning and reported it. A reviewer reading those ticks against the live file finds them false,
and cannot tell from the card whether the work was wrong or has simply been undone since.

How it came to be this way. `0023` took the file under the budget on 2026-09-05 and the ticks were
true when they were written. Card `0026`, built later the same day, added four edits to HANDOVER's
"How to pick up" so a fresh session would not be surprised by a pipeline that now exits 1. That was
a good change and it is what pushed the file back over. Nobody re-measured, because the budget is not
a criterion any card owns once `0023` is closed.

## Links

**Relates to**
- `0023` - the card that took HANDOVER under budget and whose ticks now read false. Its work was
  sound; the file grew afterwards. Read it before folding anything, because it records what was
  already moved and where to.
- `0026` - the card whose four HANDOVER edits took the file back over. Those edits are correct and
  should not be reverted; they are named only because they are how the budget was lost.
- `0028` - measured this while checking a fact for its own comment entry, and could not fix it,
  because a card session may only build its own scope.

## Not this card
Not reverting `0026`'s "How to pick up" edits, which are true and are the reason a fresh session does
not read a red pipeline as a broken repository. Not shaving single lines to land on the number: the
orient hook names that as the wrong move, and a file 1 byte under the budget is over it again on the
next card. Not `docs/PRD.md`, `docs/DATA-MODEL.md` or `docs/DECISIONS.md`, and not re-ticking or
editing `0023`, which belongs to whoever reviews it.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN `docs/HANDOVER.md` is measured, THE FILE SHALL be under 40 KB with enough headroom that
      an ordinary card's edits do not put it back over. proves: none - this project has no test that
      reads the docs; the check is `(Get-Item docs\HANDOVER.md).Length`
- [ ] #2 WHEN a block is folded out, THE FILE SHALL keep every date, count and decision it carried,
      moving anything still true into the doc that owns it. proves: none - as #1
- [ ] #3 WHEN the orient hook next fires in this repository, THE HOOK SHALL NOT report the file as
      over budget. proves: none - as #1
<!-- AC:END -->

## Tasks
- [ ] Measure which section carries the weight, rather than guessing
- [ ] Fold one stale block out, into the doc that owns what is still true
- [ ] Re-measure, and run the orient hook by hand to confirm it no longer complains

## Plan
Work in the NearestForest repository, on a branch off `main`. `docs/HANDOVER.md` changes, plus
whichever of `docs/PRD.md`, `docs/DATA-MODEL.md` or `docs/DECISIONS.md` receives what is folded out.

Measure first, in PowerShell from the repository root:

    (Get-Item docs\HANDOVER.md).Length

Then find the heavy section rather than trimming everywhere. The `_Last updated:_` block at the top
of the file is the obvious candidate to weigh first: it now runs to five stacked parenthetical
paragraphs covering 2026-08-15, 2026-08-29 and 2026-09-05, most of it a per-card narrative of runs
that are finished. What is still true about those cards belongs on the cards and in DECISIONS; what
is a record of what happened is already the commit log, which `docs/board/README.md` says the board
is not a copy of. Read `0023` first: it did this once and its comment entry says where it put things.

Aim to land clearly under the budget, not on it, so the next card's HANDOVER edit does not reopen
this. It worked when `(Get-Item docs\HANDOVER.md).Length` is comfortably below 40960 and the orient
hook is silent about the size. The hook can be run by hand by piping SessionStart JSON into it,
rather than by starting a session to see what it says.

## Comments
**2026-09-06** Raised by card `0028`. It had written into its own comment entry that no card carried
the HANDOVER budget, then checked before asserting it and found `0023` in `ai-review/` with the
budget criteria ticked and the file 562 bytes over. The finding is the gap between those two facts,
which is why this is a card rather than a line of prose in `0028`.
