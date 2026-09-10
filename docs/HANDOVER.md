# HANDOVER: NearestForest

> An offline iPhone app that finds the closest national forest, car park or campsite and hands it to
> a map app in one tap. Live at https://forestlocator.enhanceify.co.uk/ and installed on Rob's phone.

**Stage:** active
**Category:** app, site
**Status:** Deployed, installed to the Home Screen, and working on the device. **The app is Great
Britain minus Wales in two of its three tabs.** Forests is one ranked list of 550 sites from two
agencies; Campsites covers England, Scotland and Wales; Car parks is England only, because no open
dataset of Scottish forest car parks exists. Map complete (bundled outline plus optional tiles).
**The pipeline runs clean**: `data/raw/` was re-fetched on 2026-09-10 and the dataset rebuilt.
**Built cards are waiting to deploy**; see "Current state". **Checks that cannot fail are this
project's recurring defect**, not a closed chapter: four were fixed on 2026-09-10 and a reviewer
found two more the same day, both in builds whose notes claimed a red-proof that had not been done.
A green run means more than it did. Assume there are others and keep looking.
**This file names no card lists and no card counts.** Five cards in a row wrote one here by hand and
every one was stale within a day, so the rule now is: **list the folder, do not read a number.**
`ls docs/board/todo` and `ls docs/board/in-progress` are what an agent can pick up;
`ls docs/board/human-review` is what waits on Rob; `ls docs/board/ai-review` is the adversarial
queue. A card is named below only where something about that one card cannot be got from the folder.
**The accounts and location-tracking card is `0043`**: it was renumbered from `0022` by card `0042`,
because two different cards carried that number. `0022` now means only the footer-credits card.
The last unevidenced PRD criterion is card **0001** check 5.
**A worktree can be rendered**: serve it yourself with `php -S`, since Herd only serves the main
checkout. See card 0015's second comment entry and card 0016's.
_Last updated: 2026-09-10. What each card did is on its own comment thread under `docs/board/`, and
the commit log is the narrative; what outlived a build is in the sections below, in DATA-MODEL and
in DECISIONS. Do not append a run report here._

## Goal & success criteria

Source of truth: [PRD.md](PRD.md).

Forestry England's own forest finder is close to unusable on a phone in a car. This reduces the job
to: open, read the top of a list, tap once, drive. Success means the nearest site is on screen with
no interaction, one tap reaches turn-by-turn navigation, and the whole thing works with no signal,
because forest car parks are exactly where mobile data dies.

**One success criterion is still unevidenced, and it is the load-bearing one.** Rob has the app on
the Home Screen and confirmed it locates, lists and maps correctly, so the "open, read, tap, drive"
criteria hold on a real device. **Working with no signal has still only ever been checked by serving
locally.** That is card 0001 check 5, not a formality.

## Canonical data shape

Source of truth: [DATA-MODEL.md](DATA-MODEL.md). The essentials a fresh session must not re-guess:

- **One `Site` record** normalises five very different upstream sources. `source` is `forest`,
  `carpark` or `campsite` and drives which tab a record appears in, nothing else. `country` is
  `England`, `Scotland` or `Wales` and drives **nothing at all**. Do not branch logic on either, and
  do not add a country filter or a country tab: a Scottish forest is a forest.
- **The Forests tab is two agencies in one ranked list.** `fe-` ids are Forestry England (274),
  `fls-` ids are Forestry and Land Scotland (276). Both are scraped from a website, both fail the
  build loudly on a shortfall, and the two sites have nothing in common structurally: one is Drupal
  and is read through `field--name-field-*` divs, the other is Umbraco and is read by heading.
