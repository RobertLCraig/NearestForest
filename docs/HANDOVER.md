# HANDOVER: NearestForest

> An offline iPhone app that finds the closest national forest, car park or campsite and hands it to
> a map app in one tap. Live at https://forestlocator.enhanceify.co.uk/ and installed on Rob's phone.

**Stage:** active
**Category:** app, site
**Status:** Deployed, installed to the Home Screen, and working on the device. **The app is Great
Britain minus Wales in two of its three tabs.** Forests is one ranked list of 550 sites from two
agencies; Campsites covers England, Scotland and Wales; Car parks is England only, because no open
dataset of Scottish forest car parks exists. Map complete (bundled outline plus optional tiles).
**The pipeline is red on purpose** until `data/raw/` is re-fetched; see "What's next" 2.
**Five built cards are not yet deployed** and ship as one batch; see "Current state".
**Three agent-ready cards are open** on 2026-09-07: 0045 in `todo/`, and 0021 and 0044 in
`in-progress/`; `ai-review/` holds the adversarial-pass queue.
**Eleven cards wait on a person in `docs/board/human-review/`** (0001, 0002, 0003, 0010, 0017, 0018,
0024, 0025, 0027, 0030, 0043), counted 2026-09-07. **The accounts and location-tracking card is
`0043`**: it was renumbered from `0022` by card `0042`, because two different cards carried that
number. `0022` now means only the footer-credits card in `ai-review/`.
The last unevidenced PRD criterion is card **0001** check 5.
**A worktree can be rendered**: serve it yourself with `php -S`, since Herd only serves the main
checkout. See card 0015's second comment entry and card 0016's.
_Last updated: 2026-09-07. What each card did is on its own comment thread under `docs/board/`, and
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
  forests: 94 always, 104 dusk, 43 hours, 27 unknown. **It does not cover the rest of the dataset**:
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

- `app/` — everything that gets served, and nothing else. The vhost docroot symlinks here.
- `app/core.js` — all pure logic (distance, bearing, sunset, opening state, deep links, ranking).
  Loaded as `window.NF` in the browser and `require()`d by the tests, so the tests exercise the
  shipped code rather than a copy. **Put new logic here, not in `app.js`.**
- `app/app.js` — DOM and events only. **All sheet opening and closing goes through
  `showSheet` / `closeSheet`.** A part-dragged sheet carries an inline `transform`, so a path
  that sets `hidden` directly will eventually reopen a panel that is off-screen.
- **UI icons are inline `<svg>` pasted from the Mo~oM 2.2 pack** (`C:\Dev\Mo~oM 2.2/Icons-SVG`,
  outline style), with `stroke="#11181C"` swapped for `currentColor` and a comment naming the source
  `Section/Vector-N`. Do not add an icon as a linked file: inline is what keeps the offline rule and
  the precache list honest. See DECISIONS 2026-08-08. `scripts/make_icons.py` is a different thing —
  it generates the *app* icon (the conifer), which is a real PNG because a manifest needs one.
- `app/api/nearest.php` — mirrors `haversineMi()` from `core.js`. Change one, change both.
- `app/.htaccess` — also carries the security headers (DECISIONS 2026-08-10). **The CSP has no
  `unsafe-inline`, so no inline script, inline handler or `style=` attribute may enter
  `index.html`**; self-tests fail on all four rather than letting it show up as a blank screen on
  a phone. **The `sw.js` cache block must stay below the general `.js` one**: both match `sw.js`
  and the last `Header set` wins, and reversed, the file reads as though the strict value were in
  force while `no-cache` is what actually ships. That was the live behaviour until 2026-08-10.
- `app/sw.js` — precaches everything. **`CACHE` must be bumped whenever the data or app changes**,
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
- `app/.htaccess` — **the shell is deliberately `Cache-Control: no-cache`.** The service worker
  cache name already versions it, so HTTP-caching code and data buys nothing and breaks updates for
  the reason above. Only images carry a long max-age (`604800`). Do not "optimise" this back: `.js`
  was served `max-age=3600` until 2026-08-08, and that is what filled a fresh cache with old bytes.
