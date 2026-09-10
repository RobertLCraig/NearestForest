---
no_outward_effect: "sent" in criterion #1 is the footer promising that nothing leaves the phone, which is the opposite of an outward effect
---
# Say what happens to a location

## What I need from you

**One call.** Untick criterion `#2` below, so the card goes back to `todo/` and the footer wording
gets fixed — **or** write on the thread that the reviewer is wrong and the card stands as done.
Doing neither is the fail: it comes straight back to this lane, unchanged, on the next run.

---

**What's wrong.** The footer says your location never leaves the phone and that the **Tiles** layer
is the one exception. There is a second one. Tapping **Google Maps**, **Apple Maps** or **Waze** on
a site hands that company the forest you picked and your address, via `navUrl` in `app/core.js`.
So the app is not quite doing what the footer says, which is what criterion `#2` claims it does.

A second, smaller finding sits under Tasks rather than a criterion: the guard in
`scripts/selftest.js` matches only the phrase `location stays on this phone`. Someone can delete
the whole Tiles sentence and the suite stays green, which is the exact failure that task existed to
stop.

**Cause.** A reviewer may not edit acceptance, so the card came back with 2 of 2 ticked. Every
unattended session since has read the boxes, found nothing open, and promoted it again.

**Pass** is either of:
- `#2` unticked and the card back in `todo/`; or
- a dated line in `## Comments` saying which part of the finding is wrong, boxes left ticked.

**Fail** is leaving it as it is.

**Why it needs you.** The reviewer graded acceptance `sound`, so no box is plainly false. Whether a
link the user deliberately taps to leave the app counts as the app "sending" anything is a
judgement about how you want to be read, not a lookup.

**Note on length.** This card is now 134 lines against a 100-line budget. `## Direction` and
`## Comments` are append-only and hold most of it, so this card could not bring it under.

## Why
The app asks for a precise location the moment it opens, stores it in `localStorage` indefinitely,
and said nothing about either. That was defensible while it was one person's app on one phone. It
is not defensible now that it is being handed to other people, who have no way to know from the
outside that there is no server to send anything to.

The honest position is unusually strong here and worth claiming rather than assuming: no accounts,
no analytics, no cookies, no server-side state, and the 2026-08-10 review confirmed by sweeping
every network call in the shipped code that the only runtime requests are same-origin. The one
genuine caveat is the tile layer: while it is on, tile requests pass through this site, so the
server's access log records which part of the map a visitor is looking at, against their address.
That proxy protects them from the provider, which never sees their address, and it is still worth
saying out loud rather than leaving them to infer it.

## Not this card
Not a "forget my location" control, and not an expiry on the stored position. Both are real gaps
the same review raised and both are behaviour changes rather than a statement of what already
happens; they belong in their own card with their own acceptance. Not a separate privacy page: a
paragraph in the footer is read and a linked page is not.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN the list is scrolled to the bottom, THE APP SHALL state that the location stays on
      the device, that nothing is sent anywhere, and what the tile layer changes.
- [x] #2 WHEN the statement is checked against the code, THE APP SHALL be doing what it says.
<!-- AC:END -->

## Tasks
- [x] Footer paragraph in `index.html`, above the existing OGL attribution
- [x] Self-test asserting the statement is present, so a future edit cannot quietly drop it
- [x] Read it on the phone and check it does not push the attribution off the useful part of the page

## Plan
Wording stays plain and specific: what is collected, where it stays, and the single exception,
named as the control the reader can see (**Tiles**) rather than described. It sits above the OGL
attribution because it is the more useful of the two to a person holding the phone.

## Direction
**2026-08-10** Read on the device. Seven lines at phone width, sitting under the build string and
above the OGL attribution, which is still fully visible below it. Nothing is pushed off, and
neither paragraph is reachable without deliberately scrolling past 274 rows, which is the right
place for both.

### 2026-09-07 review (v20260907173536-5c8d)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Checked both boxes against the code.

