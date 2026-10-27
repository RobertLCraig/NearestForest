# The only deploy route is a PowerShell script, and the run docs assume Herd and C:\Dev, so Ubuntu cannot ship

## Why
Dev work and the unattended loop are moving from the Windows PC to the Ubuntu VM `ubuntu-dev`
(code in `/home/rob/dev`, PHP CLI, Node and Python, no `pwsh`, no Laravel Herd). The plan is
`C:\Dev\SecondBrain\outputs\2026-10-16 Plan to move dev work and the loop to ubuntu-dev.md`. A
read of this repository on 2026-10-27 found two kinds of Windows assumption:

- **The local deploy half is PowerShell only.** `scripts/deploy.ps1` is the one way to ship: it
  runs `node scripts/selftest.js`, refuses an `app/` change whose `CACHE` in `app/sw.js` was not
  bumped, refuses a dirty tree, pushes, then runs `scripts/deploy.sh` on the host over SSH.
  `CLAUDE.md`, `HUMAN_ACTIONS.md` and `docs/HANDOVER.md` all say `pwsh ./scripts/deploy.ps1`. With
  no `pwsh` on the VM there is no deploy and, worse, no cache-key guard. The server half,
  `scripts/deploy.sh`, is already bash, LF-pinned by `.gitattributes` and run as `bash <path>`, so
  its `100644` mode does not matter.
- **The run docs name Windows paths and Herd.** `docs/HANDOVER.md` says Herd serves the main
  checkout ("Herd only ever serves `C:\Dev\NearestForest`"), its "How to pick up" block starts
  `cd C:/Dev/NearestForest`, and it and `docs/DECISIONS.md` place the Mo~oM icon pack at
  `C:\Dev\Mo~oM 2.2`. On the VM there is no Herd, the checkout is `/home/rob/dev/NearestForest`,
  and the icon pack is not a git repository, so it only exists there if somebody copies it.

The Python scripts (`scripts/*.py`) and `scripts/selftest.js` were read for drive letters,
backslash joins and Windows-only modules and carry none. Open card `0082` names
`%LOCALAPPDATA%\ProgressBoard\worktrees` and `php C:\Dev\ProgressBoard\artisan`, but its fault is
ProgressBoard's and it is left alone here.

## Not this card
Changing what the deploy does, the host, or `scripts/deploy.sh`. Actually deploying: the card is
built and proved with `--dry-run` only. Copying the Mo~oM pack to the VM. Editing `0082`.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN the deploy trigger is run on Linux with no `pwsh`, THE REPOSITORY SHALL offer a bash
      (or Python) trigger with the same steps, flags (`--dry-run`, `--skip-test`, `--force`) and
      refusals as `scripts/deploy.ps1`, so `deploy.ps1` is no longer the only route. proves: the new
      trigger run with `--dry-run` on a branch whose `app/` change did not bump `CACHE` refuses
      with the same message, and with `CACHE` bumped prints the push and SSH lines it would run
- [x] #2 WHEN an agent reads `CLAUDE.md`, `HUMAN_ACTIONS.md` or `docs/HANDOVER.md` for how to run,
      serve or deploy, THE DOCS SHALL give a form that works on the VM (repo-relative paths,
      `php -S` instead of Herd, the new trigger) and say where the Mo~oM pack is expected on Linux.
      proves: `git grep -n -e "pwsh" -e "C:/Dev" -e "Herd only"` over those three files and
      `docs/DECISIONS.md` matches only lines that also give the Linux form
<!-- AC:END -->

## Tasks
- [ ] Read `scripts/deploy.ps1` end to end and list its five steps and every `throw`
- [ ] Write the Linux trigger next to it in `scripts/`, LF, with the executable bit set in git
      (`git update-index --chmod=+x`)
- [ ] Add a check to `scripts/selftest.js` or a small shell test that runs the dry run against a
      throwaway branch, watched red first
- [ ] Update the run, serve and deploy lines in the three docs and the icon pack path

## Plan
`scripts/deploy.ps1` is 145 lines and has no Windows-only call: `git`, `node` and `ssh` only.
Keep `SshHost` as the `~/.ssh/config` alias `hostinger`, so no account detail enters the repo. Keep
`deploy.ps1` while the PC is still in use; decide later whether to delete it. A real deploy is an
outward effect, so the builder proves #1 by dry run only.

## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-10-27** RESULT: done
TESTS: +3 new, all green (node scripts/selftest.js 348 passed, 0 failed)
TOUCHED: scripts/deploy.py
TOUCHED: scripts/selftest.js
TOUCHED: .gitattributes
TOUCHED: CLAUDE.md
TOUCHED: HUMAN_ACTIONS.md
TOUCHED: docs/HANDOVER.md
OUT-OF-SCOPE: none

