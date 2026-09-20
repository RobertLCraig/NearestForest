# Show the cardinal point, not just a bearing arrow

## What I need from you

**Two answers.**

1. Did the reviewer disprove criterion #3? Untick it, or say here why the finding is wrong.
2. Do the compass letters still fit on the narrowest phone in portrait?

---

**On 1.** Criterion #3 says a screen reader must speak "north-east", because VoiceOver reads the
letters `NE` as the word "nee". A reviewer found the spoken word is set as `aria-label` on a plain
`<div>`, and browsers throw a label there away, so VoiceOver still says "nee". A reviewer is not
allowed to untick a box, so the card came back with all four ticked, every session found nothing
open to do, and the loop promoted it again.

- **Pass:** #3 is unticked so the card can go back to `todo/`, **or** a comment here says why the
  finding is wrong.
- **Fail:** the box stays ticked with no reason written. The loop then promotes it on the boxes a
  second time, which is the exact thing that already happened.

**On 2.** The letters widened the distance column from 74px to 84px, which squeezes the name beside
it. Nobody has looked. Open the list on your phone in portrait and find the row for **Kings Wood and
Challock Forest**, which is the longest name in the data.

- **Pass:** the name is not cut short, and the row does not wrap.
- **Fail:** it is cut or it wraps. Say so in this thread.

**Why it needs you.** 1 is a call about the accessibility standard you want for your own app. 2
needs a real phone; nothing here can see a layout.

## Why
Rob's first real phone test, 2026-08-08: the arrow alone is ambiguous in a car. "I might be
travelling south, but the arrow would be pointing north, while I in the car would think it's
straight ahead." The arrow is a true-north compass bearing, not a heading-relative instruction, and
nothing on screen said so. The cardinal letter existed but lived in a `title` attribute, which a
phone never renders.

## Links

**Relates to**
- `0007` - the map is the other answer to the same complaint, "which way is it", and it is a
  separate card so that the list stays useful to somebody who never opens the map.
- `0001` - the phone test on 2026-08-08 that produced Rob's quote above. This card came out of it.

## Not this card
Not a live compass that rotates with the phone's heading: that needs `deviceorientation`, a
permission prompt, and it would be wrong the moment the phone is face-up in a cradle. Not road
directions. Not the map, which is card `0007`. Not changing how the bearing itself is calculated.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN a site row is rendered with a known position, THE APP SHALL display the cardinal
      point as text (N, NE, E, SE, S, SW, W, NW) next to the arrow, not only as a tooltip.
- [x] #2 WHEN the detail sheet is opened for a site, THE APP SHALL phrase the bearing as a bearing
      from the user, for example "10.8 miles NE of you".
- [ ] #3 WHEN a screen reader reads a row, THE APP SHALL announce the spoken point name
      ("north-east") rather than the abbreviation, which VoiceOver pronounces as "nee".
- [x] #4 WHEN the app or its data changes, THE APP SHALL ship a bumped service-worker CACHE key so
      installed copies do not keep the old markup.
<!-- AC:END -->

## Tasks
- [x] Render `NF.POINTS[idx]` beside the arrow glyph in the distance column
- [x] Add `POINT_NAMES` to `core.js` for the aria-label
- [x] Style the letters at mileage weight rather than the dimmed unit weight
- [x] Self-test that `POINTS` and `POINT_NAMES` stay aligned, so the two cannot drift apart
- [x] Bump `CACHE` in `app/sw.js`

## Direction
**2026-08-08** Shipped and deployed. Worth a sceptical read on one point in review: the letters
widened the distance column from 74px to 84px, which squeezes the name column. Not checked on the
narrowest phone in portrait with a long name like "Kings Wood and Challock Forest".

### 2026-09-07 review (v20260907054848-61fe)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: defect**

Traced each criterion.

**AC#1 ÔÇö met.** `app/app.js`, `render()` (the `sites.map` row builder): emits `<span class="row__point">NF.POINTS[idx]</span>` beside `row__glyph`. Styled in `app/app.css` as `.row__point` at 14px/700.

**AC#2 ÔÇö met.** `app/app.js`, `openSheet()`: pushes `site._mi.toFixed(1) + ' miles ' + NF.POINTS[NF.compassIdx(site._bear)] + ' of you'` into `#sheet-sub`.

**AC#4 ÔÇö met.** `app/sw.js` `CACHE = 'nearest-forest-v17-2026-09-06'` matches `BUILD` in `app/core.js`, and `scripts/selftest.js` asserts the two match.

**AC#3 ÔÇö DEFECT.** In `app/app.js`, `render()` puts the spoken name in `aria-label` on `<div class="row__arrow">`. That div has no role, so its implicit role is `generic`. ARIA 1.2 lists `generic` among the roles prohibited from being named, so `aria-label` on it is ignored by browsers and screen readers (WAI-ARIA 1.2, "Roles which cannot be named"; same rule ARC/axe report as "aria-label on a div"). The glyph span is `aria-hidden`, so what a reader actually announces is the visible text node `NE` ÔÇö the exact "nee" pronunciation the criterion exists to prevent. `POINT_NAMES` is defined in `core.js` and self-tested, but on this path it never reaches the user. A `role="img"`, or the name on the span with the letters as `aria-hidden` visual text, would carry it.

