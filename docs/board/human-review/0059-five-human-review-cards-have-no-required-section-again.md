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
- [x] #1 WHEN each of the five card files named above is searched for the heading
      `## What I need from you` anchored to the start of a line, THE CARD SHALL return exactly one
      hit, directly under its title. proves: none - this project's suite is one node script over the
      app and cannot read the board; the check is `grep -c '^## What I need from you' <path>` per
      file, run against the five paths rather than against a lane
- [x] #2 WHEN a reader opens any of the five, THE CARD SHALL state the ask, what a pass is and what
      a fail is, within the first three lines under the title. proves: manual - whether an ask is
      legible in three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [x] For each card, read its last comment entry and the review verdicts above it, and use the ask
      already there rather than inventing one
- [x] Write `## What I need from you` under each title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [x] Check each card is still inside the 100-line budget afterwards, and say on it if it is not
- [x] Re-run the anchored grep over the whole lane and report which cards still miss the heading

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

**2026-09-11** RESULT: done
TESTS: +0 new, all green apart from the one deliberate red (306 passed, 1 failed)
TOUCHED: docs/board/human-review/0011-security-response-headers.md
TOUCHED: docs/board/human-review/0012-close-the-open-tile-proxy.md
TOUCHED: docs/board/human-review/0053-card-0019-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/human-review/0054-the-campsite-cards-raw-feature-count-is-wrong.md
TOUCHED: docs/board/human-review/0056-eleven-more-human-review-cards-have-no-required-section.md
TOUCHED: docs/board/todo/0060-three-more-human-review-cards-have-no-required-section.md
TOUCHED: docs/board/todo/0061-card-0011-carries-two-comments-threads.md
TOUCHED: docs/board/in-progress/0059-five-human-review-cards-have-no-required-section-again.md
OUT-OF-SCOPE: 0060, 0061

**No test was written, and neither criterion asked for one.** `#1` says `proves: none` and `#2` says
`proves: manual`, so the test-first rule does not apply to either. **The harness cannot express `#1`
in any case**, and that is a statement about this repository rather than an excuse: the suite is
`node scripts/selftest.js` over `app/` and `scripts/`, and it does not read `docs/board/`. What was
done instead is the criterion's own named check, run before the change and watched at zero:

    grep -c '^## What I need from you' <path>   # all five read 0 before, 1 after

The suite was run anyway to show nothing broke: 306 passed, 1 failed. **The one failure is the
deliberate red** the brief names, `no board card is too large for the agent file reader`, card `0020`
at 209.8 KB. It was red before this work and is untouched by it. There is no PHP suite here, so
`.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.

Wrote `## What I need from you` directly under each of the five titles, taking the ask from the
scheduler's stanza and the `defect` verdicts already at the bottom of each card rather than inventing
one. **The five asks are not all the same shape, and saying which is which is the point of the
sections.** `0053` and `0056` need an untick: each reviewer disproved the criterion's named check, not
the work, so the criterion has to be rewritten. `0012` and `0054` need no untick at all: each finding
is a builder's fix behind a full set of ticked boxes, so the ask is to reopen the card, not to correct
it. `0011` is the one with two live routes, an untick of criterion #7 or a new card for the two loose
ends, and the section recommends the first and says so.

**Nothing inside the five was acted on, unticked or moved**, per this card's `## Not this card` fence.
No acceptance block, thread, verdict, lane, or file under `app/` or `scripts/` was changed.

**Two things were checked rather than copied.** `0056`'s reviewer named a second finding, a stale size
for `docs/HANDOVER.md` in card `0034`'s own ask; `0034` was corrected on 2026-09-10 and is in `done/`,
so the section says that finding is closed instead of repeating it. `0012` opens with a paragraph
saying nothing is waiting on Rob, which the 2026-09-11 return made false; the new section names it as
stale and leaves the paragraph as written, because editing this card's history is not this pass's job.

**No count was written into any section.** The five say "the folder" and "the thread" where an earlier
batch typed figures that were false three commits later.

**All five are past the 100-line budget and this card could not bring any of them back.** Each says so
in its own section. `## Comments` and `## Direction` are append-only and hold most of every file.

