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

### 2026-10-15 review (v20261015000056-4985)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I tried to break the one criterion. I could not.

**#1: met.** The code is in `scripts/selftest.js`, in block `blockers outlive their answers (card 0070)`.

- **The fix.** The new helper `looseNeeds` reads `prose(raw)`, not the raw text. The no-frontmatter branch of the malformed scan now calls `looseNeeds(raw)`.
- **Fenced and indented samples.** `prose` blanks these lines. It does not drop them, so every line keeps its place. A quoted `needs:` in a fence or an indented block cannot match `^needs\s*:`.
- **A `needs:` in prose.** It is still found. The report says `loose + 1`, which is its true line in the file. The line count is correct because nothing was dropped.
- **Windows line endings.** The closing-fence match `[^\n]*` also takes a trailing `\r`, so CRLF files work.
- **The tests.** Three fixtures send their results into the `malformed` list. That list feeds `every needs: on this board can be read`. The three shapes are a fence (want -1), an indent (want -1), and prose below a fence (want 6). These match the criterion.

One small gap, and it does not fail the criterion. A fence that is never closed is not blanked, so a `needs:` inside it is still reported. The criterion only covers closed blocks.

The `**Decided:**` scan still works with the change. Blanked lines are empty, so they cannot match its marker.

VERDICT: sound

**scope: sound**

The card's own commit is `8b19fa7`, and it changes one file: `scripts/selftest.js`. The 60-file diff shown above covers a wider range of commits. The other 59 files come from other cards, not from this one.

What I checked:

1. **Fence ("Not this card").** The frontmatter parse does not change. Only the loose scan with no frontmatter now uses the new `looseNeeds`. The fence holds.
2. **The change to `prose()`.** It now blanks samples instead of dropping them. This also changes the input to the `**Decided:**` scan. The card's Plan allows this ("blank them instead of dropping them"). A blank line cannot match the `**Decided:**` marker, so that scan gives the same result. This is in scope.
3. **Half done?** Criterion #1 asks for two things: no report for a fenced or indented sample, and a report for a `needs:` in prose. Both have fixtures, and both feed `every needs: on this board can be read`. The line number stays correct because blanking keeps every line, and the fixture checks index 6. Nothing is left open.
4. **Extra work.** There is no new feature and no edit to another file.

I tried to find work outside the card, and I found none.

VERDICT: sound

**breakage: sound**

I tried to break the change. I could not.

- **`looseNeeds` in `scripts/selftest.js`:** The scan now reads `prose(raw)`. It no longer reads the raw lines.
- **`prose`:** It now blanks fenced and indented lines. It does not drop them. This keeps the line count, so `at line N` is still the card's true line.
- **Windows line ends (`\r\n`):** These still work. The fence regex lets `[^\n]*` take the `\r`, and `looseNeeds` splits on `\r?\n`.
- **The other caller, `settledWhere`:** It scans for `**Decided:**` and also reads `prose()`. A blank line cannot match `**Decided:**`, so this scan behaves the same as before.
- **Three test shapes:** The fixtures cover a fenced sample, an indented sample, and a `needs:` line in normal text below a fence. The last one checks the line number (index 6).
- **Frontmatter parse:** This code did not change. The card says it must not.

One small edge case remains. If a fence opens and never closes, `prose()` does not blank it, so a `needs:` inside it is still reported. Markdown treats such a block as code to the end of the file, so this report is wrong. No card on the board has an unclosed fence, and the criterion does not ask for this case. It is not a defect against #1.

VERDICT: sound

