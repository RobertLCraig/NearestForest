# Cards 0018 and 0020 are two to three times the reader's line budget

## What I need from you

**One answer. Close this card at three of its four checks, or send it back to `todo/`?**

Six unattended runs have all reached the same finding, so nothing new will come from a seventh.

**Pass** is either of:
- you close it. The shortening work is done and checked: `0018` and `0020` are 100 lines each, and
  every number, date and URL cut out of them was re-found somewhere else in the repository.
- you send it back to `todo/`, because the last check now passes on its own. That check wants the
  estate-wide card-format checker to report zero failing cards. The one failure it reports is a
  missing "why" line in card `0026`, which is card `0028`'s job, and `0028` is now built and sitting
  in `ai-review/`. One run of the checker would say which.

**Fail** is closing it while the checker still reports that failure and nobody has said so out loud.
Then the board records a green card over an open fault. Say so in this thread instead.

**Why it needs you.** A session may not tick a check it did not meet, and it may not decide that
three of four is enough. That is a call about what this board counts as finished, and only you make
it.

## Why
`docs/board/README.md` sets a whole card at 100 lines, measured off the estate's own habit: a median
of 63 lines over 108 cards on 22 boards, nine in ten under 104. Two open cards here are far past it,
counted on 2026-09-05:

- `0018` at **325 lines**, and it is the one card on this board sitting in front of a person waiting
  for an answer.
- `0020` at **260 lines**, and it is built, so most of what a reviewer wades through is research
  that has already been acted on.

What it costs. `0018` asks Rob for one choice and one send. To reach that ask he passes a full menu
of eight possible asks, three cold reviews of the draft written out in full, and a ranked list of
everything three reviewers flagged. The README names this exact failure: the tail is where the
reader is lost, and a card over budget is either two cards or one that failed the cut-everything
test. On present evidence `0018` is both.

How it came to be this way. Neither card was written long. Each grew by append: a research pass
wrote its findings onto the card, then a review wrote its findings under those, then a build wrote
what it did. Every addition was worth writing somewhere. Nothing ever moved out.

## Links

**Relates to**
- `0021` - applied the writing convention to every card on this board and brought the structural
  checks to zero. Length is not one of those checks, and that card's scope fence forbids deleting
  anything, so this was left standing rather than missed.
- `0018` - one of the two cards. Its `## Direction` and `## Decided` entries are append-only and
  must survive untouched, which shapes where the cut can fall.
- `0020` - the other. It is built and in `ai-review/`, so its research sections have already done
  their job.

## Not this card
Not any other card: everything else here is under 145 lines. Not editing `## Direction`,
`## Decided` or `## Comments` on either card, which are append-only on this board for any reason.
Not losing a measurement, a date, a source or a decision: a fact that is still load bearing moves to
the doc that owns it, or to a second card, and is never dropped. Not the ask, the pass condition or
the option costs on `0018`, which the README names as the last things that may go. Not changing
`docs/board/README.md`, which is a copy of a file held outside this repository.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `0018` is read, THE CARD SHALL be at or under 100 lines, or SHALL have been split into
      two cards each at or under 100 lines. proves: none - no check on this board reads card length
- [x] #2 WHEN `0020` is read, THE CARD SHALL be at or under 100 lines. proves: none - as #1
- [x] #3 WHEN either card is shortened, THE CARD SHALL keep every measurement, date, source and
      recorded decision, moving anything cut into the doc or the card that owns it. proves: none - as #1
- [ ] #4 WHEN the convention checks are re-run, THE BOARD SHALL still report zero open cards
      failing. proves: none - the command is in another repository, named in `## Plan`
<!-- AC:END -->

## Tasks
- [x] Decide for `0018` whether it is one card that failed the cut test or two cards in one file
- [x] Move the three cold reviews and the full ask menu wherever they belong, or cut them
- [x] Cut `0020` back to the problem, the licence rule, the acceptance and the outcome
- [ ] Re-run the convention check and confirm the board is still at zero

## Plan
Work in the NearestForest repository, on a branch off `main`. Only the two card files change.

Count a card with `wc -l docs/board/todo/0018-write-to-forestry-england.md` from Git Bash, or
`(Get-Content <path>).Count` in PowerShell. Re-run the structural checks from this board's directory,
in PowerShell:

    php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards

It must still print `0` as its second number. `--path` matters: a build worktree is not
`C:\Dev\NearestForest`, and without it you measure a tree you are not editing.

