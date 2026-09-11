# Eleven more `human-review/` cards have no `## What I need from you`

## What I need from you

**One call, and I would take the first.** Untick criterion #1 and send this card to `todo/`, so a
builder rewrites it, **or** write on this thread that the reviewer is wrong and the card stands.
Doing neither is the fail: it returns to this lane unchanged on the next run.

**What's wrong.** The eleven sections were written and the reviewer checked every one of them by
hand. What it disproved is the proof, not the work: criterion #1 names a check that cannot go red,
for two separate reasons.

1. It names a folder rather than the files. The eleven cards have since moved to other lanes, so the
   check passes because its subjects are absent. Strip the section out of all eleven today and it
   still reports a pass.
2. It is a loose text search, which matches a card's own prose as readily as a real heading. This
   card mentions the phrase many times over and carries the heading nowhere, so its own check would
   certify this card as compliant. That is not a thought experiment: this card is now sitting in the
   lane it was written to clear.

**Cause.** The criterion was written as a sentence, not as a check. Anchoring the search to the
start of a line, and naming the files by path, costs one character and closes both holes. Card
`0059` was raised with that shape and is the pattern to copy.

**Pass** is either of:
- criterion #1 unticked and the card in `todo/`, so a builder rewrites it to an anchored per-path
  check; or
- a line here saying the criterion stands as written, with the reason.

**Fail** is leaving both boxes ticked with the card in this lane.

**Why it needs you.** Only a person may untick a criterion, and a reviewer is forbidden from
touching acceptance, so nothing is open for an unattended session to pick up.

**The reviewer's second finding is already closed.** It said card `0034`'s own ask still quoted a
stale size for `docs/HANDOVER.md`. `0034` was corrected on 2026-09-10 and is in `done/`, so nothing
is left to do there.

**Note on length.** This card is past the 100-line budget and this section could not bring it back:
`## Comments` is append-only and holds most of the file.

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
- `0043` - the card `0045` could not bring back under the line budget after adding the section, and
  the precedent `## Plan` follows here when the same squeeze happens again.

## Not this card
Not the cards `0045` to `0053` name. Not acting on any reviewer finding inside these eleven, not
unticking any criterion, and not moving anything out of the lane: that is the very call each new
section will be asking Rob for. Not a check that refuses a card entering the lane without the
section: that lives in `C:\Dev\ProgressBoard`.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN each of the eleven cards listed above is searched for the heading
      `## What I need from you`, THE CARD SHALL return a hit directly under its title.
      proves: none - this project's suite is one node script over the app and cannot read the board;
      the check is `grep -rL "## What I need from you" docs/board/human-review/*.md` naming none of
      the eleven
- [x] #2 WHEN a reader opens any of the eleven, THE CARD SHALL state the ask, what a pass is and
      what a fail is, within the first three lines under the title. proves: manual - whether an ask
      is legible in three lines is a reader's judgement, not a string match
<!-- AC:END -->

## Tasks
- [x] For each card, read its last comment entry and any review verdict above it, and use the ask
      already there rather than inventing one
- [x] Write `## What I need from you` under each title, with the ask first and Pass / Fail / Why it
      needs you underneath
- [x] Check each card is still inside the 100-line budget afterwards, and say on it if it is not
- [x] Re-grep the lane and report which cards still miss the heading

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

**2026-09-10** RESULT: done
TESTS: +0 new, neither criterion asked for one, all green (280 passed, 0 failed)
TOUCHED: the eleven card files listed in `## Why`, and nothing else
OUT-OF-SCOPE: none

**No test was written and none was possible.** `#1` says `proves: none` and `#2` says
`proves: manual`, so the test-first rule does not apply to either. This project's suite is
`node scripts/selftest.js` over `app/` and `scripts/` and cannot read `docs/board/`. It was run
anyway to show nothing broke: 280 passed, 0 failed. There is no PHP suite here, so `pest` and `pint`
do not exist and were not run.

**`## Plan` was wrong about one thing, and it is worth recording.** It said several of these were
documentation-accuracy cards rather than returned builds, so the ask would not be the "untick what
the reviewer disproved" shape. All eleven are returned builds. Every one ends with the same
scheduler stanza, all eleven carry at least one `defect` verdict, and every one is stuck for the
same reason: a reviewer may not untick a criterion, so the card came back fully ticked and each
unattended run since has found nothing open and promoted it again. **The ask on each card is the one
already at its bottom**, not a new one.

