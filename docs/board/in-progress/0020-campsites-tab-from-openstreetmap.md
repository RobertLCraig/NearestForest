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

**2026-09-08** RESULT: partial
TESTS: +0 new, all green (232 passed, 0 failed)
TOUCHED: docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**I built nothing, because there was nothing on this card left to build.** Every task is ticked and
every criterion an agent can close is closed. Writing a test here would have been a test first seen
green, which is the thing this card's own thread has twice argued against.

**What I checked rather than assumed.** I re-ran `node scripts/selftest.js` — 232 passed, 0 failed —
and then traced each ticked criterion to a named assertion in `scripts/selftest.js` rather than
taking the two entries above at their word:
- #1 `the Campsites tab exists in the shell` (`data-tab="campsite"` in `index.html`), plus
  `ranking the campsite tab returns only campsites` and `campsite ranking is sorted ascending`.
- #2 `no campsite carries a parsed opening summary` and `no campsite is ever reported open or closed`.
- #3 the `openstreetmap.org/copyright` assertion in the shell block, plus `the campsite file states
  its own licence and attribution`.
- #4 `the OGL file holds no campsite record`.
- #5 is the one worth naming, because it is a *build-fails* criterion and a shipped-data check would
  not prove it. `a failed campsite parse leaves the previous dataset untouched` runs
  `parse_campsites.py` twice in a temp tree, the second time with `lat: 12.3`, and requires a
  non-zero exit with `campsites.json` byte-identical to the clean run. That is the criterion as
  written, not a restatement of it.
- #6 `no campsite is members-only, private, scout or a static-caravan park`.
- #7 `every Stay the Night record carries the scheme rules`.

**The suite is `node scripts/selftest.js`.** There is no `vendor/` in this repository, so
`.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run. No PHP suite is
missing; this project has never had one.

**Nothing raised.** The one fault I found outside the card is that `docs/HANDOVER.md` is 41,505 bytes,
over the ~40 KB the orient hook allows, which the hook reported at session start. Card `0031` in
`ai-review/` already carries exactly that, so raising a second card would have been the duplicate the
board has been cleaning up, not a finding.

**Still open. #8 needs a person**, unchanged and unchangeable from here: aeroplane mode, relaunched
cold from the Home Screen icon, with the Campsites tab tapped into while offline. That is card 0001
check 5 and no run of this loop can close it.

**2026-09-08** RESULT: partial
TESTS: +0 new, all green (232 passed, 0 failed)
TOUCHED: docs/board/todo/0054-the-campsite-cards-raw-feature-count-is-wrong.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: 0054

**Nothing was built, because nothing on this card is buildable.** Seven criteria are met and traced;
#8 needs a person on a phone. Every task is ticked. A test written here would be one first seen
green, which is what this thread has twice refused.

**What I did instead of restating the run above.** I re-ran `node scripts/selftest.js` — 232 passed,
0 failed, working tree clean — and then went after a number rather than re-reading prose. Criterion #2
says "only 96 of 8,496 records carry any opening hours". `docs/HANDOVER.md` says "8,501 features in,
3,675 out". Two figures for one measurement. I counted the `elements` arrays in the three cached
Overpass responses in `data/raw/osm/`: **6,133 England + 905 Scotland + 1,463 Wales = 8,501**. So
HANDOVER is right and this card's own criterion is five out.

**I did not fix it, and that is deliberate.** A session working a card may not reword that card's
criteria, and this is criterion #2's text. Raised as card `0054` instead, which also asks for the
assertion that would have caught it — the `card 0036` prose-count guard in `scripts/selftest.js`
reads `app/data/sites.json` and checks only `app/app.js`, so nothing checks a number written on a
board card. The rule criterion #2 states is correct and unchanged; only its justifying count is wrong,
and #2 stays ticked because what it requires is true.

**The "96" is a second figure and I could not settle it.** It counts raw OSM features carrying any
`opening_hours` tag, which needs a parse rather than an element count, and rebuilding the dataset to
find out would rewrite `app/data/campsites.json` for a number in a comment. Card `0054` carries it.

