# Cards 0012, 0013 and 0014 entered `human-review/` without `## What I need from you`

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. Three more cards in the lane do not have that section:

- `docs/board/human-review/0012-close-the-open-tile-proxy.md`
- `docs/board/human-review/0013-scheme-allow-list-for-dataset-urls.md`
- `docs/board/human-review/0014-say-what-happens-to-a-location.md`

The check is one line: for each file in the lane, does the text `## What I need from you` appear.

What it costs. All three read as finished work. Every criterion on each is ticked, `## Direction`
ends in a reviewer's `defect` verdict, and the ask is the single paragraph at the very bottom of the
file. A reader who opens one meets a closed security card and has to read past the review verdicts to
learn that a person has to untick something.

How it came to be this way. Each was built, sent to `ai-review/`, returned with a finding a builder
could not act on, and then moved into the lane by the scheduler on 2026-09-07. Nothing in the move
adds the section, so a card gains the lane's obligation without gaining the lane's shape. That is the
same cause `0045` recorded for `0024`, `0030` and `0043`, `0046` for `0004` and `0006`, `0047` for
`0008`, and `0048` for `0011`. **This is the fifth time in two days**, which says the fix belongs at
the move, in `C:\Dev\ProgressBoard`, and not in this repository.

## Links

**Relates to**
- `0048` - the same defect on `0011`, which it fixed. Found these three while re-grepping the lane
  afterwards, which is `0048`'s own last task.
- `0045`, `0046`, `0047` - the same defect on earlier batches. Kept separate because the lane keeps
  changing under an open card, so a card cannot name what arrived after it was written.

## Not this card
Not the cards `0045` to `0048` name. Not acting on any reviewer's finding in `0012`, `0013` or
`0014`, not unticking any criterion and not moving anything out of the lane: that is the very call
each section will be asking Rob for. Not a check that refuses a card entering the lane without the
section: that lives in `C:\Dev\ProgressBoard`, not in this repository.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN each of `0012`, `0013` and `0014` in `docs/board/human-review/` is searched for the
      heading `## What I need from you`, THE CARD SHALL return a hit directly under its title.
      proves: none - this project's suite is one node script over the app and cannot read the board;
      the check is `grep -rL "## What I need from you" docs/board/human-review/*.md` naming none of
      the three
- [ ] #2 WHEN a reader opens any of the three, THE CARD SHALL state the ask, what a pass is and what
      a fail is, within the first three lines under the title. proves: manual - whether an ask is
      legible in three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [ ] For each card, read its last comment entry and the `defect` verdicts above it, and use the ask
      already there rather than inventing one
- [ ] Write `## What I need from you` under each title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [ ] Check each card is still inside the 100-line budget afterwards, and say on it if it is not
- [ ] Re-grep the lane and report which cards still miss the heading

## Plan
Work in the NearestForest repository. Only the three card files change; nothing under `app/` or
`scripts/` is involved, so `node scripts/selftest.js` cannot see this either way. Run it anyway to
show the change broke nothing.

**Each ask is already on its card, at the bottom.** Do not invent one. All three last comment entries
say the same thing: a reviewer returned the card, a reviewer may not untick a criterion, and every
unattended session since has found nothing open and promoted it again on the ticked boxes. So each
ask is: untick what the reviewer disproved and send it back to `todo/`, or say on the thread why the
finding is wrong. The finding itself is the `defect` verdict at the end of each `## Direction`, and it
differs per card - `0012` is an unhandled 429/403 that blanks the map silently, `0013` is an untested
`validate()` in `scripts/parse.py`, `0014` is a self-test pinning one footer phrase out of three. Say
the specific one on the specific card.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing them.** It gives the field table and a worked example.

**Watch the line budget.** A whole card fits in 100 lines. `0012` is 137, `0013` is 98 and `0014` is
100, and the append-only `## Comments` and `## Direction` threads may not be cut to make room. So
`0012` cannot be brought under budget by this card; keep each new section tight and say so on the
card, as `0045` did for `0043` and `0048` did for `0011`.

It worked when grepping `## What I need from you` across `docs/board/human-review/*.md` returns a hit
in all three, and when each states the ask, the pass and the fail in the first three lines under the
title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** Raised by card `0048` on its last task, re-grepping the lane after fixing `0011`.
These three arrived in the lane the same day and after `0048` was written, which is the finding
rather than a miscount.
