# Build the iOS Shortcut, then pick the Shortcut or the web app

## What I need from you
1. On your iPhone, follow `docs/build/IOS-SHORTCUT.md`. Add a **Show Result** action straight after step 2 and run it. Pass: it shows a URL like `https://forestlocator.enhanceify.co.uk/api/nearest.php?lat=50.8168&lng=-0.0894&n=5`. If not, the recipe's "When step 2 will not build the URL" table names the fix.
2. Finish the seven actions. Pass: "Hey Siri, Nearest Forest" reads out five forests and opens your map app on the one you pick.
3. Use the Shortcut and the web app side by side for two weeks, then answer below.

**My recommendation:** if the Shortcut still fights you after one more try, drop it and keep only the web app.
Paste to answer: `**2026-10-07** **Decided:** after two weeks I kept using <the Shortcut / the web app>; the Shortcut <did / never> failed where the web app worked.`

## What you need to know
- On 2026-09-20 you got stuck at step 2: the location values would not go into the URL. The recipe now has a table of the three usual causes (the variable inserts as a place name, the number gets formatted, the Shortcuts app has no location permission).
- Only a phone can build a Shortcut. Apple's file format is signed.
- The Shortcut is hands-free but needs mobile signal. The web app needs a tap but works with no signal.
- The Shortcut covers forests only. Campsites are not in it.
- Keeping both means maintaining both, so one should probably win.
- If an action name has changed in the Shortcuts app, say what you saw in a comment. The recipe gets fixed rather than worked around.

## See it
- Recipe: `C:\Dev\NearestForest\docs\build\IOS-SHORTCUT.md`
- Control test, in Safari on the phone: https://forestlocator.enhanceify.co.uk/api/nearest.php?lat=50.8168&lng=-0.0894&n=5 (should list Friston Forest first)
- Web app: https://forestlocator.enhanceify.co.uk/

---
## For the agent (Rob can stop reading here)

**Relates to**
- `0005` - deployed `api/nearest.php`, the endpoint the Shortcut calls.
- `0001` - checked the web app on the same phone; the verdict covers both.

Not this card: changing the endpoint or the web app.

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
- [ ] Use both for two weeks, then record the verdict

## Comments
**2026-08-08** The endpoint this recipe depends on is deployed and verified. Substitute
`forestlocator.enhanceify.co.uk` wherever `docs/build/IOS-SHORTCUT.md` leaves the host as a
placeholder.

**2026-09-20** Rob: "not had any luck with this so far, run into issues with the shortcut using
location variables."

**2026-10-07** Condensed for reading. The step 2 diagnosis now lives in the recipe's "When step 2 will not build the URL" table. Git keeps the long version.
