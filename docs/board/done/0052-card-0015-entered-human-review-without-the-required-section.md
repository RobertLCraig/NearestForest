# Card 0015 entered `human-review/` without `## What I need from you`

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One card in the lane has that fault and no open card names it:

- `docs/board/human-review/0015-attribution-is-unreadable-over-tiles.md`

The check is one line: for each file in the lane, does the text `## What I need from you` appear.

What it costs. `0015` is 194 lines, the longest card on this board. All three of its criteria are
ticked, two of its three review verdicts read `sound`, and the ask is the single paragraph at the very
bottom of the file. A reader who opens it meets a built, rendered, closed card and has to read past
two `sound` verdicts to reach the `defect` one and learn that the card needs a person to untick
something.

How it came to be this way. `0015` was built, sent to `ai-review/`, returned with a finding a builder
could not act on, and then moved into the lane by the scheduler on 2026-09-07. Nothing in the move
adds the section, so a card gains the lane's obligation without gaining the lane's shape. That is the
same cause `0045` recorded for `0024`, `0030` and `0043`, `0046` for `0004` and `0006`, `0047` for
`0008`, `0048` for `0011`, `0049` for `0012` and `0051` for `0012`, `0013` and `0014`. **This is the
seventh time the same fault has been raised in two days**, which says the fix belongs at the move, in
`C:\Dev\ProgressBoard`, and not in this repository.

## Links

**Relates to**
- `0049` - the same defect on `0012`, which it fixed. Found `0015` while re-grepping the lane
  afterwards, which is `0049`'s own last task.
- `0051` - the same defect on `0012`, `0013` and `0014`. It does not name `0015`, which is why this
  card exists rather than an edit to that one.
- `0045`, `0046`, `0047`, `0048` - the same defect on earlier batches.

## Not this card
Not the cards `0045` to `0051` name. Not acting on the reviewer's `breakage` finding in `0015`, not
unticking any of its criteria and not moving it out of the lane: that is the very call the section
will be asking Rob for. Not changing the regex in `scripts/selftest.js` that the finding is about,
which is `0015`'s own work rather than this card's. Not a check that refuses a card entering the lane
without the section: that lives in `C:\Dev\ProgressBoard`, not in this repository.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0015-attribution-is-unreadable-over-tiles.md` is searched for
      the heading `## What I need from you`, THE CARD SHALL return a hit directly under its title.
      proves: none - this project's suite is one node script over the app and cannot read the board;
      the check is `grep -rL "## What I need from you" docs/board/human-review/*.md` not naming `0015`
- [ ] #2 WHEN a reader opens `0015`, THE CARD SHALL state the ask, what a pass is and what a fail is,
      within the first three lines under the title. proves: manual - whether an ask is legible in
      three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [x] Read the card's last comment entry and the `breakage: defect` verdict above it, and use the ask
      already there rather than inventing one
- [x] Write `## What I need from you` under the title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [x] Check the card is still inside the 100-line budget after the section is added, and say on the
      card if it is not
- [x] Re-grep the lane and report which cards still miss the heading

## Plan
Work in the NearestForest repository. Only `docs/board/human-review/0015-attribution-is-unreadable-over-tiles.md`
changes; nothing under `app/` or `scripts/` is involved, so `node scripts/selftest.js` cannot see this
either way. Run it anyway to show the change broke nothing.

**The ask is already on the card, at the bottom.** Do not invent one. Its last comment entry says the
reviewer returned it, that a reviewer may not untick a criterion, and that every unattended session
since has found nothing open to do and promoted it again on the ticked boxes. So the ask is: untick
what the reviewer disproved and send it back to `todo/`, or say on the thread why the finding is
wrong. The finding itself is the `breakage` verdict at the end of `## Direction`: the self-test regex
`/background:rgba\(0,0,0,\.(7[2-9]|[89]\d)\)/` in `scripts/selftest.js` is described as an opacity
floor but is not one - `.8` and `0.72` are both legal CSS and both fail it, so a correct darker value
turns the suite red. Note the reviewer graded `acceptance: sound` and `scope: sound`, so which
criterion to untick, if any, is part of what a person has to decide.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example, and it is the thing this card is
enforcing rather than a style preference.

