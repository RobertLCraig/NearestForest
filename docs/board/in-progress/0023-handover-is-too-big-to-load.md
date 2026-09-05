# HANDOVER.md is too big for the session that has to read it

## Why
`docs/HANDOVER.md` is **41.5 KB over 545 lines**, measured 2026-09-05. The project's orient hook
fires at the start of every session in this repository and says so in those words: over the ~40 KB a
fresh session can afford to load, so "the brief is already failing at its only job".

What it costs, and it is paid once per session by every agent that opens the repository. The brief
exists so a session with no context can start work. A brief that will not fit is one a session reads
partially, or skips, and a partial read of a handover is worse than no read at all, because the
session does not know which half it missed. CLAUDE.md here makes reading it the first instruction.

How it came to be this way. Nothing was ever deleted from it. Every card that landed appended its
own paragraph to the Status block, so that block now carries five dated runs in a row, each written
as news rather than as fact, and each still there after the news stopped being new. The file grew a
line at a time and no single commit is the one that broke it.

## Links

**Relates to**
- `0021` - the same failure one level down, on this board's cards rather than on the brief. It
  applied the writing convention to the cards and left the brief alone, because the brief is not a
  card and the checks it runs do not read it.

## Not this card
Not the board cards, which `0021` covers. Not `PRD.md`, `DATA-MODEL.md` or `DECISIONS.md`, none of
which is over budget. Not shaving single lines to land on a number: the standard's own rule is to
fold **one stale block** out at a time and measure, never to compress prose that is still load
bearing. Not deleting a decision or a measurement; a fact that is still true moves to the doc that
owns it rather than being cut.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN `docs/HANDOVER.md` is measured, THE FILE SHALL be under 40 KB. proves: none - this
      project has no test suite that reads the docs; the check is `Get-Item docs\HANDOVER.md`
- [ ] #2 WHEN a block is folded out, THE FILE SHALL keep every date, count and decision it carried,
      moving anything still true to the doc that owns it rather than dropping it. proves: none - as #1
- [ ] #3 WHEN the orient hook next fires in this repository, THE HOOK SHALL NOT report the file as
      over budget. proves: none - as #1
<!-- AC:END -->

## Tasks
- [ ] Measure which section carries the weight, rather than guessing
- [ ] Fold the heaviest stale block out, in its own commit
- [ ] Measure again, and stop as soon as the file is under budget

## Plan
Work in the NearestForest repository, on a branch off `main`. Nothing outside `docs/` is touched.

Measure first, so the fold is decided by the number rather than by a guess. In PowerShell, from the
repository root:

    Select-String -Path docs\HANDOVER.md -Pattern '^## ' -AllMatches

then read the byte offsets of the sections between those headings.

The **Status** block at the top is the likely answer and should still be measured rather than
assumed. It carries five dated build reports appended one after another, each phrased as news. A
report of what a card did belongs on that card's own comment thread, where it already is; the brief
needs the one line saying what is true now.

`Get-Item docs\HANDOVER.md` gives the size. It worked when that reads under 40960 bytes and the hook
stops flagging it on the next session start.
