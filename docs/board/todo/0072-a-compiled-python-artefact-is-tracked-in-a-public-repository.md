# A compiled Python artefact is tracked in a public repository

## Why
**A file nobody wrote is in the repository, and the server pulls it on every deploy.**
`scripts/__pycache__/parse.cpython-313.pyc` is in `git ls-files`. It is 42 KB of CPython bytecode
frozen from a copy of `scripts/parse.py`, and nothing in the project reads it.

**What it costs.** Three things, and the third is the one that bites.

1. **It contradicts the project's own rule.** `CLAUDE.md` says data is generated and never
   hand-edited, and the repository holds source plus the one dataset it ships on purpose. A
   compiled artefact is neither, and this repository is public.
2. **It is frozen and cannot refresh.** The only thing that imports `scripts/parse.py` as a module
   is the `the build refuses a bad url (card 0013)` block in `scripts/selftest.js`, and that block
   now runs python with `PYTHONDONTWRITEBYTECODE=1`. So the environment variable that stops a new
   artefact appearing also stops this one being rewritten. It is bytecode of whatever `parse.py`
   said on 2026-09-11 and it will stay that way.
3. **It reads as a second copy of the function this project validates its whole dataset with.**
   `validate()` in `scripts/parse.py` is what refuses an off-site or non-HTTPS dataset URL. A reader
   who opens the cache file instead of the source is reading a version nobody can diff.

**How it came to be this way.** Card `0013` added a self-test that imports `scripts/parse.py` by
path, and CPython writes a bytecode cache beside the source when it does. `.gitignore` has entries
for a scrape cache, worktrees, keys, drafts and screenshots, and none for `__pycache__` or `*.pyc`,
so the file was untracked and invisible until `3464a3e` swept it in alongside a card move. The
`PYTHONDONTWRITEBYTECODE` guard was added after the artefact was already committed.

## Links

**Relates to**
- `0013` - the card whose self-test imports `parse.py` and created the artefact. Its 2026-09-11
  review is the finding this card comes from, and that card is in `done/`, so nobody would have
  picked the finding up off its thread.
- `0069` - the merge that carried that review onto the surviving copy of `0013` and raised this.

## Not this card
**Not changing what `scripts/selftest.js` imports or how.** The stub works and its
`PYTHONDONTWRITEBYTECODE` guard is right. This card removes a file and stops it coming back.

**Not a sweep of everything else `.gitignore` misses.** One artefact is tracked. A rule written from
one example beyond that is a rule nobody measured.

**Not touching `scripts/parse.py`.** Nothing about what the parser does changes here.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 THE REPOSITORY SHALL track no file under a `__pycache__` directory and no `*.pyc` file.
      proves: `no compiled python artefact is tracked`
- [ ] #2 WHEN the self-test suite runs, THE SUITE SHALL fail naming every tracked path matching
      `__pycache__` or `*.pyc`. proves: `no compiled python artefact is tracked`
- [ ] #3 `.gitignore` SHALL refuse `__pycache__/` and `*.pyc`, and the same assertion SHALL fail if
      either rule is absent. proves: `no compiled python artefact is tracked`
<!-- AC:END -->

## Tasks
- [x] Write the assertion first and watch it name the one tracked artefact and the missing rules
- [x] Add `__pycache__/` and `*.pyc` to `.gitignore`, with a comment saying which test created them
- [x] `git rm --cached` the artefact and delete it from the working tree
- [x] Re-run the suite and confirm a fresh `node scripts/selftest.js` leaves no new cache behind

## Plan
**Where to stand.** This repository, on a branch of `main`. There is no PHP suite here and no
`vendor/`, so `pest` and `pint` do not exist. The suite is `node scripts/selftest.js`. It is red at
HEAD on three assertions that are not yours: two are the undeclared `requests` module, which is card
`0071`, and one is a board card over the file-reader size limit, which is card `0055`.

