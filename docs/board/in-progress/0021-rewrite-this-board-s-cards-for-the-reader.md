# Rewrite this board's cards for the reader

## Why
**A card on this board opens with the answer and never says what is wrong.** On 2026-08-18 Rob said
most of the cards he was handed made him work backwards: they lead with candidate solutions and
their costs, so he has to reverse-engineer the problem out of the proposals. He cannot tell whether
the options are the right ones, because he does not yet know what they are for.

**Two more faults, in his words.** Cards ask him to settle things an agent could have researched and
applied. And a bare card number dropped into a sentence tells him some other card matters and
nothing about why, so he opens it to find out.

**What it costs.** His attention is the only scarce thing here. Measured on 2026-08-20, 258 of 398
open cards across the estate fail at least one of these rules and 257 of those fail on the link rule
alone. A card that reads badly costs a round trip; one that should never have been surfaced costs
the whole reading for nothing. Enough of either and he stops opening the ones that mattered.

**How it came to be this way.** Every card here was written by an agent against a convention that,
until 2026-08-18, said nothing about stating the problem first, nothing about whether a question was
a person's to answer at all, and nothing about how to name another card. It gained all three rules
that day, and nothing was applied to the cards, so this board is measured against a standard none of
it was written to.

## Links

**Relates to**
- `progressboard#0065` - the estate-wide rewrite this card was seeded from; its pilot over
  ProgressBoard's own 40 cards is the worked example of a pass.
- `progressboard#0066` - the five checks the count below is measured with, and why each is
  structural rather than a judgement about prose.
- `0023` - raised by this card. The brief a session reads before the board is itself over the size
  a session can load, which is the same failure one level up.
- `0024` - raised by this card. Two cards on this board are two to three times the reader's line
  budget, and shortening them needs deletion, which this card's own scope fence forbids.

## Not this card
**Changing the convention.** `docs/board/README.md` here is a COPY of a canonical file outside every
repository, so an edit to it is destroyed silently on the next distribution. This card applies the
convention and never changes it.

**Rewriting cards in `done/` or `discarded/`.** Those are a record of what happened. Rewriting a
record is falsifying it, and nobody reads them to decide anything.

**Deleting anything.** A badly written card still holds facts somebody measured. A rewrite keeps
everything the card knows and changes only how it is ordered and said. `## Direction` and
`## Decided` are append-only: do not edit them, on any card, for any reason.

**Any other board.** Each one carries its own copy of this card, worked in its own repository.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN a card in a non-terminal lane is rewritten, THE CARD SHALL state the problem in
      `## Why` before any solution appears anywhere in it. proves: none - about prose, and no check
      here reads prose
- [x] #2 WHEN a rewritten card is a decision, THE CARD SHALL say which of the four reasons makes it
      a person's to answer, or SHALL be converted to a feature card whose `## Plan` records the
      practice applied and its source. proves: none - the command that counts it is in another
      repository, named in `## Plan`
- [x] #3 WHEN a rewritten card names another card, THE CARD SHALL name it in a `## Links` section
      with the relationship type and one line of why, and SHALL NOT leave a bare card number in a
      sentence as the only mention of it. proves: none - as #2
- [x] #4 THE `Blocked by` LINES on every rewritten card SHALL match that card's `needs:` frontmatter
      exactly, in both directions. proves: none - as #2
- [x] #5 THE REWRITE SHALL preserve every measurement, date and decision the card already carried,
      and SHALL NOT edit `## Direction` or `## Decided`. proves: none - as #2
- [x] #6 WHEN this board's rewrite is finished, THE BOARD SHALL report zero open cards failing the
      checks. proves: none - as #2
<!-- AC:END -->

## Tasks
- [x] Read the count, and write it into `## Direction` before changing anything
- [x] Rewrite `human-review/` first, then `todo/`, `in-progress/` and `ai-review/`
- [x] For each decision card, apply the four-reason test and convert the ones that fail it
- [x] Read the count again and write into `## Direction` what changed, counted by rule

## Plan
**Where to stand.** This repository, on whatever branch the session was given. Nothing outside it is
edited and no card changes lane. **The one command, from this board's directory, in PowerShell:**

    php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD

