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
- [x] #1 WHEN `docs/board/human-review/0011-security-response-headers.md` is searched for the heading
      `## Comments` anchored to the start of a line, THE CARD SHALL return exactly one hit.
      proves: none - this project's suite is one node script over the app and cannot read the board;
      the check is `grep -c '^## Comments' <path>` against that one path, and it reads 2 today
- [x] #2 WHEN the surviving thread is read top to bottom, THE CARD SHALL present every entry that
      exists today, in date order, with none dropped. proves: manual - the entries carry dates but no
      ids, so matching the merged thread against the two originals is a reader's comparison
<!-- AC:END -->

## Tasks
- [x] Read both threads and list every dated entry in each before changing anything
- [x] Merge them under the first `## Comments` heading in date order, keeping every entry byte-exact
- [x] Diff the entry count and the set of dates before and after, and put both in the build note
- [x] Say on the card which heading survived and where the moved entries came from

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

**2026-09-11** RESULT: done
TESTS: +0 new, suite unchanged (306 passed, 1 failed - the known `0020` file-size red, card `0055`)
TOUCHED: docs/board/human-review/0011-security-response-headers.md
TOUCHED: docs/board/in-progress/0061-card-0011-carries-two-comments-threads.md
OUT-OF-SCOPE: none

**No test, and that is the card's own instruction rather than a skip.** Criterion #1 says
`proves: none` and #2 says `proves: manual`. This project's suite is `node scripts/selftest.js`,
one node script over `app/`; it reads no board file except to measure card sizes, so it cannot
express "this card has one `## Comments`". The check a reader repeats is the `grep -c` on the
criterion. It read 2 before and reads 1 now. The suite was run anyway, before and after, and is
unchanged at 306 passed / 1 failed, that one failure being the deliberate `0020` size red the
brief names.

**The first heading survived**, the one at line 198 with the ProgressBoard HTML comment under it.
The second heading, which carried no such comment, was deleted and its two entries moved up under
the first.

**Entry count and dates, before.** Six dated entries across two threads.
Thread one (surviving heading): `**2026-09-07**` loop stanza; `**2026-09-10**` Rob's call;
`### 2026-09-10 review`; `**2026-09-11**` loop stanza. Thread two (deleted heading):
`**2026-09-10**` build note `RESULT: done`; `### 2026-09-11 review (v20260911020323-f5a0)`.

**Entry count and dates, after.** The same six, one thread, in this order: `**2026-09-07**`;
`**2026-09-10**` Rob's call; `### 2026-09-10 review`; `**2026-09-10**` build note;
`### 2026-09-11 review (v20260911020323-f5a0)`; `**2026-09-11**` loop stanza.

**Nothing was reworded, and that is measured rather than read.** Sorting every non-blank line of
the file before and after and diffing the two sorted lists returns exactly one line, the removed
`## Comments`:

    diff <(git show HEAD:$f | tr -d '\r' | grep -v '^[[:space:]]*$' | sort) \
         <(tr -d '\r' < $f | grep -v '^[[:space:]]*$' | sort)
    39d38
    < ## Comments

So every other line of both threads is byte-identical to what it was. Only position changed, which
the Plan says is not an edit of an entry.

**Two entries share 2026-09-10 and two share 2026-09-11, so the date alone does not order them.**
Both pairs were ordered by cause and then confirmed against the commit log. Rob's call asks for a
fresh adversarial pass, the `### 2026-09-10 review` is that pass, and the build note answers it by
name ("The 2026-09-10 reviewer graded acceptance `sound`"), so call, review, build. The
`### 2026-09-11 review` carries the version stamp `v20260911020323`, and the loop stanza below it
is written when the loop moves the card, which is the later commit `2a76844`; commit `4498d0c`
moved the card to `todo/` with the review already on it. So review, then stanza. That is the one
place where an existing entry moved past another entry rather than just up a heading.

**How it came to be this way is now established, not guessed.** The card said a builder should read
the history rather than repeat its guess, so: counting `^## Comments` in every lane path at each
commit that touched the file puts the change at `50402b7`, "0011: make the security-header tests
able to fail", 2026-09-10. That is the build session whose own note says it removed the stale
`## What I need from you` block. It rewrote the top of the card and opened a new `## Comments` at
the bottom instead of appending to the one already there. The card's guess, that the older
`## Direction` heading confused a session, is not what the history shows.

**Left alone, as the card requires.** `0011`'s open `breakage: defect`, its seven ticked criteria,
its `## What I need from you` section and its lane. `## Direction` is untouched, including the
`2026-09-07` review inside it; the card names that second-thread-by-another-name as a separate
question and it is not raised here.
