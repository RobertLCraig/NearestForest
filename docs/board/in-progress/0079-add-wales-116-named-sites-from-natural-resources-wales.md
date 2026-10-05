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
- [ ] #1 WHEN the pipeline runs, THE APP SHALL carry every site on NRW's places-to-visit index as a `forest` record with `country: "Wales"`, an `nrw-` id, a name, WGS84 coordinates and its NRW page URL. proves: `Wales fills the Forests tab`
- [ ] #2 WHEN an OS grid reference is converted, THE APP SHALL land within 10 m of the Ordnance Survey's own worked example for that conversion. proves: `an OS grid reference converts to the Ordnance Survey's worked example`
- [ ] #3 WHEN any Welsh record's coordinates fall outside the Wales box added to `COUNTRY_RANGE`, THE APP SHALL fail the build, as the England and Scotland boxes do today. proves: `Welsh coords are in Wales`
- [ ] #4 IF a Welsh page has no grid reference or one that will not parse, THEN THE APP SHALL leave that site out, name it in the parse step's printed failure list, and never place it at a guessed position (read in the `parse.py` output, which has no harness of its own). proves: manual
- [ ] #5 WHEN someone stands in mid Wales, THE APP SHALL rank a Welsh forest first rather than an English one. proves: `a point in mid Wales gets a Welsh forest as nearest`
- [ ] #6 WHEN a Welsh site's detail sheet is shown, THE APP SHALL label its link as Natural Resources Wales, not as another agency. proves: `the Welsh detail link names Natural Resources Wales`
- [ ] #7 WHEN a Welsh name carries a circumflex, THE APP SHALL keep it end to end with no mojibake. proves: `Welsh diacritics survive the round trip`
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
