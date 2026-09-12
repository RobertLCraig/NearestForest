# The requirements document promises a link to the wrong agency

## Why
**The Product Requirements Document describes behaviour the app deliberately stopped having.** Its
per-site detail bullet, at lines 56 and 57 of `docs/PRD.md`, reads:

    - Per-site detail: name, sat-nav postcode, opening times, parking charges, facilities, link to the
      Forestry England page.

That matched what shipped until card `0057`. Half the Forests tab is now Forestry and Land Scotland,
276 of the 550 sites, and the detail sheet derives the link's label from the link's own host. So the
sentence now describes the bug `0057` removed rather than the behaviour it left.

**What it costs.** `docs/PRD.md` is named in `docs/HANDOVER.md` as the source of truth for the goal
and the success criteria, so it is the file a session reads before deciding whether a change is in
scope. A requirements document that describes a fixed defect invites somebody to restore it. It is
also the document that would be shown to Forestry England: the outreach drafts under `docs/outreach/`
are about how their material is credited, and a requirements document promising every link goes to
their page is wrong in a way that matters to that conversation.

**There is a second, smaller half to the same finding.** The Scottish-agency sweep in
`scripts/selftest.js` reads `DATA.sites` only. The 44 Stay the Night records that carry Forestry and
Land Scotland URLs live in `app/data/campsites.json` and rest on a single fixture, so the label
logic is proved over one file and asserted over the other by example.

**How it came to be this way.** Card `0057` updated the bullet four lines above this one, which is
the Great-Britain-minus-Wales bullet, and stopped there. Its reviewer caught the miss on 2026-09-11.
That review was written against a stale copy of the card, and when the two copies were merged under
card `0069` the finding was checked with a single-line search. The bullet wraps, so the phrase
straddles a newline and the search returned nothing; the finding was recorded as not reproducing and
the card it belonged to was left in `done/`.

## Links

**Relates to**
- `0057` - the card that changed the behaviour and left the document behind. Its 2026-09-11 review
  carries the finding in full, and that card is in `done/`, so nothing there will pick it up.
- `0069` - the merge that dismissed this finding on a search that could not match a wrapped line.
  Its own reviewer found the mistake and this card is the remedy.
- `0019` - the neighbouring attribution work. Its own reviewer found the same shape of drift in
  `docs/DATA-MODEL.md`, which is card `0073`. Same fault, different document, and the two are worth
  reading together before deciding how a check should cover either.

## Not this card
**Not changing any behaviour.** `openSheet` in `app/app.js` and its `AGENCY_BY_HOST` table are
correct and reviewed. Only the document is wrong.

**Not re-running the pipeline.** No dataset changes, so nothing needs a cache bump.

**Not a general audit of `docs/PRD.md`.** One bullet is wrong and it is named above. Sweeping the
document for other drift is a different card and nobody has measured whether it is needed.

**Not card `0073`.** That is the same shape of drift in `docs/DATA-MODEL.md` and it has its own
check to write.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 THE PER-SITE DETAIL BULLET in `docs/PRD.md` SHALL describe a link to the page of whichever
      agency owns the site, rather than naming Forestry England for all of them. proves: `the
      requirements document does not promise one agency for every forest link`
- [ ] #2 WHEN the self-test suite runs, THE SUITE SHALL fail if `docs/PRD.md` claims a link to one
      named agency in a sentence about the Forests tab, and SHALL match across a wrapped line.
      proves: `the requirements document does not promise one agency for every forest link`
- [ ] #3 THE SCOTTISH-AGENCY LABEL SWEEP in `scripts/selftest.js` SHALL cover the Forestry and Land
      Scotland URLs in `app/data/campsites.json` as well as those in `app/data/sites.json`.
      proves: `every forestry and land scotland url is labelled by host, in both data files`
<!-- AC:END -->

## Tasks
- [ ] Write the assertion first, against the bullet as it stands, and watch it name the line
- [ ] Rewrite the bullet to name the owning agency rather than one agency
- [ ] Widen the label sweep to read both data files, and watch it red with the widening removed
- [ ] Re-run the suite

## Plan
**Where to stand.** This repository, on a branch of `main`. There is no PHP suite here and no
`vendor/`, so `pest` and `pint` do not exist. The suite is `node scripts/selftest.js`. It is red at
HEAD on one assertion that is not yours, `no board card is too large for the agent file reader`,
which is card `0055` and is Rob's to clear.

**Confirm the defect, and note how it hides**, from the repository root in Git Bash:

    sed -n '54,58p' docs/PRD.md
    grep -c "link to the Forestry England page" docs/PRD.md

The first prints the bullet. The second prints `0`, because the phrase spans lines 56 and 57. **Any
check written here must flatten whitespace before matching**, the way the two footer assertions for
card `0019` already do in `scripts/selftest.js`; a line-at-a-time search is what missed this once
already.

**The check goes in `scripts/selftest.js`**, beside the block that already reads counts carried in
prose for card `0036`, which is where this project keeps its "a document repeats a fact about the
app" assertions. Read `docs/PRD.md`, collapse runs of whitespace to single spaces, and fail if a
sentence about per-site detail names one agency as the link target. Name it exactly `the
requirements document does not promise one agency for every forest link`.

**What the bullet should say.** The behaviour it has to describe is: the detail sheet links to the
page of whichever agency published the site, labelled with that agency's name, derived from the
link's own host. `AGENCY_BY_HOST` in `app/app.js` is the table; read it before writing the sentence
so the document and the code agree.

**For criterion #3**, the existing sweep is the block asserting every Scottish record is labelled by
host. It iterates `DATA.sites`. `app/data/campsites.json` is loaded in this suite as `CAMP`, and 44
of its records carry `forestryandland.gov.scot` URLs. Widen the sweep to both and require a non-zero
count from each, so neither half can pass vacuously.

**Red-proof all three on the real defect.** The bullet is wrong at HEAD, so the first run of a
correct check for #1 and #2 is red naming it, before the document is touched. For #3, remove the
campsites half after adding it and confirm the run goes red; a sweep that passes when it reads
nothing is the shape this project keeps finding.

## Comments

**2026-09-11** WRITTEN AFTER THE FINDING, NOT AFTER THE WORK. The criteria are a reviewer's finding
turned into checks and nothing here is built yet, so every box is honestly unticked. The finding is
the `breakage: defect` verdict of the 2026-09-11 review on card `0057`, quoted in full on that
card's thread in `done/`, and the reason it took a second reviewer to raise it is on card `0069`.
