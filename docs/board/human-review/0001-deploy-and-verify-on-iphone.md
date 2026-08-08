# Deploy the PWA and verify it on the iPhone

## What I need from you
Deploy `app/` to an HTTPS subdomain and run the six checks below on the phone. An agent cannot do
this: it needs hPanel access, and your standing rule is that nothing touches a live host from here.
Everything else on this board is behind it, including the Shortcut, which calls an endpoint that has
to exist first.

Suggested subdomain `forest.enhanceify.co.uk`, but any HTTPS subdomain works. Say if you would
rather it lived somewhere else and I will update the docs.

Each check names its own pass, so a failure points at one cause:

1. `https://<subdomain>/` loads with a padlock, no certificate warning.
   *Fail means* SSL is not issued yet, and GPS will silently never work.
2. `curl -sI https://<subdomain>/manifest.webmanifest | grep -i content-type`
   *Pass:* `application/manifest+json`. *Fail:* `text/plain` means the `.htaccess` `AddType` did not
   apply and iOS will ignore the manifest.
3. `https://<subdomain>/api/nearest.php?lat=50.8168&lng=-0.0894&n=3`
   *Pass:* JSON starting `{"ok":true,` with Friston Forest first.
   *Fail:* raw PHP source means PHP is off for that subdomain.
4. Safari → Share → Add to Home Screen, then launch from the icon.
   *Pass:* full screen, no Safari address bar.
5. Allow location. *Pass:* top row reads roughly `10.8 miles E, Friston Forest` from Brighton.
6. Aeroplane mode, then relaunch from the icon.
   *Pass:* the whole list still renders with distances.
   *Fail:* a Safari error page means the service worker did not install.

## Why
The app is built and tested locally but has never run on the device it was written for. Until it
does, none of the success criteria in the PRD are evidenced, and the offline claim in particular is
theory: it has been verified only by reading `sw.js`, never by pulling the network away from a real
installed copy.

## Not this card
Not the Shortcut (card 0002). Not any change to how the app looks or ranks. If a check fails, note
which one on this card and move it back to `todo/` rather than fixing it here.

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
- [ ] Create the subdomain in hPanel, document root at the contents of `app/`
- [ ] Issue the free SSL certificate
- [ ] Upload `app/` including the `.htaccess` dotfile
- [ ] Run checks 1 to 6 above
- [ ] Tick the matching lines in `HUMAN_ACTIONS.md`