**The suite is `node scripts/selftest.js`.** There is no `vendor/` in this repository, so
`.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run. This project has
never had a PHP suite.

**`docs/HANDOVER.md` is still over the orient hook's ~40 KB budget**, reported again at session start.
Card `0031` in `ai-review/` already carries exactly that, so no second card was raised.

**Nothing here has been seen in a browser.** This is a worktree and Herd serves the main checkout.

**2026-09-08** RESULT: partial
TESTS: +0 new, all green (232 passed, 0 failed)
TOUCHED: docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Nothing was built.** Seven criteria are met, every task is ticked, and #8 needs a person on a
phone. A new test here would be one first seen green, which this thread has now refused three times.

**What I went after instead of restating the runs above.** Criterion #8 is "still works fully
offline with the larger dataset". Only a person can close it, but it has a mechanical half — the
campsite file has to be *in* the precache before any device check can succeed — and I checked
whether the suite actually asserts that rather than assuming the earlier entries covered it. It
does: `./data/campsites.json` is in `ASSETS` in `app/sw.js` (line 18), `scripts/selftest.js` asserts
`the campsite dataset is precached`, and the `precached file exists:` loop reads the parsed `ASSETS`
list, so the file is proved present on disk as well as named. So the failure mode where the tab
works on the sofa and dies in a car park is already fenced. What is *not* fenced, and cannot be, is
whether iOS keeps 1.7 MB of cache across a cold relaunch — which is the exact bug 2026-08-08 found
by running it, and the reason #8 exists as a human check.

**Suite:** `node scripts/selftest.js`, 232 passed, 0 failed, tree clean. There is no `vendor/` in
this repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not
run. This project has never had a PHP suite.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. No run of this loop can close it.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (233 passed, 0 failed)
TOUCHED: scripts/parse_campsites.py, scripts/selftest.js,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the untested half of criterion #2.** The five entries above all traced #2 to the
open/closed badge, which is only its second clause. Its first clause — "state only what its source
publishes, and say `not known` for every field the source is silent on" — had no assertion for
campsites at all. The Scottish-forest block has one (`a silent field is null, never an empty
string`, `scripts/selftest.js`), and the campsite block does not. Null renders as "not known"; an
empty or whitespace-only string renders as blank space, which a reader takes for a published answer.

**Why the shipped file could not prove it, and what I did instead.** Today's extract holds zero
blank or untrimmed string fields, so an assertion over `app/data/campsites.json` would have been
green from birth — the thing this thread has refused three times. `build_osm` in
`scripts/parse_campsites.py` read `addr:postcode`, `opening_hours`, `operator` and `phone` straight
off the OSM tag dict with no strip and no emptiness guard, and OSM is edited by anybody and does
carry empty tag values, so the guarantee rested on the extract rather than on the parser. The new
assertion `a blank OSM tag becomes null, never an empty string` therefore goes in the temp-tree
block beside `a failed campsite parse leaves the previous dataset untouched`: it feeds the parser a
node whose tags are `'  '`, `''`, `' '` and `'\t'`, runs it, and reads the record back out of the
written file.

**Watched red first.** It failed against the old parser naming all four fields —
`postcode_satnav="  ", opening_times="", operator=" ", phone="\t"` — which is the criterion's own
failure, not a missing symbol. Fixed with one helper, `tag(tags, *keys)`, returning the first tag
carrying text, stripped, or `None`; `address` and `url` were already guarded and are asserted too so
that stays true.

**No `CACHE` / `BUILD` bump, and that is the point.** I re-ran `python scripts/parse_campsites.py`
against the cached Overpass responses in `data/raw/osm/` — 3,675 records, England 2,606 / Scotland
505 / Wales 564 — and `app/data/campsites.json` came back byte-identical. Nothing under `app/`
changed, so nothing needed bumping. The parser now guarantees what the data happened to be.

**Suite:** `node scripts/selftest.js`, 233 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget; card `0031` in `ai-review/` already carries it.

**Nothing here has been seen in a browser.** This is a worktree and Herd serves the main checkout.
The change is parser-side and shipped no bytes, so there is nothing new to look at, but #8's device
check is unchanged and still owed.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (234 passed, 0 failed)
TOUCHED: scripts/selftest.js,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the untested half of criterion #7.** The criterion is "WHEN an FLS Stay the Night car park
is listed, THE APP SHALL say that it is overnight-only between 6pm and 10am and that it requires a
self-contained vehicle." `every Stay the Night record carries the scheme rules` asserts that the
*data* holds both sentences, in `parking`. Nothing asserted that the *app* says them, which is what
the criterion is about. `openSheet` in `app/app.js` renders them, and this card's own "Answered, and
built" section records that they first shipped under the heading "Charges" and were relabelled
"Overnight rules" — so the failure is not hypothetical, it happened here, and after the fix nothing
guarded it.

**Why the label is the whole thing.** On every other campsite `parking` is a price. On a Stay the
Night car park it is the rule that gets somebody fined. The field text is identical either way; the
heading is the only thing that tells a reader which they are looking at, so a regression is silent
in the data and invisible to every existing assertion.

**Watched red first, and made red honestly.** The new assertion `the detail sheet gives a Stay the
Night car park its own rules heading, not "Charges"` reads `app/app.js` and requires the
`site.stay_the_night` branch. I ran it against a deliberately reverted `openSheet` — the ternary
collapsed back to the single `field('Charges', ...)` line the card had before the relabel — and
watched it fail on that, which is the criterion's own failure rather than a missing symbol. Then I
restored the line and re-ran: 234 passed, 0 failed. It reads source text, the same shape card 0004's
`the detail sheet marks a derived name` uses, because `app.js` is DOM-only and this suite has no
DOM.

**No `CACHE` / `BUILD` bump.** `app/app.js` ends the run byte-identical to how it started; the only
file changed is `scripts/selftest.js`, which is not served.

**What I checked and did not act on.** I traced two paths that could have dropped an STN record's
rules and both are already safe: `dedupe_same_site` runs over the OSM list *before* `build_stn`'s
records are added (`main`, `scripts/parse_campsites.py`), so the "richest record wins" sort can
never discard a Stay the Night record; and `dedupe` keeps the FLS record over an OSM twin on
purpose, with the reason in its docstring. `field()` renders a row even for a null value, so there
is no silent-omission path either. No card raised, because there is no fault.

**Suite:** `node scripts/selftest.js`, 234 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (235 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the three-quarters of criterion #6 that nothing was watching.** #6 names four kinds of
site: members-only, private, scout and static-caravan. The only assertion covering it, `no campsite
is members-only, private, scout or a static-caravan park`, reads `access_note` text out of the
shipped `app/data/campsites.json`. That catches exactly one failure — the one that happened here on
2026-09-08, where `access=members` was labelled rather than dropped — and it is blind to the other
three by construction: **a record the parser correctly drops leaves no text to match on, so a record
it wrongly keeps ships with `access_note: null` and matches nothing either.** Removing the scout
drop or `looks_static()` would put scout camps and Parkdean holiday parks in the list under green.

**Watched red, and watched the old assertion stay green beside it.** The new assertion `a
members-only, private, scout or static-caravan site never reaches the file` goes in the temp-tree
block beside `a blank OSM tag becomes null`. It feeds the parser six sites the criterion forbids —
`access=private`, `access=members`, `scout=yes`, `group_only=yes`, `permanent_camping=only` and a
`Parkdean Resorts` operator — plus one ordinary campsite, and requires only the ordinary one in the
written file. I ran it against a parser with the scout and static drops collapsed to `if False:`.
The old assertion reported **PASS**; the new one failed naming `os-n13, os-n14, os-n15, os-n16`.
That is the criterion's own failure and the proof the gap was real, not a missing symbol. Restored
the two drops and re-ran: 235 passed, 0 failed.

**Why a fixture rather than the shipped file.** Today's extract holds none of these records, because
the parser drops them, so any assertion over `campsites.json` for scout or static is green from
birth — the thing this thread has refused four times. The parser is the only place the guarantee can
be made, so the parser is where it is tested. `access=members` is kept in the fixture on purpose so
the new assertion covers all four kinds the criterion names, not just the three the old one missed.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started (`git diff --stat` shows `scripts/selftest.js` only) and nothing under `app/` changed.

**Suite:** `node scripts/selftest.js`, 235 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 228 self-tests pass, measured
2026-09-08; three runs on this card have added assertions since and it is 235. Not a run report —
HANDOVER's header forbids those — just a fact that had drifted.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (236 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the gap in criterion #1, which nothing was watching.** #1 is "THE APP SHALL offer a third
tab, Campsites, ranked by distance from the current fix exactly as the other two are." Three
assertions were traced to it by an earlier entry on this thread: `the Campsites tab exists in the
shell`, `ranking the campsite tab returns only campsites` and `campsite ranking is sorted ascending`.
The first proves the button. **The other two prove `NF.rank`, not the app**, because the line above
them is `NF.rank(sites.concat(camps), ...)` — the suite builds the merged array itself. Nothing
asserted that the *shell* fetches `data/campsites.json` and concatenates it into the list `rank`
reads. Delete either line in `app/app.js` and the button still exists, the file still ships, every
campsite assertion still passes, and the tab renders empty.

**Watched red, and watched the rest stay green beside it.** The new assertion `the shell fetches the
campsite file and merges it into the ranked list` reads `app/app.js` and requires both
`loadJson('data/campsites.json')` and `DATA.sites = DATA.sites.concat(CAMP.sites)`. I ran it against
an `app.js` with the concat line replaced by a comment: **235 passed, 1 failed**, and the one failure
was the new assertion. Every other campsite check reported PASS with the tab wired to nothing, which
is the proof the gap was real rather than a missing symbol. Restored the line and re-ran: 236 passed,
0 failed.

**Why source text rather than a run.** `app.js` is DOM-and-`fetch` only and this suite has no DOM, so
this is the same shape card 0004's `the detail sheet marks a derived name` and this card's own Stay
the Night heading assertion use. The merge is also the one place #4 permits the two databases to
meet, so pinning the exact expression guards the licence boundary as well as the tab.

**No `CACHE` / `BUILD` bump.** `app/app.js` ends the run byte-identical to how it started;
`git status` shows `scripts/selftest.js` only, and nothing under `app/` changed.

**Suite:** `node scripts/selftest.js`, 236 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 235 self-tests, which this run
made 236. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (237 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the gap in criteria #3 and #4 that nothing was watching.** #3 names three things — credit
OpenStreetMap, state the Open Database License, and **link to `openstreetmap.org/copyright`** — and
#4 says each file carries its own licence statement. One assertion covered the campsite file: `the
campsite file states its own licence and attribution`, which matches `/ODbL/` on `licence` and
`/OpenStreetMap/` on `attribution` in the shipped `app/data/campsites.json`. **It never looks at
`attribution_url` at all**, so #3's third clause was untested on the artefact that most needs it,
and it reads a file that already happens to be right, so it is green from birth.

**Why the file, and not just the footer.** The `index.html` credit is asserted and holds. But
`campsites.json` *is* the Derivative Database, and the whole Collective Database argument this card
rests on is that the two files travel independently. A copy of `campsites.json` on its own has to
carry its own notice; the shell's footer does not follow it anywhere.

**Watched red, and watched the old assertion stay green beside it.** The new assertion `every
campsite file the parser writes carries the full ODbL notice` goes in the temp-tree block beside `a
members-only, private, scout or static-caravan site never reaches the file`, because the guarantee
belongs to the parser rather than to today's output. It reads the header back out of a file the
parser wrote in the temp tree and requires `ODbL` in `licence`, `© OpenStreetMap contributors` and
`Open Database License` in `attribution`, and `attribution_url` to be exactly the copyright URL. I
ran it against a `parse_campsites.py` with `attribution_url` deleted and the wording shortened to
"OSM data": **236 passed, 1 failed**, and the old assertion reported **PASS**. That is the
criterion's own failure and the proof the gap was real rather than a missing symbol. Restored the
two lines and re-ran: 237 passed, 0 failed.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started — `git status` shows `scripts/selftest.js` and the two documents only — and nothing under
`app/` changed.

**Suite:** `node scripts/selftest.js`, 237 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 236 self-tests, which this run
made 237. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (238 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the last unwatched clause of criterion #2, the rendering half.** #2 has two clauses. The
badge clause is covered twice over. The first clause — "state only what its source publishes, and
say `not known` for every field the source is silent on" — was covered as far as the **parser** by
`a blank OSM tag becomes null, never an empty string`, added on this thread. That proves the data is
null. **Nothing asserted what the detail sheet does with a null.** `field()` in `app/app.js` is the
only place the promise is kept, and no assertion reached it: `is-missing` appeared nowhere in the
suite, only in `app/app.css`. Campsite records are mostly nulls, so this is the field the criterion
is about, not an edge.

**Why a blank is worse than it sounds.** A `<dd></dd>` under "Charges" is a blank line beside a
label, and a reader takes that for a published answer — free — rather than for silence. That is the
exact failure #2 names, and it is one line of diff away in a function nothing was watching.

**Behaviour, not spelling.** The two source-text assertions already on this card grep `app.js`
because it is DOM-only. `field()` is not: it depends on `esc` alone, so the new assertion `a field
the source is silent on is named as unknown, never left blank` lifts both functions out of the
`app.js` source with `new Function` and **runs the shipped code**, over three cases — a null, an
empty string, and a null with a per-field `missing:` message.

**Watched red, and watched the rest stay green beside it.** I replaced the missing branch of
`field()` with `'<dd></dd>'` and ran the suite: **237 passed, 1 failed**, the one failure being the
new assertion. Every other campsite assertion reported PASS with the sheet rendering blanks, which
is the proof the gap was real rather than a missing symbol. Restored the line and re-ran: 238
passed, 0 failed.

**One limit of the harness, said plainly.** The extraction regex first ended `\n\}\n` and threw on a
null match rather than failing an assertion, because `app/app.js` is CRLF; fixed to `\r?\n\}\r?\n`
before the red run above, so the red I watched was the criterion's own failure and not that. The
assertion is coupled to `field()` keeping its exact signature line: rename it and the suite throws
rather than fails, which is loud but not informative.

**No `CACHE` / `BUILD` bump.** `app/app.js` ends the run byte-identical to how it started —
`git status` shows `scripts/selftest.js` and the two documents only — and nothing under `app/`
changed.

**Suite:** `node scripts/selftest.js`, 238 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 237 self-tests, which this run
made 238. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (239 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the unwatched half of criterion #5.** #5 says two things: fail the build on a coordinate
outside Great Britain, **and** do it "with the bounding box widened from England to GB rather than
removed". The first half is proved by `a failed campsite parse leaves the previous dataset
untouched`, which feeds the parser `lat: 12.3`. **Nothing proved the second half.** A box that is
too *narrow* fails in the opposite direction, and every assertion on this card is blind to it: a
build that wrongly refuses a real Scottish campsite writes no file, and every check over
`app/data/campsites.json` reads the last good file, which is already inside whatever box you like.

**Watched red, and watched the rest stay green beside it.** The new assertion `the box reaches the
whole of Great Britain, not just England` goes in the temp-tree block. It feeds the parser the two
corners the widening exists for — Shetland at 60.15N and the Outer Hebrides at −7.0E — in the
Scotland extract, and requires exit 0 with both records written. I ran it against `LAT_RANGE`
narrowed to `(49.5, 57.0)`: **238 passed, 1 failed**, the one failure being the new assertion,
naming `os-n21 lat 60.15 outside Great Britain` and `os-n22 lat 57.9 outside Great Britain`. That
is the criterion's own failure, not a missing symbol. Restored `(49.5, 61.2)` and re-ran: 239
passed, 0 failed.

**Why 57.0 and not the real England box.** Narrowing to England proper (about 56.2N) would also
have failed the *existing* Stay the Night fixture at 56.0N, so the red would have been noisy and
would not have shown that the new assertion is the only thing watching. 57.0 leaves every older
fixture inside the box and isolates the failure to the far north, which is the point.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started; `git status` shows `scripts/selftest.js` and the two documents only, and nothing under
`app/` changed. `writeOsm()` in the harness took an optional second argument so a fixture can be
placed in the Scotland extract, since a campsite's `country` comes from which query returned it.

**Suite:** `node scripts/selftest.js`, 239 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 238 self-tests, which this run
made 239. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (240 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the third clause of criterion #3, which nothing could distinguish from its own failure.**
#3 names three obligations: credit OpenStreetMap, state the Open Database License, and **link to
`openstreetmap.org/copyright`**. One assertion covered the shell, `the app credits OpenStreetMap and
names the licence`, and it tests that third clause with a bare substring match on the address.
**A substring match cannot tell a link from a printed URL.** Write the address out as plain text in
the footer and that assertion stays green while nothing on the page is tappable. On a phone, in a
car park, an unclickable URL does not discharge a licence obligation: there is no address bar to
paste it into and no signal to load it with.

**Watched red, and watched the old assertion stay green beside it.** The new assertion `the
OpenStreetMap credit is a real link, not a printed URL` requires the copyright URL to appear as an
anchor's `href`. I ran it against an `index.html` whose `#osm-credit` paragraph had the `<a>` reduced
to plain text with the URL printed in brackets: **239 passed, 1 failed**, the one failure being the
new assertion, and `the app credits OpenStreetMap and names the licence` reported **PASS** with no
link on the page at all. That is the criterion's own failure and the proof the gap was real rather
than a missing symbol. Restored the anchor and re-ran: 240 passed, 0 failed.

