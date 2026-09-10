# `docs/HANDOVER.md` names the wrong two agent-ready cards

## What I need from you

**ANSWERED 2026-09-10, and this card is closed.** Rob chose to have the brief fixed rather than
have the card reopened. What was done, and which change answered which card, is the last entry in
`## Comments`. Nothing below is still being asked.

**Untick criterion #1 and send this card back to `todo/`, or write a dated line on the thread saying
the reviewer is wrong.** Either one closes it. Doing neither leaves the card exactly here.

**What's wrong.** The card asks the brief to name exactly the cards that are ready for an agent to
pick up. It does not, and it did not on the day the card closed. As the tree stands now:

- The brief names `0045` as ready. `0045` is not in `todo/`. `todo/` holds `0055`.
- The brief says `0033` and `0034` are waiting for a review. Both are in this lane, waiting on you.
- The brief says three cards are ready, then lists six.

**Cause.** The card wrote a list of card numbers into the brief, and a list of numbers goes wrong
the moment anything moves. Card `0044` was raised to rewrite the same two sentences and its rewrite
is stale too, which is the clearest evidence that naming cards in prose cannot hold.

**Pass** is either of these:
- criterion #1 unticked and the card in `todo/`
- a dated line here saying why the reviewer is wrong

**Fail** is neither. The brief keeps pointing a fresh session at a card that is not there.

**Why it needs you.** Only you may untick a criterion. There is a second thing worth saying while
you are here, and it is the real fix: the brief should say **run `ls docs/board/todo`** rather than
carry a list. Say the word and a session will make that change on the card that goes back.

**Note on length.** This section takes the card past the 100-line budget. `## Comments` and the
review verdicts are append-only, so nothing here could be cut to make room.

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

### 2026-09-08 review (v20260908133410-397d)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: defect**

Card 0040 says both sentences would name exactly what `ls docs/board/todo` gives. In the tree today they do not.

- `docs/board/todo/` holds `0052`, `0053`, `0054`.
- `docs/HANDOVER.md`, status block near the top ("Three agent-ready cards are open"), names `0045` in `todo/`, plus `0021` and `0044`.
- `docs/HANDOVER.md`, opening of "Blockers / open questions", names the same set: `0045` in `todo/`, `0021` and `0044` in `in-progress/`.
- `0045` is in neither `todo/` nor any lane listing I read; `0021` is in `in-progress/`, so only that part still holds.

So criterion #1 cannot be traced to a true state of the file. A reader counting agent-ready cards is pointed at one card that is not there and told nothing about the three that are.

I can also see the card's own text was already overwritten: card `0044` (in `ai-review/`) rewrote both sentences to the `0045` wording, and that wording is now stale too. That is the same fault this card claims to have closed, which is evidence the fix did not hold, not evidence it was met.

The prose task about `0033`/`0034` is done: the paragraph says both are built and sit in `ai-review/`.

VERDICT: defect

**scope: defect**

Findings, in plain words.

**1. The change went far over the fence.** The card asked for two sentences in `docs/HANDOVER.md`, and nothing else. The recorded diff also adds `mapHint` in `app/core.js`, changes the marker credit in `app/map.js`, bumps `BUILD` in `app/core.js` and the cache name in `app/sw.js`, rewrites `scripts/parse_campsites.py`, adds ~253 lines to `scripts/selftest.js`, and regenerates `app/data/campsites.json`. None of that is in `## Tasks` or `## Acceptance`.

**2. It also edited the counts the fence names.** `## Not this card` says do not touch the `human-review/` count. The diff still edits `docs/DATA-MODEL.md`, `docs/PRD.md`, `docs/DECISIONS.md` and `docs/outreach/forestry-england-handover.md` record counts, which the card never asked for.

**3. It is half done now.** The status block in `docs/HANDOVER.md` names `0045`, `0021`, `0044`. `ls docs/board/todo` gives `0052`, `0053`, `0054`. The "Blockers / open questions" opening says the same wrong thing. The one criterion is false as the file stands.

VERDICT: defect

**breakage: defect**

**Finding ÔÇö `docs/HANDOVER.md`, "Blockers / open questions"**

Card 0040's task 4 was to say where `0033` and `0034` went. The sentence it wrote says both are "sitting in `ai-review/` for the adversarial pass". The folders say otherwise: `docs/board/human-review/0033-a-decision-card-nobody-can-see-sits-in-todo.md` and `.../0034-the-no-caching-decision-rests-on-a-smaller-dataset.md`. `ai-review/` holds neither. So the one claim of 0040's that survives in the file is false, and it points a fresh session at the wrong lane ÔÇö the exact fault the card was raised to remove, reproduced one lane over.

Both count sentences 0040 wrote (naming `0041`) have already been overwritten by card 0044, so nothing else of this work is left to break. Nothing in code depends on the file: `scripts/selftest.js` never reads `docs/`, so nothing catches this.

Also stale, same cause: the card's own log lists `TOUCHED: docs/board/in-progress/0040-...`, but the file is in `ai-review/`.

The lane claim is the fixable part. It was checkable with `find docs/board -name "003[34]*"` and was not checked.

VERDICT: defect


**2026-09-08** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 1 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 1 of 1 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-10** RESULT: closed by Rob's call, with the work done first.
TESTS: +0 new, all green (280 passed, 0 failed)
TOUCHED: docs/HANDOVER.md, plus docs/board/human-review/0010 and 0027, which took the folded facts
OUT-OF-SCOPE: none

**Rob's answer.** Five cards - `0023`, `0031`, `0040`, `0041` and `0044` - were all about
`docs/HANDOVER.md`, all ticked as fixed and all false. Asked whether to reopen them, replace them
with one card, or fix the brief now and close all five, he chose the third. This entry is the note
that says which change answered which card.

**Change 1: the brief now carries no card list and no card count.** That is the fix `0040`, `0041`
and `0044` each attempted by hand, and each went stale within a day because a list of card numbers
is wrong the moment anything moves. Three places carried one and all three now say to list the
folder instead: the status block at the top, the opening of "Blockers / open questions", and item 4
of "What's next". The bullets under Blockers stay, because they say what a card wants from a person,
which a folder listing cannot.

**Change 2: one more stale block folded out, and the brief is under budget.** That is `0023` and
`0031`. `docs/HANDOVER.md` went 42,299 bytes at the start of this session to **40,722**, under the
40,960 limit. Two blocks moved to the card that owns them, neither cut:

- the DNS measurement behind Rob not being able to send from `enhanceify.co.uk` went to card `0010`,
  which is the one card it blocks
- the shape of `docs/outreach/` and which screenshots go with the enquiry went to card `0027`, which
  is the card that sends it

Every removed string was grepped against the whole tree afterwards and each still has a home.

**Proved, not asserted.** The session-start hook was run by hand against this repository and no
longer reports the file as over budget, which is criterion #3 on both `0023` and `0031`.

**The tension, said out loud.** `docs/board/README.md` says nothing reaches `done/` without an
adversarial pass. These five go straight there on Rob's instruction, and the work was done by the
same session that is closing them, so the ticks record what that session did rather than what a
reviewer checked. The brief's size and its card lists are both checkable in one command each:
`Get-Item docs\HANDOVER.md` and `Select-String -Path docs\HANDOVER.md -Pattern '\b00\d\d\b'`.
