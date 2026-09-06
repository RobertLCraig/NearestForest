# Two different cards are both numbered `0022`

## Why
Two files on this board carry the id `0022`, and they are unrelated cards:

- `docs/board/ai-review/0022-name-the-forestry-commission-on-the-car-park-credit.md` — one clause of
  footer text, built 2026-09-05 and waiting on the adversarial pass.
- `docs/board/human-review/0022-add-accounts-and-personal-location-tracking.md` — accounts, sign-in,
  and visited/favourite states, unbuilt, seven criteria all `proves: manual`.

They are the only duplicate on the board: grouping every `docs/board/**/0*.md` by its first four
characters on 2026-09-07 returns exactly one group of two.

What it costs. A card id is how every other card, every comment entry and `docs/HANDOVER.md` refer to
work, and this board refers to both of these. HANDOVER's "Current state" says **0022** is built and
ships in the undeployed batch; HANDOVER's "Blockers" says **0022** waits on a person. Both sentences
are true of a different file, and neither reader can tell without opening the folders. A `Relates to`
line naming `0022` cannot be resolved at all.

How it came to be this way. A new card takes the number one past the highest on the board, and the
highest is read from the lane folders. One of the two was written when the other was not visible to
whoever was counting.

## Links

**Relates to**
- `0041` - found this while correcting the `human-review/` card list in `docs/HANDOVER.md`, which is
  where the two ids collide in prose. `0041`'s scope was the counts, so this was left rather than
  fixed in passing.

## Not this card
Not renumbering any card that is not one of these two. Not a check that refuses a duplicate id when a
card is created: that lives in `C:\Dev\ProgressBoard`, not in this repository, and whether it is worth
building is a bigger question than this fault.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN every card file on the board is grouped by its id, THE BOARD SHALL return no id used
      twice. proves: none - a card's id is its filename and this project's suite is one node script
      over the app; the check is grouping `docs/board/**/0*.md` by the first four characters
- [ ] #2 WHEN a card, a comment entry or `docs/HANDOVER.md` names the renumbered card, THE REFERENCE
      SHALL name its new id. proves: none - as #1; the check is grepping the old id across the tree
      and reading each hit against which of the two cards it meant
<!-- AC:END -->

## Tasks
- [ ] Decide which of the two keeps `0022` and which is renumbered
- [ ] Rename the losing file to the next free id and change its own title and internal references
- [ ] Grep `0022` across `docs/` and correct every reference that meant the renumbered card
- [ ] Re-group the board's ids and confirm no duplicate remains

## Plan
Work in the NearestForest repository. Only card files and `docs/HANDOVER.md` change; nothing under
`app/` or `scripts/` is involved, so the suite cannot see this either way.

**Which one keeps the number is the decision to make first, and it is not a coin toss.** The
footer-credits `0022` is built, is named in `docs/HANDOVER.md` "Current state" as part of the batch
that ships together, and is referred to by `0019`, which is the same paragraph of footer text. Its id
is load bearing in more places. The accounts `0022` is unbuilt and referred to by nothing yet, so
renumbering it is the smaller change and the one to reach for unless something says otherwise.

Take the next free id from the whole board, not from one lane, the same way any new card does.

Grep before and after: `0022` appears in prose that means the built card and in prose that means the
unbuilt one, and a blind replace would corrupt the half it did not mean. Read every hit.

It worked when grouping every `docs/board/**/0*.md` by its first four characters returns no group of
two, and when every surviving mention of the old id can be read against exactly one card.

## Comments
**2026-09-07** Raised by card `0041` while it corrected the `human-review/` and `ai-review/` counts in
`docs/HANDOVER.md`. `0041`'s scope was those counts, so this was recorded rather than fixed in
passing. `0041` did write the collision into HANDOVER as a warning in two places, because its own
criterion required naming the eleven cards in `human-review/` and one of them is a `0022`.
