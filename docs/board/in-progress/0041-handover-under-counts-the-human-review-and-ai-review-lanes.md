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
- [ ] #1 WHEN a reader counts the person's queue, THE HANDOVER SHALL name the same cards as
      `ls docs/board/human-review`. proves: none - a card's lane is a folder and this project's suite
      is one node script over the app; the check is `ls docs/board/human-review` read against both
      sentences in `docs/HANDOVER.md`
- [ ] #2 WHEN a reader sizes the adversarial pass, THE HANDOVER SHALL give the same number as
      `ls docs/board/ai-review`. proves: none - same reason as #1; the check is
      `ls docs/board/ai-review | measure` read against "What's next" item 4
<!-- AC:END -->

## Tasks
- [ ] Count both folders and read the numbers off them
- [ ] Correct the count and the card list in the status block at the top of `docs/HANDOVER.md`
- [ ] Correct the same claim at the end of "Blockers / open questions", including the bulleted list
      of cards below it, which describes only the eight
- [ ] Correct the `ai-review/` figure in "What's next" item 4, and its date

## Plan
Count the folders, never the prose. The `human-review/` paragraph is followed by a bulleted list that
says what each card wants; adding three numbers to the count without adding their lines leaves a list
that no longer covers the lane. Write each new line from what that card actually asks for.

It worked when both `human-review/` sentences name exactly the cards in `docs/board/human-review/`,
and item 4's number equals the file count of `docs/board/ai-review/`.

## Comments
**2026-09-06** Raised by card `0040` while it corrected the agent-ready count in the same file.
`0040`'s scope was the `todo/` sentences, so this was left rather than fixed in passing.
