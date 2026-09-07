# Three cards in `human-review/` have no `## What I need from you`

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in that lane without a question is a defect in the card
rather than a task for the reader. Three of the eleven cards in the lane on 2026-09-07 do not have
that section at all:

- `docs/board/human-review/0024-two-cards-are-over-the-line-budget.md`
- `docs/board/human-review/0030-the-fetch-date-test-compares-a-utc-date-to-a-local-one.md`
- `docs/board/human-review/0043-add-accounts-and-personal-location-tracking.md`

The check is one line: for each file in the lane, does the text `## What I need from you` appear.

What it costs. That section is the whole reason the lane exists, because it is where the ask sits
above the reasoning. Without it a reader opening one of these three has to work out what is being
asked by reading a build card end to end, and on `0043` that is 78 lines of acceptance criteria and
plan with no question anywhere in it. `docs/HANDOVER.md` already tells Rob that ten of these eleven
fit in one conversation, and three of them cannot be answered in one sitting as written.

How it came to be this way. All three were written as ordinary feature cards in `todo/` and were
moved into the lane later by a session rather than authored for it: `0024` and `0030` because their
last criterion needs a person at a screen, and `0043` because all seven of its criteria are
`proves: manual`. Nothing in the move adds the section, so a card gains the lane's obligation without
gaining the lane's shape.

## Links

**Relates to**
- `0042` - found this while renumbering `0022` to `0043`, which put that card's contents in front of
  the session. `0042`'s scope was the id collision, so this was left rather than fixed in passing.

## Not this card
Not answering any of the three questions, and not moving any card out of the lane. `0024` is asking
to be closed at three of four criteria and `0030` wants the suite watched inside a one-hour window;
both of those calls are Rob's and stay open. Not a check that refuses a card entering the lane
without the section: that lives in `C:\Dev\ProgressBoard`, not in this repository.

## Acceptance
<!-- AC:BEGIN -->
- [ ] WHEN every card in `docs/board/human-review/` is searched for the heading
      `## What I need from you`, THE BOARD SHALL return no card without it. proves: none - this
      project's suite is one node script over the app and cannot read the board; the check is
      grepping the heading across `docs/board/human-review/*.md`
- [ ] WHEN a reader opens any of `0024`, `0030` or `0043`, THE CARD SHALL state the ask, what a pass
      is and what a fail is, within the first three lines under the title. proves: manual - whether
      an ask is legible in three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [ ] Read each of the three cards and find the question already in it, rather than inventing one
- [ ] Write `## What I need from you` under the title of each, with the ask first and Pass / Fail /
      Why it needs you underneath
- [ ] Check each card is still inside the 100-line budget after the section is added
- [ ] Re-grep the lane and confirm no card is missing the heading

## Plan
Work in the NearestForest repository. Only card files under `docs/board/human-review/` change;
nothing under `app/` or `scripts/` is involved, so `node scripts/selftest.js` cannot see this either
way. Run it anyway to show the change broke nothing.

**The ask is already on all three cards; it is just not at the top.** Do not invent a new question.
`0024`'s last four comment entries all say the same thing: it is built to three of four and asks to
be closed there, and the criterion it cannot close depends on card `0028`, which is now built.
`0030`'s remaining check is the suite seen passing between 00:00 and 01:00 local under BST, and its
own thread records that a `TZ` override reproduced the divergence at 05:03. `0043` needs a person to
drive the choice and payment of an authentication service, because its own `## Plan` forbids creating
one without them. Lift each of those into the section and say what a pass and a fail look like.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing any of the three.** It gives the field table and a worked example, and it is the thing
this card is enforcing rather than a style preference.

**Watch the line budget.** A whole card fits in 100 lines. `0043` is already 78 and `0024` is on the
board because it is over the budget, so on that one the new section may mean cutting prose that the
answer does not depend on. Adding a section that pushes a card further over is the one way to fail
this card while passing its first criterion.

It worked when grepping `## What I need from you` across `docs/board/human-review/*.md` returns a hit
in every file, and when each of the three states its ask, its pass and its fail in the first three
lines under the title.

## Comments
**2026-09-07** Raised by card `0042` while it renumbered the duplicate `0022` to `0043`. Reading that
card end to end is what surfaced the gap, and grepping the whole lane found two more. `0042`'s scope
was the id collision, so this was recorded rather than fixed in passing.

**2026-09-07**
RESULT: partial
TESTS: +0 new, all green. Both criteria are `proves: none` and `proves: manual`, so neither gets a
test and the write-it-failing-first rule does not apply to either. `node scripts/selftest.js` reports
**227 passed, 0 failed**, unchanged, which is what a docs-only change should do. There is no
`vendor\bin\pest.bat`, no `pint.bat` and no `composer.json` in this project: it is plain HTML, CSS, JS
and Python with no build step, per `CLAUDE.md`.
TOUCHED: docs/board/human-review/0024-two-cards-are-over-the-line-budget.md
TOUCHED: docs/board/human-review/0030-the-fetch-date-test-compares-a-utc-date-to-a-local-one.md
TOUCHED: docs/board/human-review/0043-add-accounts-and-personal-location-tracking.md
TOUCHED: docs/board/todo/0046-cards-0004-and-0006-entered-human-review-without-the-required-section.md (new)
TOUCHED: docs/board/in-progress/0045-three-human-review-cards-have-no-what-i-need-from-you-section.md
OUT-OF-SCOPE: 0046

All three cards named in `## Why` now carry `## What I need from you` directly under the title, and
in every case the ask was lifted out of the card rather than invented, as `## Plan` required:

- **`0024`** asks the one thing its last four comment entries all ask: close it at three of four, or
  send it back because `0028` is now built in `ai-review/` and its `#4` may close on its own.
