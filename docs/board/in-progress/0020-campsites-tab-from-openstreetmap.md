---
needs: 0016
no_outward_effect: "publishes" in criterion #2 is what OpenStreetMap holds about a campsite, not a deploy
---
# A Campsites tab: where you can pull up a campervan, across England, Scotland and Wales

## Why
Rob asked for it on 2026-08-15, in these words: "add another tab, Campsites — these are places where
you could pull up in a campervan or RV / caravan trailer, want it to work for england scotland and
wales". The app already answers "where is the nearest forest" and cannot answer "where can I sleep
tonight", which is the question a campervan has, and the one that matters most in exactly the
dead-signal places this app was built for.

## Links

**Blocked by**
- `0016` - it measured that the Forestry and Land Scotland destinations index carries every
  destination's coordinates in one HTML attribute, which is how the 44 Stay the Night car parks get
  a position for two requests instead of forty-four.

**Relates to**
- `0004` - the unnamed campsites are the same defect it fixes for car parks, and its
  nearest-named-neighbour trick does not carry over: a campsite's neighbour is not its parent.
- `0015` - the map credit this card adds sits in the same unreadable hint, so that card carries two
  licence obligations rather than one.
- `0001` - its check 5 is the only place acceptance #8 can be closed.
- `0019` - fixed the "Personal use" line this card left standing beside the new ODbL credit.
- `0024` - it cut this card back to its problem, licence rule, acceptance and outcome. The measured
  tag counts, payload figures and the wider filter that was rejected are now in `docs/DATA-MODEL.md`.

## Not this card
Not Northern Ireland or Ireland, despite the stated long-term intent: the boundary outline does not
include Northern Ireland, deliberately, so a record there would rank in a list and vanish on the map.
Not wild-camping spots, not laybys, not `highway=rest_area`. Not a booking link, not availability,
not price comparison — the app is a snapshot and says so. Not merging campsites into `sites.json`;
see below, this is load-bearing. Not a country filter or a country tab, and not a change to what
`source` means. **Not reconciling campsites against the existing car park data**: they overlap in
places, and a fuzzy spatial join fails silently, which is the opposite of how this project is built.

## The licence is different from everything else here, and the file layout has to carry that
OSM is **ODbL**, not OGL, and a GB-wide extract of every campsite is a *Derivative Database*, so it
must be published under ODbL and attributed. **The trap is mixing it into `sites.json`.** ODbL 1.0
§4.5(a) exempts a *Collective Database*, so two independent databases shipped side by side each keep
their own terms; one merged file invites the argument that the OGL forest data became a derivative of
the OSM one, and throws away the clean licence position DECISIONS 2026-08-15 established. So
`campsites.json` is its own file with its own `licence` and `attribution` block, crediting **"©
OpenStreetMap contributors"**, naming the Open Database License and linking to
`openstreetmap.org/copyright`, in the footer and on the map.

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
- [x] `scripts/fetch_campsites.py`: one Overpass POST per country, cached to `data/raw/osm/`,
      zero-request on re-run, failing loudly on the short or empty 200 an Overpass timeout returns.
- [x] `scripts/parse_campsites.py`: centroids for ways and relations, `os-n/w/r<id>` ids, the filter,
      and `app/data/campsites.json` with its own licence and attribution block.
- [x] Fetch the 44 FLS Stay the Night slugs, join them to the `0016` index for coordinates, and carry
      the published 6pm-10am and self-contained rules.
- [x] ~~Widen `LAT_RANGE` in `scripts/parse.py` from England to Great Britain.~~ **Done differently,
      deliberately.** `sites.json` is still England only, so widening its box would loosen a tripwire
      that is correct. The campsite parser and its self-tests carry their own Great Britain box,
      49.5..61.2 N and -8.8..2.2 E. Two datasets, two boxes, each as tight as its own data allows.
- [x] Third tab in `app/index.html`, second file loaded in `app/app.js` / `app/core.js`,
      `./data/campsites.json` in `ASSETS`, `CACHE` and `BUILD` bumped, footer ODbL credit added.
- [x] `scripts/selftest.js`: record count, GB bbox, no open/closed badge, every record named, no
      duplicates, and the OSM attribution string present in `index.html`.
- [x] `docs/DATA-MODEL.md`, `docs/PRD.md` and `docs/DECISIONS.md` updated for the second file, the
      three-tab scope and the offline-cache footprint.
- [x] **Map attribution.** `0015` shipped `.map__hint--attrib`, but its pill shows only while the
      tile layer is on and credits OSM as the *tile* source, so with tiles off the map drew 3,675
      ODbL-derived markers with no credit at all. `NF.mapHint()` in `app/core.js` now decides the
      wording from both facts, and `updateHint()` in `app/map.js` reports which markers are drawn.

