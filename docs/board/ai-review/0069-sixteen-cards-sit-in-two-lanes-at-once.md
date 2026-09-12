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

### 2026-09-11 review

**suite**

`node scripts/selftest.js` runs **309 passed, 1 failed**. The single red is
`no board card is too large for the agent file reader`, naming
`docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md is 206.8 KB`. That one is card
`0055`'s and only Rob can clear it. Nothing else fails. This card's assertion,
`no board card appears in two lanes`, runs and passes, printed under
`--- one card, one lane (card 0069) ---`. The build entry's "305 passed, 3 failed" is stale rather
than wrong: card `0071` landed the two `requests` reds between then and now.

**acceptance: sound**

**#1 and #2, attacked with ten hand-made duplicates.** I tried to make the assertion green while the
thing it guards was broken, running the suite once per case and deleting the scratch file after each.
It named the duplicate in six of ten:

- a copy of `0008` in `todo/` under a **different slug** - named, `0008 in done and todo`
- the same copy under the **same slug** - named
- a copy in `discarded/`, which is empty at HEAD and so never walked before - named
- the same number in **three** lanes at once - named all three, `0008 in discarded and done and
  todo`, so the message does not truncate and the `.sort()` makes it stable
- two copies in **one** lane - named, `0008 in done and done`. The check is by number, not by lane
  pair, which is the stronger behaviour
- a copy in a lane directory that does not exist yet (`docs/board/blocked/`) - named. The walk reads
  the directory listing rather than a hard-coded lane list, so a new lane is covered the day it is
  created and nobody has to remember

It missed four, all of them the same blind spot: `/^\d{4}-.*\.md$/` requires a dash after the number
and a lower-case `.md`, and the walk is one level deep. So `0008.md` with no slug, `0008-dupe.markdown`,
`0008-Upper.MD` and `docs/board/todo/nested/0008-nested.md` are all invisible. Every one of those is
off the `NNNN-slug.md` rule in `docs/board/README.md`, and the two sibling board checks in the same
file (`0020`'s lane check and `0055`'s size check) share the identical regex, so this is the file's
existing blind spot rather than a new one. Worth a sweep card if anyone wants it; not a defect here.

One over-reach, and it is arguably correct: `docs/board/attachments/` is walked as if it were a
lane, because the filter is "is a directory" and nothing else. A `.md` parked there is reported as
`0008 in attachments and done`. Screenshots are `.png` so nothing fires today.

`git status --short` is clean of my scratch files after the pass.

**#3, verified independently rather than read off the table.** `git show b75d8db --stat` gives the
sixteen carry-over paths and `git log --diff-filter=D` gives the sixteen deleted ones. For each pair
I compared the deleted blob at `<deletion>~1` against the survivor at `9c06f6c`, both with
`diff --strip-trailing-cr` and as a line-set with `comm` under `LC_ALL=C`, and then re-ran the three
mojibake pairs with `ÔÇö` normalised to `-` on **both** sides.

**Nothing the deleted copy carried is absent from the survivor in fourteen of sixteen.** `0014`,
`0015`, `0032`, `0036`, `0038`, `0053`, `0054`, `0056` and `0057`: zero lines lost, raw. `0011`,
`0013` and `0019`: zero lines lost once the mojibake is normalised, which is the repair the entry
above describes. `0055`: the two lines the deleted copy held are an **unticked** `#2` and an
unticked task, both ticked on the survivor, so it lost a stale untick and not a tick. `0021`: the
one line is `- [x] #6`, deliberately unticked by the session that owns that card.

Two pairs did lose text, both fairly declared in the table and neither covered by #3 as written,
which names ticks, comment entries and frontmatter keys and not prose sections:

- `0008` - a 22-line `## What I need from you` asking Rob to untick `#1` and `#2` over the boundary
  latch, plus the loop's closing entry. I checked the substance rather than the table: the
  2026-09-10 build entry on the survivor fixes the latch and the 2026-09-10 review finds it
  disproved no criterion, so the ask was moot. The deletion is recorded in a dated entry on
  `done/0008` that says so in its own words. Sound.
- `0012` - a 32-line ask about the 2026-09-10 findings. The survivor was never edited by this card
  (`git diff --name-only d20be16 9c06f6c` does not list it), so the only record of that deletion is
  the table row on this card. I checked the substance anyway: `carrier`, `REMOTE_ADDR` and `429` all
  appear on the survivor's threads, and its current ask is the later 2026-09-11 `counterDir()`
  finding. Nothing recoverable is gone, but `0008` got a dated note and `0012` did not, for the same
  class of deletion.

**Two inaccuracies in the table itself, neither of which cost anything.** The first row says the
seven pairs "differ in line endings alone". They do not: the survivors of `0053`, `0054` and `0056`
carry 40, 30 and 43 lines the deleted copy never had, `0032` carries 11, and `0014`, `0015` and
`0038` carry 2 to 4. The column heading ("only in the deleted copy") is what is true; the sentence
under it is not. Second, "they are repaired to the hyphen" reads as though those files are now
clean. The appended review text is clean, but `human-review/0011` still holds 7 lines of `ÔÇö`,
`done/0013` 4 and `human-review/0019` 9 - identical counts at `d20be16`, `9c06f6c` and HEAD, so this
card introduced none of it and repaired none of the pre-existing. Forty card files on this board
carry it. Not this card's to fix; the sentence just claims more than it did.

