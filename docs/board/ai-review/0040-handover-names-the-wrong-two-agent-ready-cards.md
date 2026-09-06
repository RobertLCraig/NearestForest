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
- [x] #1 WHEN a reader counts the agent-ready cards, THE HANDOVER SHALL name the same cards as
      `ls docs/board/todo`. proves: none - a card's lane is a folder and this project's suite is one
      node script over the app; the check is `ls docs/board/todo` read against both sentences in
      `docs/HANDOVER.md`
<!-- AC:END -->

## Tasks
- [x] Run `ls docs/board/todo` and read the numbers off the folder
- [x] Correct the sentence in the status block at the top of `docs/HANDOVER.md`
- [x] Correct the same claim at the opening of "Blockers / open questions", including the clause that
      says what each of the two cards is about
- [x] Say where `0033` and `0034` went, if the paragraph still needs to mention them

## Plan
Count the folder, never the prose. Both sentences carry a one-line summary of each named card, so
replacing the numbers alone leaves a description that belongs to the wrong card; write the summary
from what `0038` and `0039` actually say.

It worked when both sentences in `docs/HANDOVER.md` name exactly the cards in `docs/board/todo/`.

## Comments
**2026-09-06** Raised by card `0037` while it moved `0003`, `0017` and `0018` into `human-review/`.
`0037`'s scope was the person-waiting count in the same file, so this was left rather than fixed in
passing.

**2026-09-06** RESULT: done
TESTS: +0 new, all green (227 passed, 0 failed, `node scripts/selftest.js`)
TOUCHED: docs/HANDOVER.md
TOUCHED: docs/board/in-progress/0040-handover-names-the-wrong-two-agent-ready-cards.md
TOUCHED: docs/board/todo/0041-handover-under-counts-the-human-review-and-ai-review-lanes.md
OUT-OF-SCOPE: 0041

**The folder had moved on again since this card was written.** `docs/board/todo/` did not exist at
all when I opened it: `0038` and `0039` are built and sit in `ai-review/`, so the honest count on
arrival was zero agent-ready cards, not two and not the `0038`/`0039` this card's `## Why` predicted.
I counted the folder rather than trusting the card, which is what its own `## Plan` says to do.

Then raising the out-of-scope card put a file back in `todo/`, so the count I had just written was
wrong again by my own hand. Both sentences now name **`0041`** and nothing else, which is what
`ls docs/board/todo` gives. A later card landing in `todo/` breaks these sentences the same way; that
is the standing fault this board keeps re-raising, and `0041`'s `## Not this card` says why a check
for it is a bigger question than any one of these cards.

No test. The criterion is `proves: none` and says why: a card's lane is a folder, and this project's
suite is `node scripts/selftest.js` over the app, which knows nothing about `docs/board/`. I ran it
anyway to show the docs edit broke nothing: 227 passed, 0 failed. There is no PHP suite here, so
`.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat` do not exist and were not run.

I left the `human-review/` and `ai-review/` counts alone, as `## Not this card` requires. Both are
stale — the file says eight person-waiting cards and names eight, the folder holds eleven; it says
nineteen in `ai-review/`, the folder holds twenty-seven. That is card `0041`.
