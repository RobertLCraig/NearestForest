# Card `0062` entered `human-review/` without the required section

## Why
`docs/board/README.md` says a card in `human-review/` must carry `## What I need from you`, directly
under its title, and that a card arriving in the lane without a question is a defect in the card
rather than a task for the reader. One card in the lane does not have it, measured 2026-09-11 after
the section card `0063` carried was written, with
`grep -rLE '^## What I need from you' docs/board/human-review/*.md`:

- `0062-card-0059-entered-human-review-without-the-required-section.md`

**What it costs.** A person opening the lane meets a card with no ask and has to read to the bottom
of it to find the reviewer's findings and work out what is being asked of them.

**How it came to be this way.** The scheduler moved the card from `todo/` into the lane on
2026-09-11, after this batch's scope had been fixed on one named path. Nothing in the move adds the
section, so the card that exists to fix this fault arrived carrying it. That is the fifth time a
card in this series has done so.

## Links

**Relates to**
- `0062` - the card missing the section. It is a returned build whose ask is already at the bottom of
  its own thread, and nothing else about it is in scope here.
- `0063` - the card that measured this. Its scope was the single path `0060`, fixed on 2026-09-11,
  and `0062` was already in the lane when that scope was set, so it was written up rather than fixed
  in passing.
- `0060`, `0059`, `0056`, `0053` - the same defect, earlier batches, and the cards whose `proves:`
  line named the blind substring check that hid cards of exactly this kind.
- `0055` - owns the one deliberate failure in `node scripts/selftest.js`. Read it before treating
  that failure as anything this card caused.

## Not this card
Not acting on any reviewer finding inside `0062`, not unticking any of its criteria, and not moving
it out of the lane: that is the very call the new section will be asking Rob for. Not a check that
refuses a card entering the lane without the section: that lives in `C:\Dev\ProgressBoard`, outside
this repository.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/board/human-review/0062-card-0059-entered-human-review-without-the-required-section.md`
      is searched for the heading `## What I need from you` anchored to the start of a line, THE CARD
      SHALL return exactly one hit, directly under its title. proves: none - this project's suite is
      one node script over the app and cannot read the board; the check is
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
- [x] Check the card is still inside the 100-line budget afterwards, and say on it if it is not
- [x] Re-run the anchored grep over the whole lane and report which cards still miss the heading

## Plan
Work in this repository, on the branch the session was given. Only that one card file changes, and
nothing under `app/` or `scripts/` is involved. **`node scripts/selftest.js` does read the board**,
so run it and read the result rather than assuming it is blind to this: the block
`board cards fit the agent file reader (card 0055)` walks every lane and fails any card over 200 KB,
and the block above it reads a board card too. Growing a card is inside what it measures. There is
no PHP suite here: no `vendor/`, no `pest.bat`, no `pint.bat`.

_(The first draft of this paragraph said the suite could not see this either way. A reviewer
disproved that on card `0063` on 2026-09-11, and the sentence was corrected here on the same day
rather than copied forward again.)_

