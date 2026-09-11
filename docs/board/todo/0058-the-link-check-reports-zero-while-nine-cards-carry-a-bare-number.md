---
no_outward_effect: "sent" in criterion #1 is a reader following a link between two cards, not a message anybody receives
---
# The link check reports zero while nine open cards carry a bare card number

## Why

`php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards` reported
`NearestForest	0	35	0058` on 2026-09-11, meaning no open card carries an unexplained link. Nine
open cards do. Between them they make 33 such mentions of 22 other cards, naming each in a sentence
and never in `## Links`, which is exactly the form `docs/board/README.md` calls "not a link, it is a
puzzle".

Measured 2026-09-11 over `todo/`, `in-progress/`, `ai-review/` and `human-review/`, reading only the
sections above the first log heading, and after discarding every mention written as a filename,
because a filename already names what it points at:

| Card | Named in a sentence, missing from `## Links` |
|---|---|
| `0057` | `0020` |
| `0015` | `0052` |
| `0024` | `0026`, `0028` |
| `0032` | `0040`, `0041`, `0044`, `0045`, `0055` |
| `0033` | `0003`, `0017`, `0018`, `0037` |
| `0035` | `0003`, `0010`, `0017`, `0027`, `0037` |
| `0037` | `0001`, `0002`, `0003`, `0017`, `0018`, `0020`, `0024` |
| `0053` | `0004`, `0006`, `0008`, `0011`, `0024`, `0030`, `0043` |
| `0056` | `0043` |

**What it costs.** The zero is the finish line card `0021` was measured against, and the same zero is
what any later session will read to decide this board is clean. A reader opening `0037` still meets
seven numbers with nothing beside them and still pays a page load each to find out why they matter.
A check that cannot see the fault it exists to catch is worse than no check, because it is believed.

**How it came to be this way.** The checker recognises some forms a card number is written in and not
others. Card `0021`'s own comment thread says so in as many words on 2026-09-05, and cleared more
cards than the flag named for that reason. Every card in the table above was written after that pass,
so nothing re-read them, and the gap in the checker meant nothing had to.

## Links

**Relates to**
- `0021` - the rewrite pass whose criterion #6 is this check reading zero. It found the same blind
  spot by hand in September and recorded it in prose rather than as a card, which is why it is still
  open.
- `0028` - the same class of fault on one card, fixed one card at a time. This one says the fault
  survives because the checker does not report it, not because nobody fixed it.
- `0015`, `0024`, `0032`, `0033`, `0035`, `0037`, `0053`, `0056`, `0057` - the nine cards this one
  edits. Each is listed in the table above with the numbers it names and nothing else about it is in
  scope.
- `0001`, `0002`, `0003`, `0004`, `0006`, `0008`, `0010`, `0011`, `0017`, `0018`, `0020`, `0026`,
  `0027`, `0030`, `0040`, `0041`, `0043`, `0044`, `0045`, `0052`, `0055` - the cards those nine name
  in a sentence. They are the measurement here, not work: none of them is edited.

## Not this card

**Changing the checker.** It lives in `C:\Dev\ProgressBoard`, outside this repository. If the blind
spot is worth closing at source it is a card on that board, raised separately, and this card is the
evidence for it rather than the fix.

**Changing `docs/board/README.md`.** It is a copy of a canonical file outside every repository and an
edit here is destroyed on the next distribution.

**Cards in `done/` or `discarded/`.** They are a record of what happened.

**Editing `## Comments`, `## Direction` or `## Decided` on any card.** They are append-only. The fix
is a `## Links` line and nothing else; no measurement, acceptance tick or verdict changes.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN a card in the table above names another card in a sentence, THE CARD SHALL also name it
      under `## Links` with the relationship type and one line saying why the reader is sent there.
      proves: `every card number named in a sentence also appears in that card's Links section`
- [x] #2 WHEN the sweep is re-run over every non-terminal lane, THE BOARD SHALL report no card
      naming another card outside `## Links`, and the run SHALL be shown going red first by deleting
      one of the added lines.
      proves: `removing one added Links line brings its card back into the sweep's output`
- [x] #3 THE FIX SHALL add `## Links` lines only, and SHALL change no acceptance tick, no
      measurement and no append-only section. proves: none - read the diff
