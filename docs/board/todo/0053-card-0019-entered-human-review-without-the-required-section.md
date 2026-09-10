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

### 2026-09-09 review (v20260909033843-0f4c)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Reviewed against the two criteria only.

**Criterion #1** ÔÇö the heading `## What I need from you` is present in `docs/board/human-review/0019-use-forestry-englands-own-attribution-wording.md`, directly under the title `# Credit Forestry England the way they ask to be credited`, with only the frontmatter above the title. The lane re-grep confirms the card no longer appears in the miss list; eleven other cards do, and card `0056` in `todo/` carries them, matching what the build session reported.

**Criterion #2** ÔÇö the first paragraph under the heading states the ask ("Untick whichever criteria the reviewer disproved... or write on the thread that the reviewer is wrong"), both pass routes, and the fail ("Doing neither is the fail: it returns to this lane, unchanged, on the next run"). All three land in that one paragraph, before any of the supporting detail. The longer `**Pass**` and `**Fail**` blocks further down repeat it, they do not carry it alone.

I tried two ways to break it. First, whether the frontmatter pushes the heading away from the title: it does not, the heading is the first content. Second, whether a reader must scroll to learn the fail: they do not, the fail is in the opening paragraph.

The findings named in the section trace to real code, `build_dataset` in `scripts/parse.py` and `ok('attribution present', ...)` in `scripts/selftest.js`, so the ask is not describing something that does not exist.

VERDICT: sound

**scope: sound**

The card's own commit (123663d) touches only two files: card 0019 and card 0053. Everything else in the big diff belongs to earlier commits by other cards, not this one.

I checked the fence line by line.

- **Nothing acted on in 0019.** The commit adds 38 lines and deletes none from `docs/board/human-review/0019-use-forestry-englands-own-attribution-wording.md`. Its `## Acceptance` block, `## Comments` thread and verdicts are byte-identical.
- **No code touched.** `app/index.html` and the `attribution` string built by `build_dataset` in `scripts/parse.py` are untouched by this commit, which `## Not this card` demanded.
- **No lane move, no new check.** 0019 is still in `human-review/`. No entry-guard was added here, which the card said belongs in ProgressBoard.
- **The re-grep task is honest.** My own `grep -rL "## What I need from you" docs/board/human-review/*.md` returns exactly the eleven cards the comment names: 0023, 0026, 0028, 0031, 0032, 0034, 0036, 0038, 0040, 0041, 0044. Card 0056 in `todo/` already carries that list, so raising nothing new was right.
- **Over-budget was declared, not hidden.** The file is 234 lines and the new "Note on length" section says so, matching how 0045 and 0051 handled the same squeeze.

I tried to find growth over the fence and could not.

VERDICT: sound

**breakage: defect**

Findings under the breakage lens.

The added section in `docs/board/human-review/0019-use-forestry-englands-own-attribution-wording.md` now tells a person, at the top, that two credit lines are wrong and the card must go back to `todo/`. But `docs/HANDOVER.md`, in "What's next" item 1, still tells that same person to look at 0019 on a screen and then deploy `0004, 0015, 0016, 0019 and 0022` together, and "Built and not yet deployed, as one batch" still lists 0019 as build-complete. Both texts speak to the same reader about the same card and give opposite instructions. Before this change the ask was buried at the bottom of a 197-line card, so the clash was invisible; the change put it at the top and left the brief untouched. The build note does not name the clash, and no open card covers it: `0056` covers only the eleven missing-section cards, and `0040`, `0041` and `0044` cover card counts and agent-ready naming, not the deploy list.

Everything else checks out. The eleven-card re-grep matches `0056` exactly. The two findings the section restates are true against `app/index.html`, `build_dataset` in `scripts/parse.py`, and `ok('attribution present', ...)` in `scripts/selftest.js`.

VERDICT: defect

**2026-09-10** RESULT: done — the `breakage: defect` above is fixed.
TESTS: +0 new, all green (279 passed, 0 failed)
TOUCHED: docs/HANDOVER.md
OUT-OF-SCOPE: none

