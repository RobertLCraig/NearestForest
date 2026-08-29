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
- [ ] #1 WHEN the About footer is shown, THE APP SHALL credit Forestry England using their own
      published wording, and SHALL separately credit the Open Government Licence for the car park
      dataset.
- [ ] #2 WHEN the About footer is shown, THE APP SHALL NOT claim the app is for personal use.
- [ ] #3 WHEN the About footer is shown, THE APP SHALL still state that it is not affiliated with
      Forestry England.
- [ ] #4 WHEN the self-tests run, THE APP SHALL fail if either attribution string is absent from
      index.html.
<!-- AC:END -->

## Tasks
- [ ] Rewrite the two attribution sentences in `app/index.html`
- [ ] Add a self-test asserting both strings are present, so a future edit cannot quietly drop one
- [ ] Bump `CACHE` in `app/sw.js` and `BUILD` in `app/core.js`, since `app/` changed
- [ ] Deploy

## Plan
This is a text change in `app/index.html` plus a self-test, and the self-test is the part worth
doing properly. Attribution is a licence obligation that no user will ever complain about, which is
exactly the kind of thing that rots silently. Assert the strings the same way the existing tests
assert the security headers.

Do it before card 0018 is sent if possible. The email tells Forestry England "I plan to use your own
stated wording", and it is better if that is already true when they look.
