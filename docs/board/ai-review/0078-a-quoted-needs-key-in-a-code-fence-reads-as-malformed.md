# A quoted needs key in a code fence reads as malformed

## Why
**A card with no frontmatter that quotes a `needs:` line inside a code fence turns the suite red.**
In `scripts/selftest.js`, block `blockers outlive their answers (card 0070)`, the loose scan for a
`needs:` at column zero in the body reads the raw lines. The `**Decided:**` scan a few lines away
passes the text through `prose()` first, which cuts fenced and indented samples, for exactly this
reason. So quoting the frontmatter sample from `docs/board/README.md` reports
`carries a needs: line outside frontmatter`, which is false.

**What it costs.** If the quote lands in `## Comments`, the thread is append-only, so the red cannot
honestly be edited away. A suite that cries wolf on house style teaches the next session to skim
reds.

**How it came to be this way.** Card `0070`'s third build added `prose()` for the marker scan and
did not reuse it one key over. Its 2026-09-11 third review and its 2026-09-12 review both recorded
this in prose on that card's thread, and prose is not a card.

## Links

**Relates to**
- `0070` - owns the check. Its open criterion was a different fault, so this was left for its own card.

## Not this card
**Not the frontmatter parse.** Only the loose body scan changes.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN a card with no frontmatter quotes a `needs:` line inside a fenced or indented block,
      THE SUITE SHALL NOT report it, and a `needs:` at column zero in its prose SHALL still be
      reported. proves: `every needs: on this board can be read`
<!-- AC:END -->

## Plan
Run the loose scan over `prose(raw)` instead of `raw`. Keep the line number honest: `prose()` drops
lines, so either blank them instead of dropping them or report without a line number. Red-proof it
with a scratch card holding both shapes, one at a time.

## Comments

**2026-09-28** Raised by an unattended run of card `0070`.

**2026-10-14** RESULT: done
TESTS: +3 new, all green
TOUCHED: scripts/selftest.js
OUT-OF-SCOPE: none

The loose `needs:` scan for cards with no frontmatter now runs over `prose(raw)` (new helper `looseNeeds`). `prose()` now blanks fenced and indented samples instead of dropping them, so the reported line number stays the card's own; the `**Decided:**` scan reads the same result, and blank lines cannot match its marker.

Three fixtures in block `blockers outlive their answers (card 0070)` feed `every needs: on this board can be read`: a fenced sample (want none), an indented sample (want none), and a `needs:` in prose below a fence (want line 7, index 6). Watched red before the fix: `fixture with a fenced sample reads a loose needs: at 3, want -1`. The indented fixture was green before the fix too, because `^needs` never matched an indented line; it guards against regression and does not prove the fix.

Red-proof on the real board with scratch card `docs/board/todo/9999-scratch.md`, one shape at a time, and removed afterwards: a fenced `needs: 0025` under `## Comments` is red on the HEAD suite (`at line 6`) and green on the new one; a `needs: 0025` in prose is red on the new suite at `line 5`, which is its true line. The card file's contents were printed to confirm the fence was really there.

Suite: `node scripts/selftest.js`, 345 passed, 0 failed. Pest and Pint were not run: this project has no `vendor/` and no PHP suite. No browser check is needed; nothing under `app/` changed.
