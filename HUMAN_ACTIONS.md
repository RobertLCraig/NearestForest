# Human actions

Real-world follow-ups this repo cannot do for itself. One action per line, newest block first.
Tick them off as they are done; do not delete the history.

## Created 2026-08-08 (initial build)

- [ ] **Pick the subdomain.** Suggested `forest.enhanceify.co.uk`. Nothing below can happen first.
- [ ] **Create the subdomain in Hostinger hPanel** and point its document root at the uploaded
      `app/` directory contents (not at the repo root, which would expose `docs/` and `data/raw/`).
- [ ] **Issue the free SSL certificate** for that subdomain in hPanel.
      *Pass:* `https://<subdomain>/` loads with a padlock and no warning.
      *This is not optional:* iOS grants GPS only to HTTPS origins, so on plain HTTP the app loads
      but silently never gets a location.
- [ ] **Upload the contents of `app/`** to the document root: `index.html`, `app.css`, `core.js`,
      `app.js`, `sw.js`, `manifest.webmanifest`, `.htaccess`, `data/`, `icons/`, `api/`.
      `.htaccess` is a dotfile; confirm your upload method did not skip it.
- [ ] **Verify the manifest MIME type.**
      *Check:* `curl -sI https://<subdomain>/manifest.webmanifest | grep -i content-type`
      *Pass:* `application/manifest+json`. *Fail:* `text/plain` or `application/octet-stream` means
      the `.htaccess` `AddType` line did not apply, and iOS will ignore the manifest.
- [ ] **Confirm `mod_headers` is enabled.** If the Hostinger error log shows
      `Invalid command 'Header'`, the whole `.htaccess` fails and the site 500s. Fix by wrapping the
      two `<FilesMatch>` blocks in `<IfModule mod_headers.c>`.
- [ ] **Check PHP runs on the subdomain.**
      *Check:* open `https://<subdomain>/api/nearest.php?lat=50.8168&lng=-0.0894&n=3`
      *Pass:* JSON beginning `{"ok":true,` with Friston Forest first.
      *Fail:* raw PHP source in the browser means PHP is not enabled for that subdomain.
- [ ] **Add to Home Screen on the iPhone.** Safari → Share → Add to Home Screen. Launch from the
      icon, not from Safari, or it runs as a normal tab without the standalone chrome.
- [ ] **Grant location permission** on first launch, then confirm the top row shows a real distance.
- [ ] **Test offline properly.** Launch once with signal, then turn on aeroplane mode and relaunch
      from the Home Screen icon. *Pass:* the full list still renders with distances. *Fail:* a Safari
      error page means the service worker did not install; check `sw.js` returned 200.
- [ ] **Build the iOS Shortcut** following `docs/build/IOS-SHORTCUT.md`.
- [ ] **Sanity-check one destination in the real world.** Drive to the top result once and confirm
      the coordinate lands at the car park entrance rather than in the middle of the trees. This is
      the only check that cannot be done from a desk.

## Recurring

- [ ] **Re-run the data pipeline** when Forestry England redesign their site or the annual open-data
      refresh lands: `python scripts/fetch.py && python scripts/parse.py && node scripts/selftest.js`,
      then bump `CACHE` in `app/sw.js` and re-upload. Without the cache bump, installed copies keep
      the old dataset forever.
