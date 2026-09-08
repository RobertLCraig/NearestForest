# Data model: NearestForest

_Last updated: 2026-08-29 (card 0016 added Scotland to the Forests tab)_

The single source of truth for this project's data shape. Every layer (scrape, transform, bundled
JSON, PWA, iOS Shortcut) conforms to this. Anywhere a layer diverges is a bug to close, not a state
to preserve.

Five upstream sources with different shapes are normalised into **one** `Site` record so the PWA and
the Shortcut never branch on provenance. The `source` and `country` fields are the only things that
tell them apart, and they exist for display and debugging, not for control flow.

**One record shape, but two files on disk, and that split is a licence boundary rather than a
modelling one.** `app/data/sites.json` holds the Open Government Licence sources (Forestry England
forests and car parks); `app/data/campsites.json` holds the ODbL one (OpenStreetMap, plus Forestry
and Land Scotland's Stay the Night car parks). They are merged into one array in memory at load.
See the campsites section below before changing that.

## Entities

### Site — the canonical record (`data/sites.json`)

| Field | Type | Units | Nullable | Format / notes |
|-------|------|-------|----------|----------------|
| `id` | string | — | no | Stable slug. `fe-<url-slug>` for Forestry England forests, `fls-<slug>` for Forestry and Land Scotland ones, `cp-<OBJECTID>` for car parks. The prefix is the publishing agency. Never reused. |
| `source` | enum | — | no | `forest` \| `carpark` \| `campsite`. Drives which tab it appears in, nothing else. `campsite` records live in a **different file**; see below. |
| `country` | enum | | no | `England` \| `Scotland`. Provenance, not control flow: **there is no country filter and no country tab**, and a Scottish forest ranks in the same list as an English one. It exists so the build can assert a tighter bounding box per country and so a count is checkable. |
| `name` | string | — | no | Display name. For car parks with no usable upstream name, see `name_is_derived`. |
| `name_is_derived` | bool | — | no | `true` when we generated the name because upstream had none usable. **177 car parks: `Car park near <nearest forest>` where a forest point is within 5 miles, otherwise the bare `Unnamed car park`.** Shown in the list, the detail sheet and the map label as dim italic, so it is never mistaken for an official name. |
| `lat` | number | deg | no | WGS84, EPSG:4326. 7 dp. This is what Navigate uses. |
| `lng` | number | deg | no | WGS84, EPSG:4326. 7 dp. Negative is west. |
| `postcode_satnav` | string | — | yes | The **sat-nav** postcode from the page's "How to find us", not the JSON-LD `postalCode`. These genuinely differ. See DECISIONS 2026-08-08. |
| `postcode_postal` | string | — | yes | JSON-LD `address.postalCode`. Kept for reference, never used for navigation. |
| `address` | string | — | yes | Human-readable single line, assembled from JSON-LD `streetAddress[]` + `addressLocality`. |
| `url` | string | — | yes | Absolute page URL on the agency that publishes the record: `www.forestryengland.uk` or `forestryandland.gov.scot`. `null` for car parks. **The host set is closed**, in the build and again in the app, because this string goes into an `href`. |
| `opening_times` | string | — | yes | Free text, as published. Not parsed into a schedule; see below. |
| `opening_summary` | object | — | yes | Best-effort parse. `null` when the free text could not be parsed confidently. Never guessed. |
| `parking` | string | — | yes | Charges and parking notes as published. |
| `facilities` | string[] | — | yes | Normalised lowercase tags, e.g. `["toilets","cafe","cycle hire"]`. Empty array means none found; `null` means not scraped. |
| `category` | string | — | yes | Car parks only, from upstream `category`. Always `Car Parks` in the current cut. |
| `surface` | string | — | yes | Car parks only, from upstream `area_asset_type`, e.g. `Gravel`, `Tarmac`, `Grass`. |
| `status` | enum | — | yes | Car parks only. `Permanent - Official` \| `Permanent - Unofficial` \| `Seasonal - Official` \| `Seasonal - Unofficial` \| `Temporary`. |
| `district` | string | — | yes | Car parks only, upstream `cots_district_id`. |
| `scraped_at` | string | — | no | ISO-8601 date `fetch.py` **downloaded** the page behind the record, read back from `data/raw/fetched.json`. Never the date the parser ran. Makes staleness visible. |

### opening_summary — nested, nullable

| Field | Type | Units | Nullable | Format / notes |
|-------|------|-------|----------|----------------|
| `access` | enum | — | no | `always` \| `dusk` \| `hours` \| `unknown`. The primary field. Most sites do not publish clock times at all, so a clock-only model would discard the commonest answers. See DECISIONS 2026-08-08. |
| `opens` | string | — | yes | `HH:MM` 24h. |
| `closes` | string | — | yes | `HH:MM` 24h. Seasonal variants collapse to the currently applicable one at build time. |
| `season_from` | string | — | yes | `MM-DD`, when the closing time is seasonal. |
| `season_to` | string | — | yes | `MM-DD`. |
| `confidence` | enum | — | no | `parsed` \| `partial` \| `unparsed`. Anything below `parsed` means the UI shows the raw `opening_times` text instead of a computed open/closed badge. |

**Measured distribution over the 268 forests that publish opening text (2026-08-08):**
`always` 94, `dusk` 104, `hours` 43, `unknown` 27. So 90% resolve to something actionable.
`dusk` carries no `closes` value on purpose: dusk is a function of date and latitude, so the
app computes sunset per site at render time rather than freezing a wrong time into the data.

**Rule: an unparsed opening time is shown as raw text, never as "open".** Guessing a gate is open is
the one error that strands someone at a locked car park at night.

**Scotland barely publishes hours at all, and that is an answer, not a gap.** 7 of the 276 Forestry
and Land Scotland destinations publish any opening text; the other 269 carry `null`, which the app
renders as "not listed". Of the 7, **four are about a café, a shop or a visitor centre rather than
about the gate**, so their `access` is `unknown` and the published sentence is shown as written.
Glentrool is the example the rule was written from: under a heading reading "Opening hours" it says
"The café is open from 10.30am to 4.30pm", and the forest itself never closes. Kirroughtree is the
counter-example: it names a café *and* says "The car park and trails are always open", so the
always-open statement wins and it resolves to `always`. The test is in `fls_opening()` in
`scripts/parse.py`, and a self-test asserts `openState()` returns `unknown` for every café-only site.

### Runtime-only, never persisted

`distance_mi` (float, miles, great-circle) and `bearing_deg` (float, degrees true, 0 = north) are
computed per render from the live GPS fix. They are deliberately absent from `sites.json` so there is
no stale copy of a position-dependent value on disk.

## Canonical representation

`data/sites.json` — a single UTF-8 JSON file, the only artefact both front ends read.

```json
{
  "generated_at": "2026-08-29",
  "counts": { "forest": 550, "carpark": 630 },
  "counts_by_country": { "England": 904, "Scotland": 276 },
  "attribution": "Contains public sector information licensed under the Open Government Licence v3.0.",
  "sites": [ /* Site records, forests first, each tab already sorted by name */ ]
}
```

- **Coordinates are WGS84 decimal degrees everywhere.** The car park source is EPSG:27700 (British
  National Grid) and is reprojected at build time by requesting `outSR=4326` from the FeatureServer.
  No British National Grid value survives into `sites.json`. A record carrying an easting/northing
  in the six-figure range is a bug, and the build asserts against it.
- **The bounding-box tripwire is per country, and a Great Britain box on top.** `scripts/parse.py`
  asserts every record inside Great Britain (49.5 to 61.2 N, -8.8 to 2.2 E), and then inside the box
  for the country it names: England 49.5 to 56.2 N, Scotland 54.5 to 61.2 N. Card 0016 widened this
  without loosening it, deliberately: the records that get reprojected are the English car parks, so
  an England box is the one that catches a bad reprojection, and a single box reaching Shetland would
  wave one through.
- **Car park geometry is a polygon upstream**; only its centroid is kept, because you navigate to a
  point. The polygon is discarded.
- **Null means "not known", empty string never appears.** A field that could not be scraped is `null`,
  and the UI renders that as an explicit "not listed" rather than blank space.
- Enums are exactly the values listed above. An unrecognised upstream value fails the build loudly
  rather than being coerced or dropped.

## Scotland, from Forestry and Land Scotland (card 0016, 2026-08-29)

276 destinations in the same `forest` tab and the same ranked list as the English 274. Same record
shape, no new fields beyond `country`, and nothing in the app branches on where a site is.

- **The index is one HTML attribute.** `/visit/destinations` carries all 278 destinations in
  `data-forest-search-map` as HTML-escaped JSON (`title`, `link`, `latitude`, `longitude`, plus
  fields the app ignores), repeated identically on all 31 pages of the pager. `sitemap.xml`
  independently lists the same 278 destination URLs, which is the cross-check that this is the whole
  set rather than a filtered view. The whole index costs one request.
  **Do not use the attribute's `open` field for anything**: it reads `false` on all 278 records, so
  it is a UI flag, not a status.
- **278 published, 276 shipped.** Allt Mor and Puck's Glen are published as "<name> (closed)" on the
  index and again in their own page's `<h1>`, and both were confirmed closed against their own pages
  (a wildfire and storm damage respectively). A place you cannot get into is not somewhere to offer
  as a drive, so they are dropped rather than labelled. A self-test asserts no shipped name ends in
  "(closed)".
- **Detail comes from `/visit/destinations/<slug>/visitor-information`.** Sections are cut out by
  heading, not by CSS class, because the same section appears at different heading depths from page
  to page: "Using SatNav?" is an `h3` at Aberfoyle and an `h4` at Allean. `fls_section()` accepts h1
  to h4 and stops at the next heading of that level or higher, or at `<nav>`.
- **Coverage, measured 2026-08-29:** sat nav postcode 269/276, facilities 273/276, parking
  information 232/276, opening text 7/276. Every absent field is `null`, never an empty string.
- **The page repeats its own coordinate** in `data-inline-map`, and the parser compares it to the
  index value on every run. Max disagreement across all 276 is 0.000 miles, so a future drift between
  the two sources shows up in the build report rather than passing silently.
- **`postcode_postal` and `address` are always `null`.** FLS publishes neither: its JSON-LD carries
  only an organisation block, and the only postcode on the page is the sat-nav one. That is the same
  distinction Forestry England makes, so `postcode_satnav` is still the one to navigate to.
- **No Scottish car parks.** No open dataset exists: the Forestry Commission hub publishes England
  recreation Areas, Points and Routes only, the "National Forest Estate Recreation Scotland 2017"
  ArcGIS items return 403, and FLS's own ArcGIS org has boundaries, blocks and parking machines but
  no recreation points. Scotland fills the Forests tab and not the Car parks tab, on purpose.

## Known divergences (to close)

- **`opening_summary` is forest-only.** Car parks carry `null`, because the open data publishes no
  hours at all. A car park row therefore never shows an open/closed badge, even when the forest it
  sits in does. **The nearest-forest join below deliberately does not fix this.** A name is a claim
  about proximity and is marked as ours; a gate time copied off a forest up to five miles away would
  be this project telling somebody a barrier is open on a guess, which is the one error it refuses
  to make. Closing this needs opening hours published per car park, and nobody publishes them.
- **The English opening-hours parser has two measured defects, found by card 0016 and left alone.**
  Both were reproduced on 2026-08-29 and both are outside that card's scope, which was Scotland.
  1. **Minutes written with a dot are dropped.** `parse_opening()` reads `7:30am` and not `7.30am`,
     so Wyre Forest's "April to September: 7.30am - 9pm" is invisible and it falls through to its
     November-to-February line. Accepting `[:.]` fixes those, and it also makes five other English
     records pick up **café** times they currently miss, which is the wrong direction. Fixing this
     properly means teaching the parser whose hours a sentence is about, the way `fls_opening()` now
     does for Scotland. **Worth its own card.**
  2. **A month-to-month range takes the opening time as the closing time.** "Summer (April to
     September): 8am - 10pm" reads as closing at 08:00. It is currently harmless because such
     records come out as `partial`, and the app shows raw text below `parsed`, so no wrong badge is
     ever displayed. It becomes harmful the moment anything starts trusting `closes` directly.
