# Add accounts and personal location tracking

## What I need from you

**One answer: Google only, or Google and Apple?**

Your position on 2026-09-20 was "ideally no, but some of the new features I want in other cards may
require them", and you are right that Hostinger can host it. So the old question, whether this is
possible at all, is gone. What is left is one supplier choice, and it is the only part that costs
money.

- **Google only.** Free, no annual fee, works on every device. The cost is that anyone without a
  Google account cannot sign in, and on an iPhone "Sign in with Google" is the less natural button.
- **Google and Apple.** Adds the button iPhone users expect and lets people hide their real email
  behind Apple's relay. **Sign in with Apple needs an Apple Developer Program membership, which is
  £79 a year**, and that is the whole of the extra cost.

**Pass** is either named here, or "no accounts, close it". **Fail** is nobody deciding, because all
seven criteria say `proves: manual` and no session can move one.

**Why it needs you.** It is a cost you carry every year and a privacy call about your own users.
Neither is a lookup.

---

**Correcting this card, because it said something false and that is what made the decision look
bigger than it is.** The old version said "Hostinger serves plain files here, so it cannot do that
job". That is wrong. The vhost already runs **PHP 8.4**, pinned deliberately, and already serves two
PHP endpoints, `api/nearest.php` and `api/tiles.php`. Your Hostinger plan includes MySQL. So the
server half of accounts needs no new supplier and no new hosting bill: sessions, a users table and a
visited/favourite table all sit on what you are already paying for. **Worth confirming the MySQL
database exists in hPanel before anyone builds**, since nothing in this repository can see it.

**What "OAuth with Google and Apple" actually means here**, since it changes the shape of this card.
The app never sees or stores a password. It sends the person to Google or Apple, gets back a signed
token saying who they are, and keeps its own row keyed to that identity. The second acceptance
criterion below, about registering with an email address and password, verifying the address and
providing a password-reset route, **describes a different design and should be rewritten or dropped
before this is built.** Password reset is most of the security surface of an accounts system, and
OAuth is worth choosing partly because it deletes that surface rather than hardening it.

**One thing that does not apply, so nobody raises it.** App Store rules require Sign in with Apple
alongside other social logins. This is a PWA and `docs/PRD.md` lists "No App Store release" as a
non-goal, so that rule reaches nothing here. Apple is a choice about what iPhone users expect, not
a requirement.

**And the thing this card must not break.** Finding and navigating must keep working with no account
and no signal. That is the whole app. Accounts are an addition for the people who want them, and a
lost connection must never hide the bundled data. `## Not this card` below already fences this and
it is the part to read twice.

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

**Build it on the hosting that is already paid for, with OAuth rather than passwords.** The vhost
runs PHP 8.4 and already serves `api/nearest.php` and `api/tiles.php`, and the Hostinger plan
includes MySQL, so no new supplier is needed for sessions, a users table or a per-user tracking
table. **Confirm the database exists in hPanel first**, because nothing in this repository can see
it. Identity comes from Google, and from Apple if that is the answer to the ask at the top; the app
never holds a password, which removes email verification and password reset from the build and with
them most of its security surface.

**The client OAuth secret and the database credentials are secrets and follow the rule already
established here**: a file above the web root, mode 600, read per request, never in the repository,
never in a card, never in a chat. `app/api/tiles.php` and `tiles.key` are the working pattern to
copy, and `.gitignore` already refuses `*.key`.

**Ownership is enforced in the query, not in the interface.** Every read and write is keyed to the
session's identity in SQL. Hiding a control in the PWA is not a permission check, and the first
thing to prove is the boundary above.

Document configuration, migration, data retention and account deletion. Do not create paid services,
change the live host or deploy from this card without a person driving those external actions.

**Verify on a phone-sized screen.** A signed-out person can still locate and navigate to a bundled
site offline. With a connection, a new account can verify its email, mark a forest visited and a
campsite favourite, see both after signing in on a second device, and see neither state after signing
out. Confirm password reset and an attempted cross-account request fail safely.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-06** The loop moved this card from todo/ to human-review/ WITHOUT trying it. All 7 of its open acceptance criteria say proves: manual, so there is nothing left an unattended session could close and starting one would change nothing. Each open criterion names what to look at and what a pass is: tick what passes and move the card on, or say what failed and move it back to todo/.

**2026-09-20** Rob: "I'd ideally like to go with no, but some of the new features I want in other
cards may require them. Why cant hostinger host that? (remember as of right now, its not a real app,
and hostinger can easily host a mysql database) backed with oauth for google and apple".

**He is right and the card was wrong.** It said "Hostinger serves plain files here, so it cannot do
that job", and that claim is what made this look like a card needing a new supplier and a new bill.
The vhost runs PHP 8.4, pinned on purpose and recorded in HANDOVER's Deployment section, and already
serves `api/nearest.php` and `api/tiles.php`. The plan includes MySQL. The server half of accounts
needs nothing new. `## What I need from you` is corrected and the false sentence is gone.

**Where the claim came from.** Not from anybody testing it. `docs/HANDOVER.md` says "Static files
only. No build step, no bundler, no npm, no framework, no database", which is a description of a
deliberate choice, and a session writing this card read it as a description of a limit. That is the
same failure this board keeps finding in its tests: a statement that cannot be distinguished from
the thing it is mistaken for.

**What the decision shrank to.** One supplier choice with one price on it. Google OAuth is free.
Sign in with Apple needs an Apple Developer Program membership at £79 a year, and that is the entire
incremental cost of the pair. Both are recorded in the ask above with what each buys.

**The acceptance criteria now describe the wrong design.** Criterion #2 asks for registration with
an email address and password, address verification and a password-reset route. Under OAuth the app
never sees a password and that criterion should be rewritten or dropped rather than built. It is
flagged in the ask rather than edited here, because rewriting acceptance on a card whose direction
is still open would be inventing the answer.

**Still not started, and rightly.** Rob's own preference is no accounts, and the trigger is
whichever future feature turns out to need them. A card that begins on a maybe is how a static
offline app grows a login screen nobody asked for.
