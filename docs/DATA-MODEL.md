# Data model: NearestForest

_Last updated: 2026-08-15_

The single source of truth for this project's data shape. Every layer (scrape, transform, bundled
JSON, PWA, iOS Shortcut) conforms to this. Anywhere a layer diverges is a bug to close, not a state
to preserve.

Four upstream sources with different shapes are normalised into **one** `Site` record so the PWA and
the Shortcut never branch on provenance. The `source` field is the only thing that tells them apart,
and it exists for display and debugging, not for control flow.

**One record shape, but two files on disk, and that split is a licence boundary rather than a
modelling one.** `app/data/sites.json` holds the Open Government Licence sources (Forestry England
forests and car parks); `app/data/campsites.json` holds the ODbL one (OpenStreetMap, plus Forestry
and Land Scotland's Stay the Night car parks). They are merged into one array in memory at load.
See the campsites section below before changing that.

## Entities

### Site — the canonical record (`data/sites.json`)

| Field | Type | Units | Nullable | Format / notes |
|-------|------|-------|----------|----------------|
| `id` | string | — | no | Stable slug. `fe-<url-slug>` for forests, `cp-<OBJECTID>` for car parks. Never reused. |
| `source` | enum | — | no | `forest` \| `carpark` \| `campsite`. Drives which tab it appears in, nothing else. `campsite` records live in a **different file**; see below. |
| `name` | string | — | no | Display name. For car parks named "Unknown" upstream, see `name_is_derived`. |
| `name_is_derived` | bool | — | no | `true` when we generated the name because upstream had none. Shown in UI as a lighter label so it is never mistaken for an official name. |
| `lat` | number | deg | no | WGS84, EPSG:4326. 7 dp. This is what Navigate uses. |
| `lng` | number | deg | no | WGS84, EPSG:4326. 7 dp. Negative is west. |
| `postcode_satnav` | string | — | yes | The **sat-nav** postcode from the page's "How to find us", not the JSON-LD `postalCode`. These genuinely differ. See DECISIONS 2026-08-08. |
| `postcode_postal` | string | — | yes | JSON-LD `address.postalCode`. Kept for reference, never used for navigation. |
| `address` | string | — | yes | Human-readable single line, assembled from JSON-LD `streetAddress[]` + `addressLocality`. |
| `url` | string | — | yes | Absolute Forestry England page URL. `null` for car parks. |
| `opening_times` | string | — | yes | Free text, as published. Not parsed into a schedule; see below. |
| `opening_summary` | object | — | yes | Best-effort parse. `null` when the free text could not be parsed confidently. Never guessed. |
| `parking` | string | — | yes | Charges and parking notes as published. |
| `facilities` | string[] | — | yes | Normalised lowercase tags, e.g. `["toilets","cafe","cycle hire"]`. Empty array means none found; `null` means not scraped. |
| `category` | string | — | yes | Car parks only, from upstream `category`. Always `Car Parks` in the current cut. |
| `surface` | string | — | yes | Car parks only, from upstream `area_asset_type`, e.g. `Gravel`, `Tarmac`, `Grass`. |
| `status` | enum | — | yes | Car parks only. `Permanent - Official` \| `Permanent - Unofficial` \| `Seasonal - Official` \| `Seasonal - Unofficial` \| `Temporary`. |
| `district` | string | — | yes | Car parks only, upstream `cots_district_id`. |
| `scraped_at` | string | — | no | ISO-8601 date the record's source was last read. Makes staleness visible. |

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

### Runtime-only, never persisted

`distance_mi` (float, miles, great-circle) and `bearing_deg` (float, degrees true, 0 = north) are
computed per render from the live GPS fix. They are deliberately absent from `sites.json` so there is
no stale copy of a position-dependent value on disk.

## Canonical representation

`data/sites.json` — a single UTF-8 JSON file, the only artefact both front ends read.

```json
{
  "generated_at": "2026-08-08",
  "counts": { "forest": 274, "carpark": 630 },
  "attribution": "Contains public sector information licensed under the Open Government Licence v3.0.",
  "sites": [ /* Site records, forests first, each tab already sorted by name */ ]
}
```

- **Coordinates are WGS84 decimal degrees everywhere.** The car park source is EPSG:27700 (British
  National Grid) and is reprojected at build time by requesting `outSR=4326` from the FeatureServer.
  No British National Grid value survives into `sites.json`. A record carrying an easting/northing
  in the six-figure range is a bug, and the build asserts against it.
- **Car park geometry is a polygon upstream**; only its centroid is kept, because you navigate to a
  point. The polygon is discarded.
- **Null means "not known", empty string never appears.** A field that could not be scraped is `null`,
  and the UI renders that as an explicit "not listed" rather than blank space.
- Enums are exactly the values listed above. An unrecognised upstream value fails the build loudly
  rather than being coerced or dropped.

## Known divergences (to close)

- **Car parks have no parent forest.** The open data carries no link back to the forest containing a
  car park, so a car park row cannot say which forest it belongs to. The 170 upstream "Unknown"
  entries currently render as "Unnamed car park" with `name_is_derived: true`, which is honest but
  not helpful. Candidate fix: a nearest-neighbour join against the forest coordinates at build time,
  giving names like "Car park near Friston Forest". Not yet built, and the most valuable next change
  to the dataset.
- **`opening_summary` is forest-only.** Car parks carry `null`, because the open data publishes no
  hours at all. A car park row therefore never shows an open/closed badge, even when the forest it
  sits in does. The nearest-neighbour join above would fix this too.

### Closed

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
  "counts": { "campsite": 3681 },
  "counts_by_country": { "England": 2612, "Scotland": 505, "Wales": 564 },
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
  Measured 2026-08-15: 99 of 3,681 records publish any opening text at all. A badge would be a guess,
  and this project does not guess that a gate is open. A self-test asserts `openState()` returns
  `unknown` for every campsite record.
- **Coordinates are 5 dp, not 7.** Most of these are the centroid of a hand-drawn polygon, so digits
  six and seven would be precision the data does not have. 5 dp is ~1.1 m, and it saved 40 KB.
- **An absent key means "not known".** `sites.json` writes an explicit `null`; this file omits the
  key, because at 3,681 records the nulls were the majority of the bytes. Every consumer tests
  `value == null` or truthiness, which reads the two identically. This is the one place the
  "null means not known" rule is expressed by omission rather than by a literal `null`.

### What is filtered out, and why the count is what it is

From 8,501 OSM elements across the three countries, 3,681 records survive. Every exclusion is
counted and printed by the parser rather than happening quietly:

| Dropped | Count | Why |
|---|---|---|
| no name published | 2,292 | An unnamed dot is unusable in a list read while driving. |
| no explicit caravan or motorhome access | 2,370 | Rob's call, 2026-08-15. An untagged `camp_site` is not evidence that a van can get in. |
| static-caravan holiday park | 129 | You cannot pull a campervan onto a static pitch. Parkdean alone is 58 records. |
| private or no public access | 24 | |
| the same site mapped twice | 42 | OSM maps many campsites as both a node and the surrounding area. Merged by name within **0.5 mi**, a threshold taken from the distribution: 47 same-name pairs sit within 0.3 mi, one at 0.38, one at 0.55, and the next is 1.43 mi. |
| already counted in a neighbouring country | 5 | Border sites returned by two queries. |
| merged into a Stay the Night record | 2 | Where OSM and FLS describe the same tarmac, the first-party record wins, because it carries the scheme rules. |

**The second source is Forestry and Land Scotland's "Stay the Night" scheme**: 44 forest car parks
where a self-contained motorhome or campervan may park overnight, 6pm to 10am, no return within 48
hours. The list page publishes no coordinates, so the 44 slugs are joined to the
`data-forest-search-map` attribute on the destinations index, which carries all 278 destinations with
`latitude`/`longitude`. The whole join costs two requests and matched 44 of 44 on 2026-08-15.

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
