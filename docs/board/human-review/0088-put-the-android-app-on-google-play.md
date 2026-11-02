---
not_for_the_loop: needs a Google account, a payment, identity checks and an Android phone, none of which an agent holds
---

# Put the Android app on Google Play

## What I need from you
Decided 2026-11-02: an **Organisation** account for Enhanceify Ltd, owned by the Google account
`r@enhanceify.co.uk` (made that day; password and authenticator code in 1Password vault `Claude`,
item "Google account r@enhanceify.co.uk (Play Console owner)").
1. ~~Turn on 2-step verification for `r@enhanceify.co.uk`.~~ Done 2026-11-02 by Rob, from his phone.
2. ~~Get Enhanceify Ltd's D-U-N-S number.~~ Done 2026-11-02: it already existed, **232701224**
   (D&B email to r@enhanceify.co.uk). Google shows the D&B address publicly on the store page.
   Rob, 2026-11-02: the current address is fine to show for now (the building has on-site
   security). On a move, update it at D&B, in the Google payments profile and in Play Console.
3. The agent filled every sign-up page on 2026-11-02 (payments profile linked to the D-U-N-S,
   public phone +44 7946 160 204 by Rob's choice, public email r@enhanceify.co.uk, Google contact
   email play@enhanceify.co.uk, verified). Only the **Terms** page is left. It is open in the
   "Chrome (Claude)" window. If not, go to https://play.google.com/console/u/2/signup as
   `r@enhanceify.co.uk`. Tick the two agreement boxes, click **Create account and pay** and pay
   the US$25. Google may then ask for ID.
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
