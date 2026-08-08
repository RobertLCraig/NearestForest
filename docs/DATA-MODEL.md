# Data model: NearestForest

_Last updated: 2026-08-08_

The single source of truth for this project's data shape. Every layer (scrape, transform, bundled
JSON, PWA, iOS Shortcut) conforms to this. Anywhere a layer diverges is a bug to close, not a state
to preserve.

Two upstream sources with different shapes are normalised into **one** `Site` record so the PWA and
the Shortcut never branch on provenance. The `source` field is the only thing that tells them apart,
and it exists for display and debugging, not for control flow.

## Entities

### Site — the canonical record (`data/sites.json`)

| Field | Type | Units | Nullable | Format / notes |
|-------|------|-------|----------|----------------|
| `id` | string | — | no | Stable slug. `fe-<url-slug>` for forests, `cp-<OBJECTID>` for car parks. Never reused. |
| `source` | enum | — | no | `forest` \| `carpark`. Drives which tab it appears in, nothing else. |
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
