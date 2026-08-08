# Optional tile layer over the offline map

## What I need from you
**Choose a tile provider and create the account**, then tell me which one. I cannot: it needs a
signup, it may need card details even on a free tier, and the choice has a cost and a privacy
consequence that is yours to accept.

Blocked on that. Everything else about this card is buildable once a provider exists.

Three that suit a personal app, all with a free tier:

1. **MapTiler** — free tier around 100k tiles/month, UK-styled maps available.
2. **Thunderforest** — has an "Outdoors" style showing woodland and footpaths, which is the closest
   to what Forestry England render.
3. **Ordnance Survey Maps API** — OS Leisure styling, the most recognisable basemap for British
   forests, free tier for personal use.

What to tell me: which provider, and whether you would rather the key sat in a gitignored file on
the server and got proxied through `api/tiles.php` (keeps it out of the public repo, costs a hop),
or be a domain-restricted key embedded in the client (simpler, only usable from our own domain).
My recommendation is **Thunderforest Outdoors, proxied**, because woodland and footpath detail is
what actually helps here and proxying keeps a public repo clean.

## Why
Card 0007 decided the map gets real tiles when there is signal, layered over the bundled outline
from card 0008, behind a toggle that is off by default. Tiles buy familiarity and road context;
they must never be load-bearing, because the app exists for places with no signal.

## Not this card
Not the offline map itself (0008), which must already look finished without this. Do not make the
map depend on tiles, do not enable them by default, and do not remove the outline underneath.
Do not commit a key.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the tile toggle is off, THE APP SHALL make zero network requests, as it does today.
- [ ] #2 WHEN the tile toggle is on and a connection exists, THE APP SHALL draw tiles beneath the
      site markers and above the bundled outline.
- [ ] #3 IF a tile request fails or times out, THEN THE APP SHALL keep the bundled outline visible
      and SHALL NOT leave blank or grey areas.
- [ ] #4 WHEN the repository is inspected, THE APP SHALL contain no provider key.
<!-- AC:END -->

## Tasks
- [ ] Record the chosen provider and key handling in DECISIONS
- [ ] Tile fetch with a timeout, an in-memory cache, and cancellation on pan
- [ ] Toggle control, defaulting to off, remembering the last choice locally
- [ ] Verify acceptance #1 with the network panel: toggle off must be silent
