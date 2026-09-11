---
no_outward_effect: "sent" in criterion #1 is a reader following a link between two cards, not a message anybody receives
---
# The link check reports zero while nine open cards carry a bare card number

## Why

`php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards` reported
`NearestForest	0	35	0058` on 2026-09-11, meaning no open card carries an unexplained link. Nine
open cards do. Between them they make 33 such mentions of 22 other cards, naming each in a sentence
and never in `## Links`, which is exactly the form `docs/board/README.md` calls "not a link, it is a
puzzle".

Measured 2026-09-11 over `todo/`, `in-progress/`, `ai-review/` and `human-review/`, reading only the
sections above the first log heading, and after discarding every mention written as a filename,
because a filename already names what it points at:

| Card | Named in a sentence, missing from `## Links` |
|---|---|
| `0057` | `0020` |
| `0015` | `0052` |
| `0024` | `0026`, `0028` |
| `0032` | `0040`, `0041`, `0044`, `0045`, `0055` |
| `0033` | `0003`, `0017`, `0018`, `0037` |
| `0035` | `0003`, `0010`, `0017`, `0027`, `0037` |
| `0037` | `0001`, `0002`, `0003`, `0017`, `0018`, `0020`, `0024` |
| `0053` | `0004`, `0006`, `0008`, `0011`, `0024`, `0030`, `0043` |
| `0056` | `0043` |

**What it costs.** The zero is the finish line card `0021` was measured against, and the same zero is
what any later session will read to decide this board is clean. A reader opening `0037` still meets
seven numbers with nothing beside them and still pays a page load each to find out why they matter.
A check that cannot see the fault it exists to catch is worse than no check, because it is believed.

**How it came to be this way.** The checker recognises some forms a card number is written in and not
others. Card `0021`'s own comment thread says so in as many words on 2026-09-05, and cleared more
cards than the flag named for that reason. Every card in the table above was written after that pass,
so nothing re-read them, and the gap in the checker meant nothing had to.

## Links

**Relates to**
- `0021` - the rewrite pass whose criterion #6 is this check reading zero. It found the same blind
  spot by hand in September and recorded it in prose rather than as a card, which is why it is still
  open.
- `0028` - the same class of fault on one card, fixed one card at a time. This one says the fault
  survives because the checker does not report it, not because nobody fixed it.
- `0015`, `0024`, `0032`, `0033`, `0035`, `0037`, `0053`, `0056`, `0057` - the nine cards this one
  edits. Each is listed in the table above with the numbers it names and nothing else about it is in
  scope.
- `0001`, `0002`, `0003`, `0004`, `0006`, `0008`, `0010`, `0011`, `0017`, `0018`, `0020`, `0026`,
  `0027`, `0030`, `0040`, `0041`, `0043`, `0044`, `0045`, `0052`, `0055` - the cards those nine name
  in a sentence. They are the measurement here, not work: none of them is edited.

## Not this card

**Changing the checker.** It lives in `C:\Dev\ProgressBoard`, outside this repository. If the blind
spot is worth closing at source it is a card on that board, raised separately, and this card is the
evidence for it rather than the fix.

**Changing `docs/board/README.md`.** It is a copy of a canonical file outside every repository and an
edit here is destroyed on the next distribution.

**Cards in `done/` or `discarded/`.** They are a record of what happened.

**Editing `## Comments`, `## Direction` or `## Decided` on any card.** They are append-only. The fix
is a `## Links` line and nothing else; no measurement, acceptance tick or verdict changes.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN a card in the table above names another card in a sentence, THE CARD SHALL also name it
      under `## Links` with the relationship type and one line saying why the reader is sent there.
      proves: `every card number named in a sentence also appears in that card's Links section`
- [ ] #2 WHEN the sweep is re-run over every non-terminal lane, THE BOARD SHALL report no card
      naming another card outside `## Links`, and the run SHALL be shown going red first by deleting
      one of the added lines.
      proves: `removing one added Links line brings its card back into the sweep's output`
- [ ] #3 THE FIX SHALL add `## Links` lines only, and SHALL change no acceptance tick, no
      measurement and no append-only section. proves: none - read the diff
<!-- AC:END -->

## Tasks
- [ ] Read each of the nine cards and write one reason line per missing number, from that card's own
      prose rather than from a guess about the other card
- [ ] Run the sweep, watch it go red with a line removed, restore it, watch it go green
- [ ] Re-run `board:convention` and confirm it is still at zero

## Plan

**Where to stand.** This repository, on the branch the session was given. Nothing outside it changes
and no card moves lane.

**The sweep, which is not the convention check.** Read each card, cut it at the first `## Comments`,
`## Direction` or `## Decided` heading, drop the `## Links` section and every `NNNN-slug.md`
filename, then collect every remaining four-digit number beginning `00` and check it appears inside
that card's `## Links`. Twenty lines of Python, written as a throwaway and deleted with the card;
this project has no test suite that a board check belongs in, and `node scripts/selftest.js` is about
the app.

**Watch it fail before you believe it.** Delete one line you just added and re-run: the card must
come back. A sweep first seen green has never been watched catching anything, and this board has
shipped five defects under exactly that blindness.

**Where a mention is a list rather than a sentence, it is still a mention.** `0037` and `0053` each
enumerate a batch of cards with a clause beside each. That clause is the reason, so the `## Links`
line is short and may point back at the list rather than repeat it. Do not delete the list.

## Comments
