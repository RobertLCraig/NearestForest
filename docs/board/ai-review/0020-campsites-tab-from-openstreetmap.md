---
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

**Relates to**
- `0016` - was this card's blocker and is answered. It measured that the Forestry and Land Scotland
  destinations index carries every destination's coordinates in one HTML attribute, which is how the
  44 Stay the Night car parks get a position for two requests instead of forty-four. Answered Yes on
  2026-08-18 and built on 2026-08-29, and this card has shipped on top of it since.
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
      open/closed badge, since only 96 of 8,501 records carry any opening hours.
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
- [x] #8 WHEN the app is installed, THE APP SHALL still work fully offline with the larger dataset,
      re-verified on the device as card 0001 check 5 requires. **Only a person can close this one.**
      proves: manual - Rob, 2026-09-20, across a road trip to and around Scotland.
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
`takes_a_van()`. **Shipped:** 3,574 campsites — 2,524 England, 496 Scotland, 554 Wales — including
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

**2026-09-20** THREAD PRUNED HERE, BY ROB, ON CARD `0055`. Fifty-one dated entries written on
2026-09-08 and 2026-09-09 were replaced by this one. Nothing above or below it was touched.

**Why it was allowed.** `docs/board/README.md` permits pruning only when a person decides to, and
treats needing to as a defect report about whatever filled the thread rather than about the log.
Rob decided on 2026-09-20. The defect it reports is recorded in the entry at the bottom of this
thread, which was written before the prune and is the diagnosis: criteria #1 to #7 were met on
2026-08-15, #8 could only ever be closed by a person, and the loop kept restarting a finished card
and finding nothing to do but add one more assertion. That is not a reader's failure to skim. The
card reached 208 KB across 3,044 lines and **the agent file reader refused to open it**, so a
session sent here could no longer read the card it was sent to work, and a self-test has been red
on it ever since.

**What was in the fifty-one, said once.** Each opened `RESULT: partial`, added one self-test to a
different stage of the campsite pipeline, closed on the same sentence, `#8 needs a person`, and ran
about sixty lines of prose about it. Three of them built nothing at all and said so. The suite went
from 228 passed to 279 passed across them and every one of those assertions is still in
`scripts/selftest.js`, which is where a test belongs and is a better record of it than a paragraph.
**The tests were not touched by this prune.**

**Four of the fifty-one changed the shipped data rather than only guarding it**, and those results
are kept here because nothing else records them as one fact: two scout sites, 26 static-caravan
sites and 72 members-only sites were found still shipping against criterion #6 and were dropped, and
one real defect was found in criterion #2 by reading `scripts/parse_campsites.py` instead of the
assertion list. The file that ships today holds **3,574 campsites: England 2,524, Scotland 496,
Wales 554**, `generated_at` 2026-08-15, measured off `app/data/campsites.json` while writing this.
**`## Answered, and built` above says 3,575 and England 2,525 and is wrong by one**; it was written
before those drops. Corrected there in the same pass, since that section is not part of this thread.

**The index of what was pruned**, one line each, so nothing is unfindable. Every one of these is a
commit in `git log` against this card's file, which is the full text if anybody ever needs it.

