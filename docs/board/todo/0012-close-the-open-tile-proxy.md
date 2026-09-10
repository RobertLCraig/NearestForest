# Close the open tile proxy

## What I need from you

**One decision.** A reviewer says this card is not finished, but only you can untick a box. Either
untick the criteria the finding disproves and send the card back to `todo/`, or say in the thread
below that the finding is wrong and the card closes as it stands.

---

**What's wrong.** The card is ticked 5 of 5 and reads as done, and the reviewer's `breakage: defect`
verdict at the end of `## Direction` says two things are not:

1. **The cap counts per address, but the sizing argument was per user.** `rateLimit()` in
   `app/api/tiles.php` keys on `REMOTE_ADDR`, and UK mobile carriers put many subscribers behind one
   address. So "a real user is nowhere near 2000/day" may not hold for a whole carrier. Criterion #3.
2. **A 429 or 403 blanks the tiles for the rest of the session, silently.** `getTile()` in
   `app/map.js` stores the failed tile and nothing retries or tells the user. This card added the new
   ways to get a non-200, so it created the path. Criteria #2 and #5.

**Cause.** A reviewer is forbidden from editing acceptance, so the card came back with every box
still ticked. Every unattended session since has found nothing open to do and promoted it again on
those boxes. Only a person can break that loop.

**Pass** is either one of:
- one or more of #2, #3 and #5 unticked, and the card moved to `todo/` for the fix; or
- an entry in the thread saying which part of the finding is wrong and why, with the card left ticked.

**Fail** is leaving it as it is. The card returns to this lane on the next sweep and nothing changes.

**Why it needs you.** The reviewer graded `acceptance: sound` and `scope: sound`, so the finding is
about a risk the card accepted rather than work it skipped. Whether a shared carrier address is worth
the code, and whether a silently plain map is a defect or a bounded cost, is a judgement about your
quota and your users, not a lookup.

**Note on length.** This card is now 173 lines against a 100-line budget. The `## Direction` and
`## Comments` threads are append-only and hold most of it, so this card could not bring it under.

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


## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 5 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 5 of 5 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-10** Rob's call, answering the queue: **re-run this card through `ai-review/`.** It met
its own acceptance - the reviewer graded that lens `sound` - and the finding that returned it is
next door to the card rather than inside it. A builder could not act on it and a reviewer may not
untick a box, so the card sat here fully ticked while every unattended run promoted it again. It is
not closed and it is not reopened. It goes back for a fresh adversarial pass with the earlier
verdicts still on the thread, and that pass decides whether the finding is this card's to carry.

### 2026-09-10 review

**suite**

The earlier pass said it could find no suite. There is one: `node scripts/selftest.js`, green at
`280 passed, 0 failed` before and after this review.

**This pass ran the endpoint instead of reading it.** Every previous check on this card was a
regex over `app/api/tiles.php`; no test has ever executed the PHP. I served the app with
`php -S 127.0.0.1:8792 -t app` and drove the real script. It has no `tiles.key` locally - the key
lives above the web root on the server - so a request that gets *past* the access control lands on
`503 ... no API key file found`. That makes 503 a clean "allowed through" signal and lets the whole
gate be measured.

**acceptance: sound**

