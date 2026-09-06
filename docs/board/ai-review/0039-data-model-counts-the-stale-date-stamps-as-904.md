# DATA-MODEL says 904 records carry a stale date stamp; 1,180 do

## Why
`docs/DATA-MODEL.md:168` explains why the pipeline is red: the committed `sites.json` was built
before card 0026, so every record still carries the parse date rather than the fetch date. The
sentence says "all 904 records still read `2026-08-29`". Measured 2026-09-06 against the shipped
file: **1,180** records read `2026-08-29`, and none reads anything else.

What it costs. The claim itself is true and the reasoning around it is sound — this is only the
count inside it. But it sits four lines from `:89`, where `"counts_by_country": { "England": 904 }`
is **correct**, England really holding 904 of the 1,180. A reader who checks one 904 and finds it
right has no reason to check the other, and a reader who checks the other and finds it wrong now
doubts the right one. Two identical numbers in one file, one true and one stale, is worse than
either alone.

How it came to be this way. Card 0016 grew the dataset from 904 to 1,180. It updated the counts
this file was expected to carry, in its tables; a number written inside a paragraph of explanation
is not somewhere anybody looks.

## Links

**Relates to**
- `0036` — fixed the same stale 904 in three files and was fenced out of `docs/DATA-MODEL.md`,
  because the 904 that card named in this file is the correct one at `:89`. This is a different line.
- `0032` — checked every count in `docs/HANDOVER.md` against the thing it counts. It did not look
  at DATA-MODEL.
- `0026` — the card whose change this paragraph explains.

## Not this card
**Not touching `docs/DATA-MODEL.md:89`.** `"England": 904` is right: 274 English forests plus 630
English car parks. Not touching `docs/DECISIONS.md`, which is append-only and whose 904s were true
on the dates they were written. Not re-fetching `data/raw/`, which is what would make the paragraph
stop being needed at all — that is item 2 of HANDOVER "What's next".

## Acceptance
<!-- AC:BEGIN -->
- [x] WHEN a reader opens `docs/DATA-MODEL.md`, THE FILE SHALL name the number of records that
      actually carry the stale `scraped_at` stamp. proves: `dataset counts in comments match sites.json`
<!-- AC:END -->

## Tasks
- [x] Read the stamp counts out of `app/data/sites.json` rather than from any doc
- [x] Correct the count at `:168` and leave `:89` alone
- [x] Extend the `carried` table in the card 0036 block of `scripts/selftest.js` to cover this line,
      keyed on wording specific enough that it cannot match `:89`

## Plan
Work in the NearestForest repository, on a branch off `main`. The number comes from the shipped file:

    node -e "const s=require('./app/data/sites.json').sites;const c={};s.forEach(x=>c[x.scraped_at]=(c[x.scraped_at]||0)+1);console.log(c)"

which prints `{ '2026-08-29': 1180 }` today. `scripts/selftest.js` already reads counts back out of
three files' prose under `--- dataset counts carried in prose (card 0036) ---`, each as a regex whose
capture group is the claimed number; add a row to that `carried` list. The suite is
`node scripts/selftest.js`; there is no PHP suite here. Nothing under `app/` changes, so no `CACHE`
bump is needed.

It worked when the suite passes, `:89` still reads 904, and the new test goes red if `:168` is put
back to 904.

## Comments
**2026-09-06** Raised by card `0036`, which was explicitly fenced out of this file by its own
`## Not this card`. That fence named the correct 904 at `:89`; this stale one at `:168` was not
known when the fence was written.

**2026-09-06** RESULT: done
TESTS: +1 new row on an existing test, all green (227 passed, 0 failed)
TOUCHED: docs/DATA-MODEL.md, scripts/selftest.js, docs/board/in-progress/0039-data-model-counts-the-stale-date-stamps-as-904.md
OUT-OF-SCOPE: none

Measured the shipped file first: `{ '2026-08-29': 1180 }`, one stamp across all 1,180 records, so
`:168` now reads 1,180. `:89` still reads `"England": 904` and was not touched.

Test first, and it was watched red: the new `carried` row failed with
`docs/DATA-MODEL.md: says 904, dataset holds 1180` before the doc was edited, which is the fault the
criterion names. The row is keyed on `all ([\d,]+) records still read`, wording that appears only in
that paragraph and cannot reach the JSON block at `:89`. It does not hard-code the date: a second
regex reads `still read \`YYYY-MM-DD\`` out of the same sentence and the expected count is the number
of records carrying *that* date, so the row checks both halves of the claim and follows a re-fetch
rather than pinning 2026-08-29. If the paragraph is deleted after the re-fetch (HANDOVER "What's
next" 2), the row reports `no count matching` and must be deleted with it — the same as every other
row in that table.

No PHP suite exists in this project; the suite is `node scripts/selftest.js`, so `.\vendor\bin\pest.bat`
and `.\vendor\bin\pint.bat` were not run. Nothing under `app/` changed, so no `CACHE`/`BUILD` bump.
Docs only, so nothing needs a browser look.
