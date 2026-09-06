# Add accounts and personal location tracking

## Why
**The app cannot remember a place once somebody has been there.** A regular visitor has to keep a
separate mental or paper list of forests, car parks and campsites they have already used, and has no
way to keep the few they want to return to close at hand.

**That makes repeat use slower and less useful.** The same unlabelled list is shown to everybody,
even though a person may be trying to avoid somewhere they have already visited or find a trusted
favourite. Nothing was omitted deliberately: the PWA was built as a static, anonymous, offline-first
finder, so it has neither identities nor anywhere private data could be stored.

## Not this card
**A social product.** Do not publish visits, show other people's favourites, add reviews, photos or
sharing links.

**Replacing anonymous browsing.** Finding and navigating to locations must remain available without
an account, and the existing offline finder must keep working. Signing in and syncing personal data
may need a connection, but a lost connection must not hide the bundled location data.

**More personal collections.** Visited and favourite are the two states in this card. Notes, tags,
ratings, trip planning, imports and exports need separate cards.

## Acceptance
<!-- AC:BEGIN -->
- [ ] WHEN an anonymous visitor marks a location as visited or favourite, THE APP SHALL offer sign-in
      or registration before saving a personal state. proves: manual
- [ ] WHEN a person registers with an email address and password, THE APP SHALL create an account,
      verify the address, establish a session and provide a safe password-reset route. proves: manual
- [ ] WHEN a signed-in person views any forest, car park or campsite, THE APP SHALL let them add or
      remove independent visited and favourite states for that location. proves: manual
- [ ] WHEN a signed-in person changes either state, THE APP SHALL show the new state immediately and
      retain it after a fresh sign-in on another device. proves: manual
- [ ] WHEN two signed-in people use the app, THE APP SHALL expose and change only the current
      person's tracking records. proves: manual
- [ ] WHEN a person signs out, THE APP SHALL end the local session and stop showing their personal
      states until they sign in again. proves: manual
- [ ] WHEN personal data handling fails, THE APP SHALL give a plain recovery message without exposing
      account existence, another person's data, tokens or implementation errors. proves: manual
<!-- AC:END -->

## Tasks
- [ ] Record the existing anonymous/offline behaviour before making an account-related change
- [ ] Select and document an authentication and data service compatible with a static PWA
- [ ] Model one private tracking record per user, site ID and state, with server-enforced ownership
- [ ] Build registration, email verification, sign-in, sign-out and password-reset journeys
- [ ] Add visited and favourite controls to location details and clear state indicators in lists
- [ ] Sync tracking changes for signed-in users while preserving anonymous offline browsing
- [ ] Add automated coverage for session boundaries and cross-user access, then perform the acceptance checks

## Plan
**Where to stand.** Work in this repository, starting with `app/app.js`, `app/core.js` and
`app/index.html`; location IDs in `app/data/sites.json` and `app/data/campsites.json` are the stable
keys for tracking records. Read `docs/PRD.md`, especially its current static-hosting and offline
constraints, before selecting a service.

**First prove the boundary.** Browse the app signed out, then on two distinct test accounts. Attempt
to read and change one account's tracking records using the other account and with no session. The
chosen service must reject every unauthorised request at the data layer; hiding controls in the PWA
is not a permission check.

**Use a managed authentication service or a separately deployed HTTPS API that supports email
verification, password resets, secure sessions and row-level per-user access.** The current Hostinger
static deployment cannot securely hold credentials or enforce ownership itself. Keep service secrets
off the client and document required configuration, migration, data-retention and account-deletion
steps. Do not create paid services, change the live host or deploy from this card without a person
driving those external actions.

**Verify on a phone-sized screen.** A signed-out person can still locate and navigate to a bundled
site offline. With a connection, a new account can verify its email, mark a forest visited and a
campsite favourite, see both after signing in on a second device, and see neither state after signing
out. Confirm password reset and an attempted cross-account request fail safely.
