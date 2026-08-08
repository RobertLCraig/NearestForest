# HANDOVER: NearestForest

> An offline iPhone app that finds the closest Forestry England site and hands it to a map app in one tap. Built and tested locally; never yet run on a phone.

**Stage:** active
**Status:** Initial build complete, 34 self-tests green, 904 sites generated. Nothing deployed. Next session should have Cloudflare and Hostinger MCP servers and can run the deploy itself: start at board card **0005**.
_Last updated: 2026-08-08 (MCP deploy route opened; board 0001 split)_

## Goal & success criteria

Source of truth: [PRD.md](PRD.md).

Forestry England's own forest finder is close to unusable on a phone in a car. This reduces the job
to: open, read the top of a list, tap once, drive. Success means the nearest site is on screen with
no interaction, one tap reaches turn-by-turn navigation, and the whole thing works with no signal,
because forest car parks are exactly where mobile data dies.

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

## Deployment target

Established live over public DNS on 2026-08-08. A fresh session should not re-derive these:

- `enhanceify.co.uk` runs on **Cloudflare nameservers** (`rachel` / `yahir.ns.cloudflare.com`), so
  **DNS is at Cloudflare and not at Hostinger.** hPanel creates the vhost and the certificate only.
- Apex A record and `regenesis.enhanceify.co.uk` both point to **141.136.33.219** (Hostinger), and
  both return that address rather than a Cloudflare one, so existing subdomains are
  **DNS-only (grey cloud), not proxied**.
- `forest.enhanceify.co.uk` has **no record yet**, and the name is a suggestion Rob has not yet
  confirmed. A DNS record is outward-facing, so confirm before creating it.
- The record needed is one line: `forest.enhanceify.co.uk  A  141.136.33.219  DNS only`.

**HTTPS is not cosmetic here.** iOS grants `navigator.geolocation` only to secure origins, so on
plain HTTP the app loads and silently never locates you. That is also why a self-contained HTML file
opened from the Files app was rejected as an option.

Cloudflare and Hostinger MCP servers were connected on 2026-08-08 but were **not visible in the
session that recorded this**, checked via tool search, `ListMcpResourcesTool`, and the absence of any
`mcpServers` config on disk. Claude Code loads MCP servers at session start, so confirm with `/mcp`
before relying on them. Their actual capabilities are unverified: the Hostinger API is largely
domains, VPS and billing, so file upload for shared hosting may not be exposed.

## Architecture / stack

Static files only. No build step, no bundler, no npm, no framework, no database.

```
Forestry England website ──scrape──┐
                                   ├─► scripts/fetch.py ─► data/raw/ (142MB, gitignored)
ArcGIS FeatureServer (OGL v3) ─────┘          │
                                              ▼
                                   scripts/parse.py ─► app/data/sites.json (904 sites)
                                                             │
                                        ┌────────────────────┴────────────────────┐
                                        ▼                                         ▼
                              PWA (offline, no server)              api/nearest.php (Shortcut only)
                              core.js does the maths                does the maths server-side
```

The PWA never calls a server. The Shortcut must, because Shortcuts is far too slow to rank 904 sites
on-device. That split is deliberate and is the thing the two-method comparison is meant to settle.

## Key files / structure

- `app/` — everything that gets uploaded, and nothing else. Document root points here.
- `app/core.js` — all pure logic (distance, bearing, sunset, opening state, deep links, ranking).
  Loaded as `window.NF` in the browser and `require()`d by the tests, so the tests exercise the
  shipped code rather than a copy. **Put new logic here, not in `app.js`.**
- `app/app.js` — DOM and events only.
- `app/api/nearest.php` — mirrors `haversineMi()` from `core.js`. Change one, change both.
- `app/sw.js` — precaches everything. **`CACHE` must be bumped whenever the data or app changes**,
  or installed copies keep the old dataset forever.
- `scripts/fetch.py` — resumable and cached; re-running costs zero requests for pages already held.
- `scripts/parse.py` — the only place the HTML shape is understood. Exits non-zero rather than
  emitting a partial dataset.
- `docs/build/IOS-SHORTCUT.md` — the Shortcut recipe, since `.shortcut` files cannot be generated.
- `HUMAN_ACTIONS.md` — deploy steps and the recurring data-refresh procedure.

## Decisions locked

