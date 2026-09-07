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
- [ ] #2 WHEN a reader opens `0004` or `0006`, THE CARD SHALL state the ask, what a pass is and what
      a fail is, within the first three lines under the title. proves: manual - whether an ask is
      legible in three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [ ] Read each card and find the check already in it, rather than inventing one
- [ ] Write `## What I need from you` under the title of each, with the ask first and Pass / Fail /
      Why it needs you underneath
- [ ] Check each card is still inside the 100-line budget after the section is added
- [ ] Re-grep the lane and confirm no card is missing the heading

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
