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
`takes_a_van()`. **Shipped:** 3,575 campsites — 2,525 England, 496 Scotland, 554 Wales — including
all 44 Stay the Night car parks, 944 KB on disk and about 150 KB on the wire. Two faults were found
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

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (247 passed, 0 failed)
TOUCHED: scripts/parse_campsites.py, scripts/selftest.js, app/app.js, app/core.js, app/sw.js,
app/data/campsites.json, docs/DATA-MODEL.md, docs/DECISIONS.md, docs/HANDOVER.md, docs/PRD.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Found two scout sites shipping under criterion #6, and dropped them.** #6 names four kinds of
site the app must not list, and both assertions covering it watch the `scout` **tag**: the shipped
file check reads `access_note` text, and the fixture on this thread feeds a node tagged
`scout=yes`. Neither can see the failure that was actually in the data, because **OSM's `scout` tag
is sparsely applied**. Measured over the three cached Overpass responses: 89 of 8,501 elements carry
it, and the counter for that drop rule printed **0** — every element carrying the tag had already
gone at an earlier rule. So the rule was live and catching nothing.

**Measured, not argued.** `os-w127724548` "Rolleston Scout Group Caravan Park" carries exactly two
tags, `name` and `tourism=caravan_site`. `os-w145180506` "South London Scout Centre" carries
`caravans=yes` and a `southlondonscouts.org.uk` website. Both shipped in `app/data/campsites.json`,
both are somewhere a passing campervan cannot pull up for the night, and both are the criterion's
own words rather than an inference from them. The static-caravan drop already reads the name and
operator for this exact reason; the scout drop did not.

**Watched red, and watched both old scout assertions stay green beside it.** The new assertion `a
site named as a scout site is dropped even when it carries no scout tag` goes in the temp-tree block
and feeds the parser the two real shapes plus a scout-operator one. It failed against the current
parser naming `os-n17, os-n18, os-n19`, while `no campsite is members-only, private, scout or a
static-caravan park` and `a members-only, private, scout or static-caravan site never reaches the
file` both reported **PASS** — the criterion's own failure, not a missing symbol.

**Why the word and not the letters.** `Scoutscroft` and `Scoutscroft Touring` in Coldingham are
commercial holiday parks anyone may book, and a substring match drops them. So `SCOUT_RE` is
`\bscouts?\b`, and the fixture keeps a `Scoutscroft Touring` record that the assertion requires to
survive — a match that is too wide fails it just as loudly as one that is too narrow.

**`CACHE` and `BUILD` bumped to `v21-2026-09-08`**, because the rebuild changed
`app/data/campsites.json`: **3,673 records, England 2,604 / Scotland 505 / Wales 564**, down two.
The `card 0036` prose-count guard did its job unprompted — it failed with `app/app.js: says 3675,
dataset holds 3673` before I had touched any prose — so the corrected counts in `app/app.js`,
`docs/HANDOVER.md`, `docs/DATA-MODEL.md`, `docs/PRD.md`, `docs/DECISIONS.md` and this card's own
"Answered, and built" line are checked rather than asserted. `DATA-MODEL`'s exclusion table gained
the scout row it never had, with the reason it used to read 0.

**Assumed:** `data/raw/osm/` is gitignored and absent from a fresh worktree, so the three cached
Overpass responses were read from `C:\Dev\NearestForest`. The rebuild reflects OSM's 2026-08-15
snapshot, not today's.

**What I did not do.** I did not widen the drop to `access=restricted` or `access=appointment`
(one element each in the extract), because #6 does not name them and a card that grows is a card
nobody reviewed. Nor did I touch `scout=*` — the one element carrying it, "Jubilee Scout Campsite",
is already dropped by `caravans=no`.

**Suite:** `node scripts/selftest.js`, 247 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Nothing here has been seen in a browser** — this is a worktree and Herd serves the main checkout —
and this run shipped a dataset change, so the Campsites tab wants the same phone look the other
deploy checks want.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (248 passed, 0 failed)
TOUCHED: scripts/parse_campsites.py, scripts/selftest.js, app/app.js, app/core.js, app/sw.js,
app/data/campsites.json, docs/DATA-MODEL.md, docs/DECISIONS.md, docs/HANDOVER.md, docs/PRD.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Found 26 static-caravan sites shipping under criterion #6, and dropped them.** This is the same
shape as the scout finding on the entry above, in the neighbouring drop rule. #6 names four kinds of
site, and the static-caravan kind is caught by `looks_static()`: `permanent_camping=only`, plus a
list of ten operator brands. Both are blind to the largest group in the source, the sites a **name**
alone identifies. Every existing assertion stayed green, because a record that is correctly dropped
leaves no text to match on, so a record wrongly kept ships with `access_note: null` and matches
nothing either.

**Measured, not argued.** Reading the shipped `app/data/campsites.json` rather than the assertion
list: **22 residential parks and park-home estates** were listed as somewhere to pull up for the
night, from `os-w303066740` "Lynwood Residential Park" to `os-n6796288905` "Whitearch Park.
Residential Park Homes" and `os-w1082381965` "Cringles Park Home estate". A residential park is
where people **live** in static homes; there is no pitch to pull onto, and the gate is somebody's
front garden. Four more were brand misses the existing list should have caught: `os-w102220819`
"Static Holiday Park" (the list holds `static caravan`, not `static`), `os-w87787629` "Martello
Beach Holiday Park" operated by **Park Resorts**, and two records named exactly `Haven` — the brand
the list already names, missed because its entry is `"haven "` with a trailing space and the name
ends there.