- `scripts/fetch.py` — resumable and cached; re-running costs zero requests for pages already held.
  **It records the download date of every file it saves into `data/raw/fetched.json`** (card 0026),
  rewritten after each page so an interrupted run still leaves dated HTML. That index is the only
  honest source of a page's age: a modification time is rewritten by any copy of the tree, and a
  build worktree is a copy.
- `scripts/parse.py` — the only place the HTML shape is understood, for **both** forest sites.
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
- `app/map.js` — the canvas map: outline, markers, pan, pinch, tap, plus the optional tile layer.
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
- `app/api/tiles.php` — Thunderforest proxy. Exists so the key never reaches the browser, since this
  repo is public. Whitelists styles, range-checks z/x/y, and never echoes `curl_error` because that
  string embeds the request URL and the URL carries the key. **Access control is `Sec-Fetch-Site`
  plus a per-address daily cap, and the `Referer` check is neither of them.** Until 2026-08-10
  `Referer` was the whole control, and it served tiles to anyone who simply omitted the header,
  including any third-party page using `referrerpolicy="no-referrer"`. Do not treat the `Referer`
  line as the guard, and do not make the cap read `X-Forwarded-For`: this origin is reached
  directly, so that header is attacker-supplied. See DECISIONS 2026-08-10 and card 0012.
- `app/data/boundary.json` — 32KB Great Britain outline, generated by `scripts/build_boundary.py`
  from Natural Earth. Generated, never hand-edited, and precached so the map works offline.
- `scripts/deploy.ps1` / `scripts/deploy.sh` — the local trigger and the server-side half. The host
  and username live in `~/.ssh/config`, not in this now-public repo. **`deploy.sh` pulls in stage 1
  and re-execs itself before doing anything else. Do not collapse that.** It is part of what the
  pull updates, and bash reads a script incrementally, so carrying straight on runs a splice of the
  old and new file. Its header comment explains it.
- `.gitattributes` — pins LF on anything the Linux host executes. A CRLF `deploy.sh` dies with a
  `^M` interpreter error, which is a baffling way to meet a line ending.
- `docs/build/IOS-SHORTCUT.md` — the Shortcut recipe, since `.shortcut` files cannot be generated.
- `docs/outreach/` — drafted correspondence to outside parties, in markdown, which is the source.
  **`*.docx` is gitignored**, so a Word review copy handed to a person will not be in the repo; if
  one comes back marked up, fold the edits into the markdown and regenerate. Cards 0018 and 0027 hold
  the Forestry England one; the Natural Resources Wales one is still inline on card 0017. Three files:
  `forestry-england-enquiry-review.md` is internal notes and is never sent;
  `forestry-england-enquiry.md` is the email itself, and `forestry-england-handover.md` is a
  **self-contained** briefing for a Claude session working in Word with no repo access, which is why
  it repeats the email in full rather than linking it. **Both are rendered to Word by one throwaway
  script, and the email text therefore lives in two places that must be edited together.**
- `docs/img/2026-08-14_Screenshots/` — six phone screenshots, **untracked pending a call on whether
  14MB of PNGs belong in a repo the server pulls on every deploy.** IMG_5792 (list), 5796 (detail
  sheet) and 5797 (map chooser) are the ones worth attaching to the enquiry. **5794 and 5795 are
  evidence for card 0015**: they show the tile attribution as unreadable grey on a pale basemap.
- `HUMAN_ACTIONS.md` — what is left for a person, and the recurring data-refresh procedure.

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
  any of the 20 commits. Cards 0011-0014 carry what was fixed. Two things are worth keeping in
  mind rather than re-deriving: `api/nearest.php` re-parses the whole dataset on every request, and
  that is **not** a DoS lever and does not need caching. **Re-measured 2026-09-06 (card 0034) against
  the 736,457-byte (719 KB), 1,180-record `app/data/sites.json` that ships today**, on the PHP
  built-in server (`php -S`), asking from Brighton: **a warm request is 5.3 ms end to end**, of which
  reading and `json_decode`-ing the whole file is **3.7 ms**, and **ten in flight at once all finish
  in ~55 ms** — the 53 ms worst is queueing behind a single-threaded `php -S`, not degradation.
  Caching the parse would buy under 4 ms. The 2026-08-10 figure was ~65 ms on a 515 KB file, but
  **that is not a comparison**: its harness is unrecorded. **Card 0034's own script over-reports its
  first run**, charging `ForEach-Object -Parallel` runspace start-up to it — ~65 ms once, ~19 ms
  every run after. Re-time with a warmed client, not that script;
  and the `%{HTTP_HOST}` open-redirect shape in `.htaccess` was tested and is not reachable, since
  an unknown `Host` 404s before the rewrite runs. It was replaced with a literal anyway.
