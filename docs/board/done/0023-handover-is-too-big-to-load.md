# HANDOVER.md is too big for the session that has to read it

## What I need from you

**ANSWERED 2026-09-10, and this card is closed.** Rob chose to have the brief fixed rather than
have the card reopened. What was done, and which change answered which card, is the last entry in
`## Comments`. Nothing below is still being asked.

**Untick criteria #1 and #3 and send this card back to `todo/`, or write a dated line on the thread
saying the reviewer is wrong.** Either one closes it. Doing neither leaves the card exactly here.

**What's wrong.** This card is ticked as having made the brief fit. It does not fit.
`docs/HANDOVER.md` is **42,299 bytes** today against a budget of about 40 KB, and the hook that runs
at the start of every session in this project still says so out loud. Criterion #1 says the file is
under 40 KB and criterion #3 says the hook no longer complains. Both are ticked and both are false.
The reviewer also found this card's build carrying other cards' code and about forty new board cards.

**Cause.** The fold did work: the file was 38,528 bytes the day it landed. Five later commits put it
back over, and nothing unticks a box when the thing it measured changes. A reviewer is forbidden from
unticking a criterion, so the card came back with all three still ticked, and every unattended run
since has opened it, found nothing to do, and promoted it again on the ticks.

**Pass** is either of these:
- criteria #1 and #3 unticked and the card in `todo/`, where a session can fold another block out
- a dated line here saying why the reviewer is wrong

**Fail** is neither. The card stays ticked, the brief stays over budget, and the next run promotes it
again.

**Why it needs you.** Only you may untick a criterion. There is also a judgement in it: the extra
code in the diff may be other cards riding on a shared branch rather than this card overreaching, and
no lookup settles which.

**Note on length.** This section takes the card past the 100-line budget. `## Comments` and the
review verdicts are append-only, so nothing here could be cut to make room.

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

**What was folded.** The four dated build reports inside `## Current state`, one for card 0020 and
three for 0004, 0015 and 0016, 5,391 bytes of five paragraphs each written as news. They were
replaced by two lines saying what is true now: which cards are built, which are not yet deployed,
the dates, the current self-test count and cache key, and a pointer to each card's own comment
thread in `ai-review/`, where the detail already lives.

**Criterion #2 was checked mechanically, not by eye.** Every numeric token in the removed text was
extracted and searched for across `docs/`. One did not survive: `430`, from card 0015's render
widths, and it is on card 0015 itself, in the full measurement table. Every other date, count and
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

### 2026-09-08 review (v20260908100035-216a)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: defect**

Here is what I found.

**Criterion #2 ÔÇö holds.** The two moved facts are real: the `rgba(0,0,0,.72)` / 9.29:1 note is in `docs/HANDOVER.md` under the `app/map.js` entry in Key files, and the `scraped_at` divergence is in `docs/DATA-MODEL.md` under Known divergences (now closed). The one dropped number, `430`, is still on card 0015.

**Criterion #1 ÔÇö fails now.** `docs/HANDOVER.md` is 42,040 bytes today. The limit is 40 KB (40,960). The criterion has no "at commit time" wording, so measuring the file is the check, and the check fails.

**Criterion #3 ÔÇö fails now.** `~/.claude/hooks/orient-hook.ps1` flags on `$bytes -gt 40KB`. This very session's start-up message printed "HANDOVER.md IS 41 KB, over the ~40 KB a fresh session can afford to load". The hook does report it as over budget.

The fold did work at the time (38,528 bytes at its own commit), but five later commits to `docs/HANDOVER.md` put it back over, and the boxes stay ticked. The brief is failing its only job again, which is the exact thing the card exists to stop.

VERDICT: defect

**scope: defect**

**Findings ÔÇö scope only.**

1. **The diff is far bigger than the card.** The Plan says "Nothing outside `docs/` is touched," and the agent's own comment lists four docs files as TOUCHED. The recorded change also edits `app/core.js` (new `mapHint`, rewritten `safeHref` comment), `app/map.js`, `app/index.html`, `app/sw.js`, `app/data/campsites.json`, `scripts/parse.py`, `scripts/fetch.py`, `scripts/parse_campsites.py` and `scripts/selftest.js` (+356 lines). None of that is a stale block folded out of `HANDOVER.md`. That is card 0020/0015 work riding on a docs card.

