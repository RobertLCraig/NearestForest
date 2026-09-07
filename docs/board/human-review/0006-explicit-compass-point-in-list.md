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
- [x] #3 WHEN a screen reader reads a row, THE APP SHALL announce the spoken point name
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
