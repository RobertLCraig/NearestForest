# Card 0011 carries two `## Comments` threads, so its history reads in the wrong order

## Why
`docs/board/README.md` says a card has one comment thread, under one `## Comments` heading, and that
the thread is append-only. `docs/board/human-review/0011-security-response-headers.md` has that
heading twice, measured 2026-09-11:

    grep -c '^## Comments' docs/board/human-review/0011-security-response-headers.md
    2

It is the only card on the board with more than one, measured the same way across every lane.

What it costs. Entries under the first heading run to 2026-09-07 and then stop; the newest work sits
under the second heading, far below a `## Direction` block and two review sections. A reader who
opens the card, finds `## Comments` and reads to the end of it is reading four-day-old history and
has no sign that a second thread exists. An agent appending "to the thread" has two places to put an
entry and nothing tells it which.

How it came to be this way. Not established from this repository. The card was moved between
`todo/`, `ai-review/` and `human-review/` several times and carries a `## Direction` block as well,
which is the older heading this board used before `## Comments` existed, so a session that appended
under the new heading while the old structure was still in place is the likely cause. A builder
should read the file's history rather than repeat this guess.

## Links

**Relates to**
- `0059` - the card that found this, while writing `## What I need from you` into `0011` and four
  other cards in the lane. Its scope was that one section per card, so this was written up rather
  than fixed in passing.
- `0011` - the card with the fault. It is the only file this card edits, and nothing else about it,
  including its open reviewer finding, is in scope.

## Not this card
Not acting on `0011`'s open `breakage: defect`, not unticking any of its criteria, not editing its
`## What I need from you` section and not moving it out of the lane. Not touching its `## Direction`
block, which is a second append-only thread by a different name and is a separate question. Not a
check in the board tooling that refuses a card with two threads: that lives in
`C:\Dev\ProgressBoard`, outside this repository.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN `docs/board/human-review/0011-security-response-headers.md` is searched for the heading
      `## Comments` anchored to the start of a line, THE CARD SHALL return exactly one hit.
      proves: none - this project's suite is one node script over the app and cannot read the board;
      the check is `grep -c '^## Comments' <path>` against that one path, and it reads 2 today
- [ ] #2 WHEN the surviving thread is read top to bottom, THE CARD SHALL present every entry that
      exists today, in date order, with none dropped. proves: manual - the entries carry dates but no
      ids, so matching the merged thread against the two originals is a reader's comparison
<!-- AC:END -->

## Tasks
- [ ] Read both threads and list every dated entry in each before changing anything
- [ ] Merge them under the first `## Comments` heading in date order, keeping every entry byte-exact
- [ ] Diff the entry count and the set of dates before and after, and put both in the build note
- [ ] Say on the card which heading survived and where the moved entries came from

## Plan
Work in the NearestForest repository, on the branch the session was given. Only
`docs/board/human-review/0011-security-response-headers.md` changes; nothing under `app/` or
`scripts/` is involved, so `node scripts/selftest.js` cannot see this either way. Run it anyway to
show the change broke nothing. There is no PHP suite here: no `vendor/`, no `pest.bat`, no
`pint.bat`.

**Append-only means the entries, not their position.** Moving an entry under the other heading keeps
it in the thread and is not an edit of it. Rewording one, merging two, or dropping one is, and none
of those is allowed here. Copy the text unchanged.

**Prove nothing was lost by counting, not by reading the prose.** Before the change, list the dates
of every entry under each heading. After it, list them again from the single thread. Both lists go in
the build note. That is the check a reader can repeat.

**The scheduler's stanza is an entry too.** The bolded paragraph that starts "The reviewer returned
this card" was appended by the loop and belongs in the thread with the rest, in its own date order.

It worked when `grep -c '^## Comments'` over that file reads 1, and when the surviving thread holds
every dated entry both threads held, in date order.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-11** Raised by card `0059` while writing `## What I need from you` into five cards in
`human-review/`. The second heading was found by listing the headings of `0011` to decide where the
new section belonged. Swept every lane for the same fault and `0011` is the only card with it.