**The finding, restated.** Putting `0019`'s ask at the top of the card made a clash visible that had
been buried: `docs/HANDOVER.md` told the same reader, in two places, to deploy `0019` as part of a
five-card batch, while `0019` itself now asks Rob to untick what the reviewer disproved and send it
back to `todo/`. Two texts, one reader, opposite instructions.

**The fix, in `docs/HANDOVER.md` and nowhere else.** "What's next" item 1 now reads "deploy 0004,
0015, 0016 and 0022. 0019 is held out", names why in one clause (its footer wording would ship the
Scottish credit line wearing Forestry England's template and the retired `attribution` string in
`app/data/sites.json`), and points at `0019`'s own ask. The "Built and not yet deployed, as one
batch" bullet in `## Current state` drops `0019` from the batch and says it is built but held back,
waiting on Rob. `0022` stays in the batch and is called out as unaffected: it added one clause to the
car park sentence and neither reviewer finding touches it.

**Nothing in `0019` changed**, per this card's `## Not this card` fence. No criterion unticked, no
lane move, `app/index.html` and `scripts/parse.py` untouched. The diff for this fix is one file.

**No test, and none was possible.** Both criteria on this card are `proves: none` and
`proves: manual`; the suite is `node scripts/selftest.js` over `app/` and `scripts/` and cannot read
`docs/`. Run anyway to show nothing broke: 279 passed, 0 failed.

**`docs/HANDOVER.md` is still over the orient hook's budget** and this card did not make it worse.
It was 42,542 bytes at session start, 41,996 after a separate fold commit that removed two blocks
already owned by DATA-MODEL and DECISIONS, and 42,299 after this fix. Cards `0023` and `0031` in
`human-review/` carry the size problem; this card only had to stop the brief contradicting `0019`.

### 2026-09-10 review

**acceptance: defect**

**The work is done. The proof named for it is worthless, and that is the finding.** Both halves
matter, so take them in order.

**#1, the outcome — met, verified with a check that can actually fail.** The `proves:` line names a
plain substring search, so I used an anchored one per file instead:

    grep -c '^## What I need from you' docs/board/ai-review/0019-use-forestry-englands-own-attribution-wording.md
    1

It sits at line 6, under the title at line 4, with only the two-line frontmatter above it. Nothing
stands between a reader and the ask.

**#2, manual — met.** The first paragraph under the heading is "**One call.** Untick whichever
criteria below the reviewer disproved, so the card goes back to `todo/` ... **or** write on the thread
that the reviewer is wrong and the card stands. Doing neither is the fail: it returns to this lane,
unchanged, on the next run." Ask, both pass routes and the fail, in one paragraph, imperative, first.
That is the README's shape. The findings it restates trace to real code — `build_dataset` in
`scripts/parse.py` and `ok('attribution present', ...)` in `scripts/selftest.js` — so the ask is not
describing something that does not exist.

**Now the defect. Criterion #1's named check cannot fail, for two separate reasons.**

*It is vacuous.* The check is "`grep -rL "## What I need from you" docs/board/human-review/*.md` not
naming `0019`". `0019` is no longer in that folder — it is in `ai-review/`, moved by commit `9fcf175`.
The check therefore passes because its subject is absent, not because the section is present. I could
delete `## What I need from you` from `0019` right now and the named check would still report a pass.

