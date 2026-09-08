# Card 0008 entered `human-review/` without `## What I need from you`

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One more card in the lane does not have that section:

- `docs/board/human-review/0008-offline-map-view.md`

The check is one line: for each file in the lane, does the text `## What I need from you` appear.

What it costs. `0008` is 122 lines, and the ask is the very last paragraph of the file. A reader
opening it meets a built feature card with all six criteria ticked and has to read to the bottom to
find that a reviewer disproved one of them and that the card needs a person to untick it. The ask is
the opposite of what the top of the card says, so a reader who stops early reads it backwards.

How it came to be this way. `0008` was built, sent to `ai-review/`, returned, and then moved into the
lane by the scheduler on 2026-09-07 (commits `d938da5` and `54ae3c6`), after cards `0045` and `0046`
had each counted the lane. Nothing in the move adds the section, so a card gains the lane's
obligation without gaining the lane's shape. That is the same cause `0045` recorded for `0024`,
`0030` and `0043`, and `0046` for `0004` and `0006`. **This is the third time the same fault has been
raised in one day**, which says the fix belongs at the move, in `C:\Dev\ProgressBoard`, and not in
this repository.

## Links

**Relates to**
- `0045` - the same defect on `0024`, `0030` and `0043`, which it fixed. Its first criterion is
  lane-wide and cannot close until this card and `0046` do.
- `0046` - the same defect on `0004` and `0006`, still in `todo/`. Kept separate because one card per
  finding, and `0046` was written before `0008` reached the lane.

## Not this card
Not the cards `0045` and `0046` name. Not acting on the reviewer's finding in `0008`, not unticking
any of its criteria and not moving it out of the lane: that is the very call the section will be
asking Rob for. Not a check that refuses a card entering the lane without the section: that lives in
`C:\Dev\ProgressBoard`, not in this repository.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0008-offline-map-view.md` is searched for the heading
      `## What I need from you`, THE CARD SHALL return a hit directly under its title. proves: none -
      this project's suite is one node script over the app and cannot read the board; the check is
      `grep -rL "## What I need from you" docs/board/human-review/*.md` not naming `0008`
- [x] #2 WHEN a reader opens `0008`, THE CARD SHALL state the ask, what a pass is and what a fail is,
      within the first three lines under the title. proves: manual - whether an ask is legible in
      three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [x] Read the card's last comment entry and the review verdict above it, and use the ask already
      there rather than inventing one
- [x] Write `## What I need from you` under the title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [x] Check the card is still inside the 100-line budget after the section is added, and say on the
      card if it is not
- [x] Re-grep the lane and report which cards still miss the heading

## Plan
Work in the NearestForest repository. Only `docs/board/human-review/0008-offline-map-view.md`
changes; nothing under `app/` or `scripts/` is involved, so `node scripts/selftest.js` cannot see
this either way. Run it anyway to show the change broke nothing.

**The ask is already on the card; it is at the bottom.** Do not invent a new one. Its last comment
entry says the reviewer returned it with a defect verdict, that a reviewer may not untick a
criterion, and that every unattended session since has found nothing open to do and promoted it again
on the ticked boxes. So the ask is: untick what the reviewer disproved and send it back to `todo/`,
or say on the thread why the finding is wrong. The finding itself is in the last block of
`## Direction`: `loadBoundary` in `app/map.js` latches its failure, so one failed fetch of
`data/boundary.json` kills the outline, every marker and the own-position dot for the whole page life,
with no retry and no test.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example, and it is the thing this card is
enforcing rather than a style preference.

**Watch the line budget.** A whole card fits in 100 lines. `0008` is already 122, all of it build log
and review verdicts, and the append-only `## Comments` and `## Direction` threads may not be cut to
make room. So this card cannot bring it under budget; keep the new section tight and say so on the
card, as `0045` did for `0043`.

It worked when grepping `## What I need from you` across `docs/board/human-review/*.md` returns a hit
in `0008`, and when the card states the ask, the pass and the fail in the first three lines under the
title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** Raised by card `0045` on its second run. `0045` named three cards, `0046` named two
more that arrived after it was written, and `0008` arrived after `0046` was written. The lane keeps
changing under an open card, which is the finding rather than a miscount.

**2026-09-07** RESULT: done
TESTS: +0 new, all green (227 passed, 0 failed)
TOUCHED: docs/board/human-review/0008-offline-map-view.md
TOUCHED: docs/board/todo/0050-card-0013-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/in-progress/0047-card-0008-entered-human-review-without-the-required-section.md
OUT-OF-SCOPE: 0050

**No test was written, and both criteria say so.** `#1` is `proves: none` and `#2` is
`proves: manual`, so neither is prose that a test could carry. The harness genuinely cannot express
the case: `scripts/selftest.js` is one node script over `app/`, it never reads `docs/board/`, and
adding board-reading to it would be scope this card did not decide. The check is the grep the
criterion names, and **it was watched failing first**:
`grep -rL "## What I need from you" docs/board/human-review/*.md` listed `0008` before the edit and
does not list it after.

