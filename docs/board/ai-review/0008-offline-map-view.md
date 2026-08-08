# Map view with the bundled offline outline

## Why
Decided on card 0007. A distance-sorted list answers "what is nearest" but not "what is over that
way", and it cannot show that two of the top five sit behind the South Downs. This is the half that
works with no signal, so it is the half the app's promise rests on, and it must be complete and
usable on its own before any tile layer goes near it.

## Not this card
Not the tile layer, not a provider account, not a key: that is card 0009, and this must look
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
