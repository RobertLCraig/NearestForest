# Sixteen cards sit in two lanes at once

## Why
**The folder is supposed to BE the card's state, and sixteen cards are in two folders.** Measured on
2026-09-11, these card numbers each exist as two files under `docs/board/`: `0008`, `0011`, `0012`,
`0013`, `0014`, `0015`, `0019`, `0021`, `0032`, `0036`, `0038`, `0053`, `0054`, `0055`, `0056`,
`0057`. The two copies are never the same file: they carry different acceptance ticks, different
frontmatter and different comment threads.

**What it costs, and it is already being paid.** `php C:\Dev\ProgressBoard\artisan board:convention
--path=$PWD` reports **5 open cards failing out of 56**. All five are stale copies - `0032`, `0038`
and `0053` in `todo/`, `0013` and `0057` in `ai-review/` - and the live copy of every one of them
already passes the same check. So the board reads as five cards needing a rewrite when no card does.
The count of open cards is wrong the same way: 56 counted where about 40 exist.

**The loop starts the stale copy.** On 2026-09-11 an unattended session was handed
`docs/board/in-progress/0021-...` and found a card six days behind the `human-review/` copy of the
same number: a blocker since answered and removed, an acceptance block missing the later run's
ticks, and none of the review finding that copy carries. Nothing tells a session it has the wrong
copy, and its work then merges into a file nobody reads.

**Three of them are finished and queued at the same time.** `0013`, `0036` and `0057` are in `done/`
and in `ai-review/`, so each is both past a review and waiting for one. `0008` pairs `done/` with
`human-review/`; the rest pair a `todo/` or `ai-review/` copy with a `human-review/` one.

**How it came to be this way.** Commit `b75d8db` on 2026-09-11, "board: commit the cards carried over
uncommitted from MSIRaider2", added 16 card files that had been untracked on the old machine. Each
was committed into the lane it occupied there. The tracked copy had moved lane since, so committing
the carry-over recreated the card in its old folder beside its current one. Nothing complained,
because no check on this board reads whether a card number appears twice.

## Links

**Relates to**
- `0021` - raised by that card. Its criterion #6 wants the convention check at zero, and these five
  stale copies are the entire count standing between it and zero.
- `0055` - it put the existing board-shape checks into `scripts/selftest.js`, which is where the
  check below belongs, beside them.
- `0070` - the other stale-state fault found the same day, a blocker naming an answered card.

## Not this card
**Not rewriting either copy's prose.** Merging a pair is about which file survives, not how it
reads.

**Not a lane move, and not a judgement about which lane a card belongs in.** Where two copies
disagree about state, the later one by `git log` wins and the other is deleted. Deciding a card
belongs somewhere neither copy sits is a different card.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the self-test suite runs, THE SUITE SHALL fail naming every card number whose file
      appears under more than one lane folder in `docs/board/`. proves: `no board card appears in
      two lanes`
- [ ] #2 WHEN the duplicates are resolved, THE BOARD SHALL hold exactly one file per card number,
      and the surviving file SHALL be the later of the two by `git log`. proves: `no board card
      appears in two lanes`
- [ ] #3 THE MERGE SHALL preserve every acceptance tick, comment entry and frontmatter key that
      only the deleted copy carried, by appending it to the survivor rather than by losing it.
      proves: none - it is a read of two files against one, and no check here compares prose
- [ ] #4 WHEN the duplicates are resolved, `board:convention` SHALL report zero open cards failing.
      proves: none - the command that counts it is in another repository, named in `## Plan`
<!-- AC:END -->

## Tasks
- [ ] Write the self-test assertion first and watch it name all sixteen numbers before fixing any
- [ ] For each number, read both files and `git log` both paths; establish which is the later state
- [ ] Append to the survivor anything only the stale copy holds, then delete the stale file
- [ ] Re-run `board:convention` and the suite

## Plan
**Where to stand.** This repository, on a branch of `main`. There is no PHP suite here and no
`vendor/`, so `pest` and `pint` do not exist. The suite is `node scripts/selftest.js`, deliberately
red today on `no board card is too large for the agent file reader`. Do not read that red as yours.

**Find them all, from the repository root in Git Bash:**

    cd docs/board && for f in ai-review todo in-progress human-review done discarded; do \
      for c in $f/*.md; do [ -e "$c" ] && echo "$(basename $c)|$f"; done; done | sort | \
      awk -F'|' '{a[$1]=a[$1]" "$2; n[$1]++} END{for(k in a) if(n[k]>1) print k, "->", a[k]}'

**The check goes in `scripts/selftest.js`**, beside the two board-shape checks already there: the
`0020` lane check near line 2824 and the 200 KB size check at line 2855. Both already walk the lane
folders, so the walk is written; what is new is grouping by basename and failing on any group of
more than one. Name it exactly `no board card appears in two lanes` so a criterion can name it.

**Red-proof it on the real defect, not a fixture.** The board holds sixteen duplicates right now, so
the first run of a correct check is red naming all sixteen. That is the proof. Then, to show it is
not a check stuck red, delete one stale copy and confirm the run names fifteen.

**Which copy is the later one.** `git log --oneline -- <path>` on both. The survivor is the one NOT
added by `b75d8db`, which is the carry-over, but check each pair rather than trusting that: a
session may have written to a stale copy since.

**The measurement to repeat** is the `board:convention` command in `## Why` with `--cards` added,
which appends one line per failing card. `--path` matters: a build worktree is not
`C:\Dev\NearestForest`, and without it you measure a tree you are not editing.

## Comments

**2026-09-11** Raised by an unattended run of card `0021`, which was handed the stale
`in-progress/` copy of itself and found the live one in `human-review/`. Not fixed there: deleting
card files is outside that card's fence, and sixteen deletions nobody reviewed is the wrong way to
close a count.
