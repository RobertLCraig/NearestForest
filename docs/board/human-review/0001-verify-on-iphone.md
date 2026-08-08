# Verify the deployed app on the iPhone

## What I need from you
Run these five checks on the phone. **The app is deployed and waiting for you at
https://forestlocator.enhanceify.co.uk/** (card 0005, done 2026-08-08). Only you can: they need a physical
iPhone, a real GPS fix, and the network genuinely taken away. Nothing here can be established from a
desk, and until it is, none of the PRD success criteria are evidenced.

Each check names its own pass, so a failure points at one cause rather than at the whole card:

1. Open **https://forestlocator.enhanceify.co.uk/** in Safari. *Pass:* padlock, no certificate warning.
   *Fail:* SSL is not issued, and GPS will silently never work.
2. Share → Add to Home Screen, then launch **from the icon, not from Safari**.
   *Pass:* full screen, no address bar. *Fail:* the manifest was not read.
3. Allow location when asked. *Pass:* top row reads roughly `10.8 miles E, Friston Forest`
   from Brighton, with `Until 20:00` beside it.
   *Fail:* a red status line saying what went wrong, which is the message to report back.
4. Tap the green ▶ on any row, choose a map app. *Pass:* it opens navigating to that car park.
   Worth trying all three once, since each uses a different URL scheme.
5. Turn on aeroplane mode and relaunch from the icon.
   *Pass:* the full list still renders with distances.
   *Fail:* a Safari error page means the service worker did not install.

Report which numbers passed. A failure on 5 is the one that matters most: offline is the whole
premise of the app, and so far it has only been verified by serving locally, never by pulling the
network away from a real installed copy.

## Why
The app was built on Windows and tested in node and a local HTTP server. Every claim about how it
behaves on an actual iPhone is currently inference. iOS in particular is where the three risky
assumptions live: that it grants GPS only to HTTPS origins, that it honours the manifest for
standalone launch, and that the service worker precache genuinely survives a cold offline start.

## Not this card
Not the Shortcut (card 0002). Not the deploy itself (0005). If a check fails, note the number here
and move this card to `todo/` so an agent picks up the fix, rather than fixing it on the phone.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the app is launched from the Home Screen icon with a location fix, THE APP SHALL show
      a distance-sorted list with the nearest site at the top.
- [ ] #2 WHEN the device is in aeroplane mode and the app is relaunched, THE APP SHALL render the
      full list without a network error.
- [ ] #3 WHEN a site's Navigate button is tapped and a map app is chosen, THE APP SHALL open that
      app with driving directions to that site's coordinate.
- [ ] #4 IF location permission is denied, THEN THE APP SHALL say so in the status line and fall
      back to an alphabetical list rather than appearing empty or stuck.
<!-- AC:END -->

## Tasks
- [ ] Run checks 1 to 5 above
- [ ] Report which passed, and the exact status line text for any that did not
- [ ] Tick the matching lines in `HUMAN_ACTIONS.md`

## Direction
**2026-08-08** Deployed and verified from a desk: HTTPS with a valid certificate, the manifest
served as `application/manifest+json`, and `api/nearest.php` returning Friston Forest first. So
checks 1 and 2 have a desk-side half already passing; what is left is genuinely phone-only, and
check 5 (offline from a cold launch) remains the one that matters.

**2026-08-08** Rob connected Cloudflare and Hostinger MCP servers so the deploy could be done from a
session rather than by hand. The infrastructure half of this card was split out to 0005 as a result;
this card kept only what needs a physical phone.

**2026-08-08** Rob, first phone test: "initial test looks good! seems to work so far!" So checks 1
to 4 are provisionally passing on a real device. **Check 5 is still outstanding and is the one that
matters**: aeroplane mode, relaunched from the Home Screen icon. Offline has still only ever been
verified by serving locally, so the app's central claim remains unevidenced. The same test also
produced card 0006 (the bearing arrow read as "straight ahead") and card 0007 (the map request).

**2026-08-08** Rob: home screen icon added, footer confirmed as `build v4`, map now loads. So
checks 1, 2 and 3 pass on the device. **Check 5 is the only one left, and it is the one the app
exists for.** It now covers more than it did: with the tile layer shipped, the offline test should
be run twice, once with Tiles off and once with Tiles left **on**, because the second is the case
where a network layer could take the map down with it. Expected with tiles on and no signal: the
bundled coastline still draws, markers still draw, no grey holes, no error page.