- **The committed `sites.json` still carries parse-date stamps, and only a re-fetch clears them.**
  The generator was fixed by card 0026 (see Closed below), but the file in the repository was built
  before that, so all 1,180 records still read `2026-08-29` while the English HTML behind them was
  downloaded on `2026-08-08`. It cannot be rebuilt from the cache that is on disk: those pages were
  cached before any date was recorded and their age is not recoverable, so `scripts/parse.py` now
  refuses them by name and exits non-zero. **The pipeline is therefore red until `data/raw/` is
  re-fetched**, which card 0026 held out of its own scope because a re-fetch also changes the data.
- **`CFD-` asset codes are still shown as names.** About 68 car parks are published under an internal
  code such as `CFD-THH-CAR PARK` or `CFD-SAL- Car Park 2`. They are a real upstream value, so the
  derived-name rule below leaves them alone, but they read as machine output in a list. Out of scope
  for card 0004, which scoped itself to the "Unknown" and bare-"Car Park" records; worth its own card.

### Closed

- ~~**`scraped_at` is stamped when the parser runs, not when the page was fetched.**~~ Closed
  2026-09-05 by card 0026, in the generator. `scripts/fetch.py` writes the download date of every
  file it saves into **`data/raw/fetched.json`**, keyed by the path relative to `data/raw/` with
  forward slashes, rewritten after each page so a run that dies half way still leaves dated HTML.
  `scripts/parse.py` reads that index and stamps each record with the date of the page behind it:
  the English page, the Scottish page, or `carparks.json` for all 630 car parks, since one query
  answers for the lot.
  **A page with no recorded date is named and the build fails.** It is never given today's date,
  which was the bug: re-parsing the cache costs zero requests and is the intended way to work, so a
  parse-time stamp made the whole dataset look a day old whatever the age of the HTML. A file
  modification time is not a substitute either, because any copy of the tree rewrites it and a build
  worktree is a copy. Three self-tests cover it, all driving the real Python scripts in a temporary
  tree. **What is not closed is the shipped file**: see the open divergence above.

