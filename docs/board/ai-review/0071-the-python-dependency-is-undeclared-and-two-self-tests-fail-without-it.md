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
- [x] #1 THE REPOSITORY SHALL declare `requests` as its one Python dependency in a file at the
      repository root, with the three scripts that import it named beside it. proves: `the python
      dependency list names every third-party import in scripts`
- [x] #2 WHEN the self-test suite runs, THE SUITE SHALL fail if any `scripts/*.py` imports a
      third-party module the dependency file does not list. proves: `the python dependency list
      names every third-party import in scripts`
- [x] #3 THE `How to pick up` SECTION of `docs/HANDOVER.md` SHALL name the install command before
      the first `python scripts/` line. proves: none - it is prose in a document, and no check here
      reads whether a sentence is in the right place
<!-- AC:END -->

## Tasks
- [x] Write the assertion first, against a dependency file that does not yet exist, and watch it red
- [x] Add `requirements.txt` naming `requests`
- [x] Add the install line to `docs/HANDOVER.md` under "How to pick up"
- [x] Install `requests` and confirm the two fetcher assertions go green

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

**2026-09-11** RESULT: done
TESTS: +1 new, `the python dependency list names every third-party import in scripts`
TOUCHED: requirements.txt (new), scripts/selftest.js, docs/HANDOVER.md
OUT-OF-SCOPE: none

**I had the clean interpreter, which `## Plan` asks me to say.** `python -c "import requests"` raised
`ModuleNotFoundError` at the start of this build, and the suite printed `305 passed, 3 failed` with
two of the three naming that error. So criterion #2's red was observable here rather than having to
be simulated.

**The imports, re-measured rather than carried forward.** Every `import` and `from` line across the
six files in `scripts/` was read. The only non-standard-library name is `requests`, in
`scripts/fetch.py` line 10, `scripts/fetch_campsites.py` line 18 and `scripts/build_boundary.py`
line 20. That is the same three the card names.

**The check asks python what its standard library is.** `sys.stdlib_module_names`, read through the
same `spawnSync` pattern the parser stubs in this suite already use. A hard-coded list was the
obvious alternative and it is wrong for this project: it would flag the first new standard-library
import as a missing dependency on the day somebody used it, and the fix would be to edit the test.
If python cannot answer, the assertion **fails** and names why. It does not skip. A check that
quietly skips is the thing this board keeps getting caught by, and it is what `## Not this card`
forbids two paragraphs further up.

**Red-proof, three runs.** Written and run before `requirements.txt` existed: red, naming
`scripts/build_boundary.py imports requests`, `scripts/fetch.py imports requests` and
`scripts/fetch_campsites.py imports requests`. It is committed in that red state, one commit before
the file was added, so the proof is in the history. Then `requirements.txt` was added and the same
run went green. Then, to show it is not a check that passes on anything, `import yaml` was appended
to `scripts/make_icons.py`, a file that had no third-party import at all, and the run named
`scripts/make_icons.py imports yaml`. That line was reverted with `git checkout` and `git status`
confirmed the tree clean.

**The suite after installing the module: 309 passed, 1 failed.** Both fetcher assertions are green,
and they were 2 of the 3 reds. The remaining one is `0020` at 206.8 KB against the reader limit,
which is card `0055`, which is deliberate, and which only Rob can clear.

**No version pin, and the reason is on the file.** Every call is `requests.get` with a timeout and a
user agent. `requirements.txt` names the three importing scripts beside the dependency, which is
criterion #1's second half, and carries the install command.

**Left alone deliberately.** Line 473 of `docs/HANDOVER.md` still reads `expect: all passed, 0
failed` beside the verify step, which is not what the suite prints while `0055` is open. That is the
card-size red, which `## Not this card` puts outside this fence, and card `0032` is the card about
handover claiming a suite result nothing re-measures.

**Not checked in a browser.** Nothing this card reaches `app/`.