**Confirm the defect**, from the repository root in Git Bash:

    git ls-files | grep pycache
    grep -n "pycache\|pyc" .gitignore

The first prints `scripts/__pycache__/parse.cpython-313.pyc`. The second prints nothing.

**The check goes in `scripts/selftest.js`**, with the repository-shape checks near the end, beside
`no board card appears in two lanes` and `no board card is too large for the agent file reader`. It
needs the tracked file list rather than a directory walk, because the artefact is on disk either
way and it is being tracked that is the fault: run `git ls-files` with `execFileSync` and filter.
Read `.gitignore` in the same block for the third criterion. Name the assertion exactly
`no compiled python artefact is tracked` so a criterion can name it.

**Red-proof it on the real defect, not a fixture.** The artefact is tracked at HEAD, so the first
run of a correct check is red naming it, before anything is deleted. That is the proof. Then, to
show it is not a check stuck red, remove the file from the index and watch the same run go green.
Then, to show the `.gitignore` half bites, delete one of the two new rules and confirm the run names
it.

**Removing it.** `git rm --cached scripts/__pycache__/parse.cpython-313.pyc` takes it out of the
index and leaves it on disk; delete the directory afterwards. Then run the suite once more and
confirm the directory has not reappeared, which is what proves the `PYTHONDONTWRITEBYTECODE` guard
in the three stub blocks covers every path that imports the parser.

## Comments

**2026-09-11** WRITTEN AFTER THE FINDING, NOT AFTER THE WORK. The criteria are the reviewer's
finding turned into checks and nothing here is built yet, so every box is honestly unticked. The
finding itself is the `breakage: defect` verdict of the 2026-09-11 review on card `0013`, which is
quoted in full on that card's thread in `done/`.

**2026-09-12** RESULT: done
TESTS: +1 new, all green
TOUCHED: scripts/selftest.js
TOUCHED: .gitignore
TOUCHED: scripts/__pycache__/parse.cpython-313.pyc (removed)
TOUCHED: docs/board/in-progress/0072-a-compiled-python-artefact-is-tracked-in-a-public-repository.md
OUT-OF-SCOPE: none

One assertion, `no compiled python artefact is tracked`, in `scripts/selftest.js` beside the other
repository-shape checks. It reads `git ls-files` through `execFileSync` rather than walking the
tree, because the cache reappearing on disk is fine and git carrying it is the fault, and it reads
`.gitignore` in the same block. Both halves are in one assertion on purpose, and the comment says
why: untracking the file without the rules leaves the repository one `git add -A` from where it
started, which is how the artefact arrived.

**Red-proofed four ways, on the real defect rather than a fixture.**

1. First run, at HEAD before anything was deleted: red naming all three reasons at once -
   `scripts/__pycache__/parse.cpython-313.pyc is tracked | .gitignore carries no __pycache__ rule |
   .gitignore carries no *.pyc rule`. That is criterion #1's defect and #3's, seen failing.
2. `git rm --cached` plus the two rules: green. So it is not a check stuck red.
3. Each `.gitignore` rule deleted on its own: red naming that one rule and not the other. Then both
   deleted and re-added as a comment line mentioning both patterns: still red on both, so a rule
   that exists only inside a comment does not count.
4. Criterion #2 says *every* tracked path, so a second artefact was forced in beside the first -
   `scripts/stray.pyc`, a `.pyc` outside any `__pycache__` directory - with `git add -f`. The run
   named both, not just the first. The `-f` was needed, which is the new rules refusing them.

The artefact is untracked and the directory is deleted. A fresh `node scripts/selftest.js` leaves
no `scripts/__pycache__` behind, so the `PYTHONDONTWRITEBYTECODE` guard does cover every path that
imports the parser, as the Plan asked to confirm.

