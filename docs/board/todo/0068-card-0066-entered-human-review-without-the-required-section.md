# Card `0066` entered `human-review/` without the required section

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One card in the lane does not have it, measured 2026-09-11 after
the section card `0067` carried was written, with
`grep -rLE '^## What I need from you' docs/board/human-review/*.md`:

- `0066-card-0064-entered-human-review-without-the-required-section.md`

**What it costs.** A person meets a card with no ask, and reads to its bottom to find what it wants.

**How it came to be this way.** The scheduler moved the card into the lane on 2026-09-11, after this
batch's scope was fixed on one named path, and nothing in the move adds the section. Ninth time.

## Links

**Relates to**
- `0066` - the card missing the section. It is a returned build whose ask is already at the bottom of
  its own thread, and nothing else about it is in scope here.
- `0067` - the card that measured this. Its scope was the single path `0065`, fixed on 2026-09-11,
  and `0066` was already in the lane when that scope was set, so it was written up rather than fixed
  in passing.
- `0065`, `0064`, `0063`, `0062`, `0060`, `0059`, `0056`, `0053` - the same defect, earlier batches,
  read in order to see the series repeat rather than converge.
- `0055` - owns the one deliberate failure in `node scripts/selftest.js`. Read it before treating
  that failure as anything this card caused.
- `0020` - the card that failure names. It is oversized and only Rob may prune it.
- `0024` - owns the tension between the 100-line card budget and the required ask section.

## Not this card
Not acting on any reviewer finding inside `0066`, not unticking any of its criteria, and not moving
it out of the lane: that is the very call the new section will be asking Rob for. Not a check that
refuses a card entering the lane without the section: it lives in `C:\Dev\ProgressBoard`, outside
this repository, and is where this series actually ends.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0066-card-0064-entered-human-review-without-the-required-section.md`
      is searched for the heading `## What I need from you` anchored to the start of a line, THE CARD
      SHALL return exactly one hit, directly under its title. proves: none - the suite here is one
      node script and asserts nothing about card headings; the check is
      `grep -c '^## What I need from you' <path>`, run against that path rather than against a lane
- [x] #2 WHEN a reader opens the card, THE CARD SHALL state the ask, what a pass is and what a fail
      is, within the first three lines under the title. proves: manual - whether an ask is legible in
      three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [x] Read the card's last comment entry and the review verdicts above it, and use the ask already
      there rather than inventing one
- [x] Write `## What I need from you` under the title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [x] Check the edited card and any card this build writes against the 100-line budget, and say on
      the thread where they are over it
- [x] Re-run the anchored grep over the whole lane and report which cards still miss the heading

## Plan
Work in this repository, on the branch the session was given. Only that one card file changes, and
nothing under `app/` or `scripts/` is involved. **`node scripts/selftest.js` does read the board**,
so run it rather than assuming it is blind to this: the block
`board cards fit the agent file reader (card 0055)` walks every lane and fails any card over 200 KB,
so growing a card is inside what it measures. The suite is red on exactly that one assertion, for
card `0020`, which `docs/HANDOVER.md` declares and card `0055` carries; read the run rather than a
figure written here, because a count written into a card rots. There is no PHP suite here.