VERDICT: defect

**scope: defect**

**Scope check on commit `19bd40e`** (5 files: app.js, app.css, core.js, sw.js, selftest.js).

Nothing crossed the fence. No `deviceorientation`, no map work, no change to the bearing maths. The map card `0007` was a separate later commit. Scope is clean.

One thing is half done.

In `render()` in `app/app.js`, the spoken name is put as `aria-label` on `<div class="row__arrow">`. A plain `div` has no ARIA role, and the ARIA spec says a name on a role-less ("generic") element is ignored. Browsers do drop it. So the screen reader falls back to the visible text inside, which is `NE` ÔÇö the exact "nee" the card set out to stop. The visible letters landed; the spoken part did not.

It also sits outside `<button class="row__main">`, so a user moving button to button never reaches it at all.

Fix is small: give the element a role that takes a name (for example `role="img"`), or hide the letters from the reader and add a visually-hidden span with the words.

VERDICT: defect

**breakage: defect**

I looked for things this change breaks. I found one.

**The screen-reader label is on an element that cannot carry one.**

In `app/app.js`, `render()`, the spoken point name is put as `aria-label` on `<div class="row__arrow">`. That div has no `role`, so it is `role="generic"`. ARIA 1.2 and *ARIA in HTML* forbid `aria-label` on `generic`, and browsers drop it from the accessible name. The label is not exposed. What is left inside the div is the visible text `NE`, which VoiceOver says as "nee" ÔÇö the exact thing the card set out to stop. A `role="img"`, or moving the label onto a span with the name, would fix it.

Nothing catches this. In `scripts/selftest.js` the compass checks only prove `POINTS` and `POINT_NAMES` line up as arrays. No test renders a row or looks at the markup, so the label can be dropped or misplaced and the suite still passes.

The comment in `app/core.js` ("for aria-label only: VoiceOver reads 'NE' as 'nee'") now describes an intent the markup does not deliver.

VERDICT: defect


## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 4 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 4 of 4 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-20** Rob answered the second of this card's two asks: "Looks fine on an iPhone 15 Pro
Max". The compass letters widened the distance column from 74px to 84px and the worry was that the
longest name in the data, Kings Wood and Challock Forest, would be cut or wrap. It does not, on that
device. Criterion #4 and the layout question are settled.

**One caveat worth keeping, and it is not a reason to reopen anything.** An iPhone 15 Pro Max is
430pt wide and is the roomiest phone this app is likely to meet. The narrowest current iPhone is
375pt, which is 55pt less for the name. Nobody has looked at one and nobody needs to today; it is
noted here so the next person who reads "looks fine on a phone" knows which phone.

**The first ask is withdrawn as a question for him.** It asked whether to untick criterion #3, which
is the screen-reader one. That was only ever a question because a reviewer could not untick a box
itself, and it now can. The finding behind it is solid and needs no judgement: in `render()` in
`app/app.js` the spoken point name is set as `aria-label` on `<div class="row__arrow">`, a div with
no role, so it is `role="generic"`. ARIA 1.2 and *ARIA in HTML* both forbid a name there and
browsers drop it, which leaves VoiceOver reading the visible `NE` as "nee". That is the exact thing
criterion #3 was written to stop. The element also sits outside `<button class="row__main">`, so a
user moving button to button never reaches it at all.

**Nothing in the suite catches it.** The compass assertions in `scripts/selftest.js` only prove that
`POINTS` and `POINT_NAMES` line up as arrays. No test renders a row or reads the markup, so the
label can be dropped or misplaced and the run stays green. That is the shape this project keeps
finding and it is worth an assertion in whatever fixes this.

Moving to `ai-review/` so the reviewer can reopen #3 and a builder can take it. The fix is small:
give the element a role that takes a name, or hide the letters from the reader and put the words in
a visually hidden span.

### 2026-09-20 review (v20260920232716-a810)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: defect**

**AC#1 ÔÇö met.** `app/app.js` `render()` emits `<span class="row__point">NF.POINTS[idx]</span>` beside `row__glyph`; styled `.row__point` in `app/app.css`.

**AC#2 ÔÇö met.** `app/app.js` `openSheet()` builds `site._mi.toFixed(1) + ' miles ' + NF.POINTS[NF.compassIdx(site._bear)] + ' of you'` into `#sheet-sub`.

**AC#4 ÔÇö met.** `app/sw.js` `CACHE = 'nearest-forest-v28-2026-09-10'` and `BUILD = 'v28-2026-09-10'` in `app/core.js`; `scripts/selftest.js` asserts they agree.

