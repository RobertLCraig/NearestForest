# Map view with the bundled offline outline

## What I need from you

**One answer. Untick `#1` and `#2` and send this card back to `todo/`, or say on this thread why the
reviewer's finding is wrong?**

**Pass** is either of:
- you untick `#1` and `#2` and the card returns to `todo/`, so a session can fix the latch and prove
  it with a test.
- you leave all six ticked and add a `## Comments` entry saying why the finding does not disprove
  them. Then the card can close on the record rather than on the boxes.

**Fail** is the card staying here with six ticks and nothing written. That is the loop it is already
in: the reviewer returned it, every unattended session since found nothing open to do, and the loop
promoted it again on the ticked boxes.

**What's wrong.** One failed fetch of `data/boundary.json` blanks the map for the rest of the page's
life. No coastline, no site markers, no own-position dot, no retry, and no test covers the case.
Closing and reopening the map repaints the same error. That is `#1` and `#2` as they are written.

**Cause.** `loadBoundary` in `app/map.js` latches on `loadError`, and `draw()` returns before the
marker block, so markers that never needed the boundary die with it.

**Why it needs you.** A reviewer may not edit acceptance and a builder may not overrule a review
verdict. Unticking a criterion somebody else ticked is a person's call.

**Note on length.** This card is now 151 lines against a 100-line budget. `## Direction` and
`## Comments` are append-only, so nothing here can cut it back; the section above was kept tight
instead.

## Why
A distance-sorted list answers "what is nearest" but not "what is over that way", and it cannot show
that two of the top five sit behind the South Downs. This is the half that works with no signal, so
it is the half the app's promise rests on, and it must be complete and usable on its own before any
tile layer goes near it.

## Links

**Relates to**
- `0007` - the decision card that settled that the app gets a map at all, and that the map is an
  offline outline first with tiles layered on top. This card builds the first half of that answer.
- `0009` - builds the second half, the optional tile layer. It is deliberately a separate card so
  that this one has to look finished with no network at all.

## Not this card
Not the tile layer, not a provider account, not a key: that is card `0009`, and this must look
finished without it. No routing, no directions, no offline search by area. Do not add a second
dataset: the markers come from the existing `sites.json` and nothing else. Do not reproject the
site coordinates in storage; they stay WGS84 per DATA-MODEL and are projected at draw time only.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN the map view is opened with no network connection, THE APP SHALL draw the coastline
      outline and every site marker without making any network request.
- [x] #2 WHEN a position fix exists, THE APP SHALL mark the user's own position distinguishably
      from the site markers and open centred near it.
- [x] #3 WHEN a site marker is tapped, THE APP SHALL open the same detail sheet the list opens,
      including the Navigate button.
- [x] #4 WHEN the active tab is Forests or Car parks, THE APP SHALL plot only that source, matching
      the list.
- [x] #5 WHEN the map is pinched or dragged, THE APP SHALL pan and zoom smoothly and SHALL NOT
      allow the view to be lost off-screen with no way back.
- [x] #6 WHEN the boundary data is generated, THE APP SHALL fail the build loudly rather than emit
      a partial or unprojected outline, matching how `parse.py` treats the site data.
<!-- AC:END -->

## Tasks
- [x] Add a build step fetching a boundary from a public-domain or OGL source, cached to `data/raw/`
      like the other fetches so re-runs cost zero requests
- [x] Simplify it to a measured vertex budget; record the resulting byte size rather than guessing
- [x] Emit `app/data/boundary.json`, generated and never hand-edited
- [x] Web Mercator projection helpers in `core.js` (pure, so the self-tests can cover them)
- [x] Canvas map view: outline, markers, own position, pan, pinch zoom, tap hit-testing
- [x] Self-tests for the projection and for hit-testing, since both are pure maths
- [x] Bump `CACHE` in `app/sw.js` and add `boundary.json` to the precache list

## Direction
**2026-08-08** Built and shipped. Notes for whoever reviews it, including what was *not* verified:

- Outline is 32KB for all of Great Britain: Natural Earth 1:10m subunits, Douglas-Peucker at 0.004
  deg (~450m), islets under 0.004 sq deg dropped. 7,238 vertices down to 3,767.
- Registration is checked rather than assumed: **all 904 sites fall inside the outline**, and the
  self-tests assert four known inland forests are inside and two open-sea points are outside.
- The gestures have only ever run against a stubbed canvas in node, which caught runtime errors and
  showed 32 labels at the default zoom (now capped at 12). **It cannot tell you whether a pinch
  feels right on glass.** That is the main thing to be sceptical about.
- Not checked: behaviour on a slow phone with 630 car park markers on screen at once, and whether
  the 22px tap radius is comfortable with a thumb rather than a mouse.

