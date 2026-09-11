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
- [x] #1 WHEN the self-test suite runs, THE SUITE SHALL fail naming every card number whose file
      appears under more than one lane folder in `docs/board/`. proves: `no board card appears in
      two lanes`
- [x] #2 WHEN the duplicates are resolved, THE BOARD SHALL hold exactly one file per card number,
      and the surviving file SHALL be the later of the two by `git log`. proves: `no board card
      appears in two lanes`
- [x] #3 THE MERGE SHALL preserve every acceptance tick, comment entry and frontmatter key that
      only the deleted copy carried, by appending it to the survivor rather than by losing it.
      proves: none - it is a read of two files against one, and no check here compares prose
- [x] #4 WHEN the duplicates are resolved, `board:convention` SHALL report zero open cards failing.
      proves: none - the command that counts it is in another repository, named in `## Plan`
<!-- AC:END -->

## Tasks
- [x] Write the self-test assertion first and watch it name all sixteen numbers before fixing any
- [x] For each number, read both files and `git log` both paths; establish which is the later state
- [x] Append to the survivor anything only the stale copy holds, then delete the stale file
- [x] Re-run `board:convention` and the suite

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

**2026-09-11** RESULT: done
TESTS: +1 new, `no board card appears in two lanes`
TOUCHED: scripts/selftest.js, and the sixteen pairs under docs/board/
OUT-OF-SCOPE: 0072, 0073, 0074 (raised, not fixed; see below)

**The check, and it went red on the real defect first.** It walks every lane folder under
`docs/board/`, groups files by the leading four digits rather than by filename, and fails naming
each number and the lanes holding it. Written and run before any file was deleted, it printed all
sixteen: `0008`, `0011`, `0012`, `0013`, `0014`, `0015`, `0019`, `0021`, `0032`, `0036`, `0038`,
`0053`, `0054`, `0055`, `0056`, `0057`. It is committed in that red state, one commit before the
first deletion, so the proof is in the history rather than in this sentence. The deletions then took
it to seven, two, one and zero. To show it is not a check that passes on anything, a copy of
`0067` was dropped into `todo/` under a **different slug** and the run named `0067 in done and
todo`, which is also the proof that it groups by number and not by filename. The scratch file was
deleted and `git status` confirmed clean.

**Criterion #2 could not be applied as written, and this is the one judgement in the build.** It
says the survivor is "the later of the two by `git log`". Read as the later commit date that is
false for all sixteen: `b75d8db` committed the carry-over files at 15:24 on 2026-09-11, which is
after the last write to every live copy, so the stale file wins every pair and the rule inverts
itself. `## Plan` gives the operative rule instead, and that is what was applied: the survivor is
the file holding the later **state**, which is the one `b75d8db` did not add, checked pair by pair
because a session may have written to a stale copy since. Five had.

**What each pair cost, since criterion #3 is a read of two files and no check covers it.**

| pair | only in the deleted copy | done |
|---|---|---|
| `0014` `0015` `0032` `0038` `0053` `0054` `0056` | nothing; they differ in line endings alone | deleted |
| `0055` | two criteria the survivor has ticked | deleted |
| `0012` | an ask about the 2026-09-10 findings the survivor records as built that day | deleted |
| `0008` | an ask to untick a latch already fixed, and the loop's closing entry | recorded in a dated entry, then deleted |
| `0011` `0013` `0019` `0036` `0057` | a whole second adversarial review, run after the carry-over | appended verbatim |
| `0021` | a run entry, three `## Links` lines, and the untick of `#6` | all three merged across |

**The five stale copies had lost their frontmatter or their encoding.** `0013` and `0057` carried no
`no_outward_effect:` key at all, which is exactly why `board:convention` was failing on them and the
live copies were not. The reviews appended from `0011`, `0013` and `0019` had their em dashes
mis-decoded to `ÔÇö`; they are repaired to the hyphen the same reviewer used in the surviving `0011`
copy, since no card on this board carries an em dash. No other character of any copy's prose was
touched.

**Five defect verdicts came across with those reviews, and three are still open.** A finding
appended to a card in `done/` is a finding nobody picks up, which is the failure `0070` was written
about, so each was checked against the tree and raised where it still bites:

- `0013`'s, that `scripts/__pycache__/parse.cpython-313.pyc` is tracked with no `.gitignore` rule.
  Still true: it is in `git ls-files`. Raised as `0072`.
- `0019`'s, that `docs/DATA-MODEL.md` still shows the retired attribution string. Still true at
  line 90. Raised as `0073`.
- `0011`'s, that no assertion requires the HTTPS redirect to exist, so deleting the whole rewrite
  block leaves the suite green. Still true: `scripts/selftest.js` line 1102 is the only mention and
  it is negative. Raised as `0074`.
- `0036`'s, that `counterDir()` and `readKey()` in `app/api/tiles.php` disagree about where the key
  lives. Already the whole of card `0012`'s ask, which is in `human-review/` waiting on Rob. Not
  raised again.
- `0057`'s, that the Product Requirements Document still promises a link to the Forestry England
  page. Not raised: the phrase is not in `docs/PRD.md` at HEAD. Its second half, that the
  Scottish-URL sweep reads `sites.json` and not `campsites.json`, is left on that card's thread.

**The board after the merge.** `php C:\Dev\ProgressBoard\artisan board:convention --path=$PWD
--cards` prints `NearestForest 0 43 0072`: zero open cards failing, where it printed five before.
That is criterion #4, and it is also the whole of what card `0021`'s criterion #6 was waiting for
from this card.

**The suite is 305 passed, 3 failed, and none of the three is this card's.** Two are the undeclared
`requests` module, which is card `0071`. One is `0020` at 206.8 KB against the 200 KB reader limit,
which is card `0055` and is deliberate. The new assertion passes.

**Not checked in a browser.** Nothing this card reaches `app/`.
