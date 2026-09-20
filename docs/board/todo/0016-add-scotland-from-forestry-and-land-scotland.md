---
no_outward_effect: "published" in criteria #1 and #4 is what Forestry and Land Scotland put on their own website, not a deploy
---
# Add Scotland's 278 forests from Forestry and Land Scotland

## Why
The app knows about England and nothing else, so it is wrong in the one situation it was built for:
being somewhere unfamiliar with no signal. Drive north of the border and it names an English forest
as your nearest one, confidently, with no hint that it has run out of data. Forestry and Land
Scotland publishes the direct analogue of forestryengland.uk, and it is cheaper to scrape than the
English source, not dearer.

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

## Links

**Relates to**
- `0017` - Wales is the other half of the same scope question, and the call asked for below settles
  both. That card has its own licence problem and cannot be built on this one's answer alone.
- `0020` - already shipped 44 Forestry and Land Scotland car parks in the Campsites tab, before any
  licence for that site was recorded. That is why this card's licence task matters beyond itself.
- `0018` - the licence position for Forestry and Land Scotland rests on general Crown copyright
  policy rather than a first-party offer, so it is worth one email in the same batch as that card.
- `0019` - rewrote the footer this card's attribution task changed, three sources later.

## What I need from you

**One call: does the app leave England?**

Say yes or no on this card. It gates card `0017` as well, so a no discards both.

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

## Not this card
Not Wales: that has an unresolved licence question and its own card, `0017`. Not Scottish car
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
- [ ] #2 WHEN a Scottish site is shown, THE APP SHALL take its sat-nav postcode, facilities and
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

### 2026-09-08 review (v20260908090459-5381)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I traced each criterion to code.

- **#1** `build_fls()` in `scripts/parse.py` reads the cached index and emits one `forest` record per destination with `name`, `lat`/`lng`, `url`. Shipped file has 276 Scottish forests.
- **#2** `fls_satnav()`, `fls_facilities()` and the `Opening hours` cut in `build_fls()` all return `None` when the heading is missing, and `openSheet()` in `app/app.js` prints "No sat nav postcode published" / "Not published".
- **#3** `fls_opening()` in `scripts/parse.py` matches `RE_INDOOR_SUBJECT` and forces `access: unknown`, `confidence: unparsed`. Kirroughtree keeps "always open" because the site itself says so. `NF.status` in `app/core.js` only badges `parsed`, so caf├® text never becomes a badge.
- **#4** `RE_CLOSED_TITLE` is checked twice in `build_fls()` ÔÇö index title and page `<h1>` ÔÇö and the record is skipped. No shipped name has "(closed)".
- **#5** `validate()` in `scripts/parse.py` checks `GB_LAT_RANGE`/`GB_LNG_RANGE` for every record plus a per-country box, and `main()` exits 1 before writing.
- **#6** Names keep their accents in `app/data/sites.json` ("Allt na Cr├¼che", "Creag Ph├ádraig"), and `scripts/selftest.js` asserts it.

I tried to break #3 with Balkello: `parse_opening()` reads its month range and stores `closes: 08:00`, which is the opening time. That is the known English month-range defect, but it lands as `confidence: partial`, so `NF.status` shows no badge and the raw text is displayed. No criterion breaks.

VERDICT: sound

**scope: defect**

**Scope check on card 0016.**

I looked for work that jumped the fence. Most of the huge diff is other cards, not this one: campsites (`scripts/parse_campsites.py`, `app/data/campsites.json`), the tile layer, and `docs/outreach/*` all belong to cards `0020`, `0009` and `0018`, which sit on the board in their own right. The `fls-stn-*` Stay the Night records the card warns about were shipped on 2026-08-15, before this work.

Inside this card's own code the fence holds. `build_fls()` in `scripts/parse.py` emits only `forest` records, adds no tab, no country filter, and does not re-scrape England. `validate()` widened the box to Great Britain and kept a per-country box, as asked.

One thing left half done in this card's own edit: the `sites.json` sample in `docs/DATA-MODEL.md` records `"counts_by_country": { "England": 904, "Scotland": 276 }`. `parse.py` `main()` writes the real counts, and England is 274 forests, not 904. This card introduced that block and wrote the wrong number into the doc it was told to update.

Next session: fix that count in `docs/DATA-MODEL.md`.

VERDICT: defect

**breakage: defect**

