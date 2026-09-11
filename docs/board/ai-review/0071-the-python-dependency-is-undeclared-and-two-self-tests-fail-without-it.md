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

**2026-09-11** RESULT: done, second build
TESTS: +0 new, `the python dependency list names every third-party import in scripts` unchanged in name
TOUCHED: scripts/selftest.js
OUT-OF-SCOPE: none

**Both findings are fixed and each was proved by putting the fault in front of the check.**

**1. The comment that prescribed a remedy that does not work is gone**, and nothing replaced it with
a workaround. The install-name-versus-import-name case is now written down as what it is: a limit
with no escape hatch, red however the file is written, and a code change when a second dependency
arrives whose two names differ. The comment also carries the other end of the same gap, which the
review named and the old comment did not: declaring the import name satisfies this check while
breaking `pip install`. And it carries one line telling the next reader not to put the marker idea
back without making it work first, because the cheapest way to recreate this defect is to reread the
old comment and think it was a good idea.

Making the marker real was the other option offered and it was refused. There is one dependency, its
two names match, and building a parser for a case that does not exist is the adjacent thing this
board's scope fences are for. What was wrong was a file lying to its reader, and that is what is
fixed.

**2. A python that cannot answer now names why on every path.** The message read `stdlibRun.stderr`
only, so the two commonest real failures printed a red ending at the colon. It now reads
`error.code`, then stderr, then stdout, joined, and falls back to `no output on any channel`.
Measured, each by pointing `PYTHON` at the thing and running the suite:

| what `PYTHON` was | message before | message now |
|---|---|---|
| a path with no file on it | nothing after the colon | `ENOENT` |
| a `.cmd` node refuses to spawn | nothing after the colon | `EINVAL` |
| `rundll32.exe`, which exits 0 saying nothing | nothing after the colon | `no output on any channel` |

The pre-3.10 case the review tested already named its traceback through stderr and still does.

**3. An unreadable entry is reported rather than thrown**, which the review listed as a limit and
is worth the one line: `readFileSync` on a directory named `scratchdir.py` threw `EISDIR` and took
every assertion after it out of the run. The read is now guarded and the failure is named. Proved by
creating that directory: the suite completes at `308 passed, 2 failed` naming
`scripts/scratchdir.py could not be read: EISDIR`, where before it died mid-run. Directory deleted,
`git status` clean, back to `309 passed, 1 failed`.

**4. Criterion #1's second half is now proved by the test that claims to prove it.** The review was
right that stripping every comment out of `requirements.txt` left the check green while the criterion
asks for the three importing scripts to be named beside the dependency. The block now reads the raw
file text, comments included, and fails when a declared dependency's importing script is not named
in it. Proved by truncating `requirements.txt` to the single word `requests`: red, naming all three
of `scripts/build_boundary.py`, `scripts/fetch.py` and `scripts/fetch_campsites.py`. Restored, green.

**5. The file match is now case-insensitive**, so `scripts/UPPER.PY` is read. Windows will run it.

**Left alone, and each is a decision rather than an oversight.** The directory read stays flat,
because criterion #2 is written over `scripts/*.py` and that is what the repository holds; a nested
`.py` would need the criterion rewritten first. Dynamic imports through `importlib.import_module`
and `__import__`, and imports after a statement on the same line, are invisible to any line-based
check and this codebase uses neither form. The exotic requirements grammars the review listed all
fail closed, which is the safe direction.

**One correction to the first build entry, which cannot be edited where it sits.** It cites line 473
of `docs/HANDOVER.md` for the `expect: all passed, 0 failed` text. Its own six-line insertion pushed
that to line 479, and 473 now holds the first pipeline command. The scope call itself stands: that
line is card `0032`.

**The suite is 309 passed, 1 failed**, the one red being `0020` at 206.8 KB, which is `0055` and is
Rob's.

**Not checked in a browser.** This build touches `scripts/selftest.js` only, and nothing under
`app/`.

### 2026-09-11 second review

**suite**