**The suite is green except for one failure that is not this card's**: `no board card is too large
for the agent file reader`, card `0020` at 209.9 KB against a 200 KB limit. HANDOVER names that as
deliberate and card `0055` carries it. The Plan also expected two `requests` module failures for
card `0071`; both pass in this worktree, because the module is installed here. That is an
environment difference rather than anything fixed, and `0071` still holds the ask.

**`pest` and `pint` were not run, because this repository has neither.** There is no `vendor/` and
no PHP suite; the Plan says so and `ls vendor` confirms it. The suite is `node scripts/selftest.js`.

**Still needs a browser check**: nothing here touches `app/`, so there is nothing to look at, but
this was built in a worktree and Herd serves only the main checkout either way.

### 2026-09-12 review (v20260912140015-8d67)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I traced each criterion to the assertion block `no compiled python is committed (card 0072)` in `scripts/selftest.js`, and re-measured rather than trusting the build entry.

**#1** `git ls-files | grep -iE "pycache|\.pyc$"` returns nothing, so no compiled artefact is tracked. The file is gone from the index.

**#2** The block runs `git ls-files` through `execFileSync` and filters with `/(^|\/)__pycache__(\/|$)/` plus a case-insensitive `/\.pyc$/`, pushing one problem string per match and joining them all. It names every matching path, not the first, so a second artefact outside a cache directory would be reported too. It reads the index rather than the disk, which is what the criterion is about.

**#3** The same block reads `.gitignore`, trims, drops comment lines, and fails separately when no bare `__pycache__/` and when no `*.pyc` rule survives. A pattern that appears only inside a comment cannot satisfy it. Both rules are present at lines 22 and 23. Matching is exact-string, so a looser spelling such as a glob prefix would not count. That is stricter than the criterion, not weaker.

The suite runs green on this assertion: 315 passed, 1 failed, the one failure being the card 0020 size check that card 0055 carries and this card excludes.

I tried to break all three and could not.

VERDICT: sound

**scope: sound**

Scope only.

**The card's own commits are tight.** `4e5123b` (and its merge `ba843bb`) touch four paths: `.gitignore`, `scripts/selftest.js`, the removed artefact, and the card file. Nothing else.

**No fence crossed.** `scripts/parse.py` is untouched in the working tree and in that commit. The three stub blocks that import the parser are unchanged; the new block adds its own `execFileSync` and does not alter how anything is imported. The `.gitignore` addition is exactly the two rules the card names, `__pycache__/` and `*.pyc`, with the comment the second task asked for, and no wider sweep of other misses.

**Nothing left half done.** All four tasks are evidenced in the tree: the artefact is absent from `git ls-files`, both rules are present as bare non-comment lines, and the new assertion reads the tracked list plus `.gitignore` in one block as the plan directed.

**The large diff handed to me is not this card's.** It is the cumulative branch, carrying `requirements.txt`, `docs/PRD.md`, `docs/DATA-MODEL.md`, `docs/HANDOVER.md` and cards 0071, 0073, 0074, 0075, 0076, each landed by its own commit. Attributing that growth to 0072 would be wrong, and I checked commit by commit rather than by the summary.

One cosmetic staleness, not a scope fault: the build comment lists the card under `in-progress/` when it now sits in `ai-review/`.

VERDICT: sound

**breakage: defect**

**Finding: the only unguarded child process and unguarded file read in the suite, and both abort it.**

The card-0072 block in `scripts/selftest.js` calls `execFileSync('git', ['ls-files'])` with no try/catch. It is the sole `git` invocation in the file, and the only `execFileSync`; the thirteen other subprocess calls use `spawnSync`, which returns a status instead of throwing. Outside a git work tree, or with git off `PATH`, this throws mid-suite. Nothing catches it, so the fourteen later assertions, the `N passed, M failed` summary and the exit-code line never run. The suite dies with a stack trace instead of a named failure, which is the opposite of what card 0071's own comment in this same file promises for its interpreter probe: fail and name why, never skip.

The `.gitignore` read in the same block, `fs.readFileSync(path.join(ROOT, '.gitignore'))`, is unguarded the same way. Delete `.gitignore` and both required rules are absent, which is exactly the case criterion #3 names, and the assertion never reports: the read throws first.

Both are one try/catch each, pushing the reason onto `problems`.

UNMET: #3 deleting `.gitignore` makes both rules absent, but the unguarded read throws and the assertion never fails or names them
UNMET: #2 the unguarded `git ls-files` throws outside a work tree, so the suite aborts with a stack trace instead of failing and naming any tracked path

VERDICT: defect

**acceptance**

- **#3 reopened**, by the breakage lens: deleting `.gitignore` makes both rules absent, but the unguarded read throws and the assertion never fails or names them
- **#2 reopened**, by the breakage lens: the unguarded `git ls-files` throws outside a work tree, so the suite aborts with a stack trace instead of failing and naming any tracked path

**2026-09-17** RESULT: done
TESTS: +1 new, all green
TOUCHED: scripts/selftest.js
TOUCHED: docs/board/in-progress/0072-a-compiled-python-artefact-is-tracked-in-a-public-repository.md
OUT-OF-SCOPE: none

This fixes the 2026-09-12 review's breakage finding. Nothing else moved: `.gitignore`, `parse.py` and
the stub blocks are untouched.

The check is now a function of the root folder, `compiledPythonProblems(root, env)`, still inside
the card-0072 block and still reporting one assertion for the real tree. Each read has its own
try/catch. If `git ls-files` fails, the problem list gets
`git ls-files could not list the tracked files, so none were checked: <git's first stderr line>`.
If `.gitignore` cannot be read, it gets `.gitignore could not be read: <code>`, and both missing
rules are then named as well.