*It is blind.* `grep -L` is a plain substring search and matches a card's own prose as readily as its
heading. Run both forms over the lane this card now sits in and they disagree:

    grep -rL "## What I need from you" docs/board/ai-review/*.md
      0005-deploy-via-cloudflare-and-hostinger-mcp.md
      0054-the-campsite-cards-raw-feature-count-is-wrong.md

    # anchored, per file: heading count == 0
      0005-deploy-via-cloudflare-and-hostinger-mcp.md
      0053-card-0019-entered-human-review-without-the-required-section.md
      0054-the-campsite-cards-raw-feature-count-is-wrong.md
      0056-eleven-more-human-review-cards-have-no-required-section.md

**This card is one of the two the substring search hides.** It mentions the phrase ten times and
carries the heading zero times, so its own check would certify it as compliant. That is not
hypothetical: the loop has moved returned cards into `human-review/` eleven times in this series
already, and if it moves this one there, the check this card wrote will report the lane clean while
the card sitting in it has no ask.

Sweeping the whole board, twelve cards mention the phrase without carrying the heading, and eleven of
the twelve are cards in this very series (`0045`–`0053`, `0056`). **The check is systematically blind
to exactly the cards this work produces.** Anchoring it — `grep -c '^## What I need from you'` per
file, or `grep -rLE '^## What I need from you'` — costs one character and removes the whole class.

That is a defect in the criterion, not in the build. A reviewer may not untick it, so it is recorded
here for a person.

**A second finding, independent, and a builder can fix it without any untick.** The board convention
checker fails this card:

    php C:\Dev\ProgressBoard\artisan board:convention --path="C:\Dev\NearestForest" --cards
    NearestForest   3   37   0057   C:\Dev\NearestForest
    0032    ai-review       unexplained link: 0029
    0038    ai-review       unexplained link: 0018
    0053    ai-review       unexplained link: 0019

`0019` is this card's whole subject and appears throughout its prose, and `## Links` lists `0045`–
`0052` but not `0019`. One line under `**Relates to**` clears it. Note the interlock: card `0028`'s
criterion #2 asks the board to report zero failing cards, and this card is one of the three holding
it false.

VERDICT: defect

**scope: sound**

The card's own commits, read separately from the branch:

    git show --stat 123663d   "say at the top of the attribution card what a person has to answer"
      0019-use-forestry-englands-own-attribution-wording.md | 38 +++
      0053-card-0019-entered-human-review-without-...       | 46 ++--

    git show --stat 3f2273a   "0053: stop the brief telling Rob to deploy 0019 while 0019 asks him not to"
      docs/HANDOVER.md | 13 ++--
      0053-card-0019-entered-human-review-without-... | 30 +++

`git show --name-only --format= <sha> | grep -E '^(app|scripts)/'` returns nothing for either.
`app/index.html` and the `attribution` string in `scripts/parse.py` are untouched, which is what
`## Not this card` demanded. `0019` gained 38 lines and lost none, so its `## Acceptance`, its thread
and its verdicts are intact — no criterion unticked, no lane move, no reviewer finding acted on.

The `docs/HANDOVER.md` edit in the second commit is beyond the Plan's "only `0019` changes", and it is
the right kind of beyond: it exists solely to close the 2026-09-09 `breakage: defect`, it is declared
on the thread, and it is thirteen lines. I am not counting a reviewer-ordered fix as scope growth.

VERDICT: sound

**breakage: sound**

The 2026-09-09 breakage finding was that `docs/HANDOVER.md` told Rob to deploy `0019` in a five-card
batch while `0019`'s new section asked him to hold it back. I checked the fix survived the brief's
later rewrite in `a0d9ff7`, which is where a fix like this usually dies:

    docs/HANDOVER.md:341
    1. **Look at 0004 on a screen, then deploy 0004, 0015, 0016 and 0022. 0019 is held out.**

It held, with the reason in the same item and `0022` explicitly called out as unaffected. `0019` is
also dropped from the "built and not yet deployed" batch at line 319. The two texts now agree.

`node scripts/selftest.js`: `280 passed, 0 failed`. It reads `app/` and `scripts/` and cannot see
`docs/board/`, so it proves this card broke no code — which it could not have, having touched none.

One piece of fresh drift, not this card's: lines 320 and 342 say `0019` "sits in `human-review/`", and
it is now in `ai-review/`. That was done by `9fcf175` after this card's work, and the brief's own rule
two hundred lines above tells the reader to `ls` the folder rather than trust a lane name.

**No UI surface.** Both commits change markdown only. There is no screen to drive and no screenshot to
take, and I am recording that as a claim rather than a step I skipped.

VERDICT: sound

