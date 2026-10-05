# Add Wales: the 116 named sites from Natural Resources Wales

## Why
The app is wrong in Wales, and wrong in the quiet way. Stand in a Welsh forest with no signal and it
names an English or Scottish site as the nearest one, because it holds no Welsh forest at all. It
does not say "I don't know about Wales". It confidently sends you further than you need to go.

That is every trip into Wales, which Rob has named as the next country after Scotland (card `0016`,
2026-09-25). It stayed this way because Wales was held up by a licence question over Natural
Resources Wales's (NRW's) open dataset, and nobody separated the part of Wales that needs that
licence from the part that does not.

NRW's own website lists **116 visitor sites** across five regions at
[naturalresources.wales/days-out/places-to-visit](https://naturalresources.wales/days-out/places-to-visit/?lang=en),
measured 2026-08-14. Each page carries a postcode, an OS grid reference, parking charges, facilities
and trails, in prose, much like the English pages. `robots.txt` is fully open. **The pages carry no
latitude or longitude**: the only coordinate in the markup sits inside a Google Maps embed URL.

## Links

**Relates to**
- `0017` - the decision this card carries out. Rob's side chose option 1 on 2026-09-29: the 116 named
  sites, coordinates from their OS grid references, no Welsh car parks. Its `## Why` holds the
  measurements this card relies on.
- `0016` - added Scotland the same way and is the pattern to copy: `fetch_fls_index()`,
  `fetch_fls_pages()` and `build_fls()`, and its thread lists three things the Scottish pages did
  that the research did not predict.

## Not this card
Not Welsh car parks, and not NRW's recreation points (`NRW_GB_RECREATION_POINTS`, 3,472 records).
Those were option 2 on `0017`, they need NRW's written licence answer, and the email asking for it
(`docs/outreach/nrw-licence-enquiry.md`) is Rob's to send, not this card's. Not a country filter or a
new tab: a Welsh forest is a forest. Not a re-scrape of England or Scotland. Not the English
`parse_opening()` dotted-minutes defect. Not a deploy: `scripts/deploy.ps1` is run by a person
afterwards.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN the pipeline runs, THE APP SHALL carry every site on NRW's places-to-visit index as a `forest` record with `country: "Wales"`, an `nrw-` id, a name, WGS84 coordinates and its NRW page URL. proves: `Wales fills the Forests tab`
- [x] #2 WHEN an OS grid reference is converted, THE APP SHALL land within 10 m of the Ordnance Survey's own worked example for that conversion. proves: `an OS grid reference converts to the Ordnance Survey's worked example`
- [x] #3 WHEN any Welsh record's coordinates fall outside the Wales box added to `COUNTRY_RANGE`, THE APP SHALL fail the build, as the England and Scotland boxes do today. proves: `Welsh coords are in Wales`
- [x] #4 IF a Welsh page has no grid reference or one that will not parse, THEN THE APP SHALL leave that site out, name it in the parse step's printed failure list, and never place it at a guessed position (read in the `parse.py` output, which has no harness of its own). proves: manual
- [x] #5 WHEN someone stands in mid Wales, THE APP SHALL rank a Welsh forest first rather than an English one. proves: `a point in mid Wales gets a Welsh forest as nearest`
- [x] #6 WHEN a Welsh site's detail sheet is shown, THE APP SHALL label its link as Natural Resources Wales, not as another agency. proves: `the Welsh detail link names Natural Resources Wales`
- [x] #7 WHEN a Welsh name carries a circumflex, THE APP SHALL keep it end to end with no mojibake. proves: `Welsh diacritics survive the round trip`
<!-- AC:END -->

## Tasks
- [ ] `scripts/fetch.py`: fetch the five regional index pages and the 116 site pages at the existing rate limit, cached to `data/raw/nrw/` and resumable, with an `EXPECT_MIN_NRW` floor well below 116, the same shape as `fetch_fls_index()` and `fetch_fls_pages()`
- [ ] `scripts/parse.py`: a `build_nrw()` beside `build_fls()`, taking name, postcode, facilities, parking text and grid reference from each page, and emitting `nrw-<slug>` ids
- [ ] `scripts/parse.py`: an OS grid reference to WGS84 conversion, as plain maths in the standard library (see Plan for why not a dependency)
- [ ] Add `"Wales"` to `COUNTRY_RANGE` and `naturalresources.wales` to `URL_HOSTS` in `scripts/parse.py`, and to `AGENCY_BY_HOST` in `app/app.js`
- [ ] `scripts/selftest.js`: a Wales block asserting #1, #2, #3, #5, #6 and #7 under the names above
- [ ] Read NRW's website terms and record the re-use position for the page text in `docs/DECISIONS.md`. **If it forbids re-use, stop and raise a `human-review/` card rather than shipping the data**
- [ ] Add NRW to the About view's attribution in `app/index.html`
- [ ] Update `docs/PRD.md`, `docs/HANDOVER.md` and `docs/DATA-MODEL.md`, which each say Wales is still open on card `0017`
- [ ] Bump `CACHE` in `app/sw.js` and `BUILD` in `app/core.js`

## Plan
Stand in `C:\Dev\NearestForest`. Run `python scripts/fetch.py && python scripts/parse.py`, then
`node scripts/selftest.js`, as `CLAUDE.md` says. Nothing else needs to be running.

**The conversion is the new part.** A grid reference such as `SN 123 456` is two letters naming a
100 km square plus an easting and northing inside it. Turning that into WGS84 is two steps: an
inverse transverse Mercator projection onto the OSGB36 ellipsoid, then a Helmert transform from
OSGB36 to WGS84. The Ordnance Survey's "A Guide to Coordinate Systems in Great Britain" publishes
both formulae and a worked example with every intermediate value. Take criterion #2's expected
figures from that worked example, not from memory. A Helmert transform is good to a few metres,
which is far inside what "nearest forest" needs.

**Why not `pyproj`.** `requirements.txt` holds exactly one third-party module, `requests`, and a
self-test fails if a second one appears. About sixty lines of maths costs less than changing that
rule.

**A free cross-check.** Each page's Google Maps embed carries a coordinate. Do not ship it, because
that URL changes shape without warning. But compare it once against the derived position for all
116 sites while building. A site more than a few hundred metres out points at a bad parse or a
bad grid reference on NRW's side, and is worth naming in the card's thread.

**Expect** about 66 KB on `sites.json`, measured on `0017`.

## Comments

**2026-10-05** RESULT: done
TESTS: +6 new, all green (node scripts/selftest.js: 345 passed, 0 failed)
TOUCHED: scripts/fetch.py
TOUCHED: scripts/parse.py
TOUCHED: scripts/selftest.js
TOUCHED: app/data/sites.json
TOUCHED: app/app.js
TOUCHED: app/index.html
TOUCHED: app/core.js
TOUCHED: app/sw.js
TOUCHED: app/api/nearest.php
TOUCHED: docs/DATA-MODEL.md
TOUCHED: docs/DECISIONS.md
TOUCHED: docs/HANDOVER.md
TOUCHED: docs/PRD.md
TOUCHED: docs/build/IOS-SHORTCUT.md
TOUCHED: docs/outreach/forestry-england-handover.md
OUT-OF-SCOPE: none

Built: fetch_nrw_index()/fetch_nrw_pages() (top page names 5 regions, 116 sites, cached to data/raw/nrw/, EXPECT_MIN_NRW 100); build_nrw() with grid_ref_to_en(), en_to_osgb36() (OS guide Annex C.2) and osgb36_to_wgs84() (section 6.6 Helmert, reversed by sign) in stdlib maths; Wales box (51.3..53.5 N, -5.7..-2.6 E) in COUNTRY_RANGE; naturalresources.wales in URL_HOSTS and AGENCY_BY_HOST; NRW credit in the footer and ATTRIBUTION; CACHE/BUILD v31-2026-10-05.

NRW terms read 2026-10-05 (/footer-links/copyright/): website content may be re-used under OGL with their fixed attribution statement, logos excluded. So no human-review card. Recorded in DECISIONS 2026-10-05.

Test-first: all six named tests were watched red before the build (no Welsh records; en_to_osgb36 missing; validate() said "no known country: 'Wales'" rather than outside Wales; Rhayader ranked Kinsley Wood (England) first; fixture link read "naturalresources.wales"). #2 first failed on a missing function, so it was red-proofed after building by breaking the code and confirming each patch applied: Helmert tz sign flipped -> Annex D off 1084 m, red; grid-letter I-skip removed -> 500 km, red; inverse projection VII sign flipped -> 13 km, red. Changing F0 to 0.9996 moved the answer about 0.4 m and stayed green, which is inside the criterion's 10 m. #3 red-proofed by widening the Wales box to reach London: red. Expected figures for #2 are copied from the OS guide v3.6 PDF (C.2 and D), not from memory; our output lands within 0.01 m of Annex D.

#1 vs #4: 113 of 116 index sites ship. Cwm Idwal, Cwm Carn Forest and Stackpole publish no grid reference anywhere on the page; parse.py leaves them out and lists them under 'LEFT OUT, no usable grid reference'. I read #1's 'every site' as every site #4 does not exclude. The build fails if more than 10% of the index has no readable grid reference (a share, not a floor, so the one-site fixtures still parse).

Google Maps cross-check (never shipped): 112 pages, median 0.07 mi, max 0.43 mi. Over 0.25 mi: ceunant-cynfal 0.43, dyfi-forest-coed-nant-gwernol 0.34 (its grid ref is the walking-trail start at Nant Gwernol station), nash-wood 0.33, crychan-forest-halfway 0.31, glasfynydd-forest 0.30, whitestone 0.30, oxwich-national-nature-reserve 0.29. None looks like a bad parse; the embed pin is not always on the named car park.

Assumptions: the 'How to get here' postcode goes in postcode_satnav (NRW warn some cover a wide area). Multi-car-park pages (Newborough, Tywi, Taf Fechan, Spirit of Llynfi) are placed at the first grid reference listed. Names are the index card titles, kept whole ("Black Covert, near Aberystwyth"). Opening times, address and postal postcode are null: not on the card's task list. Welsh payload is about 99 KB, not the 66 KB the card expected, mostly long Parking sections (median 63 chars, max 5,874); sites.json is 818 KB, 101 KB gzipped.

Also in the diff: tests and prose that listed two countries or carried counts were extended, not loosened (country list, agency host list, agency credit lists, two parse fixtures given one Welsh site each, core.js count comment plus a new guard on its NRW number). Rebuilding sites.json also moved six opening_summary seasons (fe-creech-wood and five others), because parse_opening() picks the season from today's date; that is existing behaviour.

Not run: the full fetch.py, because it always re-downloads the English car parks and the card rules out a re-scrape; only the NRW functions ran (116 fetched, 0 failed). The worktree's data/raw was stale and was replaced with a copy of C:\Dev\NearestForest\data\raw before parsing. No Pest or Pint: this repo has no vendor/ and no PHP suite; node scripts/selftest.js is the suite. Not checked in a browser or on the phone; that is still owed. Not deployed.

### 2026-10-05 review (v20261005185115-51ef)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I checked every criterion against the code. I could not break any of them.

**What I checked:**

- **#1:** `build_nrw()` in `scripts/parse.py` makes the records. Each one has `id: "nrw-<slug>"`, `country: "Wales"`, a name, coordinates and the page URL. Its test is `Wales fills the Forests tab` in `scripts/selftest.js`. 113 of the 116 sites ship. The other 3 have no grid reference, and #4 says to leave those out. A missing page file goes into `problems`, so the build fails. No site is lost without a message.
- **#2:** The maths is in three `scripts/parse.py` functions: `grid_ref_to_en()`, `en_to_osgb36()` and `osgb36_to_wgs84()`. The worked-example test exists. The builder also broke the code on purpose and saw the test fail, so the test can catch a real bug.
- **#3:** A Wales box is in `COUNTRY_RANGE`. Its test is `Welsh coords are in Wales`.
- **#4:** If a grid reference is missing or will not parse, `build_nrw()` catches the `ValueError`. It puts the site in `nrw_notes["no_grid_ref"]` and skips it. The site is never placed at a guessed position. The "LEFT OUT" list prints these names.
- **#5, #6 and #7:** Each has its named test: the Rhayader ranking, the Natural Resources Wales link label in `AGENCY_BY_HOST` in `app/app.js`, and the Welsh diacritics.

One small note: the #1 test only checks for at least 100 Welsh records, not an exact count. But the build itself fails if a page file is missing, or if more than 10% of sites have no grid reference.

**What you do now:** nothing on this card. Checking it on the phone and deploying it are still to do.

VERDICT: sound

**scope: sound**

I checked only the scope: what this card added that it did not ask for, and what it left half done.

**The extra files are from other commits.** The diff you were shown has 43 files. The Wales commit `936c984` changes only 15 of them. The rest come from other commits in the same range:
- `app/api/tiles.php` (key lookup and counter salt)
- the Facilities-row rewrite in `app/app.js`
- `HUMAN_ACTIONS.md`
- the other board cards
- `docs/outreach/forestry-england-enquiry.md`

In `936c984` itself, `app/app.js` gets only the `naturalresources.wales` entry in `AGENCY_BY_HOST`.

**The commit stays inside the "Not this card" fence:**
- No Welsh car parks, and no `NRW_GB_RECREATION_POINTS`.
- No country filter and no new tab.
- No English re-scrape. The builder ran only the NRW fetch functions.
- No deploy.

**The extra edits are allowed.** `docs/build/IOS-SHORTCUT.md`, `docs/outreach/forestry-england-handover.md` and `app/api/nearest.php` only change site counts that Wales made wrong. They do not add anything new.

**Nothing is half done:**
- Every task line on the card has matching work in the commit.
- Three sites are left out: Cwm Idwal, Cwm Carn and Stackpole. Their pages have no grid reference. Criterion #4 allows this, and `parse.py` names them in its printed failure list.
- `sites.json` grew by about 99 KB, not the 66 KB the card expected. The builder reported this in the thread, so it is not hidden.

**Still open, but not scope defects:**
- The browser check and the phone check are not done.
- The deploy is a separate step for a person to run.

I disproved no criterion. So there are no `UNMET:` lines.

VERDICT: sound

**breakage: sound**

I tried to find what this change breaks. I found nothing broken.

**What I checked:**

- **API for the Shortcut** (`app/api/nearest.php`). It has no country or agency logic. Only its count comment changed, and that count is now correct.
- **Link label** (`AGENCY_BY_HOST` in `app/app.js`). It has the new Welsh host. The parser's allow-list (`URL_HOSTS` in `scripts/parse.py`) has the same host, so the two lists agree.
- **Footer credit** (`app/index.html`). It now names Natural Resources Wales. The line that says the app is "not affiliated" with each agency names Wales too.
- **Data-model example** (`docs/DATA-MODEL.md`). The test pins its credit text and date to the shipped `sites.json`. The example was updated to the new date and credit.
- **Grid-reference reader** (`grid_ref_to_en` in `scripts/parse.py`). It reads references with or without spaces. It skips the letter I. It refuses an odd number of digits.
- **Wales box** (`COUNTRY_RANGE` in `scripts/parse.py`). It covers Anglesey, the Pembrokeshire islands and Chepstow. A Welsh record placed in London fails the build, so the box does catch errors.
- **Facilities row** (`openSheet` in `app/app.js`). It now always shows. That matches the card 0016 rule cited in its comment.

**#1 against #4.** 113 of the 116 sites ship. The other 3 publish no grid reference, and #4 tells the build to leave such sites out and name them. So "every site" in #1 is met.

**Not done:** No check in a browser or on the phone. No deploy. The card says both belong to a person.

VERDICT: sound

