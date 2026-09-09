# Card 0019 entered `human-review/` without `## What I need from you`

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One card in the lane has that fault and no open card names it:

- `docs/board/human-review/0019-use-forestry-englands-own-attribution-wording.md`

The check is one line: for each file in the lane, does the text `## What I need from you` appear.

What it costs. `0019` is 196 lines. All four of its criteria are ticked, its `acceptance` verdict
reads `sound`, and the ask is the single paragraph at the very bottom of the file. A reader who opens
it meets a finished attribution card and has to read past a `sound` verdict and two `defect` ones to
learn that a person has to untick something.

How it came to be this way. `0019` was built, sent to `ai-review/`, returned with a finding a builder
could not act on, and then moved into the lane by the scheduler on 2026-09-08. Nothing in the move
adds the section, so a card gains the lane's obligation without gaining the lane's shape. That is the
same cause `0045` recorded for `0024`, `0030` and `0043`, `0046` for `0004` and `0006`, `0047` for
`0008`, `0048` for `0011`, `0049` for `0012`, `0050` for `0013`, `0051` for `0012`, `0013` and `0014`,
and `0052` for `0015`. **This is the eighth time the same fault has been raised in two days**, which
says the fix belongs at the move, in `C:\Dev\ProgressBoard`, and not in this repository.

## Links

**Relates to**
- `0051` - the same defect on `0012`, `0013` and `0014`, which it fixed. Found `0019` while
  re-grepping the lane afterwards, which is `0051`'s own last task. `0019` reached the lane on
  2026-09-08, after `0051` was written, so no earlier card could name it.
- `0052` - the same defect on `0015`, still open in `todo/`. Kept separate because one card per
  card in the lane is how this series has been raised.
- `0045`, `0046`, `0047`, `0048`, `0049`, `0050` - the same defect on earlier batches.

## Not this card
Not the cards `0045` to `0052` name. Not acting on either reviewer finding in `0019`, not unticking
any of its criteria and not moving it out of the lane: that is the very call the section will be
asking Rob for. Not changing the `attribution` string in `scripts/parse.py` or the footer wording in
`app/index.html`, which is what the findings are about and is `0019`'s own work. Not a check that
refuses a card entering the lane without the section: that lives in `C:\Dev\ProgressBoard`, not in
this repository.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0019-use-forestry-englands-own-attribution-wording.md` is
      searched for the heading `## What I need from you`, THE CARD SHALL return a hit directly under
      its title. proves: none - this project's suite is one node script over the app and cannot read
      the board; the check is `grep -rL "## What I need from you" docs/board/human-review/*.md` not
      naming `0019`
- [x] #2 WHEN a reader opens `0019`, THE CARD SHALL state the ask, what a pass is and what a fail is,
      within the first three lines under the title. proves: manual - whether an ask is legible in
      three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [x] Read the card's last comment entry and the two `defect` verdicts above it, and use the ask
      already there rather than inventing one
- [x] Write `## What I need from you` under the title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [x] Check the card is still inside the 100-line budget after the section is added, and say on the
      card if it is not
- [x] Re-grep the lane and report which cards still miss the heading

## Plan
Work in the NearestForest repository. Only
`docs/board/human-review/0019-use-forestry-englands-own-attribution-wording.md` changes; nothing
under `app/` or `scripts/` is involved, so `node scripts/selftest.js` cannot see this either way. Run
it anyway to show the change broke nothing.

**The ask is already on the card, at the bottom.** Do not invent one. Its last comment entry says the
reviewer returned it, that a reviewer may not untick a criterion, and that every unattended session
since has found nothing open and promoted it again on the ticked boxes. So the ask is: untick what
the reviewer disproved and send it back to `todo/`, or say on the thread why the finding is wrong.

The findings are the two `defect` verdicts at the end of `## Direction`, and both are about the same
rule applied unevenly. `scope`: the Scottish footer sentence now reads as Forestry England's own
template with Forestry and Land Scotland's name dropped into it, while the card, the build note and
the HTML comment directly above the line all say Scotland takes the generic wording — so the app
puts a first-party-looking credit into the mouth of an agency that publishes none. `breakage`: the
`attribution` field `build_dataset` stamps into `app/data/sites.json` in `scripts/parse.py` still
carries the generic string the card retired, and `ok('attribution present', ...)` in
`scripts/selftest.js` only greps for "Open Government Licence", so it passes either way. Note the
reviewer graded `acceptance: sound`, so which criterion to untick, if any, is part of the call.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example.

**Watch the line budget.** A whole card fits in 100 lines. `0019` is already 196, and the
append-only `## Comments` and `## Direction` threads may not be cut to make room. So this card cannot
bring it under budget; keep the new section tight and say so on the card, as `0045` did for `0043`
and `0051` did for `0014`.

It worked when grepping `## What I need from you` across `docs/board/human-review/*.md` returns a hit
in `0019`, and when the card states the ask, the pass and the fail in the first three lines under the
title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-08** Raised by card `0051` on its last task, re-grepping the lane after fixing `0014`.
`0019` arrived in the lane on 2026-09-08, after `0051` and `0052` were written, so it is the one card
in the lane that no open card carries.

**2026-09-09** RESULT: done
TESTS: +0 new, all green (279 passed, 0 failed)
TOUCHED: docs/board/human-review/0019-use-forestry-englands-own-attribution-wording.md
TOUCHED: docs/board/in-progress/0053-card-0019-entered-human-review-without-the-required-section.md
OUT-OF-SCOPE: none

**No test was written, and neither criterion asked for one.** `#1` says `proves: none` and `#2` says
`proves: manual`, so the test-first rule does not apply to either. The harness could not express `#1`
in any case: this project's suite is `node scripts/selftest.js` over `app/` and `scripts/`, and it
cannot read `docs/board/`. The suite was run anyway to show the change broke nothing: 279 passed, 0
failed. There is no PHP suite here, so `.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not
exist and were not run.

Wrote `## What I need from you` directly under `0019`'s title, using the ask already at the bottom of
the card rather than a new one: untick what the reviewer disproved and send the card to `todo/`, or
say in the thread why the finding is wrong. Named the two `defect` findings in the reader's terms
(the Scottish footer sentence wearing Forestry England's template, and the retired attribution string
still stamped into `app/data/sites.json` by `build_dataset` in `scripts/parse.py` behind a self-test
that greps only for "Open Government Licence"), and included the `defect`-card fields `What's wrong`
and `Cause` per the README's field table.

**Nothing in `0019` was acted on, unticked or moved**, per this card's `## Not this card` fence. Its
`## Acceptance` block, its thread, `app/index.html` and `scripts/parse.py` are all untouched.

**`0019` is over budget and this card could not fix it.** It was 197 lines and is now 234 against a
budget of 100. `## Comments` is append-only and holds roughly half the file, so there was nothing
this card was allowed to cut. Said so on the card itself, as `0045` did for `0043` and `0051` did for
`0014`.

**Lane re-grep, at this commit.** Eleven files in `docs/board/human-review/` still miss the heading:
`0023`, `0026`, `0028`, `0031`, `0032`, `0034`, `0036`, `0038`, `0040`, `0041`, `0044`. All eleven are
already carried by card `0056` in `todo/`, which names exactly that list, so no new card was raised
and `OUT-OF-SCOPE` is `none`. Every other card in the lane now has the section.
