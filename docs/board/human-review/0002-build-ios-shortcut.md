---
needs: 0001
waiting_on: card 0001 to deploy the endpoint - recheck 2026-08-22
---
# Build the iOS Shortcut

## What I need from you
Build the Shortcut on the phone by following `docs/build/IOS-SHORTCUT.md`, then use both it and the
PWA for a couple of weeks and say which you actually reach for. A `.shortcut` file is a signed Apple
format that cannot be generated off-device, so this is a five-minute build by hand rather than
something I can hand you.

Blocked until card 0001 is deployed, because step 3 of the recipe calls the live endpoint.

The comparison is the point of building both. The two things worth noticing:
1. Does Siri triggering actually get used while driving, or does the phone stay in the cradle?
2. Does the Shortcut fail in a real forest car park where the PWA keeps working?

## Why
Two access methods were built deliberately (DECISIONS 2026-08-08) because they have different
strengths and only real use settles which is worth keeping. The Shortcut is hands-free and needs
signal; the PWA needs a tap and works with no connection at all. Keeping both forever is a
maintenance cost for a personal app, so one should probably win.

## Not this card
Not changing the endpoint or the PWA. If the recipe is wrong or an action name has changed in the
current iOS Shortcuts app, note it here and move to `todo/` so the doc gets fixed.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN "Hey Siri, Nearest Forest" is spoken, THE APP SHALL offer a chooseable list of the
      five nearest forests with distances.
- [ ] #2 WHEN a forest is chosen from that list, THE APP SHALL open the selected map app with
      driving directions to it.
- [ ] #3 WHEN the same location is used, THE APP SHALL return the same nearest site as the PWA.
<!-- AC:END -->

## Tasks
- [ ] Build the seven-action Shortcut from `docs/build/IOS-SHORTCUT.md`
- [ ] Add the three-way map app menu, or decide one app is enough and note which
- [ ] Cross-check its top result against the PWA from the same spot
- [ ] Use both for two weeks, then record the verdict under `## Direction`
