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
