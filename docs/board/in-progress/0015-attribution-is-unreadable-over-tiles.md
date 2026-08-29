# The tile attribution is unreadable over tiles

## Why
`.map__hint` does two different jobs with one style. With the tile layer off it says "Tap a marker
for details. Pinch to zoom.", and with it on it becomes the provider attribution, "Maps ©
Thunderforest, Data © OpenStreetMap contributors".

It is styled for the first job: `color: var(--dim)` with `text-shadow: 0 1px 3px var(--bg)`, a
muted green-grey with a dark glow behind it. Over the bundled outline that is exactly right and
reads cleanly. With tiles on, the background stops being dark and becomes a light Thunderforest
Outdoors basemap, and the same muted text with a dark shadow washes out against it. Screenshots
from the phone on 2026-08-10 show it at three zoom levels, greyed into the map and hard to pick
out at a glance.

**The state where that text carries a licence obligation is the exact state where it is least
readable.** Thunderforest's terms and the OpenStreetMap licence both require visible attribution,
and this is the app being handed to other people. That is what lifts it above a styling nit: it is
the difference between crediting the data properly and only appearing to.

**Fresh evidence, and a new reason to do it now.** `docs/img/2026-08-14_Screenshots/IMG_5794.PNG`
and `IMG_5795.PNG` show the same failure four days on, at two zoom levels, the attribution greyed
into the basemap and barely picked out at all. Those shots were taken as candidate attachments for
the enquiry to Forestry England (card 0018), which argues that this project handles data licensing
properly. They cannot be attached while they show the opposite, so this card now gates part of 0018.

## Not this card
Not the marker labels, which collide and truncate over tiles ("Bedgebury National Pi…" sitting on
"Hemsted Forest", "Queen Elizabeth Count…" over "Creech Wood"). Same screenshots, same surface,
genuinely separate problem, and its own card. Not restyling the map controls, which read fine over
both backgrounds because they already carry a solid panel behind them. Not moving the attribution
into the detail sheet or a credits screen: it has to be on the map it credits.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the tile layer is on, THE APP SHALL render the provider attribution legibly against a
      light basemap at every zoom level.
- [ ] #2 WHEN the tile layer is off, THE APP SHALL render the hint exactly as it does today.
- [ ] #3 WHEN either state is shown, THE APP SHALL keep the text clear of the safe-area inset.
<!-- AC:END -->

## Tasks
- [ ] Give the hint a solid backing when, and only when, tiles are on
- [ ] Check it against a light basemap and a dark one, on the phone rather than the desktop
- [ ] Self-test that the attribution string is still present and still tied to the tile toggle

## Plan
The controls above it already solve this problem: they sit on an opaque panel, which is why they
stay readable over both backgrounds. Do the same here rather than inventing something new. A class
toggled alongside `tilesOn` in `setTiles`, giving the text a dark semi-opaque pill and a light
colour, keeps the off state untouched and needs no new element.

Contrast is the whole point of the card, so pick the colours against the lightest part of the
Outdoors style, not against an average.
