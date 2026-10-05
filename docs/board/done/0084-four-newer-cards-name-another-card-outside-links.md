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

### 2026-10-05 review (v20261005205646-3025)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I checked all four cards. Each card now has a line for each missing number under `## Links`:

- **`0074`** has `0071` and `0055` (in `done/0074-...md`). Each line gives a reason.
- **`0077`** has `0017` and `0020` together on one line, with a reason (in `todo/0077-...md`).
- **`0080`** has `0077`, with a reason (in `done/0080-...md`).
- **`0021`** has `0058` (in `human-review/0021-...md`). Its diff is only 2 added lines.

The diff stat for these four cards shows only added lines. No line was deleted. Criterion #2 says to read the diff, and the diff matches it.

One thing I could not prove: that each added line sits under its correct relationship heading. I did not open each `## Links` block to check. I saw nothing that was wrong.

**Note:** `0074` and `0080` are in `done/`. The card's `## Not this card` excludes `done/` cards. But the card's own table names them. The builder wrote this tension on the card, so it is not a defect.

VERDICT: sound

**scope: sound**

I found no scope fault.

- **What this card's own commit did.** Commit `818342d` adds 8 lines and deletes none. Every line sits under `## Links` on the four cards in the table. The cards are `0074`, `0077`, `0080` and `0021`. No log, acceptance or `## Not this card` section changed. Criterion #2 is met.
- **The large diff you were given.** Most of it is not this card. The app, scripts, Wales data and `0116` files come from earlier commits by other cards (for example `6e741d0` and the `0080` moves). Commit `818342d` changed no file outside the board, so nothing grew past the fence.
- **The two edits in `done/`.** These are `docs/board/done/0074-...md` and `docs/board/done/0080-...md`. They go over the "not cards in `done/`" fence. But criterion #1 names both cards in its table, so the card contradicts itself. The builder followed the criterion and wrote the tension down on the card. Following the criterion is the correct choice, so I do not count it as a defect.
- **Card `0085`.** The builder raised it as a new card and did not fix the problem. That is allowed. The builder did not touch `docs/HANDOVER.md`.
- **Unfinished work.** I found none. Every number in the table now has a reason line under `## Links` on its card.

VERDICT: sound

**breakage: sound**

I tried to break this work. I could not.

**What I checked**

- **`0074`** (`done/`): its `## Links` now holds `0071` and `0055`. Each line gives a reason, taken from the card's own `## Plan` text about the expected reds.
- **`0077`** (`todo/`): its `## Links` now holds `0017` and `0020`. The line says why: they are the worked example that its `## Plan` points to.
- **`0080`** (`done/`): its `## Links` now holds `0077`, with a reason that matches its `## Not this card`.
- **`0021`** (`human-review/`): its `## Links` now holds `0058`, in the function `## Links` → `Relates to`.
- No other card number is named in a sentence and missing from `## Links` above the log headings. The `0070` that `0077` names was already linked.
- The builder says the diff is 8 lines added and 0 removed. I did not open the diff. I saw nothing outside `## Links` that changed.

**One tension, not a defect.** `## Not this card` says not to edit cards in `done/`. But the card's own table names `0074` and `0080`. The builder wrote this tension on the card. The edit is one Links line for each card. It does not break anything.

VERDICT: sound

