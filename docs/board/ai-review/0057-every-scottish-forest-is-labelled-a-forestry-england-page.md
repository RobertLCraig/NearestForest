# Every Scottish forest's detail sheet calls its link a Forestry England page

## Why
Open any of the 276 Scottish forests in the app and tap into its detail sheet. The last row is a
link out to the site's own page, and the words on that link read **"Forestry England page"**. The
link goes to `forestryandland.gov.scot`. Forestry England has nothing to do with Scotland, and
Forestry and Land Scotland is a different agency under a different government.

What it costs. It is a false statement of who published something, on 276 records, on the one screen
a person opens to check a place out before driving to it. The app's whole licence position rests on
saying accurately whose data each record is, and this row says the opposite on half the Forests tab.
It also blocks the deploy: card `0016` built Scotland and is waiting to ship, and shipping it ships
this.

The same sheet has a second, quieter version of the fault. `country` is on every record since
`0016`, and the sheet prints it **only for campsites**, so a Scottish forest never says it is in
Scotland while a Scottish campsite does.

How it came to be this way. When the app was England only, "Forestry England page" was true of every
link, so it was written as a plain default. Card `0020` added campsites, found the default wrong for
them, and fixed it **by adding a special case for campsites** rather than by changing what decides
the label. The comment it left says exactly why the default is wrong and the code beside it kept the
default for everything that is not a campsite. Card `0016` then added 276 records that are not
campsites and took the default. The existing self-test asserts the campsite case and the Forestry
England case, and never a Scottish forest, so it has been green throughout.

## Links

**Relates to**
- `0016` - it added the 276 Scottish forests that take the wrong label, and its own review recorded
  this. It sits in `human-review/` and cannot be worked from, which is why this is a separate card.
- `0019` - the same class of fault one screen up, in the footer credit line. Being fixed separately,
  because it touches `scripts/parse.py` and the shipped dataset and this card touches neither.

## Not this card
Not the footer credit wording or the `attribution` string in `app/data/sites.json`; both are `0019`.
Not unticking anything on `0016`, which only Rob may do. Not a country filter, a country tab or any
branch on `country`, all of which DATA-MODEL forbids. Not re-running the pipeline and not touching
`app/data/sites.json`, which is generated. Not the car parks, which carry no `url` at all, so the
link row never renders for them.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN the detail sheet renders the More link, THE APP SHALL name the agency that published
      the page from the link's own host, so a Forestry and Land Scotland page reads as one.
      proves: `a link is labelled by the agency that published it, never by another agency`
- [x] #2 WHEN a record carries a country, THE APP SHALL show it in the detail sheet whatever the
      record's source, so a Scottish forest states Scotland.
      proves: `the detail sheet shows Country for every source, not only for campsites`
<!-- AC:END -->

## Tasks
- [x] Replace the `site.source === 'campsite'` branch that picks the link label with a lookup on the
      link's own host, so nothing about the label depends on which tab a record is in
- [x] Move the `Country` row out of the campsite-only branch into the shared part of `openSheet()`
- [x] Extend the existing More-link assertion in `scripts/selftest.js` with a Scottish forest case,
      rather than writing a second test beside it
- [x] Add an assertion that the `Country` row is not inside the campsite branch

## Plan
Work in `C:\Dev\NearestForest` on `main`. Two files change, `app/app.js` and `scripts/selftest.js`,
and nothing else. Run `node scripts/selftest.js` from the repository root first; it prints
`280 passed, 0 failed`. There is no PHP suite here, no `vendor/`, no Pest and no Pint.

**The root cause is what the label is read off, not the missing case.** Today it is
`site.source`, defaulting to `'Forestry England page'`. `source` is `forest`, `carpark` or
`campsite` and says nothing about who published anything, so every future agency takes the default
and is wrong in the same way. **The host does say.** Measured on the shipped files: forest URLs are
`www.forestryengland.uk` (274) and `forestryandland.gov.scot` (276), Stay the Night car parks are
`forestryandland.gov.scot` (44), every other campsite is its own site, and car parks have no `url`.
So a two-entry lookup from host to agency name, falling back to the bare host, covers all four cases
and is shorter than the branch it replaces.

