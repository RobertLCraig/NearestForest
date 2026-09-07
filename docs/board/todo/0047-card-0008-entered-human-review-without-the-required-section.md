# Card 0008 entered `human-review/` without `## What I need from you`

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One more card in the lane does not have that section:

- `docs/board/human-review/0008-offline-map-view.md`

The check is one line: for each file in the lane, does the text `## What I need from you` appear.

What it costs. `0008` is 122 lines, and the ask is the very last paragraph of the file. A reader
opening it meets a built feature card with all six criteria ticked and has to read to the bottom to
find that a reviewer disproved one of them and that the card needs a person to untick it. The ask is
the opposite of what the top of the card says, so a reader who stops early reads it backwards.

How it came to be this way. `0008` was built, sent to `ai-review/`, returned, and then moved into the
lane by the scheduler on 2026-09-07 (commits `d938da5` and `54ae3c6`), after cards `0045` and `0046`
had each counted the lane. Nothing in the move adds the section, so a card gains the lane's
obligation without gaining the lane's shape. That is the same cause `0045` recorded for `0024`,
`0030` and `0043`, and `0046` for `0004` and `0006`. **This is the third time the same fault has been
raised in one day**, which says the fix belongs at the move, in `C:\Dev\ProgressBoard`, and not in
this repository.

## Links

**Relates to**
- `0045` - the same defect on `0024`, `0030` and `0043`, which it fixed. Its first criterion is
  lane-wide and cannot close until this card and `0046` do.
- `0046` - the same defect on `0004` and `0006`, still in `todo/`. Kept separate because one card per
  finding, and `0046` was written before `0008` reached the lane.

## Not this card
Not the cards `0045` and `0046` name. Not acting on the reviewer's finding in `0008`, not unticking
any of its criteria and not moving it out of the lane: that is the very call the section will be
asking Rob for. Not a check that refuses a card entering the lane without the section: that lives in
`C:\Dev\ProgressBoard`, not in this repository.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN `docs/board/human-review/0008-offline-map-view.md` is searched for the heading
      `## What I need from you`, THE CARD SHALL return a hit directly under its title. proves: none -
      this project's suite is one node script over the app and cannot read the board; the check is
      `grep -rL "## What I need from you" docs/board/human-review/*.md` not naming `0008`
- [ ] #2 WHEN a reader opens `0008`, THE CARD SHALL state the ask, what a pass is and what a fail is,
      within the first three lines under the title. proves: manual - whether an ask is legible in
      three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [ ] Read the card's last comment entry and the review verdict above it, and use the ask already
      there rather than inventing one
- [ ] Write `## What I need from you` under the title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [ ] Check the card is still inside the 100-line budget after the section is added, and say on the
      card if it is not
- [ ] Re-grep the lane and report which cards still miss the heading

## Plan
Work in the NearestForest repository. Only `docs/board/human-review/0008-offline-map-view.md`
changes; nothing under `app/` or `scripts/` is involved, so `node scripts/selftest.js` cannot see
this either way. Run it anyway to show the change broke nothing.

**The ask is already on the card; it is at the bottom.** Do not invent a new one. Its last comment
entry says the reviewer returned it with a defect verdict, that a reviewer may not untick a
criterion, and that every unattended session since has found nothing open to do and promoted it again
on the ticked boxes. So the ask is: untick what the reviewer disproved and send it back to `todo/`,
or say on the thread why the finding is wrong. The finding itself is in the last block of
`## Direction`: `loadBoundary` in `app/map.js` latches its failure, so one failed fetch of
`data/boundary.json` kills the outline, every marker and the own-position dot for the whole page life,
with no retry and no test.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example, and it is the thing this card is
enforcing rather than a style preference.

**Watch the line budget.** A whole card fits in 100 lines. `0008` is already 122, all of it build log
and review verdicts, and the append-only `## Comments` and `## Direction` threads may not be cut to
make room. So this card cannot bring it under budget; keep the new section tight and say so on the
card, as `0045` did for `0043`.

It worked when grepping `## What I need from you` across `docs/board/human-review/*.md` returns a hit
in `0008`, and when the card states the ask, the pass and the fail in the first three lines under the
title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** Raised by card `0045` on its second run. `0045` named three cards, `0046` named two
more that arrived after it was written, and `0008` arrived after `0046` was written. The lane keeps
changing under an open card, which is the finding rather than a miscount.
