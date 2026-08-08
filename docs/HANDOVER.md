# HANDOVER: NearestForest

> An offline iPhone app that finds the closest Forestry England site and hands it to a map app in
> one tap. Live at https://forestlocator.enhanceify.co.uk/ and installed on Rob's phone.

**Stage:** active
**Status:** Deployed, installed to the Home Screen, and working on the device. Map complete
(bundled outline plus optional tiles). One agent-ready card, **0004**; four cards awaiting an
adversarial pass in `ai-review/`; the last unevidenced PRD criterion is card **0001** check 5.
_Last updated: 2026-08-08 (map shipped with the optional tile layer; PWA update path fixed;
header map icon replaced from the Mo~oM pack; sheets now drag to dismiss)_

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

- **One `Site` record** normalises two very different upstream sources. `source` is `forest` or
  `carpark` and drives which tab a record appears in, nothing else. Do not branch logic on it.
- **`app/data/sites.json` is generated, never hand-edited.** 904 records, 515 KB, committed on
  purpose because it is what the app ships. Fix the generator and re-run; do not patch the JSON.
- **Coordinates are WGS84 decimal degrees everywhere.** The car park source is EPSG:27700 and is
  reprojected at fetch time by asking ArcGIS for `outSR=4326`. `scripts/parse.py` asserts every
  coordinate falls inside an England bounding box, so an unprojected value fails the build loudly.
- **`postcode_satnav` is the one to navigate to, never `postcode_postal`.** They genuinely differ
  (Bedgebury publishes `TN17 2SJ` for sat nav and `TN17 2SL` as its postal code).
- **`opening_summary.access`** is `always` / `dusk` / `hours` / `unknown` and is the primary opening
  field, because most sites publish no clock time at all. Measured: 94 always, 104 dusk, 43 hours,
  27 unknown. `dusk` deliberately stores no closing time; the app computes sunset per site at render.
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
  and `.gitignore` refuses `*.key`.

**HTTPS is not cosmetic here.** iOS grants `navigator.geolocation` only to secure origins, so on
plain HTTP the app loads and silently never locates you. That is also why a self-contained HTML file
opened from the Files app was rejected as an option.

## Architecture / stack

Static files only. No build step, no bundler, no npm, no framework, no database.

```
Forestry England website --scrape--+
                                   +--> scripts/fetch.py --> data/raw/ (142MB, gitignored)
ArcGIS FeatureServer (OGL v3) -----+          |
                                              v
                                   scripts/parse.py --> app/data/sites.json (904 sites)
                                                             |
                                        +--------------------+--------------------+
                                        v                                         v
                              PWA (offline, no server)              api/nearest.php (Shortcut only)
                              core.js does the maths                does the maths server-side
```

The PWA never calls a server. The Shortcut must, because Shortcuts is far too slow to rank 904 sites
on-device. That split is deliberate and is the thing the two-method comparison is meant to settle.

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
- `app/sw.js` — precaches everything. **`CACHE` must be bumped whenever the data or app changes**,
  or installed copies keep the old dataset forever. `deploy.ps1` refuses to ship an `app/` change
  that did not bump it, and `core.js` `BUILD` must match the cache name (a self-test enforces it;
  the footer shows it, which is how you tell what a phone is actually running).
  **Install fetches with `cache: 'reload'` on purpose. Do not remove it.** `addAll()` fetches
  through the browser HTTP cache, so without it a fresh cache name gets filled with stale bytes and
  no amount of bumping helps. That is exactly what made the map render on desktop and not on the
  phone on 2026-08-08.
- `app/.htaccess` — **the shell is deliberately `Cache-Control: no-cache`.** The service worker
  cache name already versions it, so HTTP-caching code and data buys nothing and breaks updates for
  the reason above. Only images carry a long max-age. Do not "optimise" this back.
- `scripts/fetch.py` — resumable and cached; re-running costs zero requests for pages already held.
- `scripts/parse.py` — the only place the HTML shape is understood. Exits non-zero rather than
  emitting a partial dataset.
- `app/map.js` — the canvas map: outline, markers, pan, pinch, tap, plus the optional tile layer.
  Reads the same ranked list the rows are built from, so the two cannot disagree about what is
  shown. **Tiles draw over the outline, never instead of it**, so a failed or offline tile reveals
  the coastline rather than a grey hole; a self-test asserts that draw order.
- `app/api/tiles.php` — Thunderforest proxy. Exists so the key never reaches the browser, since this
  repo is public. Whitelists styles, range-checks z/x/y, and never echoes `curl_error` because that
  string embeds the request URL and the URL carries the key.
- `app/data/boundary.json` — 32KB Great Britain outline, generated by `scripts/build_boundary.py`
  from Natural Earth. Generated, never hand-edited, and precached so the map works offline.