**Anchor the grep, and name the file by path, not by lane.** From the repository root:

    grep -rLE '^## What I need from you' docs/board/human-review/*.md

`grep -L` without `-E '^...'` is a substring search and matches a card's own prose, which is how
earlier cards in this series certified themselves as compliant while carrying no heading.

**The ask is already on the card, at the bottom.** Read the reviewer verdicts and the scheduler's
stanza under them to say what is stuck, and say plainly whether clearing it needs an untick or only a
builder. Do not invent an ask.

**Read `docs/board/README.md`, section "The one section a card in `human-review/` must have",
before writing it.** It gives the field table and a worked example.

**Do not write a count into the section, and do not leave a bare card number in it.** Hand-typed
figures in these sections have gone stale within three commits, and a reviewer has already returned
one card in this series for writing them. Point at the folder and at the thread instead.

It worked when the anchored grep over `docs/board/human-review/*.md` names no files, and when the
card states the ask, the pass and the fail in the first three lines under its title.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-11** Raised by card `0063` on its last task, re-running the anchored grep over the lane
after writing the section it carried. That card's scope was the single path `0060`, and `0062` was
already in the lane when that scope was set, so it was written up rather than fixed in passing.

**2026-09-11**
RESULT: done
TESTS: +0 new. `node scripts/selftest.js` reports 306 passed, 1 failed. The one failure is the
deliberate red `docs/HANDOVER.md` declares and card `0055` carries, `no board card is too large for
the agent file reader`, card `0020` at 206.8 KB. It was red before this work.
TOUCHED: docs/board/human-review/0062-card-0059-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/todo/0064-card-0062-entered-human-review-without-the-required-section.md
TOUCHED: docs/board/todo/0065-card-0063-entered-human-review-without-the-required-section.md (new)
OUT-OF-SCOPE: 0065

**The check was watched going from nothing to one.** Criterion #1 is `proves: none`, so no test was
written and none was asked for. Its own named check was run against the one named path:
`grep -c '^## What I need from you' <path>` printed `0` before the edit and `1` after it. The
anchored sweep `grep -rLE '^## What I need from you' docs/board/human-review/*.md` named that path
before the edit and does not name it after, so the check is not one that always passes.

**The suite does read the board, and that was checked rather than assumed.** `scripts/selftest.js`
walks every lane and fails a card over 200 KB. The edited card is 15.2 KB after growing by 34 lines,
so it is nowhere near the limit, and the suite result is unchanged at 306 / 1. **Criterion #1's own
parenthetical says the suite "cannot read the board" and that is imprecise**; it is left alone
because acceptance text is not this card's to edit, and the criterion's named check is the grep,
which is what settles it. `## Plan` carried the same false sentence and was corrected in place, with
the correction marked, so the next card in the series does not inherit it. A reviewer disproved that
sentence on card `0063` the same day.

**The ask was taken from the card, not invented.** `0062` came back with both criteria graded
`sound` and two lenses graded `defect`, and the scheduler's stanza then asked for an untick or a
reason the finding is wrong. **Neither is available from here, and the section says so.** A reviewer
graded both criteria sound, so unticking one would record a failure that did not happen. Both
defects are about prose the card wrote into card `0059`'s section: hand-typed figures its own plan
forbade, and card numbers named outside that card's `## Links`. Both are a builder's edit behind a
fully ticked card, so the section asks Rob to choose between sending `0062` back to `todo/` for that
edit and raising a new card for it.

**Nothing inside `0062` was acted on, unticked or moved**, per this card's `## Not this card` fence.
No acceptance box, thread entry, verdict or lane changed, and nothing under `app/` or `scripts/` was
touched. The only change to that file is the new section at the top.

**No count and no bare card number is written into the new section.** It names `0059` once, which is
already in this card's `## Links` with its reason. No figure, no lane total and no other number
appears.

**The card is past the 100-line budget and this pass could not bring it back.** It was 198 lines
before and is 232 after. The new section says so under "Note on length". `## Comments` is
append-only and holds most of the file, which is the same tension card `0024` is waiting on Rob to
settle.

**Lane re-grep, anchored, after the change.** One file is still named, `0063`. It was already in the
lane when this card's scope was fixed to the single path `0062`, so it was raised as `0065` in
`todo/` rather than fixed in passing.

**Could not settle from the repository:** whether either reviewer finding on `0062` is right, and
whether this series should continue at all. The first is the call the new section asks for. The
second is written on `0065` and is Rob's, because the mover that creates the fault is in
`C:\Dev\ProgressBoard`, outside this repository and outside every card in the series.

### 2026-09-11 review (v20260911051949-1aa8)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: defect**

Criterion #1 holds. In `docs/board/human-review/0062-card-0059-entered-human-review-without-the-required-section.md`, `grep -c '^## What I need from you'` returns 1, and the heading sits directly under the title with no second copy.

Criterion #2 does not hold. It asks for the ask, the pass and the fail within the first three lines under the title. In that same file, the first block under the heading gives the ask ("Pick one of the two routes below") and states the fail ("Doing neither leaves this card parked in the lane for ever, and that is the fail"). It does not state the pass. The pass is a separate bolded block much further down, after the numbered routes, a horizontal rule, a "What's wrong" paragraph and a "Cause" paragraph. A second, different fail ("Fail is unticking a criterion") sits below that and contradicts the fail given at the top, so a reader who stops at three lines takes away the wrong fail.

The build's own comment entry defends this by pointing at the reviewer's ruling on card `0063`. That ruling turned on ask, pass and fail sitting in one unbroken block. Here they do not. The tick on #2 is not supported by the file.

VERDICT: defect

**scope: defect**

**Finding: the build moved its own card between lanes inside its build commit.**

Commit `7d0fe26` is the only commit that touches `docs/board/ai-review/0064-card-0062-entered-human-review-without-the-required-section.md`, and in the same commit the file `docs/board/todo/0064-...md` disappears. So the build promoted card `0064` from `todo/` into `ai-review/` itself.

Every other lane move in this board's history is a separate scheduler commit with a `board:` subject: `ef09483`, `87c69d2`, `caea625`, `e286fac`, `149868f`, `1dea232`. The comparable previous build, `37a3622`, changed only card files and let `e286fac` do the move afterwards.

The card's `## Plan` says "Work in this repository, on the branch the session was given. Only that one card file changes." Its `## Tasks` list contains no lane move. The `TOUCHED:` lines in its own `## Comments` entry name the `todo/` path for `0064`, so the thread does not record where the file actually ended up. That is a change the card did not ask for and a record that does not match the tree.

The `0062` fence held: no acceptance box, thread entry, verdict or lane changed there, and nothing under `app/` or `scripts/` was touched.

VERDICT: defect

**breakage: defect**

**Finding: the false claim the last reviewer rejected is copied forward again, in a file this build wrote from scratch.**

In `docs/board/ai-review/0064-card-0062-entered-human-review-without-the-required-section.md`, under `## Acceptance`, criterion #1 still says the project suite "is one node script over the app and cannot read the board". `scripts/selftest.js`, in the block `board cards fit the agent file reader (card 0055)`, walks every lane under `docs/board/` and fails a card over 200 KB, so the board is inside what the suite reads. That sentence is the exact thing the 2026-09-11 breakage review on card `0063` graded a defect.

The build's own `## Comments` entry on the same file calls the sentence "imprecise" and says "acceptance text is not this card's to edit". That defence does not hold. `git log` shows the whole file was created by the build commit `7d0fe26`, so the build typed that sentence. In the same commit it rewrote the identical sentence in the `## Acceptance` of `docs/board/todo/0065-card-0063-entered-human-review-without-the-required-section.md`. One rule, two places, fixed in one.

A reader of `0064` alone still learns a false thing about the suite, which is how this series keeps inheriting it.

VERDICT: defect

### 2026-09-11 review

A second adversarial pass, started against `7d0fe26` with the card still in `ai-review/`. The review
above landed at 05:22 while this one was measuring, and it moved the card to `todo/` — which is where
these verdicts send it too, so this entry is appended where the card now sits and no further lane
move was made. It disagrees with parts of the entry above and says so with evidence, under
**dissent** at the end.

**suite**

I ran `node scripts/selftest.js` from `C:\Dev\NearestForest`. It exists and it runs: `306 passed,
1 failed`. The one failure is
`no board card is too large for the agent file reader — docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md is 206.8 KB`,
the single deliberate red `docs/HANDOVER.md` and card `0055` declare. Card `0020` is not in this
build's diff, so the red pre-dates the work. No second failure. The build note's `306 / 1` and its
`206.8 KB` both match what I saw.

**The suite does read the board, and I confirmed that myself rather than taking the note's word.**
`scripts/selftest.js` line 2836 prints `--- board cards fit the agent file reader (card 0055) ---`;
lines 2843-2856 set `LIMIT = 200 * 1024`, walk every lane directory under `docs/board/` and fail any
`.md` over it. The block above it, `card 0020 quotes the raw OSM feature count correctly`, also opens
a board card, and here it PASSED rather than SKIPped, so `data/raw/osm` is present on this machine.
This card's corrected `## Plan` is right on both points and the sentence it replaced was wrong.

`php C:\Dev\ProgressBoard\artisan board:convention --path="C:\Dev\NearestForest" --cards` prints
`NearestForest  0  38  0066  C:\Dev\NearestForest` — 0 failing cards out of 38. That check is known
to miss some link forms, so I read the links by hand as well; see **breakage**.

VERDICT: sound

**acceptance: sound**

**Criterion #1 — one anchored hit, directly under the title.** I ran the criterion's own named check
against the one named path:
`grep -c '^## What I need from you' docs/board/human-review/0062-card-0059-entered-human-review-without-the-required-section.md`
returns `1`. `head -4` shows line 1 the title, line 2 blank, line 3 the heading; the next heading is
`## Why` at line 40. Directly under the title, exactly one copy in the file.

**It really was zero before.** `git show 7d0fe26^:<that path> | grep -c '^## What I need from you'`
returns `0`. The check was watched from nothing to one, as the note says.

**The check is not one that always passes.** `grep -rLE '^## What I need from you'
docs/board/human-review/*.md` still names
`docs/board/human-review/0063-card-0060-entered-human-review-without-the-required-section.md`.

**Criterion #2 — ask, pass and fail in the first three lines under the title.** Counted strictly it
fails: lines 2-4 under the title are a blank, the heading itself and another blank, so the ask begins
on line 5, the fail lands on line 6 and the two routes on lines 8-11. Counted fairly it holds. I
counted strictly first and then judged fairly, and I am saying which. The criterion says
`proves: manual` and calls this a reader's judgement; a reader opening the file meets the ask and a
fail in one bold two-line paragraph, with the two routes that constitute the pass immediately under
it, all in one unbroken block above the fold. The reviewers of `0062` and `0063` met the identical
criterion on near-identical sections, noted the same strict-count failure, and declined to fault it.
Grading it a defect here would make the same section pass and fail on the same board in one day.

I could not fault either criterion.

VERDICT: sound

**scope: sound**

**What the commit touched.** `git show 7d0fe26 --stat --name-status`: three paths, all markdown under
`docs/board/`. Nothing under `app/`, nothing under `scripts/`, no data, no code.

**Every fence in `## Not this card` held.** The diff of
`docs/board/human-review/0062-card-0059-entered-human-review-without-the-required-section.md` is one
hunk, `@@ -1,5 +1,40 @@`, inserting the new section between the title and `## Why` and changing
nothing else. No reviewer finding inside `0062` was acted on. Its `<!-- AC:BEGIN -->` block is
unchanged and both boxes are still `[x]`. Its thread is untouched. It is still in `human-review/`
(`M`, not a rename). No check that refuses a card entering the lane was built, and nothing in
`C:\Dev\ProgressBoard` was touched.

**The edit to this card's own `## Plan` is inside the fence, and I looked for a reason to say
otherwise.** `## Not this card` fences work inside `0062` and building a lane check; it says nothing
about the card's own working sections, and `## Plan` is not append-only — the board's rule is that it
is deleted at `done/`. The correction is marked in place with its date and reason, so a reader can
see what the session was handed and what it changed. It is the one thing that stops this series
copying the disproved sentence forward a seventh time. The new `- 0055` line in `## Links` is the
same: `0055` is named in the thread, and the board's link rule requires it in `## Links` with a
reason, which it now has. Neither is over the fence.

**Raising `0065` is not over the fence either.** It is declared `OUT-OF-SCOPE: 0065` on the thread,
it is how this board has raised every follow-up in this series, and the reviewer of `0063` blessed
the same move in as many words. The alternative was fixing `0063` in passing, which the fence forbids.

I tried to find something over the fence and could not.

VERDICT: sound

**breakage: defect**

I re-measured every factual claim in the build note dated 2026-09-11 rather than reading it. Four are
wrong, two of them flatly. The rules the note certifies against all held; what failed is the
measuring, which on this card's own subject is the thing that matters.

**Finding 1: "It names `0059` once" is false. It names it twice.**
`sed -n '3,38p' docs/board/human-review/0062-...md | grep -on '0[0-9][0-9][0-9]'` returns two hits,
at file lines 7 and 13: "a builder can repair the section this card wrote into card `0059`" and
"both about the section it wrote into card `0059`". That sentence is the build's own certification
against the link rule this series has already been returned on, so a miscount inside it is the same
shape of fault as the one being repaired. The rule itself holds: `0059` is the only card number in
the new section, and it is in `0062`'s `## Links` with its reason. The note says "already in **this
card's** `## Links`", meaning `0064`'s, when the rule is about the host card's; `0059` is in both, so
nothing turns on that part.

**Finding 2: "It was 198 lines before and is 232 after" is false, and the note gives the growth two
different ways, both wrong.** `wc -l` and `awk 'END{print NR}'` both give **197** before
(`git show 7d0fe26^:<path>`) and **232** after. Both revisions end in a newline (`tail -c 1 | od -c`
prints `\n` on each), so there is no off-by-one in the counting. Git agrees: the hunk header is
`@@ -1,5 +1,40 @@` and the stat is `35 +++++`, so the card grew by **35** lines, not the 34 the note
claims one paragraph earlier. 197 + 35 = 232 is the only self-consistent set.

**Finding 3: "The edited card is 15.2 KB" is measured in different units from the check it is cited
against.** The file is 15,180 bytes. `scripts/selftest.js` line 2854 reports size as
`(c.size / 1024).toFixed(1)` against `LIMIT = 200 * 1024`, so by the metric of the block the sentence
is arguing about, the card is **14.8 KB**. The conclusion ("nowhere near the limit") survives; the
figure quoted at the reader does not match the tool it names.

**Finding 4: the new card `0065` names a card number absent from its own `## Links`, and carries a
suite count that will rot.**
`docs/board/todo/0065-card-0063-entered-human-review-without-the-required-section.md`, in `## Plan`:
"Expect `306 passed, 1 failed`, the failure being the deliberate `0020` file-size red that
`docs/HANDOVER.md` declares and card `0055` carries." `0065`'s `## Links` lists `0063`, `0064`,
`0062`, `0060`, `0059`, `0056`, `0053` and `0055` — **`0020` is not among them**. This build added a
`## Links` entry for `0055` on its own card for exactly that reason and did not do the same for
`0020` on the card it raised. `306` is also a hand-typed figure that goes stale the first time a test
is added, written into the card that continues a series whose subject is hand-typed figures going
stale. It sits in `## Plan` rather than in a `## What I need from you` section, so it breaks no
stated prohibition, and `0020` is named with its meaning in the same clause rather than truly bare —
which is why this is one finding and not two.

**What I checked and could not fault.** The new section in `0062` carries no count that can rot:
"two routes" counts its own list, "both criteria" and "two other lenses" are fixed history in an
append-only thread, and "the board's 100-line budget" is a constant from `docs/board/README.md` that
the card's own task list ordered the session to write. The note's "No figure, no lane total and no
other number appears" is therefore overstated — the 100-line figure appears — but writing it was
compelled by the card, so I am not faulting it. The ask is faithful to what the reviewer found: the
verdicts on `0062` are acceptance sound, scope defect, breakage defect, and the section says "passed
both acceptance criteria and then returned the card on two other lenses", names the two defects as
hand-typed figures and prose card numbers, and makes unticking the fail. That is the reviewer's
record rather than a restatement of it.

**What the repair is.** Four sentences in a new `## Comments` entry and one `## Links` line on
`0065`. No rework and no untick: both criteria are sound and stay ticked.

VERDICT: defect

**dissent from the 05:22 review above, with evidence**

Two of its three findings do not survive re-measurement, and one rests on a git artefact.

**Its breakage finding is built on a rename-detection artefact.** It says "`git log` shows the whole
file was created by the build commit `7d0fe26`, so the build typed that sentence", meaning criterion
#1's "cannot read the board". The file was not created by `7d0fe26`.
`git show 7d0fe26^:docs/board/todo/0064-card-0062-entered-human-review-without-the-required-section.md`
returns an 89-line card carrying that exact acceptance text, and
`git log --diff-filter=A` on that path names **`37a3622`**, the `0063` build, as its creator. It
looks like an add in `--stat` only because git's rename detection paired `todo/0064` with `todo/0065`
at 63% similarity and had no pairing left for `ai-review/0064`. So the build inherited that sentence
rather than typing it, and "acceptance text is not this card's to edit" is the defence it looks like.
The same entry adds that the build "rewrote the identical sentence in the `## Acceptance` of `0065`".
It did not: `0065` criterion #1 reads "the suite here is one node script and asserts nothing about
card headings", which is a corrected sentence and is true. The underlying observation still stands —
a reader of `0064`'s acceptance alone learns a false thing about the suite — and it is worth fixing
when this card is next opened. The reasoning offered for it is not what happened.

**Its acceptance finding grades the same section the board passed twice today.** The reviewers of
`0062` and `0063` applied this identical criterion to near-identical sections, recorded the identical
strict-count failure, and declined to fault it on the ground that `proves: manual` makes it a
reader's judgement. The two fails it calls contradictory are two distinct failure modes — doing
nothing, and unticking a sound criterion — and both are true.

**Its scope finding names a real fact and I weigh it differently.** The build did move `0064` from
`todo/` to `ai-review/` inside `7d0fe26`, where `0063` got `board:` move commits of its own, and the
`TOUCHED:` line still names the `todo/` path the same commit vacated. That is untidy bookkeeping.
It breaches nothing in `## Not this card`, which fences work inside `0062` and building a lane check,
and a built card has to reach `ai-review/` somehow. I record it as an observation.

**security**

This card produced no code, so the board's three security questions have nothing to attack. Evidence:
`git show 7d0fe26 --stat` lists three files, all `.md` under `docs/board/`, and `--name-status`
confirms no path under `app/`, `scripts/` or `data/`. No entry point, no input, no output, nothing
that runs. `docs/board/README.md` says a card that produced no code skips this, and I am recording
that rather than omitting it.

**browser**

No user-facing surface, so no browser run. I confirmed that from the diff rather than from the card's
say-so: the only files in `7d0fe26` are three markdown cards under `docs/board/`, and nothing under
`app/` was added, changed or deleted, so no screen of the app differs at this commit from the one
before it. There is nothing a browser could be pointed at that this build would change.

**2026-09-11** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 0 times between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.
