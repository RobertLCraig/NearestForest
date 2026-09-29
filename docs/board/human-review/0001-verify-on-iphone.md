# Verify the deployed app on the iPhone

## What I need from you

**Ten seconds, and it is the only thing left on this card.** Turn location off for the app, open
it, and say what the top line reads.

    Settings > Privacy & Security > Location Services > Safari Websites > Never

- **Pass:** a red line saying location was denied, and the list still shows every site in
  alphabetical order.
- **Fail:** an empty screen, a spinner that never stops, or no message at all. Say which, and this
  card goes back to `todo/` for a fix rather than being fixed on the phone.

Turn the setting back to **Ask** or **While Using** afterwards, or the app stays alphabetical.

**Why it needs you.** It needs a real iPhone with the permission actually refused. The list half of
this is already proved by a self-test, `no-position ranking falls back to alphabetical`. What no
test here can see is whether the red line appears on the screen, and an app that goes quiet instead
of saying why is the failure worth catching.

**Everything else on this card is closed**, on your word of 2026-09-20: the app has worked without
fail throughout a road trip to and around Scotland, which settles the offline claim in the
conditions it was written for rather than by serving locally. That was the last unevidenced success
criterion in the PRD.

## Why
The app was built on Windows and tested in node and a local HTTP server. Every claim about how it
behaves on an actual iPhone is currently inference. iOS in particular is where the three risky
assumptions live: that it grants GPS only to HTTPS origins, that it honours the manifest for
standalone launch, and that the service worker precache genuinely survives a cold offline start.

## Links

**Relates to**
- `0005` - put the site on the subdomain these five checks are run against, so nothing here can be
  checked until that card had landed. It has.
- `0002` - the other way onto the same data, by Siri rather than by icon. Checking one says nothing
  about the other, which is why they are two cards.
- `0009` - the Tiles toggle check 5 asks you to run twice comes from that card, and the case where
  tiles are left on with no signal is the one it could not verify itself.
- `0020` - its acceptance #8, offline with the larger campsite dataset, is closed by check 5 here
  and nowhere else.

## Not this card
Not the Shortcut, which is card `0002`. Not the deploy itself, which is card `0005`. If a check
fails, note the number here and move this card to `todo/` so an agent picks up the fix, rather than
fixing it on the phone.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN the app is launched from the Home Screen icon with a location fix, THE APP SHALL show
      a distance-sorted list with the nearest site at the top. proves: manual - Rob, 2026-09-20.
- [x] #2 WHEN the device is in aeroplane mode and the app is relaunched, THE APP SHALL render the
      full list without a network error. proves: manual - Rob, 2026-09-20, across a road trip to and
      around Scotland.
- [x] #3 WHEN a site's Navigate button is tapped and a map app is chosen, THE APP SHALL open that
      app with driving directions to that site's coordinate. proves: manual - Rob, 2026-09-20.
- [ ] #4 IF location permission is denied, THEN THE APP SHALL say so in the status line and fall
      back to an alphabetical list rather than appearing empty or stuck. proves: manual - the
      ranking half is already proved by `no-position ranking falls back to alphabetical`; what is
      unevidenced is the status line on the device, which is Settings > Privacy > Location Services
      > Safari Websites > Never, then open the app.
<!-- AC:END -->

## Tasks
- [ ] Run checks 1 to 5 above
- [ ] Report which passed, and the exact status line text for any that did not
- [ ] Tick the matching lines in `HUMAN_ACTIONS.md`

## Direction
**2026-08-08** Deployed and verified from a desk: HTTPS with a valid certificate, the manifest
served as `application/manifest+json`, and `api/nearest.php` returning Friston Forest first. So
checks 1 and 2 have a desk-side half already passing; what is left is genuinely phone-only, and
check 5 (offline from a cold launch) remains the one that matters.

**2026-08-08** Rob connected Cloudflare and Hostinger MCP servers so the deploy could be done from a
session rather than by hand. The infrastructure half of this card was split out to 0005 as a result;
this card kept only what needs a physical phone.

