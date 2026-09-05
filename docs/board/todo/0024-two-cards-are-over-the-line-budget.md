# Cards 0018 and 0020 are two to three times the reader's line budget

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
- [ ] #1 WHEN `0018` is read, THE CARD SHALL be at or under 100 lines, or SHALL have been split into
      two cards each at or under 100 lines. proves: none - no check on this board reads card length
- [ ] #2 WHEN `0020` is read, THE CARD SHALL be at or under 100 lines. proves: none - as #1
- [ ] #3 WHEN either card is shortened, THE CARD SHALL keep every measurement, date, source and
      recorded decision, moving anything cut into the doc or the card that owns it. proves: none - as #1
- [ ] #4 WHEN the convention checks are re-run, THE BOARD SHALL still report zero open cards
      failing. proves: none - the command is in another repository, named in `## Plan`
<!-- AC:END -->

## Tasks
- [ ] Decide for `0018` whether it is one card that failed the cut test or two cards in one file
- [ ] Move the three cold reviews and the full ask menu wherever they belong, or cut them
- [ ] Cut `0020` back to the problem, the licence rule, the acceptance and the outcome
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
