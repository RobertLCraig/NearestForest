# Close the open tile proxy

## Why
`api/tiles.php` was a free tile server for the internet, on our Thunderforest quota. Card 0009's
Direction entry recorded that "a request carrying a foreign `Referer` is refused 403, so the
endpoint is not a free tile server on our quota". The first half was true and the conclusion did
not follow. A penetration test on 2026-08-10 got a real 256x256 PNG out of the live endpoint three
ways:

    curl "…/api/tiles.php?z=6&x=31&y=20"                          -> 200 image/png 15456 B
    curl -H "Referer: https://forestlocator.enhanceify.co.uk/" …   -> 200 image/png
    <img referrerpolicy="no-referrer" src="…/api/tiles.php?z=…">   -> 200, from any origin

The check only ever ran when a `Referer` was present, and the comment above it called a missing one
allowed so `curl` and the Shortcut would work. The third case is the one that matters: one HTML
attribute on somebody else's page, no server of their own, nothing to trace.

The ceiling is bounded and worth stating so nobody over-reacts: the free tier is 150k tiles a
month, and when it is gone the tiles stop and **the map still works**, because the bundled outline
is never removed and a self-test enforces that draw order. This costs a quota, not an outage.

## Not this card
Not rate-limiting `api/nearest.php`. The same review measured it at ~65 ms a request with ten
concurrent showing no degradation, so re-parsing 515 KB per request looks alarming and is not a
lever. Not a WAF, not moving the DNS record behind the Cloudflare proxy, not server-side tile
caching, not changing provider. Not trimming the ten-entry style whitelist either: every style
costs the same quota, so removing nine would be tidying dressed as hardening.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN a tile is requested by a page on another origin, THE APP SHALL refuse it, including
      when that page suppresses its own `Referer`.
- [x] #2 WHEN a tile is requested from the app's own map, THE APP SHALL serve it as before.
- [x] #3 WHEN one address has requested more than the daily cap, THE APP SHALL return 429 and
      SHALL NOT call the upstream provider.
- [x] #4 IF the counter cannot be read or written, THEN THE APP SHALL serve the tile anyway.
- [ ] #5 WHEN the tile layer is used on the phone, THE APP SHALL draw tiles as it did before.
<!-- AC:END -->

## Tasks
- [x] Require `Sec-Fetch-Site: same-origin` when the header is present
- [x] Keep the `Referer` check for older clients, comparing host without port
- [x] Per-address daily cap, counted only for requests that would reach upstream
- [x] Self-tests for both layers, including that the cap never keys on a forwarded header
- [x] Verify against the live endpoint after deploy
- [ ] Confirm the map still tiles on the phone

## Plan
Two layers, because neither is enough alone.

**`Sec-Fetch-Site`** is a forbidden header name: a page cannot set it, and `referrerpolicy`, a meta
tag and `fetch()` options all leave it alone. That kills the hotlink case outright. Absent means a
non-browser client, which is allowed through rather than refused, because failing closed there
would break the `curl` path this endpoint is checked with and anything older than iOS 16.4.

**The per-address daily cap** is what bounds a script, which can send any header it likes. A
counter file per address per day under the system temp directory: no database, no dependency on
APCu being compiled in, and the OS clears it up. Keyed on `REMOTE_ADDR` and deliberately never on
`X-Forwarded-For` — this origin is reached directly, so that header is attacker-supplied, and a
limiter reading a spoofable key is worse than none because it reports that it is working.

Two deliberate imperfections, both the right way round. The read-modify-write is not locked as a
pair, so heavy concurrency from one address undercounts by a few: a leaky cap costs a few tiles, a
lock costs a slow map. And every failure path serves the tile, because the cap guards spending and
must never become a new way for the map to break.

## Direction
**2026-08-10** Built and deployed, and re-tested against the live endpoint with the same three
requests that broke it. Cap set at 2000/address/day: a whole-country pan at every zoom is a few
hundred, and the app caps itself at 300 tiles in memory, so a real user is nowhere near it.