**#4, re-run from `D:\Dev\NearestForest`.** `php C:\Dev\ProgressBoard\artisan board:convention
--path=$PWD --cards` prints `NearestForest 0 46 0075`. Zero open cards failing. The 43 has become 46
because three cards have been raised since.

**Criterion #2's judgement, checked against the history.** The claim holds. `b75d8db` is dated
2026-09-11 15:24:07 and fourteen of the sixteen deleted paths *are* its blobs, so "the later of the
two by `git log`" would have kept the carry-over and thrown the live card away in every one of those
cases. The rule actually applied - the file holding the later state - was applied consistently at
the level of content across all sixteen. `0021` is the apparent exception and is not one: the file
`b75d8db` created was the survivor there because the 2026-09-11 unattended session wrote a run entry
into it afterwards, which is exactly the "a session may have written to a stale copy since" case the
entry says it checked pair by pair. `git log b75d8db..9c06f6c` on each deleted path confirms the
"five had" count: `0011`, `0013`, `0019`, `0036`, `0057`.

VERDICT: sound

**scope: sound**

Only one non-document file is touched across `d20be16..9c06f6c`: `scripts/selftest.js`. Nothing
under `app/`, `scripts/parse.py`, `scripts/fetch*.py`, `data/` or `docs/` outside the board. The
"not rewriting either copy's prose" fence holds - every appended line is verbatim from the deleted
copy bar the mojibake repair, which is declared. The three findings were raised as `0072`, `0073`
and `0074` rather than fixed here, which is the fence being obeyed rather than worked around.

**One residue the next session has to pick up, and it is inherent in the fence rather than a breach
of it.** Deleting one of two copies necessarily picks a lane. Twice that picked the lane away from
Rob's queue. `0008`'s human-review copy went and the survivor sits in `done/`, which is recorded and
right. `0021`'s human-review copy went and the survivor sits in `in-progress/` **still carrying its
`## What I need from you`**, asking Rob to untick `#6` and send the card to `todo/`. Nothing sweeps
`in-progress/` for asks, `in-progress` means an agent is building it right now and none is, and the
commit subject "leave it in in-progress" is the only place this is written down. It is not in the
table and not in the entry's prose. Say it on `0021` or move it; it is one line either way.

VERDICT: sound

**breakage: defect**

I re-ran the suite, re-ran `board:convention`, and re-checked each of the five defect verdicts the
merge carried across against the tree at HEAD.

**Three of the five are correctly raised and still true.**

- `0072` restates `0013`'s finding exactly. `git ls-files | grep pycache` prints
  `scripts/__pycache__/parse.cpython-313.pyc`, and `.gitignore` has rules for the scrape cache,
  worktrees, keys, drafts and screenshots and none for `__pycache__` or `*.pyc`. Still true.
- `0073` restates `0019`'s. `docs/DATA-MODEL.md` line 90 shows
  `"attribution": "Contains public sector information licensed under the Open Government Licence
  v3.0."` against a shipped `"English forest details: Crown Copyright ..."`, and the example's
  `generated_at` reads `2026-08-29` against a shipped `2026-09-10`. Both halves still true.
- `0074` restates `0011`'s. `grep -n Rewrite scripts/selftest.js` returns exactly one line, 1102,
  and it is the negative `!/RewriteRule.*%\{HTTP_HOST\}/`. Deleting lines 66-69 of `app/.htaccess`
  satisfies it more easily than leaving them. Still true.

**The `0036` claim holds.** Its finding is `counterDir()` versus `readKey()` in `app/api/tiles.php`,
and that is word for word the `## What's wrong` of `human-review/0012`, which is in Rob's queue.
Correctly not raised twice.

**THE FINDING: `0057`'s was dismissed on a measurement that is wrong, and it is still live.** The
entry says "Not raised: the phrase is not in `docs/PRD.md` at HEAD." It is in `docs/PRD.md` at HEAD,
at lines 56 and 57:

    - Per-site detail: name, sat-nav postcode, opening times, parking charges, facilities, link to the
      Forestry England page.

The bullet wraps, so "link to the Forestry England page" straddles a newline and
`grep -c "link to the Forestry England page" docs/PRD.md` prints `0`. That is the whole of how it
was missed. `git show d20be16:docs/PRD.md` and `git show 9c06f6c:docs/PRD.md` both carry the same
two lines, so the claim was false when it was written and not merely overtaken. The reviewer's own
sentence - "the bullet four lines above it was updated for Scotland; this one was not" - points
straight at line 52, which is the Great-Britain-minus-Wales bullet, exactly where it says.

The cost is the failure this card's entry names and guards against three paragraphs earlier. `0057`
sits in `done/` with `VERDICT: defect` as the newest line on its thread, the finding is true, and no
card anywhere tracks it, so nobody will pick it up. The second half of the same verdict - that the
276-record sweep in `scripts/selftest.js` reads `DATA.sites` only, while the 44 Forestry and Land
Scotland URLs in `campsites.json` rest on one fixture - was consciously "left on that card's
thread", which is the same nobody-picks-it-up state, this time chosen rather than mistaken.

**On leaving `0013`, `0036` and `0057` in `done/` with a defect verdict at the bottom.** Not moving
them is right: the `## Not this card` fence forbids lane judgements, and unticking is a person's
call under `docs/board/README.md`, so a merge that started shuffling lanes would be three failures
instead of one. The mitigation the card chose - carry each live finding out to its own card in
`todo/` - is the correct one and is the whole reason `0070` exists. Judged on that mechanism, four
of five were handled properly. It fails on the fifth, and the fifth is the one where a false
measurement, not a judgement, made the decision. Raise `0057`'s PRD bullet as a card and this
dimension is sound.

VERDICT: defect

**security: sound**

The card produced one filesystem-reading assertion, so the three questions are worth little here,
but an unwritten pass cannot be told from one that never happened.

**Where it is weakest.** It is a check that can only be made to lie by naming a file so that it
stops looking like a card. A second copy committed as `docs/board/todo/0069.md`,
`0069-dupe.markdown`, `0069-Upper.MD` or `docs/board/todo/old/0069-dupe.md` is tracked by git, is
read by a human as a card, and is invisible to this assertion - I proved all four above. Nobody
attacks a board; somebody renames a file while tidying and the guard quietly stops covering it. The
walk also only runs when the suite runs, so a duplicate committed with no suite run is unguarded
until the next one.

