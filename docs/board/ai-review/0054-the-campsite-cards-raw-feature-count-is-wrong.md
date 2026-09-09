# Card 0020's criterion #2 quotes a raw feature count that is five out

## Why
Card `0020`'s acceptance criterion #2 justifies having no open/closed badge with the clause "since
only 96 of 8,496 records carry any opening hours". The cached Overpass responses hold **8,501**
features, not 8,496: counted 2026-09-08 from `data/raw/osm/` — 6,133 England, 905 Scotland, 1,463
Wales. `docs/HANDOVER.md` already says 8,501 ("8,501 features in, 3,675 out"), so the repository
carries two figures for one measurement and the one inside the acceptance criterion is the wrong one.

The cost is small but it is exactly the cost this board keeps paying: a reviewer tracing criterion #2
reads a number, checks it, and finds it does not match. Card `0020`'s own thread already logged the
disagreement on 2026-09-08 and fixed the copies in `app/app.js` and `scripts/selftest.js`, but left
the card's own text alone, because a session working a card may not reword that card's criteria.

How it came to be: the figure was written on 2026-08-15 from a run whose output nobody kept, and the
data was re-fetched or the query widened afterwards. Nothing checks prose that lives on a board card.

## Links

**Relates to**
- `0020` - it is that card's criterion #2 that carries the wrong number, and its thread carries the
  finding that could not be acted on from inside it.
- `0036` - it built the prose-count guard in `scripts/selftest.js` that would catch this, but the
  guard reads `app/data/sites.json` and checks only `app/app.js`.

## Not this card
Not a change to what criterion #2 requires. The rule — no open/closed badge — is correct and stays
word for word; only the count in its justifying clause is wrong. Not a re-fetch of `data/raw/osm/`,
and not a rebuild of `app/data/campsites.json`: the shipped dataset is right and nothing about it
changes. Not a general audit of numbers written on other cards. Not extending the `0036` guard to
read board cards; a guard that parses markdown prose across six lane folders is more machinery than
this fault is worth.

## Acceptance
<!-- AC:BEGIN -->
- [x] WHEN card `0020`'s criterion #2 is read, THE APP SHALL state the raw feature count that
      `data/raw/osm/` actually holds. proves: `card 0020 quotes the raw OSM feature count correctly`
<!-- AC:END -->

## Tasks
- [x] Count the `elements` arrays in the three files under `data/raw/osm/` and confirm the total
      before changing anything. It was 8,501 on 2026-09-08; if the cache has been re-fetched since,
      the new total is the one to write.
- [x] Correct the figure in criterion #2 of `docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md`
      (or whichever lane holds it by then), changing the count and nothing else about the sentence.
- [x] Add the assertion to `scripts/selftest.js`, next to the `card 0036` prose-count block: read the
      card file, pull the number out of criterion #2, and compare it to the summed `elements` count
      of `data/raw/osm/*.json`. **`data/raw/` is gitignored**, so the assertion must skip with a
      printed reason when the cache is absent rather than fail — a skipped check that says so is
      honest, a check that fails on a clean clone is noise.

## Plan
Work in the NearestForest repository on a branch of `main`. The suite is `node scripts/selftest.js`
run from the repository root; there is no PHP suite, no `vendor/`, and no npm install step. Green
looks like `232 passed, 0 failed` plus the new assertion.

`data/raw/osm/` is not in a fresh worktree, because it is gitignored. Copy it in read-only from
`C:\Dev\NearestForest\data\raw\osm` rather than re-querying Overpass; the shipped dataset was built
from that snapshot, so it is the snapshot the number must agree with.

The "96" in the same clause is a second figure and this card does not settle it: it counts raw OSM
features carrying any `opening_hours` tag, which nobody has re-measured. Count it in the same pass if
it is cheap, and if the answer differs, say so in `## Comments` rather than silently changing it.

## Comments

**2026-09-08** Raised from card `0020`'s build session, which found the discrepancy and could not fix
it: a session working a card may not reword that card's own criteria, and this is a criterion's text.
The count of 8,501 is measured, not inferred — `elements` arrays in the three cached Overpass
responses, 6,133 + 905 + 1,463.

**2026-09-10** RESULT: done
TESTS: +1 new (`card 0020 quotes the raw OSM feature count correctly`), all green (280 passed, 0 failed)
TOUCHED: docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md, scripts/selftest.js
OUT-OF-SCOPE: none

**The count was re-measured today, before anything was changed**, and it has not moved: 6,133
England plus 905 Scotland plus 1,463 Wales is **8,501**, counted from the `elements` arrays of the
three files in `data/raw/osm/`. So 8,501 is the figure written into criterion #2, replacing 8,496.
Nothing else in that sentence changed, and the rule it states — no open/closed badge — is word for
word what it was.

**The other figure in the same clause was counted in the same pass, and it is right.** 96 of the
8,501 raw features carry an `opening_hours` tag. `## Plan` asked for it to be checked and for any
difference to be said here rather than silently changed. There is no difference, so 96 stands.

**The new assertion, and it was proved red before it was trusted.** It sits beside the `card 0036`
prose-count block in `scripts/selftest.js`, finds `0020-*.md` in whichever lane folder holds it
rather than hard-coding a path, sums the `elements` arrays in `data/raw/osm/*.json`, and compares.
Three runs:

- with the card corrected: `PASS`, 280 passed, 0 failed
- with 8,496 put back: `FAIL — card says 8,496, data/raw/osm holds 8501`, 279 passed, 1 failed
- with `data/raw/osm` moved aside: `SKIP — data/raw/osm is gitignored and absent, nothing to count`,
  279 passed, 0 failed

The skip prints its reason and is not counted as a pass, which is what the task asked for: a clean
clone has no cache, so a check that failed there would be noise and one that quietly passed would be
worse than no check.

**Nothing outside the fence.** `data/raw/osm/` was not re-fetched, `app/data/campsites.json` was not
rebuilt, no other card's numbers were audited, and the `0036` guard was not taught to read board
prose in general — it reads this one criterion, which is the whole of the fault.