**Why the footer and not the map hint.** The map pill (`OSM_CREDIT` in `app/core.js`) carries the
credit and the licence name but no link, deliberately — a pill drawn over a canvas is not somewhere
to put an anchor. The footer is where #3's third clause is discharged, so the footer is where it is
pinned.

**What I looked at and left alone.** `NF.mapHint(true, true)` — tiles on *and* campsite markers
drawn — is the one corner of that function with no assertion of its own, and it returns the
Thunderforest line, which names OpenStreetMap but not ODbL. I did not add a test, because it is not
unwatched: `provider attribution is present` greps `core.js` for both provider names on one line,
which is `TILE_CREDIT` itself, so shortening that string already fails the suite. And the wording of
that corner is a decision this card's own thread recorded ("Tiles on still gives the Thunderforest
line"), not a gap.

**No `CACHE` / `BUILD` bump.** `app/index.html` ends the run byte-identical to how it started;
`git status` shows `scripts/selftest.js` and the two documents only, and nothing under `app/`
changed.

**Suite:** `node scripts/selftest.js`, 240 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 239 self-tests, which this run
made 240. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (241 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the half of criterion #5 that is a second number.** #5 says "WHEN a record's
**coordinates** fall outside Great Britain" — and a coordinate is a latitude *and* a longitude.
Every assertion this card has accumulated watches the latitude only: `a failed campsite parse
leaves the previous dataset untouched` feeds `lat: 12.3`, and `the box reaches the whole of Great
Britain, not just England` proves the lat box is not too tight. **`LNG_RANGE` was checked by
`validate()` and by nothing else.**

**Why it is not a hypothetical.** An unprojected British National Grid easting is a large number and
the latitude box catches it, which is the failure the box was written for. The failure it does *not*
catch is a record at a perfectly British latitude and a continental longitude — what an Overpass
`area` id resolving to the wrong relation returns. Nothing in the pipeline would have said a word.

**Watched red, and watched everything else stay green beside it.** The new assertion `a longitude
outside Great Britain fails the build as well as a latitude` goes in the temp-tree block beside the
latitude one. It feeds the parser `lon: 10.0` at `lat: 54.0` and requires a non-zero exit with the
previous `campsites.json` byte-identical. I ran it against a `parse_campsites.py` whose `LNG_RANGE`
branch was collapsed to `if False:`: **240 passed, 1 failed**, the one failure being the new
assertion, reporting `parse_campsites.py exited 0 on lng 10.0, which is Germany`. Every other
assertion on this card reported PASS with the longitude guard deleted, which is the proof the gap
was real rather than a missing symbol. Restored the branch and re-ran: 241 passed, 0 failed.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started — `git status` shows `scripts/selftest.js` and the two documents only — and nothing under
`app/` changed.

**Suite:** `node scripts/selftest.js`, 241 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 240 self-tests, which this run
made 241. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (242 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the half of criterion #7 that watched a file rather than the pipeline.** #7 has two
assertions on this thread. `every Stay the Night record carries the scheme rules` reads the
**committed** `app/data/campsites.json`, so it is a statement about a file already in the
repository, not about the code that makes one. `the detail sheet gives a Stay the Night car park its
own rules heading` greps `app/app.js` for the label. **Neither runs the parser.** Every other
criterion on this card has had its parser guarantee pinned in the temp-tree block — #2, #3, #4, #5
and #6 all now do — and #7 was the last one left resting on today's output.

**Measured, not argued.** I set `"parking"` to `None` in `build_stn` (`scripts/parse_campsites.py`)
and ran the suite: **241 passed, 0 failed**. A parser that ships Stay the Night car parks with no
overnight window and no self-contained-vehicle rule is fully green today. The rules would vanish on
the next re-fetch, in a file nobody re-reads, and the first sign of it would be somebody fined in a
car park at 11am.

**Watched red, and watched the three old ones stay green beside it.** The new assertion `the parser
puts the Stay the Night rules on every record it builds` goes in the temp-tree block and reads the
`test-stn` fixture back out of the file the parser wrote there. Against the broken `build_stn` it
failed with `parking=undefined -- it must state the 6pm to 10am window and the self-contained-vehicle
rule`, which is the criterion's own failure and not a missing symbol, while `the Stay the Night car
parks are present`, `every Stay the Night record carries the scheme rules` and the sheet-heading
assertion all reported **PASS**. Restored `FLS_STN_NOTE` and re-ran: 242 passed, 0 failed.

**Why the fixture already existed and nothing read it.** The temp tree has written a
`stay-the-night.json` with one car park since the first parser test on this card, so the STN record
has been built on every run of that block and simply never asserted on. This adds no fixture; it
reads the one that was already there.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started — `git status` shows `scripts/selftest.js` and the two documents only — and nothing under
`app/` changed.

**Suite:** `node scripts/selftest.js`, 242 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 241 self-tests, which this run
made 242. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +0 new, all green (242 passed, 0 failed)
TOUCHED: docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Nothing was built, and this time that is a finding rather than a shrug.** Every clause of every
criterion #1 to #7 now has **two** assertions: one over the shipped artefact, and one that runs the
parser or the shipped app code. I re-walked all seven clause by clause against `scripts/selftest.js`
before concluding it, and the last runs on this thread closed the last gaps — #5's longitude, #3 and
#4's parser-written notice, #7's pipeline guarantee. There is no clause left whose test could be
written and watched fail. Writing one anyway would be a test first seen green, which this thread has
now refused five times.

**What I checked that the suite cannot check, and that no entry above had checked.** Nothing in the
suite proves the committed `app/data/campsites.json` is what today's `scripts/parse_campsites.py`
actually produces. `data/raw/` is gitignored, so a reproducibility check cannot live in a suite that
has to run from a clean clone. Every assertion over the shipped file therefore trusts that the file
and the parser have not drifted apart — and three runs on this thread have edited that parser. So I
did it by hand: hashed `app/data/campsites.json`, ran `python scripts/parse_campsites.py` against
the cached Overpass responses, and hashed again. **Byte-identical** — SHA-256 `44AD13FB...FBA3FC`
before and after, 3,675 records, England 2,606 / Scotland 505 / Wales 564. So the file the app ships
is the file the tested parser makes, and the seven ticked criteria hold on the artefact as well as
on the code.

**I did not turn that into an assertion, deliberately, and this is the harness limit stated
plainly.** The check needs the three Overpass responses under `data/raw/osm/`, which are gitignored
by design — 142 MB of scrape cache stays out of a repo the server pulls on every deploy. A suite
assertion would either fail on any clean checkout or skip itself silently, and a self-skipping test
is exactly the blindness this board keeps finding. It belongs in the refresh procedure, not in
`selftest.js`, and "What's next" item 2 already sends a re-fetch through both parsers.

**No `CACHE` / `BUILD` bump.** The parser re-run left `app/data/campsites.json` byte-identical, so
nothing under `app/` changed and `git status` shows this card only.

**Suite:** `node scripts/selftest.js`, 242 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — and this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (243 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the half of criterion #4 that is the licence boundary itself.** #4 says the build must
"keep OSM-derived records in a file separate from the OGL-derived `sites.json`". Two assertions
were traced to it. `the campsite file states its own licence and attribution` and the parser-side
`every campsite file the parser writes carries the full ODbL notice` both cover the *second* clause,
the licence statements. The **separation** clause had one guard, `the OGL file holds no campsite
record`, and it reads the `app/data/sites.json` **already committed in this repository** — a file
that is correct today and cannot become wrong without a rebuild. Nothing anywhere ran the campsite
parser and checked what it did to the OGL file.

**Why that is the gap that matters on this card.** The card's own "Not this card" calls merging into
`sites.json` load-bearing, and DATA-MODEL says "do not tidy the two files into one". That tidy is a
few lines in `main` of `scripts/parse_campsites.py`. It would run fully green, and the first sign of
it would be a `sites.json` in a commit — the ODbL/OGL Collective Database argument this whole card
rests on, lost silently.

**Watched red, and watched the old assertion stay green beside it.** The new assertion `a campsite
build never writes into the OGL file` goes in the temp-tree block. It writes a small OGL
`sites.json` into the temp tree — which had none, so the parser could previously do anything it
liked there unobserved — runs the parser, and requires the file byte-identical afterwards. I ran it
against a `parse_campsites.py` that appended its records to `app/data/sites.json` after writing
`campsites.json`: **242 passed, 1 failed**, the failure being the new assertion, reporting
`parse_campsites.py rewrote app/data/sites.json, merging two licences into one file (233 bytes ->
1046 bytes)`. `the OGL file holds no campsite record` reported **PASS** with the merge in place,
which is the criterion's own failure and the proof the gap was real rather than a missing symbol.
Reverted the parser and re-ran: 243 passed, 0 failed.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started — `git status` shows `scripts/selftest.js` and the two documents only — and nothing under
`app/` changed.

**Suite:** `node scripts/selftest.js`, 243 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 242 self-tests, which this run
made 243. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — and this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +0 new, all green (243 passed, 0 failed)
TOUCHED: scripts/parse_campsites.py, scripts/selftest.js,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Found a real defect in criterion #2 by reading the parser rather than the assertion list, and
fixed it.** The entry above added `a blank OSM tag becomes null, never an empty string` and put
`parking` in its `blankKeys` array — but **the fixture never sets a `fee` tag**, so that key was
listed and never exercised. `blankRec['parking']` was `undefined`, `undefined == null` is true, and
the assertion passed on a field it had never once made the parser produce. A key named in a check is
not a key the check covers.

**The defect it was hiding.** `fee_text()` in `scripts/parse_campsites.py` is the one free-text
field that does **not** go through `tag()`, deliberately: it passes an unrecognised value straight
through, because plenty of records publish an actual price and the app should show it as published.
That pass-through had no strip and no emptiness guard, so `fee="  "` — and OSM is edited by anybody
and does carry blank tag values — reaches `app/data/campsites.json` as `parking: "  "`. `field()` in
`app/app.js` treats only `null` and `''` as missing, so a whitespace fee draws `<dd>  </dd>`: a
blank line under the heading **"Charges"**. On a campsite that reads as *free*, which is exactly the
failure #2's first clause names, and it is a claim about somebody else's money.

**Watched red first, for the criterion's own reason.** I added `fee: '  '` to the existing blank-tag
fixture and ran the suite before touching the parser: **242 passed, 1 failed**, the failure being
`a blank OSM tag becomes null, never an empty string — parking="  "`. That is the field naming
itself, not a missing symbol. Then `fee_text` was changed to read `tag(tags, "fee")` instead of
`tags.get("fee")` — one line, reusing the helper an earlier run on this thread added for exactly
this — and re-ran: 243 passed, 0 failed.

**No new assertion, and that is the honest count.** The check that needed writing already existed;
what it lacked was an input. So `TESTS:` says +0 new, the suite is still 243, and `docs/HANDOVER.md`
needs no number corrected this time.

**No `CACHE` / `BUILD` bump, proved rather than assumed.** Today's extract carries no blank or
untrimmed `fee`, so I re-ran `python scripts/parse_campsites.py` against the cached Overpass
responses and hashed the output either side: SHA-256 `44AD13FB...FBA3FC` before and after,
**byte-identical**, 3,675 records, England 2,606 / Scotland 505 / Wales 564. Nothing under `app/`
changed. The parser now guarantees what the data merely happened to be — the same shape as the
blank-tag fix itself.

**Assumed:** `data/raw/osm/` is gitignored and absent from a fresh worktree, so the three cached
Overpass responses were read from `C:\Dev\NearestForest`. The rebuild therefore reflects OSM's
2026-08-15 snapshot, not today's.

**What I tried and could not do.** Every entry on this thread says nothing has been seen in a
browser. I served this worktree — `php -S 127.0.0.1:8791 -t app`, which returned 200 for both the
shell and `data/campsites.json` — but **the browser-driving tools are not permitted in this
session**, so no page was loaded and no screenshot taken. The server was stopped again. That gap is
unchanged and still owed: the Campsites tab has never been looked at on a screen from this card.

**Suite:** `node scripts/selftest.js`, 243 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5.

**2026-09-08** RESULT: partial
TESTS: +3 new, all green (246 passed, 0 failed)
TOUCHED: app/core.js, app/app.js, app/sw.js, scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Found a real defect in criterion #2 by reading the sheet rather than the assertion list, and fixed
it.** The "Data checked" row in `openSheet` read
`site.scraped_at || (site.source === 'campsite' && CAMP ? CAMP.generated_at : null)`.
`CAMP.generated_at` is **OpenStreetMap's snapshot date** — `main` in `scripts/parse_campsites.py`
sets it to the max `timestamp_osm_base` across the three Overpass responses. `build_stn` sets
`scraped_at: None` on every Stay the Night car park, deliberately, because `fetch_campsites.py`
records no date for the FLS pages at all. So the fallback fired on exactly the 44 records it must
not, and each one told the reader "Data checked: 2026-08-15" — a date OSM published about OSM,
presented as Forestry and Land Scotland's. Measured, not argued: `node -e` over the shipped
`app/data/campsites.json` gives 44 STN records, **0** carrying `scraped_at`, and `generated_at`
`2026-08-15`.

**Why it is criterion #2 and not tidiness.** #2 is "state only what its source publishes, and say
`not known` for every field the source is silent on". The parser's null was the source being silent;
the app filled it in. And "Data checked" is the one field a reader consults to decide whether to
trust the row — a Stay the Night car park is exactly the row somebody drives to at 9pm.

**The decision moved to `core.js`, which is the project convention and the only way to test it.**
`NF.dataChecked(site, camp)` now decides; `app.js` calls it. Same shape this card's own `NF.mapHint`
entry used, for the same reason: `app.js` is DOM-only and the suite has no DOM.

**Watched red, honestly.** Two of the three new assertions would have failed on a missing symbol, so
I first added `dataChecked` **reproducing the old behaviour** and ran the suite: **244 passed, 2
failed**, and the failure that matters — `a Stay the Night car park is not given OpenStreetMap's
data-checked date` — failed on the criterion's own fault, with the function present and returning
`2026-08-15`. Then one condition (`&& !site.stay_the_night`) and re-ran: 246 passed, 0 failed. The
second assertion pins what must *not* change, that an OSM record still reports its snapshot; the
third pins the wiring, so deleting the call and restoring the inline expression fails.

**`CACHE` and `BUILD` bumped to `v20-2026-09-08`**, because `app/core.js` and `app/app.js` changed.
`app/data/campsites.json` did not: this is a rendering fix, the parser is untouched, and no record
gained or lost a field.

**Suite:** `node scripts/selftest.js`, 246 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Nothing here has been seen in a browser** — this is a worktree and Herd serves the main checkout —
and the changed row wants a look on the phone alongside the other deploy checks: a Stay the Night
sheet should now read "Data checked / Not listed" rather than a date.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5.
