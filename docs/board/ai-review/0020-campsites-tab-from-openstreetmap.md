---
needs: 0016
---
# A Campsites tab: where you can pull up a campervan, across England, Scotland and Wales

## Why
Rob asked for it on 2026-08-15, in these words: "add another tab, Campsites — these are places where
you could pull up in a campervan or RV / caravan trailer, want it to work for england scotland and
wales". That is a third tab over a third source, and it is the first thing in this project that
covers Great Britain rather than England.

The app already answers "where is the nearest forest". It cannot answer "where can I sleep tonight",
which is the question a campervan actually has, and the one that matters most in exactly the
dead-signal places this app was built for.

## Where the data is, measured 2026-08-15

**There is no national open-government campsite dataset. This was checked, not assumed.** data.gov.uk
carries only per-council fragments (Durham caravan parks, Mid Ulster caravan and camping sites) and
nothing for England, Scotland or Wales as a whole. The Forestry Commission recreation hub publishes
Areas, Points and Routes for England and no camping layer. Commercial directories (Searchforsites,
park4night, Britstops, the Caravan and Motorhome Club) are all proprietary and none offer a licence
that would let the data ship inside an app.

**OpenStreetMap is the only source with full Great Britain coverage, and it is open.** Measured by
one Overpass query against `ISO3166-2` areas `GB-ENG`, `GB-SCT` and `GB-WLS` on 2026-08-15:

| Measure | Count |
|---|---|
| `tourism=camp_site` + `tourism=caravan_site` total | **8,496** (1,452 nodes, 6,908 ways, 136 relations) |
| of which `caravan_site` | 4,657 |
| of which `camp_site` | 3,839 |
| carrying a `name` | 6,204 (so **2,292 are unnamed**) |
| with a coordinate after taking way/relation centroids | 8,496 — **none missing** |
| crude country spread | ~6,083 England, ~1,729 Wales, ~684 Scotland |
| bounding box | lat 49.8916..60.6887, lng -7.5378..1.7592 (Scilly to Unst) |

Tag coverage on those 8,496, which is what decides how much the app can honestly say:

```
caravans        1,204 present   (yes 915, no 286)
motorhome         151 present   (yes 121, no 29)
tents           1,467 present   (yes 1,197, no 250, only 19)
fee               813 present   (yes 746, no 52)
addr:postcode   2,004 present
website         2,068 present
phone           1,345 present
opening_hours      96 present   <-- effectively nothing
toilets           610, shower 568, drinking_water 412, power_supply 680
sanitary_dump_station 464 present (yes 337)
access            482 present   (customers 212, private 173, permit 25, members 14)
caravan_site       32 present   (motorhome_stopover 25)  <-- aires are barely mapped in GB
```

**2,859 of the 3,839 `camp_site` records carry no `caravans` and no `motorhome` tag at all.** That
bucket is the one real judgement call on this card, and it is not a small one.

