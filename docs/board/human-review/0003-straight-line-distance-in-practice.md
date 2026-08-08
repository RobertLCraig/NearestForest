---
waiting_on: real-world use after card 0001 - recheck 2026-09-19
---
# Is straight-line distance good enough in practice?

## What I need from you
After using the app for a few real trips, tell me whether the top result was ever the wrong choice
because a nearer-by-air site was a longer drive. One example is enough to settle it. I cannot answer
this from the data: it depends on which roads you actually take and how you feel about the result,
not on anything measurable from here.

## Why
The app ranks by great-circle distance (DECISIONS 2026-08-08). From Brighton the South Downs and the
coast can make the nearest-by-air site a materially longer drive, and the current design shows a
compass bearing specifically so a misleading result is visible rather than hidden. Whether that
mitigation is enough is a real-use question, and it was flagged as an open question in the PRD
rather than assumed away.

## Options
1. **Leave it as straight-line.** Cost: nothing. Keeps the app fully offline and free, which is its
   main non-functional requirement. Accepts the occasional wrong ordering.
2. **Add road distance for the top few results only.** Cost: a routing API key, a per-call charge,
   a live connection, and your location leaving the device to a third party. Would only work with
   signal, so it degrades exactly where the app is most needed. Roughly half a day.
3. **Keep straight-line but sort the top 5 by bearing sanity.** Cost: a couple of hours, no
   dependencies. Deprioritises results that are across a known barrier. Fiddly heuristics that can
   be wrong in their own way.

## Recommendation
Option 1 unless real use turns up an actual bad call. The whole design rests on working with no
signal, and option 2 trades that away to fix a problem that may not exist on the roads you drive.
Option 3 adds guesswork to dodge a paid API, which is usually a bad trade. Revisit only with a
concrete example in hand.