`node scripts/selftest.js` on a clean tree: **310 passed, 1 failed**, the one red being `0020` at
206.8 KB, which is `0055` and is Rob's. The second build entry says 309, and the difference is not
drift on this card: `1a3ea74` (card `0069`) added one assertion after this build landed, and the
block count bears it out - `git show 7658de6:scripts/selftest.js | grep -c 'ok('` is 279 against 280
at `HEAD`. The entry's number was true when it was written.

The same caution the first review left, still live. Another session is working this board at the
same moment and leaving untracked scratch cards in the lanes; I saw `docs/board/todo/0067-a.md`,
`0067-b.md`, `0067-hard.md` and `docs/board/attachments/0067-x.md` appear and vanish between my
commands, each one adding a `no board card appears in two lanes` red. One whole run of mine died at
`ENOENT: stat docs/board/dangling` because that session deleted a fixture directory between
`readdir` and `stat`. None of it is this card's and none of it reproduces once the board is still.

**acceptance: sound**

I did not re-derive the first review's fixtures. I attacked the **new** behaviour, which is the
least tested part of the rebuild. Method as before: block lines 2999-3083 lifted verbatim into a
standalone harness taking `ROOT` from `argv`, confirmed against this repository (PASS, matching the
real suite), then driven over 25 fixture repositories and 10 hostile interpreters. Fixtures lived in
`%TEMP%`, not in the tree.

**The importing-script naming rule, which is criterion #1's second half and the newest code.** It
matches raw text for the literal `scripts/<file>`, so the substring question is the one that
mattered and I tested it in both directions rather than reasoning about it. Two scripts both
importing `requests`, requirements naming only `scripts/fetch_campsites.py`: **red**, naming
`scripts/fetch.py`. Reversed, naming only `scripts/fetch.py`: **red**, naming
`scripts/fetch_campsites.py`. The `scripts/` prefix and the `.py` suffix pin both ends, so neither
name can be swallowed by the other. **The suspected defect is not there.**

The rest of that rule, each measured:

- named in a comment, which is the whole intent: pass
- named in prose (`requests  # used by scripts/fetch.py for the scrape`): pass
- two of three named: red, naming exactly the third
- names present but nothing declared: red, naming all three imports
- a stale name for a script that imports nothing: passes, uncaught (a limit, below)
- `scripts\fetch.py` with a Windows backslash: red, so the rule is forward-slash only (a limit)
- the only false pass I could construct: requirements naming `scripts/fetch.pyc` satisfies
  `scripts/fetch.py`, because `includes` has no right-hand boundary. Contrived and harmless.

**Criterion #1's second half is now genuinely proved by the test that names it**, which is what the
first review said it was not. Truncating the real `requirements.txt` to the single word `requests`
and running the real suite reproduces the build entry's claim exactly: red, naming
`scripts/build_boundary.py`, `scripts/fetch.py` and `scripts/fetch_campsites.py`. Restored with
`git checkout --`; `git hash-object requirements.txt` equals `git rev-parse HEAD:requirements.txt`.

**The interpreter failure paths. Ten values for `PYTHON`, ten results, every failure named, no
skip.**

| what `PYTHON` was | what the red says |
|---|---|
| `C:/nope/python.exe` | `ENOENT` |
| a directory | `ENOENT` |
| a `.cmd` node refuses to spawn | `EINVAL` |
| `rundll32.exe`, which exits 0 saying nothing | `no output on any channel` |
| `python" & echo pwned & "` | `ENOENT`, nothing executed |
| real python, `sitecustomize` printing the Store advert to stdout, exit 3 | the advert text |
| real python with `sys.stdlib_module_names` deleted (pre-3.10, Python 2) | the `AttributeError` traceback |
| real python whose stdout is valid JSON but not a stdlib list | red 26 ways, naming `json`, `math`, `re` and the rest |
| `PYTHON=""` | falls back to `python`, passes, correct |
| real python | passes |

Both of the reason-less messages the first review found now name a reason, and the build entry's
three-row table reproduces row for row.

