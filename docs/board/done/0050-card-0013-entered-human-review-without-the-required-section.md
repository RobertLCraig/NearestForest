# Card 0013 entered `human-review/` without `## What I need from you`

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One more card in the lane does not have that section:

- `docs/board/human-review/0013-scheme-allow-list-for-dataset-urls.md`

The check is one line: for each file in the lane, does the text `## What I need from you` appear.

What it costs. `0013` is 98 lines. All three of its criteria are ticked, two of its three review
verdicts read `sound`, and the ask is the single paragraph at the very bottom of the file. A reader
who opens it meets a built and passed security card and has to read past two `sound` verdicts to
reach the `defect` one and learn that the card needs a person to untick something. The top of the
card says the opposite of the ask, so a reader who stops early reads it backwards.

How it came to be this way. `0013` was built, sent to `ai-review/`, returned, and then moved into the
lane by the scheduler on 2026-09-07 (commit `5f8f86f`), after cards `0045`, `0046`, `0047`, `0048`
and `0049` had each counted the lane. Nothing in the move adds the section, so a card gains the
lane's obligation without gaining the lane's shape. That is the same cause `0045` recorded for
`0024`, `0030` and `0043`, `0046` for `0004` and `0006`, `0047` for `0008`, `0048` for `0011` and
`0049` for `0012`. **This is the sixth time the same fault has been raised in two days**, which says
the fix belongs at the move, in `C:\Dev\ProgressBoard`, and not in this repository.

## Links

**Relates to**
- `0045` - the same defect on `0024`, `0030` and `0043`, which it fixed. Its first criterion is
  lane-wide and cannot close until this card, `0048` and `0049` do.
- `0046` - the same defect on `0004` and `0006`, which it fixed. Its first criterion is lane-wide and
  is still open for the same reason.
- `0047` - the same defect on `0008`, which it fixed. This card was raised by its run.
- `0048` - the same defect on `0011`, still in `todo/`.
- `0049` - the same defect on `0012`, still in `todo/`. Kept separate because one card per finding,
  and `0049` was written before `0013` reached the lane.

## Not this card
Not the cards `0045`, `0046`, `0047`, `0048` and `0049` name. Not acting on the reviewer's `breakage`
finding in `0013`, not unticking any of its criteria and not moving it out of the lane: that is the
very call the section will be asking Rob for. Not writing the missing generator-end test in
`scripts/selftest.js`, which is what that finding asks for and is `0013`'s own work, not this card's.
Not a check that refuses a card entering the lane without the section: that lives in
`C:\Dev\ProgressBoard`, not in this repository.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0013-scheme-allow-list-for-dataset-urls.md` is searched for the
      heading `## What I need from you`, THE CARD SHALL return a hit directly under its title.
      proves: none - this project's suite is one node script over the app and cannot read the board;
      the check is `grep -rL "## What I need from you" docs/board/human-review/*.md` not naming `0013`
- [x] #2 WHEN a reader opens `0013`, THE CARD SHALL state the ask, what a pass is and what a fail is,
      within the first three lines under the title. proves: manual - whether an ask is legible in
      three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [x] Read the card's last comment entry and the `breakage: defect` verdict above it, and use the ask
      already there rather than inventing one
- [x] Write `## What I need from you` under the title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [x] Check the card is still inside the 100-line budget after the section is added, and say on the
      card if it is not
- [x] Re-grep the lane and report which cards still miss the heading

## Plan
Work in the NearestForest repository. Only
`docs/board/human-review/0013-scheme-allow-list-for-dataset-urls.md` changes; nothing under `app/` or
`scripts/` is involved, so `node scripts/selftest.js` cannot see this either way. Run it anyway to
show the change broke nothing.

**The ask is already on the card; it is at the bottom.** Do not invent a new one. Its last comment
entry says the reviewer returned it, that a reviewer may not untick a criterion, and that every
unattended session since has found nothing open to do and promoted it again on the ticked boxes. So
the ask is: untick what the reviewer disproved and send it back to `todo/`, or say on the thread why
the finding is wrong. The finding itself is the `breakage` verdict at the end of `## Direction`:
nothing tests the generator end. `validate()` in `scripts/parse.py` is the only place AC `#2` lives,
no test in `scripts/selftest.js` drives it, and deleting those four lines still leaves the suite
green. The reviewer also names the tool for it, the existing `runParse` fixture harness. Note that
the reviewer graded `acceptance: sound` and `scope: sound`, so which criterion to untick, if any, is
part of what a person has to decide.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example, and it is the thing this card is
enforcing rather than a style preference.

**Watch the line budget.** A whole card fits in 100 lines. `0013` is already 98, so the new section
will push it over, and the append-only `## Comments` and `## Direction` threads may not be cut to
make room. Keep the section tight and say so on the card, as `0045` did for `0043` and `0047` did
for `0008`.

It worked when grepping `## What I need from you` across `docs/board/human-review/*.md` returns a hit
in `0013`, and when the card states the ask, the pass and the fail in the first three lines under the
title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** Raised by card `0047` on its run. `0045` named three cards, `0046` two more, `0047`
named `0008`, `0048` named `0011`, `0049` named `0012`, and `0013` arrived after `0049` was written.
The lane keeps changing under an open card, which is the finding rather than a miscount.