**The ask was already on the card and was not invented.** Its last comment entry says the reviewer
returned it, that a reviewer may not untick a criterion, and that every session since promoted it
again on the six ticked boxes. The `breakage: defect` verdict at the end of `## Direction` names the
fault: `loadBoundary` in `app/map.js` latches `loadError`, and `draw()` returns before the marker
block, so one failed fetch of `data/boundary.json` kills the outline, every marker and the
own-position dot for the page's whole life, with no retry and no test. That is `#1` and `#2` of
`0008`, so the new section asks Rob to untick those two and send it back to `todo/`, or to say why
the finding is wrong. Nothing on `0008` was unticked here and the card was not moved; that is the
call the section asks for.

**The card is over budget and the card says so.** `0008` went from 122 lines to 151 against a
100-line limit. `## Direction` and `## Comments` are append-only, so this card could not bring it
under; the new section was kept tight and a "Note on length" line records the overrun, as `0045` did
for `0043`.

**Re-grep of the lane, after the edit.** Three cards still miss the heading: `0011`, `0012` and
`0013`. `0011` is card `0048` and `0012` is card `0049`, both open in `todo/`. **`0013` carried no
card**, having reached the lane in commit `5f8f86f` after `0049` was written, so it is raised here as
`0050`. That makes this the sixth raising of the same fault in two days, which keeps saying the fix
belongs at the lane move in `C:\Dev\ProgressBoard`, not in this repository.

**On the suite.** There is no `vendor/`, no Pest and no Pint in this project; the suite is
`node scripts/selftest.js`, and it reports 227 passed, 0 failed. Nothing under `app/` or `scripts/`
was touched, so it could not have seen this change either way.

### 2026-09-08 review (v20260908145232-d507)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Reviewed with the acceptance lens.

**Criterion #1** ÔÇö the heading. `docs/board/human-review/0008-offline-map-view.md` has `## What I need from you` as the first heading, directly under the title `# Map view with the bundled offline outline`. My own run of `grep -rL "## What I need from you" docs/board/human-review/*.md` does not name `0008`. Traced and met.

**Criterion #2** ÔÇö the ask readable in three lines. Under the title, the first text is the bold one-line ask: untick `#1` and `#2` and return the card to `todo/`, or say why the finding is wrong. `**Pass**`, `**Fail**`, `**Why it needs you**` and `**Cause**` follow underneath, which is the shape `docs/board/README.md` gives in "The one section a card in `human-review/` must have". A `**Note on length**` records the 151-line overrun, as the tasks required. Traced and met.

Nothing in the card unticked a criterion of `0008` or moved it, which the "Not this card" section forbade.

One thing outside the criteria, so it does not change the verdict: the card's comment says only `0011`, `0012` and `0013` still miss the heading. My grep of the lane now lists 13 files missing it, including `0015`, `0019`, `0023` and `0026`. That report is stale.

VERDICT: sound

**scope: sound**

I checked only the scope question.

**What the work really touched** (commit `2b94c98`, not the big branch diff above): three files.

- `docs/board/human-review/0008-offline-map-view.md` ÔÇö the new `## What I need from you` block sits right under the title. Nothing in `## Acceptance` was unticked, the card was not moved out of the lane, and nothing under `app/` or `scripts/` was touched. The fence in "Not this card" holds.
- `docs/board/in-progress/0047-...md` ÔÇö its own card log.
- `docs/board/todo/0050-card-0013-...md` ÔÇö a new card for `0013`.

**The one thing that grew:** task 4 asked to *report* the lane re-grep; the session also *raised* `0050`. It labelled it `OUT-OF-SCOPE: 0050` on the thread, one card per finding is the board's own rule, and `0047` itself was born the same way from `0045`'s run. Declared and consistent, so not a defect.

**Half done:** nothing found. I re-ran the lane grep at that commit: it listed exactly `0011`, `0012`, `0013`, which is what the card reports. `0008` is 151 lines and the card says so, as asked.

VERDICT: sound

**breakage: sound**

I tried to break this card's work. I could not.

What I checked:

- `docs/board/human-review/0008-offline-map-view.md` now has `## What I need from you` directly under the title, with the ask, Pass and Fail. Criterion #1's own grep no longer names `0008`.
- The ask matches the finding already on the card. `loadBoundary` in `app/map.js` still returns early on `loadError`, and `draw()` still paints the error and returns before the marker block. So the section does not claim a fault that has since been fixed.
- The "Note on length" says 151 lines. `wc -l` says 151. True.
- Card `0045`'s two acceptance boxes are still unticked, so nothing this card touched marks a lane-wide claim as done that is not done.
- The re-grep report on the card names `0011`, `0012`, `0013`. At the commit that made the edit (`2b94c98`) the lane held exactly those, and `0011`/`0012`/`0013` now carry the heading. Thirteen other cards in the lane lack it today, but every one of them entered the lane in a later commit (`8be3a6f`, `a88dc88`, `b75c92d` and others). That drift is the fault the card names, not a fault the card made.

Nothing under `app/` or `scripts/` was touched by this card, so no caller moved.

VERDICT: sound

