# Two different cards are both numbered `0022`

## Why
Two files on this board carry the id `0022`, and they are unrelated cards:

- `docs/board/ai-review/0022-name-the-forestry-commission-on-the-car-park-credit.md` — one clause of
  footer text, built 2026-09-05 and waiting on the adversarial pass.
- `docs/board/human-review/0022-add-accounts-and-personal-location-tracking.md` — accounts, sign-in,
  and visited/favourite states, unbuilt, seven criteria all `proves: manual`. **This is the one this
  card renumbered**, so it is now
  `docs/board/human-review/0043-add-accounts-and-personal-location-tracking.md`. The old path above
  is the fault as found and no longer exists.

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
- [x] #1 WHEN every card file on the board is grouped by its id, THE BOARD SHALL return no id used
      twice. proves: none - a card's id is its filename and this project's suite is one node script
      over the app; the check is grouping `docs/board/**/0*.md` by the first four characters
- [x] #2 WHEN a card, a comment entry or `docs/HANDOVER.md` names the renumbered card, THE REFERENCE
      SHALL name its new id. proves: none - as #1; the check is grepping the old id across the tree
      and reading each hit against which of the two cards it meant
<!-- AC:END -->

## Tasks
- [x] Decide which of the two keeps `0022` and which is renumbered
- [x] Rename the losing file to the next free id and change its own title and internal references
- [x] Grep `0022` across `docs/` and correct every reference that meant the renumbered card
- [x] Re-group the board's ids and confirm no duplicate remains

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

**2026-09-07**
RESULT: done
TESTS: +0 new, all green. Both criteria are `proves: none`, so neither gets a test and the
test-first paragraph does not apply to them. The suite is `node scripts/selftest.js`: **227 passed,
0 failed**, the same count HANDOVER records, which is what a docs-only change should do. There is no
`vendor/` directory in this project, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not
exist and could not run.
TOUCHED: docs/board/human-review/0022-add-accounts-and-personal-location-tracking.md -> docs/board/human-review/0043-add-accounts-and-personal-location-tracking.md (git mv, contents unchanged)
TOUCHED: docs/HANDOVER.md
TOUCHED: docs/board/in-progress/0042-two-different-cards-are-both-numbered-0022.md
TOUCHED: docs/board/todo/0044-handover-says-one-agent-ready-card-is-open-and-names-a-card-that-has-moved.md (new)
TOUCHED: docs/board/todo/0045-three-human-review-cards-have-no-what-i-need-from-you-section.md (new)
OUT-OF-SCOPE: 0044, 0045

**The accounts card was the one renumbered, for the reason `## Plan` gave and not a new one.** The
footer-credits `0022` is built, is named in `docs/HANDOVER.md` "Current state" and "What's next" item
1 as part of the undeployed batch, and is referred to by `0019` and `0023`; that is five live
references. The accounts card carried none: grepping `0022` across the tree found no hit that meant
it outside `docs/HANDOVER.md`, this card and `0041`'s comment thread. So the smaller change is the
accounts card, and it is now `0043`.

**`0043` is the next free id on the whole board, not the next in its lane**, taken the way a new card
takes one: the highest of `docs/board/**/0*.md` was `0042`, this card. The renamed file needed no
internal edit at all — `grep -c 0022` on it returns 0, and its title never carried the number.
Nothing else in the repository referenced its old path.

**Criterion #1 is a folder fact.** Grouping every `docs/board/**/0*.md` by its first four characters
and printing the duplicates returned `0022` before the rename and nothing after it. The two new cards
below take `0044` and `0045`, and the re-run after they were written is still empty.

**Criterion #2, and what I deliberately did not edit.** `docs/HANDOVER.md` had five mentions of
`0022`. Three meant the accounts card and are now `0043`: the status block near the top, the
`human-review/` list in "Blockers", and the card's own bullet at the foot of that section. Each of
the three also lost the warning clause that said which `0022` it meant, because the clause existed
only to work around this fault. The other two mentions meant the footer credits and were left. The
file now has four `0022`s and every one of them is the footer-credits card.

I did **not** rewrite the mentions in `0019`, `0021`, `0023` or `0041`. Two rules forbid it: this
session may not edit another card, and `docs/board/README.md` makes `## Comments` append-only, so a
dated entry naming the id that was correct on its date is a record rather than an error. Read against
the Plan's own success test — "every surviving mention of the old id can be read against exactly one
card" — they hold: `0019` and `0023` are about the footer text and `0022` now means only that card,
and `0041`'s entries name the lane every time (`human-review/0022`), which is what disambiguates
them. **One line is a genuine residual and is worth a reader knowing about**: `0021`'s comment entry
of 2026-09-05, "The four already passing are 0003, 0013, 0021 and 0022", is a convention-check result
over a board state that no longer exists, so which `0022` it counted cannot be recovered without
re-running that check against 2026-09-05. It reads today as the footer-credits card. I left it.

**Two faults found and not fixed, raised as cards.** `0044`: `docs/HANDOVER.md` says in two places
that one agent-ready card is open and names `0041`, which is built and in `ai-review/`; `todo/` was
empty when this session started. I edited the neighbouring lines of both paragraphs, so I read the
stale sentence and left it. `0045`: three cards in `human-review/` have no `## What I need from you`,
which `docs/board/README.md` calls a defect in the card — `0024`, `0030` and the `0043` this card
just renamed. Renaming `0043` is what put it in front of me; grepping the lane found the other two.

**Could not settle from the repository:** nothing that blocked the work.

