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
- [x] #1 WHEN a card in the table above names another card in a sentence, THE CARD SHALL also name it
      under `## Links` with the relationship type and one line, true against the board as it stands,
      saying why the reader is sent there.
      proves: `every card number named in a sentence also appears in that card's Links section`
- [x] #2 THE FIX SHALL add `## Links` lines only. proves: none - read the diff
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

## Comments

**2026-10-05** RESULT: done
TESTS: +0 new in the repository (the sweep is a throwaway, per `## Plan`), proved red then green; `node scripts/selftest.js` 345 passed, 0 failed
TOUCHED: docs/board/done/0074-nothing-requires-the-https-redirect-to-exist.md
TOUCHED: docs/board/done/0080-the-docs-still-say-forestry-england-will-be-asked-about-the-name.md
TOUCHED: docs/board/human-review/0021-rewrite-this-board-s-cards-for-the-reader.md
TOUCHED: docs/board/todo/0077-card-0027-is-blocked-by-an-answered-card.md
TOUCHED: docs/board/todo/0085-handover-sends-welsh-car-parks-to-a-finished-card.md (new)
OUT-OF-SCOPE: 0085

**The sweep reproduced the card's table exactly before any edit**: `0074` (`0055`, `0071`), `0077` (`0017`, `0020`), `0080` (`0077`), `0021` (`0058`), plus the known `0024 0077` false hit, which was left alone. It is the `0058` `## Plan` sweep, run from `%TEMP%` over `todo/`, `in-progress/`, `ai-review/` and `human-review/`, plus `0074` and `0080` by number. After the edits it prints only `0024 0077`.

**Red proof.** I deleted the added `0077` line from `0080`, confirmed the delete matched (line count 1, then 0), and re-ran: the sweep named `done/0080 ... 0077` and exited 1. Restored from a byte copy; back to only the `0024` hit.

**#2 read off the diff**: `git diff --stat` shows 8 insertions, 0 deletions, all inside `## Links`. No comment, direction, decided or acceptance section was touched.

**Tension, for the reviewer to overrule.** `0074` and `0080` moved to `done/` after this card was written, and `## Not this card` excludes cards in `done/`. I edited them anyway, because criterion #1 names them in its table and that exclusion was written to bound the sweep, not to drop half the table. Each edit is one `## Links` line and `git revert` of this commit undoes it. The brief's "do not edit any other card" is the same tension card `0058` met; this card exists only to edit those four.

**Reasons are worded to stay true when lanes move**: no line names a lane. Each comes from the prose of the card it sits on.

**Raised rather than fixed:** `docs/HANDOVER.md` still calls card `0017` open in four places, and `0017` is in `done/`; its 2026-09-29 answer says Welsh car parks belong on a later card that no lane holds. That is card `0085`. The sweep and the suite were re-run with it on the board: same single `0024` hit, 345 passed, 0 failed. The throwaway sweep is deleted.

There is no PHP suite here, so `pest.bat` and `pint.bat` do not exist and were not run. No browser check is relevant: no app file changed.