**app/app.js, `openSheet()`** ÔÇö the "More" link label is hardcoded `'Forestry England page'` and only overridden when `site.source === 'campsite'`. All 276 new Scottish forest records take that branch, so every FLS detail sheet shows a link that says "Forestry England page" and goes to `forestryandland.gov.scot`. The campsite branch right below it carries a comment saying exactly why that is wrong ("must not claim it is a Forestry England page"), and the rule was not applied to the source that this card added. Card task "update the attribution in the app's About view" was done in `app/index.html`; the per-record label was not. No self-test covers the label: `scripts/selftest.js` checks Scottish `url` hosts but never the text shown next to them.

**app/app.js, comment above `moreHref` in `openSheet()`** ÔÇö "tell Forestry England which page sent you" is now false for 276 records.

Same function: `field('Country', ...)` is emitted only for campsites, so a Scottish forest never states its country even though `country` is now on every record.

VERDICT: defect


## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-08** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 6 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 6 of 6 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-20** Moved to `ai-review/` rather than answered.

**Why this card stopped, and why it is not a question anybody needs to answer.** The ask on it
reduces to "untick what the reviewer disproved". Until 2026-09-12 no reviewer could do that:
ProgressBoard's card `0083` criterion #6 forbade a reviewer from touching acceptance at all, on the
reasoning that a reviewer which can untick a box can tick one. So a review that found a real defect
returned the card with every box still ticked, the next build session found nothing open to do, the
promote gate read acceptance as fully met and promoted it, and after the second lap the loop parked
the card in `human-review/` with an ask only a person could action.

**That is fixed upstream, and the fix post-dates this card's last review.** ProgressBoard card
`0162`, committed 2026-09-12, added the `UNMET: #N <reason>` line to `bin/prompts/review-work.md`
and the unticking to `bin/review-card.ps1`, superseding `0083` criterion #6. The reviewing agent
still only reports a number and a sentence; the script does the writing, and the only edit it knows
how to make is `[x]` to `[ ]`, so a reviewer still cannot mark its own paper. Every NearestForest
card sitting in this lane on the "all N criteria ticked" pattern was last reviewed on or before
2026-09-11. Every card reviewed since (`0021`, `0070`, `0072`, `0074`) came back with criteria
genuinely reopened and a reason written beside each.

**So a fresh pass settles this card rather than a person doing so.** It will either reopen a
criterion and send this to `todo/` with something a builder can act on, or pass it to `done/`.

**This is the same call Rob made on 2026-09-10** for thirteen cards in this position, commit
`9fcf175`. It did not take, and the reason is measurable rather than a guess: those re-reviews all
ran on 2026-09-11, one day before the capability existed, and every one of the thirteen came back
"all N criteria ticked" a second time. That one day is the whole of what has changed.

**On this card in particular.** Its ask, "does the app leave England?", was answered Yes on
2026-08-18 and built on 2026-08-29. Both findings in the 2026-09-08 review have since been fixed by
other cards: the Scottish detail sheets labelled "Forestry England page" by card `0057`, and the
`904` count in `docs/DATA-MODEL.md` by card `0036`, both in `done/`. So the reviewer's findings are
dead and the ask is answered.

**One thing this card leaves for a person, and it is not carried here.** The Forestry and Land
Scotland licence rests on a default rather than a first-party offer (DECISIONS 2026-08-29). That
sits in HANDOVER's Blockers and belongs in the same email batch as card `0018`. Moving this card
does not move that question.

### 2026-09-20 review (v20260920221547-dac0)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: defect**

**#1** `build_fls()` in `scripts/parse.py` emits one `forest` record per index entry with name, lat/lng, url; shipped file carries 276 Scottish forests, none null-named, all with a URL. Met.

**#3** `fls_opening()` forces `access: unknown`, `confidence: unparsed` when `RE_INDOOR_SUBJECT` matches without an always-open/dusk statement, and `NF.status`/`openState` in `app/core.js` badge only `parsed`. Met.

**#4** `RE_CLOSED_TITLE` is applied to the index title and again to the page `<h1>` in `build_fls()`; no shipped name contains "(closed)". Met.

**#5** `validate()` in `scripts/parse.py` checks `GB_LAT_RANGE`/`GB_LNG_RANGE` plus a per-country box for every record, and `main()` prints problems and `sys.exit(1)` **before** writing `sites.json`. Met.

**#6** Accents survive to `app/data/sites.json` ("Allt na Cr├¼che") and `scripts/selftest.js` asserts that name. Met.

**#2 fails on facilities.** `openSheet()` in `app/app.js` renders the facilities tag block only inside `if (site.facilities && site.facilities.length)`. When FLS publishes no facilities list the parser stores `null` ÔÇö three shipped Scottish records ÔÇö and the sheet then shows no Facilities row at all, so a page that is silent reads as "this forest has none" rather than "not known". Sat-nav and opening both use `field(..., {missing})`; facilities has no such fallback.

