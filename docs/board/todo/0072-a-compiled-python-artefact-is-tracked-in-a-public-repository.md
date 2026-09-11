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
- [ ] #1 THE REPOSITORY SHALL track no file under a `__pycache__` directory and no `*.pyc` file.
      proves: `no compiled python artefact is tracked`
- [ ] #2 WHEN the self-test suite runs, THE SUITE SHALL fail naming every tracked path matching
      `__pycache__` or `*.pyc`. proves: `no compiled python artefact is tracked`
- [ ] #3 `.gitignore` SHALL refuse `__pycache__/` and `*.pyc`, and the same assertion SHALL fail if
      either rule is absent. proves: `no compiled python artefact is tracked`
<!-- AC:END -->

## Tasks
- [ ] Write the assertion first and watch it name the one tracked artefact and the missing rules
- [ ] Add `__pycache__/` and `*.pyc` to `.gitignore`, with a comment saying which test created them
- [ ] `git rm --cached` the artefact and delete it from the working tree
- [ ] Re-run the suite and confirm a fresh `node scripts/selftest.js` leaves no new cache behind

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