**2026-08-08** Rob, first phone test: "initial test looks good! seems to work so far!" So checks 1
to 4 are provisionally passing on a real device. **Check 5 is still outstanding and is the one that
matters**: aeroplane mode, relaunched from the Home Screen icon. Offline has still only ever been
verified by serving locally, so the app's central claim remains unevidenced. The same test also
produced card 0006 (the bearing arrow read as "straight ahead") and card 0007 (the map request).

**2026-08-08** Rob: home screen icon added, footer confirmed as `build v4`, map now loads. So
checks 1, 2 and 3 pass on the device. **Check 5 is the only one left, and it is the one the app
exists for.** It now covers more than it did: with the tile layer shipped, the offline test should
be run twice, once with Tiles off and once with Tiles left **on**, because the second is the case
where a network layer could take the map down with it. Expected with tiles on and no signal: the
bundled coastline still draws, markers still draw, no grey holes, no error page.

## Comments

**2026-09-20** **Decided:** checks 1 to 3 pass. Rob, today: "the aeroplane-mode test was previously
tested and shown to be working. So far the app has worked without fail any time I have tried to use
it while on my road trip to and around scotland. calling this a success."

**That closes the criterion this whole project was waiting on.** #2 is the offline one, and a week
of Scottish forest car parks is a harder test than the aeroplane-mode run this card specified, not
an easier one: real dead signal, cold launches, a route the dataset had never been driven against.
It is marked `proves: manual` with his name and today's date, which is what settles a criterion no
test in this repository can reach. It also closes card `0020` criterion #8, which was pinned to it,
and it is the last unevidenced success criterion in the PRD.

**#4 is left open, deliberately, and it is not a quibble.** It is the permission-denied path:
location refused, so the app must say so in the status line and fall back to an alphabetical list.
"It worked every time I used it" is evidence about the path where location is granted and says
nothing about the path where it is refused. The ranking half is already proved by the assertion
`no-position ranking falls back to alphabetical` in `scripts/selftest.js`; the status line has never
been seen on a device. The ask at the top of this card is now only that, and it is ten seconds.

**Why the card stays here rather than going to `todo/`.** Its one open criterion is `proves: manual`,
so an unattended session could not close it and the loop would hold it for a person anyway. Leaving
it in this lane with a ten-second ask is the same outcome without the two lane moves.

**Not done, and worth saying plainly:** the two map fixes built on 2026-09-10 are still not
deployed, so the phone that passed this test is running the old build. Cards `0008` and `0012`.

**2026-09-25** Rob ran the check on the iPhone, 2026-09-25, with location set to Never. The top line read: Location permission denied. Enable it in Settings > Safari > Location. Showing distances from your last known position. So the app says why, and none of the fail cases (empty screen, endless spinner, no message) happened. One difference from the card: the list was ranked from the last known position, not alphabetically, because the phone had a stored position. Tick the criterion if that fallback is intended, which it reads as. If not, say so here.

**2026-09-29** Checked by an attended agent under Rob's rule that human-review holds only what he must decide. **The last-known-position fallback is intended, and it is written down twice.** `docs/PRD.md` FR5 says to persist the last known position so a cold launch without a GPS fix still shows a plausible list. The error branch of `locate()` in `app/app.js` does exactly that: it calls `loadStale()` and, when a stored position exists, sets the status to the denial message plus "Showing distances from your last known position." Only when nothing is stored does it say "The list is alphabetical until a fix arrives." Rob's 2026-09-25 reading on the iPhone is the first branch, word for word. So #4 holds: the app says why in the status line, and the fallback is the PRD's own. The alphabetical branch is the `else` of the same `if`, and the self-test `no-position ranking falls back to alphabetical` covers the ranking half. Nothing is left to build. Moved to `ai-review/` for its review; #4 stays unticked, because this pass never ticks a box.