- **`0030`** asks for the suite run once between 00:00 and 01:00, and offers the second route its own
  thread already offered - accept the `TZ` reproduction instead. Its Pass names `0 failed` rather
  than a test count, because the count has moved from 222 to 225 to 227 as other cards added tests.
- **`0043`** asks whether accounts are wanted at all, and if so which sign-in service and who pays.

**The line budget bit, and it was the interesting part.** `0043` went from 77 to 103 lines, which is
the exact failure `## Plan` warned about: passing criterion 1 while breaking the rule underneath it.
I shortened my own new section rather than the card, and it is now **97**. `0030` is 169 and `0024`
is 322, both far over 100, and both were already over before I touched them purely from append-only
`## Comments` build logs that this board forbids editing. Neither can be brought under budget by this
card, and `0024` says so about itself in its own last three entries. I did not cut card prose to make
room anywhere.

**Criterion 1 is not met and could not be met inside this card's scope.** The grep over the whole
lane still returns two cards:

    docs/board/human-review/0004-derive-names-for-unnamed-car-parks.md
    docs/board/human-review/0006-explicit-compass-point-in-list.md

Both were moved into the lane on 2026-09-07, **after this card was written** - commits `a9f3b9e` and
`9e7aa6c`, both built with every criterion ticked and moved for a browser check. So the "eleven cards
in the lane" this card counted is now thirteen, and criterion 1 is worded lane-wide rather than about
the three files `## Why` names. Fixing two cards this card does not name is scope nobody reviewed, so
it is card **`0046`** in `todo/` rather than a fix in passing. Build `0046` and criterion 1 closes
here with no further work.

**Criterion 2 is left open on purpose, because it is `proves: manual`.** What I can state is
structural and I checked it on all three: the heading is the first thing under the title, the ask is
imperative and inside three lines, and Pass, Fail and "Why it needs you" all follow. Whether the ask
actually reads as legible to somebody who is not holding this repository in their head is a reader's
judgement, and the criterion says so. One person opening the three cards closes it.

**Assumed:** that `## What I need from you` goes above `## Why` on all three, per
`docs/board/README.md` "directly under the title". Card `0025` asks exactly this question - ask first
or problem first - and is still unanswered in this same lane. If the answer comes back the other way,
all three sections move down one heading and nothing else changes.

**Could not settle from the repository:** nothing that blocked the work. **`docs/HANDOVER.md` was
deliberately not touched**, although raising `0046` changes its open-card count and its "eleven cards
wait on a person" line is now thirteen. Card `0044` is open in `in-progress/` to correct that very
paragraph, so editing it here would be two sessions writing the same lines. No browser check applies;
nothing under `app/` changed.

**2026-09-07**
RESULT: partial
TESTS: +0 new, all green. Criterion 1 is `proves: none` and criterion 2 is `proves: manual`, so
neither gets a test and the write-it-failing-first rule does not apply. `node scripts/selftest.js`
reports **227 passed, 0 failed**, unchanged, which is what a board-only change should do. There is
still no `vendor\bin\pest.bat`, no `pint.bat` and no `composer.json` in this project.
TOUCHED: docs/board/todo/0047-card-0008-entered-human-review-without-the-required-section.md (new)
TOUCHED: docs/board/in-progress/0045-three-human-review-cards-have-no-what-i-need-from-you-section.md
OUT-OF-SCOPE: 0047

Second run. **The work this card names was already done by the first run** and I changed none of it:
`0024`, `0030` and `0043` each still carry `## What I need from you` directly under the title, with
the ask, a Pass and a Fail inside the first three lines. I re-read all three to check that rather
than trusting the previous entry.

**Criterion 1 still cannot close, and the lane has moved again.** Grepping the heading across
`docs/board/human-review/*.md` now returns three cards without it, not two:

    docs/board/human-review/0004-derive-names-for-unnamed-car-parks.md
    docs/board/human-review/0006-explicit-compass-point-in-list.md
    docs/board/human-review/0008-offline-map-view.md

`0004` and `0006` are card `0046`, raised by the first run. `0008` is new: it went `ai-review/` ->
`todo/` -> `human-review/` in commits `d938da5` and `54ae3c6`, **after `0046` was written**. So it is
covered by no card, and `0046` is append-only in the sense that matters here - it is another card and
I may not edit it. It is card **`0047`** in `todo/`. The lane is fourteen now, not eleven and not
thirteen.

**The same fault has now been raised three times in one day, and that is the real finding.** Every
one of these six cards was authored for `todo/`, built, and then moved into `human-review/` by the
scheduler. The move never adds the section, so the lane will keep producing this card for as long as
cards keep being promoted into it. I wrote that on `0047` rather than acting on it, because the fix
sits at the move in `C:\Dev\ProgressBoard` and this card's own `## Not this card` puts that outside
the repository.

**Criterion 2 stays open on purpose**, unchanged from the first run: it is `proves: manual`, and
whether the three asks read as legible to somebody not holding this repository in their head is a
reader's judgement. One person opening `0024`, `0030` and `0043` closes it.

**Could not settle from the repository:** nothing that blocked the work. `docs/HANDOVER.md` was again
not touched, for the reason the first entry gives - card `0044` owns that paragraph and is now in
`ai-review/` - but note that its counts are further out of date: it says eleven cards wait on a
person and the folder holds fourteen. No browser check applies; nothing under `app/` changed.

**2026-09-07** The loop moved this card from in-progress/ to human-review/. 2 takes in a row ended with it still in in-progress/, and the last one said: `made no progress: 2 of 2 still open, exactly as this take found it`. What this card is waiting for is not another session. bin/work-card.ps1 counts those takes out of storage/logs/work-card.log, and will start it again as soon as a person has moved it back to todo/.
