---
not_for_the_loop: needs a Google account, a payment, identity checks and an Android phone, none of which an agent holds
---

# Put the Android app on Google Play

## What I need from you
1. Open a Google Play developer account at https://play.google.com/console/signup. Choose
   **Organisation** (Enhanceify Ltd) if you can get a D-U-N-S number; it skips the 14-day test.
   Choose **Personal** if not.
   Pass: you can see the Play Console dashboard. Fail: verification is refused, so tell me why.
2. If you have an Android phone, copy `C:\Dev\NearestForest\android\app-release-signed.apk` to it and open it.
   Pass: the app opens with **no browser address bar**, asks for location, and lists forests.
   Fail: a bar shows at the top (the server link file is wrong) or the list stays empty.
3. In Play Console, create the app and upload `C:\Dev\NearestForest\android\app-release-bundle.aab`
   to a test track. Leave **Play App Signing** on (the default).
   Pass: the upload is accepted. Then send me the **SHA-256** from *Test and release > App integrity > App signing key certificate*.
4. Personal account only: get 12 people to join the closed test and stay in it for 14 days.

**My recommendation:** step 1 as Organisation, then 3. Step 2 only if a phone is to hand.
Paste to answer: `**2026-11-xx** **Decided:** account type <x>; aab uploaded; app signing SHA-256 is <AA:BB:...>.`

## What you need to know
- The app is the website in an Android shell. Every normal deploy updates it. No new upload is needed for data changes.
- The Play account costs US$25 once.
- Do not call it "Forestry England" in the store title (DECISIONS 2026-09-25).
- The signing key is in 1Password, vault `Claude`. Losing it is recoverable through Play support, but slow.

---
## For the agent (Rob can stop reading here)

After Rob sends the app signing SHA-256: add it as a second entry in the
`sha256_cert_fingerprints` list in `app/.well-known/assetlinks.json`, deploy, and check
`https://forestlocator.enhanceify.co.uk/.well-known/assetlinks.json` returns both. Toolchain and
build commands: HANDOVER "Android".

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the store build is opened on an Android phone, THE APP SHALL show no browser address bar.
- [ ] #2 WHEN the live assetlinks.json is fetched, THE SERVER SHALL list both the upload key and the Play app-signing key.
- [ ] #3 WHEN the app is searched for on Google Play, THE STORE SHALL list it.
<!-- AC:END -->