**The guarded read.** `mkdir scripts/scratchdir.py` in the real tree, real suite: it **completes**
at `308 passed, 3 failed` with `scripts/scratchdir.py could not be read: EISDIR` among them, where
before it died mid-run and took every later assertion with it. Directory removed, tree clean.
`readdirSync(scriptsDir)` is still unguarded and that is fine rather than an oversight: `ROOT` is
`path.dirname(__dirname)` and the suite itself lives in `scripts/`, so the directory it reads is the
one it was loaded from and cannot be absent.

**The case-insensitive match**, in the real suite: `scripts/UPPER.PY` containing `import yaml` is
now read and named. It introduced one asymmetry on this case-insensitive filesystem, which fails in
the safe direction: the file match ignores case but the naming check does not, so a file on disk
called `Mixed.PY` declared in requirements as `scripts/mixed.py` goes red. Nothing in `scripts/` is
mixed-case, and `deploy.ps1` is not matched by `/\.py$/i`.

**#3** unchanged and re-checked by eye, and the build entry's correction to itself is right:
`python -m pip install -r requirements.txt` is `docs/HANDOVER.md` line 463, line 473 is
`python scripts/fetch.py && ...`, and `expect: all passed, 0 failed` is line 479. The install
command is above the first `python scripts/` line.

VERDICT: sound

**scope: sound**

`git diff --name-only 87d5cff 7658de6` is two files: this card and `scripts/selftest.js`. No
`scripts/*.py`, no `app/`, no `requirements.txt`, no data. Every fence in `## Not this card` holds
for the second build by construction, and the no-skip fence holds by inspection: the only `return`
on a failure path pushes a named failure first.

**The refusal to build the import-name marker is right, and I looked for the trap rather than
taking the argument.** The board's scope fence exists for exactly this shape, a parser for a case
the repository does not have, and the first review's finding was never "build the marker". It was
"the file is telling its reader to do something that does not work", and that is what got fixed.

The replacement comment would stop somebody. It sits directly above the code, it is reachable from
the red because the assertion name greps to one place, and it says the three things a maintainer
adding `beautifulsoup4` needs: it will be red however you write the file, the marker idea was tried
and the parser cannot see it, and closing it needs a code change. It also carries the other end of
the gap the old comment never mentioned, that declaring the import name satisfies the check while
breaking `pip install`, which I confirmed is still true: `yaml` declared against `import yaml` is
green here and uninstallable.

One residual, offered as the cheap next line rather than as a finding. That warning lives only in
the source. The red itself says `scripts/x.py imports bs4` and nothing more, and the path of least
resistance from that red is to write `bs4` into `requirements.txt`, which goes green and breaks the
install. A clause in the failure detail would close the loop for the reader who never opens the file.

VERDICT: sound

**breakage: sound**

The rebuild held under everything above. Two things I did break, neither recorded anywhere yet, both
latent, both fail-closed, each one line to close:

**1. A trailing comment on a plain `import` line produces a false red.** The module name is taken as
everything after `import` up to a comma and the comment is never stripped, so
`import requests  # the HTTP client` reds with `scripts/fetch.py imports requests  # the HTTP
client`, and `import os  # noqa` reds with `scripts/fetch.py imports os  # noqa`, a standard-library
module reported as an undeclared third-party dependency. Both are ordinary valid Python. No script
in `scripts/` carries a trailing comment on an import today, which is why nothing is red now. The
`from X import Y  # comment` form is unaffected. This is not new in the rebuild: the regex is
byte-identical to the first build and the first review's 37 fixtures did not include the form. The
fix is `s.replace(/#.*$/, '')` inside the existing `.map`.

**2. The second build changed the empty-file branch, and its message is now untrue.**
`if (!fs.existsSync(REQ) ...)` became `if (!reqText ...)`. I ran the same five fixtures against both
blocks: a **0-byte but present** `requirements.txt` with only stdlib imports passed under the first
build and now reds with `requirements.txt does not exist`, which it does. A comments-only or
whitespace-only file still passes, and a missing file still reds correctly. The state is contrived,
but this is the same shape as the finding the rebuild was sent back to fix, a red whose stated
reason is wrong, so it is worth the word `exists` in that branch.