See [DECISIONS.md](DECISIONS.md) for the reasoning. Do not relitigate these without a new reason:

PWA rather than native (no Mac); straight-line distance computed on device (offline is the hard
requirement); dataset bundled with no runtime API calls; sat-nav postcode wins over postal; access
modelled as a mode with dusk computed from latitude; a small PHP endpoint for the Shortcut only;
two front ends over one dataset; named forests as the default tab.

## Current state

- **Done:** The full pipeline runs clean from scratch. 274 forest pages fetched with zero failures,
  630 car parks pulled from the OGL dataset, both normalised into one committed 515 KB JSON. The PWA
  is complete: two tabs, distance and compass bearing per row, filter, detail sheet with opening
  times and facilities, three-way map chooser, offline service worker, generated icons, dark and
  light themes. `api/nearest.php` is written and its error paths are tested. 34 self-tests pass,
  covering geometry, sunset against an external reference, deep-link URLs, dataset integrity and the
  rule that the app never claims a gate is open on a guess.
- **In progress:** nothing.
- **Known bugs / broken:** none open. Two were found and fixed during the build: `rank()` mutated
  shared site objects so a later call wiped distances an earlier caller still held, and the PHP
  `label` field produced mojibake from an em dash.

## What's next (in order)

The queue is [docs/board/](board/), one card per file. At the head:

1. **0005** deploy via the Cloudflare and Hostinger MCPs (`todo/`) — **start here**, and confirm the
   subdomain name with Rob before creating any DNS record
2. **0004** derive names for the 170 unnamed car parks (`todo/`) — agent-ready, needs no deploy
3. **0001** verify on the iPhone (`human-review/`, needs 0005) — five checks only Rob can run

## Blockers / open questions

See [docs/board/human-review/](board/human-review/). Genuinely blocking right now:

- **The subdomain name is unconfirmed.** `forest.enhanceify.co.uk` is a suggestion. One word from
  Rob unblocks card 0005, and creating a DNS record without it would be an outward-facing action
  taken on an assumption.
- **0001** — no PRD success criterion is evidenced until the app runs on a real phone, and offline
  in particular has only ever been verified by serving locally.
- **0003** — whether straight-line distance is good enough needs real trips, not analysis.

## How to pick up

```bash
cd C:/Dev/NearestForest

# Rebuild the dataset from scratch. fetch is resumable and skips anything already cached;
# a cold run is ~2 minutes for 274 pages and reports failures explicitly.
python scripts/fetch.py && python scripts/parse.py

# Verify. Exits non-zero on any failure and prints the nearest sites to Brighton as a sanity check.
node scripts/selftest.js          # expect: 34 passed, 0 failed

# Serve locally. localhost is a secure origin, so geolocation works without a certificate.
cd app && python -m http.server 8765 --bind 127.0.0.1
```

After changing anything under `app/`, bump `CACHE` in `app/sw.js` before uploading.

## Suggested skills / next tools

- `/handover resume` — to pick this up in a fresh session.
- `/checkpoint` — after any work, to update the docs and commit in one step.
- `/code-review` — worth running over `scripts/parse.py` before trusting a re-scrape, since it is
  the one file that silently depends on someone else's HTML staying the same shape.
- `/mcp` — first thing next session, to confirm the Cloudflare and Hostinger servers actually loaded
  before card 0005 assumes they did.

## Sibling docs

| Doc | Purpose |
|-----|---------|
| [PRD.md](PRD.md) | Goal, success criteria, scope, non-goals, constraints |
| [DATA-MODEL.md](DATA-MODEL.md) | The canonical `Site` shape and known divergences |
| [DECISIONS.md](DECISIONS.md) | Eight decisions with rationale, append-only |
| [build/IOS-SHORTCUT.md](build/IOS-SHORTCUT.md) | Shortcut build recipe and its known limits |
| [../HUMAN_ACTIONS.md](../HUMAN_ACTIONS.md) | Deploy checklist and the recurring refresh procedure |
| [../CLAUDE.md](../CLAUDE.md) | Orient tripwire and project conventions |

## Branch status

`master`. No remote configured, no PR, nothing pushed. Nothing deployed.

## Session log

The narrative is the commit history; the rationale is [DECISIONS.md](DECISIONS.md).

```bash
git log --format='%ad %s%n%b'
```