**The new test**, `no compiled python artefact is tracked: a failing git or a missing .gitignore is
named, not thrown`, runs the function against an empty temp folder that is neither a git work tree
nor holds a `.gitignore`. `GIT_CEILING_DIRECTORIES` stops git from finding a repository above it.
The test passes only if the function returns the git reason and both rule reasons. If the function
throws, the test catches that and fails with the message, so a throw is a named failure here too.

**Seen failing twice, one reason each, before either guard went in:**
1. With no guards: red, `threw instead of failing: Command failed: git ls-files`. That is #2's defect.
2. With only the git guard: red, `threw instead of failing: ENOENT ... .gitignore`. That is #3's defect.
3. With both guards: green.

**Checked on the real tree too:** with `.gitignore` moved aside, the main assertion fails with
`.gitignore could not be read: ENOENT | .gitignore carries no __pycache__ rule | .gitignore carries
no *.pyc rule`. The suite still prints its `N passed, M failed` summary. The file was then put back.

**The "git off PATH" case was not run on its own.** It is the same `execFileSync` throw as "not a
work tree", and the same catch handles both. I did not remove git from PATH to prove that.

Suite: 315 passed, 1 failed. The one failure is `no board card is too large for the agent file
reader` (card 0020), which card 0055 carries. A fresh run leaves no `scripts/__pycache__`, and
`git ls-files` shows no compiled artefact. **`pest` and `pint` were not run** because this
repository has no `vendor/` and no PHP suite. **Still needs a browser check:** none applies, since
nothing under `app/` changed.

### 2026-09-17 review (v20260917090022-bc91)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I checked each criterion against the code and could not disprove any of them.

**#1 (no compiled Python is tracked).** I re-ran it myself: `git ls-files` lists nothing matching `pycache` or `.pyc`.

**#2 (the suite fails naming every tracked artefact).** This is `compiledPythonProblems` in `scripts/selftest.js`. It reads `git ls-files` through `execFileSync` and adds one problem for every path inside a `__pycache__` folder or ending in `.pyc`. The `ok('no compiled python artefact is tracked', ÔÇª)` call joins them all into one message. If git fails, a try/catch records git's own reason instead of letting the throw abort the suite, which fixes the last review's finding.

