---
no_outward_effect: "published" in criterion #2 is the upstream dataset's own name for a car park, not a deploy
---
# Give the unnamed car parks a useful name

## Why
170 of the 630 car parks in the open dataset are named "Unknown" upstream and a further six are
generic. They currently render as "Unnamed car park", which is honest but useless when the list is
being read in a car: the nearest car park to Brighton is one of them. The open data carries no link
back to a parent forest, so the name has to be derived. This is the single most valuable improvement
left to the dataset, and DATA-MODEL flags it as the main open divergence.

## Not this card
Not touching the Forests tab, which is already well named. Not fetching any new upstream source. Not
merging the two tabs. Do not attempt a point-in-polygon join against forest boundaries: the forest
records are single points, not polygons, so nearest-neighbour is the available approach.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN a car park has no usable upstream name, THE APP SHALL display a derived name naming
      the nearest forest, for example "Car park near Friston Forest".
- [x] #2 WHEN a name is derived rather than published, THE APP SHALL mark it visually so it is not
      mistaken for an official name.
- [x] #3 IF the nearest forest is further away than a sane threshold, THEN THE APP SHALL keep the
      generic label rather than claiming a misleading association.
<!-- AC:END -->

## Tasks
- [x] In `scripts/parse.py`, for each car park find the nearest forest point
- [x] Inspect the distribution of those distances before picking the threshold, rather than guessing
      a number (quartiles and outliers, per the standing rule about thresholds)
- [x] Set `name` and keep `name_is_derived: true` so the UI keeps styling it as derived
- [x] Extend `scripts/selftest.js` to assert no car park is left as a bare "Unnamed car park" inside
      the chosen threshold
- [x] Update the "Known divergences" section of `docs/DATA-MODEL.md` when it closes

## Comments

**2026-08-29** Built the nearest-forest join in `scripts/parse.py` and re-ran the parser against the
cached raw HTML, so `app/data/sites.json` is regenerated rather than patched.

**What it does.** `unusable_name()` decides whether an upstream car park name can stand on its own.
Two kinds fail: the 170 published as `Unknown`, and 7 published as a bare `Car Park` / `Carpark` /
`Main Carpark`. That is 177, against the card's "170 and a further six". The extra one is because the
six are six *distinct* generic strings spread across seven records. `name_after_nearest_forest()`
then gives each one the name of the forest point it is nearest to, by the same haversine formula and
Earth radius as `core.js`, so the self-test can re-derive the whole join against the shipped code and
get the same answer. A qualifier survives the rewrite, so `Overflow Car Park` becomes `Overflow car
park near Delamere Forest` and stays distinct from the main one beside it. The nearest car park to
Brighton, the row the card was written about, now reads **"Car park near Friston Forest"**, and a
self-test pins that exact string.

**The threshold is 5.0 miles and it was measured, not chosen.** Over the 177 records, distance to the
nearest forest point runs min 0.00, q1 0.03, median 0.32, q3 2.19, max 23.66 mi. IQR is 2.16, so the
Tukey outlier fence (q3 + 1.5 x IQR) is 5.45 mi, rounded down to 5.0. That names 158 and leaves 19
outside as the bare `Unnamed car park`, which is AC #3. The parser prints those quartiles and both
counts on every run, so the threshold stays visible rather than becoming a magic number.

**What I assumed.** That a forest record's single point is close enough to stand for the forest. It
is an assumption the data forces: the card rules out point-in-polygon because the forest records are
points, not polygons. So the derived name is a claim about *proximity*, never about membership, which
is why it says "near" and why it stays flagged derived.

**AC #2, and what changed beyond the list.** `row__derived` (dim italic in the list) already existed,
and it was already enough while the label read "Unnamed car park". It is not enough now, because
"Car park near Friston Forest" reads exactly like an official name. So the marking was extended to
the two other places a name is read. The detail sheet title now takes `.sheet__name--derived` and its
subtitle says "our name for it, not a published one", and a derived map label draws in italic. Four
self-tests assert all three, and `CACHE` / `BUILD` are bumped to `v12-2026-08-29`.

**Deliberately not done.**
- **Collisions are not disambiguated.** 14 car parks now read "Car park near Dalby Forest" and 13
  read "Car park near Hamsterley Forest". Each row still carries its own distance and compass
  bearing, so the list is usable, but the *map* is worse off: labels truncate at 22 characters, so
  "Car park near Bedgebury Nat…" loses the forest entirely. That belongs with the marker-label
  collision card HANDOVER says should exist and does not.
- **About 68 car parks published as internal asset codes** (`CFD-THH-CAR PARK`, `CFD-SAL- Car Park
  2`) are untouched. They are a real upstream value, so the rule leaves them alone, but they read as
  machine output. The card scoped itself to Unknown-and-generic, so widening it here would have been
  a card nobody reviewed. Noted in DATA-MODEL as an open divergence, and worth its own card.
- **Opening hours are still not inherited.** DATA-MODEL used to say this join would fix the
  forest-only `opening_summary` too. It must not: copying a gate time off a forest up to five miles
  away is this project guessing a barrier is open, which is the one error it refuses to make. That
  sentence is corrected rather than acted on.

**Not settled from the repository.**
- **Nothing has been looked at in a browser or on the phone.** This is a worktree, and Herd serves
  the app from `C:\Dev\NearestForest`, so a browser here would show Rob's tree rather than this work.
  The three visual markings are asserted as source strings only. **They still need one look at a real
  screen**, ideally against the dark theme, where dim italic has the least contrast to spare.
- **`scraped_at` on all 904 records moved from 2026-08-08 to 2026-08-29, and the underlying scrape
  did not.** `parse.py` has always stamped `TODAY`, so any re-parse of an old cache overstates how
  fresh the data is. Pre-existing, out of scope here, and worth a card: the honest value is the fetch
  date, which `fetch.py` would have to record.
- `node scripts/selftest.js` passes 186/186. The `pest` and `pint` suites named in the card runner do
  not exist in this project. There is no `vendor/` and no PHP dependency set, and the suite here is
  the node self-test.
