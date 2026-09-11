---
needs: 0025
---
# Card 0020's thread has outgrown the reader that has to open it

## What I need from you

**One answer, and the suite is red until it comes.**

1. May the twenty near-identical run entries on card `0020` be pruned down to one paragraph?
   Yes / no.

---

**Why it is your call.** `docs/board/README.md` permits pruning a comment thread only when a person
decides to, so criterion #1 says `proves: manual` and no unattended run may close it.

**Why the suite is red.** Criterion #2 is built: `scripts/selftest.js` now fails if any card under
`docs/board/` is over the 200 KB whole-file read limit. The only card over it is `0020`, at
**209.8 KB**. The check is doing its job; the run reads:

```
FAIL  no board card is too large for the agent file reader
      — docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md is 209.8 KB
```

It goes green the moment `0020` is under the limit. No other card is near it.

**If yes, what gets cut.** The 20 entries that each open `RESULT: partial` and close on `#8 needs a
person`. What is worth keeping from them is the list of parser and fetcher faults they found and the
self-tests that now watch each one, which is a paragraph. Nothing is deleted until each entry's
measurements are checked against `docs/DATA-MODEL.md` and `docs/DECISIONS.md` and anything missing
is moved there first.

**If no,** the alternative is to raise the limit in the check, and that defeats the check.

## Why
**A session sent to work card `0020` cannot read the card.** On 2026-09-09 the file reader refused
it: `0020-campsites-tab-from-openstreetmap.md` is **208 KB, over the 200 KB whole-file limit**, so
the session gets a truncated view or has to page through 3,044 lines to find a 19-line acceptance
block. That is the opening cost of every run on the card, paid before any work starts.

**What it costs, measured on the file itself.** The card carries **21 dated entries**, and the last
20 all end with the same four words: `#8 needs a person`. Criterion #8 is the only one still open,
it says on its own face that only a person can close it, and none of the 20 runs could or did move
it. Each run instead added one self-test elsewhere in the pipeline and ~60 lines of prose about it,
so the thread grew by about 1,200 lines recording that nothing changed.

**How it came to be this way.** Criteria #1 to #7 were met on 2026-08-15. Nothing on the card told
the unattended loop to stop starting it, because `not_for_the_loop:` was never added, and the
scheduler reads unticked acceptance as work remaining. `docs/board/README.md` already names this
exact failure under `## Comments`: a card "something has been writing to without having anything new
to say", grown "too large for the agent file reader that had to open it", and it says the writer
upstream is the defect rather than the log.

## Links

**Blocked by**
- `0025` - it settles where a card's ask sits, and pruning a thread rewrites the card, so doing this
  first would produce a card that then has to be rewritten again.

**Relates to**
- `0020` - the card that is too large, and the source of the measurement above. Its frontmatter now
  carries `not_for_the_loop:`, which stops the growth but does not shrink what is already there.
- `0021` - the card-rewrite pass over this whole board. It fixes how cards read; this one is about a
  single card's size, and only a person may decide to prune a thread.

## Not this card
Not a general size limit on every card, and not a sweep of the board: one card is over, and a rule
written from one example is a rule nobody measured. Not deleting the thread. Not editing any of the
21 entries, which are append-only. Not re-opening or re-testing the Campsites tab, whose criteria #1
to #7 are met and watched by 279 self-tests.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN a session opens `docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md`,
      THE FILE SHALL be under the 200 KB whole-file read limit, with every measurement, decision and
      finding it carried still findable somewhere in the repository. proves: manual - only Rob may
      decide to prune a thread, per `docs/board/README.md`.
- [x] #2 WHEN the self-test suite runs, THE SUITE SHALL fail if any card under `docs/board/`
      exceeds 200 KB, so the next one is caught before a reader is. proves: `no board card is too
      large for the agent file reader`
<!-- AC:END -->

## Tasks
- [ ] Ask Rob to authorise the prune. The README permits it only when a person decides to.
- [ ] Before cutting anything, check each entry's measurement against `docs/DATA-MODEL.md` and
      `docs/DECISIONS.md`. What outlived a build belongs there, not on the thread. Move what is
      missing, then cut. Use the `check nothing was lost by diffing numbers` method: grep the
      deleted figures and URLs against the whole tree rather than reading the prose.
- [x] Add the size assertion to `scripts/selftest.js`, beside the other repository-shape checks.

## Plan
Stand in the NearestForest repository, on a branch of `main`. Run `node scripts/selftest.js` first;
it should print `279 passed, 0 failed` before you touch anything. There is no PHP suite here and no
`vendor/`, so `pest` and `pint` do not exist.

Measure before deciding what to cut:

    du -k docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md
    grep -c '^\*\*20' docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md

The 20 near-identical run entries are the weight. Each opens `RESULT: partial` and closes on `#8
needs a person`. What is worth keeping from them is the list of parser and fetcher faults they found
and the self-tests that now watch each one, which is a paragraph, not 1,200 lines.

It worked when `du -k` on that card prints under 200, the suite is green with the new assertion, and
a fresh `Read` of the card returns the whole file rather than the read-size hook's refusal.

## Comments

**2026-09-09** Raised by the twenty-first unattended run of card `0020`, which found the card
unreadable at its own session start and had no criterion left it could close.

**2026-09-11** RESULT: partial
TESTS: +1 new, red: `no board card is too large for the agent file reader`
TOUCHED: scripts/selftest.js, docs/board/in-progress/0055-card-0020-has-outgrown-the-agent-file-reader.md
OUT-OF-SCOPE: none

Built #2, left #1 open. #1 says `proves: manual` on its own face, and the README permits pruning a
thread only when a person decides to, so an unattended run may not close it. The ask is now at the
top of this card.

**The new check walks every lane folder under `docs/board/` and fails on any `.md` over 200 KB**
(204,800 bytes), naming each offender and its size in KB. It sits with the other repository-shape
checks, after the card `0020` raw-count check that already reads the board.

**Red-proof, three runs.** Written first, run first, and red on the real defect rather than on a
fixture: `306 passed, 1 failed`, naming
`docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md is 209.8 KB`. Then, to show it is
not a check stuck red, a scratch copy with `LIMIT` raised to 300 KB, patch confirmed present by
`grep -c` before running, gave `307 passed, 0 failed`. Then, to show it reads every lane and not
just the one the defect happens to sit in, a 320 KB scratch file dropped into `docs/board/done/` was
caught by that same 300 KB copy. Both scratch files were deleted and their absence checked.

**The suite is red at HEAD, on purpose, and only on this one assertion.** Criterion #2 is written as
"THE SUITE SHALL fail if any card exceeds 200 KB", and one card does, so the criterion is met by the
run being red. It turns green when `0020` is pruned, which is #1, which is Rob's. The alternative
was an exemption for `0020`, and a check with a hole cut in it for the only thing it catches is this
project's named recurring defect rather than a fix.

209.8 KB, not the 208 KB the Why section measured on 2026-09-09: the card took a further comment
entry in between. Both readings are over the limit and neither is wrong.

**What I could not settle from the repository.** Whether a pruned thread should keep its entry dates
as a one-line index, or collapse to a paragraph with no dates at all. The README says the writer
upstream is the defect and does not say what the remains should look like. Left for the prune.

**Not checked in a browser.** Nothing here reaches `app/`, so there is nothing to look at.

**2026-09-11** The loop moved this card from in-progress/ to human-review/ WITHOUT trying it. All 1 of its open acceptance criteria say proves: manual, so there is nothing left an unattended session could close and starting one would change nothing. Each open criterion names what to look at and what a pass is: tick what passes and move the card on, or say what failed and move it back to todo/.
