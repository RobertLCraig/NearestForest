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
- [ ] #1 WHEN a car park has no usable upstream name, THE APP SHALL display a derived name naming
      the nearest forest, for example "Car park near Friston Forest".
- [ ] #2 WHEN a name is derived rather than published, THE APP SHALL mark it visually so it is not
      mistaken for an official name.
- [ ] #3 IF the nearest forest is further away than a sane threshold, THEN THE APP SHALL keep the
      generic label rather than claiming a misleading association.
<!-- AC:END -->

## Tasks
- [ ] In `scripts/parse.py`, for each car park find the nearest forest point
- [ ] Inspect the distribution of those distances before picking the threshold, rather than guessing
      a number (quartiles and outliers, per the standing rule about thresholds)
- [ ] Set `name` and keep `name_is_derived: true` so the UI keeps styling it as derived
- [ ] Extend `scripts/selftest.js` to assert no car park is left as a bare "Unnamed car park" inside
      the chosen threshold
- [ ] Update the "Known divergences" section of `docs/DATA-MODEL.md` when it closes
