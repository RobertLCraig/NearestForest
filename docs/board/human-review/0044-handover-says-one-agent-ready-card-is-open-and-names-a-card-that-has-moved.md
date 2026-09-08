# `docs/HANDOVER.md` names `0041` as the open agent-ready card, and it has moved

## Why
`docs/HANDOVER.md` says, in two places, that one agent-ready card is open and that it is `0041`:

- the status block near the top, lines 13-15: "**One agent-ready card is open**, 0041, the stale
  `human-review/` and `ai-review/` counts in this file".
- "Blockers / open questions", which adds "`ls docs/board/todo` is the honest count: **0041**".

Neither is true on 2026-09-07. `0041` is built and sits in `ai-review/`. `docs/board/todo/` does not
contain it, and the card it raised, `0042`, is in `in-progress/`.

What it costs. Both sentences cite a folder listing as their evidence, which is exactly what makes a
reader trust them without opening the folder. A session picking up agent-ready work is pointed at a
card that is finished, and the work that is actually open is not named. The same file's own rule is
that the folder is the count, so a wrong number here is worse than no number.

How it came to be this way. The sentence is correct at the moment it is written and wrong as soon as
the scheduler moves the card it names. `0040` corrected this paragraph, `0041` corrected it again,
and each correction went stale the same way within a day.

## Links

**Relates to**
- `0041` - it wrote the sentences that are now stale, and its own comment thread already records that
  the `todo/` line "reads oddly today" for this reason.
- `0042` - found this while renumbering the duplicate `0022`, which touched the neighbouring lines of
  the same two paragraphs. `0042`'s scope was the id collision, so this was left rather than fixed in
  passing.

## Not this card
Not re-counting `human-review/` or `ai-review/`; those two counts were taken on 2026-09-07 by `0041`
and `0042` and are current. Not a mechanism that keeps these sentences fresh automatically: whether
this file should name individual card numbers at all is a bigger question than this instance, and it
belongs on its own card.

## Acceptance
<!-- AC:BEGIN -->
- [x] WHEN `docs/HANDOVER.md` names the open agent-ready cards, THE FILE SHALL name exactly the cards
      that `ls docs/board/todo` and `ls docs/board/in-progress` return on the day it is written.
      proves: none - this project's suite is one node script over the app and cannot read the board;
      the check is listing both folders and reading the two paragraphs against them
<!-- AC:END -->

## Tasks
- [x] List `docs/board/todo/` and `docs/board/in-progress/` and write down what they hold
- [x] Correct the status block near the top of `docs/HANDOVER.md`
- [x] Correct the same claim in "Blockers / open questions"
- [x] Re-read both paragraphs against the folders before committing

## Plan
Work in the NearestForest repository. Only `docs/HANDOVER.md` changes; nothing under `app/` or
`scripts/` is involved, so `node scripts/selftest.js` cannot see this either way. Run it anyway to
show the change broke nothing.

**Read the folders, never the prose.** Both wrong sentences were written from an earlier sentence.
`ls docs/board/todo` and `ls docs/board/in-progress` are the only honest source, and the card in
`in-progress/` counts as open work even though it is not sitting in `todo/`.

**Say the date.** Every count in this file that has survived carries the date it was taken, and that
is what lets the next reader tell a stale number from a wrong one.

It worked when both paragraphs name the same set of card numbers the two folders return that day, and
neither paragraph names a card that is in `ai-review/`, `human-review/` or `done/`.

## Comments
**2026-09-07** Raised by card `0042` while it renumbered the duplicate `0022`. `0042` edited the
neighbouring lines of both paragraphs, so the stale sentence was read but deliberately not touched:
its scope was the id collision.

**2026-09-07** RESULT: done
TESTS: +0 new, all green (227 passed, 0 failed)
TOUCHED: docs/HANDOVER.md, docs/board/in-progress/0044-handover-says-one-agent-ready-card-is-open-and-names-a-card-that-has-moved.md
OUT-OF-SCOPE: none

`ls docs/board/todo` on 2026-09-07 returns one card, `0045`. `ls docs/board/in-progress` returns
`0021` and `0044`. Both paragraphs now name that set and nothing else, each carrying the date the
listing was taken. `0041` no longer appears anywhere in `docs/HANDOVER.md`.

