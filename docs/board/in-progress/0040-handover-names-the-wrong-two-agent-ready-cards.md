# `docs/HANDOVER.md` names the wrong two agent-ready cards

## Why
Two places in `docs/HANDOVER.md` say two agent-ready cards are open and name them `0033` and `0034`:
the status block near the top, and the opening of "Blockers / open questions". Both are stale.
`0033` and `0034` are built and sit in `docs/board/ai-review/`. The cards actually open in
`docs/board/todo/` today are `0038` and `0039`.

What it costs. A fresh session reading the top of `HANDOVER.md` is pointed at two cards that are
already done, and is not told about the two that are waiting. `ls docs/board/todo` is the honest
count and disagrees with the file.

How it came to be this way. The sentence was written by card `0032` on 2026-09-06, when `0033` and
`0034` were the two it had just raised. `0038` and `0039` were raised later, and neither updated it.

## Links

**Relates to**
- `0037` - found this while correcting the `human-review/` count in the same file, and left it rather
  than fixing it in passing.
- `0032` - wrote the sentence that is now stale.

## Not this card
Not touching the `human-review/` count, which `0037` corrected. Not building a check that keeps
`HANDOVER.md` counts in step with the folders, which is a larger piece of work than this fault.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN a reader counts the agent-ready cards, THE HANDOVER SHALL name the same cards as
      `ls docs/board/todo`. proves: none - a card's lane is a folder and this project's suite is one
      node script over the app; the check is `ls docs/board/todo` read against both sentences in
      `docs/HANDOVER.md`
<!-- AC:END -->

## Tasks
- [ ] Run `ls docs/board/todo` and read the numbers off the folder
- [ ] Correct the sentence in the status block at the top of `docs/HANDOVER.md`
- [ ] Correct the same claim at the opening of "Blockers / open questions", including the clause that
      says what each of the two cards is about
- [ ] Say where `0033` and `0034` went, if the paragraph still needs to mention them

## Plan
Count the folder, never the prose. Both sentences carry a one-line summary of each named card, so
replacing the numbers alone leaves a description that belongs to the wrong card; write the summary
from what `0038` and `0039` actually say.

It worked when both sentences in `docs/HANDOVER.md` name exactly the cards in `docs/board/todo/`.

## Comments
**2026-09-06** Raised by card `0037` while it moved `0003`, `0017` and `0018` into `human-review/`.
`0037`'s scope was the person-waiting count in the same file, so this was left rather than fixed in
passing.