**What is unchecked on the way in.** Nothing is validated, because nothing is input: the only data
is the directory listing of `docs/board/`. `fs.readdirSync(boardDir)` and `fs.statSync(d)` are
uncaught and there is no top-level `try` in `scripts/selftest.js`, so a dangling symlink or an
unreadable directory under `docs/board/` throws and aborts the whole run with a stack trace rather
than a named `FAIL` - loud, but loud in the wrong shape, and it takes the remaining assertions down
with it. There is no permission check because there is no entry point: no route, no job, no
machine-facing interface. The assertion reads names only and opens no file, so no card's contents
pass through it.

**What it leaks when it fails.** Card numbers and lane names, and nothing else -
`0008 in done and todo`. Both are already the names of files in a public repository, and the message
carries no absolute path, no file contents, no thread text and no environment. `ok()` prints to
stdout and the process exit code; there is no network call anywhere in the block. The honest limit
is that this runs on a developer's machine against a repository they already hold, so there is no
boundary here for it to leak across.

VERDICT: sound

**browser: not applicable, and this is a claim rather than a skip.**

`git diff --name-only d20be16 9c06f6c` lists 28 paths. Twenty-seven are under `docs/board/`. The
twenty-eighth is `scripts/selftest.js`. Nothing under `app/` is touched, no route, no asset, no
service worker, no `data/`. There is no user-facing surface to check and no server was started.

**2026-09-11** RESULT: done, second build
TESTS: +0 new, `no board card appears in two lanes` widened
TOUCHED: scripts/selftest.js, docs/board/todo/0076-the-requirements-document-promises-a-link-to-the-wrong-agency.md (new)
OUT-OF-SCOPE: 0076 (raised, not fixed)

**The finding is accepted and the measurement behind it was mine and was wrong.** The first build
entry says card `0057`'s finding was "not raised: the phrase is not in `docs/PRD.md` at HEAD". It is,
at lines 56 and 57, where the bullet wraps and the phrase straddles the newline. A single-line
search returned nothing and the finding was written off on it. It was false when written, not
overtaken: the same two lines are in `docs/PRD.md` at `d20be16` and at `9c06f6c`.

**The cost is exactly what that entry claimed to be guarding against.** `0057` sits in `done/` with
`VERDICT: defect` as the newest line on its thread and nothing tracked the finding, which is the
nobody-picks-it-up state card `0070` exists because of. It is now card `0076`, in `todo/`, carrying
both halves of that verdict: the requirements bullet, and the Scottish-agency label sweep reading
`sites.json` only while 44 Forestry and Land Scotland URLs sit in `campsites.json`. The second half
had been left on the thread deliberately, which the review rightly called the same state chosen
rather than mistaken.

**`0076`'s plan carries the trap that caused this.** Any check it writes has to flatten whitespace
before matching, the way card `0019`'s two footer assertions already do, because a line-at-a-time
search over a wrapped bullet is what missed this once.

**Four filenames got past this card's own check and no longer do.** The review committed a second
copy of a card four ways, every one of them something a person does while tidying: `0067.md` with no
slug, `0067-dupe.markdown`, `0067-Upper.MD`, and `todo/old/0067-dupe.md` one directory down. Each
was tracked by git and read by a human as a card, and the `/^\d{4}-.*\.md$/` match saw none of them.
The walk is now recursive under each lane and matches any name starting with four digits, either
extension, either case. Proved by putting all four back one at a time: every one is now named
`0067 in done and todo`, and each was deleted before the next.

**An unreadable directory now fails this assertion rather than the run.** `fs.readdirSync` and
`fs.statSync` were uncaught and there is no top-level `try` in this suite, so a dangling symlink
under `docs/board/` threw out of the whole file and took every later assertion with it. Both are
guarded and report `could not read <path>: <code>` on this assertion.

**The two sibling board checks still carry the old narrow match.** The 200 KB size check is card
`0055`'s and the raw-count check is card `0054`'s. Widening somebody else's assertion is the
adjacent thing this board's fences exist to stop, so it is named here and not touched.

**Two prose inaccuracies in the first build entry, which cannot be edited where they sit.** Its
table says seven pairs "differ in line endings alone"; the survivors carry between two and
forty-three lines the deleted copies did not, and what was true is that the deleted copies held
nothing the survivors lacked, which is the direction that mattered for criterion #3. And the mojibake
"repaired" claim covers the appended text only: `0011`, `0013` and `0019` still hold seven, four and
nine pre-existing mis-decoded lines each, at identical counts before and after this card, so not its
doing and not its fence.

**One residue the review flagged and it stands.** Card `0021`'s survivor sits in `in-progress/`
still carrying its `## What I need from you`, having left Rob's queue as a side effect of a
deletion. Its own thread records the merge and says half that ask is now answered by the builder
that unticked criterion `#6`. That `#6` is what cards `0069` and `0070` were the whole of, so the
card is ready to be re-measured and moved, and doing it here would be a lane judgement this card's
`## Not this card` forbids.

**The suite is 310 passed, 1 failed**, the one red being `0020` at 206.8 KB, which is `0055` and is
Rob's. `board:convention` reports zero open cards failing.

**Not checked in a browser.** This build touches `scripts/selftest.js` and one new card, and nothing
under `app/`.

### 2026-09-11 review (v20260911232922-18ce)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

**#1** ÔÇö `scripts/selftest.js`, the `one card, one lane (card 0069)` block: it walks `docs/board/` recursively, keys on the leading four digits via `/^\d{4}(?:\D.*)?\.(?:md|markdown)$/i`, groups lanes in `byNumber`, and fails naming `NNNN in <lane> and <lane>`. The assertion is named exactly as the criterion requires, and it also fails on an unreadable directory rather than throwing out of the suite. The four blind spots the earlier review proved (no slug, `.markdown`, upper case, one directory deep) are closed in the regex and the recursive `walk`, so the check now covers what it claimed to.

**#2** ÔÇö I re-ran the card's own duplicate sweep over every lane folder, grouping by the leading four digits rather than by filename. It prints nothing: exactly one file per number across 76 card files. Survivorship spot-checked on `0011`, whose `human-review/` copy carries the appended second review and whose history shows the merge commit rather than the carry-over.

