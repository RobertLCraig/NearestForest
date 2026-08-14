# Add Scotland's 278 forests from Forestry and Land Scotland

## What I need from you

**One call: does the app leave England?**

Say yes or no on this card. It gates 0017 as well, so a no discards both.

---

The PRD's non-goals say, in as many words: "**No Wales, Scotland or Northern Ireland (different
agencies entirely)**". This card contradicts that line, so the line is yours to change or to keep.

**Pass** is a yes recorded here. I then change that one non-goal in [PRD.md](../../PRD.md), widen the
scope section to name the agencies, and build the rest of this card.
**Fail** is a no. Both cards go to `discarded/`, quoting the non-goal as the reason, and the research
stays on the cards so nobody repeats it.

**Why it needs you.** The stated reason for the non-goal is "different agencies entirely", and that
is the part I can answer: FLS publishes the same shape of site pages as Forestry England, and the
work is measured on this card. What I cannot answer is whether an app called "nearest forest" should
cover Britain or stay an England app you carry to Brighton. That is a product call and a maintenance
commitment: two more scrapers to keep alive against two more sites that will change under us.

## Why
The app knows about England and nothing else, so it is wrong in the one situation it was built for:
being somewhere unfamiliar with no signal. Forestry and Land Scotland publishes the direct analogue
of forestryengland.uk, and it is cheaper to scrape than the English source, not dearer.

Verified against the live site on 2026-08-14:

- [forestryandland.gov.scot/visit/destinations](https://forestryandland.gov.scot/visit/destinations)
  carries **all 278 destinations in a single HTML attribute**, `data-forest-search-map`, as JSON:
  `title`, `link`, `latitude`, `longitude`, `image`, `summary`, `alert`, `id`, `open`. The same full
  array is on every page of the 31-page pager, so the whole index costs one request. There is no
  equivalent of the per-row parsing `fetch.py` does against the English search page.
- `sitemap.xml` independently lists 278 destination URLs, which is the cross-check that the
  attribute is the complete set and not a filtered view.
- Detail pages (`/visit/destinations/<slug>/visitor-information`) carry the fields `parse.py`
  already models: **Facilities**, **Opening hours**, **Pricing**, **Parking information**,
  **Parking notes**, **Accessibility**, **Getting here**, and **Using SatNav?**. The sat-nav versus
  postal postcode distinction this project already respects exists on that site too.
- `robots.txt` disallows only admin paths and `/search-results`. `/visit/` is fair game.

## Not this card
Not Wales: that has an unresolved licence question and its own card, **0017**. Not Scottish car
parks, because no current open dataset exists — the Forestry Commission hub now publishes England
recreation Areas, Points and Routes only, the "National Forest Estate Recreation ... Scotland 2017"
ArcGIS items return 403, and FLS's own ArcGIS org has boundaries, blocks and parking machines but no
recreation points. Scotland fills the Forests tab, not the Car parks tab. Not a country filter, not
a third tab, and not a change to what `source` means: DATA-MODEL says nothing branches on it, and a
Scottish forest is a forest. Not a re-scrape of the English pages.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the pipeline runs, THE APP SHALL carry every currently published FLS destination as a
      `forest` record with a name, WGS84 coordinates and its source URL.
- [ ] #2 WHEN a Scottish site is shown, THE APP SHALL take its sat-nav postcode, facilities and
      opening text from that site's own page, and say "not known" wherever the page is silent.
- [ ] #3 WHEN a site publishes only café or visitor-centre hours, THE APP SHALL NOT present those as
      the site's access hours.
- [ ] #4 IF a destination is published as closed, THEN THE APP SHALL keep it out of the ranked list
      rather than offering it as somewhere to drive to.
- [ ] #5 WHEN any record's coordinates fall outside Great Britain, THE APP SHALL fail the build,
      as the England bounding box does today.
- [ ] #6 WHEN a name contains a diacritic, THE APP SHALL display it correctly end to end, for
      example "Allt na Crìche".
<!-- AC:END -->

## Tasks
- [ ] `scripts/fetch.py`: one request for the index, cached to `data/raw/fls/`, then one request per
      destination at the existing rate limit, resumable in the same way
- [ ] `scripts/parse.py`: emit `fls-<slug>` ids, alongside the existing `fe-` and `cp-` prefixes
- [ ] Add `country` to the `Site` record and to `docs/DATA-MODEL.md`, and widen the coordinate
      assertion from England to Great Britain **without** dropping it
- [ ] Decide the closed-site rule from the data: count how many of the 278 names carry a closed
      marker before choosing between excluding them and labelling them
- [ ] Map the FLS headings onto `opening_summary`, treating café hours as café hours
- [ ] `scripts/selftest.js`: assert the Scottish count, the coordinate ranges, that no Scottish
      record has a null name, and that a diacritic survives the round trip
- [ ] Read the FLS terms and copyright page and record the licence in `docs/DECISIONS.md`. **If it
      is not open, stop and raise a human-review card rather than shipping the data**
- [ ] Update the PRD's non-goal and scope section, and the attribution in the app's About view,
      which currently credits Forestry England alone
- [ ] Bump `CACHE` in `app/sw.js` and `BUILD` in `app/core.js`, which `deploy.ps1` enforces anyway

## Plan
Take the index from the attribute, not the pager. It is HTML-escaped JSON inside
`data-forest-search-map="..."`, so unescape then `json.loads`; the page is UTF-8 and the names carry
Gaelic diacritics, so decode explicitly rather than relying on a default. `link` is a site-relative
path, which gives both the record's `url` and the slug for its id.

**The opening-hours trap is the reason this card is not a copy of the English one.** Glentrool's
"Opening hours" section reads "The café is open from 10.30am to 4.30pm". That is the café, not the
gate, and mapping it to `opening_summary.access = hours` would make the app state closing times for
a forest that never closes. The standing rule is that an unparsed opening time shows as raw text and
never as "open", so when the heading's text is about a café, a shop or a visitor centre, the site's
access is `unknown` and the text is shown as published.

Two destinations are named "Allt Mor (closed)" and "Puck's Glen (closed)". **Do not reach for the
index attribute's `open` field for this**: it is `false` on all 278 records, so it is a UI flag and
not a status. That leaves the name suffix, which is fragile, so confirm the two against their own
pages before deciding whether to exclude them or label them.

Expect roughly +278 records on 904, so `sites.json` grows by about 160 KB against a 515 KB baseline.
That is comfortable for the precache, and it is the last comfortable increment — see 0017, where the
Welsh point data is four times the size of everything shipped so far.
