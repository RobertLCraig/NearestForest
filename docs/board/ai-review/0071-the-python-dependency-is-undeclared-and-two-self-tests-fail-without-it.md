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

### 2026-09-11 review

**suite**

`node scripts/selftest.js` on a clean tree: **309 passed, 1 failed**, the one red being `0020` at
206.8 KB, which is `0055` and is Rob's to clear. That is the build entry's number exactly.

One caution for whoever reads this next. My first run printed `308 passed, 2 failed`, the extra red
being `no board card appears in two lanes - 0008 in done and todo`. That was a second session
working this board at the same moment, leaving untracked scratch cards (`0008-x.md`,
`0008-y.md`) in the lanes while it attacked `0069`. They vanished between two of my commands. It is
not this card's doing and the number reproduces once the board is still.

**acceptance: sound**

`the python dependency list names every third-party import in scripts` is the name the runner
prints, spelled the same in criteria #1 and #2. It runs and it passes.

**#1** `requirements.txt` exists at the repository root and names `requests`. Its second half, the
three importing scripts named beside it, is also met: the file lists `scripts/fetch.py`,
`scripts/fetch_campsites.py` and `scripts/build_boundary.py`. **The named test does not prove that
half.** Strip every comment out of `requirements.txt` and the check stays green, because it reads
only the bare requirement tokens. The criterion is met by inspection, not by the test it names. It
is not a criterion silent about its proof, which is what the README refuses, but it names a test
that settles part of itself.

**#2** is the criterion I spent the pass on and it holds under everything I could think to throw at
it. I lifted the block verbatim out of `scripts/selftest.js` into a standalone harness taking `ROOT`
from `argv`, confirmed it reproduces the real result against this repository, and ran 37 fixtures
through it.

Named correctly, every one: `import yaml`; `from yaml import safe_load`; `import numpy as np`;
`import a.b.c` (names `a`); `import requests, yaml` on one line (names `yaml` only); an import
indented inside a `def`, inside a `try:`, and inside `if TYPE_CHECKING:`; a tab-indented import; a
parenthesised `from yaml import (` spanning lines; and `import json, math, os, re, sys, html as
htmllib`, where the `as` clause is stripped correctly. Correctly silent on `from . import x`,
`from .mod import x` and `from __future__ import annotations`.

Requirements grammar, all parsed to the right name: `requests==2.31.0`, `requests>=2.0`,
`requests~=2.31`, `requests!=2.0`, `requests[socks]`, `requests[socks]>=2.0,<3`,
`requests ; python_version >= '3.8'`, `requests  # the http client`, and `REQUESTS` against
`import requests`. The exotic forms (`-r other.txt`, `-e .`, a bare wheel URL, and the PEP 508
`requests @ https://...`) are not understood, and every one of them **fails closed**: the check goes
red rather than green. A direct reference would be a false red, but red is the safe direction and
none of those forms is in the file.

Deleting `requirements.txt` fails two ways over: with a third-party import present it names the
import, and with nothing but stdlib imports the explicit `requirements.txt does not exist` branch
catches it. An empty-but-present file with no third-party imports passes, which is correct.

**#3** is `proves: none` with its reason on the line, which the README permits and counts. Checked by
eye: `python -m pip install -r requirements.txt` is `docs/HANDOVER.md` line 463, the first
`python scripts/` line is 473. The install command is above it.

I also re-proved the red rather than taking the build entry's word. `git show 52a4f03:requirements.txt`
fails with `path 'requirements.txt' exists on disk, but not in '52a4f03'`, and that commit touches
`scripts/selftest.js` and nothing else. I extracted the block **as committed at 52a4f03** into its
own harness and ran it against a copy of `scripts/` with no `requirements.txt`: red, naming
`scripts/build_boundary.py imports requests | scripts/fetch.py imports requests |
scripts/fetch_campsites.py imports requests`. Better than that, `diff` of the block between
`52a4f03` and `HEAD` is empty. The check that went green is byte-for-byte the check that was red, so
it was not tuned to pass.

The import survey is mine, not carried forward: `grep -nE '^[[:space:]]*(import |from [A-Za-z_.])' scripts/*.py`
over all six files. `requests` is the only non-stdlib name, at `fetch.py:10`, `fetch_campsites.py:18`
and `build_boundary.py:20`. The card's three files are the right three.

