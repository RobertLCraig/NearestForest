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
- [ ] #1 WHEN a card with no frontmatter quotes a `needs:` line inside a fenced or indented block,
      THE SUITE SHALL NOT report it, and a `needs:` at column zero in its prose SHALL still be
      reported. proves: `every needs: on this board can be read`
<!-- AC:END -->

## Plan
Run the loose scan over `prose(raw)` instead of `raw`. Keep the line number honest: `prose()` drops
lines, so either blank them instead of dropping them or report without a line number. Red-proof it
with a scratch card holding both shapes, one at a time.

## Comments

**2026-09-28** Raised by an unattended run of card `0070`.
