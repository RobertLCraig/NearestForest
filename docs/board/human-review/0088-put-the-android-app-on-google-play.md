---
not_for_the_loop: needs a Google account, a payment, identity checks and an Android phone, none of which an agent holds
---

# Put the Android app on Google Play

## What I need from you
Decided 2026-11-02: an **Organisation** account for Enhanceify Ltd, owned by the Google account
`r@enhanceify.co.uk` (made that day; password and authenticator code in 1Password vault `Claude`,
item "Google account r@enhanceify.co.uk (Play Console owner)").
1. Turn on 2-step verification for `r@enhanceify.co.uk` at
   https://myaccount.google.com/signinoptions/twosv (add your phone number). Google refused the
   agent with "We couldn't verify that it's you".
   Pass: the page says 2-step verification is on.
2. Get Enhanceify Ltd's D-U-N-S number, free, at https://service.dnb.co.uk/duns-enquiry
   (look it up first; ask for a new one only if none exists). Google says a new one can take up to 30 days.
   Pass: you have a nine-digit number.
3. At https://play.google.com/console/signup, signed in as `r@enhanceify.co.uk`, choose
   **An organisation > A company or business**, enter the D-U-N-S number and pay the US$25.
   Pass: you can see the Play Console dashboard. Fail: verification is refused, so tell me why.
4. In Play Console, create the app and upload `C:\Dev\NearestForest\android\app-release-bundle.aab`
   to a test track. Leave **Play App Signing** on (the default).
   Pass: the upload is accepted. Then send me the **SHA-256** from *Test and release > App integrity > App signing key certificate*.

**My recommendation:** steps 1 and 2 now, since step 2 is the slow one. An organisation account skips Google's 12-tester, 14-day test.
Paste to answer: `**2026-11-xx** **Decided:** D-U-N-S <number>; Play account live; aab uploaded; app signing SHA-256 is <AA:BB:...>.`

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