- **Built 2026-08-15:** the **Campsites** tab, card 0020, from OpenStreetMap plus Forestry and Land
  Scotland's Stay the Night scheme — a second data file under a second licence.
- **Built and not yet deployed, as one batch:** **0004** (177 car parks named after their nearest
  forest) and **0016** (Scotland in the Forests tab), both 2026-08-29; **0015** (the tile
  attribution pill), 2026-08-29, rendered and closed by a second run the same day; **0019** and
  **0022** (the footer credits), both 2026-09-05. 260 self-tests pass (`node scripts/selftest.js`,
  measured 2026-09-08) and `CACHE` / `BUILD` are at `v24-2026-09-08`, bumped seven times by card 0020:
  when it dropped six members-only campsites, when it gave the map its own ODbL credit, when it
  stopped a Stay the Night car park borrowing OpenStreetMap's data-checked date, when it dropped two
  scout sites that carry no `scout` tag, when it dropped 26 residential parks and park-home
  estates that a static-brand list cannot see, and when it dropped 72 Certificated Locations and
  Certificated Sites, which are members-only by the scheme's own definition and carry no
  `access=members` tag, and when it dropped one site whose name says "private" while carrying no
  `access` tag. See
  "What's next" item 1 for what is still owed before they ship.
  **What each card measured, found and deliberately left alone is on its own comment thread** in
  `ai-review/`; the facts that outlived the build are in DATA-MODEL and DECISIONS, and the FLS
  licence gap 0016 left for a person is in Blockers below.
- **In progress:** nothing.
- **Known bugs / broken:** none open. Five have been found and fixed here since 2026-08-08 and
  **every one was found by running the thing, never by reading it.** The worst was the service
  worker writing map tiles into the app's offline cache until iOS evicted the app along with them;
  DECISIONS 2026-08-08 "The offline cache holds ASSETS and nothing else" carries it in full.
  **That is what card 0001 check 5 exists for: the offline path is not testable by inspection.**
  What each bug left behind is a do-not-undo note above: on `sw.js`, on `.htaccess`, on
  `deploy.sh` and on the committed-key guard. Read those rules rather than re-deriving them.

## What's next (in order)

The queue is [docs/board/](board/), one card per file. At the head:

1. **Look at 0004 and 0019 on a screen, then deploy 0004, 0015, 0016, 0019 and 0022 together.**
   **0019 and 0022 are the same paragraph**, four sentences of footer text, so the only thing to look
   at is how it wraps; 0022 added one clause to the car park sentence, so check that one first.
   For **0004**, check the dim italic
   against the **dark** theme, where it has the least contrast to spare, and check a map label, since
   "Car park near Bedgebury Nat…" truncates at 22 characters. **0015 no longer needs a desktop look**
   — it got one, and its layout and contrast both hold; what it still wants is the phone, which the
   0018 screenshots need anyway, so fold it into that rather than blocking the deploy on it.
   Then `pwsh ./scripts/deploy.ps1`; `CACHE` and `BUILD` are already bumped to `v24-2026-09-08`.
   **Serving a worktree is a solved problem now** and is worth reusing on 0004:
   `php -S 127.0.0.1:8791 -t app` from the worktree, since Herd only ever serves `C:\Dev\NearestForest`.
   **0016 raises the stakes on the offline check**, item in Blockers below: the precache grew by
   about 190 KB and the Forests tab doubled, so a cold offline launch is now testing more than it was.
2. **Re-fetch `data/raw/`, because card 0026 made the parser refuse it.** `scraped_at` is now the
   date `fetch.py` downloaded the page, read back from `data/raw/fetched.json`, and a page cached
   before that index existed has an age nobody can recover. So `python scripts/parse.py` names those
   552 pages and exits 1, which is the change working. Until somebody deletes `data/raw/` and re-runs
   `scripts/fetch.py`, `app/data/sites.json` keeps the stamps it has. **A re-fetch also refreshes the
   data**, so it is a dataset change to look at, not a formality. **Card 0029 is built**, so that
   failing parse no longer costs the shipped dataset: both parsers now report and exit *before* they
   write, and the last good file survives a refusal.
