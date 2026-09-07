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
- [ ] WHEN `docs/HANDOVER.md` names the open agent-ready cards, THE FILE SHALL name exactly the cards
      that `ls docs/board/todo` and `ls docs/board/in-progress` return on the day it is written.
      proves: none - this project's suite is one node script over the app and cannot read the board;
      the check is listing both folders and reading the two paragraphs against them
<!-- AC:END -->

## Tasks
- [ ] List `docs/board/todo/` and `docs/board/in-progress/` and write down what they hold
- [ ] Correct the status block near the top of `docs/HANDOVER.md`
- [ ] Correct the same claim in "Blockers / open questions"
- [ ] Re-read both paragraphs against the folders before committing

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