## Answered, and built
**Rob chose the shortest cut on 2026-08-15: named and explicitly caravan or motorhome capable.** The
recommendation on this card had been the middle option; the call went the other way, in favour of a
list every row of which is recognisable and true. Widening it later is a one-line change to
`takes_a_van()`. **Shipped:** 3,675 campsites — 2,606 England, 505 Scotland, 564 Wales — including
all 44 Stay the Night car parks, 972 KB on disk and about 150 KB on the wire. Two faults were found
by running it rather than reading it: the same site mapped twice, as an OSM node and as the
surrounding area, fixed by merging same-name records within 0.5 mi and self-tested; and the Stay the
Night rules sitting under a heading about money, relabelled "Overnight rules".

## Comments

### 2026-09-08 review (v20260908093100-03e4)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: defect**

I traced each criterion to code.

**Traced and holding:**
- #1 ÔÇö `app/index.html` Campsites tab button; ranked by the shared `NF.rank` in `app/core.js`.
- #2 ÔÇö `build_osm` in `scripts/parse_campsites.py` sets `opening_summary: None`, `validate` rejects any record that carries one, and `openState` in `app/core.js` returns `unknown` with no label, so no badge.
- #3 ÔÇö `#osm-credit` in `app/index.html` plus the `attribution` / `attribution_url` block written by `main` in `scripts/parse_campsites.py`.
- #4 ÔÇö separate `app/data/campsites.json`, own `licence` block, written by `main`.
- #5 ÔÇö `LAT_RANGE`/`LNG_RANGE` (49.5ÔÇô61.2, ÔêÆ8.8ÔÇô2.2) checked in `validate`; `main` exits non-zero and writes nothing.
- #7 ÔÇö `build_stn` sets `FLS_STN_NOTE` and `access_note`; `openSheet` in `app/app.js` renders it as "Overnight rules".

**Defect ÔÇö #6.** `build_osm` drops `access` of `private`/`no`, scout and static brands, but not `members`. `ACCESS_NOTE` in `scripts/parse_campsites.py` maps `members` to a "Members only" label instead, so the file ships 6 members-only sites (`grep '"access_note":"Members only"' app/data/campsites.json` ÔåÆ 6). The criterion says SHALL NOT list them; labelling is not excluding.

VERDICT: defect

**scope: defect**

Findings for scope only.

**1. Card 0004's work is in this diff.** `scripts/parse.py` has the whole derived-car-park-name feature ÔÇö `unusable_name()`, `GENERIC_NAME`, the `name_is_derived` field ÔÇö plus its UI in `app/app.js` `openSheet()` and the `.sheet__name--derived` rule in `app/app.css`. Card 0020 lists `0004` only under "Relates to" and says its trick "does not carry over". Building it here is over the fence.

**2. Card 0015's work is in this diff too, and the card says it is not done.** `app/app.css` has `.map__hint--attrib` and `app/map.js` toggles it in the tile handler. The card's own last task says "Map attribution still outstanding... It waits on `0015`". So either the tab grew into 0015, or that task line is now false. Both are defects.

**3. Card 0016's Scotland work rides along.** `scripts/fetch.py` and `scripts/parse.py` grew 600 lines for the FLS destinations index, and `app/core.js` now documents 274 England + 276 Scotland URLs. 0016 is a *blocker*, not a deliverable of 0020.

The campsite files themselves (`scripts/fetch_campsites.py`, `scripts/parse_campsites.py`, `app/data/campsites.json`) stay inside the fence, and nothing merges campsites into `sites.json`.

VERDICT: defect

**breakage: defect**

**Findings (breakage lens)**

1. **A comment the change made false.** `openSheet` in `app/app.js` says "the source publishes hours for 99 of 3,723 records". `scripts/selftest.js`, in the campsite block above `ok('no campsite carries a parsed opening summary'...)`, repeats "99 of 3,723". The shipped file holds **3,681** campsites (`app/data/campsites.json` header, and its own `counts_by_country` 2612+505+564). The dedupe step `dedupe_same_site` in `scripts/parse_campsites.py` is what dropped the extra records, so both prose numbers were true before the merge and are false after. The card's own text says 8,496 and 96, a third figure again.

2. **A rule asserted in one place and not the other.** The block "dataset counts carried in prose (card 0036)" in `scripts/selftest.js` exists exactly to fail a run when a hand-written count drifts ÔÇö but it reads only `sites.json` and lists no campsite entry. So the campsite counts drift silently, which is the failure that block was built to stop. Adding one row for the campsite claims closes it.

Nothing else broke: `openState` in `app/core.js` returns `unknown` for every campsite (none carry `opening_summary`), and `rank` filters cleanly by source.

VERDICT: defect

