# Four newer cards name another card outside Links

## Why
**Four open cards name another card in a sentence and not under `## Links`**, the form
`docs/board/README.md` calls "not a link, it is a puzzle". Card `0058` fixed nine such cards on
2026-09-11. These four were written or edited after that pass, so nothing re-read them, and the
estate convention check cannot see this form, which is why it still reports zero.

Measured 2026-10-05 with the sweep `0058`'s `## Plan` describes, over `todo/`, `in-progress/`,
`ai-review/` and `human-review/`, above the first log heading:

| Card | Named in a sentence, missing from `## Links` |
|---|---|
| `0074` | `0055`, `0071` |
| `0077` | `0017`, `0020` |
| `0080` | `0077` |
| `0021` | `0058` |

The sweep also prints `0024 0077`. That one is not a mention: it is the convention tool's own output,
whose third column is the highest card number on the board. Leave it.

**What it costs.** A reader meets a number with nothing beside it and pays a page load to find out
why it matters.

## Links

**Relates to**
- `0058` - the same fault on nine cards, and the source of the sweep used to measure this one.
- `0074`, `0077`, `0080`, `0021` - the four cards this one edits. Nothing about them beyond a
  `## Links` line is in scope.
- `0017`, `0020`, `0055`, `0071` - the cards those four name. They are the measurement, not work.
- `0024` - the sweep's one false hit, explained under `## Why`, so the builder does not edit it.

## Not this card
Not the convention checker, which lives in `C:\Dev\ProgressBoard`. Not `docs/board/README.md`. Not any
`## Comments`, `## Direction` or `## Decided` section. Not cards in `done/` or `discarded/`.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN a card in the table above names another card in a sentence, THE CARD SHALL also name it
      under `## Links` with the relationship type and one line, true against the board as it stands,
      saying why the reader is sent there.
      proves: `every card number named in a sentence also appears in that card's Links section`
- [ ] #2 THE FIX SHALL add `## Links` lines only. proves: none - read the diff
<!-- AC:END -->

## Tasks
- [ ] Re-run the sweep; it should reproduce the table above
- [ ] Write one reason line per missing number, from that card's own prose
- [ ] Remove one added line, watch the sweep name the card, restore it

## Plan
The sweep is the twenty lines in `0058`'s `## Plan`: cut each card at its first `## Comments`,
`## Direction` or `## Decided`, carve out `## Links`, strip every `NNNN-slug.md` filename, collect
four-digit numbers beginning `00`, drop the card's own number, and report what is not in `## Links`.
Keep it as a throwaway outside the repository. Write each reason in the tense the board supports
today: `0058` was returned twice for a reason line that was true when copied and false when read.
