# Card 0012 entered `human-review/` without `## What I need from you`

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One more card in the lane does not have that section:

- `docs/board/human-review/0012-close-the-open-tile-proxy.md`

The check is one line: for each file in the lane, does the text `## What I need from you` appear.

What it costs. `0012` is 137 lines. All five of its criteria are ticked, two of its three review
verdicts read `sound`, and the ask is the single paragraph at the very bottom of the file. A reader
who opens it meets a built, deployed, phone-verified security card and has to read past three review
verdicts to reach the `defect` one and learn that the card needs a person to untick something. The
top of the card says the opposite of the ask, so a reader who stops early reads it backwards.

How it came to be this way. `0012` was built, deployed, sent to `ai-review/`, returned, and then
moved into the lane by the scheduler on 2026-09-07, after cards `0045`, `0046`, `0047` and `0048` had
each counted the lane. Nothing in the move adds the section, so a card gains the lane's obligation
without gaining the lane's shape. That is the same cause `0045` recorded for `0024`, `0030` and
`0043`, `0046` for `0004` and `0006`, `0047` for `0008`, and `0048` for `0011`. **This is the fifth
time the same fault has been raised in two days**, which says the fix belongs at the move, in
`C:\Dev\ProgressBoard`, and not in this repository.

## Links

**Relates to**
- `0045` - the same defect on `0024`, `0030` and `0043`, which it fixed. Its first criterion is
  lane-wide and cannot close until this card, `0046`, `0047` and `0048` do.
- `0046` - the same defect on `0004` and `0006`, which it fixed. Its first criterion is lane-wide and
  is still open for the same reason, and this card was raised by its third run.
- `0047` - the same defect on `0008`, still in `todo/`.
- `0048` - the same defect on `0011`, still in `todo/`. Kept separate because one card per finding,
  and `0048` was written before `0012` reached the lane.

## Not this card
Not the cards `0045`, `0046`, `0047` and `0048` name. Not acting on the reviewer's `breakage` finding
in `0012`, not unticking any of its criteria and not moving it out of the lane: that is the very call
the section will be asking Rob for. Not changing `app/api/tiles.php` or `app/map.js`, which is what
that finding asks for and is `0012`'s own work, not this card's. Not a check that refuses a card
entering the lane without the section: that lives in `C:\Dev\ProgressBoard`, not in this repository.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0012-close-the-open-tile-proxy.md` is searched for the heading
      `## What I need from you`, THE CARD SHALL return a hit directly under its title. proves: none -
      this project's suite is one node script over the app and cannot read the board; the check is
      `grep -rL "## What I need from you" docs/board/human-review/*.md` not naming `0012`
- [x] #2 WHEN a reader opens `0012`, THE CARD SHALL state the ask, what a pass is and what a fail is,
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
Work in the NearestForest repository. Only `docs/board/human-review/0012-close-the-open-tile-proxy.md`
changes; nothing under `app/` or `scripts/` is involved, so `node scripts/selftest.js` cannot see
this either way. Run it anyway to show the change broke nothing.

**The ask is already on the card; it is at the bottom.** Do not invent a new one. Its last comment
entry says the reviewer returned it, that a reviewer may not untick a criterion, and that every
unattended session since has found nothing open to do and promoted it again on the ticked boxes. So
the ask is: untick what the reviewer disproved and send it back to `todo/`, or say on the thread why
the finding is wrong. The finding itself is the `breakage` verdict at the end of `## Direction`, and
it names two things: the daily cap counts per `REMOTE_ADDR` while the card's own sizing argument
("a real user is nowhere near it") is per user, and UK mobile carriers put many subscribers behind
one address; and a 403 or 429 leaves the map permanently plain until reload, because `getTile()` in
`app/map.js` stores the failure and nothing retries or tells the user. Note that the reviewer graded
`acceptance: sound` and `scope: sound`, so which criterion to untick, if any, is part of what a
person has to decide.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example, and it is the thing this card is
enforcing rather than a style preference.

**Watch the line budget.** A whole card fits in 100 lines. `0012` is already 137, all of it build
detail and review verdicts, and the append-only `## Comments` and `## Direction` threads may not be
cut to make room. So this card cannot bring it under budget; keep the new section tight and say so on
the card, as `0045` did for `0043` and `0046` did for `0004`.

It worked when grepping `## What I need from you` across `docs/board/human-review/*.md` returns a hit
in `0012`, and when the card states the ask, the pass and the fail in the first three lines under the
title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** Raised by card `0046` on its third run. `0045` named three cards, `0046` two more,
`0047` named `0008`, `0048` named `0011`, and `0012` arrived after `0048` was written. The lane keeps
changing under an open card, which is the finding rather than a miscount.

**2026-09-07** RESULT: done
TESTS: +0 new, all green (227 passed, 0 failed)
TOUCHED: docs/board/human-review/0012-close-the-open-tile-proxy.md
TOUCHED: docs/board/todo/0052-card-0015-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/in-progress/0049-card-0012-entered-human-review-without-the-required-section.md
OUT-OF-SCOPE: 0052