**Lane re-grep, anchored, at this commit.** `grep -rLE '^## What I need from you'
docs/board/human-review/*.md` names three files: `0019`, `0021` and `0058`. All three arrived in the
lane after this card was written, so no earlier card carries them. Raised as `0060` in `todo/`.
**`0019` is a shape nobody has raised before**: it had the section, Rob answered it on 2026-09-10, a
later session deleted the answered block, and the card then returned to the lane with nothing under
its title. That is written into `0060`'s `## Why` because it is a different failure from the
scheduler's move, and a check that only guards arrival will not catch it.

**One more fault, found and not fixed.** `0011` carries two `## Comments` headings, so its newest
entries sit in a second thread below a `## Direction` block and two review sections, and a reader who
finds the first heading reads four-day-old history with no sign the rest exists. Swept every lane:
`0011` is the only card with it. Raised as `0061` in `todo/`.

`php C:\Dev\ProgressBoard\artisan board:convention --path="$PWD" --cards` reports zero failing cards
on this worktree, with the two new cards in place.

### 2026-09-11 review (v20260911032733-24e6)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Checked each criterion myself against the files.

**Criterion #1 ÔÇö one anchored hit, directly under the title.** I ran `grep -c '^## What I need from you' <path>` on all five named paths. Each returns 1. I also read the head of each file: in `docs/board/human-review/0012-close-the-open-tile-proxy.md`, `0053-...`, `0054-...` and `0056-...` the heading is the line right after the `#` title; in `0011-security-response-headers.md` it follows the title, with only the YAML frontmatter above the title. No card has a second copy.

**Criterion #2 ÔÇö ask, pass and fail in the first three lines under the title.** Each section opens with one bold paragraph naming two routes and closing with "Doing neither is the fail". So the ask, the pass and the fail all sit inside the first three lines. Each then repeats them under explicit **Pass** and **Fail** labels lower down.

**Tried to break it.** The lane re-grep the card reports is honest: `grep -rLE '^## What I need from you' docs/board/human-review/*.md` names only `0019`, `0021` and `0058`, all raised as card `0060`.

One wrong sentence, not a criterion breach: `0053`'s section says card `0019` "carries its ask under its title". It does not, as the same grep shows.

VERDICT: sound

**scope: sound**

**Scope check, card 0059.**

The build is one commit, `2039b0c`. It touches the five named card files, the card's own file, and two new cards, `0060` and `0061` in `todo/`. Every other file in the branch summary (`0013`, `0019`, `0021`, `0036`, `0057`, `0058`) moved on separate lane-move commits made by the scheduler, not by this build.

The fence in `## Not this card` holds. No criterion was unticked on any of the five. No card was moved out of `human-review/`. No `## Comments`, `## Direction` or `## Decided` block was edited. Nothing under `app/`, `scripts/` or `docs/board/README.md` changed.

Nothing left half done. Each of the five now carries exactly one `^## What I need from you`, placed directly under the title and above `## Why`. Each also carries the over-budget note the third task asks for, including `0012`, whose note sits under "Note on length" in its new section. I re-ran the anchored grep over the lane and got the same three files the log names.

The two new cards are growth, but raising rather than fixing is this board's practice, and the log declares them out of scope.

I tried to find growth and a half-done edge, and found neither.

VERDICT: sound

**breakage: defect**

Finding, breakage lens.

**False claim written into `0056`'s new `## What I need from you`.** The section states "The eleven cards have since moved to other lanes, so the check passes because its subjects are absent", and "Strip the section out of all eleven today and it still reports a pass."

Two of the eleven that `0056` itself lists under its `## Why` are still in the lane: `docs/board/human-review/0032-handover-carries-a-self-test-count-nothing-re-measures.md` and `docs/board/human-review/0038-the-forestry-england-briefing-counts-predate-scotland.md`. Nine moved, two did not. So the stated reason is wrong for two subjects, and the "strip it and it still passes" sentence is false: those two are still measured by any lane-named check. The section is the one thing a person reads before unticking, so a wrong premise there steers the untick.

**Same section, self-falsifying sentence.** It says this card "carries the heading nowhere, so its own check would certify this card as compliant". This pass added the heading. The sentence is false as written the moment the file is saved. `0053`'s section carries the same sentence.

Everything else I attacked held: the five headings are present once each, `0011` is the only card with two `## Comments`, and the `tiles.php` claim in `0012` matches `readKey()` and `counterDir()`.

VERDICT: defect


**2026-09-11** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.