- **2026-09-08** (partial) The map credit.
- **2026-09-08** (partial) I built nothing, because there was nothing on this card left to build.
- **2026-09-08** (partial) Nothing was built, because nothing on this card is buildable.
- **2026-09-08** (partial) Nothing was built.
- **2026-09-08** (partial) Closed the untested half of criterion #2.
- **2026-09-08** (partial) Closed the untested half of criterion #7.
- **2026-09-08** (partial) Closed the three-quarters of criterion #6 that nothing was watching.
- **2026-09-08** (partial) Closed the gap in criterion #1, which nothing was watching.
- **2026-09-08** (partial) Closed the gap in criteria #3 and #4 that nothing was watching.
- **2026-09-08** (partial) Closed the last unwatched clause of criterion #2, the rendering half.
- **2026-09-08** (partial) Closed the unwatched half of criterion #5.
- **2026-09-08** (partial) Closed the third clause of criterion #3, which nothing could distinguish from its own failure.
- **2026-09-08** (partial) Closed the half of criterion #5 that is a second number.
- **2026-09-08** (partial) Closed the half of criterion #7 that watched a file rather than the pipeline.
- **2026-09-08** (partial) Nothing was built, and this time that is a finding rather than a shrug.
- **2026-09-08** (partial) Closed the half of criterion #4 that is the licence boundary itself.
- **2026-09-08** (partial) Found a real defect in criterion #2 by reading the parser rather than the assertion list, and
- **2026-09-08** (partial) Found a real defect in criterion #2 by reading the sheet rather than the assertion list, and fixed
- **2026-09-08** (partial) Found two scout sites shipping under criterion #6, and dropped them.
- **2026-09-08** (partial) Found 26 static-caravan sites shipping under criterion #6, and dropped them.
- **2026-09-08** (partial) Found 72 members-only sites shipping under criterion #6, and dropped them.
- **2026-09-08** (partial) Found the last of #6's four words that was never checked against a name, and closed it.
- **2026-09-08** (partial) Closed the render half of criterion #2 against the shape the file actually ships.
- **2026-09-08** (partial) Closed the half of criterion #4 that was pinned to a file rather than to the code.
- **2026-09-08** (partial) Closed the unwatched half of the map credit, which is criterion #3 on the map rather than in the
- **2026-09-08** (partial) Closed the app half of criterion #2's badge clause.
- **2026-09-08** (partial) Closed the failure mode this card's own design created, which nothing was watching.
- **2026-09-08** (partial) Closed the one campsite field nothing in the suite had ever read.
- **2026-09-08** (partial) Closed the way criterion #7 fails without anybody touching build_stn.
- **2026-09-08** (partial) Closed the licence obligation on the front end nobody had looked at.
- **2026-09-08** (partial) Closed the one rule on this card that Rob decided himself and nothing was watching.
- **2026-09-08** (partial) Closed the last campsite field nothing in this suite had ever read.
- **2026-09-08** (partial) Took the render half of the money claim, which the run above named and deliberately left.
- **2026-09-08** (partial) Closed the one fault this card found by RUNNING the tab, which nothing was watching.
- **2026-09-08** (partial) Closed the second list of positive claims on a campsite record.
- **2026-09-08** (partial) Closed the last translated campsite field nothing in this suite had ever read.
- **2026-09-08** (partial) Closed the render half of access_note, which the run above named and left open.
- **2026-09-08** (partial) Closed the render half of vehicles, the last of the four translated campsite fields with only
- **2026-09-08** (partial) Closed the last positive claim the campsite sheet makes that nothing was reading: the More
- **2026-09-08** (partial) Closed the third thing the campsite row draws, and the only one nothing had ever read: the "Stay
- **2026-09-08** (partial) Closed the per-record licence notice, the one artefact carrying #3's credit that nothing had ever
- **2026-09-08** (partial) Closed the Access row on the detail sheet, the last line of the campsite branch of
- **2026-09-08** (partial) Closed the one clause of the file header that nothing read: the second source.
- **2026-09-08** (partial) Closed the one drop rule in the parser that nothing had ever read: the unnamed campsite.
- **2026-09-08** (partial) Closed the one claim the campsite half makes that is not about a place at all: its date.
- **2026-09-09** (partial) Closed criterion #4 in the direction nothing was watching: the OGL parser writing into the ODbL
- **2026-09-09** (partial) Closed the comparative clause of criterion #1, which nothing read.
- **2026-09-09** (partial) Closed the one campsite field the sheet turns into something you can tap, and that nothing had
- **2026-09-09** (partial) Closed the path that carries nine records in ten and that no fixture had ever run: the OSM area.
- **2026-09-09** (partial) Closed the one field every campsite carries that nothing had ever watched the parser produce:
- **2026-09-09** (partial) Closed the one stage of the campsite pipeline nothing in this suite had ever run:

