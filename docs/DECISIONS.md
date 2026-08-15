# Decisions: NearestForest

Append-only log of decisions and their rationale, newest first. Do not rewrite history;
supersede an old entry with a new one that links back to it.

## 2026-08-15: Campsites come from OpenStreetMap, and ship in their own file
**Decision:** The Campsites tab is built from OpenStreetMap (`tourism=camp_site` and
`tourism=caravan_site`) via one Overpass query per country, plus Forestry and Land Scotland's Stay
the Night car parks. It ships as `app/data/campsites.json`, **a separate file from `sites.json`**,
each carrying its own licence and attribution block. The app merges the two arrays in memory at load
and never on disk.

**Why OpenStreetMap.** Checked rather than assumed on 2026-08-15: there is no national
open-government campsite dataset. data.gov.uk carries only per-council fragments (Durham caravan
parks, Mid Ulster caravan and camping sites), the Forestry Commission recreation hub publishes no
camping layer, and every commercial directory (Searchforsites, park4night, Britstops, the Caravan and
Motorhome Club) is proprietary with no licence that would let the data ship inside an app. OSM is the
only source with full Great Britain coverage and an open licence: 8,501 features across England,
Scotland and Wales, every one with a usable coordinate.

**Why a separate file, which is the part most likely to be "tidied up" later.** OSM is ODbL, not OGL.
A GB-wide campsite extract is a Derivative Database, so share-alike applies to it. ODbL 1.0 section
4.5(a) exempts a *Collective Database*, "this Database in unmodified form as part of a collection of
independent databases in themselves that together are assembled into a collective whole", and says
the licence still applies to that database as part of the collective while the rest keeps its own
terms. Two files side by side are exactly that. One merged file invites the argument that the OGL
forest data became a derivative of the ODbL one, which would throw away the clean licence position
established in the entry below it, on the same day. A self-test asserts that no campsite record has
found its way into `sites.json`.

**Trade-off accepted:** OSM is crowd-edited, so its tagging is uneven and its coverage is not
uniform. That is met with an explicit filter rather than with hope. Rob's call on the cut was named
and explicitly caravan or motorhome capable, which takes 8,501 features down to 3,681: an untagged
`camp_site` is not evidence that a van can get in, and a list read while driving is worth more short
and recognisable than long and speculative. Every exclusion is counted and printed by the parser.
The 2,292 unnamed and 2,370 untagged records are not lost, only unshipped, and widening the filter is
a one-line change if real use says the list is too thin.

**Also decided here:** the campsite tab never shows an open or closed badge. 99 of 3,681 records
publish any opening text at all, so a badge would be a guess, and the standing rule that this app
does not guess a gate is open applies with more force to somewhere you intended to sleep.
**Status:** active

## 2026-08-15: The full licence position, checked source by source
**Decision:** Ship, sell, and take donations without asking Forestry England for anything. Name the
app neutrally, describe the relationship factually, carry both attributions and a non-affiliation
line. Do not seek permission, a licence, or a badge.

**Why:** Rob asked for the licensing and legal risk to be researched thoroughly rather than assumed.
Every claim below was checked against a primary source on 2026-08-15.

**The data itself**

| Question | Finding | Source |
|---|---|---|
| Car park dataset licence | Open Government Licence v3.0, publisher Forestry Commission | data.gov.uk dataset `3d279869-555d-45c2-a859-d029dab1fc39` |
| Any use restriction on it | **"There are no public access constraints to this data. Use of this data is subject to the licence identified."** | environment.data.gov.uk record `bb768e37-7fb6-4362-9f07-ecc50ef14793` |
| Required attribution | "© Forestry Commission copyright and/or database right 2025. All rights reserved." | `copyrightText` on the live ArcGIS FeatureServer |
| Website content licence | "You may use and re-use the information featured on this website (not including logos or images) free of charge in any format or medium, under the terms of the Open Government Licence." | forestryengland.uk/article/crown-copyright |
| Does OGL allow selling it | Yes: "exploit the Information commercially and non-commercially" | OGL v3 |
| Does OGL cover database right | Yes, explicitly: "protected by copyright **or by database right**" | OGL v3 |

**This is the opposite of the Welsh position on card 0017**, where NRW's own metadata and data.gov.uk
contradict each other about internet applications. The English record has no such restriction, and
was checked for one specifically because of that card.

**The method of obtaining it**

- `forestryengland.uk/robots.txt` is stock Drupal. It disallows `/admin`, `/user/*`, `/search`,
  `/core/` and `/profiles/`. **Nothing covering the forest pages.**
