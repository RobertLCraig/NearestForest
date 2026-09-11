# Five `human-review/` cards have no `## What I need from you`, and two of them raised the fault

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. Five cards in the lane do not have it, measured 2026-09-11 with
`grep -rLE '^## What I need from you' docs/board/human-review/*.md`:

- `0011-security-response-headers.md`
- `0012-close-the-open-tile-proxy.md`
- `0053-card-0019-entered-human-review-without-the-required-section.md`
- `0054-the-campsite-cards-raw-feature-count-is-wrong.md`
- `0056-eleven-more-human-review-cards-have-no-required-section.md`

What it costs. A person sweeping the lane opens five cards and has to read to the bottom of each to
find out what is being asked. `0053` and `0056` are the sharpest case: each exists to give other
cards this section, and each is now sitting in the lane without one.

How it came to be this way. The scheduler moves a returned card into the lane and nothing in the
move adds the section, which is the same cause the whole `0045` to `0056` series recorded. Both
reviewers predicted this exact outcome in September: they measured that the earlier cards' named
check was a plain substring search, that it matches a card's own prose as readily as its heading,
and that it was therefore blind to precisely the cards that series produced. It has now happened.

## Links

**Relates to**
- `0056` - the previous batch, which cleared eleven cards and is itself one of the five here. Its
  review measured the blind check and named this as the next failure.
- `0053` - the same, one card earlier, and also one of the five. Its review carries the same
  measurement independently.
- `0011`, `0012`, `0054` - the other three cards missing the section. Each is a returned build whose
  ask is already at the bottom of its own thread.
- `0045`, `0052` - earlier cards in the same series, and the precedent for both the ask's shape and
  for declaring a card that cannot be brought back under the line budget.

## Not this card
Not acting on any reviewer finding inside the five, not unticking any criterion, and not moving
anything out of the lane: that is the very call each new section will be asking Rob for. Not
rewriting the earlier cards' `proves:` lines, which is a person's untick. Not a check that refuses a
card entering the lane without the section, and not the substring-versus-anchored grep fix in the
board tooling: both live in `C:\Dev\ProgressBoard`, outside this repository.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN each of the five card files named above is searched for the heading
      `## What I need from you` anchored to the start of a line, THE CARD SHALL return exactly one
      hit, directly under its title. proves: none - this project's suite is one node script over the
      app and cannot read the board; the check is `grep -c '^## What I need from you' <path>` per
      file, run against the five paths rather than against a lane
- [ ] #2 WHEN a reader opens any of the five, THE CARD SHALL state the ask, what a pass is and what
      a fail is, within the first three lines under the title. proves: manual - whether an ask is
      legible in three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [ ] For each card, read its last comment entry and the review verdicts above it, and use the ask
      already there rather than inventing one
- [ ] Write `## What I need from you` under each title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [ ] Check each card is still inside the 100-line budget afterwards, and say on it if it is not
- [ ] Re-run the anchored grep over the whole lane and report which cards still miss the heading

## Plan
Work in the NearestForest repository, on the branch the session was given. Only the five card files
change; nothing under `app/` or `scripts/` is involved, so `node scripts/selftest.js` cannot see this
either way. Run it anyway to show the change broke nothing. There is no PHP suite here: no `vendor/`,
no `pest.bat`, no `pint.bat`.

**Anchor the grep, and name the files by path, not by lane.** From the repository root:

    grep -rLE '^## What I need from you' docs/board/human-review/*.md

`grep -L` without `-E '^...'` is a substring search and matches a card's own prose, which is how the
earlier cards in this series certified themselves as compliant while carrying no heading. Naming the
lane rather than the paths is the other half: a card that leaves the lane makes the check pass by
being absent. Criterion #1 avoids both on purpose.

**Each ask is already on its card, at the bottom.** Do not invent one. All five are returned builds
that end with the scheduler's stanza saying a reviewer may not untick a criterion, so the card came
back fully ticked and every unattended run since has found nothing open. Read the `defect` verdicts
above that stanza to say which finding is stuck.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing them.** It gives the field table and a worked example.

**Do not write a count into a section.** The previous batch hand-typed six measured figures into
eleven cards and four were false within three commits. Point at the folder instead.

It worked when the anchored grep over `docs/board/human-review/*.md` names no files, and when each of
the five states the ask, the pass and the fail in the first three lines under its title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-11** Raised by card `0058` while adding `## Links` lines to nine cards. The anchored grep
was run over the lane to check that this card's own numbers were honest, and it named five files.
`0058`'s scope is `## Links` lines only, so this was written up rather than fixed in passing.