**Do not move this into `core.js`.** The convention says new logic goes there, and this is not new
logic: the existing assertion lifts the `if (moreHref) { ... }` block straight out of `app/app.js`
source and runs it, and moving the code would mean rewriting that harness for no behaviour change.
Its regex is anchored on the block's opening line and its two-space closing brace, so keep both.

It worked when a Scottish forest's sheet reads "Forestry and Land Scotland page" and states
Scotland, an English forest still reads "Forestry England page", a campsite still reads its own
host, and the suite is green with the new cases.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-10** Raised because Rob asked for the Scotland work to be fast-tracked, and this is what
stands between card `0016` and a deploy. **The criteria above were written before the code**, so the
ticks mean what they say rather than being read back off a finished change.

**One thing the earlier review of `0016` got wrong, checked before acting on it.** Its scope verdict
said `docs/DATA-MODEL.md` carries a wrong England count, "904, not 274". 904 is right: it is every
English record, 274 forests plus 630 car parks, and the shipped `sites.json` header says the same.
Nothing to fix, so it is not in this card's tasks.

**2026-09-10** RESULT: done
TESTS: +2 new, all green (282 passed, 0 failed)
TOUCHED: app/app.js, app/sw.js, app/core.js, scripts/selftest.js
OUT-OF-SCOPE: none

**The fix is a deletion, not an addition.** The label came from `site.source` with a default of
"Forestry England page" and one special case for campsites. It now comes from the link's own host,
through a two-entry `AGENCY_BY_HOST` table falling back to the bare host. That is fewer lines than
the branch it replaced and it closes the whole class: a fifth agency added tomorrow shows its host
rather than silently claiming to be Forestry England. The `Country` row moved out of the
campsite-only branch into the shared part of `openSheet()`, which is a one-line move.

**Both new checks were proved red before they were trusted**, which matters on this card because
the fault survived for eleven days behind a green suite.

- Put the old `site.source` branch back: `FAIL, a Scottish forest reads "Forestry England page" ...
  and 276 of 276 shipped Scottish records are labelled as another agency (e.g. fls-aberfoyle)`.
  281 passed, 2 failed.
- Move the `Country` row back inside the campsite branch: `FAIL, the Country row is back inside the
  campsite-only branch, so a Scottish forest is silent about Scotland`. 281 passed, 1 failed.
- Restored both, and `diff` confirms `app/app.js` is byte-identical to the fix. 282 passed, 0 failed.

**The first check reads the shipped dataset, not only fixtures.** It labels all 276 Scottish records
in `app/data/sites.json` and fails if any one of them is labelled as another agency, so it cannot
pass on a fixture while the data says otherwise. It also pins an unrecognised host staying bare:
`naturalresources.wales` reads as itself, which is what card `0017` will need.

**Looked at in a browser, not inferred.** Served with `php -S 127.0.0.1:8795 -t app` at 390x844.
Aberfoyle's sheet reads `COUNTRY: Scotland` and `MORE: Forestry and Land Scotland page` over
`https://forestryandland.gov.scot/visit/destinations/aberfoyle`. Abbeyford Woods still reads
`COUNTRY: England` and `MORE: Forestry England page`. The footer credit line is untouched and still
wrong, which is card `0019` and not this one.

![Aberfoyle's detail sheet, crediting Forestry and Land Scotland and stating Scotland](../attachments/0057-2026-09-10-1.png)

**`CACHE` and `BUILD` bumped to `v25-2026-09-10`**, because `app/` changed and `deploy.ps1` refuses
to ship otherwise. A self-test holds the two in step.