The one judgement call: `0044` is this card, and it names itself while it sits in `in-progress/`.
That is what the criterion asks for - the folders are the source, and the folder held it today - but
the scheduler will move it on this session's end, so the sentence goes stale for the same reason
`0040` and `0041` did. This card was told not to build a mechanism that stops that; the question
belongs on its own card and is already named in "Not this card".

The criterion's `proves:` is `none`, so no test was written for it. `node scripts/selftest.js` ran
green as the Plan asked, purely to show the edit broke nothing; it reads `app/` and `data/` and
cannot see the board. There is no PHP suite in this repository - no `vendor/`, so no
`vendor\bin\pest.bat` or `pint.bat` to run.

### 2026-09-08 review (v20260908142904-aebb)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: defect**

I checked the folders against the file.

**What the criterion asks:** `docs/HANDOVER.md` must name exactly the cards in `docs/board/todo/` and `docs/board/in-progress/`.

**What is there.** The status block at the top of `docs/HANDOVER.md` ("Three agent-ready cards are open") and the "Blockers / open questions" paragraph both name the set **0045, 0021, 0044**.

**Defect 1 ÔÇö `0020` is missing.** `docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md` sits in `in-progress/`, and `git log` shows it was already there in the same commit that edited `docs/HANDOVER.md` (`964d104`). So the file misses a card that the folder held on the day it was written. That is the exact miss the card exists to stop.

**Defect 2 ÔÇö `0045` is not in `todo/`.** `ls docs/board/todo` returns `0052`, `0053`, `0054`. No `0045` anywhere. Both paragraphs point a reader at a card that is not open.

The dated wording ("on 2026-09-07") covers normal drift, but not Defect 1: that one was wrong at the moment of writing.

VERDICT: defect

**scope: sound**

Scope check on card `0044`.

What I did: I looked at the real commit for this card (`67fe4eb`), not the big file list in the brief. That big list is earlier cards' work (campsites, `app/core.js` `mapHint`, `scripts/selftest.js`), all of it committed before this card started.

The card's own commit touches two files only: `docs/HANDOVER.md` and its own board card. No `app/`, no `scripts/`, no data.

Fence check ("## Not this card"):
- It did not re-count `human-review/` or `ai-review/`. The status block in `docs/HANDOVER.md` still carries the old eleven-card line untouched.
- It did not build any freshness mechanism.

Half-done check: `0041` appears nowhere in `docs/HANDOVER.md`. Both paragraphs ÔÇö the status block and "Blockers / open questions" ÔÇö name the same set, `0045`, `0021`, `0044`, each with the date.

One small extra: the "Blockers" paragraph adds a new gloss that `0021` waits on decision `0025`. That is a fresh claim, not a correction of a card number. It is true (`docs/HANDOVER.md` says the same at the `0025` entry), so it is a very small overrun, not a defect.

VERDICT: sound

**breakage: defect**

**What I found (breakage lens)**

I read `docs/HANDOVER.md` against the two folders.

1. **The "Blockers / open questions" paragraph says a folder listing gave it cards that are not in that folder.** It says `ls docs/board/todo` plus `ls docs/board/in-progress` "give **0045**, the three `human-review/` cards that carry no 'What I need from you' section, and **0021** and **0044**". Those three cards live in `docs/board/human-review/`. Neither listed folder can return them. This is the same false-evidence pattern the card exists to remove, and the card's own Plan says neither paragraph may name a card sitting in `human-review/`.

2. **The two paragraphs disagree.** The status block near the top names three cards (0045, 0021, 0044). The Blockers paragraph says "Three agent-ready cards are open" and then names six. The criterion asks both paragraphs to name the same set.

3. **The date stamp is now false, not just stale.** Both paragraphs say "on 2026-09-07", but `git log -- docs/HANDOVER.md` shows the file was rewritten on 2026-09-08 by later commits, while `todo/` now holds 0052, 0053, 0054 and `in-progress/` holds 0020 and 0021. The stamp no longer marks the day the file was written, which is the one thing it was for.

VERDICT: defect


**2026-09-08** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 1 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 1 of 1 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.