- **There is no terms of use page.** The site footer carries Crown Copyright, Disclaimers, Privacy
  Policy, Cookie Policy, Accessibility, Modern Slavery and Counter Fraud, and nothing else. So there
  is no contractual term prohibiting automated collection to breach.
- Their Disclaimers page says nothing about automated collection either. What it does say is that
  **they disclaim the accuracy of their own information**: "we cannot ensure that all information
  will always be accurate". Useful: the app is no less accurate than its source, and can say so.
- `scripts/fetch.py` rate-limits to 4 workers at 0.35s and caches every page, so re-runs cost zero
  requests. Politeness is a defence in practice even where it is not required in law.

**What is not covered, and what to do instead**

OGL excludes "logos, crests and the Royal Arms" and "other intellectual property rights, including
patents, **trade marks**, and design rights". This is the only real gap, and the answer is to design
around it rather than ask:

- **Do not use "Forestry England" as the app's name or store title.** That asserts whose app it is.
- **Do describe factually** what it does, e.g. "finds your nearest forest managed by Forestry
  England". A statement of fact about the subject matter is ordinary referential use.
- **Carry a non-affiliation line.** The app already does. Forestry England's own Disclaimers page
  takes the same position about outbound links: "The inclusion of links to organisations in any
  section is not an endorsement of companies or products."

**Other exposures considered and dismissed**

- **Personal data:** none. The dataset is site locations, not people. The user's own location never
  leaves their device.
- **Accessibility regulations:** the Public Sector Bodies (Websites and Mobile Applications)
  Accessibility Regulations 2018 bind public sector bodies. Rob is not one, so they do not apply.
  **They would become an expectation the moment Forestry England badged or promoted the app**, which
  is one more reason not to seek that.
- **App store trade mark complaints:** a real risk, but a risk created by using their name as
  branding, which the decision above avoids.

**Not legal advice.** This is a reading of published licences, metadata records and a robots file, all
named above so the next person can check rather than trust.
**Status:** active

## 2026-08-15: The forest data is OGL-licensed, and the app never needed permission
**Decision:** Treat the forest details scraped from forestryengland.uk as reusable under the Open
Government Licence v3.0, including commercially. Supersede the PRD's Licensing constraint, which
said the forest list was taken "for personal use" and "not redistributed as a dataset". Correct the
app's attribution to the wording Forestry England themselves specify.

**Why:** The constraint was written cautiously and never checked. Checked on 2026-08-15 against the
primary sources rather than assumed:

- Forestry England's own [Crown copyright page](https://www.forestryengland.uk/article/crown-copyright)
  states: "You may use and re-use the information featured on this website (not including logos or
  images) free of charge in any format or medium, under the terms of the Open Government Licence."
  It excludes third-party material and asks for the attribution "Crown Copyright, courtesy Forestry
  England (date of publication), licensed under the Open Government Licence".
- [OGL v3](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) grants the
  right to "copy, publish, distribute and transmit the Information; adapt the Information; exploit
  the Information commercially and non-commercially", and defines "Information" as material
  "protected by copyright **or by database right**".
- OGL v3 does **not** cover logos, crests, the Royal Arms, or "other intellectual property rights,
  including patents, **trade marks**, and design rights".
- `forestryengland.uk/robots.txt` is stock Drupal. It disallows `/admin`, `/user/*`, `/search`,
  `/core/` and `/profiles/`, and nothing under the forest pages the scraper reads.

**What follows.** The app takes text, not logos or photographs, so it is inside the licence, and the
commercial questions (a paid listing, donations) need no one's permission on the data. **The one
genuine gap is the trade mark**, which is why the enquiry to Forestry England (card 0018) survives
this finding rather than being cancelled by it: an app store listing that leans on the Forestry
England name is the part the licence does not reach.

**Not a lawyer's opinion.** This is a reading of two published licences and one robots file, all
linked above so the next person can check rather than trust it.
**Status:** active