Neither breaks a criterion. Criterion #2 asks the suite to fail when an import is undeclared, and
both of these fail in that direction. What they cost is a reader's minute, not a missed defect,
which is why this is not a second bounce.

Recorded so nobody finds them a third time, all confirmed still true and all named by the build
entry as decisions rather than oversights: the flat directory read, so a `.py` under `scripts/sub/`
is invisible and matches criterion #2's flat glob; dynamic and same-line imports; the install-name
gap in both directions; a stale script name in `requirements.txt` going unchallenged; and
forward-slash-only path matching. One new cousin of the same kind: a line reading `import yaml` at
column 0 inside a triple-quoted string is counted as an import. Contrived, noted, not worth
building for.

VERDICT: sound

**security: sound**

The three questions, re-answered against the block as it now stands rather than carried forward,
because the rebuild widened what the failure path prints.

**Where is it weakest.** Unchanged, and still the interpreter: the check believes whatever
`process.env.PYTHON` names when it says what the standard library is. I re-proved the bypass against
this build. A `sitecustomize.py` on `PYTHONPATH` printing the real `sys.stdlib_module_names` plus
`"requests"`, then `os._exit(0)`, turns the assertion green while the dependency is effectively
undeclared. It is real and it is worth almost nothing to an attacker, because setting `PYTHON` or
`PYTHONPATH` for this process already means running arbitrary code through `node scripts/selftest.js`.
It matters as a CI note: the suite's verdict is only as trustworthy as the interpreter the
environment hands it.

**What is unchecked.** The interpreter path is still unvalidated and `spawnSync` is still called
with an argument array and no `shell`. I put a shell-metacharacter value through it,
`python" & echo pwned & "`, and got `ENOENT` with nothing executed, so there is no injection surface
even with a hostile value. `PYENV` copies the whole environment into the child, which is the house
pattern at lines 1204, 1409 and 1542 and predates this card. The new `reqText.includes()` reads
repository content only. The one unguarded I/O call left, `readdirSync`, cannot fail for the reason
given under acceptance.

**What it leaks.** More than before, and still correctly. The failure detail now prints up to 300
characters drawn from `error.code` or `error.message`, stderr **and** stdout, where it printed 200
characters of stderr. On a real python that is a traceback carrying absolute local paths and a
Windows username, and `${PY}` itself is still echoed. It goes to a developer's terminal on a machine
that already holds the repository, and the slice is the right instinct for a public repository where
pasting a red suite into a card is a normal thing to do. No secret, no third party's data, no
network path. The `EISDIR` guard prints `e.code || e.message`, whose fallback can carry a path: same
class, same size.

VERDICT: sound

**browser**

**This card has no user-facing surface and none was checked.** Evidence rather than assertion:
`git diff --name-only 87d5cff 7658de6` is `scripts/selftest.js` and this card, and across both
builds the card's whole footprint is `docs/HANDOVER.md`, `requirements.txt`, `scripts/selftest.js`
and this card. Nothing under `app/`, no HTML, CSS, JS or service worker, and `data/sites.json` is
untouched, so there is no rendered state a browser could disagree about. No server was started.

**Cleanup.** Three deliberate edits in the real tree, each reverted: `scripts/scratchdir.py` created
as a directory and removed, `scripts/UPPER.PY` created and removed, and `requirements.txt`
truncated and restored with `git checkout --`. Everything else ran in `%TEMP%` against copies.
`git status --short` is empty, `git diff --stat` is empty, and the final suite run is
`310 passed, 1 failed`. One note for the next reader: `git checkout --` rewrote `requirements.txt`
with CRLF line endings under `core.autocrlf`, so the working file differs byte-for-byte from the
copy I took beforehand while its blob hash is identical to `HEAD`. Nothing tracked changed, and the
check parses both, which a CRLF fixture confirmed.
