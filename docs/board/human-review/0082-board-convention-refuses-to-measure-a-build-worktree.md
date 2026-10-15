# board:convention refuses to measure a build worktree

## Why
**The command card `0021` names as its finish line no longer runs where its builders work.** On
2026-10-05, from the `0021` build worktree, `php C:\Dev\ProgressBoard\artisan board:convention
--path=$PWD --cards` printed:

    'NearestForest' is under C:\Users\r\AppData\Local\ProgressBoard\worktrees and is skipped: a git worktree of another repository, whose board is already a row

and exited 1. On 2026-09-11 the same command from a worktree measured that worktree's own tree.
`0021`'s `## Plan` says to pass `--path` precisely so a builder measures the tree it is editing.
Now a builder can only measure `C:\Dev\NearestForest`, which is a tree it is not editing, so any
count it reports for its own edits is not a measurement of them.

## Links

**Relates to**
- `0021` - its `#6` and `## Plan` depend on this command reading a worktree.
- `0058` - the other known gap in the same command, a link form it cannot see.

## Not this card
The command lives in `C:\Dev\ProgressBoard`, outside this repository. This card records the fault
here, where it bites; the fix is ProgressBoard's.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN `board:convention --path=<worktree>` is run from a NearestForest build worktree, IT
      SHALL print that worktree's path in its last column, or `0021`'s `## Plan` SHALL name the
      command a builder uses instead. proves: none - the command is in another repository
<!-- AC:END -->

## Comments

**2026-10-15** RESULT: blocked
TESTS: +0 new, none run (proves: none; no code changed)
TOUCHED: none
OUT-OF-SCOPE: none

Re-measured on 2026-10-15 from this card's own build worktree: `php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards` still prints `'NearestForest' is under C:\Users\r\AppData\Local\ProgressBoard\worktrees and is skipped: a git worktree of another repository, whose board is already a row` and exits 1. The fault is still live.

Neither route in #1 is open to an unattended session. Route one is a change to `C:\Dev\ProgressBoard`, which is outside this worktree; the card's own `## Not this card` says the fix is ProgressBoard's. Route two is an edit to `0021`'s `## Plan`, and this session may not edit cards. `0021` is also in `discarded/` since 2026-10-07 (superseded), so its Plan no longer binds any builder.

That makes this a call for Rob, not a build. Two options:
1. Discard `0082` as moot with `0021`, as `0021`'s discard note already did for `0081`. The worktree refusal would then be recorded nowhere, because `board:find` shows no ProgressBoard card for it (`0153` is the nearest and is about the message wording, not the refusal).
2. Keep the fault alive: raise it as a card on ProgressBoard's own board (refuse a worktree only when scanning `C:\Dev`, not when `--path` names it directly), then discard this one.
Recommendation: option 2, since the memory note `board-convention-path-is-the-repo-root` shows builders keep meeting this refusal.

**2026-10-15** RESULT: blocked
TESTS: +0 new, none run (proves: none; no code changed)
TOUCHED: none
OUT-OF-SCOPE: none

Second take, same finding as the 2026-10-15 entry already on the card. Re-measured from this card's build worktree: `php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD --cards` still prints `'NearestForest' is under C:\Users\r\AppData\Local\ProgressBoard\worktrees and is skipped: a git worktree of another repository, whose board is already a row` and exits 1.

Neither route in #1 is open here. Route one changes `C:\Dev\ProgressBoard`, outside this worktree (the card's `## Not this card` says the fix is ProgressBoard's). Route two edits `0021`'s `## Plan`, and this session may not edit cards; `0021` is in `discarded/` anyway.

This needs Rob. The two options in the earlier entry still stand: (1) discard `0082` as moot with `0021`, or (2) raise the refusal as a card on ProgressBoard's board, then discard this one. Recommendation: option 2. Re-running this card unattended will keep returning blocked.

**2026-10-15** The loop moved this card from in-progress/ to human-review/. 2 takes in a row ended with it still in in-progress/, and the last one said: `made no progress: 1 of 1 still open, exactly as this take found it`. What this card is waiting for is not another session. bin/work-card.ps1 counts those takes out of storage/logs/work-card.log, and will start it again as soon as a person has moved it back to todo/.

### 2026-10-15 manager (m20261015123154-7ee5)

**outcome: question**

The only fix left is in ProgressBoard, outside this repository, and only Rob can decide whether his tool should change.

**The question:** Do you want `board:convention` to measure a worktree when `--path` names it directly (raise that as a ProgressBoard card and discard `0082`), or discard `0082` as moot now that `0021` is gone?

**what the session said**

I checked the card's two claims.

- `0021` is now in `docs/board/discarded/`. Its Plan does not bind anyone now, so the second route in #1 does not help.
- No card on ProgressBoard's board covers the worktree refusal. The only match is `0152-board-convention-prints-a-number-nobody-can-act-on.md`, in `done/`. It is about something else.

That leaves one real fix: change `board:convention` in `C:\Dev\ProgressBoard`. This card cannot do that, because its `## Not this card` says the fix belongs to ProgressBoard. A builder sent back to `todo/` would only report "blocked" again.

What is left is Rob's choice about his own tool. Should a `--path` that names a worktree get measured? He can say yes and raise that as a ProgressBoard card. Or he can drop this card along with `0021`. I'd go with raising it, because the memory note `board-convention-path-is-the-repo-root` shows that builders keep hitting this refusal.

QUESTION: Do you want `board:convention` to measure a worktree when `--path` names it directly (raise that as a ProgressBoard card and discard `0082`), or discard `0082` as moot now that `0021` is gone?

WHY: The only fix left is in ProgressBoard, outside this repository, and only Rob can decide whether his tool should change.

OUTCOME: question