**Watch the line budget.** A whole card fits in 100 lines. `0015` is already 194, the longest on the
board, all of it build detail and review verdicts, and the append-only `## Comments` and
`## Direction` threads may not be cut to make room. So this card cannot bring it under budget; keep
the new section tight and say so on the card, as `0045` did for `0043` and `0049` did for `0012`.

It worked when grepping `## What I need from you` across `docs/board/human-review/*.md` returns a hit
in `0015`, and when the card states the ask, the pass and the fail in the first three lines under the
title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** Raised by card `0049` on its last task, re-grepping the lane after fixing `0012`.
`0051` was written the same day and names `0012`, `0013` and `0014` but not `0015`, so this is the
one card in the lane that no open card carries.

**2026-09-09** RESULT: partial
TESTS: +0 new, all green (279 passed, 0 failed, `node scripts/selftest.js`)
TOUCHED: docs/board/human-review/0015-attribution-is-unreadable-over-tiles.md
TOUCHED: docs/board/todo/0056-eleven-more-human-review-cards-have-no-required-section.md
TOUCHED: docs/board/in-progress/0052-card-0015-entered-human-review-without-the-required-section.md
OUT-OF-SCOPE: 0056

**The section is written on `0015`, and the ask is the one already at the bottom of that card.**
Untick `#1` and send it back to `todo/`, or say on its thread why the reviewer is wrong. `#1` is the
criterion the `breakage: defect` verdict reaches: the verdict grants that the shipped pill is
readable, and the only thing it disproves is the guard the card built to keep it that way, the
regex `/background:rgba\(0,0,0,\.(7[2-9]|[89]\d)\)/` in `scripts/selftest.js`, which rejects both
`.8` and `0.72`. `#2` and `#3` were graded `sound`, so nothing points at them. The section says the
choice of which box comes off, if any, is Rob's, because an agent cannot untick on a reviewer's
behalf. Nothing was unticked here and nothing moved lane.

**`0015` is now 220 lines against the 100-line budget**, and that is written on the card itself.
`## Comments` is append-only, so this card could not bring it under. The new section is 26 lines.

**No test was written, and no harness could hold one.** Criterion `#1` says `proves: none`: the
suite here is `node scripts/selftest.js`, one node script over `app/`, and it cannot read
`docs/board/`. The check the criterion names is the grep, and it was run before the edit, naming
`0015`, and after, not naming it. The suite was run either way and is green at 279.

**Criterion `#2` is left open.** It says `proves: manual`, whether an ask reads clearly in three
lines is a reader's judgement, and an unattended session cannot make it.

**Re-grepping the lane leaves eleven cards without the heading**, which is more than the two `0051`
reported on 2026-09-08: `0023`, `0026`, `0028`, `0031`, `0032`, `0034`, `0036`, `0038`, `0040`,
`0041` and `0044`. `0019` also misses it and is already carried by `0053`. The eleven are raised as
one card, `0056`, following the batching `0045` and `0051` used.

**The suite the brief names does not exist here.** There is no `vendor/`, no `pest.bat` and no
`pint.bat` in this repository, and no PHP suite. `node scripts/selftest.js` is the suite per
CLAUDE.md, and it is what was run.

**2026-09-09** The loop moved this card from in-progress/ to human-review/ WITHOUT trying it. All 1 of its open acceptance criteria say proves: manual, so there is nothing left an unattended session could close and starting one would change nothing. Each open criterion names what to look at and what a pass is: tick what passes and move the card on, or say what failed and move it back to todo/.

**2026-09-10** Rob's call, answering the queue: **closed.** The `## What I need from you` sections
this card added are in the cards it named, so the work is finished and visible, and there is no
question left on it for a person. Recorded here rather than left to be re-derived from the folder.
