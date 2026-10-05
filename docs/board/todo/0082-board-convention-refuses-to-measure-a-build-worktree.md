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
