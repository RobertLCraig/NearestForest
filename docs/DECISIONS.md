# Decisions: NearestForest

Append-only log of decisions and their rationale, newest first. Do not rewrite history;
supersede an old entry with a new one that links back to it.

## 2026-08-08 — Deploy by git pull, with the docroot symlinked into the checkout
**Decision:** The app is served from `forestlocator.enhanceify.co.uk`, deployed by pushing to a
public GitHub repo (`RobertLCraig/NearestForest`) and running `git pull` on the Hostinger host. The
vhost docroot is a symlink: `public_html -> repo/app`. DNS is a single unproxied A record at
Cloudflare; the vhost, certificate and PHP version are Hostinger's.
**Why:** This is the pattern already running for `regenesis`, `timeline` and `r.craig.ooo` on the
same account, which use `public_html -> laravel/public` over a checkout in the same directory. An
scp upload was tried first and worked, but it leaves no record of what is deployed and diverges
from every other site on the box for no gain. Symlinking to `app/` rather than the repo root is
what keeps `docs/`, `scripts/` and the gitignored 142MB scrape cache out of the web root, and it
means the deploy copies nothing: a fast-forward pull *is* the deploy. Rob chose the longer
`forestlocator` over `forest` deliberately, since the name is never typed by hand.
**Trade-off accepted:** Apache serves a live git working tree, so a pull changes files under it
mid-request. For a personal static app on a fast-forward-only pull that window is milliseconds and
the alternative (build to a separate directory, swap a symlink) buys nothing here. The repo is
public, which is safe because it holds no secrets and the app itself is public anyway.
**Status:** active

## 2026-08-08 — Pin the vhost PHP version rather than inheriting it
**Decision:** `forestlocator.enhanceify.co.uk` is pinned to PHP 8.4, set via the Hostinger MCP.
**Why:** The new vhost came up on PHP 8.3.30 for the web SAPI while the account's CLI is 8.4.19.
Testing a script over SSH and getting different behaviour over HTTP is a genuinely confusing way
to lose an hour, and the mismatch is invisible unless looked for. `api/nearest.php` happens to be
undemanding (no date/time calls at all, and nothing newer than typed parameters), so nothing was
broken; the pin is to stop a future change meeting a version nobody chose.
**Status:** active

## 2026-08-08 — Model access as a mode, and compute dusk on the device
**Decision:** `opening_summary.access` is one of `always` / `dusk` / `hours` / `unknown`, rather
than modelling opening times as clock times alone. For `dusk` sites the app computes sunset from
the site's own latitude and today's date at render time; no closing time is stored.
**Why:** The first parser tried to read clock times and managed only 7 of 268 forests. Looking at
the actual text rather than assuming showed why: 39% say "dawn until dusk" and 35% say "24 hour
access, 365 days a year", and neither is a clock time. Modelling those two as first-class answers
took coverage to 90%. Dusk genuinely varies (Brighton sunset moves by five and a half hours across
the year, and a Northumberland site differs from a Sussex one on the same night), so a stored time
would be wrong most days. The sunset maths is ~20 lines of standard solar formulas, needs no
network, and was checked against api.sunrise-sunset.org at both solstices and agrees within 60s.
**Trade-off accepted:** "dusk" as published probably means the gate locks near sunset, but it is
not a precise contractual time. The UI shows it as "Dusk ~20:38" with a tilde, never as a promise.
**Status:** active

## 2026-08-08 — A small PHP endpoint for the Shortcut only
**Decision:** The iOS Shortcut calls `app/api/nearest.php` on the host. The PWA does not, and stays
entirely offline and server-free.
**Why:** Shortcuts iterates on the order of tens of items per second, so ranking 904 sites inside a
Shortcut would take far too long to be usable in a car. Doing the maths server-side makes the
Shortcut four actions and one request. Hostinger shared hosting runs PHP already, so this costs
nothing to host.
**Trade-off accepted:** the Shortcut needs signal; the PWA does not. That split is inherent rather
than chosen, and it is the reason for building both and comparing them in real use. If the Shortcut
wins on ergonomics but loses in a dead-signal car park, that is exactly the finding worth having.
The endpoint mirrors `haversineMi()` from `app/core.js`; if one changes, change both.
**Status:** active

