# `docs/HANDOVER.md` under-counts the `human-review/` and `ai-review/` lanes

## What I need from you

**ANSWERED 2026-09-10, and this card is closed.** Rob chose to have the brief fixed rather than
have the card reopened. What was done, and which change answered which card, is the last entry in
`## Comments`. Nothing below is still being asked.

**Untick criteria #1 and #2 and send this card back to `todo/`, or write a dated line on the thread
saying the reviewer is wrong.** Either one closes it. Doing neither leaves the card exactly here.

**What's wrong.** The card asks the brief to state two lane counts truthfully, and both are wrong
again. Counted today:

- The brief says **eleven** cards wait on you. The folder holds **42**.
- The brief says the review queue holds **twenty-nine** cards. The folder holds **3**.

The brief prints the exact command that disproves each one right beside it, which makes it worse
than a bare number: a reader trusts a figure that cites its own check.

**Cause.** The counts were written on 2026-09-07 and the lanes have moved every day since. The
review queue number was also one out on the day it was written, because it counted a placeholder
file that is not a card.

**Pass** is either of these:
- criteria #1 and #2 unticked and the card in `todo/`
- a dated line here saying why the reviewer is wrong

**Fail** is neither. The counts stay wrong, the boxes stay ticked, and the loop promotes the card
again on the ticks.

**Why it needs you.** Only you may untick a criterion. The fix that would actually hold is to stop
writing counts into the brief and tell the reader to run the listing instead. That trades a number
you can read at a glance for one you have to go and get, and which you prefer is a preference.

**Note on length.** This section takes the card past the 100-line budget. `## Comments` and the
review verdicts are append-only, so nothing here could be cut to make room.

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

### 2026-09-08 review (v20260908140226-7272)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: defect**

I counted the folders, then read the file.

**Criterion #1 fails.** `docs/HANDOVER.md`, the status block ("Eleven cards wait on a person...") and the Blockers paragraph ("`ls docs/board/human-review` on 2026-09-07 gives ...") both name eleven cards: 0001, 0002, 0003, 0010, 0017, 0018, 0024, 0025, 0027, 0030, 0043. `ls docs/board/human-review` gives **thirty-seven**: those eleven plus 0004, 0006, 0008, 0009, 0011, 0012, 0013, 0014, 0015, 0016, 0019, 0023, 0026, 0028, 0031, 0032, 0033, 0034, 0035, 0036, 0037, 0038, 0040, 0045, 0046, 0051. That is not later drift by another card: the same change set under review is what moved most of them (the diff creates `docs/board/human-review/0006-...`, `0008-...`, `0012-...`, `0013-...`, `0014-...` and more). The reader is told eleven and finds thirty-seven, which is a bigger version of the exact fault the card exists to fix.

**Criterion #2 fails.** `docs/HANDOVER.md` "What's next" item 4 says "twenty-nine cards on 2026-09-07". `ls docs/board/ai-review` gives **eight**. Same change set: it deletes `ai-review/0006`, `0008`, `0012`, `0013`, `0014`, `0020`.

Both numbers are cited in the file as folder counts, so both are trusted and both are wrong.

VERDICT: defect

**scope: defect**

**Scope: the fence held.** The commit that built this card is `d0336e4`, touching only `docs/HANDOVER.md`, its own card file, and new card `0042`. The agent-ready sentences that `## Not this card` fences off are untouched. Raising `0042` is declared on the card and is normal board practice, not silent growth. No app, script or data file moved in that commit; the large diff shown to me is other cards' work, not this one's.

**One thing left half done.** In `docs/HANDOVER.md`, "What's next" item 4 now says `ai-review/` held **twenty-nine** cards. At that commit the folder held **28** card files plus a tracked `.gitkeep`. The count includes the placeholder, so it counts a non-card as a card. A reader sizing the adversarial pass is told 29 and meets 28 ÔÇö the same off-by-count fault the card exists to remove, just smaller. The `human-review/` sentences escape this because they enumerate names rather than count files.

Fix is one word in item 4, plus stating that the count is `*.md` files, not folder entries.

VERDICT: defect

**breakage: defect**

Found one thing that is wrong.

**Finding ÔÇö `docs/HANDOVER.md`, "What's next" item 4.** It says `ai-review/` held **twenty-nine** cards on 2026-09-07 and calls `ls docs/board/ai-review` "the only honest count". At the card's own commit (`d0336e4`) that folder held **28 card files plus a `.gitkeep`**. The build counted the placeholder as a card. `ls docs/board/ai-review | measure`, the exact check the card's criterion #2 names, returns 28, not 29. So the sentence fails the check written to prove it, and it fails in the direction the card exists to stop: a sized queue that does not match the folder.

The same trap does not hit the human-review number: that folder has no `.gitkeep`, so eleven is right, and the eleven bullets below the "Blockers" paragraph do cover all eleven cards.

Nothing else the change touched went stale by it. Later drift in both lanes comes from cards `0021`, `0045`ÔÇô`0051`, not this one, and both sentences are date-stamped.

VERDICT: defect


**2026-09-08** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 2 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 2 of 2 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

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