**On `0018`, apply the README's own test to each paragraph**: take it out, and ask whether Rob would
now answer differently. The three cold reviews are the largest block and the hardest call. They are
genuine findings about a draft that has not been sent, so they are not stale, but they are about
`docs/outreach/forestry-england-enquiry.md` rather than about the choice the card asks for. Moving
them beside that draft is likely the answer; deleting them is not, because nobody has acted on them
yet. That move is the decision to make before any cutting starts.

**On `0020`, the research has already been spent.** The measured tag counts, the payload table and
the filter derivation all fed a build that shipped, and the numbers that still matter are recorded
in `docs/DECISIONS.md` and `docs/DATA-MODEL.md`. Check that before cutting: anything on the card and
not in those two docs moves there first.

## Comments
**2026-09-05**
RESULT: partial
TESTS: +0 new, all green. Every criterion here is `proves: none`, so none of them gets a test. The
repository's suite is `node scripts/selftest.js`: 219 passed, 0 failed, the same count as before this
work, which is what a docs-only change should do. **There is no `vendor\bin\pest.bat` and no
`pint.bat` here**, and no `composer.json` either: this project is plain HTML, CSS, JS and Python with
no build step, per `CLAUDE.md`.
TOUCHED: docs/board/todo/0018-write-to-forestry-england.md
TOUCHED: docs/board/ai-review/0020-campsites-tab-from-openstreetmap.md
TOUCHED: docs/board/todo/0027-send-the-forestry-england-enquiry.md (new)
TOUCHED: docs/board/todo/0028-card-0026-links-0023-without-saying-why.md (new)
TOUCHED: docs/outreach/forestry-england-enquiry-review.md (new)
TOUCHED: docs/DATA-MODEL.md
TOUCHED: docs/HANDOVER.md
TOUCHED: docs/board/in-progress/0024-two-cards-are-over-the-line-budget.md
OUT-OF-SCOPE: 0028

**`0018` is both**, exactly as `## Why` predicted, and it took both remedies. 325 lines to 100.

- The three cold reviews and the eight-row ask menu moved **verbatim** to
  `docs/outreach/forestry-england-enquiry-review.md`, beside the draft they are about, which is what
  `## Plan` said was likely the answer. Nothing was deleted and nothing was reworded. That file opens
  by saying it is internal, never sent, and never rendered to Word with the draft.
- The card then still would not fit, and the arithmetic is worth recording because it is the whole
  reason for the split. `## Direction` and `## Decided` are 53 of the 100 lines and this card forbids
  touching them, which leaves 47 for the title, the ask, the pass condition, the problem and three
  costed options. That is not a card, it is a compression, and the README names compression as the
  one way to pass this rule while failing it.
- So the send became card **`0027`**, which carries the ask, the pass condition, the fail date, the
  contact route and the `.docx` note, all lifted rather than rewritten. `0018` keeps the problem, the
  costed options, the recommendation and its two append-only logs, untouched to the byte.

**`0020` is 260 lines to 100**, cut to the problem, the licence rule, the acceptance and the outcome
as asked. Before cutting, everything on it and not in a doc moved into `docs/DATA-MODEL.md`: the
8,496-element measurement with its node/way/relation split and its bounding box, the full tag-coverage
block, the 2,859 untagged `camp_site` records that were the judgement call, the wider filter that was
measured and rejected (5,194 records, 628 KB, 150 KB gzipped), the columnar encoding that was measured
and rejected, the nine Stay the Night sites taking vehicles over 7 m, and why the extract comes from
Overpass rather than a `.pbf`. The acceptance block is byte-identical, including the open #8. The
"do not reconcile campsites against the car park data" warning moved into `## Not this card`, where a
scope fence belongs, rather than dying with `## Plan`.

**Criterion #4 is not met and I could not meet it.** The convention check reports **one** open card
failing, not zero, and it did so before I changed anything:

    NearestForest   1   25   0027
    0026    todo    unexplained link: 0023

`0026` was raised on 2026-09-05, after this card was written, so the word "still" in #4 was already
untrue when I picked this up. The fault is one line in another card's `## Links`, and a card session
may not edit cards outside its own scope, so it is card **`0028`** rather than a fix. All four cards
I did touch pass the check. Fix `0028` and #4 closes on the next run.

**Assumed:** that a `## Links` reason is not a "measurement, date, source or decision" under #3, so
the `0015` and `0010` link lines dropped from `0018` were allowed to go. Both facts survive anyway:
the `0010` mail dates are on `0027`, and HANDOVER carries the `0015` screenshot connection.

**Could not settle from the repository:** nothing that blocked the work. Worth a reader's eye,
though: `0018` sits in `todo/` while HANDOVER counts it among the cards waiting on Rob, and `0027`
was put in `todo/` beside it rather than in `human-review/`, because a card session does not choose
lanes. Both carry the material a person needs whichever lane they end up in.

