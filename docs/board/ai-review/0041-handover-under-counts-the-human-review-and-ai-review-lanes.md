# `docs/HANDOVER.md` under-counts the `human-review/` and `ai-review/` lanes

## Why
`docs/HANDOVER.md` says eight cards wait on a person and names them, in two places: the status block
near the top and the "Blockers / open questions" paragraph. Both list `0001, 0002, 0003, 0010, 0017,
0018, 0025, 0027`. `ls docs/board/human-review` gives eleven on 2026-09-06: those eight plus `0022`,
`0024` and `0030`.

The same file's "What's next" item 4 says `ai-review/` held **nineteen** cards on 2026-09-06, and
cites `ls docs/board/ai-review` as the honest count. That folder holds **twenty-seven** today.

What it costs. A person sweeping their own queue is told it is eight cards and finds eleven, so three
cards that need them are invisible until they open the folder. An agent picking the adversarial pass
sizes it at nineteen and meets twenty-seven. Both numbers are cited in the file as folder counts,
which is exactly what makes them trusted.

How it came to be this way. Card `0037` corrected the person-waiting count on 2026-09-06; cards moved
into both lanes after it, and no card since has re-read either folder.

## Links

**Relates to**
- `0040` - found this while correcting the agent-ready count in the same file, and left it rather
  than fixing it in passing.
- `0037` - wrote the eight-card sentence that is now stale.

## Not this card
Not touching the agent-ready sentences, which `0040` corrected. Not building a check that keeps
`HANDOVER.md` counts in step with the folders: this is the fourth card of this shape on this board
(`0031`, `0032`, `0036`, `0037`), and whether that check is worth building is a bigger question than
this fault.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN a reader counts the person's queue, THE HANDOVER SHALL name the same cards as
      `ls docs/board/human-review`. proves: none - a card's lane is a folder and this project's suite
      is one node script over the app; the check is `ls docs/board/human-review` read against both
      sentences in `docs/HANDOVER.md`
- [x] #2 WHEN a reader sizes the adversarial pass, THE HANDOVER SHALL give the same number as
      `ls docs/board/ai-review`. proves: none - same reason as #1; the check is
      `ls docs/board/ai-review | measure` read against "What's next" item 4
<!-- AC:END -->

## Tasks
- [x] Count both folders and read the numbers off them
- [x] Correct the count and the card list in the status block at the top of `docs/HANDOVER.md`
- [x] Correct the same claim at the end of "Blockers / open questions", including the bulleted list
      of cards below it, which describes only the eight
- [x] Correct the `ai-review/` figure in "What's next" item 4, and its date

## Plan
Count the folders, never the prose. The `human-review/` paragraph is followed by a bulleted list that
says what each card wants; adding three numbers to the count without adding their lines leaves a list
that no longer covers the lane. Write each new line from what that card actually asks for.

It worked when both `human-review/` sentences name exactly the cards in `docs/board/human-review/`,
and item 4's number equals the file count of `docs/board/ai-review/`.

## Comments
**2026-09-06** Raised by card `0040` while it corrected the agent-ready count in the same file.
`0040`'s scope was the `todo/` sentences, so this was left rather than fixed in passing.

**2026-09-07**
RESULT: done
TESTS: +0 new, all green. Both criteria are `proves: none`, so neither gets a test and the
test-first paragraph does not apply to them. The suite is `node scripts/selftest.js`: **227 passed,
0 failed**, the same count HANDOVER records for 2026-09-06, which is what a docs-only change should
do. There is no `vendor\bin\pest.bat`, no `pint.bat` and no `composer.json` in this project, so
neither could run.
TOUCHED: docs/HANDOVER.md
TOUCHED: docs/board/in-progress/0041-handover-under-counts-the-human-review-and-ai-review-lanes.md
TOUCHED: docs/board/todo/0042-two-different-cards-are-both-numbered-0022.md (new)
OUT-OF-SCOPE: 0042

**Both counts were read off the folders, never off the prose**, and both had drifted further than
this card measured. `human-review/` holds **eleven** on 2026-09-07, which matches what `## Why`
found: 0001, 0002, 0003, 0010, 0017, 0018, 0022, 0024, 0025, 0027, 0030. `ai-review/` holds
**twenty-nine**, not the twenty-seven `## Why` counted on 2026-09-06; `0039` and `0040` moved in
after this card was written. The number and the date in "What's next" item 4 are both taken from
this measurement.

**The three new lines were written from what each card actually asks for**, as `## Plan` required,
rather than from the count:

- **0030** wants the suite watched between 00:00 and 01:00 local under BST. Its build run
  reproduced the same clock divergence at 05:03 with a `TZ` override and said it would accept that,
  but that is not the check as written, so the line says both.
- **0024** is built to 3 of 4 and its last four run entries all ask to be closed there. Its open
  criterion depends on card `0028`, which is now built and in `ai-review/`, so the line says it may
  close with no work — and says the call is Rob's, because a session cannot make it.
- **0022** is unbuilt and the loop will not start it: all seven criteria are `proves: manual`, and
  it needs an authentication service the static Hostinger deployment cannot host.

**`0022` is two different cards, and that is card `0042`.** `ai-review/0022` is the footer credit;
`human-review/0022` is accounts and location tracking. Grouping every `docs/board/**/0*.md` by its
first four characters returns exactly that one collision and no other. I could not write this
card's own criterion #1 without naming a `0022`, and HANDOVER already says elsewhere that `0022` is
built and ships in the undeployed batch, so both new sentences carry a one-clause warning saying
which `0022` they mean. **That is the smallest thing that keeps #1 honest; the fix is `0042`, not
this card.**

**Assumed:** that "eight cards ... fit in one conversation" was a claim about the queue's size and
not part of the count, so it was rewritten rather than simply renumbered. Ten of the eleven are
still a conversation; `0022` is a build the size of the Campsites tab, and folding it in silently
would misdescribe the lane again in a new way.

**Could not settle from the repository:** nothing that blocked the work. Worth a reader's eye:
`docs/board/todo/` was empty when this ran, because this card was the only thing in it and the
scheduler had already moved it to `in-progress/`. The Blockers paragraph's "`ls docs/board/todo` is
the honest count: **0041**" therefore reads oddly today. That sentence is `0040`'s, which `## Not
this card` fences out, and it will read correctly again as soon as this card leaves `in-progress/`.
No browser check applies; nothing under `app/` changed. `board:convention` was not run: per this
board's own notes its `--path` resolves only under `C:\Dev`, so from a worktree it would measure the
main tree rather than this one.
