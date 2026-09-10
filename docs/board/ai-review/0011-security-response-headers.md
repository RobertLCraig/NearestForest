---
no_outward_effect: "send" in criterion #2 is the server emitting HTTP response headers, not a message anybody receives
---
# Security response headers

## What I need from you

**One call.** A reviewer says one task on this card was left half done, and no session may untick a
box. Either untick criterion #1 and send this card back to `todo/`, or write here why the reviewer is
wrong and leave it ticked.

**Pass** is either of those, written as one dated line in `## Comments` below.

**Fail** is leaving all five boxes ticked with nothing written. The card then reads as finished, the
loop finds no work on it, and it comes straight back to this lane. That is what has happened so far.

**Why it needs you.** The reviewer's finding sits under task 4, not under a criterion, and it graded
the acceptance itself `sound`. So which box, if any, is untrue is a judgement, and only a person may
change a tick.

**What's wrong.** `scripts/selftest.js` checks "no inline handler" and "no `style=`" against
`app/index.html` only. The markup the strict policy exists to defend is built by `innerHTML` inside
`app/app.js`, which those two checks never read. A future `onclick=` or `style=` in one of those
strings passes the suite and fails only as dead buttons on a phone.

**Cause.** The card was built, reviewed, and returned with the finding. A reviewer is forbidden from
editing acceptance, so it came back with 5 of 5 ticked; every unattended session since has read the
boxes, found nothing open, and promoted it again.

## Why
An adversarial review and penetration test on 2026-08-10 (prompted by the app being shared with
other people) found the live site serving exactly one security header, and it was not ours:
`Content-Security-Policy: upgrade-insecure-requests`, which Hostinger adds by default. No CSP of
our own, no HSTS, no `frame-ancestors`, no `nosniff`, no `Referrer-Policy`, no `Permissions-Policy`.

Three of those matter here rather than in the abstract:

- **HSTS.** HTTPS is load-bearing in this app, not cosmetic: iOS grants `navigator.geolocation`
  only to secure origins, so a stripped connection is an app that loads and silently never locates
  you. The 301 helps only after the first request of a session, and this is a PWA opened over and
  over on whatever Wi-Fi is going.
- **`frame-ancestors`.** Anything could frame the app. The **Navigate** button is a tap-jacking
  target, and there is no legitimate reason to embed this.
- **A real CSP.** `app.js` renders the list and the detail sheet by building HTML strings. `esc()`
  is correct today, and the review checked it, but a strict `script-src` is what stands behind it
  if it is ever wrong.

The same pass found the `.htaccess` not serving what it says it serves: `sw.js` matches both
`FilesMatch` blocks, the general one is later, and for one header the last `Header set` wins. The
file has read `no-cache, no-store, must-revalidate` since it was written; `no-cache` is what was
actually going out. Harmless in effect, since revalidation is what matters, but this project has
lost hours to service-worker caching twice, and a file that lies about what it serves is how a
third one starts.

## Links

**Relates to**
- `0012` - the second finding of the same 2026-08-10 review: the tile proxy served anyone. Headers
  and an open endpoint are different defects on different surfaces, so they are separate cards.
- `0013` - the third finding of that review, on the scheme of a dataset's own URL. A strict CSP is
  what stands behind `esc()` here; that card is what stands behind an `href`.
- `0014` - the fourth finding, and the only one that is a statement to the reader rather than a
  control. It goes in the footer, not in `.htaccess`.
- `0015` - came out of the same phone screenshots that evidenced this card. It is a legibility
  defect the tile layer always had and nothing the CSP introduced.
- `0009` - built the tile layer that criterion #5 checks still draws under the policy.

## Not this card
Not the tile proxy, which is card `0012`. Not the dataset URL scheme, which is card `0013`. Not the
privacy note, which is card `0014`. Not moving the DNS record behind the Cloudflare proxy: the record is unproxied by decision so Hostinger
can issue its own certificate, and putting a WAF in front is a different card with a different
trade. Not adding `X-Frame-Options`; `frame-ancestors` supersedes it and every browser this app
targets honours the CSP form.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN any page is requested, THE APP SHALL send a Content-Security-Policy with no
      `unsafe-inline` and no `unsafe-eval`, and SHALL still render, locate, list and map correctly.
- [x] #2 WHEN any page is requested, THE APP SHALL send `Strict-Transport-Security`,
      `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`.
- [x] #3 WHEN the app is loaded in a frame by another origin, THE APP SHALL refuse to render.
- [x] #4 WHEN `sw.js` is requested, THE APP SHALL send the `no-store` value the file specifies
      rather than a value silently overridden by a later block.
- [x] #5 WHEN the tile layer is switched on, THE APP SHALL still draw tiles under the CSP.
<!-- AC:END -->

## Tasks
- [x] Add the header block to `app/.htaccess`, using `Header always set` so errors carry them too
- [x] Move the `sw.js` cache block below the general one and say why in the file
- [x] Replace `%{HTTP_HOST}` in the redirect with the literal host
- [x] Self-tests for every header, for the block order, and for the app staying CSP-satisfiable
      (no inline script, no inline handler, no `style=` in markup, no `eval`)
- [x] Verify the headers on the live site after deploy
- [x] Load the deployed app in a browser and confirm nothing is CSP-blocked
- [x] Confirm the same on the phone, the only place iOS Safari's CSP behaviour is real
- [x] Open the map on the phone with Tiles on, the one part the first screenshot did not cover

