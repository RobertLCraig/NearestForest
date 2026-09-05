# Name the Forestry Commission on the car park credit

## Why
The car park data has a required attribution that the app does not carry. The licence research on
2026-08-15 read it off the live ArcGIS FeatureServer and wrote it down (DECISIONS 2026-08-15, the
"Required attribution" row):

> © Forestry Commission copyright and/or database right 2025. All rights reserved.

The app's footer credits the car park data as "Car park details contain public sector information
licensed under the Open Government Licence v3.0" and never names the Forestry Commission at all. So
the app names the licence and omits the copyright holder, on the one dataset that publishes a
statement saying who they are.

**This is the same rule that card 0019 applied to Forestry England**, and it was missed on the car
parks for a small reason: 0019 was written to fix the forest credit, its acceptance said only that
the car park dataset should credit the OGL, and the FeatureServer's `copyrightText` was recorded in
DECISIONS three weeks before that card existed. Nobody decided to leave it out.

What it costs: one sentence of footer, and an attribution obligation that is currently unmet on 630
of the app's records. No user will ever complain about it, which is why it needs a test and not a
promise.

## Links

**Relates to**
- `0019` - established that a provider's own published statement wins over the generic OGL
  fallback, and put the Forestry England half of that into the footer plus a self-test.

## Not this card
Not the forest credits, which 0019 settled. Not the OpenStreetMap or Forestry and Land Scotland
lines. Not re-fetching or re-checking the dataset: the string is already recorded in DECISIONS, and
the year in it is the publisher's, not today's. Not adding a date to any other credit.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the About footer is shown, THE APP SHALL name the Forestry Commission as the copyright
      holder of the car park data, alongside the Open Government Licence it already names.
      proves: `the footer names the copyright holder of the car park data`
- [ ] #2 WHEN the self-tests run, THE APP SHALL fail if that string is absent from index.html.
      proves: `the footer names the copyright holder of the car park data`
<!-- AC:END -->

## Tasks
- [ ] Extend the car park sentence in `app/index.html` with the publisher's own copyright line
- [ ] Add the self-test beside the card 0019 attribution tests in `scripts/selftest.js`
- [ ] Bump `CACHE` in `app/sw.js` and `BUILD` in `app/core.js`, since `app/` changed

## Plan
Work in the NearestForest repository, on a branch off `main`. The whole change is one sentence and
one assertion.

The footer paragraph is the third `<p>` inside `<footer class="foot">` in `app/index.html`. The car
park sentence currently reads "Car park details contain public sector information licensed under the
Open Government Licence v3.0." Keep that sentence, since the licence is still what permits the use,
and add the publisher's line to it.

The tests live in `scripts/selftest.js`, in the block commented `Card 0019`, inside the
`--- hardening ---` section. That block already flattens the file's whitespace into a `flat` const
so a re-wrapped paragraph cannot break a match; use it. Run:

    node scripts/selftest.js

Expect `219 passed, 0 failed`. Write the test first and watch it fail before touching the HTML: the
failure should be the missing string, not a missing const.

Deploying is a person's step and is not part of this card; the board already has undeployed work
waiting to go out in one batch.

## Comments
**2026-09-05** Raised from card 0019, which changed the forest half of this footer and found the car
park half short of the same rule. Not fixed in passing, because 0019's acceptance named the OGL for
the car parks and nothing more, and widening it would have been scope nobody reviewed.
