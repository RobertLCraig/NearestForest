# Cards 0004 and 0006 entered `human-review/` without `## What I need from you`

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. Two cards in the lane on 2026-09-07 do not have that section:

- `docs/board/human-review/0004-derive-names-for-unnamed-car-parks.md`
- `docs/board/human-review/0006-explicit-compass-point-in-list.md`

The check is one line: for each file in the lane, does the text `## What I need from you` appear.

What it costs. That section is the whole reason the lane exists, because it is where the ask sits
above the reasoning. Both of these are built cards with every criterion ticked, moved here for a
browser check on a screen, and neither says anywhere near the top what a person is meant to look at
or what a pass would be. `0004` is 147 lines of build log before a reader can work that out.

How it came to be this way. Both were written as ordinary feature cards in `todo/`, built, and then
moved into the lane by the scheduler on 2026-09-07 (commits `a9f3b9e` and `9e7aa6c`). Nothing in the
move adds the section, so a card gains the lane's obligation without gaining the lane's shape. That
is the same cause card `0045` recorded for `0024`, `0030` and `0043`.

## Links

**Relates to**
- `0045` - the same defect on three other cards in the same lane. It was written on 2026-09-07 when
  the lane held eleven cards; `0004` and `0006` arrived later the same day, so its scope named only
  the three it could see, and its first criterion is lane-wide and cannot close until this card does.

## Not this card
Not the three cards `0045` names, which it fixed. Not doing the browser checks either card is
waiting for, and not moving either card out of the lane. Not a check that refuses a card entering the
lane without the section: that lives in `C:\Dev\ProgressBoard`, not in this repository.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN every card in `docs/board/human-review/` is searched for the heading
      `## What I need from you`, THE BOARD SHALL return no card without it. proves: none - this
      project's suite is one node script over the app and cannot read the board; the check is
      `grep -rL "## What I need from you" docs/board/human-review/*.md` returning nothing
- [x] #2 WHEN a reader opens `0004` or `0006`, THE CARD SHALL state the ask, what a pass is and what
      a fail is, within the first three lines under the title. proves: manual - whether an ask is
      legible in three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [x] Read each card and find the check already in it, rather than inventing one
- [x] Write `## What I need from you` under the title of each, with the ask first and Pass / Fail /
      Why it needs you underneath
- [x] Check each card is still inside the 100-line budget after the section is added
- [x] Re-grep the lane and confirm no card is missing the heading

## Plan
Work in the NearestForest repository. Only card files under `docs/board/human-review/` change;
nothing under `app/` or `scripts/` is involved, so `node scripts/selftest.js` cannot see this either
way. Run it anyway to show the change broke nothing.

**The ask is already on both cards; it is just not at the top.** Do not invent a new one.
`0004` needs its derived car park names looked at on a screen: the dim italic styling against the
**dark** theme, where it has the least contrast, and a map label, since `Car park near Bedgebury
Nat...` truncates at 22 characters. `0006` needs the compass letter looked at in the list. Both are
named in `docs/HANDOVER.md` "What's next" item 1, which also says they deploy as one batch with
`0015`, `0016`, `0019` and `0022`, and that a worktree can be served with
`php -S 127.0.0.1:8791 -t app` because Herd only serves `C:\Dev\NearestForest`.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing either.** It gives the field table and a worked example, and it is the thing this card
is enforcing rather than a style preference.

**Watch the line budget.** A whole card fits in 100 lines. `0006` is already 100 and `0004` is 147,
so on both the new section means the section has to be tight; the append-only `## Comments` thread
may not be cut to make room. Card `0045` hit the same wall on `0043` and solved it by shortening its
own new section rather than the card, and recorded that a card already over budget by its build log
cannot be brought back under by this work alone. Say so on the card rather than pretending otherwise.

It worked when grepping `## What I need from you` across `docs/board/human-review/*.md` returns a hit
in every file, and when both cards state the ask, the pass and the fail in the first three lines
under the title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** Raised by card `0045`, whose scope named the three cards missing this section when it
was written. Re-grepping the lane while building it found two more, moved in later the same day. The
build ran after the move, so this is the lane changing under an open card rather than a miscount.

**2026-09-07** RESULT: partial
TESTS: +0 new, all green (227 passed, 0 failed - `node scripts/selftest.js`)
TOUCHED: docs/board/human-review/0004-derive-names-for-unnamed-car-parks.md
TOUCHED: docs/board/human-review/0006-explicit-compass-point-in-list.md
TOUCHED: docs/board/in-progress/0046-cards-0004-and-0006-entered-human-review-without-the-required-section.md
OUT-OF-SCOPE: none

Wrote `## What I need from you` directly under the title of `0004` and `0006`, each with the ask
first as two numbered lines, then Pass, Fail and Why it needs you. Neither criterion here carries a
test name - #1 is `proves: none` and #2 is `proves: manual` - so there was nothing to write
test-first, and the suite was run only to show nothing under `app/` or `scripts/` moved.

**The ask on both cards is not the one this card's `## Plan` predicted, and I took the card's own.**
The Plan says `0004` wants a browser look at its derived names and `0006` wants the compass letter
looked at, both from HANDOVER "What's next" item 1. Each card's own last comment, dated 2026-09-07,
carries a second and more pressing ask: a reviewer disproved a ticked criterion, a reviewer may not
untick a box, so both cards came back with every criterion ticked and the loop promoted them again
on the boxes. That is the ask that has already cost a wasted cycle, so on both cards it is ask 1 and
the browser look is ask 2. Both were already on the card; neither was invented.

