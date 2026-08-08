# Human actions

Real-world follow-ups this repo cannot do for itself. One action per line, newest block first.
Tick them off as they are done; do not delete the history.

## Created 2026-08-08 (initial build)

> **The infrastructure half of this block was automated on 2026-08-08** via the Cloudflare and
> Hostinger MCP servers plus the SSH access already configured in `~/.ssh/config`. Board card 0005
> covers it. What remains below is what genuinely needs a phone in a hand.

- [x] **Pick the subdomain.** ~~Suggested `forest.enhanceify.co.uk`.~~ Rob chose
      **`forestlocator.enhanceify.co.uk`**: the name is never typed by hand, so the explicit one wins.
- [x] **Create the DNS record at Cloudflare**, not at Hostinger. `enhanceify.co.uk` runs on
      Cloudflare nameservers, so hPanel does not serve its DNS. One record, matching the pattern
      already working for `regenesis.enhanceify.co.uk`:
      `forestlocator.enhanceify.co.uk  A  141.136.33.219  DNS only (grey cloud)`.
      Leave it unproxied: Hostinger issues its own Let's Encrypt certificate and proxying would only
      put Cloudflare in front of that validation.
      *Done via the Cloudflare MCP. Record id `b110a9f9d9a730df168893e92d7f67cc`, unproxied.*
- [x] **Create the subdomain in Hostinger hPanel** and point its document root at the uploaded
      `app/` directory contents (not at the repo root, which would expose `docs/` and `data/raw/`).
      *Done via the Hostinger MCP as an addon vhost, matching the other enhanceify subdomains. The
      docroot is a symlink, `public_html -> repo/app`, so `docs/` and `scripts/` are outside it by
      construction rather than by remembering to exclude them.*
- [x] **Issue the free SSL certificate** for that subdomain in hPanel.
      *Hostinger auto-issued it on vhost creation. Verified: `ssl_verify_result=0`.*
- [x] **Upload the contents of `app/`** to the document root.
      *Superseded by the git deploy: the server holds a checkout and `git pull` is the deploy.
      Run `pwsh ./scripts/deploy.ps1`. Nothing is uploaded by hand, so the old warning about upload
      tools silently skipping the `.htaccess` dotfile no longer applies.*
- [x] **Verify the manifest MIME type.** *Returns `application/manifest+json`.*
- [x] **Confirm `mod_headers` is enabled.** *It is: the site returns 200 rather than 500, so the
      whole `.htaccess` parsed, including the two `<FilesMatch>` blocks.*
- [x] **Check PHP runs on the subdomain.** *Returns `{"ok":true,` with Friston Forest first. The
      vhost is pinned to PHP 8.4 (it came up on 8.3 while the account CLI is 8.4).*
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

The four remaining phone checks are board cards [0001](docs/board/human-review/0001-verify-on-iphone.md)
and [0002](docs/board/human-review/0002-build-ios-shortcut.md); the real-world one is
[0003](docs/board/human-review/0003-straight-line-distance-in-practice.md).

## Recurring

- [ ] **Re-run the data pipeline** when Forestry England redesign their site or the annual open-data
      refresh lands:

      python scripts/fetch.py && python scripts/parse.py && node scripts/selftest.js
      # bump CACHE in app/sw.js, commit, then:
      pwsh ./scripts/deploy.ps1

      Without the cache bump, installed copies keep the old dataset forever. `deploy.ps1` now
      refuses to push a change under `app/` that did not bump `CACHE`, so this is enforced rather
      than remembered, but the bump is still yours to make.
