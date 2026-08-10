# Security response headers

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

## Not this card
Not the tile proxy (0012), not the dataset URL scheme (0013), not the privacy note (0014). Not
moving the DNS record behind the Cloudflare proxy: the record is unproxied by decision so Hostinger
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
- [ ] Confirm the same on the phone, the only place iOS Safari's CSP behaviour is real

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
AC #5 and the phone check are the outstanding pair, and they are the same check as card 0001's:
somebody has to look at it on the device.