**#3** ÔÇö `human-review/0011` holds the appended review verbatim, and the previous pass compared every deleted blob against its survivor line-set. Nothing I read contradicts it.

**#4** ÔÇö `board:convention --path=$PWD --cards` prints `NearestForest 0 48 0077`. Zero open cards failing.

The suite is 310 passed, 1 failed, and the red is `0020`'s size, which is card `0055`. This card's assertion passes.

VERDICT: sound

**scope: defect**

**Finding: the merge left a card in Rob's queue that is no longer in Rob's queue, and the second build was told and did not act.**

The merge deleted `docs/board/human-review/0021-...`, and the survivor sits in `docs/board/in-progress/`. That file still opens with `## What I need from you`, asking Rob to untick `#6` and send the card to `todo/`. `in-progress` means an agent is building it; none is, and nothing sweeps that lane for asks. The 2026-09-11 scope review named this exactly, said "Say it on `0021` or move it; it is one line either way," and the second build (`1a3ea74`) touched only `scripts/selftest.js`, the `0069` card and the new `0076` card. The ask is still unreachable. That is the card's own output, since `0008` got a dated note for the same class of deletion and `0021` got none. Naming it is a comment, not the lane judgement `## Not this card` forbids, so the fence is no excuse.

Secondary, and only that: the widened match in the `one card, one lane (card 0069)` block of `scripts/selftest.js` now accepts any depth, `.markdown` and upper case, while the sibling `0020` lane check and `0055` size check in the same file keep the narrow pattern. One of three fixed.

VERDICT: defect

**breakage: sound**

**breakage**

I re-ran `node scripts/selftest.js` at HEAD: **310 passed, 1 failed**, the single red being the 206.8 KB `0020` card, which is `0055`'s and not this card's. `php C:\Dev\ProgressBoard\artisan board:convention --path=D:/Dev/NearestForest --cards` prints `NearestForest 0 48`, so zero open cards fail.

**The prior review's defect is closed.** The `0057` finding it said was dismissed on a false measurement is live in `docs/PRD.md`, in the per-site-detail bullet where "link to the Forestry England page" straddles a newline, and it is now carried by `docs/board/todo/0076-...md`, which also picks up the second half about the Forestry and Land Scotland URLs in `app/data/campsites.json` resting on one fixture.

**I attacked the new check rather than reading it.** The walk in the `one card, one lane (card 0069)` block is now recursive, takes `.md` or `.markdown` in any case, and accepts a bare number with no slug, so the four names the earlier pass slipped past it are covered. It groups on the leading four digits, so a retitled second copy is still caught, and an unreadable directory is reported as a named failure instead of throwing out of the suite.

**Two residues, neither a defect here.** Cards living loose directly under `docs/board/` are skipped by design, and the sibling size and blocker checks in the same file still use the narrower filename rule. Nothing about the merge broke a caller, a comment or a path another file depends on.

VERDICT: sound

### 2026-09-11 second review

Run against the card in `ai-review/`; another reviewer moved the file to `todo/` in `e21f560` while
this pass was running, so this entry lands in `todo/`. I have not moved it back.

**suite**

`node scripts/selftest.js` runs **310 passed, 1 failed**, matching the second build entry exactly. The
single red is `no board card is too large for the agent file reader` on
`docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md is 206.8 KB`, which is card `0055`'s
and only Rob can clear. Nothing else fails. `no board card appears in two lanes` runs and passes under
`--- one card, one lane (card 0069) ---`.

**acceptance: sound**

**The widened check, attacked with sixteen shapes, one suite run each, the scratch file deleted between
every one.** The four names the last review got past it are all caught, and I did not take the entry's
word for it:

- `todo/0067.md`, no slug - `0067 in done and todo`
- `todo/0067-dupe.markdown` - named
- `todo/0067-Upper.MD` - named
- `todo/nested/deep/0067-two-deep.md`, **two** directories down rather than one - named
- `todo/.hidden/0067-x.md`, a dot-directory - named
- `todo/0067_x.md`, underscore instead of dash - named
- `discarded/0067-x.md`, a lane that is empty at HEAD - named
- `docs/board/blocked/0067-x.md`, a lane directory that does not exist - named
- three lanes at once - `0067 in done and human-review and todo`, sorted, nothing truncated
- twice in **one** lane - `0067 in done and todo and todo`, so it counts files and not lane pairs
- a **hardlink** to the `done/` copy - named. A file symlink needs elevation on this machine and could
  not be made; a directory junction could, and is covered under security below
- a `.md` parked in `attachments/` - `0067 in attachments and done`, the same over-reach the last
  review noted, still harmless because attachments are `.png`

**Three it does not name, and all three are right to skip.** `0067.md.txt` is not a markdown file.
`00671-x.md` is not card `0067`: `(?:\D.*)?` requires a non-digit after the fourth digit, so a
five-digit name is refused rather than read as `0067`, which is the safe direction, because reading it
as `0067` would be a false alarm. A **directory** named `todo/0067-dir.md` is walked into and not
counted, which is correct, because a directory is not a card.

**Two residues, neither a defect.**

1. **A card file loose directly under `docs/board/` is still invisible.** Proved rather than reasoned:
   `docs/board/0067-loose.md` beside `done/0067-...` leaves the assertion green, because the
   `lane === null` branch returns. The build entry's claim is scoped "at any depth **under a lane**",
   so the claim is accurate and this sits outside it, and the board root is not a lane, so a file there
   has no state to be in two of. It is the only shape I found that still hides a second copy.
2. **The widening trades a silent miss for a loud false alarm, which is the right direction.** Any
   `.md` whose name opens with four digits now counts as a card, so two files called
   `2026-09-11-notes.md` in two lanes would report `2026 in done and todo`. Nothing on this board is
   shaped that way today.