**#1 ÔÇö the statement is at the bottom of the list.** `app/index.html`, the `<footer class="foot">` inside `<main>`, sits after `<ol id="list">`. Its paragraph says the location stays on the phone, that nothing is sent anywhere, and names the **Tiles** layer as the one exception. `.foot` in `app/app.css` only pads it; nothing hides it.

**#2 ÔÇö the code does what it says.** Traced every runtime call:
- Location: `app/app.js` reads and writes `LS_KEY` in `localStorage` around `navigator.geolocation.getCurrentPosition`. It is never put in a request.
- Requests: `loadJson` in `app/app.js`, the boundary fetch in `app/map.js`, and the cache fetches in `app/sw.js` are all same-origin paths.
- Tiles: `drawTiles` in `app/map.js` sets `t.img.src = 'api/tiles.php?...'`, so tiles do pass through this site, matching "the server sees which part of the map you are looking at". `tilesOn` starts `false` and is only turned on by the `#map-tiles` button handler in `map.js` `init`, matching "off unless you turn it on".

I tried to break it on the navigation buttons (`navUrl` in `app/core.js` hands coordinates to Google, Apple or Waze), but that is a link the user taps to leave the app, not the app sending anything.

One weakness, not a criterion: the guard in `scripts/selftest.js` tests only the phrase `location stays on this phone`, so a later edit could drop the tile sentence without failing.

VERDICT: sound

**scope: defect**

Scope check on card 0014.

**Over the fence: nothing.** No "forget my location" button, no expiry on the stored position. `loadStale` and `locate` in `app/app.js` still just read and write `LS_KEY`, unchanged. No privacy page was added. The fence held.

**Half done: the guard.** The task said a self-test "so a future edit cannot quietly drop it". In `scripts/selftest.js`, the check `ok('the app states its privacy position in the footer', ...)` tests one regex only: `/location stays on this phone/i`. Criterion #1 asks for three things. The other two ÔÇö that nothing is sent anywhere, and what the **Tiles** layer changes ÔÇö have no test at all. Someone can delete the whole tile-exception sentence from the `footer.foot` block in `app/index.html` and the suite stays green. That is exactly the failure the task was written to stop.

**One more note.** The footer paragraph landed inside commit `de37fb2`, which is the tile-proxy security card's commit. That is why git shows no diff for this card, and why the work cannot be reviewed or reverted on its own.

VERDICT: defect

**breakage: defect**

Two things break.

**1. The footer says there is one exception; there are two.** `navUrl` in `app/core.js` builds `maps.apple.com`, `google.com/maps/dir` and `waze.com/ul` links, and the `[data-app]` click handler in `app/app.js` sets `window.location.href` to them. Tapping **Google Maps** hands Google the forest you picked, plus your IP. The `siteUrl` links and the OpenStreetMap credit link in `app/index.html` do the same. So "nothing you do is sent anywhere. The one exception is the optional *Tiles* layer" is not what the code does. AC #2 asks for exactly this check.

**2. The self-test pins one phrase out of three.** In `scripts/selftest.js`, the `ok('the app states its privacy position in the footer', ...)` check tests only `/location stays on this phone/i`. The "nothing is sent" sentence and the whole *Tiles* caveat can be deleted and the suite stays green. The card's own task said a future edit must not quietly drop it. Compare the neighbouring footer checks, which pin each credit separately.

Fix 1 by naming the map hand-off as the second exception. Fix 2 by asserting the Tiles sentence too.

VERDICT: defect


## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-10** Rob's call, answering the queue: **re-run this card through `ai-review/`.** It met
its own acceptance - the reviewer graded that lens `sound` - and the finding that returned it is
next door to the card rather than inside it. A builder could not act on it and a reviewer may not
untick a box, so the card sat here fully ticked while every unattended run promoted it again. It is
not closed and it is not reopened. It goes back for a fresh adversarial pass with the earlier
verdicts still on the thread, and that pass decides whether the finding is this card's to carry.

### 2026-09-10 review

**suite**

`node scripts/selftest.js`, green at `280 passed, 0 failed` before and after. I also read the
footer in a running browser (`php -S 127.0.0.1:8792 -t app`) at 414x896, which is the width this
paragraph was written for.