<!-- AC:END -->

## Tasks
- [x] Read each of the nine cards and write one reason line per missing number, from that card's own
      prose rather than from a guess about the other card
- [x] Run the sweep, watch it go red with a line removed, restore it, watch it go green
- [x] Re-run `board:convention` and confirm it is still at zero

## Plan

**Where to stand.** This repository, on the branch the session was given. Nothing outside it changes
and no card moves lane.

**The sweep, which is not the convention check.** Read each card, cut it at the first `## Comments`,
`## Direction` or `## Decided` heading, drop the `## Links` section and every `NNNN-slug.md`
filename, then collect every remaining four-digit number beginning `00` and check it appears inside
that card's `## Links`. Twenty lines of Python, written as a throwaway and deleted with the card;
this project has no test suite that a board check belongs in, and `node scripts/selftest.js` is about
the app.

**Watch it fail before you believe it.** Delete one line you just added and re-run: the card must
come back. A sweep first seen green has never been watched catching anything, and this board has
shipped five defects under exactly that blindness.

**Where a mention is a list rather than a sentence, it is still a mention.** `0037` and `0053` each
enumerate a batch of cards with a clause beside each. That clause is the reason, so the `## Links`
line is short and may point back at the list rather than repeat it. Do not delete the list.

## Comments

**2026-09-11**
RESULT: done
TESTS: +1 new sweep, green after the fix and proved red before it. The repository suite is
`node scripts/selftest.js`: 306 passed, 1 failed, the failure being the card-`0020` file-size
assertion `docs/HANDOVER.md` declares deliberate and card `0055` carries. It was red before this work
and this card touched nothing it reads. There is no PHP suite here, so `.\vendor\bin\pest.bat` and
`.\vendor\bin\pint.bat` do not exist and were not run.
TOUCHED: docs/board/ai-review/0057-every-scottish-forest-is-labelled-a-forestry-england-page.md
TOUCHED: docs/board/human-review/0015-attribution-is-unreadable-over-tiles.md
TOUCHED: docs/board/human-review/0024-two-cards-are-over-the-line-budget.md
TOUCHED: docs/board/human-review/0032-handover-carries-a-self-test-count-nothing-re-measures.md
TOUCHED: docs/board/human-review/0033-a-decision-card-nobody-can-see-sits-in-todo.md
TOUCHED: docs/board/human-review/0035-person-only-task-cards-sit-in-todo.md
TOUCHED: docs/board/human-review/0037-three-decision-cards-are-still-in-todo.md
TOUCHED: docs/board/human-review/0053-card-0019-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/human-review/0056-eleven-more-human-review-cards-have-no-required-section.md
TOUCHED: docs/board/in-progress/0058-the-link-check-reports-zero-while-nine-cards-carry-a-bare-number.md
TOUCHED: docs/board/todo/0059-five-human-review-cards-have-no-required-section-again.md (new)
OUT-OF-SCOPE: 0059

**The sweep reproduced this card's table exactly before anything was edited**, nine cards and the
same 33 mentions of 22 cards, which is what made it worth trusting. It is the twenty lines `## Plan`
describes: cut each card at its first log heading, carve out `## Links`, strip every `NNNN-slug.md`
filename, collect the remaining four-digit numbers beginning `00`, drop the card's own number, and
report anything not inside that card's `## Links`. It lived in `%TEMP%` and is deleted, per the Plan.

**Red first, on the criterion's own terms.** I removed the one `## Links` line added to `0056` and
re-ran. The sweep named `human-review/0056 ... 0043` and exited 1. Restored, and it is back to zero
with exit 0. The patch that removed the line asserted on its own match text first, so a line that had
silently moved would have stopped the run rather than printing a green pass.

**39 insertions across nine files and no deletions**, which is criterion #3 read off
`git diff --stat`. No acceptance tick changed, no measurement changed, and nothing was written into a
`## Comments`, `## Direction` or `## Decided` section on any of the nine.

**Each reason line comes from the card it sits on.** Where the mention is an enumeration with a
clause beside each number, which is `0037`, `0053` and `0032`, the line points back at that list
rather than repeating it, as `## Plan` says it may. The list itself is untouched.