- ~~**Car parks have no parent forest.**~~ Closed 2026-08-29 by card 0004. The open data still
  carries no link, so `scripts/parse.py` joins each unusable-name car park to its **nearest forest
  point** and names it `Car park near <forest>` (a qualifier survives, so `Overflow Car Park` becomes
  `Overflow car park near Delamere Forest`). 177 records qualify: the 170 published as `Unknown` and
  7 published as a bare `Car Park` / `Main Carpark`.
  **The threshold is 5 miles and it is measured, not chosen.** Distances from those 177 to the
  nearest forest point run q1 0.03, median 0.32, q3 2.19, max 23.66 mi, so the Tukey outlier fence
  (q3 + 1.5 × IQR) sits at 5.45 mi; rounded down to 5. 158 are named, and the 19 beyond it keep the
  bare `Unnamed car park` rather than claim a forest they are probably not part of.
  **This is proximity, never membership.** Forest records are single points, not polygons, so a
  point-in-polygon join is not available and the name says "near" on purpose. Self-tests assert that
  no car park inside the threshold is left bare, that none outside it claims a forest, and that every
  derived name names the forest it is genuinely nearest to.

- ~~**Forest coordinate provenance is mixed.**~~ Resolved 2026-08-08 by measurement: the search-page
  `data-lat`/`data-lng` and the per-forest JSON-LD `geo` block agree to **0.00 miles across all 274**
  (max delta, not mean). There is no divergence. The build takes the JSON-LD value and the parser
  reports the delta distribution on every run, so a future drift shows up rather than passing silently.