### The FLS "Stay the Night" scheme is a second, better source for Scotland
Forestry and Land Scotland runs a scheme letting **self-contained motorhomes and campervans park
overnight in forest car parks**, 6pm to 10am, no return within 48 hours, first come first served.
[The destinations page](https://forestryandland.gov.scot/visit/stay-the-night/stay-the-night-destinations)
is plain HTML and was fetched on 2026-08-15: **44 distinct `/visit/destinations/<slug>` links**
across 9 regions. Nine of them take vehicles over 7m or caravans; the rest do not.

This is the single most on-brand campsite data in existence for this app: it is forest car parks,
from the state forestry body, for exactly the vehicle Rob is asking about. **The list page carries no
per-site coordinates** — one `data-lat` and it is the map centre. But card **0016** has already
measured that the FLS destinations index carries all 278 destinations with `latitude`/`longitude` in
a single `data-forest-search-map` attribute, so joining the 44 slugs to that index costs **two
requests total** and needs no per-site scrape.

## Not this card
Not Northern Ireland or Ireland, despite the stated long-term intent: the boundary outline does not
include Northern Ireland (DATA-MODEL says so, deliberately) so a record there would rank in a list
and vanish on the map. Not wild-camping spots, not laybys, not `highway=rest_area`. Not a booking
link, not availability, not price comparison — the app is a snapshot and says so. Not merging
campsites into `sites.json`; see the licence section, this is load-bearing. Not a country filter or a
country tab, and not a change to what `source` means: DATA-MODEL says nothing branches on it beyond
tab membership, and that stays true with three tabs.

## The licence is different from everything else here, and the file layout has to carry that
OSM is **ODbL**, not OGL. A GB-wide extract of every campsite is unambiguously a *Derivative
Database*, so it must be published under ODbL and attributed. That is fine — this repo is public and
the app already ships attribution.

**The trap is mixing it into `sites.json`.** ODbL 1.0 §4.5(a) exempts a *Collective Database*, defined
as "this Database in unmodified form as part of a collection of independent databases in themselves
that together are assembled into a collective whole", and says the licence "still applies to this
Database ... as a part of the Collective Database" while the rest keeps its own terms. So:

- **`app/data/campsites.json` is a separate file with its own `licence` and `attribution` block.**
  Two independent databases shipped side by side is a Collective Database. One merged file invites
  the argument that the OGL forest data became a derivative of the OSM one, and throws away the clean
  licence position DECISIONS 2026-08-15 just established.
- Attribution wording, per the OSMF guidelines: credit **"OpenStreetMap"** or **"© OpenStreetMap
  contributors"**, make clear the data is under the Open Database License, and link to
  `https://www.openstreetmap.org/copyright`. It belongs in the footer next to the OGL line, and on
  the map, where the tile attribution already sits — which is why **0015 should land first**, since
  it is the card that makes attribution readable at all.

## Payload: measured, and it is not the problem it looks like
A trimmed record set was built and sized rather than estimated:

| Cut | Records | Raw | Gzipped |
|---|---|---|---|
| everything | 8,496 | 1,081 KB | — |
| after the filter below | 5,194 | 628 KB | **150 KB** |
| filter + named only | 3,682 | 516 KB | **125 KB** |
| filter, columnar encoding | 5,194 | 509 KB | 146 KB |

For comparison `sites.json` is 515 KB raw. **The live server already compresses**: measured against
`https://forestlocator.enhanceify.co.uk/data/sites.json`, it returns `Content-Encoding: br` at
**52,064 bytes** for the 527,524-byte file. So NFR3's "under 1 MB so it installs over a weak
connection" is met over the wire with room to spare, and no columnar encoding is needed. What does
grow is the **offline cache footprint**, from ~550 KB to ~1.2 MB uncompressed. Worth stating in the
PRD rather than discovering on a phone, given that an over-quota Cache Storage on iOS is evicted
wholesale and that is the bug that already bit this project once.

## The filter, and what it costs
Applied to the 8,496, in this order, each count measured:

- drop `caravans=no` **and** `motorhome=no`, `tents=only` (19), `backcountry=yes` (54)
- keep every `caravan_site` not explicitly `caravans=no`; keep `camp_site` only where
  `caravans=yes` or `motorhome=yes`
- drop `access=private|no` (**174**)
- drop `scout=yes|only` or `group_only=yes` (**164**) — scout camps are not campervan stopovers
- drop what reads as a static-caravan holiday park (**146**): `permanent_camping=only`, or an
  operator/name matching Parkdean (58 records), Haven, Park Holidays, Royale, Away Resorts and the
  rest. You cannot pull a campervan onto a static pitch, and these are the loudest false positives.

**Result: 5,194 records, of which 3,682 named and 1,512 unnamed.** The 1,512 are card 0004's problem
all over again — an unnamed dot is worse than an unnamed row — and the same nearest-named-neighbour
trick will not work here, because a campsite's neighbour is not its parent.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN the app loads, THE APP SHALL offer a third tab, Campsites, ranked by distance from the
      current fix exactly as the other two are.
- [x] #2 WHEN a campsite record is shown, THE APP SHALL state only what its source publishes, and
      say "not known" for every field the source is silent on — in particular it SHALL NOT show an
      open/closed badge, since only 96 of 8,496 records carry any opening hours.
- [x] #3 WHEN campsite data is shipped, THE APP SHALL credit OpenStreetMap, state that the data is
      under the Open Database License, and link to openstreetmap.org/copyright.
- [x] #4 WHEN the dataset is built, THE APP SHALL keep OSM-derived records in a file separate from
      the OGL-derived `sites.json`, each carrying its own licence statement.
- [x] #5 WHEN a record's coordinates fall outside Great Britain, THE APP SHALL fail the build, with
      the bounding box widened from England to GB rather than removed.
- [x] #6 WHEN a site is a members-only, private, scout or static-caravan site, THE APP SHALL NOT
      list it as somewhere to pull up for the night.
- [x] #7 WHEN an FLS Stay the Night car park is listed, THE APP SHALL say that it is overnight-only
      between 6pm and 10am and that it requires a self-contained vehicle, because listing it without
      that is an invitation to break the scheme's rules.
- [ ] #8 WHEN the app is installed, THE APP SHALL still work fully offline with the larger dataset,
      re-verified on the device as card 0001 check 5 requires. **Only a person can close this one.**
<!-- AC:END -->

## Tasks
- [x] `scripts/fetch_campsites.py`: one Overpass POST, cached to `data/raw/osm/`, resumable and
      zero-request on re-run like the other fetchers. Fail loudly on a short or empty response;
      an Overpass timeout that returns 200 with a partial body is the failure mode to guard.
- [x] Record the Overpass `timestamp_osm_base` from the response as the records' `scraped_at`, so
      staleness is the data's own timestamp and not the day we happened to run it.
- [x] `scripts/parse_campsites.py`: centroid for ways and relations, `os-n/w/r<id>` ids, the filter
      above, emit `app/data/campsites.json` with its own `licence` and `attribution` block.
- [x] Fetch the 44 FLS Stay the Night slugs and join them to the `data-forest-search-map` index from
      card 0016 for coordinates. Two requests. Mark them `stay_the_night: true` and carry the
      6pm–10am and self-contained rules as published text.
- [x] ~~Widen `LAT_RANGE` in `scripts/parse.py:17` and the bbox assertion in `scripts/selftest.js:186`
      from England to Great Britain.~~ **Done differently, and the difference is deliberate.**
      `sites.json` is still England only, so widening its box would loosen a tripwire that is
      currently correct. The England box stays exactly where it is; the campsite parser and its
      self-tests carry their own Great Britain box (49.5..61.2 N, -8.8..2.2 E, snug from Scilly to
      Unst). Two datasets, two boxes, each as tight as its own data allows.
- [x] Add `country` to the `Site` record, and document `source: campsite` in `docs/DATA-MODEL.md`
      along with the campsite-only fields and the separate-file rule.
- [x] `app/index.html`: third tab button; `app/app.js` already ranks by `TAB` so the tab itself is
      cheap. Check the tab strip still fits a small iPhone in portrait with three tabs.
- [x] `app/app.js` / `app/core.js`: load the second data file, and make `rank()` read from whichever
      file holds the active tab's source without branching on `source` for anything else.
- [x] `app/sw.js`: add `./data/campsites.json` to `ASSETS` and bump `CACHE`; bump `BUILD` in
      `core.js` to match, which a self-test enforces and `deploy.ps1` refuses to ship without.
- [x] Footer attribution: OSM/ODbL line added and self-tested.
- [ ] **Map attribution still outstanding**, and it is a licence condition rather than a nicety.
      It waits on **0015**, since the map credit is the thing 0015 is about.
- [x] `scripts/selftest.js`: assert the record count, GB bbox, that no campsite carries an
      open/closed badge, that every campsite record has a name or an explicit derived flag, and that
      the OSM attribution string is present in `index.html`.
- [x] `docs/PRD.md`: the "No Wales, Scotland or Northern Ireland" non-goal is now contradicted by an
      instruction and not just by intent. Rewrite it, widen the scope section to three tabs, and add
      the offline-cache footprint note.
- [x] `docs/DECISIONS.md`: one entry for the source choice and one for the Collective Database file
      layout, since that is the part a future session would most easily undo by "tidying up".

## Plan
Take the Overpass extract, not a Geofabrik `.pbf`: the query is 10 lines, the response is 2.3 MB, and
it needs no osmium toolchain on a Windows box with no build step. Cache the raw JSON exactly as
`fetch.py` caches HTML, so re-running the parser costs Overpass nothing. One query per run, and the
`out count` form for iterating on the filter, so the filter is developed against counts rather than
against repeated full downloads.

**The judgement call is the 2,859 `camp_site` records with no caravan or motorhome tag.** Including
them adds real campsites the app would otherwise miss and, at the same time, adds tent-only fields
and footpath-access sites where a campervan cannot go. Excluding them is consistent with this
project's standing rule that it never claims a gate is open on a guess. There is a third way:
include them, mark them `rv_access: unknown`, and say so on the row — the same honesty the app
already applies to a null opening time. That is the recommendation, and it is the question on the
card below.

Do not try to reconcile OSM campsites against the existing car park data. They overlap in places and
a merge would need a fuzzy spatial join whose failures are silent, which is the opposite of how
everything else here is built.

## Answered, and built
**Rob chose the shortest cut on 2026-08-15: named and explicitly caravan or motorhome capable.**
The recommendation on this card had been the middle option; the call went the other way, in favour
of a list every row of which is recognisable and true. Built to that. Widening it later is a
one-line change to `takes_a_van()` in `scripts/parse_campsites.py`.

**Shipped:** 3,681 campsites, 2,612 England, 505 Scotland, 564 Wales, including all 44 Stay the
Night car parks. `campsites.json` is 972 KB on disk and about 150 KB on the wire. All eight
acceptance criteria are met except #8, which is a device check and belongs with card 0001.

Two things were found by running it rather than by reading it, which is this project's usual pattern:

- **The same campsite appeared twice in the first two rows from Brighton.** OSM maps many sites as
  both a node and the surrounding area, and both survived every other check because their OSM ids
  differ. Fixed by merging same-name records within 0.5 mi, a threshold read off the distribution
  rather than chosen: 47 same-name pairs sit within 0.3 mi, one at 0.38, one at 0.55, and the next
  is 1.43 mi. 42 duplicates removed, and a self-test now fails if any return.
- **The Stay the Night rules were labelled "Charges"**, so the sentence saying no tents are allowed
  sat under a heading about money. Relabelled "Overnight rules" for those records.

**Still open, and deliberately not done here:**
- **Card 0015 has not landed**, so the OSM credit on the *map* will have the same readability problem
  the tile credit has. The footer credit is fine and is self-tested. 0015 now gates two licences
  rather than one.
- **The colliding marker labels are worse now**, which is the card the handover notes does not exist.
  3,681 more markers made it visible immediately on the map screenshot.
- **The footer still says "Personal use"** next to the new ODbL line, which stopped being true a
  while ago. That is card **0019**, untouched here on purpose so the two do not overlap.
- The iOS Shortcut and `api/nearest.php` know nothing about campsites. They read `sites.json` only,
  so they are unaffected rather than broken, but the two front ends now differ in what they cover.
