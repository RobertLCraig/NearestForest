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
- [x] #1 WHEN `docs/HANDOVER.md` is measured, THE FILE SHALL be under 40 KB. proves: none - this
      project has no test suite that reads the docs; the check is `Get-Item docs\HANDOVER.md`
- [x] #2 WHEN a block is folded out, THE FILE SHALL keep every date, count and decision it carried,
      moving anything still true to the doc that owns it rather than dropping it. proves: none - as #1
- [x] #3 WHEN the orient hook next fires in this repository, THE HOOK SHALL NOT report the file as
      over budget. proves: none - as #1
<!-- AC:END -->

## Tasks
- [x] Measure which section carries the weight, rather than guessing
- [x] Fold the heaviest stale block out, in its own commit
- [x] Measure again, and stop as soon as the file is under budget

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

## Comments
**2026-09-05** RESULT: done
TESTS: +0 new, all green (219 passed, 0 failed). All three criteria are `proves: none`, so per the
board README no test was written for them. This project has no `vendor/`, no `composer.json` and no
PHP, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist here; the suite is
`node scripts/selftest.js` and that is what was run.
TOUCHED: docs/HANDOVER.md
TOUCHED: docs/DATA-MODEL.md
TOUCHED: docs/board/in-progress/0023-handover-is-too-big-to-load.md
TOUCHED: docs/board/todo/0026-scraped-at-says-the-parse-date-not-the-fetch-date.md
OUT-OF-SCOPE: 0026

**Measured first, and the measurement disagreed with the Plan's guess.** Bytes per `## ` section:
Current state 9,293; Key files 8,669; Canonical data shape 4,080; Blockers 4,051; the Status
preamble 3,835; everything else under 3,300. The Plan expected the Status block at the top. It does
carry dated news, but `## Current state` carries more than twice as much of it, so that is the block
that was folded. 1,476 bytes had to go.

**What was folded.** The four dated build reports inside `## Current state` — one for card 0020 and
three for 0004, 0015 and 0016 — 5,391 bytes of five paragraphs each written as news. They were
replaced by two lines saying what is true now: which cards are built, which are not yet deployed,
the dates, the current self-test count and cache key, and a pointer to each card's own comment
thread in `ai-review/`, where the detail already lives.

**Criterion #2 was checked mechanically, not by eye.** Every numeric token in the removed text was
extracted and searched for across `docs/`. One did not survive: `430`, from card 0015's render
widths — and it is on card 0015 itself, in the full measurement table. Every other date, count and
decision is still in DATA-MODEL, DECISIONS, PRD, the surviving HANDOVER sections, or the card that
produced it.

**Two facts had no other home and were moved rather than dropped.**
1. The tile attribution's `rgba(0,0,0,.72)` and its 9.29:1 worst-case bound moved to HANDOVER's
   `app/map.js` entry under Key files, as a do-not-undo note. That is a rule about shipped code, so
   Key files owns it; a new DECISIONS entry would have cost more bytes than the fold saved.
2. `scraped_at` being stamped at parse time rather than fetch time moved to DATA-MODEL's
   "Known divergences", which is the section that owns divergences. It had been sitting in HANDOVER
   prose since 2026-08-29 marked "worth a card" with no card behind it, so **card 0026** was raised
   for it. It is not fixed here.

**Criterion #3 was proven by running the hook, not by reading it.** This session's own start-up
message carried "HANDOVER.md IS 41 KB, over the ~40 KB a fresh session can afford to load". After
the fold, `~/.claude/hooks/orient-hook.ps1` was run again against this worktree with a throwaway
session id and printed the orient line with no budget warning. The hook's two thresholds are
`$bytes -gt 40KB` and a longest line over 400 characters; the file is now 38,528 bytes and its
longest line is 187 characters.

**Two statements in HANDOVER were made false by raising 0026 and were corrected in the same pass:**
"No agent-ready card is left" in the Status block and again in Blockers. The Status block also said
twelve cards await an adversarial pass; `ai-review/` holds fourteen, so that count was already
stale and is now counted rather than carried.

**What I could not settle from the repository.** Whether card 0020's Campsites tab is deployed. The
Status block lists 0004, 0015, 0016 and 0019 as undeployed and 0020 is not in that list, but that
sentence predates 0022, which is also undeployed and also absent from it. The folded text is
therefore silent on 0020's deploy state rather than asserting one.

**Not done, and deliberately.** The Status preamble still carries three dated run reports of its own
(3,835 bytes) and `## Key files` is 8,669. Both are candidates for a later fold. The card said to
stop as soon as the file is under budget, so this run stopped. No browser check applies; nothing
outside `docs/` was touched.