## `app/data/campsites.json` (generated): a second database, under a second licence

Places you can pull a campervan, caravan or motorhome into, across England, Scotland and Wales.
Generated by `scripts/fetch_campsites.py` and `scripts/parse_campsites.py`; **never hand-edited**,
same rule as the other two generated files.

**This is a separate file for a legal reason, not a tidiness one, and merging it back would be a
mistake that is hard to see.** `sites.json` is Open Government Licence. This one is derived from
OpenStreetMap and is therefore **ODbL**, whose share-alike condition applies to a Derivative
Database. ODbL 1.0 section 4.5(a) exempts a *Collective Database*, defined as the licensed database
"in unmodified form as part of a collection of independent databases in themselves that together are
assembled into a collective whole". Two files shipped side by side, each with its own licence block,
are exactly that. One merged file invites the argument that the OGL data became a derivative of the
ODbL one, and throws away the clean licence position DECISIONS 2026-08-15 established. The app
merges the two arrays **in memory at load and nowhere on disk**, and a self-test asserts that no
campsite record has appeared inside `sites.json`.

```json
{
  "generated_at": "2026-08-15",
  "counts": { "campsite": 3647 },
  "counts_by_country": { "England": 2582, "Scotland": 505, "Wales": 560 },
  "licence": "ODbL 1.0",
  "attribution": "Campsite data © OpenStreetMap contributors, available under the Open Database License. ...",
  "attribution_url": "https://www.openstreetmap.org/copyright",
  "sites": [ /* Site records, source: "campsite", sorted by name */ ]
}
```