## Plan
The CSP is strict because it can be: no build step, no CDN, no inline script, no inline handler.
`img-src` needs `data:` for the paper grain, which is a data: SVG in `app.css`. `style-src 'self'`
is safe despite the drag code writing `panel.style.transform`, because CSP governs `<style>`
elements and `style` attributes parsed from markup, not CSSOM property assignment.

The self-tests are the durable part. Three of them assert the app stays *inside* the CSP, so a
future inline handler fails in node rather than as a blank screen on a phone, which is the only
other place it would show up, and only for whoever hits it first.

## Direction
**2026-08-10** Built and deployed. Live headers verified with `curl`; see the acceptance boxes.

**Confirmed on the device the same day**, which is the only check that counts for a CSP: iOS
Safari applies it, other browsers only rehearse it. Rob's screenshot of the installed PWA shows
the footer reading `build v10-2026-08-10`, so the strict policy is what the phone is actually
running, and nothing in it is blocked: the stylesheet, all three scripts, the `data:` paper grain
and the inline SVG icons all render, and geolocation still resolves (a fix at plus or minus 35 m,
list sorted by distance). The build string in the footer is exactly what it exists for. It also
shows the update landed on the first online launch rather than the second, so the
`controllerchange` reload added on 2026-08-08 is doing its job.

**Tiles confirmed on the phone the same day.** Thunderforest Outdoors draws over the whole map at
three zoom levels with the toggle on, and the detail sheet still renders its **Forestry England
page** link, which is `NF.safeHref` from card 0013 passing on the device rather than in a test.
So `img-src 'self'` covers the proxy correctly under iOS Safari, and nothing in the policy is
blocking a tile.

Everything on this card is now evidenced on the device. Card 0015 came out of the same
screenshots, and is a legibility defect the tile layer has always had rather than anything the
CSP introduced.

### 2026-09-07 review (v20260907113904-f98e)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I traced each criterion to real code.

**#1 CSP** ÔÇö `app/.htaccess`, "Security headers" block: `Header always set Content-Security-Policy` with `script-src 'self'`, no `unsafe-inline`, no `unsafe-eval`. The app stays inside it: `loadJson()` in `app/app.js` and the boundary fetch in `app/map.js` use relative URLs (same origin, so `connect-src 'self'` holds); the grain is a `data:` SVG in `app/app.css`, covered by `img-src data:`. No `style=` and no `on*=` handler anywhere in `app/*.js` or `app/index.html` (grep found none).

**#2** ÔÇö same block sets `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, all with `always`.

**#3** ÔÇö `frame-ancestors 'none'` inside the same CSP.

**#4** ÔÇö the `sw\.js$` `FilesMatch` now sits after the general `.(html|css|js|json|webmanifest)$` block, so `no-store` is the last write and wins. `scripts/selftest.js` (hardening section) asserts the index order.

**#5** ÔÇö tiles come from `app/api/tiles.php`, same origin, so `img-src 'self'` serves them.

Self-tests back #1ÔÇô#4 in `scripts/selftest.js`. I tried to find a criterion with no code behind it and could not.

VERDICT: sound

**scope: defect**

**Scope: what grew.** Nothing. This card's own footprint is `app/.htaccess` and the hardening block in `scripts/selftest.js`. The other files in commit `de37fb2` (`app/api/tiles.php`, `NF.safeHref` in `app/core.js`, the footer in `app/index.html`) are cards 0012ÔÇô0014, not this one. Nothing crossed the fence: no `X-Frame-Options`, no Cloudflare proxy change, no tile-proxy or `href` work attributable here. The `%{HTTP_HOST}` literal is an explicit task on the card, not creep.

**Scope: what was left half done.** The task asked for self-tests that the app "stays CSP-satisfiable (no inline script, no inline handler, no `style=` in markup, no `eval`)". In `scripts/selftest.js`, the hardening block (`--- hardening (adversarial review, 2026-08-10) ---`) runs three of those four against `indexhtml` only. Just the `eval` check uses the `shipped` join of `app.js`, `core.js`, `map.js`, `sw.js`. But the card's own **Why** names `app.js` building HTML strings as the reason for the strict policy, and `app.js` writes `innerHTML` in three places. An inline `onclick=` or `style=` added inside those template strings passes node and fails only as dead UI on a phone ÔÇö the exact failure the Plan says these tests exist to stop.

VERDICT: defect

**breakage: defect**

I tried to break the header work. Here is what I found.

**Checked and it holds:** the CSP allows everything the app actually loads ÔÇö the three `<script src>` tags in `app/index.html`, the `data:` grain in the `--grain` variable in `app/app.css`, the same-origin tile URL built in `map.js` (`api/tiles.php?z=...`), and the service worker. No `<form>`, `<base>`, `<iframe>`, inline `<style>` or inline handler exists, so `form-action`/`base-uri`/`object-src 'none'` break nothing. `Referrer-Policy: strict-origin-when-cross-origin` still sends a same-origin `Referer`, so the `Referer` fallback in `app/api/tiles.php` keeps working. The `sw.js` block order and the literal-host redirect are both asserted in `scripts/selftest.js`.

**One gap.** In `scripts/selftest.js`, the hardening block checks "no inline event handlers in index.html" and "no style attributes in index.html markup" against `index.html` only. But the markup the CSP exists to defend is built in `app/app.js` (`renderList`'s `listEl.innerHTML = sites.map(...)` and the sheet's `$('#sheet-body').innerHTML = h`). The `eval` check already scans all four shipped files; these two do not. A future `style="` or `onclick=` in one of those template strings passes the suite and fails only on a phone. The `.htaccess` comment claiming "no inline event handler anywhere in the app" is therefore not what the tests check.

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
