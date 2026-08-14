# Build the iOS Shortcut

## What I need from you

**Build the Shortcut from `docs/build/IOS-SHORTCUT.md`, then use it and the PWA side by side for a
couple of weeks and say which one you actually reach for.**

No longer blocked: card 0005 deployed the endpoint on 2026-08-08. Step 3 of the recipe should call

    https://forestlocator.enhanceify.co.uk/api/nearest.php?lat=<lat>&lng=<lng>&n=5

which is live now and returns Friston Forest first from Brighton.

The comparison is the point of building both. The two things worth noticing:
1. Does Siri triggering actually get used while driving, or does the phone stay in the cradle?
2. Does the Shortcut fail in a real forest car park where the PWA keeps working?

**Pass** is the Shortcut built and working, plus a verdict recorded under `## Direction` naming
which of the two you kept using.

**Fail** is the recipe being wrong, which is a real possibility: if an action name has changed in
the current Shortcuts app, note it here and move the card to `todo/` so the doc gets fixed rather
than working around it on the phone.

**Why it needs you** A `.shortcut` file is a signed Apple format that cannot be generated
off-device, so the build is five minutes by hand rather than something anybody can hand you. The
verdict is the other half: only real use over a couple of weeks settles which access method is worth
keeping, and keeping both forever is a maintenance cost for a personal app.

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

## Direction
**2026-08-08** The endpoint this recipe depends on is deployed and verified. Substitute
`forestlocator.enhanceify.co.uk` wherever `docs/build/IOS-SHORTCUT.md` leaves the host as a
placeholder.