**#1 cross-origin refused, even with the page suppressing its own Referer.** `Sec-Fetch-Site:
cross-site` -> 403. `same-site` -> 403. `none` (a pasted URL) -> 403. `SAME-ORIGIN` in capitals ->
403, so the comparison is case-exact. A foreign `Referer` -> 403. A page cannot set
`Sec-Fetch-Site`, so `referrerpolicy="no-referrer"` buys an attacker nothing.

**#2 the app's own map still served.** `Sec-Fetch-Site: same-origin` -> 503, i.e. through the gate.
Confirmed in a browser at 127.0.0.1:8792: twelve tile requests went out on the toggle and every one
reached the script.

**#3 429 without calling upstream, proved rather than argued.** With the counter pre-seeded to
2000, the endpoint returns **429 with `Retry-After: 3600`** - *not* the 503 it returns when it
reaches `readKey()`. The 429 arriving in place of the 503 is the proof that `rateLimit()` runs
before the key is read and before `curl_init`, so a capped request spends nothing.

**#4 counter failure still serves.** Counter contents replaced with `not-a-number` -> 503 (served
through). The counter *directory* replaced by a plain file, so `mkdir` cannot succeed -> 503
(served through). Seeded at 1999 -> served, and the file read 2000 afterwards, so the increment
works.

**#5 draws as before.** Draw order and default-off unchanged; the bundled outline drew under
everything throughout.

**Input validation, which no criterion covers and which I attacked anyway:** missing `z`, `z=21`,
`z=-1`, `z=6.5`, `x=abc`, `x` out of range for the zoom, `s=../../etc/passwd`, `s[]=outdoors` and
`s=evil` all return 400 with no upstream call. `s=landscape` is accepted, as the whitelist intends.

VERDICT: sound

**scope: sound**

Agreeing with the 2026-09-07 pass and re-checked: `nearest.php` still has no limiter, `STYLES`
still holds ten entries, `.htaccess` has no WAF or tile rule, there is no server-side tile cache
and the provider is unchanged. The one growth the earlier pass noted, the `glob`/`unlink` sweep of
yesterday's counters, is still there, still scoped to its own directory, and still too small to
bounce a card for.

VERDICT: sound

**breakage: defect**

**1. A refused tile blanks the layer until a full reload, and the app says the opposite.** Measured
in a browser rather than read off the source. With every tile failing, the toggle reads **Tiles
on**, `aria-pressed="true"`, and the credit pill under the map reads "Maps (c) Thunderforest, Data
(c) OpenStreetMap contributors" - an attribution for a basemap that is not on screen. Nothing tells
the user anything; the only trace is twelve 503s in a console they do not have.

![tiles on, no tiles](../attachments/0012-2026-09-10-1.png)

Then the part that makes it stick: **toggling Tiles off and back on issued zero new requests.**
Twelve before, twelve after. `getTile` in `app/map.js` caches the failed entry in `tiles` with
`ok:false`, `t.failed` is set on line 176 and read nowhere, and `setTiles` does not clear the
cache. So one 429 - which is a thing this card newly created - costs the user the tile layer for
the rest of the session with no way back except reloading the page, and no clue that reloading is
the way back. The card's bounded-cost argument ("the map still works") is true and is not this:
the map working is not the same as the app answering for a control the user just pressed.

**2. The counter filename does not do what its comment says it does.** `rateLimit()` names each
file `hash('sha256', $ip)` and the comment says "Hashed so the counter directory is not itself a
log of who used the app". Unsalted SHA-256 over IPv4 is a 2^32 space. I recovered `127.0.0.1` from
its own counter filename in **108 ms** and measured about 1.2 million hashes a second in
single-threaded node, which puts the entire address space at roughly an hour on this laptop and
seconds on a GPU. The directory *is* a log of who used the app, dated, one file per address per
day; the hash is a speed bump described as a lock. Salting it with a per-install secret is a
one-line fix, and deleting the sentence is a zero-line one - but leaving a comment that claims a
protection it does not provide is how the `.htaccess` bug on card 0011 happened.

**3. The CGNAT point from 2026-09-07 stands, and is the least of the three.** `rateLimit()` counts
per `REMOTE_ADDR` while the 2000/day sizing argument was per user, and UK carriers put many
subscribers behind one address. It is worth far less than finding 1, because with finding 1 fixed a
shared-address cap is a visible, recoverable condition instead of a silent dead layer.

VERDICT: defect

**security**

**Weakest, said as an attacker would use it.** An absent `Sec-Fetch-Site` is allowed through on
purpose, so the browser hotlink case is dead but every non-browser client is not: `curl`, a script,
a native app, a server-side scraper. One address buys 2000 tiles a day; a few hundred cheap proxies
or a botnet, each looking exactly like one ordinary user, empty the 150k-a-month free tier inside a
day. Nothing in the app or the repository notices - the only place that shows is Thunderforest's own
dashboard, which nobody is watching, and the first symptom for a real user is the silent blank map
in finding 1. The cost is a quota rather than an outage, which is the card's own bound and is
correct; the point is that it can be spent deliberately and quietly.

**What is unchecked on any path in.** `X-Forwarded-For` is deliberately ignored and I confirmed it:
sending `X-Forwarded-For: 9.9.9.9` against a capped address still returns 429, so the key cannot be
reset by a header. But `HTTP_HOST` is attacker-supplied and it is the right-hand side of the
`Referer` comparison, so `Referer: https://evil.com/` sent alongside `Host: evil.com` walks through
that gate. It costs nothing because any client able to set `Host` could simply omit `Referer`
instead - which means the `Referer` layer protects nothing that `Sec-Fetch-Site` does not, and only
one of the two layers is load-bearing. The other unchecked input is environmental rather than from
a request: `sys_get_temp_dir()` is whatever the host says it is, and on shared hosting that is
commonly a world-writable `/tmp`. A co-tenant who creates `/tmp/nf-tiles` before we do owns the
rate-limit state and can seed any address to 2000, denying that person the tile layer.

**What it leaks when it fails.** The response bodies are clean and I checked each one: 502 says
only "Tile upstream unreachable" and never echoes `curl_error`, which would carry the URL and
therefore the API key; 503 discloses only that a key file is absent; 429 gives a `Retry-After` and
nothing else; the 400s name the valid ranges, which is help rather than disclosure. The leak is not
in a response at all - it is the counter directory described in finding 2, which is a reversible,
dated list of every address that used the app.

VERDICT: defect