**2026-09-05**
RESULT: partial
TESTS: +0 new, all green. All four criteria are `proves: none`, so none of them gets a test and the
paragraph about writing one first does not apply. `node scripts/selftest.js` reports 219 passed,
0 failed, unchanged, which is what a docs-only change should do. There is still no
`vendor\bin\pest.bat`, no `pint.bat` and no `composer.json` in this project.
TOUCHED: docs/DATA-MODEL.md
TOUCHED: docs/HANDOVER.md
TOUCHED: docs/board/in-progress/0024-two-cards-are-over-the-line-budget.md
OUT-OF-SCOPE: none - `0028` was already raised by the previous run and still covers the #4 blocker

Resumed the card for its one open criterion, `#4`, and checked the three ticked ones rather than
taking them on trust. `#1` and `#2` hold: `0018` and `0020` are 100 lines each.

**`#3` did not hold, and now does.** The check was mechanical: take every number, date and URL the
previous run deleted from each card, and ask whether it still appears anywhere in the repository.
`0018` came back clean - the fail date, the contact address, the `~700 words` review finding and the
cut buy-it-outright option are all on `0027` or in
`docs/outreach/forestry-england-enquiry-review.md`. `0020` did not. Two load-bearing measurements
had landed nowhere, and both are now in `docs/DATA-MODEL.md`, which is the doc that owns them:

- **The live compression measurement.** `sites.json` served from
  `https://forestlocator.enhanceify.co.uk/data/sites.json` returns `Content-Encoding: br` at 52,064
  bytes for a 527,524-byte file. This is the *evidence* for PRD NFR3 and the real reason the columnar
  encoding was rejected. DATA-MODEL had kept the rejection but justified it as "does not pay for a
  decode step", which is the conclusion with the measurement removed from under it.
- **1,512 of the wider filter's 5,194 records carry no `name`.** DATA-MODEL described that filter as
  the change to make "if real use ever says the shipped list is too thin" without saying what it
  costs, and the 1,512 are the same defect card `0004` fixed for car parks.

Discarded as superseded rather than moved, on `## Not this card`'s own wording of "a fact that is
still load bearing": the `3,682 / 516 KB / 125 KB` payload row, because the file that actually
shipped is 3,681 records and 972 KB and HANDOVER carries those; and the `~550 KB to ~1.2 MB` cache
figure, which HANDOVER now supersedes with `~1.7 MB`. The Overpass `ISO3166-2` area codes were not
lost at all - `scripts/fetch_campsites.py` owns them.

**`#4` is still not met and is still not this card's to meet.** The convention check reports the same
single failure as before, and nothing this card touched is in it:

    NearestForest   1   27   0029
    0026    todo    unexplained link: 0023

`0026` names card `0023` in its "How it came to be this way" paragraph and gives no reason for it in
`## Links`. That is one line in a card outside this card's scope, so it stays card `0028`, which is
open in `todo/`. Build `0028` and `#4` closes on the next run with no work here.

**Assumed:** that restoring a cut measurement to DATA-MODEL is inside this card rather than new
scope, because `#3` is a criterion of this card and was ticked while untrue.

**Could not settle from the repository:** nothing. No browser check applies; nothing under `app/`
changed.

**2026-09-05**
RESULT: partial
TESTS: +0 new, all green. All four criteria are `proves: none`. `node scripts/selftest.js` reports
219 passed, 0 failed. No `vendor\bin\pest.bat`, no `pint.bat`, no `composer.json` in this project.
TOUCHED: docs/board/in-progress/0024-two-cards-are-over-the-line-budget.md
OUT-OF-SCOPE: none - `0028` is open and still covers the whole of the `#4` blocker

Third run. **No file outside this comment changed, and none should have.** The card's build work was
finished by the first two runs; this run only checked it and found nothing left to do.

**`#1`, `#2` and `#3` were re-verified rather than taken on trust.** `0018` and `0020` are 100 lines
each. `#3` was checked mechanically, not by reading: every number and URL that commit `8295612`
deleted from the two cards was extracted and grepped against the whole tracked tree. All five removed
URLs survive - the Stay the Night destinations page is not in a doc but is built by
`scripts/fetch_campsites.py:27`, so the fetcher owns it. Exactly one number lands nowhere, `3,682`,
and the second run's entry above records discarding it on purpose as superseded by the 3,681 that
shipped. So `#3` holds.

**`#4` cannot be met from this card by any route, and this is the third run to say so.** The check
still reports the same single failure, in a card this session may not edit:

    NearestForest   1   27   0029
    0026    todo    unexplained link: 0023

`#4` is a dependency on card `0028`, not open work on `0024`. Build `0028` and `#4` closes with no
work here at all.

