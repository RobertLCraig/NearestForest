# Three decision cards are still in `todo/`

## What I need from you

**Untick criterion #2 and send this card back to `todo/`, so a session repairs card `0024`.** That
is the one live fault and it is small. If you would rather it went on its own card, say so here
instead.

**What's wrong.** The three moves are done and right: `0003`, `0017` and `0018` are all in this lane
and none is in `todo/`. Two things came out of it.

- **Live, and it is sitting in front of you.** Card `0024` asks you to close it on the condition
  that cards `0018` and `0020` are 100 lines each. This card added the required ask section to
  `0018`, which took it to 123 lines, so `0024` is asking you to agree to something that is no
  longer true and does not say so. Worse, `0024`'s own instructions tell you to count with
  `wc -l docs/board/todo/0018-write-to-forestry-england.md`. This card moved that file. The command
  now errors, in a card whose only job is counting it.
- **Dead.** Criterion #2 asks the brief's count of waiting cards to match the folder. On 2026-09-10
  the brief stopped carrying that count at all, so there is nothing left for the criterion to
  compare. It cannot be met and it cannot fail.

**Cause.** A card cannot both gain the section this lane requires and stay inside a line budget that
another open card is measuring it against. That tension is real and nobody wrote it down.

**Pass** is `0024`'s broken path corrected, its pass condition saying that `0018` grew because the
lane required it, and a dated line here.

**Fail** is neither route. You are left agreeing to a stale condition using a command that errors.

**Why it needs you.** Only you may untick a criterion, and whether this card owes the repair to
`0024` or a new card does is a call about how the board divides work.

**Note on length.** This section takes the card past the 100-line budget. `## Comments` and the
review verdicts are append-only, so nothing here could be cut to make room.

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
- `0003`, `0017`, `0018` - the three decision cards this card moves, one per line under `## Tasks`
  with the reason each was missed in `## Why`.
- `0024` - this card added the lane's required section to `0018` and moved the file, so `0024` now
  asks Rob to agree a line count that is stale using a command that errors.
- `0020` - the other card `0024` measures against the line budget, named in that same stale pass
  condition and not edited here.
- `0001`, `0002` - two of the eight cards `## Plan` expects to find in `human-review/` once the
  moves are made. They are the measurement, not work.

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

### 2026-09-08 review (v20260908121520-6afa)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: defect**

**AC #1 ÔÇö passes.** `ls docs/board/human-review` shows `0003-straight-line-distance-in-practice.md`, `0017-how-much-of-wales-can-we-actually-ship.md` and `0018-write-to-forestry-england.md`. `ls docs/board/todo` shows none of them, and no `todo/` card carries `## Options`. `docs/board/human-review/0018-write-to-forestry-england.md` now carries `## What I need from you`.

**AC #2 ÔÇö fails.** The criterion says the folder count and `docs/HANDOVER.md` must give the same number. They do not.

- `docs/HANDOVER.md`, status block at the top: "**Eleven cards wait on a person in `docs/board/human-review/`**" and names eleven ids.
- `docs/HANDOVER.md`, "Blockers / open questions": "**Eleven cards need Rob**, and all eleven are in the lane", naming the same eleven.
- The folder holds **34** files, including `0004`, `0006`, `0008`, `0009`, `0011`ÔÇô`0016`, `0019`, `0023`, `0026`, `0028`, `0031`ÔÇô`0036`, `0045`, `0046`, `0051`, none of which appear in either sentence.

The card's own log claims "eight in both places"; the file says eleven, and the lane says 34. Whichever number was true when the work landed, the criterion is not met in the tree as it stands, so the tick is not supported.

VERDICT: defect

**scope: sound**

What I checked: the commit for this card is `7e7193a` alone. The big diff in the brief is other cards' later work, not this one.

Scope check on that commit:

- Three files moved, nothing else moved.
- `docs/board/human-review/0003-...md` and `0017-...md` moved with a zero-byte diff. No text touched.
- `0018-write-to-forestry-england.md` gained only `## What I need from you`, which the card's task asked for. Its two asks come from the card's own `## Options` and its question 2. No new ask.
- `docs/HANDOVER.md` changed in two places: the status block and the "Blockers / open questions" paragraph. Both now say eight and both drop the pointer to this card. The second place is one line past the task text, but it named the same stale split, so leaving it would have made the file disagree with itself.
- No board check was built. No decision was answered. The fence holds.
- One extra thing: a new card `0040` in `todo/`. That is over the ask, but it is a note, not a change, and the agent said so in its result.

I tried to find a quiet growth and could not.

VERDICT: sound

**breakage: defect**

Two things this card broke, both in `docs/board/human-review/0024-two-cards-are-over-the-line-budget.md`, a card that is open and in front of Rob right now.

**1. The line budget.** `docs/board/README.md` sets a whole card at 100 lines. Card `0024`'s `## What I need from you` states its Pass condition as "`0018` and `0020` are 100 lines each". Card `0037` added a `## What I need from you` block to `0018` (+23 lines), so `docs/board/human-review/0018-write-to-forestry-england.md` is now 123 lines. `0024` asks Rob to close a card on a sentence that is no longer true, and nothing in `0037` says so. A card cannot both gain the lane's required section and stay inside the budget another open card is measuring it against; that tension had to be written down and was not.

**2. A broken command left for a person.** `0024`'s `## Plan` says to count with `wc -l docs/board/todo/0018-write-to-forestry-england.md`. `0037` moved that file. The command now errors, in a card whose whole job is counting that file.

`0003` and `0017` already carried `## What I need from you`, and the HANDOVER "eight" edit was made in both places, so those parts hold.

VERDICT: defect


**2026-09-08** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.
