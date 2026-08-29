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
- [x] #1 WHEN the pipeline runs, THE APP SHALL carry every currently published FLS destination as a
      `forest` record with a name, WGS84 coordinates and its source URL.
- [x] #2 WHEN a Scottish site is shown, THE APP SHALL take its sat-nav postcode, facilities and
      opening text from that site's own page, and say "not known" wherever the page is silent.
- [x] #3 WHEN a site publishes only café or visitor-centre hours, THE APP SHALL NOT present those as
      the site's access hours.
- [x] #4 IF a destination is published as closed, THEN THE APP SHALL keep it out of the ranked list
      rather than offering it as somewhere to drive to.
- [x] #5 WHEN any record's coordinates fall outside Great Britain, THE APP SHALL fail the build,
      as the England bounding box does today.
- [x] #6 WHEN a name contains a diacritic, THE APP SHALL display it correctly end to end, for
      example "Allt na Crìche".
<!-- AC:END -->

## Tasks
- [x] `scripts/fetch.py`: one request for the index, cached to `data/raw/fls/`, then one request per
      destination at the existing rate limit, resumable in the same way
- [x] `scripts/parse.py`: emit `fls-<slug>` ids, alongside the existing `fe-` and `cp-` prefixes
- [x] Add `country` to the `Site` record and to `docs/DATA-MODEL.md`, and widen the coordinate
      assertion from England to Great Britain **without** dropping it
- [x] Decide the closed-site rule from the data: count how many of the 278 names carry a closed
      marker before choosing between excluding them and labelling them
- [x] Map the FLS headings onto `opening_summary`, treating café hours as café hours
- [x] `scripts/selftest.js`: assert the Scottish count, the coordinate ranges, that no Scottish
      record has a null name, and that a diacritic survives the round trip
- [x] Read the FLS terms and copyright page and record the licence in `docs/DECISIONS.md`. **If it
      is not open, stop and raise a human-review card rather than shipping the data**
- [x] Update the PRD's non-goal and scope section, and the attribution in the app's About view,
      which currently credits Forestry England alone
- [x] Bump `CACHE` in `app/sw.js` and `BUILD` in `app/core.js`, which `deploy.ps1` enforces anyway

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

## Decided
<!-- The answer, dated. Appended: a reversal is a later line, not an edit. -->

**2026-08-18** Add Scotland's 278 forests from Forestry and Land Scotland: Yes

**2026-08-29** Built. The Forests tab is now 550 sites, 274 English and **276 Scottish**, in one
ranked list. `sites.json` went from 529 KB to 719 KB (84 KB gzipped, so about 70 KB Brotli over the
wire). All six acceptance criteria are ticked and **215 self-tests pass**, 21 of them new and
specific to Scotland. `CACHE` and `BUILD` are at `v14-2026-08-29`.

**What was built.** `scripts/fetch.py` grew two stages: one request for the destinations index, which
carries all 278 destinations in the `data-forest-search-map` attribute exactly as the card said, then
278 requests for the `/visitor-information` tabs at the existing 4-worker 0.35s rate limit, cached to
`data/raw/fls/pages/` and resumable. Zero failures, 60 seconds cold. `scripts/parse.py` grew
`build_fls()`, which cuts sections out by heading rather than by CSS class. `country` is on every
record now, English ones included.

**Three things the research on this card did not predict.**
1. **The sections sit at different heading depths from page to page.** "Using SatNav?" is an `h3` at
   Aberfoyle and an `h4` at Allean. Pinning the parser to one level silently found only 63 of the 269
   postcodes, which is exactly the kind of shortfall that looks like a working build.
2. **FLS barely publishes opening hours at all.** 7 of 276 carry any opening text. The card treated
   the café trap as the interesting case, and it is, but the commoner answer is silence: 269 sites
   carry `null` and the app says "not listed".
3. **`Puck's Glen (closed)` has the slug `pucks-glen`**, with no `closed` in it. So the slug is not
   the marker, the published title is, and it appears in the page's own `<h1>` as well as on the
   index. Both closed sites were confirmed against their own pages before being dropped: Allt Mor's
   car park is shut after the July 2026 Glenmore wildfire, Puck's Glen gorge for the 2026 season
   after storm damage.

**On #1 and #4 together, since they cannot both be read literally.** 278 destinations are published
and 276 are shipped. The two published as "(closed)" are dropped at parse time rather than carried
and hidden, because there is nowhere in this app that carries a record without ranking it: a hidden
record would still rank in `api/nearest.php`, which filters on `source` and nothing else. So #4 is
met by exclusion and #1 is met for every destination #4 does not remove.

**Assumed, and worth a second opinion.** That "carry every currently published destination" means
the whole index rather than a filtered view of it, which is what the card's own Why section argues
about `sitemap.xml`. If the intent was to ship the closed two with a label, that is a small change to
`build_fls()` plus a UI state that does not exist yet.

**The licence, which is the part I could not settle from a first-party source.** **Forestry and Land
Scotland publishes no copyright or re-use page at all.** Its `sitemap.xml` lists 1,195 URLs and none
of them is one; the footer offers accessibility, cookies, privacy, FOI and modern slavery, and stops;
every page asserts "© Crown Copyright" and names no licence. gov.scot does offer OGL, but for "the
information featured on **this website**", and forestryandland.gov.scot is a separate site on a
separate CMS. What does exist is The National Archives' statement, as the body that manages Crown
copyright under Letters Patent, that "the default licence for most Crown copyright and Crown database
right information is the Open Government Licence", plus a `robots.txt` that does not cover `/visit/`
and no terms of use page to breach.

So the card's stop condition did not fire: nothing restricts re-use, and the default is open. But
**this is the weakest licence link in the project**, because it rests on general policy rather than
on a first-party offer the way the English position does. It is recorded in DECISIONS 2026-08-29 with
every source named. **Worth one email in the same batch as card 0018**, and worth knowing that the
app already shipped FLS website content before this card, in the 44 Stay the Night records added on
2026-08-15, with no licence recorded for it at all.

**Found and deliberately not fixed, because it is English and this card is Scottish.** The existing
`parse_opening()` has two defects, both reproduced and both written into DATA-MODEL's divergences.
It reads `7:30am` but not `7.30am`, so Wyre Forest's summer hours are invisible; and a month-to-month
range takes the opening time as the closing time. I fixed both, measured the result, and **reverted
it**: accepting dotted minutes makes five English records pick up *café* opening times they currently
miss, which is the opposite of what this card is for. Fixing it properly means teaching the English
parser whose hours a sentence is about, the way `fls_opening()` now does. Worth its own card. Nothing
ships a wrong badge in the meantime, because those records come out below `parsed` and the app shows
raw text below `parsed`.

**Rendered, not inferred.** A worktree does have a screen: `php -S 127.0.0.1:8794 -t app <router>`
with a throwaway router that types into the filter box. Checked at 390px: "Allt na Crìche" renders
with its grave accent and its PH32 4BL postcode, Scottish rows carry no open/closed badge, and
Glentrool's detail sheet shows "The café is open from 10.30am to 4.30pm" as published text under
OPENING TIMES with no badge anywhere, and "Not listed" for the address FLS does not publish. **Still
owed: a real phone**, and the offline check, since the precache grew by about 190 KB.

**Not deployed.** `pwsh ./scripts/deploy.ps1` has not been run, and 0004 and 0015 are also waiting.
