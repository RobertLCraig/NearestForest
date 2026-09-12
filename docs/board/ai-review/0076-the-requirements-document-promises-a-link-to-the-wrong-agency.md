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
- [x] #1 THE PER-SITE DETAIL BULLET in `docs/PRD.md` SHALL describe a link to the page of whichever
      agency owns the site, rather than naming Forestry England for all of them. proves: `the
      requirements document does not promise one agency for every forest link`
- [x] #2 WHEN the self-test suite runs, THE SUITE SHALL fail if `docs/PRD.md` claims a link to one
      named agency in a sentence about the Forests tab, and SHALL match across a wrapped line.
      proves: `the requirements document does not promise one agency for every forest link`
- [x] #3 THE SCOTTISH-AGENCY LABEL SWEEP in `scripts/selftest.js` SHALL cover the Forestry and Land
      Scotland URLs in `app/data/campsites.json` as well as those in `app/data/sites.json`.
      proves: `every forestry and land scotland url is labelled by host, in both data files`
<!-- AC:END -->

## Tasks
- [x] Write the assertion first, against the bullet as it stands, and watch it name the line
- [x] Rewrite the bullet to name the owning agency rather than one agency
- [x] Widen the label sweep to read both data files, and watch it red with the widening removed
- [x] Re-run the suite

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

**2026-09-12**
RESULT: done
TESTS: +1 new, all green (bar the pre-existing card 0055 failure, unchanged)
TOUCHED: docs/PRD.md, scripts/selftest.js, this card
OUT-OF-SCOPE: none

**#1 and #2, red first.** The new assertion is
`the requirements document does not promise one agency for every forest link`, in the
"dataset counts carried in prose (card 0036)" block of `scripts/selftest.js`, next to card 0073's
data-model example check. Written and run before `docs/PRD.md` was touched, it went red and printed
the offending sentence reassembled across the wrap:

    FAIL  the requirements document does not promise one agency for every forest link
          — names one agency for every link: "- Per-site detail: name, sat-nav postcode,
            opening times, parking charges, facilities, link to the Forestry England page."

That quote is the red-proof of the wrapped-line half of #2 as well: the check reads the file,
collapses every run of whitespace to one space, and only then matches, which is why it can see a
sentence that `grep -c "link to the Forestry England page" docs/PRD.md` still answers `0` for.

**How the check decides.** It takes every sentence in the flattened document containing `link to`
that also mentions a site or a forest, and fails any that names exactly one of Forestry England,
Forestry and Land Scotland or Natural Resources Wales. Sentence-wise rather than document-wise on
purpose: the PRD names Forestry England legitimately in its summary, its licensing section and its
trade-mark note, so a document-wide search would either fire on all of those or be narrowed until it
fired on nothing. Naming two agencies passes, because that is not the defect. Natural Resources
Wales is on the list although nothing scrapes it yet: card `0017` would add a third agency, and the
same sentence naming that one alone would be the same fault.

It also pins that the `Per-site detail:` bullet still exists and still says where the link goes.
Without that, deleting the bullet outright would have been a green run, which is the shape of
vacuous pass this board keeps finding.

**The rewritten bullet** now reads: a link to the page of whichever agency published the site,
labelled with that agency's name, read off the link's own host rather than assumed. That is what
`AGENCY_BY_HOST` and `openSheet` in `app/app.js` actually do; no behaviour changed.

**#3, red-proofed in isolation.** The sweep now concatenates the 276 Scottish records from
`app/data/sites.json` with the 44 records in `app/data/campsites.json` whose URL host is
`forestryandland.gov.scot`, and requires a non-zero count from each file so neither half can pass by
reading nothing. The campsites half is selected by host, not by country: a Scottish campsite from
OpenStreetMap carries its own business website and is correctly labelled by that host.

Removing the campsites half proves nothing on its own, because the check would then simply not read
those records. So the proof was to isolate it: the `forestryandland.gov.scot` key in
`AGENCY_BY_HOST` was temporarily broken **and** the `sites.json` half dropped from the mislabelled
set, leaving only the campsites records able to catch anything. The run went red naming 44 of them,
starting `fls-stn-achnabreac reads "forestryandland.gov.scot"`. Both temporary edits were reverted
and `git status` confirms `app/app.js` is untouched.

**Suite:** `node scripts/selftest.js` reports 314 passed, 1 failed, against 313 passed, 1 failed
before this work. The one failure is `no board card is too large for the agent file reader`, which
is card `0055` and is Rob's to clear. There is no `vendor/` and no `pest.bat` or `pint.bat` in this
repository, so the PHP steps in the standard instructions do not apply here; the suite is Node.

**Not done, and deliberately.** No dataset change, so `CACHE` and `BUILD` are untouched and nothing
needs re-running. No browser check: this is a worktree, Herd serves `C:\Dev\NearestForest`, and
nothing about a documentation fix renders anyway.