## 2026-08-10 — The tile proxy authenticates the browser, and caps the address
**Decision:** `api/tiles.php` requires `Sec-Fetch-Site: same-origin` whenever that header is
present, keeps the `Referer` check for clients that do not send it, and caps every address
at 2000 tiles a day. Absent `Sec-Fetch-Site` is allowed through to the cap rather than
refused. The cap keys on `REMOTE_ADDR` and never on `X-Forwarded-For`, and every failure
path inside it serves the tile anyway.
**Why:** The `Referer` check was the whole control and it was not one. An adversarial
review got real tiles out of the live endpoint with no `Referer`, with a spoofed one, and
from an `<img referrerpolicy="no-referrer">` on any origin. One HTML attribute made this a
free tile server for the internet on our quota. `Sec-Fetch-Site` is a forbidden header name,
so a page cannot forge it and `referrerpolicy` cannot suppress it; that closes the hotlink
case that `Referer` structurally cannot. A script can still send whatever headers it likes,
which is what the cap is for: the two layers cover different attackers and neither is
sufficient alone.
**Trade-off accepted:** The counter's read-modify-write is not locked as a pair, so heavy
concurrency from one address undercounts by a few. A leaky cap costs a few tiles; a lock
costs a slow map. Allowing an absent `Sec-Fetch-Site` keeps the endpoint checkable with
`curl` and usable below iOS 16.4, at the price of leaving scripted abuse to the cap alone.
**Supersedes:** the "not adding rate limiting" line in card 0010, which deferred this until
there were real numbers. There are now: three working bypasses against the live endpoint.
**Status:** active

## 2026-08-10 — A strict CSP, and the self-tests that keep the app inside it
**Decision:** The app serves a Content-Security-Policy with no `unsafe-inline` and no
`unsafe-eval`, plus HSTS, `nosniff`, `Referrer-Policy` and a `Permissions-Policy` scoping
geolocation to `self`. Self-tests assert both halves: that `.htaccess` sends them, and that
the app stays satisfiable under them (no inline script, no inline handler, no `style=` in
markup, no `eval`).
**Why:** `app.js` renders by building HTML strings. `esc()` is correct and was audited, but
a strict `script-src` is the layer that holds if it ever stops being correct. The policy is
affordable only because of choices already made (no build step, no CDN, no framework), so
this is the cheapest defence this architecture will ever offer, and declining it would waste
the property that makes it free.
**Trade-off accepted:** A future contributor who reaches for an inline handler gets a failed
self-test instead of working code. That is the point: the alternative is a blank screen on
somebody's phone, discovered by whoever hits it first.
**Note:** `style-src 'self'` does not conflict with the sheet drag writing
`panel.style.transform`. CSP governs `<style>` elements and `style` attributes parsed from
markup, not CSSOM property assignment.
**Status:** active

## 2026-08-10 — Overlapping markers group into a counted bubble
**Decision:** Map markers that collide on screen are drawn as one bubble carrying the
number of sites inside it. Grouping is by drawn size (24px zoomed out, 15px zoomed in),
so it fades out as you zoom and two car parks in one forest stay separately tappable.
Tapping a group zooms into it; at full zoom, where there is nowhere left to go, it opens
the closest member instead. The grouping itself is `clusterPoints` in `core.js`.
**Why:** 630 car parks at full extent was a solid band of dots that hid how many sites
were really there and made tapping a lottery. A count is more informative than the dots
it replaces. Greedy grouping in ranked order means the nearest site anchors its own group
rather than being absorbed into one centred elsewhere, which matters because the nearest
site is the one the app exists to surface.
**Trade-off accepted:** Group position is a centroid, so it sits near but not exactly on
any real site, and a tap costs a zoom before you can open anything. Both are better than
a dot you cannot hit. Labels are drawn only for lone markers, since a group has no name.
**Status:** active

## 2026-08-10 — Paper grain drawn by the renderer, not shipped as a file
**Decision:** The dark and light themes carry a subtle paper grain, tiled from an inline
`feTurbulence` SVG data URI (~400 bytes of CSS) on the page background, the header and the
sheet panels. Not on list rows, which exist hundreds at a time.
**Why:** Copied from haleypark.design, whose ground colour is close to this app's already.
Theirs is a 935KB PNG tiled at 50% with `mix-blend-mode:overlay`. That single file is
larger than this app's entire offline precache, and everything the app needs must be
bundled and cached, so the cost lands squarely on the thing — working with no signal —
that the app exists for. Generating the grain costs no file, no request and no precache
entry. Their `overlay` blend was tried first and measured visually flat: on a ground this
dark, overlay multiplies toward black. The tile carries its own low alpha instead.
**Trade-off accepted:** It is a background layer rather than a full-page overlay, so it
does not sit over the map canvas or the list rows. That is also why it cannot intercept a
tap, which matters now that the sheets have a drag gesture.
**Status:** active

