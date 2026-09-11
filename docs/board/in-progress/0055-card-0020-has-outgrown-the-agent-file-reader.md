---
needs: 0025
---
# Card 0020's thread has outgrown the reader that has to open it

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
- [ ] #2 WHEN the self-test suite runs, THE SUITE SHALL fail if any card under `docs/board/`
      exceeds 200 KB, so the next one is caught before a reader is. proves: `no board card is too
      large for the agent file reader`
<!-- AC:END -->

## Tasks
- [ ] Ask Rob to authorise the prune. The README permits it only when a person decides to.
- [ ] Before cutting anything, check each entry's measurement against `docs/DATA-MODEL.md` and
      `docs/DECISIONS.md`. What outlived a build belongs there, not on the thread. Move what is
      missing, then cut. Use the `check nothing was lost by diffing numbers` method: grep the
      deleted figures and URLs against the whole tree rather than reading the prose.
- [ ] Add the size assertion to `scripts/selftest.js`, beside the other repository-shape checks.

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