A campsite record is the same `Site` shape, with three differences and four extra fields:

| Field | Type | Nullable | Notes |
|---|---|---|---|
| `id` | string | no | `os-n<id>` / `os-w<id>` / `os-r<id>` for an OSM node, way or relation; `fls-stn-<slug>` for a Stay the Night car park. |
| `country` | enum | no | `England` \| `Scotland` \| `Wales`. Taken from **which country's Overpass query returned it**, never from a bounding box: England and Wales share too long a border for a box to be honest. A site returned by two queries is kept once, under the first. |
| `vehicles` | string[] | no | Non-empty by construction: `caravans`, `motorhomes`, `tents`. A record that names none is a build failure, because it does not belong in this tab. |
| `access_note` | string | yes | `Customers only`, `Permit needed`, `Members only`, `Permissive access`, `Self-contained vehicles only`. What stops you getting in, which outranks any facility on a row read while driving. |
| `stay_the_night` | bool | absent when false | A Forestry and Land Scotland Stay the Night car park. `parking` then holds the scheme's rules rather than a price, and the detail sheet labels it "Overnight rules". |
| `operator`, `phone` | string | yes | As published upstream. |

Three differences from the `Site` table above, all deliberate:

- **`opening_summary` is always absent, and the app must never show an open/closed badge here.**
  Measured 2026-09-08: 98 of 3,647 records publish any opening text at all. A badge would be a guess,
  and this project does not guess that a gate is open. A self-test asserts `openState()` returns
  `unknown` for every campsite record.
- **Coordinates are 5 dp, not 7.** Most of these are the centroid of a hand-drawn polygon, so digits
  six and seven would be precision the data does not have. 5 dp is ~1.1 m, and it saved 40 KB.
- **An absent key means "not known".** `sites.json` writes an explicit `null`; this file omits the
  key, because at 3,647 records the nulls were the majority of the bytes. Every consumer tests
  `value == null` or truthiness, which reads the two identically. This is the one place the
  "null means not known" rule is expressed by omission rather than by a literal `null`.

### What is filtered out, and why the count is what it is

From 8,501 OSM elements across the three countries, 3,647 records survive. Every exclusion is
counted and printed by the parser rather than happening quietly:

| Dropped | Count | Why |
|---|---|---|
| no name published | 2,292 | An unnamed dot is unusable in a list read while driving. |
| no explicit caravan or motorhome access | 2,370 | Rob's call, 2026-08-15. An untagged `camp_site` is not evidence that a van can get in. |
| static-caravan holiday park | 155 | You cannot pull a campervan onto a static pitch. Parkdean alone is 58 records. **26 of these were found on 2026-09-08 by their name alone.** A residential park or a park-home estate is where people live in static homes, and 22 shipped until the rule read `residential`, `park home` and `static` as words: a brand list cannot see "Lynwood Residential Park". The line that must not move is that a park saying "Touring", or taking tents, is a mixed site with real pitches and survives. |
| private, members-only or no public access | 30 | `access=members` joined `private` and `no` on 2026-09-08. A club site you are not a member of is not somewhere you can pull up for the night, and the parser had been labelling those six "Members only" rather than dropping them. |
| scout or group-only | 2 | Both were found on 2026-09-08 by their **name**, not by a tag: OSM's `scout` tag is sparse, and "Rolleston Scout Group Caravan Park" carries only a name and `tourism=caravan_site`. The match is the whole word, because "Scoutscroft" in Coldingham is a commercial holiday park. Every site carrying `scout=yes` had already gone at an earlier rule, which is why this row read 0 before. |
| the same site mapped twice | 42 | OSM maps many campsites as both a node and the surrounding area. Merged by name within **0.5 mi**, a threshold taken from the distribution: 47 same-name pairs sit within 0.3 mi, one at 0.38, one at 0.55, and the next is 1.43 mi. |
| already counted in a neighbouring country | 5 | Border sites returned by two queries. |
| merged into a Stay the Night record | 2 | Where OSM and FLS describe the same tarmac, the first-party record wins, because it carries the scheme rules. |

**The second source is Forestry and Land Scotland's "Stay the Night" scheme**: 44 forest car parks
where a self-contained motorhome or campervan may park overnight, 6pm to 10am, no return within 48
hours. The list page publishes no coordinates, so the 44 slugs are joined to the
`data-forest-search-map` attribute on the destinations index, which carries all 278 destinations with
`latitude`/`longitude`. The whole join costs two requests and matched 44 of 44 on 2026-08-15. The 44
sit across 9 regions, and **9 of them take vehicles over 7 m or caravans**; the rest do not.

