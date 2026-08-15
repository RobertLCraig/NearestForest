# PRD: NearestForest

> Finds the closest Forestry England site to your current location and pushes it into your map app in one tap.

**Stage:** active
_Last updated: 2026-08-08_

## Purpose

Forestry England already publishes a forest finder on their website. It works on a desktop and it is
close to unusable on a phone in a car: it is a full Drupal page with a cookie banner, a map that wants
panning, a search box that expects typing, and no reliable "just tell me the nearest one" path. The
information needed to make a decision (which site, how far, is it still open, can I park) is spread
across several taps and a page load per candidate.

This project reduces that to: open, read the top of a list, tap once, drive.

## Goals

In priority order.

1. **Nearest site visible with no interaction.** Launch to a sorted list, no search, no typing, no
   map gesture. The answer is at the top before anything is tapped.
2. **One tap to navigation.** From the list straight into a turn-by-turn app with a real coordinate.
3. **Works with no signal.** Forest car parks are exactly where mobile data dies. The whole dataset
   ships with the app; only GPS is needed at runtime, and GPS does not need a network.
4. **Readable at a glance.** Large targets, high contrast, no small print. It is used in a stationary
   car, in the dark, often one-handed.
5. **Does not send you to a locked gate.** Surface opening and closing times, because most Forestry
   England car parks lock, and a wasted 40-minute drive is the failure mode that matters most.

## Success criteria

- [ ] From a cold Home Screen launch in aeroplane mode, the sorted list renders in under 3 seconds.
- [ ] The nearest site is correct when cross-checked by hand against 5 known locations.
- [ ] Tapping a site opens Apple Maps, Google Maps or Waze at the correct coordinate, navigating.
- [ ] Every one of the 274 named forests carries a name, coordinate, sat-nav postcode and opening times,
      or is explicitly flagged as missing that field. No silent blanks.
- [ ] The app makes zero network requests after first install (verifiable in Safari Web Inspector).
- [ ] The iOS Shortcut returns the same nearest site as the PWA for the same location.

## Scope

- Two tabs over one dataset: **Forests** (274 named sites, the default) and **Car parks** (630 official
  car park features, for when the named site is not the nearest usable parking).
- Distance and compass bearing from current GPS position, sorted nearest first.
- Per-site detail: name, sat-nav postcode, opening times, parking charges, facilities, link to the
  Forestry England page.
- Map app chooser on tap: Apple Maps / Google Maps / Waze, asked each time.
- Two front ends: an installable PWA and an iOS Shortcut, both reading the same generated dataset.
- A re-runnable data pipeline, since both sources change under us.

## Non-goals

- **Not routing.** No road distances, no traffic, no ETA. Straight-line distance only. The map app
  does routing; duplicating it would need a paid API and a live connection.
- **Not England-wide woodland.** Forestry England sites only. No National Trust, Woodland Trust,
  RSPB, or council parks. ~~No Wales, Scotland or Northern Ireland (different agencies entirely).~~
  **Contradicted by stated intent, 2026-08-15.** Rob wants Scotland, Wales, Northern Ireland and
  Ireland, and Europe and the United States after that. Cards 0016 and 0017 hold the measured cost
  for Scotland and Wales; nothing has been researched for Ireland or beyond. **This line is not yet
  rewritten because "I want to" is not the same as a scoped decision**, and the two cards were
  written against the old wording.
- ~~**No App Store release**, no Apple Developer account~~, no accounts, no login, no sync, no
  analytics, no telemetry, no server-side anything. **The App Store half is contradicted by stated
  intent, 2026-08-15:** Rob intends to list it, free with donations or at a low price. The Apple
  half still stands on its own facts, since an iOS release needs a Mac and a paid developer account
  and he has neither; Android does not. Card 0018 carries the trade mark question that gates a
  listing either way.
- **No live data at runtime.** Notices and closures on the Forestry England site are not fetched;
  the app is a snapshot, refreshed when the pipeline is re-run.
- Not a general map. No tile rendering, no pan-and-zoom browsing.

## Requirements

### Functional
- FR1 — Acquire GPS position via `navigator.geolocation`, with an explicit, readable state for
  each of: permission not yet asked, permission denied, position unavailable, timed out, acquired.
- FR2 — Sort all sites in the active tab by great-circle distance from the current position.
- FR3 — Show distance in miles and a compass bearing per row.
- FR4 — Tapping a row opens a detail view; tapping Navigate opens a three-way map app chooser.
- FR5 — Persist the last known position so a cold launch without a GPS fix still shows a plausible
  list immediately, clearly marked as stale rather than presented as current.
- FR6 — Show opening times on the detail view, and flag sites whose closing time has passed.
- FR7 — Free-text filter for finding a named forest deliberately rather than by distance.

### Non-functional
- NFR1 — Fully offline after install, via a service worker precaching every asset and the dataset.
- NFR2 — No external hosts referenced anywhere in the shipped app. No CDN, no webfont, no tile server.
- NFR3 — Total payload under 1 MB so it installs over a weak connection.
- NFR4 — Touch targets at least 44x44 pt, primary actions reachable one-handed.
- NFR5 — Legible in direct sunlight and at night; respects the system dark mode.
- NFR6 — Served over HTTPS. iOS grants geolocation only to secure origins.

## Constraints

- **No Mac.** Rob runs Windows 11 only, so Xcode and a native iOS build are unavailable. This is what
  forces the PWA-plus-Shortcut approach rather than a native app.
- **Hostinger shared hosting.** Static files only. No Node runtime, no long-running process. Apache
  needs an `.htaccess` entry to serve `.webmanifest` with the correct MIME type.
- **Local-first deploy.** Built and verified locally under Laravel Herd before anything is pushed
  live. No direct edits on the host.
- **Licensing.** **Both** sources are Open Government Licence v3.0, and OGL v3 permits commercial as
  well as non-commercial reuse, adaptation and redistribution. The car park data is published as an
  OGL dataset. The forest details are read from forestryengland.uk, whose Crown copyright page offers
  the site's information for reuse under the same licence, excluding logos and images. Attribution is
  required for both and ships in the app's About view. See DECISIONS 2026-08-15, which supersedes an
  earlier constraint here that wrongly described the forest list as personal-use-only.
  **What the licence does not cover is trade marks**, so the Forestry England name in an app store
  listing is a separate question and is card 0018.
- **Both sources are fragile.** The forest list is parsed out of Drupal-rendered HTML and will break
  when they redesign. The pipeline must fail loudly on a parse shortfall, never emit a short file quietly.

## Open questions

- [ ] Straight-line vs road distance: decided as straight-line (see DECISIONS 2026-08-08). From Brighton
      the nearest by air is usually the nearest by road, but the South Downs and the coast can make that
      wrong. Confirm this is acceptable in real use before adding complexity.
- [x] Which subdomain on enhanceify.co.uk to deploy to. **Answered 2026-08-08:**
      `forestlocator.enhanceify.co.uk`, chosen over the shorter `forest` because the name is never
      typed by hand. Deployed and live (see DECISIONS 2026-08-08).
- [ ] How often to re-run the pipeline. The car park data updates annually; the website changes ad hoc.
- [ ] Whether the Car parks tab should hide the 170 features named "Unknown" or show them with a
      derived label such as "Car park near <nearest forest>".
