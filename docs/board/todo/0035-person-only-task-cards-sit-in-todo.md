# Two cards a person must do by hand sit in `todo/`

## Why
`0010` (rotate the Thunderforest key) and `0027` (send the Forestry England enquiry) both open with
`## What I need from you`, and `docs/board/README.md` calls that "the one section a card in
`human-review/` must have". Both are steps only a person can take: `0010` signs in to a third-party
account and sends mail, `0027` sends an email to a public body in Rob's name. `0027` says so in its
own frontmatter, `not_for_the_loop: sends an email to a public body in Rob's name`. Both sit in
`docs/board/todo/`.

What it costs. A person sweeping `human-review/` sees neither, so the lane holds three cards while
`docs/HANDOVER.md` counts eight waiting on Rob. That gap is the same one card `0032` measured and
card `0033` fixed for `0025`; these two are the rest of it. Neither can be drawn by the unattended
loop today, because `0010` carries `waiting_on:` and `0027` carries `not_for_the_loop:`, so the cost
is visibility rather than a session doing something it should not. Delete either key and it becomes
the other cost too.

How it came to be this way. `0033`'s sweep rule was "every `todo/` card carrying `## Options` is a
decision", which is the board's own derivation rule and catches decision cards only. `0010` and
`0027` carry `## Tasks`, so they are feature cards by that rule and the sweep passed over them,
even though the README puts a person-only step in the same lane as a decision.

## Links

**Relates to**
- `0033` - moved `0025` for the same reason and swept `todo/` for decision cards only. Its comment
  entry names these two as the residue it could not take.
- `0032` - measured the count in `docs/HANDOVER.md` that these two cards make wrong.

## Not this card
Not editing the text of `0010` or `0027`; their shape is fine, their folder is not. Not building a
board check that catches this class of fault, which `0033` also declined and which is a larger piece
of work. Not doing either card's actual task.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN a card's only remaining work is a step a person must take by hand, THE BOARD SHALL hold
      that card in `docs/board/human-review/`. proves: none - a card's lane is a folder, and this
      project's suite is one node script over the app; the check is `ls docs/board/human-review`
      showing `0010` and `0027` there and `ls docs/board/todo` showing neither
<!-- AC:END -->

## Tasks
- [x] `git mv docs/board/todo/0010-rotate-the-thunderforest-key.md docs/board/human-review/`
- [x] `git mv docs/board/todo/0027-send-the-forestry-england-enquiry.md docs/board/human-review/`
- [x] Correct the count of cards waiting on a person in `docs/HANDOVER.md`, and the lane it points at

## Plan
Work in the NearestForest repository, on a branch off `main`. Nothing outside `docs/board/` and
`docs/HANDOVER.md` changes.

The two moves are the commands above, run from the repository root. Then re-read `docs/HANDOVER.md`
"Blockers / open questions": it says what waits on a person, and once these two cards are in the
lane, the sentence pointing the reader at `docs/board/human-review/` is true for the first time.
Count the lane rather than the prose: `ls docs/board/human-review` is the number.

It worked when `human-review/` holds `0010` and `0027`, `todo/` holds neither, and the count in
`docs/HANDOVER.md` matches the number of files in that folder.

## Comments
**2026-09-06** Raised by card `0033` while it moved `0025` out of `todo/`. `0033`'s sweep rule was
the board's own derivation rule for a decision card, `## Options`, and it is blind to a feature card
whose remaining work is a person's. These two are what it left behind.

**2026-09-06** RESULT: done
TESTS: +0 new, all green (225 passed, 0 failed, `node scripts/selftest.js`)
TOUCHED: docs/board/todo/0010-rotate-the-thunderforest-key.md -> docs/board/human-review/
TOUCHED: docs/board/todo/0027-send-the-forestry-england-enquiry.md -> docs/board/human-review/
TOUCHED: docs/HANDOVER.md
TOUCHED: docs/board/todo/0037-three-decision-cards-are-still-in-todo.md (new)
TOUCHED: docs/board/in-progress/0035-person-only-task-cards-sit-in-todo.md (this card)
OUT-OF-SCOPE: 0037

Both moves done with `git mv`. `ls docs/board/human-review` now prints five files and
`ls docs/board/todo` prints neither of the two. No test was written: criterion #1 says
`proves: none`, and a card's lane is a folder that nothing in this repository's suite reads. The
suite was run anyway to show nothing else broke.

