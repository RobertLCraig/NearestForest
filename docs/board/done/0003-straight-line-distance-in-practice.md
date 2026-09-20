# Is straight-line distance good enough in practice?

## What I need from you

**After a few real trips, say whether the top result was ever the wrong choice because a
nearer-by-air site turned out to be a longer drive.** One example is enough.

My recommendation is **1**, leave it as straight-line, unless you have such an example.

**Pass** is either a concrete case ("Friston came top but X was fifteen minutes closer by road") or
"no, it has been fine". Both close the card.

**Fail** is a general feeling either way. Without a specific trip there is nothing to weigh option 2
against, and option 2 costs the thing the app is for: it needs a live connection, so it degrades
exactly where the app is most needed.

**Why it needs you** This is yours on **local knowledge nobody wrote down**: which roads you
actually take, and whether a wrong ordering bothered you when it happened. Neither is measurable
from here, which is why the PRD left it as an open question rather than assuming it away. There is
no established practice to look up, because the answer is about your roads and not about routing.

## Why
The app ranks by great-circle distance (DECISIONS 2026-08-08). From Brighton the South Downs and the
coast can make the nearest-by-air site a materially longer drive, and the current design shows a
compass bearing specifically so a misleading result is visible rather than hidden. Whether that
mitigation is enough is a real-use question, and it was flagged as an open question in the PRD
rather than assumed away.

## Links

**Relates to**
- `0001` - the on-phone checks are the first real trips, so the example this card needs comes out
  of using the app after that card runs. That is what the `waiting_on:` date tracks.

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

## Decided
<!-- The answer, dated. Appended: a reversal is a later line, not an edit. -->

**2026-08-18** Leave it as straight-line

**2026-09-20** **Decided:** option 1 stands, now on evidence rather than on the balance of argument.
Rob, after a road trip to and around Scotland: "not so far in real world testing."

The 2026-08-18 answer chose option 1 provisionally and this card stayed open waiting for exactly
this: one concrete case of a nearer-by-air site being a longer drive. Real use produced none, so the
option that costs nothing and keeps the app working with no signal is the one that survives. Option
2 is closed, not deferred; it trades away the premise of the app to fix a problem that has now been
looked for and not found.

**Real use found a different problem, and it is not this one.** Rob: "generally the issue has been
picking a forest that is at least semi 'on route' for wherelse I want to go that day. Not sure how I
can solve that yet without essentially rebuilding google maps wayyyy out of scope. May just have to
live with that."

He is right that it is out of scope, and it is worth saying why in one place so nobody re-opens it
as a fresh idea. "On route" is not a distance problem at all. It needs a destination the app has
never been told, a route between two points, and a corridor around that route to test each site
against. The first is a whole new input, and the second and third are a routing engine. The app has
one input, the current fix, and that is what lets it work with no signal.

**Written into `docs/PRD.md` under the "Not routing" non-goal**, with the same reasoning, because a
non-goal that has been tested in the real world and held is worth more than one that was assumed.

Moving to `done/`. A decision card's exit is the decision and it skips `ai-review/`, per
`docs/board/README.md`.