**Watched red, and watched both older #6 assertions stay green beside it.** The new assertion `a
residential or park-home site is dropped even when only its name says so` goes in the temp-tree
block beside the scout one. It feeds the parser the four real shapes above. Against the current
parser it failed naming `os-n31, os-n32, os-n33, os-n34`, while `no campsite is members-only,
private, scout or a static-caravan park` and `a site named as a scout site is dropped even when it
carries no scout tag` both reported **PASS**. That is the criterion's own failure, not a missing
symbol.

**The line that must not move, and it is in the fixture.** `os-w1201815923` "Second Chance Touring &
Residential Park", `os-w1196173845` "Castle Bay Holiday & Residential Park" and `os-w482693448`
"Ryanbay Holiday and Residential Park" are **mixed** sites: residents at one end, touring pitches at
the other. So the rule is `\b(residential|park homes?|static)\b` **unless** the name says Touring or
the record takes tents, and the fixture keeps a `Second Chance Touring & Residential Park` the
assertion requires to survive. A match that is too wide fails it as loudly as one that is too
narrow. All three survived the rebuild.

**One drop I want on the record as luck rather than design.** Adding a trailing space to the
name/operator blob is what lets `"haven "` match a name ending in Haven, and it also made
"Greenacres Caravan Park Presthaven" match on the letters inside *Presthaven*. That record is a
Haven park, so the drop is right on the merits, but it is right by collision. The pre-existing
`"haven "` entry already had that exposure mid-name (it would drop a "Milford Haven Caravan Park"),
so nothing new was widened and no guard was added for a record that is not in the data. Worth
knowing before anyone tightens it.

**`CACHE` and `BUILD` bumped to `v22-2026-09-08`**, because the rebuild changed
`app/data/campsites.json`: **3,647 records, England 2,582 / Scotland 505 / Wales 560**, down 26, 964
KB. The `card 0036` prose-count guard failed unprompted with `app/app.js: says 3673, dataset holds
3647` before I had touched any prose, so the corrected counts in `app/app.js`, `docs/HANDOVER.md`,
`docs/DATA-MODEL.md`, `docs/PRD.md` and `docs/DECISIONS.md` are checked rather than asserted.
`DATA-MODEL`'s exclusion table static row went from 129 to 155 and now carries the name-only reason.

**What I did not do.** I did not touch the 413 records named "Holiday Park", even though many are
static-heavy: plenty of them take tourers, #6 does not name them, and a rule that guesses is worse
than the gap. Nor did I widen `\bhaven\b` beyond what the existing entry already does.

**Assumed:** `data/raw/osm/` was already present in this worktree, so no Overpass request was made.
The rebuild reflects OSM's 2026-08-15 snapshot, not today's.

**Suite:** `node scripts/selftest.js`, 248 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Nothing here has been seen in a browser** — this is a worktree and Herd serves the main checkout —
and this run shipped a dataset change, so the Campsites tab wants the same phone look the other
deploy checks want.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (249 passed, 0 failed)
TOUCHED: scripts/parse_campsites.py, scripts/selftest.js, app/app.js, app/core.js, app/sw.js,
app/data/campsites.json, docs/DATA-MODEL.md, docs/DECISIONS.md, docs/HANDOVER.md, docs/PRD.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Found 72 members-only sites shipping under criterion #6, and dropped them.** This is the same
shape as the scout and residential findings on the two entries above, in the one drop rule that had
never been checked against a name: `access`. #6 names four kinds of site, and the members-only kind
rested entirely on the tag `access=members`. That tag is as sparsely applied as `scout` was.

**Measured, not argued.** Reading the shipped `app/data/campsites.json` rather than the assertion
list: **71 Certificated Locations and Certificated Sites** were listed as somewhere to pull up for
the night, from `os-n8974947457` "Arlebrook House CAMC CL" to `os-w420057782` "Wyming Brook Farm
Certificated Site" and `os-w1312827351` "Lodge Farm C&CC CS", plus `os-w127174906`, named literally
"Caravan Club Site (members)". **Not one of the 72 carried `access=members`**, so every existing #6
assertion stayed green: a record the parser correctly drops leaves no text to match on, so a record
it wrongly keeps ships with `access_note: null` and matches nothing either.

**Why a CL is members-only by definition and not by policy.** A Certificated Location or
Certificated Site is a five-van site that is exempt from site licensing *only* because an exempted
organisation runs it for its own members, under the Caravan Sites and Control of Development Act
1960, schedule 1. It cannot admit a passing non-member without losing the exemption. That is
external law rather than anything this repository states, so it is written into the parser's comment
and into `docs/DATA-MODEL.md` where the next person can check it.

**The line that must not move, and it is in the fixture.** The full network **Club Sites** — "Abbey
Wood Caravan Club Site" and its siblings — take non-members at a higher price, so `club` is
deliberately absent from `MEMBERS_RE` and the fixture keeps an "Abbey Wood Caravan Club Site" that
the assertion requires to survive. A match that is too wide fails it as loudly as one that is too
narrow. 185 club sites survived the rebuild.

**Watched red, and watched both older #6 assertions stay green beside it.** The new assertion `a
certificated members-only site is dropped even when it carries no access tag` goes in the temp-tree
block beside the scout and residential ones. Against the current parser it failed naming `os-n41,
os-n42, os-n43, os-n44`, while `no campsite is members-only, private, scout or a static-caravan
park` and `a members-only, private, scout or static-caravan site never reaches the file` both
reported **PASS**. That is the criterion's own failure, not a missing symbol. 249 passed, 0 failed
after the fix.

**`CACHE` and `BUILD` bumped to `v23-2026-09-08`**, because the rebuild changed
`app/data/campsites.json`: **3,575 records, England 2,525 / Scotland 496 / Wales 554**, down 72, 944
KB. The `card 0036` prose-count guard failed unprompted with `app/app.js: says 98, dataset holds 97
| says 3647, dataset holds 3575` before I had touched any prose, so the corrected counts in
`app/app.js`, `docs/HANDOVER.md`, `docs/DATA-MODEL.md`, `docs/PRD.md` and `docs/DECISIONS.md` are
checked rather than asserted. `DATA-MODEL`'s exclusion table private/members row went from 30 to 102
and now carries the name-only reason.

**What I did not do.** I did not drop the 185 remaining club sites, because they admit non-members
and #6 does not name them. I did not widen the rule to `access=restricted` or `access=appointment`,
for the same reason the entry above gives.

**Assumed:** `data/raw/osm/` was already present in this worktree, so no Overpass request was made.
The rebuild reflects OSM's 2026-08-15 snapshot, not today's.

**Suite:** `node scripts/selftest.js`, 249 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Nothing here has been seen in a browser** — this is a worktree and Herd serves the main checkout —
and this run shipped a dataset change, so the Campsites tab wants the same phone look the other
deploy checks want.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (250 passed, 0 failed)
TOUCHED: scripts/parse_campsites.py, scripts/selftest.js, app/app.js, app/core.js, app/sw.js,
app/data/campsites.json, docs/DATA-MODEL.md, docs/DECISIONS.md, docs/HANDOVER.md, docs/PRD.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Found the last of #6's four words that was never checked against a name, and closed it.** #6 names
members-only, private, scout and static-caravan. Three entries above this one found that `members`,
`scout` and the static kinds all rested on tags OSM applies sparsely, and each shipped real records.
**`private` was the fourth, and it rested entirely on `access=private` / `access=no`.** One record
shipped: `os-w305916449` "King Edward Park(private)", which carries no `access` tag at all — the
name is the only thing that says so, and nothing read the name.

**Measured, not argued.** I read the shipped `app/data/campsites.json` rather than the assertion
list. One record matches `\bprivate\b` on its name; the drop counter for private/no-public-access
went from 102 to 103 on the rebuild.

**The line that must not move, and it is in the fixture.** `operator=Private` in OSM means privately
**owned**, not closed to the public. `os-w157576032` "Llyn Gwynant Campsite" in Snowdonia carries it
and takes anyone who books. So `PRIVATE_RE` reads the **name only**, which is why it is its own
pattern rather than another word inside `MEMBERS_RE` — that one reads operator and name together.
The fixture keeps a `Llyn Gwynant Campsite` with `operator: 'Private'` that the assertion requires
to survive, so a match that is too wide fails as loudly as one that is too narrow. It survived the
rebuild.

**Watched red, and watched the four older #6 assertions stay green beside it.** The new assertion `a
site named private is dropped even when it carries no access tag` goes in the temp-tree block beside
the members-only one. Against the current parser it failed naming `os-n51, os-n52`, while `no
campsite is members-only, private, scout or a static-caravan park`, `a members-only, private, scout
or static-caravan site never reaches the file`, `a site named as a scout site is dropped even when
it carries no scout tag` and `a residential or park-home site is dropped even when only its name
says so` all reported **PASS**. That is the criterion's own failure, not a missing symbol. 250
passed, 0 failed after the fix.

**`CACHE` and `BUILD` bumped to `v24-2026-09-08`**, because the rebuild changed
`app/data/campsites.json`: **3,574 records, England 2,524 / Scotland 496 / Wales 554**, down one,
944 KB. The `card 0036` prose-count guard failed unprompted with `app/app.js: says 3575, dataset
holds 3574` before I had touched any prose, so the corrected counts in `app/app.js`,
`docs/HANDOVER.md`, `docs/DATA-MODEL.md`, `docs/PRD.md` and `docs/DECISIONS.md` are checked rather
than asserted. `DATA-MODEL`'s `counts_by_country` block was also stale from two runs back
(2582/505/560) and now matches the file.

**What I looked at and deliberately left alone.** Six naturist and adults-only sites still ship
(`Ashdene Naturist Club`, `Greenacres Sun Club`, `The Naturist Foundation` and three more). Several
are clubs that in practice admit members only, but #6 does not name them, `Manor Farm Camping
(Naturist and Textile)` is open to all, and a rule that guesses is worse than the gap — the same
reason the entries above gave for `access=restricted`. `Scoutscroft` and `Scoutscroft Touring` still
ship and should: they are commercial holiday parks, and the word-boundary match on `scout` is what
keeps them. No card raised, because leaving a site the criterion does not name is not a fault.

**Assumed:** `data/raw/osm/` was already present in this worktree, so no Overpass request was made.
The rebuild reflects OSM's 2026-08-15 snapshot, not today's.

**Suite:** `node scripts/selftest.js`, 250 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Nothing here has been seen in a browser** — this is a worktree and Herd serves the main checkout —
and this run shipped a dataset change, so the Campsites tab wants the same phone look the other
deploy checks want.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (251 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the render half of criterion #2 against the shape the file actually ships.** An entry above
added `a field the source is silent on is named as unknown, never left blank`, which runs the real
`field()` out of `app/app.js` over a `null` and an empty string. **`app/data/campsites.json` contains
neither.** `compact()` in `scripts/parse_campsites.py` deletes every null key before writing — that
is deliberate and documented, it saved 60% of the file — so a silent field reaches the sheet as an
**absent key**, which is `undefined`, not `null`.

**Measured, not argued.** Counting the shipped file: 3,124 records carry no `parking` key, 2,333 no
`postcode_satnav`, 2,685 no `phone`, 2,399 no `address`, 3,477 no `opening_times` — and **zero
records carry an explicit null in any of them**. So the only assertion covering #2's rendering clause
proves a contract this dataset never exercises. The parser-side assertion `a blank OSM tag becomes
null, never an empty string` does not cover it either: it reads the record before `compact()` runs.

**Watched red, and watched the old assertion stay green beside it.** The new assertion `a field the
shipped record simply does not carry is named as unknown, not left blank` picks a real record out of
`camps` for each of four fields the sheet renders unconditionally, and requires the `is-missing` cell.
I ran it against `field()` with `value == null` tightened to `value === null` — one character, the
edit a linter or a "be explicit" cleanup makes: **250 passed, 1 failed**, the one failure being the
new assertion, while `a field the source is silent on is named as unknown, never left blank` reported
**PASS** with every absent field on every campsite rendering as an empty `<dd>`. That is the
criterion's own failure, not a missing symbol. Restored the operator and re-ran: 251 passed, 0 failed.

**Why an empty `<dd>` is the failure #2 names.** A blank line beside "Charges" is read as free, and
beside "Sat nav postcode" as none needed. #2 requires the app to say "not known" where the source is
silent, and on a campsite record silence is the normal case rather than an edge.

**No `CACHE` / `BUILD` bump.** `app/app.js` ends the run byte-identical to how it started;
`git status` shows `scripts/selftest.js` and the two documents only, and nothing under `app/` changed.

**Suite:** `node scripts/selftest.js`, 251 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**What I checked and did not act on.** I re-read the shipped names for the #6 kinds the four
name-based rules were added for — dotted `C.L.`/`C.S.`, `CAMC`, `C&CC`, `certificated`, `members`,
`private` — and the file holds none. The only `scout` matches are `Scoutscroft` and `Scoutscroft
Touring`, which an entry above records as commercial parks that must survive. No fault, so no card.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 250 self-tests, which this run
made 251. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (252 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the half of criterion #4 that was pinned to a file rather than to the code.** #4 is "keep
OSM-derived records in a file separate from the OGL-derived `sites.json`, **each carrying its own
licence statement**." The ODbL half is pinned on the parser by `every campsite file the parser
writes carries the full ODbL notice`, added earlier on this thread for exactly this reason. **The
OGL half was pinned only on the committed file**, by `attribution present`, which reads
`app/data/sites.json` as it stands in the repository. Delete the attribution line from
`scripts/parse.py` and nothing says a word.

**Why the gap is not academic here.** HANDOVER's "What's next" item 2 records that the forest
pipeline is red on purpose pending a re-fetch, so nobody rebuilds `sites.json` on an ordinary day.
A parser that stopped writing its own licence statement would run green for weeks and surface only
when somebody finally cleared `data/raw/` — at which point the 719 KB OGL database ships anonymous.
A copy of `sites.json` also travels without `index.html`'s footer, and the whole Collective Database
argument this card rests on is that each of the two files names its own licence on its own.

**Watched red, and watched the old assertion stay green beside it.** The new assertion `every OGL
file the parser writes carries its own licence statement` goes in the existing `parse.py` temp-tree
block, reading the header back out of the dataset the clean run wrote. I deleted the `attribution`
line from `scripts/parse.py` and ran the suite: **251 passed, 1 failed**, the one failure being the
new assertion, reporting `attribution=undefined`, while `attribution present` reported **PASS** with
the parser emitting an unlicensed file. That is the criterion's own failure, not a missing symbol.
Restored the line and re-ran: 252 passed, 0 failed.

**Why the wording match and not the exact string.** The assertion requires `Open Government Licence`
to appear, not the full sentence. The full sentence is already pinned where it is a *rendered*
obligation, by `the footer uses Forestry England's own published attribution wording`; pinning it
twice would make one line of prose fail the suite in two places for one edit.