#1: the trigger is Python, not bash (the card allows either): scripts/deploy.py, stdlib only, LF-pinned in .gitattributes, mode 100755. Same five steps, flags and refusal texts as deploy.ps1, with --force/--branch spelt the Linux way. Python was picked because selftest already drives python on Windows; bash from node on Windows can resolve to WSL bash.
Proof: selftest runs it with --dry-run in a throwaway repo (origin/main is a local ref): stale CACHE refused, --force ships, bumped CACHE prints the git push and ssh lines. Watched red with the guard short-circuited (exit 0 on a stale CACHE); a first patch that changed nothing was caught and redone.
#2: the criterion grep over the four files now matches only lines that also give the Linux form. Mo~oM pack: HANDOVER says ~/dev/Mo~oM 2.2/Icons-SVG on Linux. That path is my assumption from the /home/rob/dev layout; nothing in the repo decides it. DECISIONS.md left alone (append-only; the grep does not match it).
No Pest or Pint: this repo has no vendor/, the suite is node scripts/selftest.js. Not run on the VM itself, and no real deploy (dry run only, per the card).

### 2026-10-27 review (v20261027101308-c100)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I tried to break both criteria. I could not break either one.

**#1. A deploy trigger that does not need `pwsh`.**
- The code is `scripts/deploy.py`. It is one script at module level, and it uses the functions `die`, `git` and `step`.
- It has the same five steps as `scripts/deploy.ps1`, and it refuses in the same places. Every `throw` in `deploy.ps1` has a `die(...)` in `deploy.py` with the same text. The only change is the flag spelling: `--force` and `--branch`, not `-Force` and `-Branch`.
- The cache check reads the same diff line in both scripts (`+var CACHE`).
- The test is in the `card 0087` block of `scripts/selftest.js`. It runs `--dry-run` in a temporary copy of the repo. A stale `CACHE` is refused with the same message. A bumped `CACHE` prints both the `git push` line and the `ssh hostinger` line.

**#2. Docs that work on the Linux VM.**
- I ran the criterion `git grep` over `CLAUDE.md`, `HUMAN_ACTIONS.md`, `docs/HANDOVER.md` and `docs/DECISIONS.md`. It found 9 lines. Each line also gives the Linux form: `python3 scripts/deploy.py`, `php -S`, or `~/dev/NearestForest`.
- Nothing in `docs/DECISIONS.md` matches.
- `docs/HANDOVER.md` says where the Mo~oM pack should be on Linux.

**One small note.** It is not a defect. The Linux path for the Mo~oM pack (`~/dev/Mo~oM 2.2`) is a guess by the builder. They say so on the card. The criterion only asks the docs to state a path, so this is enough.

You do not need to do anything for this card.

VERDICT: sound

**scope: sound**

I found no scope defect. The change stays inside the card.

**What I checked:**
- `scripts/deploy.sh`, the host and the deploy steps are not changed. That fence holds.
- No real deploy was run. The proof is a dry run in a throwaway repo, inside the `selftest.js` block for card 0087.
- Card `0082` and `docs/DECISIONS.md` are not touched. The Mo~oM pack is not copied.
- The extra line in `.gitattributes` is not scope growth. The card's task asks for an LF file, and that line pins it.
- `deploy.py` has the same five steps and the same throws as `deploy.ps1`: wrong branch, tests failed, stale CACHE, dirty tree, no origin, push failed. Only the flag spelling differs (`--force` for `-Force`), and that is correct for Linux.
- I ran the criterion #2 grep over the four files. Every match also gives the Linux form or `php -S`.

**Nothing is left half done.** One small point is not a defect: the Linux Mo~oM path `~/dev/Mo~oM 2.2/Icons-SVG` is the builder's guess. The card asks only where the pack is "expected", so a guess meets it.

VERDICT: sound

**breakage: sound**

I tried to break this work and could not.

**What I checked:**

- **The grep from criterion #2.** I ran it over `CLAUDE.md`, `HUMAN_ACTIONS.md`, `docs/HANDOVER.md` and `docs/DECISIONS.md`. It finds 9 lines. Each of those lines also gives the Linux form: `python3 scripts/deploy.py`, `php -S`, or `~/dev/NearestForest`. `DECISIONS.md` gives no match.
- **Criterion #1, the steps and refusals.** `scripts/deploy.ps1` has 6 `throw` lines: wrong branch, self-tests failed, stale cache key, dirty tree, no origin, and push failed. `scripts/deploy.py` has the same 6, as `die()` calls in the same order with the same text. The dirty-tree refusal is skipped in a dry run, which is also what `deploy.ps1` does. The one change in the text is the flag names (`--force` and `--branch`, not `-Force` and `-Branch`). That is correct on Linux.
- **The new selftest block.** It finds Python with `process.env.PYTHON || 'python'`. Four older blocks in `scripts/selftest.js` already do this, so it adds no new failure on the VM. The test makes its own throwaway repository and pushes nothing.
- **Comments and docstrings.** The docstring in `deploy.py` is still true. The text that the diff changed in the three docs agrees with the code.

**One gap, not a defect:** the Mo~oM path `~/dev/Mo~oM 2.2/Icons-SVG` is a guess. The builder said so on the card. The card only asks the docs to say where the pack is expected, and they do.

No criterion is unmet.

VERDICT: sound