It prints one tab-separated line: board name, OPEN cards failing the checks, open cards, the next
free card number, and the directory read. The second number is this card's finish line and it must
reach 0. Run it before the first edit and after the last. `--path` matters: a build worktree is not
`C:\Dev\<board>`, and without it you measure a tree you are not editing.

**What the checks look for is in `docs/board/README.md` here**, three sections of it: "`## Why` is
the PROBLEM, and it comes before any answer", "Links: say what the relationship IS, never a bare
card number", and "Is this actually a person's to decide?". Read those three first. Every check is
structural - a missing `## Links` section, a `Blocked by` line that disagrees with `needs:`, a link
with nothing after the dash - so each flag names one thing to fix and none is an opinion.

**`human-review/` first, and that is not tidiness.** That lane is the only one a person reads. A
`todo/` card is read by an agent, a reader with different problems, so rewriting those first spends
the session on the half nobody is complaining about.

**Expect the four-reason test to shrink the queue rather than reformat it.** A decision whose answer
turns on established practice is not Rob's: research it, apply it, and rewrite the card as a feature
card whose `## Plan` says what was applied and where it came from. Count those separately from the
cards merely rewritten - that is the change that gives him evenings back.

**If the board is too big for one session, stop cleanly.** Tick nothing, write the count you reached
into `## Direction`, and leave the card where it is; the next session carries on from that entry. A
part-rewritten board is normal. A card ticked off a board that is not at 0 is not.

## Comments
**2026-09-05** The count before any edit, read with
`php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards`:

    NearestForest	17	21	0023

**17 open cards failing out of 21.** By rule: 13 cards carry an unexplained link, 2 have a
`Blocked by` that disagrees with `needs:` (0017 and 0020, both naming 0016), and 7 carry an
outward-effect word in `## Acceptance` with no `not_for_the_loop:` or `no_outward_effect:` to say
which it is. The four already passing are 0003, 0013, 0021 and 0022.

**2026-09-05** RESULT: partial
TESTS: +0 new, all green (218 passed, 0 failed)
TOUCHED: docs/board/human-review/0001-verify-on-iphone.md
TOUCHED: docs/board/human-review/0002-build-ios-shortcut.md
TOUCHED: docs/board/todo/0003-straight-line-distance-in-practice.md
TOUCHED: docs/board/todo/0010-rotate-the-thunderforest-key.md
TOUCHED: docs/board/todo/0017-how-much-of-wales-can-we-actually-ship.md
TOUCHED: docs/board/todo/0018-write-to-forestry-england.md
TOUCHED: docs/board/todo/0023-handover-is-too-big-to-load.md (new)
TOUCHED: docs/board/todo/0024-two-cards-are-over-the-line-budget.md (new)
TOUCHED: docs/board/ai-review/0004-derive-names-for-unnamed-car-parks.md
TOUCHED: docs/board/ai-review/0005-deploy-via-cloudflare-and-hostinger-mcp.md
TOUCHED: docs/board/ai-review/0006-explicit-compass-point-in-list.md
TOUCHED: docs/board/ai-review/0008-offline-map-view.md
TOUCHED: docs/board/ai-review/0009-tile-layer-when-online.md
TOUCHED: docs/board/ai-review/0011-security-response-headers.md
TOUCHED: docs/board/ai-review/0012-close-the-open-tile-proxy.md
TOUCHED: docs/board/ai-review/0014-say-what-happens-to-a-location.md
TOUCHED: docs/board/ai-review/0015-attribution-is-unreadable-over-tiles.md
TOUCHED: docs/board/ai-review/0016-add-scotland-from-forestry-and-land-scotland.md
TOUCHED: docs/board/ai-review/0019-use-forestry-englands-own-attribution-wording.md
TOUCHED: docs/board/ai-review/0020-campsites-tab-from-openstreetmap.md
TOUCHED: docs/board/in-progress/0021-rewrite-this-board-s-cards-for-the-reader.md
OUT-OF-SCOPE: 0023, 0024