### What the source actually publishes, measured 2026-08-15

The Overpass extract behind all of the above was **8,496 elements** when the tag counts were taken
(1,452 nodes, 6,908 ways, 136 relations; 4,657 `caravan_site`, 3,839 `camp_site`; 6,204 carrying a
`name`; every one with a usable coordinate once way and relation centroids are taken; roughly 6,083
England, 1,729 Wales, 684 Scotland), spanning lat 49.8916..60.6887 and lng -7.5378..1.7592, Scilly to
Unst. The final build counted 8,501, three re-runs later. Tag coverage on that set is what decides
how much the app may honestly say, and it is thin:

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

That is why `vehicles` is an explicit list rather than an inference, why `access_note` carries what
stops you getting in, and why there is no opening badge. **2,859 of the 3,839 `camp_site` records
carry neither a `caravans` nor a `motorhome` tag**, and that bucket was the one real judgement call:
see DECISIONS 2026-08-15 for the call and the reasoning. **A wider filter was measured and not
taken:** keep every `caravan_site` not marked `caravans=no`, drop `tents=only` (19),
`backcountry=yes` (54), `access=private|no` (174), scout or group-only sites (164) and
static-caravan parks (146), and 5,194 records survive at 628 KB raw and 150 KB gzipped. That is the
size of the change if real use ever says the shipped list is too thin, and **1,512 of those 5,194
carry no `name`**, which is what it costs in quality: they are the same defect card 0004 fixed for
car parks. The unfiltered 8,496 are 1,081 KB raw.

**Payload is not the constraint, because the live server already compresses.** Measured 2026-08-15
against `https://forestlocator.enhanceify.co.uk/data/sites.json`: it returns `Content-Encoding: br`
at **52,064 bytes** for the 527,524-byte file. PRD NFR3 ("under 1 MB so it installs over a weak
connection") is therefore met over the wire with room to spare. That is why a columnar encoding was
rejected: measured at 509 KB raw and 146 KB gzipped on the same set, it does not pay for a decode
step when brotli is already doing ten times better, so this file stays plain JSON. What does grow is
the **offline cache footprint**, which is the thing to watch on a phone rather than transfer size.

**The extract comes from Overpass and not from a Geofabrik `.pbf`**, because the query is ten lines
and the response is 2.3 MB, where a `.pbf` would need an osmium toolchain on a Windows box that has
no build step. The `out count` form is what the filter was developed against, so iterating on it cost
no repeated downloads.

## `app/data/boundary.json` (generated)

The map's basemap. Generated by `scripts/build_boundary.py` from Natural Earth 1:10m map subunits
(public domain); **never hand-edited**, same rule as `sites.json`.

| Field | Type | Notes |
|---|---|---|
| `generated_at` | date | ISO date the file was built |
| `source` | string | Attribution string, rendered nowhere but kept with the data |
| `precision` | int | Fixed-point divisor for the coordinates. Currently `10000`, so 1e-4 deg (~11m) |
| `simplify_tolerance_deg` | number | Douglas-Peucker tolerance used, currently 0.004 (~450m) |
| `vertices` | int | Total retained vertices; a self-test asserts it matches the rings |
| `bbox` | `[minLng,minLat,maxLng,maxLat]` | WGS84, asserted to fall inside Great Britain |
| `parts[]` | array | One per subunit: England, Wales, Scotland, drawn in that order |
| `parts[].name` | string | Subunit name |
| `parts[].rings[]` | array of int arrays | Outer rings only; holes are dropped at this zoom |

**Rings are delta-encoded, not coordinate pairs.** Each ring is a flat integer array
`[x0, y0, dx1, dy1, dx2, dy2, ...]` at `precision` fixed point. Neighbouring coastline points are
close together, so most deltas are one or two digits: about a third of the bytes of the same ring
written as `[lng, lat]` pairs, and it decodes in one pass. `app/map.js` `decodeRing()` is the only
reader; change one and change the other.

Coordinates are WGS84 like everything else, and are projected to Web Mercator at draw time by
`NF.projX` / `NF.projY` rather than being stored projected. Northern Ireland is deliberately absent:
no Forestry England site is within 100 miles of it.