3. **Open the card for the colliding marker labels.** 0015's "Not this card" promises one and it
   still does not exist. The 2026-08-14 screenshots show it ("Bedgebury National Pi…" over "Hemsted
   Fores…"). Worth
   opening, and **0004 has raised the stakes**: 14 car parks now share the label "Car park near Dalby
   Forest" and 13 share "Car park near Hamsterley Forest", and at 22 characters the map truncates
   most derived names before the forest is reached. In the list this is fine, because each row still
   carries its own distance and bearing. On the map it is not.
4. **An adversarial pass over `ai-review/`** — twenty-nine cards on 2026-09-07 (`ls docs/board/ai-review`,
   which is the only honest count), among them 0005 deploy, 0006
   compass, 0008 offline map, 0009 tile layer, and **0020 campsites**, which is the largest
   single change since the map. 0020 is worth real scepticism on three points: the filter that
   decides what a campervan can get into, whether the ODbL Collective Database argument holds, and
   whether 3,574 more markers have broken the map's clustering or its label collisions. Nothing reaches `done/` without somebody trying
   to break it. **0008 deserves the most scepticism:** its gestures have only ever run against a
   stubbed canvas in node, never a real finger, and nobody has watched 630 car park markers render
   on a phone. `/code-review` is the tool.
5. Everything else needs a person: see below.

**Scotland is answered and built** (card 0016, answered Yes on 2026-08-18, built 2026-08-29). The
forest tabs took on a second agency and a second scraper, knowingly. **Wales is still open**, card
0017, and it is not blocked by 0016 any more: it is blocked on its own contradiction, where NRW's
metadata says OGL with no restrictions while data.gov.uk says the same dataset needs prior approval
before use in an internet application. The email is drafted on that card.

## Blockers / open questions

See [docs/board/human-review/](board/human-review/). **Three agent-ready cards are open**, and
`ls docs/board/todo` plus `ls docs/board/in-progress` are the honest count: on 2026-09-07 they give
**0045** in `todo/`, the three `human-review/` cards that carry no "What I need from you" section,
and **0021** and **0044** in `in-progress/` — 0021, the card-rewrite pass, whose last criterion
waits on decision 0025, and 0044, the card correcting this very paragraph.
**0033 and 0034 are where this paragraph used to point, and both are built**, sitting in
`ai-review/` for the adversarial pass; **0034 re-took the "`api/nearest.php` needs no caching"
measurement on 2026-09-06 and the conclusion held**, and the figures, with the date and file size
they were taken on, are in "Current state" above. Otherwise what remains is the adversarial pass over `ai-review/` and the
re-fetch that card 0026 left. **Eleven cards need Rob**, and all eleven are in the lane:
`ls docs/board/human-review` on 2026-09-07 gives 0001, 0002, 0003, 0010, 0017, 0018, 0024, 0025,
0027, 0030 and 0043. The folder is the count; the list below covers those eleven, plus the
struck-through 0016, which is answered and kept only for the one licence question it left behind.
**Ten of them fit in one conversation; 0043 does not**, because it is a build the size of the
Campsites tab and not a question:

- **0001 check 5** — aeroplane mode, relaunched from the Home Screen icon, **run twice: tiles off
  and tiles on**. **Now also the acceptance check for the Campsites tab (card 0020 #8)**, since the
  offline cache went from ~550 KB to ~1.7 MB and the campsite data is precached with everything
  else. Tap into the Campsites tab while offline as part of it. **Card 0016 added a third reason**:
  the Forests tab is now 550 sites rather than 274, so scroll it while offline too. Checks 1 to 4 now pass on the device. This is the last unevidenced PRD criterion
  and the reason the app exists rather than using Forestry England's own finder.
  **Partly run on 2026-08-08 and it failed**, which is how the tile-eviction bug above was found.
  It must be re-run from a cold launch on v8 or later, and it is worth deleting the app from the
  Home Screen and re-adding it first, so the check starts from a clean cache rather than one this
  bug already filled.
- **0010** — rotate the Thunderforest key, which reached a chat transcript. Hygiene, not an
  incident: nothing leaked into the repo and the server copy is 600 above the web root.

**Rob cannot currently send from `enhanceify.co.uk`, and it blocks exactly one of these cards.**
Receiving works; outbound does not. Measured 2026-08-14 by direct DNS query against 1.1.1.1: MX
points at Cloudflare Email Routing (`route1/2/3.mx.cloudflare.net`) and SPF authorises
`_spf.mx.cloudflare.net`, while Migadu's own records are all still present alongside them
(`hosted-email-verify=`, three DKIM CNAMEs, `autoconfig`). Cloudflare Email Routing forwards inbound
and sends nothing outbound, which matches the reported symptom.

**Only 0010 is actually blocked by it**, because Thunderforest checks the sending address against
the account. **0017 and 0018 are not**: neither cares which address the email leaves from, so both
can go today from any working address, with the signature set to match. Do not let them queue behind
the mail fix. **That fix belongs on the enhanceify-V2 board, not this one**, and Rob asked on
2026-08-14 that it be left alone for now.
- **0002** — build the Shortcut, then use both it and the PWA for a fortnight and say which wins.
- **0018** — **do we write to Forestry England, and with which asks?** Three costed options and a
  recommendation. The only hard reason left is the trade mark: OGL settles the data and permits
  commercial use, but not the use of their name in a store listing. **Its third ask contradicts the
  PRD non-goal "No App Store release"**, the same way 0016 and 0017 contradict the England-only one.
- **0027** — **the send**, split out of 0018 on 2026-09-05 because the two together were 325 lines.
  It carries the two `[confirm]` claims only Rob can settle, the placeholders, the address and the
  fail date. **Read `docs/outreach/forestry-england-enquiry-review.md` first**: three cold reviewers
  all predicted the draft as written earns no reply, and nobody has acted on any of it.
- ~~**0016**~~ — answered Yes on 2026-08-18 and built on 2026-08-29. **One thing it leaves for a
  person: the FLS licence.** They publish no copyright or re-use page anywhere, so the position rests
  on The National Archives' default rather than on a first-party offer. Worth an email in the same
  batch as 0018. See DECISIONS 2026-08-29.
- **0017** — how much of Wales to ship. No longer blocked behind 0016, but still behind one email: NRW's own
  metadata says the recreation data is OGL with no access restrictions, while data.gov.uk says the
  same dataset needs their prior approval before use in an internet application. The email is
  drafted on the card. Recheck 2026-09-11, so not due.
- **0003** — a decision with options and a recommendation already on the card, waiting on real
  trips rather than analysis. Recheck 2026-09-19, so not due.
- **0025** — when a card's ask must sit above `## Why`, does the ask win or the problem statement?
  Three options and a recommendation on the card. **Still unanswered**, and card 0021 cannot close
  its last criterion until it is. Card 0033 moved it out of `todo/` and into `human-review/` on
  2026-09-06, so a sweep of that folder now finds it.
- **0030** — **five seconds, but only possible in one hour.** The card is built and repaired the
  fetch-date self-test; its remaining check asks for the suite to be seen passing between 00:00 and
  01:00 local while BST is in force. Its build run reproduced the same divergence at 05:03 with a
  `TZ` override and would accept that as evidence, but that is not the check as written.
- **0024** — **built to 3 of 4 and asking to be closed there.** Six runs all reached the same
  finding: its last criterion wants the convention check at zero, and the one failure is a missing
  `## Links` reason in card 0026, which is card 0028's job. 0028 is built and sits in `ai-review/`,
  so this may now close with no work on it; that call is Rob's, not a session's.
- **0043 (accounts and personal location tracking)** — **unbuilt, and the loop will not start it.**
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

- `/handover resume` — to pick this up in a fresh session.
- `/checkpoint` — after any work, to update the docs and commit in one step.
- `/code-review` — the natural next move on the cards sitting in `ai-review/`, and worth
  running over `scripts/parse.py` before trusting a re-scrape, since it is the one file that
  silently depends on someone else's HTML staying the same shape.
- `/run` — to drive the app and actually look at the map, rather than inferring it from a stubbed
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
