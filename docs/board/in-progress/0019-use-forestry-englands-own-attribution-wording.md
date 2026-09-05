# Credit Forestry England the way they ask to be credited

## Why
The app's footer currently reads:

> Contains public sector information licensed under the Open Government Licence v3.0.
> Forest details from Forestry England. Personal use; not affiliated with Forestry England.

Two things are wrong with it, both established by the research on 2026-08-15 (DECISIONS
2026-08-15, and the sources are linked there rather than restated here).

**1. It does not use the wording Forestry England ask for.** Their Crown copyright page specifies:

> Crown Copyright, courtesy Forestry England (date of publication), licensed under the Open
> Government Licence

OGL v3 says a reuser "must acknowledge the source of the Information in your product or application
by including or linking to any attribution statement". Where the provider has published a specific
statement, theirs is the one to use. The generic "Contains public sector information..." is the
fallback for when no statement is specified, and here one is.

**2. "Personal use" is now false, and it is the more serious of the two.** It was written when the
app was on one phone. The app is public, shared, and heading for an app store listing. A footer
claiming personal use while the app is distributed is worse than no claim at all, because it reads
as a licence basis that does not match what is happening. The actual basis is OGL, which permits
exactly what is happening, so the honest line is shorter and stronger than the cautious one.

**"Not affiliated with Forestry England" stays.** That one is true, useful, and independent of the
licence question.

The car park dataset keeps its own credit. Two sources, two acknowledgements, and they are not
interchangeable.

## Not this card
Not the map's Thunderforest and OpenStreetMap attribution, which is a legibility defect over tiles
and is card 0015. Not changing what data is collected or displayed. Not the app store listing text,
which cannot be written until card 0018 has an answer on the name. Not adding a date to the
attribution: their wording has "(date of publication)" for a document, and the sensible equivalent
here is the existing per-site "data checked" date rather than a second date in the footer, so leave
that alone unless they ask.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN the About footer is shown, THE APP SHALL credit Forestry England using their own
      published wording, and SHALL separately credit the Open Government Licence for the car park
      dataset. proves: `the footer uses Forestry England's own published attribution wording`
      and `the footer credits the Open Government Licence for the car park data`
- [x] #2 WHEN the About footer is shown, THE APP SHALL NOT claim the app is for personal use.
      proves: `the footer makes no personal-use claim`
- [x] #3 WHEN the About footer is shown, THE APP SHALL still state that it is not affiliated with
      Forestry England. proves: `the footer disclaims affiliation with both`
- [x] #4 WHEN the self-tests run, THE APP SHALL fail if either attribution string is absent from
      index.html. proves: `the footer uses Forestry England's own published attribution wording`
      and `the footer credits the Open Government Licence for the car park data`
<!-- AC:END -->

## Tasks
- [x] Rewrite the two attribution sentences in `app/index.html`
- [x] Add a self-test asserting both strings are present, so a future edit cannot quietly drop one
- [x] Bump `CACHE` in `app/sw.js` and `BUILD` in `app/core.js`, since `app/` changed
- [ ] Deploy

## Plan
This is a text change in `app/index.html` plus a self-test, and the self-test is the part worth
doing properly. Attribution is a licence obligation that no user will ever complain about, which is
exactly the kind of thing that rots silently. Assert the strings the same way the existing tests
assert the security headers.

Do it before card 0018 is sent if possible. The email tells Forestry England "I plan to use your own
stated wording", and it is better if that is already true when they look.

## Comments
**2026-09-05** RESULT: done
TESTS: +3 new, all green (218 passed, 0 failed)
TOUCHED: app/index.html
TOUCHED: app/core.js
TOUCHED: app/sw.js
TOUCHED: scripts/selftest.js
TOUCHED: docs/board/in-progress/0019-use-forestry-englands-own-attribution-wording.md
TOUCHED: docs/board/todo/0022-name-the-forestry-commission-on-the-car-park-credit.md
OUT-OF-SCOPE: 0022

All four criteria met. The three new tests were written first and watched fail on the old footer:
the Forestry England wording was absent, no sentence scoped the OGL to the car park data, and
"Personal use" was present. Then the HTML changed and they went green.

**The footer had grown a third source since this card was written.** Card 0016 shipped Scotland on
2026-08-29, so the paragraph named Forestry and Land Scotland as well. The card's acceptance says
nothing about Scotland, and dropping that credit would have been a licence regression, so the
Scottish line stays and takes the generic OGL wording: DECISIONS 2026-08-29 records that Forestry
and Land Scotland publish no copyright or re-use page at all, so there is no first-party statement
of theirs to prefer. Forestry England's is used verbatim, minus the "(date of publication)"
placeholder, exactly as the card directed.

The footer now reads as four sentences: English forests under Forestry England's own wording,
Scottish forests under the generic wording, car parks under the generic wording, and the
non-affiliation line. The two existing card 0016 tests still pass unchanged, so the non-affiliation
phrasing is byte-for-byte what it was.

**The new tests match against a whitespace-flattened copy of index.html** rather than with `\s+`
between words. The strings are long enough to span a line break, and the next person to re-wrap that
paragraph should not break a licence test by doing it.

**Deploy is left open on purpose**, and is the one task not ticked. Its effect leaves the repository,
which the board README puts outside the unattended loop, and HANDOVER already has cards 0004, 0015
and 0016 queued to ship in one batch; this belongs in that batch rather than going out alone.
`CACHE` and `BUILD` are bumped to `v15-2026-09-05` and the self-test that keeps them in step passes.

**Not checked on a screen.** This was built in a worktree, which Herd does not serve. Serving it with
`php -S 127.0.0.1:8791 -t app` would render it, and the change is four sentences of body text in a
paragraph that already existed, so the risk is wrapping rather than function. Worth a glance during
the batch deploy check.

**One thing found and not fixed, raised as card 0022.** DECISIONS 2026-08-15 records a required
attribution for the car park dataset, "© Forestry Commission copyright and/or database right 2025.
All rights reserved.", read off the live FeatureServer. The footer names the licence for that data
and never names the Forestry Commission. That is the same rule this card applied to Forestry England,
missed on the other dataset, but this card's acceptance asked only for the OGL on the car parks, so
fixing it here would have been unreviewed scope.

**No Pest or Pint run.** This project has no `composer.json` and no `vendor/`; it is static HTML, CSS
and JS with a node self-test. The suite is `node scripts/selftest.js`, and it is green at 218.