**2026-09-08** RESULT: partial
TESTS: +2 new (one assertion, two prose-count rows), 228 passed, 0 failed
TOUCHED: scripts/parse_campsites.py, scripts/selftest.js, app/app.js, app/sw.js, app/core.js,
app/data/campsites.json, docs/DATA-MODEL.md, docs/DECISIONS.md, docs/HANDOVER.md, docs/PRD.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

Cleared the three defects the review above found, each test-first and each watched red first.

**#6, members-only sites.** `ACCESS_NOTE` mapped `access=members` to a "Members only" label while
`build_osm` dropped only `private` and `no`, so six club sites shipped. Added the assertion `no
campsite is members-only, private, scout or a static-caravan park` to `scripts/selftest.js`, ran it,
watched it name all six by id (`os-w1072961135` and five more), then moved `members` into the drop
list and deleted its label. Re-ran the parser: 3,675 records, England 2,606 / Scotland 505 / Wales
564. The criterion stays ticked because it is now true, not because it was.

**The drifted counts.** `app/app.js` and a `selftest.js` comment both said "99 of 3,723", the file
held 3,681, and the card said 96 of 8,496 — three figures for one fact. The block *card 0036* built
to stop exactly this read `sites.json` only. Added two rows to it for both halves of `app.js`'s
sentence, ran it, watched it fail with `says 99, dataset holds 98 | says 3723, dataset holds 3675`,
then corrected the prose. The `selftest.js` and `parse_campsites.py` comments now carry no number of
their own, so there is one written-down count and it is checked on every run.

**Assumed:** `data/raw/osm/` is not in a worktree (it is gitignored), so I copied the three cached
Overpass responses in from `C:\Dev\NearestForest` read-only rather than re-querying Overpass. The
rebuild therefore reflects OSM's 2026-08-15 snapshot, not today's.

`CACHE` and `BUILD` bumped to `v18-2026-09-08`, because `app/data/campsites.json` changed.

**The review's scope findings do not hold, and nothing was raised for them.** 0004, 0015 and 0016 are
on `main` (`git log main -- scripts/parse.py app/map.js` gives `42876cf`, `b3f5297`, `b542a3f`), so
their work shows up in a diff against an older base rather than in this branch's own changes.

**Still open. #8 needs a person** — a cold offline launch on the device, card 0001 check 5. The
map-attribution task is also still owed: 0015 shipped its pill, but it shows only while tiles are on
and credits OSM as the tile source, so with tiles off the map draws 3,675 ODbL-derived markers with
no credit at all. That is a licence condition, but it is a task rather than a criterion, so it does
not hold a tick back. Nothing here has been seen in a browser: this is a worktree and Herd serves the
main checkout.

**2026-09-08** RESULT: partial
TESTS: +4 new, all green (232 passed, 0 failed)
TOUCHED: app/core.js, app/map.js, app/sw.js, scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

Closed the last open task on this card, the map credit. Nothing else was touched: the seven built
criteria were already true and I re-ran them rather than re-deriving them.

**The map credit.** With the tile layer off, the map drew every campsite marker — the ODbL database
itself — under the hint "Tap a marker for details. Pinch to zoom." 0015's pill was toggled by
`tilesOn` alone and names Thunderforest, so it never covered this. I moved the wording decision out
of `map.js` and into `NF.mapHint(tilesOn, hasOsmMarkers)` in `app/core.js`, which is the file the
suite can actually run; `map.js` only reports which markers are on screen. Tiles on still gives the
Thunderforest line; tiles off with campsites gives "Campsite data © OpenStreetMap contributors,
ODbL"; tiles off with no campsites keeps the plain hint. Both credits get the readable pill, from
`h.credit` rather than from `tilesOn`.

**Watched red first.** The four assertions went in against the old code and failed. Three failed on
missing wiring, so I first added `mapHint` reproducing the *old* behaviour and re-ran, and watched
`with the layer off the OSM markers still carry their credit` fail on its own, for the reason the
task describes, before adding the one line that fixes it.

**Why not in `draw()`.** `draw()` already reads the ranked list, so the hint could be computed there,
but `draw` runs every frame of a pan and that would rewrite the DOM on each. `updateHint()` is called
from `setTiles`, `show` and `refresh` instead; `app.js` fires `refresh` on every render, which is
where a tab change lands.

`CACHE` and `BUILD` bumped to `v19-2026-09-08`, because `app/core.js` and `app/map.js` changed.

**Still open. #8 needs a person**, unchanged: a cold offline launch on the device, card 0001 check 5.
**Nothing here has been seen in a browser** — this is a worktree and Herd serves the main checkout —
so the new pill wants the same phone look the 0004 and 0015 checks want. The wording is asserted by
the suite; how it wraps on a narrow screen is not.