VERDICT: sound

**scope: sound**

Every fence in `## Not this card` held, and I checked the diff rather than the prose.
`git diff --name-only e8026a8 5aadd40` is four files: `docs/HANDOVER.md`, this card,
`requirements.txt`, `scripts/selftest.js`. No `scripts/*.py` changed at all, so "not touching any
fetcher's behaviour" is true by construction. No virtual environment, no lockfile, no package
manager: an unpinned `requirements.txt` is the input pip already reads, and criterion #1 asked for a
file at the root. No skip path exists anywhere in the block, which is the fence that mattered most.
The card-size red is untouched.

The `docs/HANDOVER.md` scope call is fair, not a dodge. `expect: all passed, 0 failed` beside the
verify step is a suite result nothing re-measures, and
`docs/board/human-review/0032-handover-carries-a-self-test-count-nothing-re-measures.md` is exactly
that card, sitting in `human-review/` waiting on Rob to choose between two options. Fixing it here
would have been building an adjacent thing.

One staleness in the build entry itself: it cites "line 473" for that text, and the card's own
six-line insertion pushed it to 479. Line 473 now holds `python scripts/fetch.py`. A reader
following the pointer lands on the wrong line.

VERDICT: sound

**breakage: defect**

Most of what I attacked held, and I have said where above. What follows is what did not.

**The block prescribes a remedy that provably does not work.** Its own comment says:

> Where a distribution installs under a different name than it imports, requirements.txt has to
> carry the import name in a comment for this to see it

The parser strips comments before it reads anything: `.map(l => l.replace(/#.*$/, '').trim())`. I
tested it both ways somebody would write it. `beautifulsoup4  # imports as bs4` against `import bs4`
stays red. `beautifulsoup4` on one line and `# bs4` on the next, against `import bs4`, stays red.
So does `Pillow` against `from PIL import Image`. There is no comment anywhere in that file the
check can see, and the escape hatch it documents does not exist.

Nothing is broken today, because there is one dependency and its two names match, and the comment
says so. The cost lands on the next session that adds `beautifulsoup4` or `Pillow`. It reads the
instruction, writes the comment, is still red, and the only move left in front of it is to edit the
test. That is the failure this same block's other comment says it was designed to avoid, in those
words: a hard-coded list "would flag the first new standard-library import as a missing dependency
on the day somebody used it, and the fix would be to edit the test". The check dodged that trap for
stdlib and walked into it for distribution names, while documenting an exit that is not there.

It is a one-line fix either way. Delete the sentence and say the case needs a code change when it
arrives, or make it true by collecting a marked token (`beautifulsoup4  # import: bs4`) before the
comment is stripped. What must not stand is the file telling the next reader to do something that
does not work.

**A failed interpreter fails, as claimed, but names nothing.** The block promises that a python that
cannot answer "fails and names why. It does not skip." The first half is solid and I could not break
it. `PYTHON=/definitely/not/a/python`: red. A python with `sys.stdlib_module_names` deleted, which is
every interpreter older than 3.10 and all of Python 2: red, and that one carries a real traceback.
A python that exits 0 after printing `Python was not found; run without arguments to install from
the Microsoft Store` to stdout, which is the Windows Store stub and the likeliest real failure on
this machine: red. A python that exits 0 printing a wrong-but-valid JSON array: red, loudly, naming
21 stdlib imports. No skip on any path.

But two of those four print `could not read sys.stdlib_module_names from python: ` with nothing
after the colon. The message interpolates `stdlibRun.stderr` only. On `ENOENT` that is null, and on
the Store stub it is empty because the advert went to stdout and the process exited 0. Neither
`stdlibRun.error` nor `stdlibRun.stdout` is read, so the two commonest ways this fails in the real
world produce a red naming no reason at all. On a project whose named recurring defect is a red
nobody can diagnose, and on a card whose whole `## Why` is that a red had to be diagnosed before it
could be dismissed, that is the wrong place to lose the reason. Also one line: append
`(stdlibRun.error && stdlibRun.error.code)` and a slice of `stdout`.

**The rest I found are limits rather than defects, recorded so nobody has to find them twice.**