**No `CACHE` / `BUILD` bump.** `scripts/parse.py` ends the run byte-identical to how it started —
`git status` shows `scripts/selftest.js` and the two documents only — and nothing under `app/`
changed.

**Suite:** `node scripts/selftest.js`, 252 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 251 self-tests, which this run
made 252. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (253 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the unwatched half of the map credit, which is criterion #3 on the map rather than in the
footer.** Five assertions cover the hint. Three of them call `NF.mapHint` directly, which is a pure
function the suite hands its own arguments to, so they prove the wording and not the map. The fourth,
`the map asks core.js what the hint should say`, greps `NF.mapHint(tilesOn,` — **it stops at the
comma, so the second argument is unwatched.** `updateHint()` in `app/map.js` computes that argument
from the list being drawn, and nothing looked at it.

**Measured, not argued.** I set `var osm` in `updateHint` to a literal `false` and ran the suite:
**252 passed, 0 failed**. With that one word changed, the Campsites tab draws 3,574 ODbL markers with
the tile layer off under the hint "Tap a marker for details. Pinch to zoom." — no credit anywhere on
the map, which is the exact obligation this card added `NF.mapHint` for, and the whole suite green.

**Watched red, and watched all five older hint assertions stay green beside it.** The new assertion
`the map reads its own markers to decide whether OpenStreetMap needs crediting` lifts the real
`updateHint` out of `app/map.js` with `new Function` and runs it against a stub hint element, once
with a campsite in the drawn list and once with only a forest. It requires the OSM credit and the
readable pill in the first case and the plain hint with no pill in the second. Against the broken
`osm` it failed reporting both cases as the plain hint, while `the map asks core.js what the hint
should say`, `the hint gets its solid backing exactly when it is a credit`, `with the layer on the
hint credits the tile provider`, `a map with no OSM markers and no tiles keeps the plain hint` and
`the map recomputes the hint when the list it draws changes` all reported **PASS**. That is the
criterion's own failure, not a missing symbol. Restored the line and re-ran: 253 passed, 0 failed.

**Behaviour, not spelling, and why it could be.** `updateHint` reads `document`, `hooks`, `tilesOn`
and `NF` from its closure and touches no canvas, so it lifts out cleanly and takes all four as
factory arguments — the same shape this card already uses for `field()` out of `app/app.js`. One
limit of the harness, said plainly: the assertion is coupled to `updateHint` keeping its exact
signature line and its two-space closing brace, because that is what the extraction regex matches.
Rename or re-indent it and the suite throws rather than fails, which is loud but not informative.

**No `CACHE` / `BUILD` bump.** `app/map.js` ends the run byte-identical to how it started —
`git status` shows `scripts/selftest.js` and the two documents only — and nothing under `app/`
changed.

**Suite:** `node scripts/selftest.js`, 253 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 252 self-tests, which this run
made 253. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (254 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the app half of criterion #2's badge clause.** #2 says "THE APP SHALL NOT show an
open/closed badge". Two assertions were traced to it: `no campsite carries a parsed opening summary`
reads the shipped file, and `no campsite is ever reported open or closed` calls `NF.openState` over
every campsite. Both prove the **data** and the **core function**. **Neither proves the app asks.**
The badge is rendered in two places — the list row in `draw()` and the "Right now" field in
`openSheet()` — and each is gated on that state by a hand-written condition nothing was watching.

**Measured, not argued.** I replaced `if (st.state !== 'unknown')` in `openSheet` with `if (true)`
and ran the suite: **253 passed, 0 failed**. With that one word changed every campsite sheet carries
a "Right now" row reading `Closed · undefined`, built from a state the source never published, and
the whole suite is green — including both existing #2 assertions, because `openState` still returns
`unknown` and the app simply stopped asking it.

**Watched red, and watched the two older #2 assertions stay green beside it.** The new assertion
`the app shows an open or closed badge only when the state is known` requires both gates: the
sheet's `Right now` field inside the `st.state !== 'unknown'` guard, and the row's two spans emitted
only under `st.state === 'closed'` and `st.state === 'open'`. Against the broken `openSheet` it
failed while `no campsite is ever reported open or closed` reported **PASS**. That is the criterion's
own failure, not a missing symbol. Restored the gate and re-ran: 254 passed, 0 failed.

**One limit of the harness, said plainly.** This is source text, not behaviour. Both gates sit inside
`draw()` and `openSheet()`, which are DOM-only, and unlike `field()` and `updateHint()` they cannot
be lifted out with `new Function` — they read `listEl`, `$()` and the sheet element from module
scope. It is the same shape as the two neighbouring `app.js` assertions on this card. The cost is
that renaming the local `st` makes the assertion fail loudly but unhelpfully.

**No `CACHE` / `BUILD` bump.** `app/app.js` ends the run byte-identical to how it started;
`git status` shows `scripts/selftest.js` and the two documents only, and nothing under `app/`
changed.

**Suite:** `node scripts/selftest.js`, 254 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 253 self-tests, which this run
made 254. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (255 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the failure mode this card's own design created, which nothing was watching.** #4 splits
the ODbL data into a second file, and #1 says the app loads with three tabs. The cost of the split
is that the shell now makes a **second fetch that can fail on its own** — a half-populated offline
cache, an interrupted deploy, a corrupt file. `app/app.js` guards it in two places, and both are one
line: `loadJson('data/campsites.json')` carries its own `.catch`, so a rejection cannot take
`Promise.all` down with it, and `render()` swaps the empty-tab message for a named load error.
**Neither line had an assertion.** The nearest one, `the shell fetches the campsite file and merges
it into the ranked list`, greps the fetch and the concat and looks straight past the `.catch` on the
same expression.

**Measured, not argued.** I deleted the `.catch` and ran the suite: **254 passed, 0 failed**. With
that one clause gone, a missing `campsites.json` rejects the pair, the outer handler sets "Could not
load the site data" and clears the list, and the app offers **no tabs at all** — Forests and Car
parks included, neither of which has anything to do with OpenStreetMap. That is #1 failing in the
scenario #8 exists to test, under a fully green suite. I then deleted only the `CAMP_ERROR` branch
of the empty message and ran it again: **254 passed, 0 failed**, with a Campsites tab reporting "No
sites match that filter" over data that never arrived — telling a reader in a dead-signal area there
is nowhere to sleep near them, which is a statement no source published and the failure #2 names.

**Watched red twice, once per clause.** The new assertion `a missing campsite file cannot take the
forests down, and the tab says which happened` requires the chained `.catch`, the `CAMP_ERROR`
capture, the `TAB === 'campsite' && CAMP_ERROR` branch and its wording. It failed against each of
the two breakages above on its own, while every other campsite assertion reported PASS both times.
That is the criteria's own failure, not a missing symbol. Restored both lines and re-ran: 255
passed, 0 failed.

**One limit of the harness, said plainly.** This is source text, not behaviour. The load is a
top-level `Promise.all` reading `metaEl`, `DATA` and `loadStale`, and the message is inside
`render()`, which reads `emptyEl` and `listEl` from module scope — neither lifts out with
`new Function` the way `field()` and `updateHint()` did, and this suite has no DOM. It is the same
shape as the three neighbouring `app.js` assertions on this card. The cost is that renaming
`CAMP_ERROR` fails it loudly but unhelpfully.

**No `CACHE` / `BUILD` bump.** `app/app.js` ends the run byte-identical to how it started;
`git diff --stat` shows `scripts/selftest.js` only, and nothing under `app/` changed.

**Suite:** `node scripts/selftest.js`, 255 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 254 self-tests, which this run
made 255. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (256 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the one campsite field nothing in the suite had ever read.** #2 is "state **only** what its
source publishes". Every assertion this thread has accumulated for it watches a field that can be
*silent* — a postcode, a phone, an opening time — and proves silence becomes null and renders as "not
known". **`facilities` is the opposite shape: it is a list of positive claims**, drawn on the sheet
as chips reading "toilets", "drinking water", "chemical disposal", "electric hook-up". Nothing
anywhere in `scripts/selftest.js` reads it on a campsite. The only `facilities` assertion in the file
is `most Scottish sites list facilities`, which is card 0016's and reads forests.

**Measured, not argued.** `FACILITY_TAGS` in `scripts/parse_campsites.py` pairs each OSM key with the
values that mean yes, and that pairing is the entire guarantee. I replaced `if tags.get(key) in good`
with `if tags.get(key)` and the `dog` value list with a truthiness test, and ran the suite: **255
passed, 0 failed**. `"no"` is a non-empty string, so with those two words changed a site publishing
`toilets=no shower=no drinking_water=no dog=no` ships chips claiming it has all of them — the app
stating the **opposite** of what OSM published, on the field somebody picks a site by at dusk, and
the whole suite green.

**Watched red, and watched everything else stay green beside it.** The new assertion `a facility the
source says the site has NOT is never listed as one` goes in the temp-tree block beside `a blank OSM
tag becomes null`. It feeds the parser two sites: one publishing `no` to all eleven facility tags,
one publishing `toilets=yes shower=hot drinking_water=yes dog=leashed`. It requires the first to
carry none and the second to carry all four labels, so it fails on a rule that is too loose *and* on
one that is too tight. Against the broken parser it failed naming all eleven wrongly-claimed chips;
against the correct parser, 256 passed, 0 failed.

**Why a fixture and not the shipped file.** Today's extract carries correct chips, so an assertion
over `app/data/campsites.json` would have been green from birth — what this thread has refused six
times. The guarantee belongs to the pairing in the parser, so the parser is where it is tested.

**One thing the harness taught me, said plainly.** The first run of the new assertion threw rather
than failed: `compact()` drops an empty list before writing, so "no facilities" is an **absent key**,
not an empty array. That is correct and is the contract DATA-MODEL states. I made the assertion
accept both readings — via one `facsOf()` helper — and then re-broke the parser and re-ran, to
confirm the *corrected* assertion still goes red for the criterion's own reason rather than trusting
the red I had watched before the edit. It does, naming the same eleven chips.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started; `git status` shows `scripts/selftest.js` and `docs/` only, and nothing under `app/` changed.

**Suite:** `node scripts/selftest.js`, 256 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 255 self-tests, which this run
made 256. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (257 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the way criterion #7 fails without anybody touching `build_stn`.** #7 already carries three
assertions on this thread, and all three watch the **FLS record**: that it holds both rules in the
shipped file, that the parser puts them there, and that the sheet gives them their own heading. #7 is
not about a record, though — it is about a piece of tarmac. "WHEN an FLS Stay the Night car park is
listed, THE APP SHALL say that it is overnight-only between 6pm and 10am and that it requires a
self-contained vehicle." **OSM maps some of those same car parks itself**, as ordinary campsites
carrying none of the scheme's rules, and `dedupe()` in `scripts/parse_campsites.py` is the only thing
standing between the two. An earlier entry on this thread traced `dedupe` by reading it and recorded
it as safe. Reading is not watching.

**Measured, not argued.** I reduced `dedupe` to `return osm` and ran the suite: **256 passed, 0
failed**. With that one line, every Stay the Night car park OSM also maps ships **twice** — once as
the FLS record with its rules, and once beside it under OSM's name for the place, with no overnight
window and no self-contained-vehicle rule. Both records rank next to each other, because they are the
same tarmac. A reader taps the nearer-looking one and parks at 2pm. The three older #7 assertions all
reported PASS, because the FLS record they read is still there and still correct.

**Watched red, and watched the three older ones stay green beside it.** The new assertion `an OSM copy
of a Stay the Night car park never ships beside it without the rules` goes in the temp-tree block. It
puts two OSM campsites in the Scotland extract — one 55 m from the fixture car park, one 1.4 mi away
— and requires the near one gone, the far one kept, and the FLS record still carrying its rules.
Against the broken `dedupe` it failed naming the twin; restored, 257 passed, 0 failed.

**Why the control record.** The merge radius is 160 m and the test would pass just as well with
`dedupe` swallowing everything within ten miles, which would silently delete real campsites near
Scottish forest car parks. The far fixture pins that end of the rule too, the same shape the scout and
static assertions on this card use.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started — `git status` shows `scripts/selftest.js` and the two documents only — and nothing under
`app/` changed.

**Suite:** `node scripts/selftest.js`, 257 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 256 self-tests, which this run
made 257. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (258 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the licence obligation on the front end nobody had looked at.** Every #3 and #4 assertion
this thread has accumulated watches the PWA — the footer credit and its anchor, the map pill, the
`licence` / `attribution` / `attribution_url` header the parser writes. **`app/api/nearest.php` is a
second way this data leaves the machine**, it already accepts `source=all`, and its JSON response
carries no attribution of any kind. It does not need one *today*, because it reads `sites.json` and
nothing else — and that, rather than any rule, was the entire guarantee.

**Why it is not a hypothetical.** HANDOVER records the split in plain words: "`api/nearest.php` and
the iOS Shortcut cover the forest tabs only ... the two front ends no longer cover the same ground."
Closing that gap is an obvious next card, and the way anybody would close it is to load
`campsites.json` beside `sites.json` in that file. That redistributes the Derivative Database over
HTTP with no credit, no licence name and no link — all three of #3's obligations missed at once, in
the one place a reader never sees a footer, and the notice would have to travel in a JSON body
nobody renders.

**Watched red, and watched both directions.** The new assertion `the Shortcut endpoint never serves
campsite data without the ODbL notice` reads `app/api/nearest.php` and requires either that it does
not mention `campsites.json` at all, or that its response carries an `'attribution'` key naming
`OpenStreetMap contributors` and the copyright URL. I added the campsite path to `nearest.php` with
no notice and ran the suite: **257 passed, 1 failed**, the one failure being the new assertion, while
every other campsite and licence assertion reported PASS with an unattributed ODbL endpoint sitting
in the tree. That is the criteria's own failure, not a missing symbol. Then I added the attribution
line as well and re-ran — **PASS** — so the rule lets the endpoint grow rather than freezing it,
which is the point. Restored `nearest.php` with `git checkout --`; it ends the run byte-identical to
how it started.

**One limit of the harness, said plainly.** This is source text, not behaviour. There is no PHP in
this suite, and running `php -S` for one assertion would make the whole suite depend on Herd being on
PATH, which it is not from Git Bash. The cost is that the assertion reads the *shape* of the response
rather than a response: a `nearest.php` that carried its attribution under a different key would fail
it loudly but unhelpfully.

**No `CACHE` / `BUILD` bump.** `git status` shows `scripts/selftest.js` and the two documents only;
nothing under `app/` changed.

**Suite:** `node scripts/selftest.js`, 258 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 257 self-tests, which this run
made 258. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (259 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the one rule on this card that Rob decided himself and nothing was watching.**
`takes_a_van()` in `scripts/parse_campsites.py` is the whole of "Answered, and built": on
2026-08-15 Rob chose *named and explicitly caravan or motorhome capable* over the wider filter that
would have taken the 2,370 records carrying no caravan tag. Every assertion this thread has
accumulated watches what happens **after** that decision — what a kept record says, which records
are dropped for being members-only or static, where the licence notice goes. Nothing watched the
decision itself.

**Measured, not argued.** I replaced the body of `takes_a_van()` with `return True` and ran the
suite: **258 passed, 0 failed.** The two assertions that look like they cover it — `every campsite
names at least one vehicle it takes` and `every campsite takes a caravan or a motorhome` — read the
`app/data/campsites.json` already committed here, which the filter has already cleaned, so they are
green from birth on this question.

**What the red taught me, and what I changed because of it.** My first fixture had four forbidden
sites. Two of them — a `camp_site` with no vehicle tag at all, and one publishing `caravans=no
motorhome=no` — made the parser exit 1 on its own: they reach `validate()` with an empty `vehicles`
list and it refuses them by name. So the red I watched was the build failing, not the criterion's
own failure, and two of the four rules turned out to have a second line of defence I had not known
about. I cut those two out of the fixture and said so in the comment beside it, rather than keeping
a case whose red comes from somewhere else.

**The two with no second line** are the ones left: a `tents=only` field still derives
`vehicles: ["tents"]`, and a `backcountry=yes` pitch tagged `caravans=yes` still derives
`vehicles: ["caravans"]`, so both pass `validate()` and rank in the Campsites tab — one you cannot
bring a van to at all, one you cannot drive to. Against the broken filter the new assertion `a site
the source never says takes a van is not listed as somewhere to pull up` failed naming `os-n51,
os-n52` as "listed as somewhere to pull up", which is the criterion's own failure rather than a
missing symbol. Every other campsite assertion reported PASS beside it. Restored the seven lines and
re-ran: 259 passed, 0 failed.

**Both ends pinned.** Two kept fixtures hold "explicit" from being read as "caravans=yes only": a
`motorhome=yes` stopover, and a `tourism=caravan_site` carrying no `caravans` tag, which is a
caravan park saying so by its own primary tag. Without them the assertion would pass a filter
tightened into uselessness — the same shape the scout and Stay the Night fixtures on this card use.

**Which criterion this belongs to, said plainly.** The filter is not the literal text of any one
criterion. It is #1's tab — "places where you could pull up in a campervan" — and it is #2's rule,
because listing a tents-only field as somewhere to pull up for the night states something OSM never
published. Neither tick moves: both were already true, and are now watched.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started — `git diff --stat` shows `scripts/selftest.js` only — and nothing under `app/` changed.

**Suite:** `node scripts/selftest.js`, 259 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 258 self-tests, which this run
made 259. Not a run report — HANDOVER's header forbids those — just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** — this is a worktree and Herd serves the main checkout — but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (260 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the last campsite field nothing in this suite had ever read.** #2 is "state ONLY what its
source publishes". Ten runs on this thread have watched the fields that can be *silent* -- postcode,
phone, opening hours, facilities -- and proved silence becomes null and renders as "not known".
`fee` is neither silent nor a plain string: `fee_text()` in `scripts/parse_campsites.py`
**translates** it. `fee=no` becomes the word **"Free"**, `fee=yes` becomes "Charges apply", and
anything else is passed through as published, because plenty of records carry a real price.

**Why it is the sharpest one left.** `app/app.js` line 57 turns the exact string `'Free'` into a
badge on the **list row**. Every other campsite claim needs a tap to reach; this one is on the
screen a driver reads. A wrong "Free" is not a missing answer, it is the app stating the opposite of
what OSM published, about money, on the row somebody chooses by.

**Measured, not argued.** I swapped the two return values in `fee_text()`, so a site publishing
`fee=yes` ships `parking: "Free"` and wears the badge, and ran the suite: **259 passed, 0 failed.**
The two assertions that look like they cover money are the Stay the Night ones, and they read
`parking` on **FLS** records, which are built by `build_stn` and never go through `fee_text` at all.
Nothing else in `scripts/selftest.js` mentions `fee` or the word `Free`.

**Watched red, and watched everything else stay green beside it.** The new assertion `a site the
source says you pay for is never shown as free` goes in the temp-tree block beside `a facility the
source says the site has NOT is never listed as one`. It feeds the parser the three shapes of the
tag -- `fee=yes`, `fee=no` and `fee=GBP 20 per night` -- and requires all three exact strings, so it
fails on an inverted mapping *and* on a mapping that swallows a published price. Against the broken
parser it failed naming both: `fee="yes" shipped parking="Free"` and `fee="no" shipped
parking="Charges apply"`. That is the criterion's own failure, not a missing symbol. Restored and
re-ran: 260 passed, 0 failed.

**Why a fixture and not the shipped file.** Today's extract carries the correct wording, so an
assertion over `app/data/campsites.json` would have been green from birth -- what this thread has
refused seven times. The translation lives in the parser, so the parser is where it is tested.

**What I did not test, said plainly.** The badge itself, in `app/app.js`, is still unwatched: this
assertion pins the string the badge keys off, not the branch that draws it. I judged the parser the
load-bearing half, because the badge cannot be wrong about a site the data is right about, and one
assertion is what a run adds. A later run could take the render half the way `a field the source is
silent on is named as unknown` took `field()`.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started -- `git status` shows `scripts/selftest.js` and the two documents only -- and nothing under
`app/` changed.

**Suite:** `node scripts/selftest.js`, 260 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 259 self-tests, which this run
made 260. Not a run report -- HANDOVER's header forbids those -- just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** -- this is a worktree and Herd serves the main checkout -- but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (261 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Took the render half of the money claim, which the run above named and deliberately left.** Its
last section says so in plain words: "The badge itself, in `app/app.js`, is still unwatched: this
assertion pins the string the badge keys off, not the branch that draws it." That run pinned
`fee_text()` in `scripts/parse_campsites.py`. This one pins the branch on the list row that reads
its output.

**Why this half is the sharper one.** Every other campsite claim the suite watches lives on the
detail sheet and needs a tap to reach. `parking === 'Free'` in `app/app.js` draws a badge on the
**row**, which is the line a driver reads in a car park at dusk and chooses by. And the two halves
fail independently: a correct `fee_text()` writing `"Charges apply"` is no protection at all if the
branch reading it stops comparing.

**Measured, not argued.** I loosened `s.parking === 'Free'` to `s.parking` -- one character short of
the most ordinary slip there is in this file, which is full of `if (s.foo)` truthiness pushes on the
lines either side of it -- and ran the suite: **260 passed, 0 failed.** With that change every
campsite that publishes a price wears a "Free" badge, including the ones carrying a real figure like
`GBP 20 per night`, and nothing in the suite says a word. The assertion added the previous run,
`a site the source says you pay for is never shown as free`, reported PASS throughout: it reads the
parser, and the parser was still right.

**Watched red, and watched everything else stay green beside it.** The new assertion `a campsite the
source says you pay for never wears the Free badge on its row` goes in the campsite block beside the
two `field()` assertions. Against the broken branch it failed naming all three paying fixtures --
`parking="Charges apply"`, `parking="GBP 20 per night"`, `parking="£15 per pitch"` -- which is the
criterion's own failure, not a missing symbol. Restored the comparison and re-ran: 261 passed, 0
failed.

**Behaviour, not spelling, and both ends pinned.** The branch is lifted out of `app.js` source with
`new Function` and **run**, the way `field()` is lifted above it, because it depends only on a `sub`
array and `esc`. It also requires a genuinely free site to keep its badge and a site carrying no
`parking` key at all not to gain one, so it fails a rule tightened into uselessness as well as a
loosened one -- the same shape the scout, static and `takes_a_van()` fixtures on this card use.

**One limit of the harness, said plainly.** The regex is anchored on the branch's exact opening line
and its four-space closing brace, so re-indenting that block or renaming `sub` makes the suite throw
rather than fail. That is loud but not informative, and it is the same coupling the `field()`
assertion above already carries and names.

**No `CACHE` / `BUILD` bump.** `app/app.js` ends the run byte-identical to how it started --
`git status` shows `scripts/selftest.js` and the two documents only -- and nothing under `app/`
changed.

**Suite:** `node scripts/selftest.js`, 261 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 260 self-tests, which this run
made 261. Not a run report -- HANDOVER's header forbids those -- just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** -- this is a worktree and Herd serves the main checkout -- but this run shipped no bytes
under `app/`, so there is nothing new to look at.

**2026-09-08** RESULT: partial
TESTS: +1 new, all green (262 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the one fault this card found by RUNNING the tab, which nothing was watching.** The card's
own "Answered, and built" section records it: "the same site mapped twice, as an OSM node and as the
surrounding area, fixed by merging same-name records within 0.5 mi **and self-tested**". Housedean
Farm Campsite came back as both the nearest and the second nearest site to Brighton. The fix is
`dedupe_same_site()` in `scripts/parse_campsites.py`. The self-test is `no campsite is listed twice
under one name in one place`, and it reads the `app/data/campsites.json` **already committed here** --
a file the parser has already cleaned -- so it is green from birth on this question.

**Measured, not argued.** I reduced `dedupe_same_site()` to `return sites` and ran the suite: **261
passed, 0 failed.** The entire de-duplication can be deleted and every assertion on this card,
including the one written for this exact fault, reports PASS.

**Watched red on both of its clauses.** The new assertion `one campsite mapped twice by OpenStreetMap
is listed once, and keeps its postcode` goes in the temp-tree block beside `a site the source never
says takes a van is not listed as somewhere to pull up`. Against the deleted merge it failed with
`the same site 0.1 mi apart under one name ships 2 times (os-n61, os-n60)`. I then restored the merge
and deleted only its "richest record wins" sort -- one line, whose own comment says it exists "so the
merge never loses a postcode or a website" -- and it failed again, separately, with `the merge kept
os-n61 but lost the published postcode`. Both are the fault's own failure, not a missing symbol, and
every other campsite assertion reported PASS beside each. Restored both and re-ran: 262 passed, 0
failed.

**Both ends pinned, and the fixture ordered to make the red honest.** The 0.5 mi threshold is a
measured gap in the distribution rather than taste, so a control pair shares a name 6.9 mi apart and
both must survive -- two different farms called the same thing are two campsites, and a merge widened
into uselessness would pass without it. The poorer of the twins is listed **first** in the extract, so
a merge that simply keeps whatever OSM returned first fails on the postcode instead of passing by
luck. Same shape as the scout, Stay the Night and `takes_a_van()` fixtures on this card.

**Which criteria this belongs to.** #1's ranked list, because two rows for one place push a real
alternative off the top of a list read in a moving vehicle; and #2, because two entries claim two
places to sleep where the source published one. Neither tick moves: both were already true, and are
now watched.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started -- `git status` shows `scripts/selftest.js` and the two documents only -- and nothing under
`app/` changed.

**Suite:** `node scripts/selftest.js`, 262 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 261 self-tests, which this run
made 262. Not a run report -- HANDOVER's header forbids those -- just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** -- this is a worktree and Herd serves the main checkout -- but this run shipped no bytes
under `app/`, so there is nothing new to look at.
**2026-09-08** RESULT: partial
TESTS: +1 new, all green (263 passed, 0 failed)
TOUCHED: scripts/selftest.js, docs/HANDOVER.md,
docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
OUT-OF-SCOPE: none

**Closed the second list of positive claims on a campsite record.** An earlier run on this thread
took `facilities` -- "state ONLY what its source publishes", the chips on the detail sheet -- and
its own comment says the guarantee is the pairing of each OSM key with the values that mean yes.
**`vehicles` is the same shape and was never read.** It is also the more load-bearing of the two:
`app/app.js` renders it as "Takes: caravans, motorhomes", and it is the field that answers the one
question this tab exists for, which is whether a van can get in.

**Measured, not argued.** I replaced all three checks in `vehicles_for()`
(`scripts/parse_campsites.py`) with truthiness tests, so `caravans=no` ships the claim "caravans",
and ran the suite: **262 passed, 0 failed.** The two assertions that look like they cover it --
`every campsite names at least one vehicle it takes` and `every campsite takes a caravan or a
motorhome` -- read the shipped `app/data/campsites.json` and only ever ask for MORE, so an added
claim passes both. The filter assertions cannot see it either: such a site is still correctly
listed, because `takes_a_van()` reads `motorhome=yes`. It just claims a vehicle the source denies.

**Watched red, and watched everything else stay green beside it.** The new assertion `a vehicle the
source says the site does NOT take is never listed as one` goes in the temp-tree block beside `a
facility the source says the site has NOT is never listed as one`. Against the broken parser it
failed with `No Caravans Farm takes ["caravans","motorhomes","tents"], not ["motorhomes"]` -- the
criterion's own failure, not a missing symbol -- while the other 262 reported PASS. Restored the
seven lines and re-ran: 263 passed, 0 failed.

**Both ends pinned.** A second fixture publishes `caravans=yes motorhome=designated tents=yes` and
must keep all three, so a `vehicles_for()` tightened into uselessness fails too; `designated` is
there because it is the one accepted value a rewrite would most easily drop. Same shape as the
scout, static, `takes_a_van()` and fee fixtures on this card.

**Why a fixture and not the shipped file.** Today's extract carries correct vehicle lists, so an
assertion over `app/data/campsites.json` would have been green from birth -- what this thread has
refused eight times. The claim is derived in the parser, so the parser is where it is tested.

**No `CACHE` / `BUILD` bump.** `scripts/parse_campsites.py` ends the run byte-identical to how it
started -- `git status` shows `scripts/selftest.js` and the two documents only -- and nothing under
`app/` changed.

**Suite:** `node scripts/selftest.js`, 263 passed, 0 failed. There is no `vendor/` in this
repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.
This project has never had a PHP suite.

**One number corrected in `docs/HANDOVER.md`:** "Current state" said 262 self-tests, which this run
made 263. Not a run report -- HANDOVER's header forbids those -- just the count kept honest.

**Nothing raised.** The one fault outside this card is `docs/HANDOVER.md` at ~41 KB, over the orient
hook's budget, reported again at session start; card `0031` in `ai-review/` already carries it.

**Still open. #8 needs a person**, unchanged: aeroplane mode, relaunched cold from the Home Screen
icon, Campsites tab tapped into while offline. Card 0001 check 5. **Nothing here has been seen in a
browser** -- this is a worktree and Herd serves the main checkout -- but this run shipped no bytes
under `app/`, so there is nothing new to look at.