**`board:convention --path=$PWD --cards` still reports zero**, on the last column showing this
worktree rather than `C:\Dev\NearestForest`.

**Assumed:** that a number appearing inside another card's reason line under `## Links` counts as
linked. That is how the card's own table was measured, since `0037` names `0025` and `0010` only
inside its existing link reasons and the table does not list either.

**Raised rather than fixed:** five cards in `human-review/` carry no `## What I need from you`, and
`0053` and `0056` are two of them, which is the outcome both of their reviewers predicted in
September. That is card `0059`.

**Could not settle from the repository:** whether the checker in `C:\Dev\ProgressBoard` should be
taught the forms it misses. `## Not this card` puts that outside here, so this card is the evidence
for such a card on that board and not the fix.

### 2026-09-11 review (v20260911031030-cb62)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I re-ran the sweep myself over `todo/`, `in-progress/`, `ai-review/` and `human-review/`, with the card's own rules: cut at the first log heading, drop `## Links`, strip `NNNN-slug.md` filenames, keep four-digit numbers starting `00`. Result: zero cards with a bare number.

**#1** Each of the nine files gained lines under `## Links`, inside the `**Relates to**` group, each with a reason sentence. I read them in commit `9f7a556` for `0032` and `0057`, and the reasons match those cards' own prose.

**#2** My independent sweep agrees at zero. It is also able to report: an earlier variant of my own run that lost the Links text printed 26 cards, so the check is not one that always says zero. Removing `0043` from `0056` would flag it, because `0043` is still named in that card's `## Why`.

**#3** `git show --stat 9f7a556` shows the nine card files gained 2 to 8 lines each and lost none. The only deletions in that commit are on card `0058` itself, which is its own acceptance ticks. No measurement and no append-only section changed.

I tried to break each criterion and could not.

VERDICT: sound

**scope: sound**

**Scope check, card 0058.**

The build for this card is one commit, `9f7a556`. Everything else in the branch diff (the lane moves for `0008`, `0011`, `0012`, `0013`, `0019`, `0021`, `0036`, `0055`, `0057`, the `docs/HANDOVER.md` note and the `scripts/selftest.js` size check) comes from other commits and other cards. So it is not this card's growth.

Inside `9f7a556` there are 197 added lines and 6 removed. The removals are only the acceptance and task ticks on this card's own file. Every one of the nine card edits is a bullet added under `## Links` and nothing else. No `## Comments`, `## Direction` or `## Decided` section on the nine was touched, no measurement changed, no card moved lane.

The fence in `## Not this card` holds. Nothing in `C:\Dev\ProgressBoard` changed, `docs/board/README.md` is untouched, and no card in `done/` or `discarded/` was edited.

I re-ran the sweep myself over `todo/`, `in-progress/`, `ai-review/` and `human-review/`, cutting at the first log heading and carving out `## Links`. It printed nothing, so no mention is left unlinked.

The one growth is the new card `0059` in `todo/`. Raising rather than fixing is the board's own practice, and the build declared it as out of scope.

I tried to find growth and a half-done edge, and found neither.

VERDICT: sound

**breakage: defect**

**What I attacked.** Each new `## Links` line, read as a claim about the repository as it stands today.

**Held.** In `docs/board/human-review/0033-...`, the new line says `0003`, `0017` and `0018` carry no `**Decided:**` entry. I grepped all three: none does. In `docs/board/human-review/0055-...` the card-size ask matches the check `no board card is too large for the agent file reader` in `scripts/selftest.js`, and no added line pushes a card near the 200 KB limit. No shipped code path is touched, so no caller can break.

**Broken.** In `docs/board/human-review/0024-two-cards-are-over-the-line-budget.md`, the new `## Links` entry states that `0026`'s missing reason "is the single failure the convention check reports, and it is the whole of what criterion #4 is waiting on". The same branch says the opposite twice. Card `0028`, which fixed `0026`, sits in `done/`, and card `0058`'s own log records `board:convention --cards` reporting zero. The line takes a stale sentence out of that card's `## What I need from you` and republishes it as a link reason, so a reader is now told criterion #4 is blocked by a fault that no longer exists. That is a new false statement, not an inherited one.

VERDICT: defect