### 2026-09-07 review (v20260907075640-8512)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I traced each criterion to real code.

**#1 offline draw** ÔÇö `loadBoundary` and `draw` in `app/map.js` read only `data/boundary.json`; that file plus `map.js` are in `ASSETS` in `app/sw.js`, precached with `cache:'reload'`. Tiles default off (`init` reads `nf.tiles`, `setTiles`), so nothing else goes out.

**#2 own position** ÔÇö `draw` in `app/map.js` paints your dot last, 7px, inverted fill with an ink ring, unlike the 3.5px site dots. `show` calls `fitToInterest`, which fits you plus the nearest six.

**#3 same sheet** ÔÇö `onUp` in `app/map.js` calls `hooks.onPick`, wired in `app/app.js` to `openSheet`, the same function the list rows use. `#sheet-nav` (Navigate) is in `app/index.html`.

**#4 tab filter** ÔÇö `draw` uses `hooks.getSites()` = `RENDERED`, set by `render` in `app/app.js` from `NF.rank(DATA.sites, TAB, ÔÇª)`. Same list as the rows.

**#5 pan/zoom** ÔÇö `onDown`/`onMove`/`onUp`, `zoomAbout` and `clampView` in `app/map.js`; centre is held inside the bbox plus half a viewport, scale inside `computeScaleLimits`.

**#6 loud build** ÔÇö `build` and `main` in `scripts/build_boundary.py` collect `failures`, write nothing, and `sys.exit(1)`.

`node scripts/selftest.js`: 227 passed, 0 failed.

VERDICT: sound

**scope: sound**

I read the card's actual commit (`5b84e5b`) rather than today's files ÔÇö the later tile code in `app/map.js` belongs to card `0009`, not this one.

**What I checked against the fence**

- No tile layer in the shipped commit. `app/index.html` gained no tile button, `app/map.js` at that commit has no `getTile`/`drawTiles`/provider key. The fence held.
- No second dataset. `app/app.js` `NFMap.init` feeds the map `RENDERED`, the same ranked list the rows use, so the tab filter is shared, not re-implemented.
- No reprojection in storage. `scripts/build_boundary.py` `encode()` writes WGS84 fixed-point; `app/map.js` `decodeRing` and `draw` project with `NF.projX`/`projY` at draw time.
- No routing. Tapping calls `hooks.onPick`, which is the existing `openSheet`.
- Every task done: cache in `fetch_source()`, budget checks in `build()`, `sw.js` `ASSETS` gained both new files with the `CACHE` bump.

**The one thing I nearly failed it for**

The commit also rewrote the "no external requests at runtime" rule in `CLAUDE.md` to pre-permit the tile layer, and added the matching `docs/DECISIONS.md` entry. That is `0009` ground. I let it stand: it is the written output of decision card `0007`, which the same commit closed, and the pipeline line in that file had to change anyway for `build_boundary.py`. No tile code rode in with it.

VERDICT: sound

**breakage: defect**

I read `app/map.js`, `app/core.js`, `app/app.js`, `app/sw.js`, `scripts/build_boundary.py`, and ran the suite the harness missed: `node scripts/selftest.js` ÔåÆ **227 passed, 0 failed**. I tried the projection, the clamp, the pinch maths, the cluster/hit-test agreement, the tab wiring (`getSites` returns `RENDERED`, so the map cannot disagree with the list), and the campsite dataset added after this card (all 3,681 points fall inside `boundary.json`'s bbox). Those hold.

One thing breaks and nothing tests it.

`loadBoundary` in `app/map.js` latches its failure: `if (boundary || loadError) return Promise.resolve()`. One failed fetch of `data/boundary.json` disables the map for the whole page life. Closing and reopening the map re-runs `show()`, which hits the latch and repaints the same error. There is no retry path, and no self-test builds the failure case.

It costs more than the outline. `draw()` returns straight after the error text, before the marker block, so a missing 32KB coastline also erases every site marker and the own-position dot ÔÇö data that does not depend on the boundary at all. That is AC #1 and #2 gone from one transient fetch.

VERDICT: defect


## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 6 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 6 of 6 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-10** Rob's call, answering the queue: **re-run this card through `ai-review/`.** It met
its own acceptance - the reviewer graded that lens `sound` - and the finding that returned it is
next door to the card rather than inside it. A builder could not act on it and a reviewer may not
untick a box, so the card sat here fully ticked while every unattended run promoted it again. It is
not closed and it is not reopened. It goes back for a fresh adversarial pass with the earlier
verdicts still on the thread, and that pass decides whether the finding is this card's to carry.