## 2026-08-08 — The offline cache holds ASSETS and nothing else
**Decision:** The service worker caches exactly the precache list. It writes nothing at
runtime, and it bails out of `/api/` requests before it can touch them. Tiles stay in the
browser's HTTP cache, where their 7-day `max-age` already puts them. The page also reloads
once on `controllerchange`, so a deploy lands on the first online launch rather than the
second.
**Why:** `api/tiles.php` is same-origin, so the old "cache any same-origin GET" rule was
writing every map tile into the app's offline cache: measured at 300 tiles / 6MB from one
simulated pan. iOS evicts a Cache Storage that outgrows its quota *wholesale*, so the
optional tile layer could take the mandatory offline copy of the app with it — the app
would work fine on wifi and be dead in the car park it exists for. This is the tile layer
becoming load-bearing by the back door, which the 2026-08-08 map decision forbids.
The reload half is the same bug seen from the other end: a page loaded under the old
worker keeps running old code, so offline the app could never move off a stale version.
**Trade-off accepted:** Tiles are no longer available offline beyond whatever the HTTP
cache happens to hold, and there is one extra reload on the launch after a deploy. Both
are cheap next to losing the offline dataset. A size-capped tile cache is possible later,
but it must be a *separate* cache so it can never evict the app.
**Status:** active

## 2026-08-08 — The sheet grip drags to dismiss, and only the grip
**Decision:** The bottom sheets close by dragging their grip down: past 28% of the panel
height, or any fast downward flick, closes; anything less springs back. The drag zone is
the grip alone (with an invisibly enlarged hit area), not the panel body. The threshold
rule lives in `core.js` as `sheetShouldClose` / `sheetOffset`; only the pointer plumbing
is in `app.js`.
**Why:** The grip is a standard iOS affordance, so it promised a gesture the app did not
have, and the fallback was scrolling a long panel to reach Close — the opposite of the
one-tap-while-driving goal. Restricting the drag to the grip is what keeps it unambiguous:
the panel body scrolls, so a drag starting there competes with a scroll, which is the usual
source of a janky sheet. Putting the threshold in `core.js` means the rule is tested in node
rather than judged by feel on a phone.
**Trade-off accepted:** You cannot fling the sheet away from anywhere on it, which iOS
itself allows when the body is already scrolled to the top. Tracking scroll position to
decide that was more machinery than the gesture is worth here.
**Status:** active

## 2026-08-08 — UI icons come from the Mo~oM pack, inlined as SVG
**Decision:** Interface icons are taken from the Mo~oM 2.2 icon pack (`C:\Dev\Mo~oM 2.2`,
`Icons-SVG`, the outline style) and pasted into the markup as inline `<svg>`, with the pack's
hardcoded `stroke="#11181C"` replaced by `currentColor` and a comment naming the source
`Section/Vector-N`. First applied to the header map button, which was a bullseye glyph (`&#9678;`)
sitting next to the locate button and reading as a second locate control.
**Why:** The pack is a house asset already used by other projects, so the app stops depending on
whatever a given phone renders for an arbitrary Unicode codepoint. Inlining rather than linking is
what keeps the no-external-requests rule intact: an icon file would be one more thing to precache
and one more way to ship a blank button offline. `currentColor` means one copy serves the dark and
light themes, since `button { color:inherit }` already resolves to `--fg`.
**Trade-off accepted:** Icon markup lives in `index.html` rather than a sprite, so a widely reused
icon would be duplicated. Acceptable at this size; revisit only if the count grows.
**Status:** active

## 2026-08-08 — A map with a bundled outline always, and tiles only as a bonus
**Decision:** Add a map view for picking a site. Its basemap is a simplified England/GB outline
bundled with the app and drawn offline; real raster tiles are layered over it only when a
connection exists, behind a toggle. This creates the single permitted exception to "no external
requests at runtime": the tile layer. With tiles off, the app must still make zero requests, and
nothing the app needs may ever depend on the network.
**Why:** Rob asked for "a visible map (same as forestry england already provides)", which is a tile
map, and the founding constraint is the opposite because forest car parks have no signal. Both were
achievable: the spatial job (see what is over that way, tap it) needs only a coastline, your dot and
904 site dots, and that fits in the bundle. Tiles then buy familiarity and road context when signal
allows, without ever being load-bearing. A tiles-only map would be dead in exactly the car park the
app exists for; an outline-only map answers the question but looks schematic.
**Trade-off accepted:** More work than either half alone, and the tile layer brings a provider key
and sends the viewport to a third party whenever it is switched on. That is why it is off by
default and why the outline is never removed from underneath it.
**Supersedes:** the absolute reading of "no external requests at runtime" in CLAUDE.md, which is
updated rather than left to be discovered as a contradiction.
**Status:** active

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