The count in `docs/HANDOVER.md` was the awkward part. The lane now holds five, and the file's own
bulleted list under "Blockers / open questions" names eight cards that need Rob. Both numbers are
true and they are about different things, so the file now states the lane count, names the five, and
says the other three are `0003`, `0017` and `0018`, still in `todo/`. Those three carry `## Options`,
which is the board's own rule for a decision card, so `0033`'s sweep should have taken them and did
not. That is outside this card's fence, so it is raised as card `0037` rather than fixed here, and
the note in `docs/HANDOVER.md` points at it. When `0037` is done that paragraph collapses back to
"eight", which is one of its tasks.

Not settled from the repository: why `0033` moved only `0025` when three more `todo/` cards matched
its stated rule. `0003` and `0017` carry a `waiting_on:` recheck date that is not yet due, which may
have read as "parked", but `0018` carries no key at all. `0037` records the question; it does not
answer it.

### 2026-09-08 review (v20260908114922-ad0f)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Criterion #1: both cards sit in `docs/board/human-review/` (`0010-rotate-the-thunderforest-key.md`, `0027-send-the-forestry-england-enquiry.md`) and neither is in `docs/board/todo/`. That is what the criterion asks and it holds. There is no code to trace: the lane is a folder, and `scripts/selftest.js` reads only the app, so `proves: none` is honest rather than an excuse.

Task 3 also lands: `docs/HANDOVER.md` states the lane count and names both cards in the "Blockers / open questions" list.

One thing I checked and rejected as a finding: `docs/HANDOVER.md` says eleven cards and the lane now holds 32 files. Its own sentence stamps the count "counted 2026-09-07" and lists the eleven, so it is a dated measurement, not a false claim. The extra files arrived from later cards (`0045`, `0046`, `0051`), which is outside this card's fence.

I could not break it.

VERDICT: sound

**scope: defect**

Findings, plain:

**1. It moved more cards than the two it was allowed to move.** The card names exactly two moves. The diff also shows `docs/board/human-review/0003-straight-line-distance-in-practice.md` and `docs/board/human-review/0017-how-much-of-wales-can-we-actually-ship.md` as renames into the lane. The card's own comment says the opposite: that `0003`, `0017` and `0018` were left in `todo/` and raised as card `0037` instead. The write-up and the tree do not agree, so the note added to `docs/HANDOVER.md` ("the other three are `0003`, `0017` and `0018`, still in `todo/`") is false as written.

**2. Code changed under a docs-only fence.** The plan says "Nothing outside `docs/board/` and `docs/HANDOVER.md` changes." The diff carries `app/core.js` (new `mapHint`, rewritten comment on `safeHref`), `app/app.js` `openSheet`, `app/api/nearest.php`, `scripts/parse_campsites.py`, `scripts/selftest.js` and `app/data/campsites.json`. None of that is a lane move.

**3. Half done.** With the extra moves in the tree, the count and the named cards in `docs/HANDOVER.md` "Blockers / open questions" no longer match the lane, which is the one thing task 3 had to get right.

VERDICT: defect

**breakage: defect**

Reviewed against the delivered tree.

**Finding 1 ÔÇö the count this card was created to fix is false again, and it is stated as self-verifying.**
`docs/HANDOVER.md`, "Blockers / open questions", says **"Eleven cards need Rob, and all eleven are in the lane: `ls docs/board/human-review` on 2026-09-07 gives 0001, 0002, 0003, 0010, 0017, 0018, 0024, 0025, 0027, 0030 and 0043. The folder is the count."** The folder holds **32** files. The same eleven is repeated in the summary block at the top of `docs/HANDOVER.md`. The one command the prose offers as proof refutes the prose.

**Finding 2 ÔÇö the same section names lanes that moved.**
`docs/HANDOVER.md`, "Blockers / open questions", puts `0045` in `todo/` and `0044` in `in-progress/`. `0045` is in `human-review/`, `0044` is in `ai-review/`, and `todo/` holds only `0052`, `0053`, `0054`.

**Finding 3 ÔÇö this card's own follow-up is stale.**
`docs/board/ai-review/0037-three-decision-cards-are-still-in-todo.md` was raised by this card and says `0003`, `0017`, `0018` are in `todo/`. All three are in `human-review/`. The card describes a board that no longer exists.

VERDICT: defect

