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
- `0077` - owns `0027`'s stale `Blocked by` line, which `## Not this card` keeps out of this card.

## Not this card
Not the email: `docs/outreach/` is not touched. Not card `0027` or its stale `Blocked by` line,
which is card `0077`. Not resolving the App Store intent itself: the PRD keeps its strike-through and
the Apple half's own reason (no Mac, no developer account). Not editing or deleting any existing
DECISIONS entry, because that file is append-only. Not a store listing, and not any app change.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/PRD.md` is read, IT SHALL NOT say that card 0018 carries, or is, a trade mark
      question, and both places that did SHALL say the name is handled by the 2026-08-15 design-around
      rule with no enquiry. proves: none - prose; checked by the grep in `## Plan` returning no line
- [x] #2 WHEN `docs/DECISIONS.md` is read, IT SHALL carry a new dated entry for 2026-09-25 saying the
      email asks for nothing, that no trade mark question goes to Forestry England, and that the
      2026-08-15 design-around rule therefore governs any listing; no earlier entry SHALL be edited.
      proves: none - prose; checked by `git diff` showing additions only in that file
- [x] #3 WHEN `docs/HANDOVER.md` is read, ITS 0018 bullet SHALL be gone or say the decision is made,
      and its DECISIONS count in `## Sibling docs` SHALL match the file. proves: none - prose; checked
      by counting `^## 20` headings in DECISIONS against the number HANDOVER states
- [x] #4 WHEN the work is done, THE SUITE SHALL be no worse than before it. proves: none - doc-only
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

## Comments

**2026-10-05** RESULT: done
TESTS: +0 new, all green (doc-only card, every criterion proves: none; node scripts/selftest.js 345 passed 0 failed before and after)
TOUCHED: docs/PRD.md, docs/DECISIONS.md, docs/HANDOVER.md
OUT-OF-SCOPE: none

#1: both PRD sentences rewritten; `grep -n 0018 docs/PRD.md` prints nothing. Each now points at DECISIONS "2026-08-15: The full licence position, checked source by source" (heading copied exactly) and at the new 2026-09-25 entry.
#2: new entry `## 2026-09-25: The email to Forestry England asks for nothing, so the name is designed around`, inserted below the 2026-10-05 entry because the file is newest-first. It names Rob's call, supersedes the 'enquiry survives' line in the 2026-08-15 OGL entry, and says a listing follows the design-around rule. `git diff` on DECISIONS has additions only; DECISIONS 87 (Scotland) and 221 (old OGL entry) left as the Plan said.
#3: HANDOVER 0018 bullet removed and folded into the 0027 bullet as decided. `^## 20` count in DECISIONS is 24; Sibling docs now says Twenty-four. The card's question: HANDOVER said Twenty-three (not Twenty-two), in one place only.
#4: suite 345/0 before and after.
The brief's Pest/Pint step does not apply: this project has no PHP suite and no vendor/.

### 2026-10-05 review (v20261005194023-492e)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I tried to break each of the four criteria. I could not break any of them.

- **#1 (PRD):** I ran `grep 0018 docs/PRD.md` and it finds nothing. Both places now point to the DECISIONS rule "2026-08-15: The full licence position, checked source by source". That is in `docs/PRD.md`, at the "No App Store release" non-goal and at the Licensing constraint. The rule says: do not use the name, describe the app factually, and add a "not connected to Forestry England" line.
- **#2 (DECISIONS):** I found the new entry `## 2026-09-25: The email to Forestry England asks for nothing, so the name is designed around` in `docs/DECISIONS.md`. It says it was Rob's call. It says no trade mark question is sent. It replaces the "enquiry survives" reasoning in the older OGL entry. It says any store listing follows the design-around rule. The diff of that file has no removed lines, so no old entry was changed.
- **#3 (HANDOVER):** The 0018 bullet is gone. Its content now sits in the 0027 bullet and says 0018 is decided. The file has 24 `^## 20` headings. `## Sibling docs` says "Twenty-four". That is the only place the count appears.
- **#4 (suite):** I could not run anything, so I could not re-run the suite myself. The builder says 345 passed, 0 failed, before and after. This card only changed prose, so the suite has no way to see it.

The diff also has app and script changes for Wales (card 0116). They are not part of this card, so I did not judge them.

VERDICT: sound

**scope: sound**

I checked the card's own commit, `6e741d0`. It changes only `docs/PRD.md`, `docs/DECISIONS.md` and `docs/HANDOVER.md`. It does not touch `docs/outreach/`, card 0027, any app code or the data.

The big diff you were given (app, scripts, `sites.json`, other cards) comes from other commits in the same range. Those commits belong to other cards (0080 and the Wales work), so they are not this card growing out of scope.

- **PRD:** neither 0018 line is left. The PRD keeps the strike-through and the Apple reason. Both sentences now cite `2026-08-15: The full licence position, checked source by source`. That heading exists at that exact text.
- **DECISIONS:** the commit only adds lines. The new entry is `## 2026-09-25: ...`. The old entries are not edited. There are 24 `^## 20` headings.
- **HANDOVER:** the 0018 bullet is gone, and the 0027 bullet now says 0018 is decided. Sibling docs says "Twenty-four", which matches the file.
- **Suite:** I did not re-run it, because this is a doc-only change. The builder's log says 345 passed before and after.

Nothing is half done. Nothing goes over the "Not this card" fence.

VERDICT: sound

**breakage: sound**

I tried to break this card. I could not.

- **#1:** `docs/PRD.md` no longer says "0018". Both places that had the trade mark sentence now point to the 2026-08-15 design-around rule and to the new 2026-09-25 entry. That rule is: do not use the name, describe the app factually, say it is not affiliated.
- **#2:** `docs/DECISIONS.md` has the new 2026-09-25 entry. `git diff` shows no removed lines in that file, so no earlier entry was changed.
- **#3:** `docs/DECISIONS.md` has 24 `^## 20` headings. `docs/HANDOVER.md` says "Twenty-four" in `## Sibling docs`, and nowhere else. The 0018 bullet is gone. Its text is now in the 0027 bullet, and it says 0018 is decided.
- **#4:** This card changed only docs. I did not run the suite again. The builder reports 345 passed and 0 failed, before and after.

One thing does not fit. The diff stat also lists app and scraper files: the Wales data, `app/core.js` and `scripts/parse.py`. Those changes came from other cards on the same branch, not from this card. This card's own scope was the three docs, and those are clean.

VERDICT: sound