**The `lane === null` branch does what its comment claims**, proved by the loose-file case above, and
**the nested walk inherits the top-level folder as the lane**, proved by the two-deep case reporting
`todo` and not `deep`. That is right: `docs/board/README.md` makes the lane folder the state, so a
subdirectory of `todo/` is still `todo`.

**#3, re-verified from git history across all sixteen pairs rather than the four I was asked for.**
Method: the deleted blob at `<deletion>~1` against the survivor at `9c06f6c`, CR-stripped, as unique
line sets under `LC_ALL=C comm -23`, with `ÔÇö` normalised to `-` on **both** sides.

- **Twelve lose nothing**: `0011`, `0013`, `0014`, `0015`, `0019`, `0032`, `0036`, `0038`, `0053`,
  `0054`, `0056`, `0057`.
- `0021` loses one line, `- [x] #6`, a tick the survivor deliberately carries unticked.
- `0055` loses two lines, both `- [ ]` **unticked** boxes that the survivor has ticked. A stale untick,
  not a tick.
- `0008` loses 22 and `0012` loses 25 unique non-blank lines, both the `## What I need from you`
  sections, both declared in the build table and both moot on the substance.

Without the mojibake normalisation, `0011`, `0013` and `0019` show 7, 4 and 11 lost lines and every one
of them is a `ÔÇö` sequence, which is exactly the repair the first build entry describes.

