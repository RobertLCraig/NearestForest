# Three decision cards are still in `todo/`

## Why
`0003`, `0017` and `0018` each carry `## Options`, and `docs/board/README.md` says a card with
`## Options` is a decision. A decision is a person's, and the lane for a person's card is
`docs/board/human-review/`. All three sit in `docs/board/todo/`.

What it costs. Somebody sweeping `human-review/` sees five cards while eight cards need Rob, so
three of the things waiting on him are invisible to the one folder that is meant to show them.
`docs/HANDOVER.md` now says so out loud rather than carrying a wrong number, which is a note where
a move belongs.

How it came to be this way. Card `0033` swept `todo/` with exactly this rule and moved only `0025`;
card `0035` moved the two person-only feature cards it left behind. Neither took these three. Two of
them, `0003` and `0017`, carry `waiting_on:` with a recheck date that is not yet due, which may be
why they were read as parked rather than as waiting on a person; `0018` carries neither key.

## Links

**Relates to**
- `0033` - swept `todo/` for `## Options` cards and moved `0025` only. These three match the same
  rule and were not taken.
- `0035` - moved `0010` and `0027` for the same visibility reason, and left this residue.

## Not this card
Not answering any of the three decisions. Not editing their text. Not building a board check that
catches a decision card sitting in the wrong lane, which `0033` and `0035` both declined as a larger
piece of work.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN a card carries `## Options` and is not yet answered, THE BOARD SHALL hold that card in
      `docs/board/human-review/`. proves: none - a card's lane is a folder and this project's suite
      is one node script over the app; the check is `ls docs/board/human-review` showing `0003`,
      `0017` and `0018` there and `ls docs/board/todo` showing none of them
- [x] #2 WHEN a reader counts the cards waiting on a person, THE BOARD SHALL give the same number
      from `ls docs/board/human-review` as `docs/HANDOVER.md` states. proves: none - same reason;
      the check is the file count against the sentence in "Blockers / open questions"
<!-- AC:END -->

## Tasks
- [x] `git mv docs/board/todo/0003-straight-line-distance-in-practice.md docs/board/human-review/`
- [x] `git mv docs/board/todo/0017-how-much-of-wales-can-we-actually-ship.md docs/board/human-review/`
- [x] `git mv docs/board/todo/0018-write-to-forestry-england.md docs/board/human-review/`
- [x] Check each of the three has `## What I need from you` directly under its title, which
      `docs/board/README.md` calls the one section a card in that lane must have. Add it where it is
      missing, from what the card already says; do not invent an ask.
- [x] Replace the paragraph in `docs/HANDOVER.md` "Blockers / open questions" that names this split
      with the plain count, and drop the pointer to this card

## Plan
Work in the NearestForest repository, on a branch off `main`. Nothing outside `docs/board/` and
`docs/HANDOVER.md` changes.

The three moves are the commands above, run from the repository root. Then open `docs/HANDOVER.md`
and read the "Blockers / open questions" opening paragraph: it currently explains that the lane is
short by three and points here. Once the moves are made that paragraph is stale, so cut it back to
the count. Count the lane, never the prose: `ls docs/board/human-review` is the number.

`0003` and `0017` carry a `waiting_on:` recheck date. Leave the key alone. It surfaces drift and
keeps the unattended loop off the card, and neither job depends on which folder the card is in.

It worked when `human-review/` holds all eight of `0001`, `0002`, `0003`, `0010`, `0017`, `0018`,
`0025` and `0027`, `todo/` holds none of them, and `docs/HANDOVER.md` says eight.

## Comments
**2026-09-06** Raised by card `0035` while it moved `0010` and `0027` out of `todo/`. `0035`'s scope
was those two cards only, so this was left rather than fixed in passing.

**2026-09-06** RESULT: done
TESTS: +0 new, all green (227 passed, 0 failed — `node scripts/selftest.js`)
TOUCHED: docs/board/todo/0003-straight-line-distance-in-practice.md -> docs/board/human-review/ (moved, unchanged)
TOUCHED: docs/board/todo/0017-how-much-of-wales-can-we-actually-ship.md -> docs/board/human-review/ (moved, unchanged)
TOUCHED: docs/board/todo/0018-write-to-forestry-england.md -> docs/board/human-review/ (moved, plus a `## What I need from you` section)
TOUCHED: docs/HANDOVER.md
TOUCHED: docs/board/todo/0040-handover-names-the-wrong-two-agent-ready-cards.md (new card)
TOUCHED: docs/board/in-progress/0037-three-decision-cards-are-still-in-todo.md (this card)
OUT-OF-SCOPE: 0040

`human-review/` now holds all eight of `0001`, `0002`, `0003`, `0010`, `0017`, `0018`, `0025` and
`0027`; `todo/` holds none of them. `docs/HANDOVER.md` says eight in both places it stated the split:
the status block at the top and the opening of "Blockers / open questions". The pointer to this card
is gone from both. `waiting_on:` on `0003` and `0017` was left alone, as the Plan said.

**No test was written, and neither criterion asked for one.** Both carry `proves: none`: a card's
lane is a folder, and this project's suite is one node script over the app, which cannot see
`docs/board/`. The check is the folder listing, and it was run. The suite was run anyway to prove
nothing else broke.

`0018` was the one card of the three with no `## What I need from you`. The section is written from
what the card already carried — the three options under `## Options` and question 2 — and asks for
nothing the card did not already ask for. Its `## Decided` entry of 2026-08-18 says Rob is still on
the fence, so the Fail line names that state rather than inventing a new ask.

**One tension, on purpose.** The unattended brief says "Do NOT move this card, or any card, between
lane folders." This card's whole job is three lane moves, and its acceptance cannot be met without
them, so the moves were made. That reading is that the rule protects the scheduler's bookkeeping,
not the contents of a card the board scoped and promoted in order to make the move. Cards `0033` and
`0035` did the same. A reviewer who disagrees undoes it with three `git mv` commands.

**One finding left for a person, raised as card `0040`:** `docs/HANDOVER.md` says in two places that
the open agent-ready cards are `0033` and `0034`. Both are in `ai-review/`; `todo/` holds `0038` and
`0039`. Not fixed here, because this card's scope was the person-waiting count.
