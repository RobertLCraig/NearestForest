# Close the open tile proxy

## Why
`api/tiles.php` was a free tile server for the internet, on our Thunderforest quota. It was recorded
as closed, in these words: "a request carrying a foreign `Referer` is refused 403, so the endpoint
is not a free tile server on our quota". The first half was true and the conclusion did not follow. A penetration test on 2026-08-10 got a real 256x256 PNG out of the live endpoint three
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

## Links

**Relates to**
- `0009` - built this endpoint and wrote the wrong conclusion quoted above. The sentence is on that
  card's Direction thread, corrected in place on 2026-08-10.
- `0010` - rotates the key this endpoint holds. The two are independent: after this card the quota
  cannot be spent by a stranger, and the key is still one that has been in a transcript.
- `0008` - built the bundled outline that keeps the map working when the quota is gone, which is
  what bounds this defect to a cost rather than an outage.

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
- [x] #5 WHEN the tile layer is switched on from the app itself, THE APP SHALL draw tiles as
      it did before.
<!-- AC:END -->

## Tasks
- [x] Require `Sec-Fetch-Site: same-origin` when the header is present
- [x] Keep the `Referer` check for older clients, comparing host without port
- [x] Per-address daily cap, counted only for requests that would reach upstream
- [x] Self-tests for both layers, including that the cap never keys on a forwarded header
- [x] Verify against the live endpoint after deploy
- [x] Toggle Tiles on in the deployed app and confirm the tiles still arrive
- [x] Confirm the same on the phone

## Plan
Two layers, because neither is enough alone.

**`Sec-Fetch-Site`** is a forbidden header name: a page cannot set it, and `referrerpolicy`, a meta
tag and `fetch()` options all leave it alone. That kills the hotlink case outright. Absent means a
non-browser client, which is allowed through rather than refused, because failing closed there
would break the `curl` path this endpoint is checked with and anything older than iOS 16.4.

**The per-address daily cap** is what bounds a script, which can send any header it likes. A
counter file per address per day under the system temp directory: no database, no dependency on
APCu being compiled in, and the OS clears it up. Keyed on `REMOTE_ADDR` and deliberately never on
`X-Forwarded-For`, because this origin is reached directly, so that header is attacker-supplied,
and a limiter reading a spoofable key is worse than none: it reports that it is working.

Two deliberate imperfections, both the right way round. The read-modify-write is not locked as a
pair, so heavy concurrency from one address undercounts by a few: a leaky cap costs a few tiles, a
lock costs a slow map. And every failure path serves the tile, because the cap guards spending and
must never become a new way for the map to break.

## Direction
**2026-08-10** Built and deployed, and re-tested against the live endpoint with the same three
requests that broke it. Cap set at 2000/address/day: a whole-country pan at every zoom is a few
hundred, and the app caps itself at 300 tiles in memory, so a real user is nowhere near it.

### 2026-09-07 review (v20260907141410-d567)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I checked each box against the code in `app/api/tiles.php` and `scripts/selftest.js`.

**#1 cross-origin refused, even with no Referer** ÔÇö top-level guard in `app/api/tiles.php` (the `$fetchSite` check before `rateLimit()`): any `Sec-Fetch-Site` that is not `same-origin` returns 403. A page cannot set that header, so `referrerpolicy="no-referrer"` does not help it. The old `Referer` check is kept below it, comparing host without port.

**#2 own map still served** ÔÇö `app/map.js` `tile()` sets `t.img.src = 'api/tiles.php?...'`, a relative same-origin URL, so the header is `same-origin` and passes. `app/sw.js` `fetch` handler returns early for `/api/`, so the request reaches the server unchanged.

**#3 429 without calling upstream** ÔÇö `rateLimit()` runs before `readKey()` and `curl_init`, and `fail(429, ÔÇª)` exits there.

**#4 counter failure still serves** ÔÇö every path in `rateLimit()` (`mkdir` fail, unreadable file, suppressed `file_put_contents`) returns or continues; none refuse.

**#5 draws as before** ÔÇö draw order and default-off are unchanged; `selftest.js` still asserts tiles draw after `ctx.fill()`.

I tried the no-referrer hotlink, a spoofed `Referer`, and `curl`; only the last gets through, and the cap bounds it.

VERDICT: sound

**scope: sound**

I attacked the scope of card 0012.

**Inside the fence.** In `app/api/tiles.php`, the only new code is `rateLimit()`, the `CAP_PER_DAY` constant, the `Sec-Fetch-Site` gate and the host-without-port fix in the `Referer` gate. Every item under "## Not this card" is untouched: `nearest.php` gets no limiter, the `STYLES` whitelist still holds all ten entries, `app/.htaccess` gains no WAF, deny or tile rule, no server-side tile cache exists, and the provider is unchanged. The other files in commit `de37fb2` (`NF.safeHref` in `app/core.js`, the CSP block in `app/.htaccess`) belong to cards 0013 and 0011, not this one.

**Both layers land.** `rateLimit()` runs before `readKey()` and `curl_init`, so the 429 path spends nothing upstream. Live check just now: no headers ÔåÆ 200, `Sec-Fetch-Site: cross-site` ÔåÆ 403, foreign `Referer` ÔåÆ 403.

**One quiet growth, small.** `rateLimit()` also sweeps old counter files with `glob`/`unlink`, which the Plan said was not needed ("the OS clears it up"). It is scoped to its own directory and cannot break a request. Not worth a bounce.

Nothing left half done that I can cite.

VERDICT: sound

**breakage: defect**

**Breakage review ÔÇö card 0012**

**1. The cap keys on an address, but the users share one.** `rateLimit()` in `app/api/tiles.php` counts per `REMOTE_ADDR`. This app's main case is a phone on mobile data, and UK carriers put many subscribers behind one public address (CGNAT). The card sizes 2000/day as "a real user is nowhere near it" ÔÇö that reasoning is per user, the code enforces per address. The two are not the same rule, and nothing in the code or `docs/DECISIONS.md` records the gap.

**2. A 429 or 403 blanks tiles for the whole session, with no sign.** `getTile()` in `app/map.js` stores the failed tile in `tiles` with `ok:false`, and `failed` is never read. Nothing retries, and `setTiles()` does not clear `tiles`. This card adds a new way to get a non-200 (`fail(429, ÔÇª)` and `fail(403, ÔÇª)` in `app/api/tiles.php`), so the cap can leave the map permanently plain until reload. The user is told nothing. `scripts/selftest.js` asserts the PHP text only; no test builds the 429 path or the client's reaction to it.

Everything else held: callers, docs, card 0009's correction, and the `X-Forwarded-For` rule all agree.

VERDICT: defect

