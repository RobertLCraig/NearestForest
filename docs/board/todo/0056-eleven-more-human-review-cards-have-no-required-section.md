# Eleven more `human-review/` cards have no `## What I need from you`

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. Eleven cards in the lane do not have it, and no open card names
any of them:

- `0023-handover-is-too-big-to-load.md`
- `0026-scraped-at-says-the-parse-date-not-the-fetch-date.md`
- `0028-card-0026-links-0023-without-saying-why.md`
- `0031-handover-is-over-budget-again-and-0023-is-ticked-as-under.md`
- `0032-handover-carries-a-self-test-count-nothing-re-measures.md`
- `0034-the-no-caching-decision-rests-on-a-smaller-dataset.md`
- `0036-the-904-record-count-outlived-card-0016.md`
- `0038-the-forestry-england-briefing-counts-predate-scotland.md`
- `0040-handover-names-the-wrong-two-agent-ready-cards.md`
- `0041-handover-under-counts-the-human-review-and-ai-review-lanes.md`
- `0044-handover-says-one-agent-ready-card-is-open-and-names-a-card-that-has-moved.md`

The check is one line: for each file in the lane, does the text `## What I need from you` appear.

What it costs. These are the whole remaining backlog of the fault. Every earlier card in this series
fixed one or three cards and then reported the lane as nearly clean, so the size of the hole was
never on the board.

How it came to be this way. Each was moved into the lane by the scheduler. Nothing in the move adds
the section, so a card gains the lane's obligation without gaining the lane's shape. That is the
same cause `0045` to `0053` recorded for earlier cards. **The fix belongs at the move, in
`C:\Dev\ProgressBoard`, and not in this repository**; this card only clears the arrears here.

## Links

**Relates to**
- `0052` - the same defect on `0015`, which it fixed. It found these eleven while re-grepping the
  lane afterwards, which is `0052`'s own last task.
- `0045` to `0051`, `0053` - the same defect on earlier cards, each naming its own targets.

## Not this card
Not the cards `0045` to `0053` name. Not acting on any reviewer finding inside these eleven, not
unticking any criterion, and not moving anything out of the lane: that is the very call each new
section will be asking Rob for. Not a check that refuses a card entering the lane without the
section: that lives in `C:\Dev\ProgressBoard`.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN each of the eleven cards listed above is searched for the heading
      `## What I need from you`, THE CARD SHALL return a hit directly under its title.
      proves: none - this project's suite is one node script over the app and cannot read the board;
      the check is `grep -rL "## What I need from you" docs/board/human-review/*.md` naming none of
      the eleven
- [ ] #2 WHEN a reader opens any of the eleven, THE CARD SHALL state the ask, what a pass is and
      what a fail is, within the first three lines under the title. proves: manual - whether an ask
      is legible in three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [ ] For each card, read its last comment entry and any review verdict above it, and use the ask
      already there rather than inventing one
- [ ] Write `## What I need from you` under each title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [ ] Check each card is still inside the 100-line budget afterwards, and say on it if it is not
- [ ] Re-grep the lane and report which cards still miss the heading

## Plan
Work in the NearestForest repository. Only the eleven card files change; nothing under `app/` or
`scripts/` is involved, so `node scripts/selftest.js` cannot see this either way. Run it anyway to
show the change broke nothing.

**Each ask is already on its card, usually at the bottom.** Do not invent one. Read the last comment
entry first. Several of these are documentation-accuracy cards rather than returned builds, so the
ask will not be the "untick what the reviewer disproved" shape the earlier cards in this series
had; write the ask the card actually carries.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing them.** It gives the field table and a worked example.

**Watch the line budget.** A whole card fits in 100 lines, and the append-only `## Comments` and
`## Direction` threads may not be cut to make room. Where a card cannot be brought under, keep the
new section tight and say so on the card, as `0045` did for `0043`.

It worked when grepping `## What I need from you` across `docs/board/human-review/*.md` returns a
hit in all eleven, and when each states the ask, the pass and the fail in the first three lines
under the title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-09** Raised by card `0052` on its last task, re-grepping the lane after fixing `0015`.
`0051` reported on 2026-09-08 that only `0015` and `0019` were left, which was a miscount: the grep
run today names thirteen files, of which `0015` is fixed by `0052` and `0019` is carried by `0053`.
These eleven are the remainder and no open card named them.
