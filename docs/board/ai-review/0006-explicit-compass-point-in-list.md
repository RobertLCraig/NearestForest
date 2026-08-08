# Show the cardinal point, not just a bearing arrow

## Why
Rob's first real phone test, 2026-08-08: the arrow alone is ambiguous in a car. "I might be
travelling south, but the arrow would be pointing north, while I in the car would think it's
straight ahead." The arrow is a true-north compass bearing, not a heading-relative instruction, and
nothing on screen said so. The cardinal letter existed but lived in a `title` attribute, which a
phone never renders.

## Not this card
Not a live compass that rotates with the phone's heading: that needs `deviceorientation`, a
permission prompt, and it would be wrong the moment the phone is face-up in a cradle. Not road
directions. Not the map (card 0007). Not changing how the bearing itself is calculated.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN a site row is rendered with a known position, THE APP SHALL display the cardinal
      point as text (N, NE, E, SE, S, SW, W, NW) next to the arrow, not only as a tooltip.
- [x] #2 WHEN the detail sheet is opened for a site, THE APP SHALL phrase the bearing as a bearing
      from the user, for example "10.8 miles NE of you".
- [x] #3 WHEN a screen reader reads a row, THE APP SHALL announce the spoken point name
      ("north-east") rather than the abbreviation, which VoiceOver pronounces as "nee".
- [x] #4 WHEN the app or its data changes, THE APP SHALL ship a bumped service-worker CACHE key so
      installed copies do not keep the old markup.
<!-- AC:END -->

## Tasks
- [x] Render `NF.POINTS[idx]` beside the arrow glyph in the distance column
- [x] Add `POINT_NAMES` to `core.js` for the aria-label
- [x] Style the letters at mileage weight rather than the dimmed unit weight
- [x] Self-test that `POINTS` and `POINT_NAMES` stay aligned, so the two cannot drift apart
- [x] Bump `CACHE` in `app/sw.js`

## Direction
**2026-08-08** Shipped and deployed. Worth a sceptical read on one point in review: the letters
widened the distance column from 74px to 84px, which squeezes the name column. Not checked on the
narrowest phone in portrait with a long name like "Kings Wood and Challock Forest".