- **One record shape, but TWO files, and the split is a licence boundary rather than a modelling
  one.** `app/data/sites.json` is Open Government Licence (Forestry England). `app/data/campsites.json`
  is **ODbL** (OpenStreetMap, plus Forestry and Land Scotland's Stay the Night car parks). They are
  merged into one array in memory at load and **never on disk**. ODbL 1.0 s4.5(a) exempts a
  Collective Database from share-alike; one merged file would invite the argument that the OGL data
  became a derivative of the ODbL one. **A self-test fails if a campsite record appears inside
  `sites.json`.** Do not "tidy" the two files into one.
- **Both are generated, never hand-edited.** 1,180 records / 719 KB and 3,574 records / 944 KB,
  committed on purpose because they are what the app ships. Fix the generator and re-run; do not
  patch the JSON.
- **Campsites and Forests cover England and Scotland (Campsites adds Wales); Car parks is England
  only.** That asymmetry is deliberate and is written into the PRD: no open dataset of Scottish
  forest car parks exists. **Wales is card 0017 and is still open**, blocked on a contradiction
  between NRW's own metadata and data.gov.uk about internet applications.
- **A campsite never shows an open/closed badge.** 97 of 3,574 records publish any hours at all, so
  a badge would be a guess, and a self-test asserts `openState()` returns `unknown` for every one.
- **Coordinates are WGS84 decimal degrees everywhere.** The car park source is EPSG:27700 and is
  reprojected at fetch time by asking ArcGIS for `outSR=4326`. `scripts/parse.py` asserts every
  coordinate falls inside a **Great Britain** box and then inside the box for the country it names,
  so an unprojected value fails the build loudly. **Keep it per country.** Card 0016 widened this
  and deliberately did not loosen it: the records that get reprojected are the English car parks, so
  an England box is the one that catches a bad reprojection, and one box reaching Shetland would
  wave it through.
- **`postcode_satnav` is the one to navigate to, never `postcode_postal`.** They genuinely differ
  (Bedgebury publishes `TN17 2SJ` for sat nav and `TN17 2SL` as its postal code).
- **`opening_summary.access`** is `always` / `dusk` / `hours` / `unknown` and is the primary opening
  field, because most sites publish no clock time at all. Measured over the 274 Forestry England
  forests after the 2026-09-10 re-scrape: 94 always, 102 dusk, 44 hours, 28 unknown, 6 with no
  `opening_summary` at all. **It does not cover the rest of the dataset**:
  269 of the 276 Scottish forests and all 630 car parks carry `opening_summary: null`. `dusk` deliberately stores no closing time; the app computes sunset per site at render.
- **177 car park names are ours, not upstream's, and they are flagged.** 170 were published as
  `Unknown` and 7 as a bare `Car Park`. `scripts/parse.py` names each after its nearest forest
  point (`Car park near Friston Forest`) when one is within **5 miles**, a threshold taken from the
  measured distribution rather than picked. Beyond that it stays `Unnamed car park`. The flag is
  `name_is_derived`, and the list, the detail sheet and the map label all style it dim italic,
  because those names read exactly like official ones. See DATA-MODEL "Closed".
- **Null means "not known" and the UI says so.** Empty string never appears.

## Deployment

**Live: https://forestlocator.enhanceify.co.uk/** Verified 2026-08-08: HTTPS with a valid
certificate, manifest served as `application/manifest+json`, `api/nearest.php` returning Friston
Forest first from Brighton, and neither `/docs/` nor `/.git/` reachable.

Deploying is one command, and it is the same shape as every other site on this Hostinger account:

```powershell
pwsh ./scripts/deploy.ps1        # test, guard the cache key, push, pull on the server
```

The pieces, so a fresh session does not re-derive them:

- **DNS is at Cloudflare, not Hostinger.** `enhanceify.co.uk` runs on Cloudflare nameservers, so
  hPanel does not serve its DNS. One unproxied A record: `forestlocator -> 141.136.33.219`.
  Unproxied matters: Hostinger issues its own Let's Encrypt certificate, and proxying would put
  Cloudflare in front of that validation for no benefit here.
- **The server holds a git checkout and the docroot is a symlink into it:**
  `~/domains/forestlocator.enhanceify.co.uk/public_html -> repo/app`. So a fast-forward pull *is*
  the deploy, nothing is copied, and `docs/`, `scripts/` and the gitignored 142MB scrape cache are
  outside the web root by construction rather than by remembering to exclude them.
- **SSH is already configured**: `ssh hostinger` works from a `~/.ssh/config` alias, and the
  server's own key authenticates to GitHub, which is how it pulls.
- **The vhost is pinned to PHP 8.4.** It came up on 8.3 while the account CLI is 8.4, and that split
  is invisible until it wastes an hour.
- **Do not upload by hand.** `deploy.sh` fails if `public_html` is a real directory rather than the
  symlink, because a pull would then change nothing Apache serves while looking like a clean deploy.
- **The Thunderforest key is a file on the server, not in this repo**, at `tiles.key` in the domain
  directory one level above `public_html`, mode 600. `api/tiles.php` reads it per request, so
  rotating it needs no redeploy. Never commit a key: a self-test greps every tracked file for one
  and `.gitignore` refuses `*.key`. **That guard is line-scoped and skips a path that no longer
  exists, both on purpose.** It once crashed mid-rename and once cried wolf on an unrelated 32-hex
  string. Its own comments in `scripts/selftest.js` say why; do not widen it without reading them.

**HTTPS is not cosmetic here.** iOS grants `navigator.geolocation` only to secure origins, so on
plain HTTP the app loads and silently never locates you. That is also why a self-contained HTML file
opened from the Files app was rejected as an option.

## Architecture / stack

Static files only. No build step, no bundler, no npm, no framework, no database.

```
OGL v3                                                   ODbL 1.0
------                                                   --------
Forestry England website --scrape--+       OpenStreetMap (Overpass, 1 query per country) --+
                                   |                                                       |
ArcGIS FeatureServer --------------+       FLS "Stay the Night" (2 requests) --------------+
                                   |                                                       |
Forestry and Land Scotland --------+                                                       |
  (1 index request + 278 pages)    |                                                       |
                          scripts/fetch.py                                 scripts/fetch_campsites.py
                                   |                                                       |
                                   v                                                       v
                          scripts/parse.py                                 scripts/parse_campsites.py
                                   |                                                       |
                                   v                                                       v
                   app/data/sites.json (1,180)                       app/data/campsites.json (3,574)
                                   |                                                       |
                                   +---------------------+---------------------------------+
                                                         |  merged in memory at load, NEVER on disk
                        +--------------------------------+--------------------+
                        v                                                     v
              PWA (offline, no server)                        api/nearest.php (Shortcut only)
              core.js does the maths                          reads sites.json only, no campsites
```

**The two branches never join on disk, and that is a licence boundary.** See the data shape section
above. `api/nearest.php` and the iOS Shortcut cover the forest tabs only: unaffected rather than
broken, but the two front ends no longer cover the same ground.

The PWA never calls a server. The Shortcut must, because Shortcuts is far too slow to rank 1,180
sites on-device. That split is deliberate and is the thing the two-method comparison is meant to settle.

## Key files / structure

- `app/`, everything that gets served, and nothing else. The vhost docroot symlinks here.
- `app/core.js`, all pure logic (distance, bearing, sunset, opening state, deep links, ranking).
  Loaded as `window.NF` in the browser and `require()`d by the tests, so the tests exercise the
  shipped code rather than a copy. **Put new logic here, not in `app.js`.**
- `app/app.js`, DOM and events only. **All sheet opening and closing goes through
  `showSheet` / `closeSheet`.** A part-dragged sheet carries an inline `transform`, so a path
  that sets `hidden` directly will eventually reopen a panel that is off-screen.
- **UI icons are inline `<svg>` pasted from the Mo~oM 2.2 pack** (`C:\Dev\Mo~oM 2.2/Icons-SVG`,
  outline style), with `stroke="#11181C"` swapped for `currentColor` and a comment naming the source
  `Section/Vector-N`. Do not add an icon as a linked file: inline is what keeps the offline rule and
  the precache list honest. See DECISIONS 2026-08-08. `scripts/make_icons.py` is a different thing -
  it generates the *app* icon (the conifer), which is a real PNG because a manifest needs one.
- `app/api/nearest.php`, mirrors `haversineMi()` from `core.js`. Change one, change both.
- `app/.htaccess`, also carries the security headers (DECISIONS 2026-08-10). **The CSP has no
  `unsafe-inline`, so no inline script, inline handler or `style=` attribute may enter
  `index.html`**; self-tests fail on all four rather than letting it show up as a blank screen on
  a phone. **The `sw.js` cache block must stay below the general `.js` one**: both match `sw.js`
  and the last `Header set` wins, and reversed, the file reads as though the strict value were in
  force while `no-cache` is what actually ships. That was the live behaviour until 2026-08-10.
- `app/sw.js`, precaches everything. **`CACHE` must be bumped whenever the data or app changes**,
  or installed copies keep the old dataset forever. `deploy.ps1` refuses to ship an `app/` change
  that did not bump it, and `core.js` `BUILD` must match the cache name (a self-test enforces it;
  the footer shows it, which is how you tell what a phone is actually running).
  **Install fetches with `cache: 'reload'` on purpose. Do not remove it.** `addAll()` fetches
  through the browser HTTP cache, so without it a fresh cache name gets filled with stale bytes and
  no amount of bumping helps. That is exactly what made the map render on desktop and not on the
  phone on 2026-08-08.
  **The fetch handler must never write to the cache and must skip `/api/`.** `api/tiles.php` is
  same-origin, so a "cache any same-origin GET" rule quietly fills the offline cache with map
  tiles until iOS evicts the whole thing, app included. Self-tests enforce both. See DECISIONS.
- `app/.htaccess`, **the shell is deliberately `Cache-Control: no-cache`.** The service worker
  cache name already versions it, so HTTP-caching code and data buys nothing and breaks updates for
  the reason above. Only images carry a long max-age (`604800`). Do not "optimise" this back: `.js`
  was served `max-age=3600` until 2026-08-08, and that is what filled a fresh cache with old bytes.
- `scripts/fetch.py`, resumable and cached; re-running costs zero requests for pages already held.
  **It records the download date of every file it saves into `data/raw/fetched.json`** (card 0026),
  rewritten after each page so an interrupted run still leaves dated HTML. That index is the only
  honest source of a page's age: a modification time is rewritten by any copy of the tree, and a
  build worktree is a copy.
- `scripts/parse.py`, the only place the HTML shape is understood, for **both** forest sites.
  Exits non-zero rather than emitting a partial dataset. `build_forests()` reads Drupal field divs,
  `build_fls()` cuts sections out by heading, and `COUNTRY_RANGE` keeps the England box tight while
  `GB_LAT_RANGE` covers everything. **`fls_section()` accepts h1 to h4 on purpose**: the same
  section is published at different depths from page to page, and pinning it to one level silently
  found 63 of 269 Scottish postcodes.
  **`fls_opening()` is where the judgement lives.** FLS publishes a heading called "Opening hours"
  that is often about a café, a shop or a visitor centre, so unless the text also carries an
  always-open or dawn-till-dusk statement, `access` is `unknown` and the raw sentence is shown.
  **The English `parse_opening()` has the same trap and does not handle it**, plus it reads `7:30am`
  but not `7.30am`. Both are measured and written into DATA-MODEL's divergences. Card 0016 tried the
  fix and reverted it, because accepting dotted minutes makes five English records pick up café
  times. Fixing it means teaching that function whose hours a sentence is about. Worth a card.
- `scripts/fetch_campsites.py` / `scripts/parse_campsites.py`: the campsite half, same rules.
  **Overpass answers 429 when its slots are busy, and that is the service working, not an error**:
  the fetcher waits it out with a doubling backoff rather than failing. It also checks for a
  `remark` key and a short body, because Overpass returns HTTP 200 for a rejected or timed-out
  query and a naive `raise_for_status()` would cache the truncation. One query per country, so the
  record's `country` comes from which query returned it rather than from a bounding box: England and
  Wales share too long a border for a box to be honest about it.
- **The campsite filter is where the judgement lives**, in `takes_a_van()` and the drop rules around
  it. 8,501 features in, 3,574 out, every exclusion counted and printed. Widening it to include the
  2,370 records that simply carry no caravan tag is a one-line change, and it is the first thing to
  reach for if real use says the list is too thin.
- `app/map.js`, the canvas map: outline, markers, pan, pinch, tap, plus the optional tile layer.
  Markers that overlap are grouped into a counted bubble via `NF.clusterPoints`; the grouping
  radius is in screen pixels because "do these overlap" is a screen question, not a map one.
  Reads the same ranked list the rows are built from, so the two cannot disagree about what is
  shown. **Tiles draw over the outline, never instead of it**, so a failed or offline tile reveals
  the coastline rather than a grey hole; a self-test asserts that draw order.
  **The hint under the map carries TWO licence credits, and `NF.mapHint()` in `core.js` decides
  which.** The tile layer is credited only while it is on (card 0015). The campsite markers *are*
  an ODbL database and are drawn whether tiles are on or off, so with tiles off and the Campsites
  tab showing, the hint credits OpenStreetMap on its own (card 0020). `updateHint()` in `map.js`
  only reports which markers are on screen; it is called from `setTiles`, `show` and `refresh`,
  never from `draw`, so panning does not rewrite the DOM every frame.
  **Both credits carry the modifier `.map__hint--attrib`**, toggled by `h.credit`: white on
  `rgba(0,0,0,.72)`, a pill that hugs the text, dark `text-shadow` cleared. **`.72` is not a taste call and must not be lightened**: a pure white tile
  composites the pill to `rgb(71)`, so white on it is 9.29:1, and that bounds the worst case at
  every zoom without anyone sampling a basemap.
- `app/api/tiles.php`, Thunderforest proxy. Exists so the key never reaches the browser, since this
  repo is public. Whitelists styles, range-checks z/x/y, and never echoes `curl_error` because that
  string embeds the request URL and the URL carries the key. **Access control is `Sec-Fetch-Site`
  plus a per-address daily cap, and the `Referer` check is neither of them.** Why that is, what the
  `Referer` check failed to stop, and why the cap must never read `X-Forwarded-For` are all in
  DECISIONS 2026-08-10, "The tile proxy authenticates the browser, and caps the address"; card 0012
  carries the fix. Read that entry before changing any of the three.
- `app/data/boundary.json`, 32KB Great Britain outline, generated by `scripts/build_boundary.py`
  from Natural Earth. Generated, never hand-edited, and precached so the map works offline.
- `scripts/deploy.ps1` / `scripts/deploy.sh`, the local trigger and the server-side half. The host
  and username live in `~/.ssh/config`, not in this now-public repo. **`deploy.sh` pulls in stage 1
  and re-execs itself before doing anything else. Do not collapse that.** It is part of what the
  pull updates, and bash reads a script incrementally, so carrying straight on runs a splice of the
  old and new file. Its header comment explains it.
- `.gitattributes`, pins LF on anything the Linux host executes. A CRLF `deploy.sh` dies with a
  `^M` interpreter error, which is a baffling way to meet a line ending.
- `docs/build/IOS-SHORTCUT.md`, the Shortcut recipe, since `.shortcut` files cannot be generated.
- `docs/outreach/`, drafted correspondence to outside parties, in markdown, which is the source.
  **What the three files are, and why the email text lives in two of them that must be edited
  together, is on card 0027**, which is the card that sends it.
- `docs/img/2026-08-14_Screenshots/`, six phone screenshots, **untracked pending a call on whether
  14MB of PNGs belong in a repo the server pulls on every deploy.** Which shot shows what, and which
  three go with the enquiry, is on card 0027; card 0015 uses the other two as evidence.
- `HUMAN_ACTIONS.md`, what is left for a person, and the recurring data-refresh procedure.

## Decisions locked

See [DECISIONS.md](DECISIONS.md) for the reasoning. Do not relitigate these without a new reason:

PWA rather than native (no Mac); straight-line distance computed on device (offline is the hard
requirement); dataset bundled with no runtime API calls; sat-nav postcode wins over postal; access
modelled as a mode with dusk computed from latitude; a small PHP endpoint for the Shortcut only;
two front ends over one dataset; named forests as the default tab; deploy by `git pull` with the
docroot symlinked into the checkout; the vhost PHP version pinned rather than inherited; a map
whose basemap is a bundled outline always, with tiles only ever an optional extra on top; UI icons
taken from the Mo~oM pack and inlined as SVG rather than linked or left to a Unicode glyph.

## Current state

- **Done:** The full pipeline runs clean from scratch, and the app is deployed and serving. 274
  English forest pages and 278 Scottish ones fetched with zero failures, 630 car parks from the OGL
  dataset, all normalised into one committed 719 KB JSON. The PWA is complete: two tabs, distance and compass bearing per row,
  filter, detail sheet with opening times and facilities, three-way map chooser, offline service
  worker, generated icons, dark and light themes, sheets that drag to dismiss from the grip,
  overlapping map markers grouped into counted bubbles, and a paper grain on the flat surfaces.
  `api/nearest.php` is live and its error paths are tested. `node scripts/selftest.js` passes, covering geometry, sunset against an external reference,
  deep-link URLs, dataset integrity, the security headers and the rule that the app never claims a
  gate is open on a guess.
- **Reviewed:** an adversarial review and penetration test on 2026-08-10, prompted by the app being
  shared with other people. **The finding was that the risk is to Rob's quota, not to anyone using
  the app**: no accounts, no server-side state, no writes, no third-party requests, and input
  validation on both endpoints held against array parameters, `1e400`, traversal in every string
  parameter and a clamp test on `n`. `.git`, `.htaccess`, `docs/`, `scripts/` and all three
  `tiles.key` paths are unreachable, TLS is 1.2/1.3 with a valid certificate, and no key appears in
  any commit. Cards 0011-0014 carry what was fixed. Two things are worth keeping in mind rather than
  re-deriving. **`api/nearest.php` re-parses the whole dataset on every request, and that is not a
  DoS lever and does not need caching**; card 0034 in `done/` re-took the timings on 2026-09-06
  against the file that ships today and carries every figure, the harness and the reason its own
  script over-reports a first run. And the `%{HTTP_HOST}` open-redirect shape in `.htaccess` was
  tested and is not reachable, since an unknown `Host` 404s before the rewrite runs. It was replaced
  with a literal anyway.
- **Built 2026-08-15:** the **Campsites** tab, card 0020, from OpenStreetMap plus Forestry and Land
  Scotland's Stay the Night scheme, a second data file under a second licence.
- **Built and not yet deployed:** run `ls docs/board/ai-review docs/board/done` and read the cards.
  The Scotland batch was fast-tracked on 2026-09-10: cards 0057 and 0019 fixed the two faults the
  adversarial pass found in it, and the dataset was rebuilt off a fresh scrape. **0015 is still held
  out**, returned with a defect on the same pass. `CACHE` / `BUILD` are at `v27-2026-09-10`;
  **every campsite exclusion, its count and its
  reasoning are in DATA-MODEL's drop table**, which is the doc that owns them.
  **What each card measured, found and deliberately left alone is on that card's own comment
  thread**; the facts that outlived a build are in DATA-MODEL and DECISIONS, and the FLS licence gap
  0016 left for a person is in Blockers below.
- **In progress:** 0020 (Campsites, one criterion left that only a person can close) and 0021 (the
  card-rewrite pass, now unblocked because 0025 was answered on 2026-09-10).
- **Known bugs / broken, and this list stopped being empty on 2026-09-10.** An adversarial pass over
  every card then in `ai-review/` returned 15 of 17 with a defect, and the pattern is the same one
  that has caught this project before: **the tests could not fail.** Comment out any security header
  in `.htaccess` and the suite stays green. Falsify three of the four counts in `core.js` and it
  stays green. Delete the whole scheme check in `parse.py` and it stays green. Two live faults in
  shipped code: **the map latches dead after one failed coastline fetch** and never retries, taking
  every marker with it (card 0008), and **the tile layer blanks permanently after one refused tile**
  while still claiming a basemap (card 0012). Each card in `todo/` carries its own finding and one
  concrete fix.
  **Five older bugs were found and fixed here since 2026-08-08 and every one was found by running
  the thing, never by reading it.** The worst was the service worker writing map tiles into the
  app's offline cache until iOS evicted the app along with them; DECISIONS 2026-08-08 "The offline
  cache holds ASSETS and nothing else" carries it in full. **That is what card 0001 check 5 exists
  for: the offline path is not testable by inspection.** What each bug left behind is a do-not-undo
  note above: on `sw.js`, on `.htaccess`, on `deploy.sh` and on the committed-key guard.

## What's next (in order)

The queue is [docs/board/](board/), one card per file; run `ls docs/board/todo` for it. **The
adversarial pass on 2026-09-10 filled that lane, so the order below overrides card numbers.**

1. **Keep hunting checks that cannot fail.** The three the 2026-09-10 pass named are built and are
   in `ai-review/`: 0011 stripped comments from `.htaccess` before any assertion reads it, 0013
   drives `validate()` in `parse.py` directly because a fixture cannot carry an attacker's scheme,
   and 0036 guards all four numbers in the `safeHref` comment rather than the first. **The shape to
   look for is a check that reads one file when the claim spans several**, or a substring loose
   enough to match what it is supposed to reject, or a structural check that forbids one branch and
   says nothing about the other. Break the guarded thing and watch the run; that is the only way any
   of these was found. **Two builds this project shipped on 2026-09-10 each claimed a red-proof that
   had not been done**, and a reviewer caught both, so do not take a build note's word for it.
2. **The two live faults in shipped code.** **0008**: `loadBoundary` latches, so one failed fetch of
   the 32 KB coastline kills the map for the life of the page, and because `draw()` returns before
   the marker block it also erases every site marker and the position dot. **0012**: one refused
   tile blanks the layer permanently while the button still reads "Tiles on" and the credit still
   claims a basemap, because `t.failed` in `map.js` is written and never read.
3. **Then look at 0004 on a screen and deploy the batch.** **0015 is held out**, returned with a
   defect on 2026-09-10; the card carries it. For **0004**, check the dim italic against the
   **dark** theme, where it has the least contrast to spare, and check a map label, since "Car park
   near Bedgebury Nat…" truncates at 22 characters. Then `pwsh ./scripts/deploy.ps1`; `CACHE` and
   `BUILD` are already bumped to `v27-2026-09-10`.
   **Serving a worktree is a solved problem**: `php -S 127.0.0.1:8791 -t app` from the worktree,
   since Herd only ever serves `C:\Dev\NearestForest`.
   **0016 raises the stakes on the offline check** in Blockers below: the precache grew by about
   190 KB and the Forests tab doubled, so a cold offline launch now tests more than it did.
   **The dataset was rebuilt on 2026-09-10** off a fresh scrape, so this deploy ships a data change
   as well as a code one: one English record renamed at source, one Scottish record moved 0.8 miles,
   and 22 records with new hours, parking or facilities text. Counts are unchanged.
4. **Open the card for the colliding marker labels.** 0015's "Not this card" promises one and it
   still does not exist. The 2026-08-14 screenshots show it ("Bedgebury National Pi…" over "Hemsted
   Fores…"), and **0004 has raised the stakes**: 14 car parks now share the label "Car park near
   Dalby Forest" and 13 share "Car park near Hamsterley Forest", and at 22 characters the map
   truncates most derived names before the forest is reached. In the list this is fine, because each
   row carries its own distance and bearing. On the map it is not.
5. **0020 has never had an adversarial pass** and it is the largest single change since the map. It
   sits in `in-progress/` with one criterion left that only a person can close. Worth real
   scepticism on three points: the filter that decides what a campervan can get into, whether the
   ODbL Collective Database argument holds, and whether 3,574 more markers have broken the map's
   clustering or its label collisions. The `review-card` skill is the tool.
6. Everything else needs a person: see below.

**Scotland is answered and built** (card 0016, answered Yes on 2026-08-18, built 2026-08-29). The
forest tabs took on a second agency and a second scraper, knowingly. **Wales is still open**, card
0017, and it is not blocked by 0016 any more: it is blocked on its own contradiction, where NRW's
metadata says OGL with no restrictions while data.gov.uk says the same dataset needs prior approval
before use in an internet application. The email is drafted on that card.

## Blockers / open questions

**Run `ls docs/board/human-review`, `ls docs/board/todo` and `ls docs/board/in-progress`. This
section names no counts and lists no card numbers**, because five cards in a row wrote a list here
by hand and every one was wrong within a day. The bullets below say what a card wants from a person,
for the cards where that is not obvious from the title. A card in that folder and not below still
needs Rob, and its own `## What I need from you` section is the ask.

**Everything below fits in one conversation except 0043**, which is a build the size of the
Campsites tab rather than a question. **0016 is struck through**: it is answered, and kept only for
the one licence question it left behind.

- **0001 check 5**, aeroplane mode, relaunched from the Home Screen icon, **run twice: tiles off
  and tiles on**. **Now also the acceptance check for the Campsites tab (card 0020 #8)**, since the
  offline cache went from ~550 KB to ~1.7 MB and the campsite data is precached with everything
  else. Tap into the Campsites tab while offline as part of it. **Card 0016 added a third reason**:
  the Forests tab is now 550 sites rather than 274, so scroll it while offline too. Checks 1 to 4 now pass on the device. This is the last unevidenced PRD criterion
  and the reason the app exists rather than using Forestry England's own finder.
  **Partly run on 2026-08-08 and it failed**, which is how the tile-eviction bug above was found.
  It must be re-run from a cold launch on v8 or later, and it is worth deleting the app from the
  Home Screen and re-adding it first, so the check starts from a clean cache rather than one this
  bug already filled.
- **0010**, rotate the Thunderforest key, which reached a chat transcript. Hygiene, not an
  incident: nothing leaked into the repo and the server copy is 600 above the web root.

**Rob cannot send from `enhanceify.co.uk`, and it blocks 0010 alone**, because Thunderforest checks
the sending address against the account. **0017 and 0018 are not blocked**: neither cares which
address the email leaves from, so do not let them queue behind it. The DNS measurement behind this,
and the reason the fix belongs on the enhanceify-V2 board, is on card 0010.
- **0002**, build the Shortcut, then use both it and the PWA for a fortnight and say which wins.
- **0018**, whether to write to Forestry England and with which asks. **Its third ask contradicts
  the PRD non-goal "No App Store release"**, the same way 0016 and 0017 contradict the England-only
  one, so answering it may move the PRD.
- **0027**, the send itself. **Read `docs/outreach/forestry-england-enquiry-review.md` first**:
  three cold reviewers all predicted the draft as written earns no reply, and nobody has acted on
  any of it.
- ~~**0016**~~, answered and built. **One thing it leaves for a person: the FLS licence**, which
  rests on a default rather than a first-party offer. See DECISIONS 2026-08-29. Worth an email in
  the same batch as 0018.
- **0017**, how much of Wales to ship, blocked on one email about a licence contradiction the card
  sets out. Recheck 2026-09-11.
- **0003**, waiting on real trips rather than on analysis. Recheck 2026-09-19.
- **0030**, **five seconds, but only possible in one hour.** The card is built and repaired the
  fetch-date self-test; its remaining check asks for the suite to be seen passing between 00:00 and
  01:00 local while BST is in force. Its build run reproduced the same divergence at 05:03 with a
  `TZ` override and would accept that as evidence, but that is not the check as written.
- **0024**, **built to 3 of 4 and asking to be closed there.** Its last criterion wants the board
  convention check at zero and it is not at zero. Two things about the card are stale and it says
  so: it counts a file that has since moved lanes, and it measures cards against a line budget the
  required `human-review/` ask section pushed them past. That tension is Rob's to settle.
- **0043 (accounts and personal location tracking)**, **unbuilt, and the loop will not start it.**
  All seven of its criteria say `proves: manual`, so an unattended session can close none of them.
  It also needs an authentication and data service that the current static Hostinger deployment
  cannot host, and the card forbids creating a paid service without a person driving it. **It was
  `0022` until 2026-09-07**, when card `0042` renumbered it off the footer-credits `0022`.

## How to pick up

```bash
cd C:/Dev/NearestForest

# Rebuild the dataset from scratch. Every fetcher is resumable and skips anything already cached;
# a cold run is ~2 minutes and reports failures explicitly.
#
# THIS FAILS TODAY, AND IT IS MEANT TO. Since card 0026, parse.py takes scraped_at from
# data/raw/fetched.json, which fetch.py writes as it downloads. Pages cached before that index
# existed carry no date, so parse.py names them and exits 1 rather than stamping them with today.
# Clear the cache first, which costs a full re-fetch and also refreshes the data:
#   rm -rf data/raw && python scripts/fetch.py
python scripts/fetch.py && python scripts/parse.py && python scripts/build_boundary.py

# The campsite half, which is a separate pipeline over a separately licensed source.
python scripts/fetch_campsites.py && python scripts/parse_campsites.py

# Verify. Exits non-zero on any failure and prints the nearest sites to Brighton as a sanity check.
node scripts/selftest.js          # expect: all passed, 0 failed

# Serve locally. localhost is a secure origin, so geolocation works without a certificate.
cd app && python -m http.server 8765 --bind 127.0.0.1
```

```powershell
# Ship it. Bump CACHE in app/sw.js first if anything under app/ changed; deploy.ps1 will stop you
# if you forget. -DryRun shows every step and changes nothing.
pwsh ./scripts/deploy.ps1
```

## Suggested skills / next tools

- `/handover resume`, to pick this up in a fresh session.
- `/checkpoint`, after any work, to update the docs and commit in one step.
- `/review-card`, the adversarial pass any built card owes before `done/`. **Hand it to a separate
  agent**, because the builder passing the builder is the self-report that lane exists to remove.
  The 2026-09-10 pass split 17 cards across four agents by what each card touched, told none of them
  to run a git command so they could share one checkout, and let the parent do every lane move.
- `/code-review`, worth running over `scripts/parse.py` before trusting a re-scrape, since it is
  the one file that silently depends on someone else's HTML staying the same shape.
- `/run`, to drive the app and actually look at the map, rather than inferring it from a stubbed
  canvas, which is the gap card 0008 admits to.

## Sibling docs

| Doc | Purpose |
|-----|---------|
| [PRD.md](PRD.md) | Goal, success criteria, scope, non-goals, constraints |
| [DATA-MODEL.md](DATA-MODEL.md) | The canonical `Site` shape and known divergences |
| [DECISIONS.md](DECISIONS.md) | Twenty-two decisions with rationale, append-only |
| [build/IOS-SHORTCUT.md](build/IOS-SHORTCUT.md) | Shortcut build recipe and its known limits |
| [../HUMAN_ACTIONS.md](../HUMAN_ACTIONS.md) | Historical record of the initial build's human actions, plus the recurring refresh. **Anything still open lives on the board, not there.** |
| [../CLAUDE.md](../CLAUDE.md) | Orient tripwire and project conventions |

## Branch status

`main` (renamed from `master` to match the sibling deploy scripts), tracking `origin/main` at
**github.com/RobertLCraig/NearestForest**, public. No PR; commits go straight to `main`, which is
also what the server pulls.

## Session log

The narrative is the commit history; the rationale is [DECISIONS.md](DECISIONS.md).

```bash
git log --format='%ad %s%n%b'
```