**acceptance: defect**

**#1 - the statement is at the bottom of the list. Sound, and looked at rather than grepped.** The
footer renders under the last row, all three clauses present and legible, above the OGL and ODbL
credits, and nothing is pushed off the page.

![the footer as it reads on a phone](../attachments/0014-2026-09-10-1.png)

**#2 - the app is doing what it says. Defect, and it is narrower than the earlier finding claimed.**
I traced the location itself and it genuinely never leaves the device. `navUrl` in `app/core.js`
builds the maps link from the **forest's** coordinates and not the user's - live, from the running
app, the Google button resolves to
`https://www.google.com/maps/dir/?api=1&destination=50.758118%2C-4.000430&travelmode=driving` -
so "Your location stays on this phone", which is the sentence in bold and the one the self-test
pins, is exactly true. Every runtime request is a same-origin relative path.

![the hand-off the footer does not mention](../attachments/0014-2026-09-10-2.png)

What is not true is the wider clause beside it: **"nothing you do is sent anywhere"**. Tapping
**Navigate** hands Apple, Google or Waze the forest you chose and your address, and on the live
site, under `Referrer-Policy: strict-origin-when-cross-origin`, it also hands them
`forestlocator.enhanceify.co.uk` as the referring origin. This is not a technicality invented by a
reviewer: card 0013 added `rel="noreferrer"` to the two links in the detail sheet *for exactly this
reason*, so the app already treats "the destination should not learn where you came from" as worth
a line of code - and the one action the whole app exists to perform is the one that does not get
it. Criterion #2 is "the statement checked against the code", which is precisely this check, so the
finding is this card's to carry.

I cannot untick the box and have not. A person must.

VERDICT: defect

**scope: defect**

Nothing over the fence: no "forget my location" control, no expiry on the stored position, no
separate privacy page. The half-done part is the guard, and I measured both halves of it today
rather than reasoning about the regex:

- deleting the **entire Tiles caveat** from the footer - the sentence beginning "The one exception
  is" through "It is off unless you turn it on." - leaves the suite at **280 passed, 0 failed**;
- deleting **"There are no accounts, no tracking and no analytics, and nothing you do is sent
  anywhere."** leaves the suite at **280 passed, 0 failed**;
- only changing "Your location stays on this phone" turns
  `the app states its privacy position in the footer` red.

Criterion #1 names three things and the task said the test existed "so a future edit cannot quietly
drop it". One of the three is pinned. The neighbouring licence checks in the same block pin each
obligation separately and are the model to copy; two more `flat.includes(...)` lines finish it.

VERDICT: defect

**breakage: defect**

Both findings above are the breakage, and they point the same way: the footer is the only thing in
this app that makes a promise, and the promise is one clause wider than the code. Neither is
exploitable and neither breaks a screen. What breaks is the card's own claim.

VERDICT: defect

**security**

**Weakest, said as an attacker would use it.** There is nothing here to attack - no server, no
account, no session. The realistic adversary is a future contributor, and the weak point is that
this card shipped a *promise* with no runtime enforcement and, as measured above, a guard covering
one sentence in three. The thing that actually stops an analytics snippet or a font from a CDN is
`connect-src 'self'` in the CSP, which lives on card 0011 and can be commented out of `.htaccess`
without turning the suite red. So the honest statement is that the footer's claim is currently
enforced by habit and by a header nobody re-verifies, not by this card.

**What is unchecked on any path in.** The stored position. `loadStale` in `app/app.js` reads
`localStorage`, type-checks `lat` and `lng` as numbers and applies them with no range check and no
expiry, indefinitely. Anything that can write to that origin's storage can move where the app
thinks the user is - though anything that can write there has already won - and the absence of an
expiry means a position taken once is remembered until the browser data is cleared. Both are
explicitly out of this card's scope and are noted, not charged.

**What it leaks when it fails.** Nothing server-side; there is nothing to leak. The disclosures
that exist are the two the footer should be naming: the tile proxy's access log, which it does
name, and the maps hand-off, which it does not. Neither carries the user's own position.

VERDICT: defect
