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
- [ ] #1 WHEN the deploy trigger is run on Linux with no `pwsh`, THE REPOSITORY SHALL offer a bash
      (or Python) trigger with the same steps, flags (`--dry-run`, `--skip-test`, `--force`) and
      refusals as `scripts/deploy.ps1`, so `deploy.ps1` is no longer the only route. proves: the new
      trigger run with `--dry-run` on a branch whose `app/` change did not bump `CACHE` refuses
      with the same message, and with `CACHE` bumped prints the push and SSH lines it would run
- [ ] #2 WHEN an agent reads `CLAUDE.md`, `HUMAN_ACTIONS.md` or `docs/HANDOVER.md` for how to run,
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