**2026-09-08** RESULT: done
TESTS: +0 new, all green (227 passed, 0 failed)
TOUCHED: docs/board/human-review/0013-scheme-allow-list-for-dataset-urls.md
TOUCHED: docs/board/in-progress/0050-card-0013-entered-human-review-without-the-required-section.md
OUT-OF-SCOPE: none

Wrote `## What I need from you` directly under `0013`'s title, using the ask already at the bottom of
its thread rather than a new one. The ask names criterion `#2`, not `#3`: the reviewer's `breakage`
verdict says `validate()` in `scripts/parse.py` is the only place AC `#2` lives and nothing drives
it. Which box to untick is still Rob's call, and the section says so under "Why it needs you".

Neither criterion here could be given a test. `#1` is `proves: none` and `#2` is `proves: manual`, and
this project's suite is `node scripts/selftest.js` over the app — it cannot read the board. I ran it
anyway to show nothing broke: 227 passed, 0 failed. There is no PHP suite in this repository, so
`.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist here and were not run.

**`0013` is now 117 lines and over the 100-line budget**, as this card predicted. It was 98 before.
Nothing was cut to make room: `## Comments` is append-only and holds three review verdicts, which is
most of the file. Shortening it means moving those verdicts, and that is not this card's call.

Re-grepped the lane. **Two cards still miss the heading: `0014` and `0015`.** Both already have a
card, so no new one was raised: `0051` in `todo/` covers `0012`, `0013` and `0014`, and `0052` in
`todo/` covers `0015`. Note `0051` overlaps this card and `0049` on `0013` and `0012`.

### 2026-09-08 review (v20260908160857-9dd7)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Checked both boxes against the file.

**#1** ÔÇö `## What I need from you` is on line 3 of `docs/board/human-review/0013-scheme-allow-list-for-dataset-urls.md`, directly under the `# Scheme allow-list for dataset URLs` title. Hit confirmed. No code function is involved; the criterion says `proves: none` and is a text check, which the file passes.

**#2** ÔÇö The ask, the pass and the fail all sit in the three lines under the heading: "Untick criterion `#2` ÔÇª so the card returns to `todo/`" is the ask, "**or** write on the thread that the reviewer is wrong, and the card stands as done" is the second pass route, and "Doing neither is the fail: the card comes straight back here, unchanged" names the fail. Both pass routes are stated, not implied.

I tried to break it two ways. First, the ask names `#2`, and `#2` is the criterion the reviewer's `breakage` verdict is about (`validate()` in `scripts/parse.py`), so the section does not point at the wrong box. Second, the section is above `## Why`, so a reader who stops early now reads the ask, not the ticked boxes ÔÇö which was the defect.

The 117-line overrun is real and the agent said so on the card. No criterion covers line count, so it is not an acceptance failure.

VERDICT: sound

**scope: sound**

Checked the real commit (`0189179`), not the whole branch diff. It touched two files only: `0013` and its own card `0050`.

- Fence held. It did not untick a box, did not move `0013`, did not touch `scripts/selftest.js` or `scripts/parse.py`. The three criteria in `0013`'s `## Acceptance` are unchanged.
- The lane re-grep was right at the time. Running the grep against that commit's tree gives exactly `0014` and `0015`, which is what the card reported. (Today the tree shows more, because more cards moved in after.)
- Over-budget was declared, not hidden: `0013` is 117 lines and the comment on `0050` says so, which the task asked for.
- Nothing left half done that this card owned. The four tasks all landed inside the two files.

The big file list in the review packet is other cards' work on the same branch, not this change.

VERDICT: sound

**breakage: defect**

Reviewed with the `breakage` lens.

**Finding ÔÇö the change's own re-grep report is false.**

In `docs/board/in-progress/0050-card-0013-entered-human-review-without-the-required-section.md`, the `2026-09-08` comment entry says: "Re-grepped the lane. **Two cards still miss the heading: `0014` and `0015`.**"

Running the card's own stated check now:

`grep -rL "## What I need from you" docs/board/human-review/*.md`

returns **13** files, not two. `0014` is not among them (it has the heading). The ones missing it are `0015`, `0019`, `0023`, `0026`, `0028`, `0031`, `0032`, `0034`, `0036`, `0038`, `0040`, `0041`, `0044`.

Why this is breakage, not nitpicking: task 4 of this card is "Re-grep the lane and report which cards still miss the heading", and the entry then reasons off that wrong number ÔÇö it concludes no new card is needed because `0051` and `0052` cover it. Eleven lane cards are left uncovered by an entry that says the lane is accounted for. The next scheduler run reads that entry, not the lane.

The `0013` edit itself holds: the heading sits directly under the title, states ask / pass / fail in the first three lines, and its cause paragraph matches the `breakage: defect` verdict in `0013`'s own `## Comments`.

VERDICT: defect


**2026-09-08** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-10** Rob's call, answering the queue: **closed.** The `## What I need from you` sections
this card added are in the cards it named, so the work is finished and visible, and there is no
question left on it for a person. Recorded here rather than left to be re-derived from the folder.