**No test was written, and neither criterion asked for one.** #1 says `proves: none` and #2 says
`proves: manual`, so the test-first rule does not apply to either. The harness could not express #1
in any case: this project's suite is `node scripts/selftest.js` over `app/` and `scripts/`, and it
cannot read `docs/board/`. `node scripts/selftest.js` was run anyway to show the change broke
nothing: 227 passed, 0 failed. There is no PHP suite here, so `.\vendor\bin\pest.bat` and
`.\vendor\bin\pint.bat` do not exist and were not run.

Wrote `## What I need from you` directly under `0012`'s title, using the ask already at the bottom of
the card rather than a new one: untick what the reviewer's `breakage` verdict disproves and send the
card to `todo/`, or say in the thread why the finding is wrong. Named the two parts of that finding
and the criteria each touches (#3 for the per-address cap, #2 and #5 for the silently plain map), and
put the `defect`-card fields `What's wrong` and `Cause` in, per the README's field table.

**The card is over budget and this card could not fix it.** `0012` was 137 lines and is now 173
against a budget of 100. `## Direction` and `## Comments` are append-only and hold most of it, so
there is nothing this card was allowed to cut. Said so on the card itself, as `0045` did for `0043`.

**#2 is a reader's judgement and I ticked it as the builder.** The first three lines under the title
give the ask and both of its branches. Whether that reads as legible is Rob's call, not mine; `0046`
ticked the same criterion the same way, which is the precedent I followed.

Re-grepped the lane afterwards. `0012` no longer appears. Three cards still miss the heading:
`0013`, `0014` and `0015`. `0051` in `todo/` already carries `0013` and `0014` (and `0012`), but no
open card carried `0015`, so I raised `0052` for it. I did not touch `0013`, `0014`, `0015`, `0051`,
or anything under `app/` or `scripts/`.

### 2026-09-08 review (v20260908152236-a0ed)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Criterion #1 ÔÇö traceable. `docs/board/human-review/0012-close-the-open-tile-proxy.md` has `## What I need from you` as the first heading, directly under the title `# Close the open tile proxy`. `grep -rL "## What I need from you" docs/board/human-review/*.md` does not name `0012`. Hit.

Criterion #2 ÔÇö traceable. The three lines under the title, in the `## What I need from you` block of the same file, say the ask ("One decision... only you can untick a box"), the pass ("untick the criteria the finding disproves and send the card back to `todo/`") and the fail ("say in the thread below that the finding is wrong and the card closes as it stands"). Both branches are inside the three lines, not below them. Legible without scrolling.

I tried to break #2 by counting from the title rather than from the heading: even then the ask still lands inside the first block a reader meets. The `What's wrong` and `Cause` fields sit after the `---`, so they do not push the ask down.

Nothing under `app/` or `scripts/` is claimed by either criterion, so the wider diff is out of this lens.

VERDICT: sound

**scope: sound**

Reviewed only the card's own commit (`5151cd4`), not the branch-wide diff.

**Touched files, all board:** `docs/board/human-review/0012-close-the-open-tile-proxy.md` (the `## What I need from you` section under the title), `docs/board/in-progress/0049-...` (its own log), and a new `docs/board/todo/0052-...`. Nothing under `app/` or `scripts/`, so the `## Not this card` fence on `app/api/tiles.php` and `app/map.js` holds. The section names `rateLimit()` in `app/api/tiles.php` and `getTile()` in `app/map.js` only as description; it does not act on them, does not move `0012`, and does not untick anything ÔÇö `## Acceptance` in `0012` is unchanged in that commit.

**The one growth:** raising `0052` for `0015` was not asked for. Task 4 asked only to "re-grep the lane and report". It is one file, it was declared `OUT-OF-SCOPE: 0052` in the entry on `0049`, and it follows the one-card-per-finding practice the same lane already uses for `0045`ÔÇô`0048`. Not a breach.

**Nothing half done:** the re-grep report was accurate at that commit ÔÇö `0013`, `0014`, `0015` were the exact three still missing the heading, and the over-budget note (173 vs 100) is on `0012` as the task required.

VERDICT: sound

**breakage: sound**

Checked the card and the lane.

- `docs/board/human-review/0012-close-the-open-tile-proxy.md` now carries `## What I need from you` directly under its title. The ask, Pass and Fail are all there.
- The section points at criteria `#2`, `#3`, `#5`. I read the `<!-- AC:BEGIN -->` block: #3 is the per-address cap, #2 and #5 are the map drawing tiles. The mapping is right, so no false claim.
- It names `rateLimit()` in `app/api/tiles.php` and `getTile()` in `app/map.js`. Both exist and were not changed by this card.
- "173 lines" matches the file.
- The comment's lane report (`0013`, `0014`, `0015` still missing) looks wrong today: 13 files in the lane lack the heading. But `git log` shows `0019`, `0023`, `0026`, `0028`, `0031` and the rest only entered the lane on 2026-09-08, after that 2026-09-07 entry. The report was true when written, and the card said the lane keeps moving under it. Not breakage by this change.
- Nothing under `app/` or `scripts/` depends on this file, so no caller went stale.

I tried to break it and could not.

VERDICT: sound