**2026-09-09** RESULT: blocked
TESTS: +0 new, all green (279 passed, 0 failed)
TOUCHED: docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md,
docs/board/todo/0055-card-0020-has-outgrown-the-agent-file-reader.md
OUT-OF-SCOPE: 0055

**I wrote no test this run, on purpose, and that is the finding.** Criteria #1 to #7 have been met
since 2026-08-15. **#8 is an offline check on Rob's phone and says on its own face that only a person
can close it.** So there is no criterion on this card an unattended session can move, and the brief
for such a session is explicit: stop, say so, leave the criteria open, do not answer it yourself.

**What the twenty entries above actually are.** Every one of the last 20 opens `RESULT: partial` and
closes on the same sentence, `#8 needs a person`. Each added one self-test to a different stage of
the campsite pipeline and about 60 lines of prose about it. The tests are real and I have not touched
them; the suite is green at 279. But none of them was asked for by an open criterion, and the loop
was not choosing to write them -- it was restarting a finished card and finding nothing else to do.

**It has now cost a reader, measurably.** This card is **208 KB across 3,044 lines**, and the file
reader refused it at my session start: over the 200 KB whole-file limit. A session sent here can no
longer read the card it was sent to work. `docs/board/README.md` names this exact failure under
`## Comments` -- a card written to "without having anything new to say", grown "too large for the
agent file reader that had to open it" -- and rules that the writer upstream is the defect, not the
log, and that only a person may prune. So I raised **`0055`** rather than cutting anything.

**One line changed on this card, and it is the fix for the cause.** The frontmatter now carries
`not_for_the_loop:`, naming #8's phone check as the reason. Per the README that key is exactly for "a
step only a person can take ... a browser check on a screen", it keeps the unattended loop off the
card and grants nothing else, and it moves no lane. Without it the loop restarts this card every
time, which is what produced the 20 entries above. **No criterion was ticked, reworded or reopened.**

**Suite:** `node scripts/selftest.js`, 279 passed, 0 failed, run from this worktree. There is no
`vendor/` in this repository, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and
were not run. This project has never had a PHP suite.

**No `CACHE` / `BUILD` bump and no `docs/HANDOVER.md` edit.** Nothing under `app/` or `scripts/`
changed, and the self-test count is unchanged at 279, so HANDOVER is already correct.

**What #8 still needs, unchanged:** aeroplane mode, relaunched cold from the Home Screen icon, tap
into the Campsites tab while offline. It is card 0001 check 5, and 0001 is in `human-review/`.

**2026-09-20** **Decided:** criterion #8 is met. Rob, today: the app "has worked without fail any
time I have tried to use it while on my road trip to and around scotland", and he is calling the
offline check a success.

That is the criterion as written, met in the conditions it was written for. #8 asked for the larger
dataset to still work fully offline on the device, and a week of Scottish forest car parks is a
harder test than the aeroplane-mode run the card specified, not an easier one. It is marked
`proves: manual` with his name and the date against it, because that is what settles a criterion no
test here can reach.

**This also closes card `0001` check 5**, which #8 was pinned to, and with it the last unevidenced
success criterion in the PRD.

**The one thing it does not prove.** The offline path is still not safe to change by inspection.
The worst bug this project has had was the service worker writing map tiles into the app's offline
cache until iOS evicted the app along with them, and it was found by running the thing. See
DECISIONS 2026-08-08, "The offline cache holds ASSETS and nothing else".

**Moving to `ai-review/`, which this card has never had.** It is the largest single change since the
map and no adversarial pass has ever read it. Three things are worth real scepticism, and they are
not the ones the fifty-one pruned entries kept circling: the filter in `takes_a_van()` that decides
what a campervan can actually get into, whether the ODbL Collective Database argument in
`## The licence is different from everything else here` holds, and whether 3,574 more markers have
broken the map's clustering or its label collisions.

**`not_for_the_loop:` is removed.** Its stated reason was #8, an offline check on Rob's phone that
no session could run. #8 is closed, so the reason is spent, and leaving the key on would strand a
finished card. Nothing else about this card reaches outside the repository.