**What differs between them is which finding is stuck, and that is what each new section says.**
Six were disproved on acceptance and ask for named criteria to be unticked: `0023` (#1 and #3),
`0031` (#1 and #3), `0040` (#1), `0041` (#1 and #2), `0044` (its one criterion), and `0038` (its
briefing numbers). Five passed acceptance and are held by a side effect the builder could not act
on, so each offers two routes with a recommendation: `0026` (`CLAUDE.md` still tells every session
to run a pipeline that now exits 1), `0028` (four correct edits outside the card's fence), `0032`
(three counts in the brief that other cards now carry), `0034` (a false size figure in its own log),
and `0036` (a new guard reading one of the four numbers in the comment it protects).

**Every count in the new sections was measured today, not copied.** `docs/HANDOVER.md` is 42,299
bytes; `human-review/` holds 42 cards; `ai-review/` holds 3; `todo/` holds `0055` and not `0045`;
`0033` and `0034` are both in `human-review/` and not `ai-review/`; `0020` is still in
`in-progress/`. Several of the eleven claimed different figures, and the sections say what is true
now rather than repeating what the card said.

**All eleven are over the 100-line budget and this card could not fix that.** They run from 160 to
236 lines. Between a half and two thirds of each file is `## Comments` and the review verdicts,
which are append-only, so there was nothing this card was allowed to cut. Each new section says so
in a closing "Note on length", as `0045` did for `0043` and `0051` did for `0014`.

**Nothing inside the eleven was acted on**, per `## Not this card`. No criterion unticked, no lane
move, no reviewer finding fixed. Each section only states the ask, the pass, the fail and why it is
Rob's.

**Lane re-grep, at this commit.** `grep -rL "## What I need from you" docs/board/human-review/*.md`
names no files. All 42 cards in the lane now carry the section, and the arrears this series has been
clearing one batch at a time since 2026-09-07 are cleared. **The fault itself is not fixed**: the
scheduler still moves a card into this lane without adding the section, so the twelfth card to
arrive will have the same defect. That fix belongs in `C:\Dev\ProgressBoard`, which is outside this
repository and outside this card.

### 2026-09-10 review

**acceptance: defect**

**The eleven sections exist. The check named to prove they exist cannot fail. Those are two separate
facts and both need saying, in that order, because the second one is not a complaint that the work is
missing.**

**#1, the outcome, met, and I verified it with a check capable of returning red.** The `proves:` line
names a plain substring search, which is the thing under attack here, so I anchored it and ran it per
file against wherever each of the eleven now lives:

    0023  lane=done       heading=1  titleline=1  headingline=3
    0026  lane=ai-review  heading=1  titleline=1  headingline=3
    0028  lane=ai-review  heading=1  titleline=1  headingline=3
    0031  lane=done       heading=1  titleline=1  headingline=3
    0032  lane=ai-review  heading=1  titleline=1  headingline=3
    0034  lane=ai-review  heading=1  titleline=1  headingline=3
    0036  lane=ai-review  heading=1  titleline=1  headingline=3
    0038  lane=ai-review  heading=1  titleline=1  headingline=3
    0040  lane=done       heading=1  titleline=1  headingline=3
    0041  lane=done       heading=1  titleline=1  headingline=3
    0044  lane=done       heading=1  titleline=1  headingline=3

All eleven, `^## What I need from you` at line 3, directly under the title at line 1. Not one is a
prose match. The substring check did not hide a miss among the eleven, and I want that on the record
before the rest, because the finding below is about proof and not about missing work.

I also swept the lane as it stands today, both ways, and both come back empty, seventeen cards in
`human-review/`, every one carrying the heading as a heading.

**#2, manual, met on the sample I read.** `0036` opens "**One choice, and I recommend the first.**"
then two numbered routes then `**What's wrong.**`; `0044` opens with an imperative untick-or-say-why
line. Ask first, imperative, inside three lines of the heading, with pass and fail underneath. The
README's shape.

**Now the defect, and it is in the criterion.**

*The named check is vacuous.* It reads "`grep -rL "## What I need from you" docs/board/human-review/*.md`
naming none of the eleven". **Zero of the eleven are still in `human-review/`.** Five went to `done/`
and six to `ai-review/` when commit `9fcf175` moved nineteen cards. The check therefore passes because
its subjects have left the folder, not because they carry the section. I could strip the heading out of
all eleven right now and the check would still report a pass. A criterion whose proof cannot go red is
the thing the board's own rule about `proves:` exists to prevent: "Naming the test is what makes a
criterion a check rather than a sentence." This one is a sentence.

*The named check is also blind, and I can show it live rather than argue it.* `grep -L` is a substring
search and matches a card's prose as readily as its heading. Run both forms over `ai-review/`, the lane
this card now sits in, and they disagree:

    grep -rL "## What I need from you" docs/board/ai-review/*.md
      0005-deploy-via-cloudflare-and-hostinger-mcp.md
      0054-the-campsite-cards-raw-feature-count-is-wrong.md

    # anchored: files where grep -c '^## What I need from you' == 0
      0005-deploy-via-cloudflare-and-hostinger-mcp.md
      0053-card-0019-entered-human-review-without-the-required-section.md
      0054-the-campsite-cards-raw-feature-count-is-wrong.md
      0056-eleven-more-human-review-cards-have-no-required-section.md

**This card is one of the two the substring search hides.** It says "What I need from you" eight times
and carries the heading zero times, so its own check certifies it as compliant. Sweeping the whole
board, twelve cards mention the phrase without carrying the heading, and eleven of those twelve are
cards in this series: `0045`, `0046`, `0047`, `0048`, `0049`, `0050`, `0051`, `0052`, `0053`, `0056`,
and `0042`. **The check is systematically blind to precisely the cards this work produces.**

That is not academic. The loop has moved a returned card into `human-review/` eleven times in this
series alone. The moment it moves this card or `0053` there, and both are returned builds sitting in
`ai-review/`, which is exactly the population it moves, the lane will contain a card with no ask, and
this card's own check will report the lane clean. The last line of `## Comments` above says "All 42
cards in the lane now carry the section", and it is that sentence, resting on that check, which is the
one a future reader should not trust.

Anchoring costs one character: `grep -rLE '^## What I need from you' docs/board/human-review/*.md`, or
`grep -c '^## What I need from you'` per file. That, plus naming the eleven files by path rather than
by lane, would make the criterion both honest and capable of failing.

**So: the work is sound, the criterion is not.** The fix is a criterion rewrite, which is a person's
untick, not a rebuild. A reviewer may not untick, so it is recorded here.

VERDICT: defect

**scope: sound**

The card's own commit is clean, and I read it rather than the branch:

    git show --stat c394e96   "0056: the last eleven human-review cards get their ask section"
      12 files changed, 396 insertions(+), 6 deletions(-)

Twelve markdown files: the eleven named in `## Why`, plus this card. Nothing else.
`git show --name-only --format= c394e96 | grep -E '^(app|scripts)/'` returns nothing. Each of the
eleven gained 29–34 lines and the deletions are all in this card's own checkbox lines.

I checked the fence line by line. No criterion unticked anywhere, the eleven `## Acceptance` blocks
are untouched. No lane move in this commit. No reviewer finding acted on. No entry-guard added, which
the card correctly said belongs in `C:\Dev\ProgressBoard`. The `## Plan`'s own admission that it was
wrong about these being documentation cards rather than returned builds is the right thing to have
written down.

VERDICT: sound

**breakage: defect**

`node scripts/selftest.js` prints `280 passed, 0 failed`, matching this card's log. It reads `app/`
and `scripts/` and cannot see `docs/board/`, so it proves the card broke no code, which it could not
have, having touched none.

**What broke is the durability of the eleven new sections, and it broke the same day.** The log above
says "**Every count in the new sections was measured today, not copied.**" It then lists six measured
figures. Three commits later, four of them are false:

| Written into the sections | True now | Changed by |
|---|---|---|
| `docs/HANDOVER.md` is 42,299 bytes | **40,722**, and under the 40,960 budget | `a0d9ff7` |
| `human-review/` holds 42 cards | **17** | `9fcf175` |
| `ai-review/` holds 3 | **17** | `9fcf175` |
| `0034` is in `human-review/` | it is in `ai-review/` | `9fcf175` |

The session that made those changes appended a correcting entry to the five sibling cards that had
landed in `done/`, `0023`, `0031`, `0040`, `0041` and `0044` all now carry "went 42,299 bytes at the
start of this session to **40,722**". It missed `0034`, which had gone to `ai-review/` instead. So
**card `0034`'s `## What I need from you` still tells Rob the brief "is 42,299 bytes today", when it is
40,722 and under budget**, and the whole ask on that card is premised on the brief being over. That is
a live, wrong instruction at the top of a card, and it is this card's to fix because this card wrote
it. One sentence in
`docs/board/ai-review/0034-the-no-caching-decision-rests-on-a-smaller-dataset.md`, no untick needed.

**The deeper finding is the pattern, not the one number.** Cards `0032`, `0040`, `0041` and `0044`
exist because `docs/HANDOVER.md` carried hand-typed counts that nothing re-measured. This card's fix
for eleven cards was to hand-type six more counts into each of them, sixty-odd unmeasurable numbers,
in a section that is not append-only and that a reader treats as current. The brief itself has since
gone the other way: `a0d9ff7` deleted every card list and count from it and told the reader to
`ls docs/board/human-review` instead. The sections would have been shorter and permanently true had
they done the same, and pointing at a folder costs a reader five seconds rather than a wrong decision.

**No UI surface.** This card's commit changes markdown only. There is no screen to drive and no
screenshot to take, and I am writing that down as a claim rather than skipping it.

VERDICT: defect

**2026-09-11** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.