**AC#3 ÔÇö not met.** In `app/app.js` `render()` the spoken name is still `aria-label="ÔÇªof you"` on `<div class="row__arrow">`. That div carries no `role`, so its computed role is `generic`, which WAI-ARIA 1.2 and *ARIA in HTML* list among roles that cannot be named; browsers discard the label. The arrow `<span class="row__glyph">` is `aria-hidden="true"`, so the only text left in the accessible subtree is the visible `NE` in `.row__point` ÔÇö exactly the "nee" the criterion exists to prevent. `POINT_NAMES` is exported from `app/core.js` and self-tested only for array alignment; nothing in `scripts/selftest.js` renders a row, so the misplacement is invisible to the suite. The element also sits outside `<button class="row__main">`, so button-by-button navigation never lands on it either way.

Nothing has changed on this path since the previous review; the finding stands on the current code.

UNMET: #3 the spoken point name is set as `aria-label` on a role-less `<div class="row__arrow">`, which browsers drop as an unnamable `generic` element, so a screen reader still announces the visible `NE`.

VERDICT: defect

**scope: defect**

**Scope: nothing crossed the fence; one thing is half done.**

Over the fence: nothing. In `app/app.js` `render()` the change is confined to the `row__dist` block and `row__arrow`/`row__point`; `app/core.js` adds `POINTS`/`POINT_NAMES` constants only; `app/app.css` adds `.row__point`/`.row__glyph`. No `deviceorientation`, no heading-relative rephrasing, no change to `bearingDeg`/`compassIdx`, no map work under this card (`app/map.js` and the tile proxy belong to `0007`/`0009`/`0012`). `openSheet()` phrases the bearing as "ÔÇª of you" and nothing more.

Half done: the spoken name. `render()` emits `aria-label` on `<div class="row__arrow">`, an element with no role, i.e. `role="generic"`. WAI-ARIA 1.2's "roles which cannot be named" list and *ARIA in HTML* both prohibit naming `generic`, and browsers drop it from the accessible name, so `POINT_NAMES` never reaches the user. The glyph span is `aria-hidden`, leaving the visible `NE` as the only text a reader can announce ÔÇö the "nee" the criterion exists to stop. The element also sits outside `<button class="row__main">`, so button-to-button navigation never lands on it. `scripts/selftest.js` asserts only that `POINTS` and `POINT_NAMES` align as arrays; nothing renders a row, so the misplaced label cannot fail the run.

The task list ticks "Add `POINT_NAMES` to `core.js` for the aria-label" ÔÇö the constant landed, the label did not.

UNMET: #3 the spoken point name is an `aria-label` on a role-less `<div class="row__arrow">`, which ARIA forbids naming and browsers discard, so a screen reader still announces the visible `NE`.

VERDICT: defect

**breakage: defect**

**Finding (confirmed, unchanged by any later commit).**

In `render()` in `app/app.js`, the spoken point name is emitted as `aria-label` on `<div class="row__arrow">`. That div carries no `role`, so its computed role is `generic`, and ARIA 1.2 / *ARIA in HTML* both prohibit an accessible name on `generic`; browsers drop it (this is what axe reports as "aria-label on a div"). The glyph span is `aria-hidden="true"`, so what remains exposed inside is the visible text node `NE` from `<span class="row__point">` ÔÇö exactly the "nee" pronunciation criterion #3 exists to prevent. `POINT_NAMES` is exported from `app/core.js` but never reaches the accessibility tree on this path.

Two knock-on breakages:

- The element sits outside `<button class="row__main">` and outside `<button class="row__go">` in the same `render()`, so a screen-reader user moving control to control never lands on it at all. Even a valid label there would be reachable only in browse mode.
- The comment above `POINT_NAMES` in `app/core.js` ("Spoken forms, for aria-label only: VoiceOver reads 'NE' as 'nee'") now documents an intent the markup does not deliver.

Nothing in `scripts/selftest.js` guards it: the compass block only asserts `POINTS` and `POINT_NAMES` align as arrays and that initials match. No assertion mentions `row__arrow` or any rendered markup, so the label can be dropped entirely and the run stays green.

UNMET: #3 the spoken name is an `aria-label` on a role-less `<div class="row__arrow">`, which browsers discard, leaving a screen reader to announce the visible `NE` as "nee".

VERDICT: defect

**acceptance**

- **#3 reopened**, by the acceptance lens: the spoken point name is set as `aria-label` on a role-less `<div class="row__arrow">`, which browsers drop as an unnamable `generic` element, so a screen reader still announces the visible `NE`.
- **#3 was named by the scope lens and is not a ticked criterion here**, so nothing was changed: the spoken point name is an `aria-label` on a role-less `<div class="row__arrow">`, which ARIA forbids naming and browsers discard, so a screen reader still announces the visible `NE`.
- **#3 was named by the breakage lens and is not a ticked criterion here**, so nothing was changed: the spoken name is an `aria-label` on a role-less `<div class="row__arrow">`, which browsers discard, leaving a screen reader to announce the visible `NE` as "nee".


**2026-09-20** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 2 times between todo and ai-review, which is the limit, so it is waiting on a person. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 3 of 4 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.