- `scripts/deploy.ps1` / `scripts/deploy.sh` — the local trigger and the server-side half. The host
  and username live in `~/.ssh/config`, not in this now-public repo.
- `.gitattributes` — pins LF on anything the Linux host executes. A CRLF `deploy.sh` dies with a
  `^M` interpreter error, which is a baffling way to meet a line ending.
- `docs/build/IOS-SHORTCUT.md` — the Shortcut recipe, since `.shortcut` files cannot be generated.
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
  forest pages fetched with zero failures, 630 car parks from the OGL dataset, both normalised into
  one committed 515 KB JSON. The PWA is complete: two tabs, distance and compass bearing per row,
  filter, detail sheet with opening times and facilities, three-way map chooser, offline service
  worker, generated icons, dark and light themes, and sheets that drag to dismiss from the grip.
  `api/nearest.php` is live and its error paths are tested. `node scripts/selftest.js` passes, covering geometry, sunset against an external reference,
  deep-link URLs, dataset integrity and the rule that the app never claims a gate is open on a guess.
- **In progress:** nothing.
- **Known bugs / broken:** none open. Four were found while shipping the map, all by running things
  rather than reading them, and all fixed: a fixed-length smoke-test compare that failed a working
  endpoint; `deploy.sh` executing a splice of its old and new selves because the `git pull` it had
  just run rewrote the file bash was reading; the service worker precaching stale bytes (below);
  and a committed-key guard that both crashed on a pending rename and cried wolf on an unrelated
  32-hex string.

  **The stale-precache bug is the one worth remembering.** The map rendered on desktop and not on
  the phone, which was not a map bug: `.htaccess` served `.js` with `max-age=3600` and
  `cache.addAll()` fetches through the HTTP cache, so a new cache name was populated with old
  bytes. Bumping `CACHE` could never have fixed it. See the do-not-undo notes on `sw.js` and
  `.htaccess` above.

## What's next (in order)

The queue is [docs/board/](board/), one card per file. At the head:

1. **0004** derive names for the 170 unnamed car parks (`todo/`) — **the only agent-ready card, so
   start here.** DATA-MODEL calls it the main open divergence, and it matters more now the map
   exists: an unnamed dot is worse than an unnamed row. The nearest car park to Brighton is one of
   them, which is the whole problem in a single row.
2. **An adversarial pass over `ai-review/`** — four cards (0005 deploy, 0006 compass, 0008 offline
   map, 0009 tile layer) are built and unreviewed. Nothing reaches `done/` without somebody trying
   to break it. **0008 deserves the most scepticism:** its gestures have only ever run against a
   stubbed canvas in node, never a real finger, and nobody has watched 630 car park markers render
   on a phone. `/code-review` is the tool.
3. Everything else needs a person: see below.

## Blockers / open questions

See [docs/board/human-review/](board/human-review/). Nothing blocks agent work: card 0004 can start
immediately. Four cards need Rob, and they fit in one conversation:

- **0001 check 5** — aeroplane mode, relaunched from the Home Screen icon, **run twice: tiles off
  and tiles on**. Checks 1 to 4 now pass on the device. This is the last unevidenced PRD criterion
  and the reason the app exists rather than using Forestry England's own finder.
- **0010** — rotate the Thunderforest key, which reached a chat transcript. Hygiene, not an
  incident: nothing leaked into the repo and the server copy is 600 above the web root.
- **0002** — build the Shortcut, then use both it and the PWA for a fortnight and say which wins.
- **0003** — a decision with options and a recommendation already on the card, waiting on real
  trips rather than analysis. Recheck 2026-09-19, so not due.

## How to pick up

```bash
cd C:/Dev/NearestForest

# Rebuild the dataset from scratch. fetch and build_boundary are both resumable and skip
# anything already cached; a cold run is ~2 minutes and reports failures explicitly.
python scripts/fetch.py && python scripts/parse.py && python scripts/build_boundary.py

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
- `/code-review` — the natural next move on the four cards sitting in `ai-review/`, and worth
  running over `scripts/parse.py` before trusting a re-scrape, since it is the one file that
  silently depends on someone else's HTML staying the same shape.
- `/run` — to drive the app and actually look at the map, rather than inferring it from a stubbed
  canvas, which is the gap card 0008 admits to.

## Sibling docs

| Doc | Purpose |
|-----|---------|
| [PRD.md](PRD.md) | Goal, success criteria, scope, non-goals, constraints |
| [DATA-MODEL.md](DATA-MODEL.md) | The canonical `Site` shape and known divergences |
| [DECISIONS.md](DECISIONS.md) | Eleven decisions with rationale, append-only |
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