2. **The board grew ~40 new cards** under `docs/board/ai-review/` and `docs/board/human-review/`, plus lane moves of 0006, 0008, 0012, 0013, 0014, 0018, 0020, 0024. The card allowed exactly one new card (0026) as an out-of-scope note. `0024`, `0027`, `0033`, `0035`, `0037` and the rest are over the fence.

3. **Left half done.** `docs/HANDOVER.md` measures **42,040 bytes** today ÔÇö over the 40 KB the card set and over what criteria #1 and #3 assert. Card `0031-handover-is-over-budget-again-and-0023-is-ticked-as-under.md` already exists saying so, which means the tick was known to be false and left ticked.

VERDICT: defect

**breakage: defect**

**What I checked.** The facts the fold moved out are all still findable: `rgba(0,0,0,.72)` and the 9.29:1 bound live in HANDOVER's `app/map.js` entry (matching `.map__hint--attrib` in `app/app.css`); the `scraped_at` divergence lives in `docs/DATA-MODEL.md` and is now marked closed; `NF.mapHint()` in `app/core.js` and `updateHint()` in `app/map.js` match what HANDOVER's Key files entry says about them, and `scripts/selftest.js` asserts both. I grepped the numbers the fold removed (`1,512`, `177`, `3600`, `219`, `274`) and each still has a home. No caller, comment or docblock was made false by the fold.

**What is broken.** `docs/HANDOVER.md` is 42,040 bytes right now. Criteria #1 and #3 on this card are ticked as satisfied, and the orient hook fired at the start of this very session with "HANDOVER.md IS 41 KB, over the ~40 KB a fresh session can afford to load". So the card asserts a state the repository does not hold. Card `0031` in `docs/board/ai-review/` names this exact failure, and a later fold (`33e6a5e`) took the file to 37,430 bytes, but it has grown back over budget since. The tick is a rule asserted in one place and contradicted by the file it measures.

VERDICT: defect


**2026-09-08** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 3 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 3 of 3 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-10** RESULT: closed by Rob's call, with the work done first.
TESTS: +0 new, all green (280 passed, 0 failed)
TOUCHED: docs/HANDOVER.md, plus docs/board/human-review/0010 and 0027, which took the folded facts
OUT-OF-SCOPE: none

**Rob's answer.** Five cards - `0023`, `0031`, `0040`, `0041` and `0044` - were all about
`docs/HANDOVER.md`, all ticked as fixed and all false. Asked whether to reopen them, replace them
with one card, or fix the brief now and close all five, he chose the third. This entry is the note
that says which change answered which card.

**Change 1: the brief now carries no card list and no card count.** That is the fix `0040`, `0041`
and `0044` each attempted by hand, and each went stale within a day because a list of card numbers
is wrong the moment anything moves. Three places carried one and all three now say to list the
folder instead: the status block at the top, the opening of "Blockers / open questions", and item 4
of "What's next". The bullets under Blockers stay, because they say what a card wants from a person,
which a folder listing cannot.

**Change 2: one more stale block folded out, and the brief is under budget.** That is `0023` and
`0031`. `docs/HANDOVER.md` went 42,299 bytes at the start of this session to **40,722**, under the
40,960 limit. Two blocks moved to the card that owns them, neither cut:

- the DNS measurement behind Rob not being able to send from `enhanceify.co.uk` went to card `0010`,
  which is the one card it blocks
- the shape of `docs/outreach/` and which screenshots go with the enquiry went to card `0027`, which
  is the card that sends it

Every removed string was grepped against the whole tree afterwards and each still has a home.

**Proved, not asserted.** The session-start hook was run by hand against this repository and no
longer reports the file as over budget, which is criterion #3 on both `0023` and `0031`.

**The tension, said out loud.** `docs/board/README.md` says nothing reaches `done/` without an
adversarial pass. These five go straight there on Rob's instruction, and the work was done by the
same session that is closing them, so the ticks record what that session did rather than what a
reviewer checked. The brief's size and its card lists are both checkable in one command each:
`Get-Item docs\HANDOVER.md` and `Select-String -Path docs\HANDOVER.md -Pattern '\b00\d\d\b'`.
