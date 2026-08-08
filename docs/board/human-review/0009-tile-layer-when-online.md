# Optional tile layer over the offline map

## What I need from you
**Provider chosen 2026-08-08: Thunderforest.** One action left, and only you can do it:

1. Sign up at <https://www.thunderforest.com/pricing/> (the free Hobby plan is 150k tiles/month,
   which this will not come close to) and copy your API key.
2. Put it on the server, outside the web root so it can never be served:

       ssh hostinger "printf '%s' 'YOUR_KEY_HERE' > ~/domains/forestlocator.enhanceify.co.uk/tiles.key && chmod 600 ~/domains/forestlocator.enhanceify.co.uk/tiles.key"

   *Pass:* `ssh hostinger "ls -l ~/domains/forestlocator.enhanceify.co.uk/tiles.key"` shows a
   `-rw-------` file. Do not paste the key into chat or into the repo; it belongs only in that file.

Then tell me it is in place and I will build the layer against it.

**Do not commit the key**, and note it lives one directory *above* `public_html`, so even a
misconfigured Apache cannot hand it out.

Blocked on that. Everything else about this card is buildable once a provider exists.

Rob picked Thunderforest from MapTiler / Thunderforest / Ordnance Survey. Its **Outdoors** style
shows woodland and footpaths, which is the closest of the three to what Forestry England render and
the most useful detail for this particular job.

Key handling follows the recommendation: **proxied through `api/tiles.php`**, key in a file above
the web root. The repo is public, so an embedded key would be readable by anyone; a proxy also means
the key can be rotated without redeploying the app.

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
