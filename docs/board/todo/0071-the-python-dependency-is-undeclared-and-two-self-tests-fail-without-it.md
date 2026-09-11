# The one Python dependency is written down nowhere, and two self-tests fail without it

## Why
**A fresh checkout cannot run two assertions in the suite, and nothing in the repository says why.**
Measured on 2026-09-11 in a build worktree, `node scripts/selftest.js` printed `303 passed, 3
failed`. One of the three is the card-size assertion `docs/HANDOVER.md` declares deliberate. The
other two are not:

```
- fetch records a download date alongside every cached page - the stub fetch wrote no page:
    File "scripts/fetch.py", line 10, in <module>
      import requests
    ModuleNotFoundError: No module named 'requests'
- a short answer from Overpass is refused rather than cached as the dataset - the stub fetcher
  reported nothing: ModuleNotFoundError: No module named 'requests'
```

**`requests` is the only third-party module this project uses**, imported by `scripts/fetch.py`,
`scripts/fetch_campsites.py` and `scripts/build_boundary.py`, and it is named in no
`requirements.txt`, no `pyproject.toml` and nowhere in `docs/HANDOVER.md`. Neither file exists.

**What it costs.** A red that is really a missing module has to be diagnosed before it can be
dismissed, and it trains the next session to skim past reds, on a project whose named recurring
defect is checks that cannot fail. It is also the whole pipeline: `docs/HANDOVER.md` "How to pick
up" opens with `python scripts/fetch.py` and says nothing about installing anything, so a session on
a clean machine hits an import error as its first action.

**How it came to be this way**, as far as the repository says. No commit and no document mentions
the dependency at all, so nothing records a decision to leave it out. `requests` was installed on
the machine every earlier run used, and a dependency that is always present is one nobody is made to
write down.

## Links

**Relates to**
- `0021` - the card whose unattended run measured this. It changed no code, so the two reds were
  not its doing and it could not report a green suite.
- `0055` - it added the third failing assertion, the 200 KB card-size check, whose red is
  deliberate and is not this card's business.

## Not this card
**Not adding a virtual environment, a lockfile or a package manager.** One dependency does not need
a toolchain, and this project's whole shape is "no build step".

**Not making the two tests skip when the module is missing.** A check that quietly skips is worse
than one that fails, and this board has been caught by that shape before.

**Not the card-size red.** That is `0055` and it is on purpose.

**Not touching any fetcher's behaviour.** Nothing about what the scripts do changes here.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 THE REPOSITORY SHALL declare `requests` as its one Python dependency in a file at the
      repository root, with the three scripts that import it named beside it. proves: `the python
      dependency list names every third-party import in scripts`
- [ ] #2 WHEN the self-test suite runs, THE SUITE SHALL fail if any `scripts/*.py` imports a
      third-party module the dependency file does not list. proves: `the python dependency list
      names every third-party import in scripts`
- [ ] #3 THE `How to pick up` SECTION of `docs/HANDOVER.md` SHALL name the install command before
      the first `python scripts/` line. proves: none - it is prose in a document, and no check here
      reads whether a sentence is in the right place
<!-- AC:END -->

## Tasks
- [ ] Write the assertion first, against a dependency file that does not yet exist, and watch it red
- [ ] Add `requirements.txt` naming `requests`
- [ ] Add the install line to `docs/HANDOVER.md` under "How to pick up"
- [ ] Install `requests` and confirm the two fetcher assertions go green

## Plan
**Where to stand.** This repository, on a branch of `main`. There is no PHP suite and no `vendor/`,
so `pest` and `pint` do not exist. The suite is `node scripts/selftest.js`.

**Confirm the reds are the module and not the code**, from the repository root in PowerShell:

    python -c "import requests"
    node scripts/selftest.js

The first should raise `ModuleNotFoundError` and the second should print three failures, two of them
naming that error. **If `requests` is already installed where you are**, only the card-size red
remains; the dependency is still undeclared, but you will need a clean interpreter to see the red
criterion #2 describes. Say in your comment entry which of the two you had.

**Find the imports the check has to cover** with a grep for `import` and `from` lines over
`scripts/*.py`. On 2026-09-11 the only non-stdlib hit was `requests`, in `scripts/fetch.py` line 10,
`scripts/fetch_campsites.py` line 18 and `scripts/build_boundary.py` line 20.

**The check goes in `scripts/selftest.js`**, with the other repository-shape checks near lines 2824
and 2855. It reads every `scripts/*.py`, collects top-level `import X` and `from X import` names,
subtracts the standard library, and fails on anything left that `requirements.txt` does not list.
Name it exactly `the python dependency list names every third-party import in scripts`.

**Red-proof it on the real defect.** Write the check before `requirements.txt` exists and its first
run is red naming `requests` and the three files. Then add the file and watch it go green. Then, to
show it is not a check that passes on anything, add `import yaml` to a scratch copy of one script
and confirm it is named.

**The install line for `docs/HANDOVER.md`:** `python -m pip install -r requirements.txt`, placed
above the `python scripts/fetch.py` line in "How to pick up".

## Comments

**2026-09-11** Raised by an unattended run of card `0021`, which had to report a red suite and
establish that two of the three reds were the environment rather than the tree. Not fixed there:
that card changes no code and touches only `docs/board/`.