**The count after the last edit, same command:** `NearestForest	0	23	0025`. **Zero open cards
failing, against 17 at the start.** 23 open rather than 21 because this run raised two cards; both
were written to the convention and both pass it.

**Counted by rule, all 17 cleared.**
- **13 unexplained links.** Every card that names another now carries a `## Links` section with the
  relationship type and one line saying why the reader is being sent there: 0001, 0002, 0003, 0005,
  0006, 0008, 0009, 0010, 0011, 0012, 0015, 0016, 0017, 0018, 0019, 0020. That is more cards than
  the flag named, because the check does not see every form a number is written in, and criterion #3
  is about the reader rather than about the checker. 0011 was not flagged at all and got one, since
  it named 0012, 0013 and 0014 as bare parenthesised numbers.
- **2 `Blocked by` disagreeing with `needs:`.** 0017 and 0020 both carry `needs: 0016` and now name
  it under `Blocked by` with its reason. Those are the only two cards on the board with `needs:`,
  and no card carries a `Blocked by` that `needs:` does not.
- **7 outward-effect flags, and six of them were the word rather than the effect.** 0004, 0011,
  0014, 0016, 0019 and 0020 take `no_outward_effect:` with the reason: "published" meaning what an
  upstream dataset holds (0004, 0016, 0019, 0020), "send" meaning an HTTP response header (0011),
  and "sent" inside a footer promising that nothing leaves the phone (0014). Only 0005 is a real
  outward effect, and it takes `not_for_the_loop:`, because it creates a live DNS record and
  deploys to a shared host.

**The four-reason test shrank nothing, and that is the finding.** Three open cards carry `## Options`
and are therefore decisions: 0003, 0017 and 0018. All three passed the test rather than failing it,
so none was converted to a feature card. 0003 turns on local knowledge nobody wrote down, which
roads Rob actually drives. 0017 turns on a risk he owns, correspondence with a public body in his
name, plus a cost he carries, about 2 MB of offline payload for a country he rarely drives to. 0018
turns on a risk he owns. Each now names its reason in as many words instead of leaving the reader to
infer it, and 0018 also records that its licence half was researched and applied on 2026-08-15
rather than surfaced as a question.

**#1 is left open, and the reason is a conflict in the convention rather than work not done.** The
criterion asks that no solution appear anywhere above `## Why`. `docs/board/README.md` requires the
opposite of any card waiting on a person: `## What I need from you` goes "directly under the title",
with the reasoning underneath "where it cannot stand between the reader and the ask". Six open cards
have that shape, and on 0003 and 0010 the ask genuinely carries a recommendation and a set of steps.
I could satisfy the criterion or the README, not both, so I kept the README, which is the file the
checks are drawn from. **This needs Rob's call and I did not make it.** Where the shape was stale I
did reorder: 0009 and 0016 sat in `ai-review/` with an answered ask above their `## Why`, and both
now lead with the problem, which is the criterion's intent and costs nothing.

**Nothing was deleted and no append-only section was touched.** The diff removes 51 lines, every one
of them from `## Why`, `## Not this card` or `## What I need from you`, and none from `## Direction`,
`## Decided` or `## Comments`. Where a sentence moved, the fact moved with it: 0008 and 0009 no
longer open "Decided on card 0007", and that decision is now the reason line on their 0007 link;
0012's `## Why` keeps the wrong conclusion it quotes, word for word, and names 0009 in `## Links` as
where the sentence lives.

**No test was written, and no criterion asked for one.** All six say `proves: none`, which the
convention counts as prose. The check that does exist is
`php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards`, and it was run before any
edit at 17 failing and after the last at 0. `node scripts/selftest.js` is green at 218, unchanged,
which is expected because no code changed. `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do
not exist in this project: there is no `composer.json` and no `vendor/`, as cards 0015 and 0019
already recorded.

**Raised, not fixed.** `docs/HANDOVER.md` is 41.5 KB over 545 lines, past the budget a fresh session
can load, which is card `0023`. Cards `0018` at 325 lines and `0020` at 260 are two to three times
the README's 100-line budget, which is card `0024`; that one is fenced out of this card by
"Deleting anything", since cutting them needs deletion and this card only reorders.