- `fs.readdirSync(scriptsDir)` is not recursive, so a `.py` under `scripts/sub/` is never read. I
  confirmed `scripts/sub/deep.py` containing `import yaml` passes. `endsWith('.py')` is also
  case-sensitive, so `scripts/UPPER.PY` passes, and Windows will happily run it. Criterion #2 says
  `scripts/*.py`, a flat glob, so the code matches its criterion exactly; `scripts/` is flat today
  apart from `__pycache__`.
- Three ways to import third-party code past the regex, all valid Python: `x = 1; import yaml` and
  `if True: import yaml` (the pattern is anchored with `^\s*`), and any dynamic import,
  `importlib.import_module('yaml')` or `__import__('yaml')`. No line-based check sees the third, and
  the first two are forms this codebase does not use. Worth knowing, not worth building for.
- The check guards naming, not installability. Declaring the **import** name satisfies it while
  breaking the install: `yaml` against `import yaml` passes here and `pip install -r requirements.txt`
  then fails, since the distribution is `PyYAML`. This is the same gap as the comment above, read
  from the other end, and the two together mean a correct requirements file can go red while an
  uninstallable one goes green.
- A directory named `something.py` inside `scripts/` crashes the suite with an uncaught
  `EISDIR: illegal operation on a directory, read`, taking every assertion after line 2984 with it.
  Contrived, and one `try` would close it.
- A fresh checkout that skips the install still meets exactly the two opaque `ModuleNotFoundError`
  reds `## Why` complains about; their text still points at no file. What changed is that the answer
  is now written down where `docs/HANDOVER.md` sends people, which is what the card actually
  promised. Noted so the promise is not read wider than it was made.

VERDICT: defect

**security**

The three questions, for the 55 lines this card added.

**Where is it weakest.** The check shells out to whatever `process.env.PYTHON` names and treats that
program's stdout as the definition of "does not need declaring". Anyone who can set an environment
variable on the machine running the suite can make it green while the tree is broken. I proved it:
a `sitecustomize.py` on `PYTHONPATH` that prints the real `sys.stdlib_module_names` **plus**
`"requests"` and then calls `os._exit(0)` turns the assertion green with `requirements.txt` deleted
from the comparison entirely. That is a real bypass and it is also almost worthless to an attacker,
because somebody who can set `PYTHON` can already run arbitrary code through `node scripts/selftest.js`
itself. It matters as a CI note, not as a hole: the suite's verdict is only as trustworthy as the
interpreter the environment hands it.

**What is unchecked.** The interpreter path is not validated, and `spawnSync` is called with an
argument array and no `shell`, so there is no injection surface even with a hostile value. Nothing
else on this path takes input: `requirements.txt` and `scripts/*.py` are read from the repository,
not from anywhere a stranger reaches. Two unguarded I/O calls, `readdirSync(scriptsDir)` and
`readFileSync` per entry, throw rather than fail an assertion, which is the `EISDIR` case above.
**This adds no new attack surface**: `const PY = process.env.PYTHON || 'python'` and the `PYENV`
pattern already appear at lines 1204, 1409 and 1542, three blocks older than this card. The card
followed the house pattern rather than inventing one.

**What it leaks.** The failure detail prints the interpreter path from the environment and up to 200
characters of its stderr, which on a real python is a traceback carrying absolute local paths and
therefore a Windows username. It goes to a developer's terminal on a machine that already has the
repository, so the leak is only a leak if somebody pastes the output. This repository is public, and
pasting a red suite into a card or a commit message is a normal thing to do here, so the 200-character
slice is the right instinct. No secret, no third party's data, no network path.

VERDICT: sound

**browser**

**This card has no user-facing surface and none was checked.** The claim rests on the diff, not on
the build entry saying so: `git diff --name-only e8026a8 5aadd40` returns `docs/HANDOVER.md`, this
card, `requirements.txt` and `scripts/selftest.js`, and `grep -c '^app/'` over that list returns 0.
Nothing under `app/` was touched, no HTML, CSS, JS, service worker or dataset changed, and
`data/sites.json` is untouched, so there is no rendered state a browser could disagree about. No
server was started.

**Cleanup.** Every scratch edit was made in fixtures outside the repository, except one deliberate
run in the real tree: `import yaml` appended to `scripts/make_icons.py`, `import bs4` appended to
`scripts/parse.py`, and `requirements.txt` truncated, which produced the expected five-name red.
Restored with `git checkout --` and a byte-compare of `requirements.txt` against its backup.
`git status --short` is empty and `git diff --stat` is empty.