### 2026-09-29 review (v20260929011046-fa79)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I tried to break the one open criterion, #4. I could not.

**#4, the status line.** In `app/app.js`, the error callback inside `locate()` handles a refused permission (`err.code` 1). It sets the text "Location permission denied. Enable it in Settings > Safari > Location." through `setStatus()`. It then adds one of two endings:
- If `loadStale()` finds a stored position, it adds "Showing distances from your last known position." The line uses class `status--stale`.
- If no position is stored, it adds "The list is alphabetical until a fix arrives." The line uses class `status--err`.

Both branches call `render()`. So the list is never empty and never stuck. The spinner class is also removed.

**#4, the alphabetical list.** `NF.rank` in `app/core.js` sorts by name when there is no position. The self-test `no-position ranking falls back to alphabetical` covers this.

**One gap, but not a failure.** Rob saw the stored-position branch on 2026-09-25. His text matches the code word for word. That branch ranks by distance, not by name. `docs/PRD.md` FR5 asks for this behaviour, so the code does what the spec says. That line shows amber (`--warn`), not red. The card's pass test asked for a red line, but #4 itself only says "say so in the status line", and it does.

Criteria #1 to #3 are closed by Rob's check on the phone.

VERDICT: sound

**scope: defect**

I checked what the work on this card did, and what it left undone.

**Nothing crossed the card's limits.** The work on card 0001 is one commit, `8034406`. That commit changed one file: `docs/board/ai-review/0001-verify-on-iphone.md`. It did not change app code, the Shortcut (0002) or the deploy (0005). Most of the 166 files in the diff come from other cards' commits in the same range.

Criterion #4 is supported by what Rob saw on the phone. On 2026-09-25 the status line read "Location permission denied...". That text comes from the error branch of `locate()` in `app/app.js`, which reads the stored position through `loadStale()`. PRD FR5 asks for exactly this fallback.

**One card task is half done.** The card's Tasks list says "Tick the matching lines in `HUMAN_ACTIONS.md`". The offline check (#2) was closed on 2026-09-20. But in `HUMAN_ACTIONS.md`, section "Created 2026-08-08", the line "Test offline properly" is still unticked. It also still says the check is "still unevidenced". Its link goes to `docs/board/human-review/0001-verify-on-iphone.md`, and that file was moved, so the link is broken. The `0002` and `0003` links in the same block may be out of date too. I did not check them.

This does not disprove any acceptance criterion. So I give no `UNMET:` line, and the card will come back to review. The fix is to tick that line and repoint the link to `docs/board/ai-review/0001-verify-on-iphone.md`.

VERDICT: defect

**breakage: sound**

I tried to break criterion #4. I could not.

**What I checked**

- The error branch of `locate()` in `app/app.js`. The denial message (code 1) says: "Location permission denied. Enable it in Settings > Safari > Location."
- When a stored position exists, `loadStale()` returns true. Then the app adds "Showing distances from your last known position." This is word for word what Rob saw on the iPhone on 2026-09-25.
- When nothing is stored, the app adds "The list is alphabetical until a fix arrives." Then `render()` runs, so the list is never empty.
- `docs/PRD.md` FR5 asks the app to keep the last known position. So the ranked-from-last-position result is intended. The card's "alphabetical" wording describes the other branch only.
- None of the three fail cases can happen on the denial path. There is no empty screen: `render()` always runs. There is no endless spinner: the error callback removes `is-spinning`. There is always a message: the status line is set in both branches.

**What is left**

Nothing is broken. #4 can be ticked on Rob's 2026-09-25 reading. Ticking it is the script's job, not mine.

VERDICT: sound


**2026-09-29** The loop moved this card from todo/ to human-review/ WITHOUT trying it. All 1 of its open acceptance criteria say proves: manual, so there is nothing left an unattended session could close and starting one would change nothing. Each open criterion names what to look at and what a pass is: tick what passes and move the card on, or say what failed and move it back to todo/.