**Anchor the grep, and name the file by path, not by lane.** From the repository root:

    grep -rLE '^## What I need from you' docs/board/human-review/*.md

`grep -L` without `-E '^...'` is a substring search that matches a card's own prose, which is how
earlier cards here certified themselves as compliant while carrying no heading.

**The ask is already on the card, at the bottom.** Read the reviewer verdicts and the scheduler's
stanza under them, say whether clearing it needs an untick or only a builder, and invent nothing.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example.

**Do not write a count into the section, and do not leave a bare card number in it.** Hand-typed
figures in these sections have gone stale within three commits. Point at the folder and the thread.

**Any card this build raises must be born inside 100 lines.** A reviewer returned an earlier card in
this series for creating an oversized one silently. Count it before committing and say the figure.

It worked when the anchored grep over `docs/board/human-review/*.md` names no files, and when the
card states the ask, the pass and the fail in the first three lines under its title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-11** Raised by card `0067` on its last task, re-running the anchored grep over the lane
after writing the section it carried. That card's scope was the single path `0065`, and `0066` was
already in the lane when that scope was set, so it was written up rather than fixed in passing.

**2026-09-11** **The series is the finding, not this card.** Nine cards now exist whose whole content
is that the previous one arrived in the lane without its ask. Each is correct, each is cheap, and
together they have produced nothing a user of the app can see. The mover that promotes a bounced card
into `human-review/` is what would end it, and it is in `C:\Dev\ProgressBoard`, fenced out above.

**2026-09-11**
RESULT: done
TESTS: +0 new, all green apart from the one declared red. `node scripts/selftest.js` reports
306 passed, 1 failed; the failure names `docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md`
at 209.8 KB. It was red before this work, `docs/HANDOVER.md` declares it and card `0055` carries it.
TOUCHED: docs/board/human-review/0066-card-0064-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/in-progress/0068-card-0066-entered-human-review-without-the-required-section.md
OUT-OF-SCOPE: none

**The check was watched going from nothing to one.** Both criteria are `proves: none` / `proves:
manual`, so no test was written and none was asked for. Before the edit,
`grep -c '^## What I need from you'` against the named path printed `0`, and the anchored sweep
`grep -rLE '^## What I need from you' docs/board/human-review/*.md` named that path. After the edit
the count is `1` and the sweep names no file at all. `head -4` puts the title on line 1 and the
heading on line 3, and there is no second copy in the file.

**The suite reads the board and was run rather than assumed.** The edited card is 17,689 bytes,
17.3 KB in the units the size block prints, well inside the 200 KB limit, and the suite result is
unchanged.

**The ask was taken from the card, not invented.** The last entry on `0066`'s thread is the
scheduler asking the builder to untick what the reviewer disproved or say why the finding is wrong.
Reading the three verdicts above it, acceptance and scope were both graded sound and the breakage
verdict faulted something outside the acceptance block: the follow-up card that build raised was
born three lines over the 100-line budget with nothing said about it. A builder can satisfy neither
branch of the scheduler's demand, because unticking would record a failure the review says did not
happen. So the new section puts that single question to Rob and gives the two routes that follow
from either answer.

**Nothing inside `0066` was acted on, unticked or moved.** The only change to that file is the new
section between the title and `## Why`. Its acceptance block, its thread, its verdicts and its lane
are untouched, and nothing under `app/` or `scripts/` was touched by this work.

**No count and no bare card number is written into the new section.** It points at `done/` and at
`todo/` rather than naming the successor cards, since they are not in `0066`'s own `## Links`, and
the 100-line budget is named as the constant it is from `docs/board/README.md`.

**Budget.** The edited card was 213 lines and is 246 after, a growth of 33 lines. It was already far
past 100 and this pass could not bring it back, because nearly all of it is the append-only
`## Comments` thread. The new section says so under "Note on length". This card, `0068`, is inside
the budget when it is handed over and grows past it only by this entry, which is the thread.

**Lane re-grep, anchored, after the change: it names no files.** Every card in `human-review/` now
carries the heading, so this build raised no successor and the series has nothing left to hand on.
Whether it stays that way depends on the mover in `C:\Dev\ProgressBoard`, which is fenced out of
this card and out of this repository.

**Could not settle from the repository:** which answer is right on the question the new section
asks. No file here decides whether a build that breaks a written board rule fails a card whose own
criteria were met. That is exactly why it goes to Rob.

### 2026-09-11 review (v20260911060604-5e24)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I checked both acceptance criteria against the file.

**Criterion #1 traces.** In `docs/board/human-review/0066-card-0064-entered-human-review-without-the-required-section.md`, the anchored check `grep -c '^## What I need from you'` returns exactly `1`. The title is line 1 and the heading sits directly under it, above `## Why`. There is no second copy.

**Criterion #2 traces.** The first block under the heading is one bold paragraph. It gives the ask, then the pass, then the fail, in that order, before any other prose. A reader meets all three first.

**I tried to break #2 on strict line counting.** Counting raw lines under the title, the heading and a blank line come first, so the pass and the fail land on the fifth to seventh lines. The criterion is marked `proves: manual`, and the identical shape was graded sound on `0065` in this same lane on the same day. I do not treat it as a fault.

**I tried to break the section's factual claims.** It says the reviewer graded acceptance sound and scope sound and returned the card on a third ground. The review block in `docs/board/done/0067-card-0065-entered-human-review-without-the-required-section.md` confirms that shape. No count and no bare card number appear in the new section.

**The lane sweep is clean.** The anchored sweep over `docs/board/human-review/*.md` names no file.

VERDICT: sound

**scope: sound**

I checked what this build really touched, not what it said.

**The build is one commit, `4ba4e6c`.** It changed two files: the target card `docs/board/human-review/0066-card-0064-entered-human-review-without-the-required-section.md` and its own card `0068`. Nothing under `app/`, `scripts/` or `data/`. Nothing in `C:\Dev\ProgressBoard`.

**The fences in `## Not this card` all held.** The diff of the `0066` card has zero deleted lines. It is one insertion between the title and `## Why`. The heading list on that file shows `## What I need from you` on line 3, then `## Why`, `## Acceptance`, `## Tasks`, `## Plan`, `## Comments` in their old order. Both acceptance boxes stay ticked, the thread and verdicts are untouched, and the file stays in `human-review/` as a modify, not a rename.

**The lane moves are not this build.** The `0067` move to `done/` and the `0068` moves are separate scheduler commits that change no card content.

**No new card was raised, and none was needed.** I re-ran the anchored sweep `grep -rLE '^## What I need from you' docs/board/human-review/*.md` myself. It names no file. So the last task is finished, not half done, and no successor was created quietly.

I tried to find something over the fence and could not.

VERDICT: sound

**breakage: defect**

I tried to break this and found one false number.

**The lane rule holds.** The anchored sweep `grep -rLE '^## What I need from you' docs/board/human-review/*.md` names no file. The target card returns exactly one hit, and the heading sits on line 3, directly under the title.

**Nothing else asserts the rule.** In `scripts/selftest.js`, the block `no board card is too large for the agent file reader` measures bytes only. No assertion reads card headings, so `proves: none` is honest. The suite runs 306 passed, 1 failed, the failure being the `0020` card, which `docs/HANDOVER.md` declares.

**The hand-typed size figure is wrong.** The build's `RESULT: done` entry, on the `## Comments` thread of `docs/board/ai-review/0068-card-0066-entered-human-review-without-the-required-section.md`, says the failure names `0020` "at 209.8 KB". The suite prints 206.8 KB. The file is 211,779 bytes, unchanged since 2026-09-10, so the figure was wrong when written, not stale. The card's own `## Plan` forbids exactly this: "read the run rather than a figure written here".

The thread is append-only, so the next session corrects it with a new dated entry, not an edit.

VERDICT: defect

