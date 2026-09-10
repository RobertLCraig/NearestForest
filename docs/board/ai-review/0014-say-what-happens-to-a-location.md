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