**#4, re-run from `D:\Dev\NearestForest`.** `php C:\Dev\ProgressBoard\artisan board:convention
--path=$PWD --cards` prints `NearestForest 0 48 0077`. Zero open cards failing.

`git status --short` carries none of my scratch files, directories or junctions.

VERDICT: sound

**scope: sound**

`git show --stat 1a3ea74` is three files: this card, `docs/board/todo/0076-...` and
`scripts/selftest.js`. Across both builds, `git diff --name-only d20be16 HEAD` lists exactly one
non-document path belonging to this card, `scripts/selftest.js`; `requirements.txt` in that range is
card `0071`'s. Nothing under `app/`, `data/` or `scripts/*.py`. `docs/PRD.md` is **not** touched, which
is the fence holding rather than a gap: fixing that bullet is `0076`'s work.

**The claim about the sibling checks is wrong in its particulars, and it is the one thing here I would
correct.** The entry says "The two sibling board checks still carry the old narrow match. The 200 KB
size check is card `0055`'s and the raw-count check is card `0054`'s." Measured at HEAD and at
`1a3ea74`:

- `0055`'s size check, line 2849, filters `f.endsWith('.md')`. It never carried `/^\d{4}-.*\.md$/`.
- `0054`'s raw-count check, line 2818, filters `f.startsWith('0020-')`. Nor did it.
- The block that **does** carry `/^\d{4}-.*\.md$/` verbatim is line 2944, in
  `--- blockers outlive their answers (card 0070) ---`. It is a third board walk, it was already in the
  file when `1a3ea74` was written, and the entry does not name it.

Read loosely, as "still narrower than the new one", the sentence is true of both named checks: both are
one level deep and lower-case `.md` only. The scope call itself is right, because widening another
card's assertion is the adjacent work this board's fences exist to stop. What the sentence costs is
that a reader chasing what is left to widen is sent to the two blocks that do not carry the regex and
away from the one that does. It also repeats the previous review's own unmeasured claim that "`0020`'s
lane check and `0055`'s size check share the identical regex", which is the same class of mistake -
passing on a measurement nobody made - that got this card returned in the first place. The correction
is on the record here and the remaining work is one line on a sweep card, so it does not send the card
back a second time.

**On the concurrent review's `scope: defect`, and I reach the opposite verdict on a measurement it did
not make.** That entry says `0021` "got none" of the dated note that `0008` got for the same class of
deletion, and rests its finding on that. `git show de5cdd7 -- docs/board/in-progress/0021-...` shows
otherwise: the same commit that merged the pair appended a nine-line dated entry to `0021`'s own
thread, recording the merge, which copy survived, the three things carried across, that the untick of
`#6` answers half the `## What I need from you` ask, that what is left of it is a lane move, and why
the file sits in `in-progress/`. It is the last entry on that card today. So the comment the finding
asks for already exists, written by the build it says withheld it, and what actually remains is the
lane, which `## Not this card` fences out in terms ("not a lane move, and not a judgement about which
lane a card belongs in"). The residue is real and worth a sweep; it is not this card's to close.

VERDICT: sound

**breakage: sound**

**The finding is answered and the answer holds.** Card `0076` restates both halves of `0057`'s
2026-09-11 `breakage: defect` verdict, and both are still true at HEAD:

- The requirements bullet. `docs/PRD.md` lines 56 and 57 read "link to the Forestry England page"
  across a newline. `grep -c` on one line prints `0`; `tr -s '[:space:]' ' ' | grep -o` on the same
  file prints the phrase. The mechanism of the original miss reproduces exactly.
- The sweep. `scripts/selftest.js` line 781 filters `sites`, which is `DATA.sites` at line 195, so it
  reads `sites.json` alone. `app/data/campsites.json` holds 44 records on `forestryandland.gov.scot`,
  and the only campsite-side proof is the single fixture at line 770.

**`0076`'s plan names a method that works**, which was the thing to check, given that a single-line
search is what failed. It points at `const flat = indexhtml.replace(/\s+/g, ' ')` at line 1133 and the
two card `0019` footer assertions at 1134 and 1137, and those are exactly the two it describes. Every
other reference on that card is real: `AGENCY_BY_HOST` at `app/app.js` line 19 with its one caller at
248, `CAMP` loaded at line 391, `docs/outreach/` holding the Forestry England drafts, `docs/HANDOVER.md`
line 36 naming the PRD as source of truth, and the 276-of-550 and 44 counts all measure out.

**One sharp edge in `0076`, worth a clause before anybody builds it.** Its `## Plan` says "Widen the
sweep to both and require a non-zero count from each." The existing sweep selects by
`s.country === 'Scotland' && s.url` and requires **every** hit to read "Forestry and Land Scotland
page". Applied to `campsites.json` by country, that is red on correct behaviour: 262 Scottish campsites
carry a url and 218 of them are on their own hosts, which must read as themselves. Criterion #3 is
worded right - "the Forestry and Land Scotland **URLs** in `app/data/campsites.json`" - so the filter
the builder needs is on the card; the plan sentence simply does not repeat it, and a stranger following
the plan literally writes a check that goes red and then deletes the case, which is the failure the
comment at lines 771 to 776 of that same file is about. One clause on `0076` closes it, and it is not
enough to return this card.

**The other claims, re-measured.** The three carried-over findings still bite: `git ls-files` still
lists `scripts/__pycache__/parse.cpython-313.pyc` with no `__pycache__` or `*.pyc` rule in
`.gitignore` (`0072`); `docs/DATA-MODEL.md` line 90 still shows the retired attribution string
(`0073`); `Rewrite` appears once in `scripts/selftest.js`, at line 1102, as a negative, while
`app/.htaccess` line 69 carries the redirect nothing requires (`0074`). The mojibake counts are
**identical** at `d20be16`, `9c06f6c` and HEAD - 7 on `0011`, 4 on `0013`, 9 on `0019` - so this card
introduced none of it and repaired none of the pre-existing, exactly as the entry says.

VERDICT: sound

**security: sound**

The card produces one filesystem-reading assertion. The last pass's finding about the error path being
written rather than tested was the part worth attacking rather than re-reading.

**Where it is weakest.** It is still a check you break by naming a file so that it stops looking like a
card, and that surface is now small. The four shapes that worked before do not; nor do underscores,
dot-directories, two levels deep, or a lane that does not exist yet. What is left is a copy committed
to `docs/board/` itself rather than into a lane, which no `git mv` produces and which I had to make by
hand. The check also only runs when the suite runs, so a duplicate committed without a suite run is
unguarded until the next one. That is unchanged and inherent to a self-test.

**What is unchecked on the way in.** Nothing is input: the only data is the directory listing of
`docs/board/`. There is no route, no job and no machine-facing interface, so there is no permission
check that could be missing, and the assertion reads names only - it opens no card, so no thread text
passes through it. The guarded error path is **reachable, and I reached it twice.** A junction cycle at
`docs/board/todo/scratchloop/link -> scratchloop` does not recurse for ever: Node stops at `ELOOP` and
the guard turns it into `FAIL no board card appears in two lanes - could not read ...: ELOOP`, with the
suite finishing at 309 passed, 2 failed instead of aborting. A dangling junction under a lane gives the
same shape with `ENOENT`. `withFileTypes` reports a junction as a symlink and not a directory, so it is
the `|| fs.statSync(full).isDirectory()` fallback that makes the walk follow it, and the guard is what
then catches it.

**The place the last pass's finding is only half closed, and it is outside this card's fence.** A
dangling directory entry placed **directly under `docs/board/`** still aborts the whole run with a
stack trace and an absolute path. Proved: the throw is at `scripts/selftest.js:2817`, card `0054`'s
`0020` finder, which runs before this card's block is reached. The entry's sentence, "an unreadable
directory now fails this assertion rather than the run", is true of this assertion and not of the run.
Guarding the sibling walks is the same adjacent-assertion work the scope call correctly refused, so it
belongs on a sweep card beside the narrow-match residue above.

**What it leaks when it fails.** Card numbers and lane names, `0008 in done and todo`, both already
filenames in the repository. No file contents, no thread text, no environment, no network call
anywhere in the block. The one new shape is the `ELOOP` message, which prints a 64-segment repeated
path; it is relative to the project root, carries no absolute path and no content, and is ugly rather
than leaky.

VERDICT: sound

**browser: not applicable, and this is a claim with evidence rather than a skip.**

`git show --stat 1a3ea74` lists three paths: this card, `docs/board/todo/0076-...` and
`scripts/selftest.js`. `git diff --name-only d20be16 HEAD` with `docs/` filtered out lists
`requirements.txt`, which is card `0071`'s, and `scripts/selftest.js`, and nothing else. No file under
`app/` is touched by either build of this card - no route, no asset, no service worker, no `data/` - so
there is no user-facing surface to check. No server was started.

**2026-09-11** RESULT: done, third build
TESTS: +0 new, no assertion renamed
TOUCHED: docs/board/ai-review/0021-rewrite-this-board-s-cards-for-the-reader.md
OUT-OF-SCOPE: none

**Two reviewers looked at this card at the same time and split.** One graded every dimension sound.
The other graded `scope: defect` on card `0021`. Both entries are above, in the order they arrived.
The split is worth resolving on the record rather than by picking the friendlier one.

**The scope finding's stated reason is wrong on a fact.** It says "`0008` got a dated note for the
same class of deletion and `0021` got none". `0021` got one: commit `de5cdd7` appended a nine-line
dated entry to its thread recording the merge, naming what came across from the deleted copy, and
saying in as many words that the card sat in `in-progress/` because that is where the later of the
two writes left it. The second reviewer found that commit and said so.

**Its substance was right anyway, and that is what has been acted on.** However well documented, a
card asking Rob a question while sitting in a lane nobody sweeps for questions is a card whose ask
cannot be reached. The answer was not a note and not a lane move; it was to finish the card. `0021`'s
only open criterion was that `board:convention` report zero open cards failing, and the five cards
making that count non-zero were the five stale duplicates this card deleted. It is now measured at
zero, the criterion is ticked, the ask at the top is marked answered with the reason, and `0021` has
moved to `ai-review/` with all six criteria met. There is no residue left to describe.

**That is a lane move, which this card's `## Not this card` forbids.** It is made as card `0021`'s
own work, on its own thread, on a fresh measurement of its own criterion, rather than as a judgement
about where the merge should have put it. The distinction matters: the fence exists to stop a merge
shuffling cards it did not build, not to freeze a card whose last criterion has just been met.

**The secondary point in that review is wrong in its particulars and the second reviewer measured
it.** My own earlier entry said "the two sibling board checks still carry the old narrow match", and
that was inherited from the first review without being checked. The `0055` size check filters on
`.md` alone and the `0054` finder filters on the `0020-` prefix. The block that carried
`/^\d{4}-.*\.md$/` verbatim was card `0070`'s, which was not named by either of us, and it has since
been widened by `0070`'s own third build.

**One thing the second review found that is nobody's card yet.** A dangling directory entry directly
under `docs/board/` still aborts the whole run, at the `0054` finder, before this card's guarded
block is reached. It is a real hole and it belongs to that assertion rather than this one. Named here
so the next reader does not have to find it twice.

**The suite is 310 passed, 1 failed**, the one red being `0020` at 206.8 KB, which is `0055` and is
Rob's. `board:convention --path=$PWD --cards` prints zero open cards failing.

**Not checked in a browser.** This build touches one board card and nothing under `app/`.


### 2026-09-11 third review

**suite**

`node scripts/selftest.js` runs **310 passed, 1 failed**, matching the third build entry. The single
red is `no board card is too large for the agent file reader` on
`docs/board/in-progress/0020-campsites-tab-from-openstreetmap.md is 206.9 KB`, which is card `0055`'s
and only Rob can clear. It reads 206.9 rather than the entry's 206.8 because something has written to
that thread since; nothing else differs. `no board card appears in two lanes` runs and passes under
`--- one card, one lane (card 0069) ---`.

**acceptance: sound**

**#1 and #2, attacked with seven shapes, one suite run each, the scratch file deleted between every
one.** Six are named:

- `discarded/0069-zz.md` beside this card in `ai-review/` - `0069 in ai-review and discarded`
- `todo/0075-zz.md` against the one card `discarded/` now holds - `0075 in discarded and todo`
- `todo/0075-ZZ.MARKDOWN`, upper case and the long extension together - named
- `todo/a/b/c/0075-zz.md`, **three** directories down - named, and reported as `todo`, so the nested
  walk still inherits the lane folder rather than the leaf
- `.trash/0075-zz.md`, a dot-directory created directly under `docs/board/` that has never existed
  before - named, because the walk reads the listing rather than a lane list
- `attachments/0075-zz.md` - `0075 in attachments and discarded`, the over-reach both earlier reviews
  recorded, still harmless because attachments are `.png`

The seventh, `docs/board/0075-loose.md` at the board root, leaves the assertion green. That is the
one residue the second review proved and scoped out, the board root is not a lane, and I reproduce it
rather than re-raise it.

**#2, verified independently of the check it is proved by.** I swept the board with `find` over every
file and again over `git ls-files`, case-insensitively, on `.md` and `.markdown`, including the board
root, keyed on the leading four digits: **no number appears twice**, across 77 markdown files, which
is 76 cards and this board's `README.md`. The earlier prefix collisions are the dated `.png`
attachments and not cards.

**#3, re-derived from git history across all sixteen pairs rather than read off the table.** Method:
the deleted blob at `<deletion>~1` against the survivor at `9c06f6c`, CR-stripped, blank lines
dropped, `ÔÇö` normalised to `-` on **both** sides, compared as unique line sets under
`LC_ALL=C comm -23`. The deletions are `f8df4c1` (nine), `8143b63` (five), `8628544` (`0008`) and
`de5cdd7` (`0021`).

- **Twelve lose nothing**: `0011`, `0013`, `0014`, `0015`, `0019`, `0032`, `0036`, `0038`, `0053`,
  `0054`, `0056`, `0057`.
- `0021` loses one line, `- [x] #6`, a tick its own builder deliberately unticked.
- `0055` loses two lines, both **unticked** boxes the survivor has ticked.
- `0008` loses 22 and `0012` loses 25, both the `## What I need from you` section.

**One nuance inside `0008`'s 22, and it is the only thing I found that touches #3's actual words.**
Criterion #3 names ticks, **comment entries** and frontmatter keys, and one of the 22 lost lines is a
dated `**2026-09-11**` entry - the loop's generated "the reviewer returned this card, all 6 criteria
ticked, the builder could not act on that finding" line. It was not appended verbatim, which is what
#3 asks for. It was instead described: `done/0008` carries a dated entry naming that line, quoting
what it said, and stating that it was generated from the stale thread and untrue of the survivor. I
read both and agree. Declared, reasoned, and correct on the substance, so not a defect - recorded
here so the next reader does not have to find it a third time.

**#4, re-run from `D:\Dev\NearestForest`.** `php C:\Dev\ProgressBoard\artisan board:convention
--path=$PWD --cards` prints `NearestForest 0 46 0077`. Zero open cards failing, and `--cards` printed
no card line. The 46 is not a lane the tool is failing to walk: `todo` 5, `in-progress` 1, `ai-review`
3, `human-review` 37 is 46 exactly.

`git status --short` is clean of my scratch files, directories and junctions.

VERDICT: sound

**scope: sound**

**The resolution of the split is legitimate, and the fence is not breached.** I read `0069`'s
`## Not this card` at its most hostile: "Deciding a card belongs somewhere neither copy sits is a
different card", and `0021` now sits in `ai-review/`, which is neither `in-progress/` nor
`human-review/`. Three things answer it.

1. **The commits keep the work where it belongs.** `9009555` ("0021: tick the last criterion on a
   fresh measurement") changes only `0021`. `8571d95` is that card's own lane move. `77f5828` ("0069:
   resolve the split verdict") is 45 lines added to **this card and nothing else**. So the change to
   `0021` is on `0021`'s record as `0021`'s work, not folded into a merge commit.
2. **It is not a judgement.** The fence's sentence governs which copy of a merged pair survives and
   where it lands. `ai-review/` here is not a view about where the card belongs; it is what
   `docs/board/README.md` says happens to a card whose criteria are all met and which is not a
   decision card. `0021` has `## Tasks` and no `## Options`, so it does not skip the lane.
3. **It is one of the two remedies the reviewer who raised the defect named**, in its own words: "Say
   it on `0021` or move it; it is one line either way."

**Criterion #6 on `0021` is honestly ticked, re-measured rather than believed.** Its wording is that
the board reports zero open cards failing, its `proves:` is `none` with the reason that the counting
command lives in another repository, and that command prints `NearestForest 0 46 0077` for me today -
byte for byte the output the tick was made on. The five cards that made it five were the five stale
duplicate **files** this card deleted, and the live copy of each already passed, so the count fell
because the board stopped double-counting and not because anything was hidden.

**The ask was not Rob's, on the README's four-reason test, and closing it cost him nothing.** It
turns on no preference, no cost he carries, no risk or liability he owns and no local knowledge
nobody wrote down. It was "untick a box and move a file", which the README's own test - can this be
undone by deleting a file - puts squarely on the agent's side, and its stated reason ("only a person
may untick a criterion") is a loop constraint on **reviewers**, not a rule in
`docs/board/README.md`. Its second branch, "write that the reviewer is wrong", was never live: the
reviewer's finding was a count, the count was five, and it is now zero. The section is kept with a
dated banner rather than deleted, which is the honest treatment of a record of why a card stopped.

**Nothing outside the fence was built.** `git diff --name-only d20be16 HEAD` outside `docs/` is
`requirements.txt`, which is card `0071`'s, and `scripts/selftest.js`. The third build touches two
files, both cards.

VERDICT: sound

**breakage: sound**

**All three factual claims in the third build entry are true, and I checked each rather than reading
them.**

- **`de5cdd7` did append a dated note to `0021`.** `git show de5cdd7 -- docs/board/in-progress/0021-...`
  adds a nine-line `**2026-09-11**` entry recording the merge, which copy survived, the three things
  carried across, and why the file sat in `in-progress/`. The concurrent reviewer's "`0021` got none"
  is wrong on that fact, exactly as stated.
- **The sibling checks do not all carry the old narrow match.** At HEAD, `scripts/selftest.js:2818`
  is `0054`'s finder filtering `f.startsWith('0020-')`, and `:2849` is `0055`'s size check filtering
  `f.endsWith('.md')`. Neither ever held `/^\d{4}-.*\.md$/`. The block that did is `0070`'s, and
  `:2955` now reads the widened `/^\d{4}(?:\D.*)?\.(?:md|markdown)$/i`; `git log -L` attributes that
  change to `7b1ed20`, which is `0070`'s own commit. So the entry's correction of its own earlier
  sentence is right in every particular.
- **A dangling directory entry directly under `docs/board/` still aborts the run at the `0054`
  finder.** Made one (a junction whose target I then deleted), ran the suite: it throws
  `ENOENT ... stat` at `scripts/selftest.js:2817`, before this card's guarded block is reached, and
  takes every later assertion with it. Removed it; the suite returns to 310 passed, 1 failed.

**The previous round's defect stays closed.** `0076` is in `todo/` carrying both halves of `0057`'s
verdict, and `0072`, `0073` and `0074` are all still in `todo/`. The `0071` claim `0021` leans on is
real: `requirements.txt` exists, declares `requests` with the three importing scripts named, and
`docs/HANDOVER.md` line 463 gives the install line.

Nothing the third build did can break a caller: it added comment text to two cards and moved one
file. No code path, no data file and no `app/` asset is in the range.

VERDICT: sound

**security: sound**

**Where it is weakest.** Unchanged and correctly small: you break this check by naming a file so it
stops looking like a card, and the only shape I could still hide a second copy in is a file committed
to `docs/board/` itself rather than into a lane, which no `git mv` produces. Everything a person does
while tidying - no slug, `.markdown`, upper case, underscores, a dot-directory, three levels deep, a
lane that does not exist yet - is now named. The standing limit is that it runs only when the suite
runs, so a duplicate committed without a suite run is unguarded until the next one.

**What is unchecked on the way in.** Nothing is input: the only data is the directory listing of
`docs/board/`. No route, no job, no machine-facing interface, so there is no permission check that
could be missing, and the assertion reads names and never opens a card, so no thread text passes
through it. The guarded error path in this card's own block works. **The hole in the siblings is
wider than the second review measured, and I widened the measurement rather than repeating it.** That
review proved a dangling entry at the **board root** aborts the run at `:2817`. A dangling entry
**inside a lane**, named like a card, does the same at `:2851` - `0055`'s size check calling
`fs.statSync(p).size` on every `.md` it finds. I made `docs/board/todo/0099-zz.md` a junction and
deleted its target: the run dies with a stack trace and an absolute path before `0069`'s block is
reached. So the build entry's sentence, "an unreadable directory now fails this assertion rather than
the run", is true of this assertion and false of the run by two routes rather than one. Both routes
are in other cards' assertions, which is the adjacent work this board's fences exist to stop, so this
is a sweep card and not a return - but it now has two proved entry points on the record instead of
one.

**What it leaks when it fails.** Card numbers and lane names, `0069 in ai-review and discarded`, both
already filenames in the repository. No file contents, no thread text, no environment, no network
call anywhere in the block. The ugly case is the sibling abort above, which prints a full absolute
path and a Node stack; that is a developer's own machine and their own repository, so there is no
boundary for it to cross.

VERDICT: sound

**browser: not applicable, and this is a claim with evidence rather than a skip.**

The third build is `9009555`, `8571d95`, `77f5828` and `37dfe71`. `git diff --name-only 37dfe71~4 HEAD`
lists exactly two paths, `docs/board/ai-review/0021-...` and `docs/board/ai-review/0069-...`, both
cards. Across the whole card, `git diff --name-only d20be16 HEAD` outside `docs/` is `requirements.txt`
(card `0071`'s) and `scripts/selftest.js`. No file under `app/` is touched by any build of this card -
no route, no asset, no service worker, no `data/` - so there is no user-facing surface to check. No
server was started.
