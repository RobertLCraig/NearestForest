# The Forestry England briefing still counts the dataset as it was before Scotland

## Why
`docs/outreach/forestry-england-handover.md` is the self-contained briefing for a session drafting
the Forestry England email in Word. Two of its statements about the app describe a dataset that no
longer exists, and one of them is presented as checked. Measured 2026-09-06 against
`app/data/sites.json`, which holds 1,180 records: 550 forests (274 English, 276 Scottish) and 630
car parks.

- `:189` — the "what is verified and what is not" table lists `904 locations, 274 forests, 630 car
  parks` as **Verified** against the generated dataset. It is 1,180 and 550 today.
- `:109` — "rows and markers reading `Unnamed car park`. 170 of the 630 car parks". Card 0004 names
  177 of them after their nearest forest, so most of those rows no longer read that way.

What it costs. This file exists to be handed to a session with no repository access, so nothing in
it can be checked against the code by the person using it. A row marked **Verified** is the one
line a reader is entitled to quote without re-checking, and quoting it to Forestry England states a
number about their own data that is wrong by a quarter. The email is not sent yet, so the cost is
still recoverable.

How it came to be this way. The briefing was written on 2026-08-15. Cards 0004 and 0016 changed the
dataset on 2026-08-29 and updated `docs/HANDOVER.md` and `docs/DATA-MODEL.md`, which is where counts
were expected to live. Nothing points from the dataset to the outreach folder.

## Links

**Relates to**
- `0036` — corrected the same stale 904 in three code and build files, and found these two while
  checking that no other live count had moved. Out of its scope: it was scoped to those three files.
- `0027` — the send. This briefing is read as part of doing that card, so this should be fixed first.
- `0016` — grew the dataset from 904 to 1,180 and added the 276 Scottish forests.
- `0004` — derived the 177 car park names that `:109` predates.

## Not this card
Not editing `docs/outreach/forestry-england-enquiry.md` unless a count in it is also wrong; check
it, since the handover repeats the email in full and the two must be edited together. Not changing
what the email asks for — that is card 0018 and card 0027.

## Acceptance
<!-- AC:BEGIN -->
- [x] WHEN a reader opens `docs/outreach/forestry-england-handover.md`, THE FILE SHALL state the
      record, forest and car park counts `app/data/sites.json` holds today.
      proves: `dataset counts in comments match sites.json`
- [x] WHEN the briefing describes what a car park row shows, THE FILE SHALL account for the 177
      derived names card 0004 added. proves: `manual` — prose, not a number a test can read back.
<!-- AC:END -->

## Tasks
- [x] Re-read the counts out of `app/data/sites.json` rather than from any doc
- [x] Correct `:189` and `:109`, and check `forestry-england-enquiry.md` for the same numbers
- [x] Extend the `carried` table in the card 0036 block of `scripts/selftest.js` to cover this file,
      so the next dataset change fails a run

## Plan
Work in the NearestForest repository, on a branch off `main`. The numbers come from the shipped file:

    node -e "const s=require('./app/data/sites.json').sites;console.log(s.length, s.filter(x=>x.source==='forest').length, s.filter(x=>x.source==='carpark').length)"

which prints `1180 550 630` today. `scripts/selftest.js` already reads counts back out of three
files' prose under `--- dataset counts carried in prose (card 0036) ---`; adding a row to its
`carried` list is the whole of the test work. The suite is `node scripts/selftest.js`; there is no
PHP suite here. Nothing under `app/` changes, so no `CACHE` bump is needed.

It worked when the suite passes and no count in the outreach folder disagrees with the shipped file.

## Comments
**2026-09-06** Raised by card `0036` while correcting the same stale 904 in `app/api/nearest.php`,
`docs/build/IOS-SHORTCUT.md` and `app/core.js`.

**2026-09-06**
RESULT: done
TESTS: +3 rows in one existing test, all green (227 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/outreach/forestry-england-handover.md, docs/board/in-progress/0038-the-forestry-england-briefing-counts-predate-scotland.md
OUT-OF-SCOPE: none

Test first, and it went red for the right reason before the doc moved: three rows added to the
`carried` table in the card 0036 block, one per number on the `:189` row, and the run said
`docs/outreach/forestry-england-handover.md: says 904, dataset holds 1180 | says 274, dataset
holds 550`. It reports as the same single named test the card cites, so the count of tests is
unchanged at 227.

Counts read straight out of `app/data/sites.json`, not out of any doc: **1,180 records, 550
forests (274 `fe-`, 276 `fls-`), 630 car parks**.

`:189` now reads `1,180 locations, 550 forests, 630 car parks` and carries a warning the old row
had no need of: **only 274 of the 550 forests are Forestry England's**. The briefing is read by a
session drafting an email *to* Forestry England, and a bare "550 forests" on a **Verified** row is
exactly the number that would get quoted back to them as a count of their own sites.

`:109` was wrong in two ways, not one. It said "170 of the 630 car parks have no name". Measured
today: **196** publish no usable name (170 `Unknown` plus 7 bare `Car Park` — card 0004's 177 —
plus 19 that were already `Unnamed car park`), and after 0004 only **19** still read that way. So
the line now gives 196 and 19, says the two screenshots at `:104` are from 2026-08-14 and predate
the fix, and says a replacement shot must come from a build containing 0004 rather than from the
live site, since 0004 is built and not yet deployed.

Checked `forestry-england-enquiry.md` as the card asked: it carries no dataset counts at all, so
nothing to edit there and the two files stay in step. `cheryl-update.md`'s only large number is a
word count.

Not settled from the repository, and left for the reviewer rather than guessed: whether the
**Verified** row should be re-dated. The old row carried no date while the rows above it are all
stamped 2026-08-15. I stamped it 2026-09-06, which is when I measured it, on the reading that a
`Verified` claim with no date is the weaker of the two forms.

Nothing under `app/` changed, so no `CACHE` bump, per the card's Plan. No browser check applies —
this card touches documentation and a test only.