**#2 is ticked, #1 is not.** On both cards the ask is the first thing under the title and Pass and
Fail follow immediately, so #2 is met as far as anything here can judge; whether it reads as legible
is still Rob's call, which is what `proves: manual` says. #1 is lane-wide and cannot close from this
card: `grep -rL "## What I need from you" docs/board/human-review/*.md` still names
`0008-offline-map-view.md`. That is card `0047`, already open in `todo/`, so no new card was raised
for it. #1 closes when `0047` is built and not before.

**Both cards are now over the 100-line budget and this card cannot bring them back under.**
`0004` went 147 to 181 lines and `0006` went 100 to 130. The overage on `0004` is its own build log
and two full review verdicts; on `0006` it is one review verdict. Neither may be cut here: the
`## Comments` thread is append-only, and the review text under `## Direction` is the evidence the
new section's ask 1 points at. The new sections are 34 and 30 lines, which is as tight as the ask,
Pass, Fail and Why it needs you fit. Card `0045` recorded the same wall on `0043`.

**2026-09-07** RESULT: partial
TESTS: +0 new, all green (227 passed, 0 failed - `node scripts/selftest.js`)
TOUCHED: docs/board/todo/0048-card-0011-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/in-progress/0046-cards-0004-and-0006-entered-human-review-without-the-required-section.md
OUT-OF-SCOPE: 0048

Second run. **This card's own scope was already complete and I changed neither `0004` nor `0006`.**
Both still carry `## What I need from you` directly under the title, with the ask first, then Pass,
Fail and Why it needs you, so #2 stays ticked on the evidence the first run left.

**#1 is still open, and the reason has changed.** Re-grepping the lane gives
`grep -rL "## What I need from you" docs/board/human-review/*.md` naming two files, not one:
`0008-offline-map-view.md`, which is card `0047`, already open in `todo/`; and
`0011-security-response-headers.md`, which is new to the lane since the first run and had no card.
`0011` is raised as card `0048`, the next free number in any lane. #1 is lane-wide and cannot close
until `0047` and `0048` are both built.

**No test was written, and there is nothing here a test could hold.** #1 is `proves: none` and #2 is
`proves: manual`; this project's suite is `node scripts/selftest.js`, one node script over `app/`
and `scripts/`, and it cannot read `docs/board/`. The suite was run only to show that nothing under
`app/` or `scripts/` moved. Adding a board-shape check to that script would be a new capability
nobody asked this card for, and the card's own `## Not this card` says the enforcement belongs in
`C:\Dev\ProgressBoard`.

**The lane has now grown under this fault four times in two days** - `0045` named three cards,
`0046` two more, `0047` one, `0048` one - and every one arrived by a scheduler move that adds the
lane's obligation without adding the lane's shape. Each card fixes the cards it can see and #1
reopens behind it. That pattern is recorded on `0048`; the repository holds no way to fix it here.

**2026-09-07** RESULT: partial
TESTS: +0 new, all green (227 passed, 0 failed - `node scripts/selftest.js`)
TOUCHED: docs/board/todo/0049-card-0012-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/in-progress/0046-cards-0004-and-0006-entered-human-review-without-the-required-section.md
OUT-OF-SCOPE: 0049

Third run. **This card's own scope is complete and I changed neither `0004` nor `0006`.** Both still
carry `## What I need from you` directly under the title, with the ask first, then Pass, Fail and Why
it needs you, so #2 stays ticked on the evidence the first run left.

**#1 is still open, and the lane has grown again.**
`grep -rL "## What I need from you" docs/board/human-review/*.md` now names three files, not two:
`0008-offline-map-view.md`, which is card `0047`, open in `todo/`; `0011-security-response-headers.md`,
which is card `0048`, open in `todo/`; and `0012-close-the-open-tile-proxy.md`, which is new to the
lane since the second run and had no card. `0012` is raised as card `0049`, the next free number in
any lane. #1 is lane-wide and cannot close until `0047`, `0048` and `0049` are all built.

`0012` is the same shape as `0011`: built, deployed, phone-verified, all five criteria ticked, and a
`breakage: defect` verdict at the bottom of `## Direction` that the builder could not act on, because
a reviewer may not untick a criterion. Its ask - untick what the reviewer disproved, or say why the
finding is wrong - is the last line of the file rather than the first.

**No test was written, and there is nothing here a test could hold.** #1 is `proves: none` and #2 is
`proves: manual`; this project's suite is `node scripts/selftest.js`, one node script over `app/` and
`scripts/`, and it cannot read `docs/board/`. There is no PHP suite in this repository - no `vendor/`,
no Pest, no Pint - so the requested `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist
here. The node suite was run instead, and only to show that nothing under `app/` or `scripts/` moved.

**Five raisings in two days is the finding.** `0045` named three cards, `0046` two, `0047` one,
`0048` one, `0049` one. Every one arrived by a scheduler move that adds the lane's obligation without
adding the lane's shape, and every one of these cards fixes what it can see while #1 reopens behind
it. The fix belongs at the move, in `C:\Dev\ProgressBoard`, which this card's own `## Not this card`
puts outside this repository.
