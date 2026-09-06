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
- [ ] #1 WHEN a card carries `## Options` and is not yet answered, THE BOARD SHALL hold that card in
      `docs/board/human-review/`. proves: none - a card's lane is a folder and this project's suite
      is one node script over the app; the check is `ls docs/board/human-review` showing `0003`,
      `0017` and `0018` there and `ls docs/board/todo` showing none of them
- [ ] #2 WHEN a reader counts the cards waiting on a person, THE BOARD SHALL give the same number
      from `ls docs/board/human-review` as `docs/HANDOVER.md` states. proves: none - same reason;
      the check is the file count against the sentence in "Blockers / open questions"
<!-- AC:END -->

## Tasks
- [ ] `git mv docs/board/todo/0003-straight-line-distance-in-practice.md docs/board/human-review/`
- [ ] `git mv docs/board/todo/0017-how-much-of-wales-can-we-actually-ship.md docs/board/human-review/`
- [ ] `git mv docs/board/todo/0018-write-to-forestry-england.md docs/board/human-review/`
- [ ] Check each of the three has `## What I need from you` directly under its title, which
      `docs/board/README.md` calls the one section a card in that lane must have. Add it where it is
      missing, from what the card already says; do not invent an ask.
- [ ] Replace the paragraph in `docs/HANDOVER.md` "Blockers / open questions" that names this split
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