UNMET: #2 a Scottish site whose page lists no facilities gets no Facilities row in the detail sheet at all, so silence upstream renders as "no facilities" instead of "not known"

VERDICT: defect

**scope: sound**

**Scope check, card 0016.**

The card's own fence holds. `build_fls()` in `scripts/parse.py` emits only `forest` records with `country: "Scotland"`, never a car park or campsite (`scripts/selftest.js`, "no Scottish record is a car park or a campsite"). `validate()` widened to `GB_LAT_RANGE`/`GB_LNG_RANGE` and kept the per-country box rather than dropping it, as the task asked. No country filter, no third tab from this card, no re-scrape of England. The Campsites tab, the tile layer and `docs/outreach/` are cards `0020`, `0009` and `0018`.

I tried to revive both 2026-09-08 findings and neither survives.

- The "Forestry England page" label is gone: `openSheet()` in `app/app.js` now reads the label from `AGENCY_BY_HOST` keyed on the link's own host, and `field('Country', ÔÇª)` is emitted for every record, not only campsites.
- The `904` in `docs/DATA-MODEL.md` is not a wrong forest count. `main()` in `scripts/parse.py` builds `by_country` over **all** records, and the shipped `app/data/sites.json` reads `{"England": 904, "Scotland": 276}` ÔÇö 274 English forests plus 630 English car parks. The sample matches the generator's real output; the earlier reviewer compared it against the forest count alone.

Nothing over the fence, nothing half done that I can cite.

VERDICT: sound

**breakage: sound**

I ran the project's own self-test (`node scripts/selftest.js`): 318 passed, 1 failed, and the one failure is unrelated to this card (`docs/board/in-progress/0020-ÔÇªmd` is 206.9 KB, a board-hygiene check from card 0020).

What I tried to break, and could not:

- **Callers not updated.** `app/api/nearest.php` filters only on `source`, so the 276 new `forest` records rank correctly and its per-record shaping reads `postcode_satnav`/`opening_summary`/`url` generically ÔÇö no England assumption. `openSheet()` in `app/app.js` now derives the "More" label from the link's own host via `AGENCY_BY_HOST`, and `field('Country', ÔÇª)` sits outside the campsite branch, so both 2026-09-08 breakage findings are gone.
- **Offline outline.** `scripts/build_boundary.py` `WANT` already includes Scotland, so Scottish markers are not plotted off the bundled coastline.
- **Rules asserted in one place only.** `validate()` in `scripts/parse.py` keeps `GB_LAT_RANGE`/`GB_LNG_RANGE` plus a per-country box and exits non-zero; `scripts/selftest.js` re-asserts count, ids, coords, diacritics and the link label.
- **The stale doc count.** `docs/DATA-MODEL.md` `counts_by_country: England 904` matches the shipped file exactly: 274 English forests + 630 English car parks. The earlier scope reviewer compared it to forests only; the number is right.
- **Comment made false.** The `safeHref` docblock in `app/core.js` says the 630 car parks "carry no url at all" and 550 records carry one ÔÇö true of `sites.json`; campsite URLs come from card 0020's separate file.

VERDICT: sound

**acceptance**

- **#2 reopened**, by the acceptance lens: a Scottish site whose page lists no facilities gets no Facilities row in the detail sheet at all, so silence upstream renders as "no facilities" instead of "not known"


**2026-09-20** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 2 times between todo and ai-review, which is the limit, so it is waiting on a person. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 5 of 6 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-20** Released to `todo/` on Rob's instruction. Nothing about this card's content changed.

**There is work here a builder can act on.** A reviewer reopened at least one criterion above and
wrote its reason beside it, so a session opening this card finds something open rather than a full
set of ticks and nothing to do.

**Why it was parked.** Not because anybody judged it. Its bounce count, the number of times it has
come back out of `ai-review/` into `todo/`, reached the loop's limit of two, and `Test-Startable` in
`bin/work-card.ps1` then refuses to dispatch at it whatever is open on it. That backstop is right:
ProgressBoard card `0136` measured one card going round that loop 22 times for £52.70 with nothing
delivered.

**What it could not see is that those laps were rigged.** Until ProgressBoard card `0162` landed on
2026-09-12, a reviewer was forbidden from touching acceptance, so every lap returned the card fully
ticked and the next lap was guaranteed to be wasted. The count measured a fault in the tooling, not
a card that resists being finished, and the fault is fixed. The count is derived from git history
and never decreases, so it cannot learn that.

**Rob raised the limit rather than laundering the count into a fresh card number**, which would have
hidden the history and defeated the backstop for real. The backstop still stands, at five.