**#3 (`.gitignore` refuses both, and the check fails if either rule is missing).** The same function reads `.gitignore`, skips comment lines and fails on each missing rule separately. Both rules are there, on lines 22 and 23. A missing file is now reported as a problem, and both rules are then named as absent. The second assertion, `ÔÇªa failing git or a missing .gitignore is named, not thrown`, runs the function against an empty temp folder and proves both guards work.

One gap that disproves no criterion: git quotes file names with non-ASCII characters, so a `.pyc` with such a name would end in a quote mark and the `.pyc` match would miss it. The `.gitignore` rules still refuse it.

VERDICT: sound

**scope: sound**

I couldn't find anything in card 0072's work that goes beyond what the card asked for, or anything left unfinished.

**The second build stayed inside the review's finding.** Commit `6479a27` changes two files: `scripts/selftest.js` and the card itself. In `selftest.js`, the card-0072 block now has its check in a function, `compiledPythonProblems(root, env)`. The `git ls-files` call and the `.gitignore` read each have their own try/catch, and a failure adds a named problem instead of crashing the suite. The one new assertion runs that function against an empty temp folder. That is the review's "one try/catch each", plus a test showing it works. `.gitignore`, `scripts/parse.py` and the three blocks that import the parser are untouched.

**No fence crossed.** Nothing about how `selftest.js` imports the parser changed. `.gitignore` gained only the two rules the card names, so there is no wider sweep. The first build's commit `4e5123b` touches `.gitignore`, `selftest.js` and the removed artefact, and nothing else. Everything else in the large diff (`requirements.txt`, the PRD, DATA-MODEL and HANDOVER docs, and cards 0069 to 0076) came in through other cards' own commits.

**Nothing left half done.** No compiled file is tracked, both rules are real lines rather than comments, and the error guards are covered by the new assertion. The only loose end is cosmetic: both build notes on the card still give its path as `in-progress/`, but the card now sits in `ai-review/`.

This finding disproves no criterion.

VERDICT: sound

**breakage: defect**

**Finding 1: a tracked artefact whose name git quotes is never named.** In `scripts/selftest.js`, `compiledPythonProblems` runs `git ls-files` without `-z`. By default git's `core.quotePath` setting wraps some paths in double quotes and escapes them: any path with a non-ASCII byte, a `"`, a backslash or a control character. So `scripts/caf├®.pyc` comes out as `"scripts/caf\303\251.pyc"`. That line ends in `"`, so the `/\.pyc$/i` test misses it. A top-level `"__pycache__/x.pyc"` has a `"` before `__pycache__` rather than the start of the line or a `/`, so the cache-directory test misses it too. The suite goes green while a compiled file is tracked. Running `git ls-files -z` and splitting on `\0` fixes it.

**Finding 2: a negated rule still counts as refusing.** The rule check in `compiledPythonProblems` only asks whether a bare `*.pyc` or `__pycache__/` line exists. If a later line reads `!*.pyc` or `!__pycache__/`, git no longer ignores those files, so `git add -A` would pick them up again. The assertion still passes, because nothing looks at `!` lines after the rule. Criterion #3 says `.gitignore` shall refuse the files, so the rule has to take effect, not just be present. `git check-ignore` against a sample path would test what git actually does.

UNMET: #2 `git ls-files` without `-z` quotes non-ASCII or special-character paths, so a tracked `.pyc` like that fails both path tests and is never named
UNMET: #3 a later `!*.pyc` or `!__pycache__/` line cancels the rule, but the assertion only checks the rule is there, so it stays green while `.gitignore` refuses nothing

VERDICT: defect

**acceptance**

- **#2 reopened**, by the breakage lens: `git ls-files` without `-z` quotes non-ASCII or special-character paths, so a tracked `.pyc` like that fails both path tests and is never named
- **#3 reopened**, by the breakage lens: a later `!*.pyc` or `!__pycache__/` line cancels the rule, but the assertion only checks the rule is there, so it stays green while `.gitignore` refuses nothing