## 2026-08-08 — Navigate to the sat-nav postcode's coordinate, not the postal address
**Decision:** Where a forest page publishes a "Sat Nav Postcode" separately from its JSON-LD
`address.postalCode`, treat the sat-nav one as authoritative for navigation. Keep both in the record
as `postcode_satnav` and `postcode_postal`.
**Why:** Found while probing Bedgebury: JSON-LD says `TN17 2SL`, the page's "How to find us" says
`TN17 2SJ`. They are different postcodes. Forestry England publish the sat-nav one precisely because
the postal address routes cars to the wrong place, which is the exact failure this app exists to
prevent. Discovered by checking rather than assuming the two agreed.
**Status:** active

## 2026-08-08 — Straight-line distance, computed on device
**Decision:** Sort by great-circle (haversine) distance from the GPS fix. No road distance, no ETA.
**Why:** Road distance needs a routing API, which means an API key, a per-call cost, a live network
connection and a privacy leak of Rob's location to a third party. All four are unacceptable for an
app whose main requirement is working in a forest with no signal. Haversine over ~900 points is
sub-millisecond in JavaScript and needs nothing but the GPS chip.
**Trade-off accepted:** across an estuary or the South Downs, the nearest by air can be a longer
drive than the second nearest. Mitigated by showing a compass bearing next to each distance, so a
misleading result is visible rather than hidden. Flagged in PRD open questions for real-world review.
**Status:** active

## 2026-08-08 — Bundle the dataset; no runtime API calls
**Decision:** The full dataset ships inside the app as a static JSON file, regenerated by an offline
pipeline. The app never calls Forestry England or ArcGIS at runtime.
**Why:** Offline operation is a hard requirement, not a nice-to-have. It also means their site being
down, slow, redesigned, or rate-limiting us cannot break the app in a car park at night. The cost is
staleness, which is made visible via `generated_at` and `scraped_at` rather than hidden.
**Status:** active

## 2026-08-08 — Two front ends over one dataset
**Decision:** Build both an installable PWA and an iOS Shortcut, reading the same `data/sites.json`.
**Why:** Rob's explicit call, to compare the two access methods in real use. They have genuinely
different strengths: the Shortcut is Siri-triggerable and therefore hands-free, which is safer in a
car; the PWA can show a scrollable, filterable list with opening times, which Shortcuts handles badly.
Sharing one dataset means no divergence between them, and the losing method can be dropped later at
no cost.
**Status:** active

## 2026-08-08 — PWA rather than a native app
**Decision:** Ship as an installable PWA on an enhanceify.co.uk subdomain over HTTPS.
**Why:** A native iOS build needs Xcode, which needs a Mac. Rob has two Windows machines and no Mac.
A free Apple account would also force re-signing every 7 days. A PWA added to the Home Screen gives a
full-screen icon-launched app with offline support and GPS access, needs no Apple Developer account,
and deploys as static files to shared hosting. HTTPS is not optional: iOS grants `navigator.geolocation`
only to secure origins, which also rules out opening a self-contained HTML file from the Files app.
**Status:** active

## 2026-08-08 — Two sources, forests as the default tab
**Decision:** Named forests (274, scraped from forestryengland.uk) are the default tab. Official car
parks (630, from the Open Government Licence dataset) are a second tab.
**Why:** The open dataset has exact coordinates but poor labels: 170 of its 630 car parks are named
"Unknown" and none carry a parent forest name, checked rather than assumed. A list you read while
driving has to be recognisable, so named forests lead. The car park data still earns its place for
precision and for the small laybys the website does not list.
**Status:** active