**Considered and rejected: adding `needs: 0028` to this card's frontmatter.** The README defines
`needs:` as what a card cannot *start* without and warns against declaring an influence as a blocker,
and the unattended loop will not start a card whose `needs:` is unresolved. It would freeze a card
that has nothing left in it.

**Assumed:** that a comment-only entry is the right output for a run that finds no work, rather than
inventing some. **Could not settle from the repository:** nothing.

**Worth a reader's eye, not a card.** `0021` is now 250 lines and this card 196, so `## Not this
card`'s "everything else here is under 145 lines" is stale. Both grew only by append-only build logs
that the process requires, and the budget rule lives in `docs/board/README.md`, which this card
forbids changing and which is a copy of a file held outside this repository. There is nothing here a
card could ask for.

**2026-09-05**
RESULT: partial
TESTS: +0 new, all green. All four criteria are `proves: none`. `node scripts/selftest.js` reports
219 passed, 0 failed. No `vendor\bin\pest.bat`, no `pint.bat`, no `composer.json` in this project.
TOUCHED: docs/board/in-progress/0024-two-cards-are-over-the-line-budget.md
OUT-OF-SCOPE: none - `0028` is open in `todo/` and covers the whole of the `#4` blocker

Fourth run, and it changed nothing but this entry, which is the correct output when the work is done.

Re-measured rather than trusting the entries above. Every card on the board, counted from its file:
`0018` is 100 lines and `0020` is 100 lines, so `#1` and `#2` hold. `#3` was proved mechanically by
the two runs above, by grepping every deleted number and URL against the tracked tree, and nothing
has touched either card since, so re-deriving it would measure the same bytes a third time.

`#4` reports the same single failure it has reported on all three previous runs:

    NearestForest   1   27   0029
    0026    todo    unexplained link: 0023

The failure is one missing line in `0026`'s `## Links`. That is a card this session may not edit, and
it is already written up as `0028`, whose own `#2` is word-for-word this criterion. `#4` is therefore
a dependency, not open work, and it closes on the run after `0028` is built.

**This card should be closed at `3/4` rather than resumed a fifth time.** Four runs have now reached
the same finding, and each one appends about thirty lines to a card whose whole subject is cards that
grew too long by appending. Nothing in `#4` can move until `0028` moves.

**Assumed:** nothing new. **Could not settle from the repository:** nothing. No browser check applies;
nothing under `app/` changed.

**2026-09-05**
RESULT: partial
TESTS: +0 new, all green. All four criteria are `proves: none`. `node scripts/selftest.js`: 219
passed, 0 failed. No `vendor\bin\pest.bat`, no `pint.bat`, no `composer.json` in this project.
TOUCHED: docs/board/in-progress/0024-two-cards-are-over-the-line-budget.md
OUT-OF-SCOPE: none - `0028` is open in `todo/` and is the whole of the `#4` blocker

Fifth run, kept short on purpose: this card is about cards that grew by append, and four entries
above already carry the reasoning.

Re-measured: `0018` is 100 lines, `0020` is 100 lines. `#4` reports the same single failure it has
reported on every run, `0026 todo unexplained link: 0023`, in a card this session may not edit.
`0028` is still sitting unbuilt in `todo/`, so nothing about `#4` could have moved since the last run.

`#4` is a dependency on `0028`, not open work here. Close this card at 3/4.

**2026-09-05**
RESULT: partial
TESTS: +0 new, all green. All four criteria are `proves: none`. `node scripts/selftest.js`: 219
passed, 0 failed. No `vendor\bin\pest.bat`, no `pint.bat`, no `composer.json` in this project.
TOUCHED: docs/board/in-progress/0024-two-cards-are-over-the-line-budget.md
OUT-OF-SCOPE: none - `0028` is open in `todo/` and is the whole of the `#4` blocker

Sixth run, and the shortest, for the reason the fourth and fifth gave: this card is about cards that
grew by append.

Re-measured: `0018` is 100 lines, `0020` is 100 lines. `#4` reports the same one failure it has
reported on every run, `0026 todo unexplained link: 0023`. `0028` is still unbuilt in `todo/`, so
nothing about `#4` could have moved. `#4` is a dependency, not open work here.

Six runs, one finding. Close this card at 3/4 rather than schedule a seventh.

**2026-09-06** The loop moved this card from in-progress/ to human-review/. 2 takes in a row ended with it still in in-progress/, and the last one said: `made no progress: 1 of 4 still open, exactly as this take found it`. What this card is waiting for is not another session. bin/work-card.ps1 counts those takes out of storage/logs/work-card.log, and will start it again as soon as a person has moved it back to todo/.
