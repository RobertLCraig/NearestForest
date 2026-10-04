# The docs still say Forestry England will be asked about the name

## Why
**Three project docs still describe an enquiry that is not going to be sent.** On 2026-09-25 Rob
decided the email to Forestry England is purely informational and asks for nothing: no pitch, no
trade mark question, no introductions. The draft was rewritten to that shape on 2026-09-30
(`docs/outreach/forestry-england-enquiry.md`). The docs were not.

- `docs/PRD.md`, the struck "No App Store release" non-goal, ends "Card 0018 carries the trade mark
  question that gates a listing either way". It no longer carries it: the question is not asked.
- `docs/PRD.md`, the Licensing constraint, ends "the Forestry England name in an app store listing
  is a separate question and is card 0018". Same fault.
- `docs/DECISIONS.md`, entry `2026-08-15: The forest data is OGL-licensed...`, says the trade mark
  gap "is why the enquiry to Forestry England (card 0018) survives this finding". The 2026-09-25
  answer is recorded nowhere in DECISIONS.
- `docs/HANDOVER.md`, `## Blockers / open questions`, says of 0018 that "Rob is working this through
  with Cheryl" and that the no-ask direction applies "if taken". It was taken.

**What it costs.** A reader who trusts the PRD thinks a store listing waits on a reply from Forestry
England, and that nothing about the name can be settled until then. In fact the earlier DECISIONS
entry, `2026-08-15: ... (Licensing)`, already says how the name is handled without asking: do not
use "Forestry England" as the app's name or store title, describe it factually, carry a
non-affiliation line. With no ask going out, that rule is now the whole answer, and nothing says so.

## Links

**Relates to**
- `0018` - its 2026-09-25 answer, an email that asks for nothing, is the decision these docs do not
  yet record.
- `0027` - the send itself; it already carries the rewritten draft and is Rob's, so it is out of
  scope here.

## Not this card
Not the email: `docs/outreach/` is not touched. Not card `0027` or its stale `Blocked by` line,
which is card `0077`. Not resolving the App Store intent itself: the PRD keeps its strike-through and
the Apple half's own reason (no Mac, no developer account). Not editing or deleting any existing
DECISIONS entry, because that file is append-only. Not a store listing, and not any app change.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN `docs/PRD.md` is read, IT SHALL NOT say that card 0018 carries, or is, a trade mark
      question, and both places that did SHALL say the name is handled by the 2026-08-15 design-around
      rule with no enquiry. proves: none - prose; checked by the grep in `## Plan` returning no line
- [ ] #2 WHEN `docs/DECISIONS.md` is read, IT SHALL carry a new dated entry for 2026-09-25 saying the
      email asks for nothing, that no trade mark question goes to Forestry England, and that the
      2026-08-15 design-around rule therefore governs any listing; no earlier entry SHALL be edited.
      proves: none - prose; checked by `git diff` showing additions only in that file
- [ ] #3 WHEN `docs/HANDOVER.md` is read, ITS 0018 bullet SHALL be gone or say the decision is made,
      and its DECISIONS count in `## Sibling docs` SHALL match the file. proves: none - prose; checked
      by counting `^## 20` headings in DECISIONS against the number HANDOVER states
- [ ] #4 WHEN the work is done, THE SUITE SHALL be no worse than before it. proves: none - doc-only
      change; `node scripts/selftest.js` is run before and after and the failure count compared
<!-- AC:END -->

## Tasks
- [ ] Run `node scripts/selftest.js` and note the failure count before touching anything
- [ ] Rewrite the two 0018 sentences in `docs/PRD.md`
- [ ] Append the 2026-09-25 entry to `docs/DECISIONS.md`
- [ ] Update the 0018 bullet and the DECISIONS count in `docs/HANDOVER.md`
- [ ] Re-run the grep and the suite

## Plan
Work in the NearestForest repository, on whatever branch the session was given. Read
`docs/HANDOVER.md` first, then card `0018` (in `docs/board/`, any lane; find it with
`ls docs/board/*/0018-*`). Its `## Comments` entry dated **2026-09-25** opening `**Decided:**` is the
answer. Its 2026-09-20 entry explains why a no-ask email drops the App Store contradiction rather
than resolving it.

1. Find every line to change: `grep -n "0018" docs/PRD.md docs/DECISIONS.md docs/HANDOVER.md`.
   Today that is PRD line ~93 and ~157, DECISIONS line ~61 and ~195, and HANDOVER's 0018 bullet.
   **DECISIONS ~61 is about Scotland's email and is correct; leave it.** DECISIONS ~195 is inside an
   old entry: leave it too, and let the new entry supersede it.
2. Read the DECISIONS entry headed `2026-08-15` with the bullet "Do not use "Forestry England" as the
   app's name or store title". That is the rule the PRD should now point at. Copy its heading
   exactly when you cite it.
3. New DECISIONS entry: match the shape of the entries around it (`## date: title`, `**Decision:**`,
   `**Why:**`). Say what was decided, that it was Rob's call, that it supersedes the "enquiry
   survives" reasoning in the 2026-08-15 OGL entry, and that if a store listing is ever built the
   design-around rule is what it follows. Find where new entries go by reading the file's top: check
   whether it is newest-first or oldest-first before inserting.
4. Done looks like: `grep -n "0018" docs/PRD.md` prints nothing that calls 0018 a trade mark question,
   `git diff --stat` shows only the three docs, and the suite's failure count is unchanged.

**Question the builder answers by reading:** does `docs/HANDOVER.md` say "Twenty-two decisions"
anywhere other than `## Sibling docs`? Grep for it and change every copy.
