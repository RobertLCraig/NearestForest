# The fetch-date self-test compares a UTC date to a local one, so it goes red after midnight

## What I need from you

**One word: should this card be closed on the code rather than on the clock? Yes or no.** I would
say yes, and here is the context you asked for.

**What the bug was, in plain terms.** The scraper writes down what day it downloaded each page. It
uses the computer's local date. The test that checked this was written in JavaScript, and it worked
out "today" using UTC, which is Greenwich time with no summer time. For most of the day those two
agree. Between midnight and 1am in British Summer Time they do not: the clock on your wall says the
21st while Greenwich still says the 20th. So the test saw two different dates, called it a failure,
and went red for an hour a night with nothing actually broken.

**What the fix did, and why it matters here.** It stopped asking JavaScript what day it is. The test
now has the scraper itself print its own date, in the same process that just wrote the file, and
compares that. Look at `scripts/selftest.js` around line 1497: the expected date comes from
`m.date.today().isoformat()` in the Python stub, and `dayOf()` just reads what that process printed.

**So there is no longer a UTC value anywhere in that comparison.** The only mention of
`toISOString` in the whole block is in a comment explaining why it is not used any more. Checked
today by reading it.

**Which is why staying up is worth nothing.** The failing hour was the hour when UTC and local
disagreed. With nothing reading UTC, no hour disagrees with any other. Running the suite at 00:30
would pass, and it would pass for the same reason it passes at noon, so it tells you nothing you
cannot get from the six lines above. The card asks for an experiment whose result is already
determined.

- **Yes, close it on the code.** I tick #2, quoting what was read and where. Cost: the proof is a
  person reading a file rather than a run going green.
- **No, it has to be the real hour.** The card sits here until a night you happen to be up at
  midnight between now and the end of October, when BST ends and the window disappears until March.

**One thing I will not do either way**, so it is not on the table: moving the machine's system
clock. Other sessions run against it, and a jump reaches certificates, scheduled tasks and commit
timestamps. A `TZ` environment variable will not stand in for it either: I tried four zone values
on this machine today and Node fell back to the system zone or to UTC for every one of them, so it
cannot produce a local date ahead of UTC here at all.

**Why it needs you.** Whether "I read the code and there is no UTC in it" counts as proof on this
board is a standard you set, not a fact anybody can look up. The rest of this card is settled.

## Why
`node scripts/selftest.js` fails between local midnight and 01:00 while British Summer Time is in
force, and passes again at 01:00. Nothing in the repository changes in between. The failure reads:

    221 passed, 1 failed
    FAILURES:
      - fetch records a download date alongside every cached page — fetched.json =
        {"fls/pages/a-glen-2.html":"2026-09-06", ...}, wanted all four pages dated 2026-09-05

Measured on 2026-09-06 at 00:57 local (`+01:00`) on a tree whose only uncommitted change was one
markdown card. The two halves of the comparison read different clocks:

- `scripts/fetch.py:68` writes `date.today().isoformat()` into `data/raw/fetched.json`. That is the
  **local** date, so it read `2026-09-06`.
- `scripts/selftest.js:771` builds its expected value as `new Date().toISOString().slice(0, 10)`.
  `toISOString()` is always **UTC**, so it wanted `2026-09-05`.

What it costs. This project's suite is the only gate a card passes through, and the unattended loop
runs overnight, which is exactly the window the test is red in. A session that hits it has to decide
whether it broke something, and the honest answer is that it cannot tell from the suite. Britain is
one hour ahead of UTC from late March to late October, so this is roughly one hour a night for seven
months of the year. It also fails the other way round: a red test that goes green on its own teaches
the next reader to re-run rather than to look, which is how a real failure gets waved through.

How it came to be this way. The test was written on 2026-09-05 for card `0026`, in daylight, when
both clocks named the same day. Neither side is obviously wrong on its own; they were simply never
compared.

## Links

**Relates to**
- `0026` - it built `fetched.json` and this test together, and the mismatch is between the two halves
  it wrote. Its three criteria are still met; only the comparison is unsound.
- `0028` - found this while running the suite before committing a one-line card edit, and could not
  fix it, because a card session may only build its own scope.

## Not this card
Not the wider question of whether the whole pipeline should stamp UTC. `scripts/parse.py:16`,
`scripts/parse.py:258` and `scripts/build_boundary.py:201` also call `date.today()`, and none of them
is measured as faulty here. Not re-fetching `data/raw/`. Not the other 221 self-tests.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN the suite runs at any hour of any day, THE SELF-TEST SHALL compare the recorded fetch
      date against a date read from the same clock the fetcher used, so it does not depend on the
      time of day. proves: `fetch records a download date alongside every cached page`
- [ ] #2 WHEN the machine's clock is set inside the failing window, THE SUITE SHALL still pass.
      proves: manual - the window is reproduced by running the suite between 00:00 and 01:00 local
      while BST is in force, or by setting the clock there
<!-- AC:END -->

## Tasks
- [x] Watch the test fail first: run the suite with the clock inside the window, and confirm it fails
      naming two dates one day apart rather than for any other reason
- [x] Make the two sides read one clock
- [ ] Re-run `node scripts/selftest.js` inside the window and confirm 222 pass

## Plan
Work in the NearestForest repository, on a branch off `main`. One file changes, `scripts/selftest.js`,
unless the fix is taken on the Python side instead.

The fault is at `scripts/selftest.js:771`, `const today = new Date().toISOString().slice(0, 10)`.
`toISOString()` is UTC by definition; `date.today()` in `scripts/fetch.py:68` is local. The cheapest
honest fix is to make the test's expectation local too, for example
`new Date().toLocaleDateString('en-CA')`, which prints `YYYY-MM-DD`. That keeps the recorded date
meaning "the day Rob downloaded it", which is what `docs/DATA-MODEL.md` says the field is for.

Two things to weigh before writing the line, and both are cheap:

1. A test that computes the date at all still straddles midnight — the fetcher can stamp one day and
   the assertion be built the next. Reading the date back out of `fetched.json` and asserting it is
   one of today or yesterday, rather than recomputing it, removes the race entirely.
2. Changing `fetch.py` to UTC instead would make the stamp disagree with `parse.py`, which is the
   larger change and is fenced out above.

To reproduce, set the machine clock to 00:30 local during BST, or wait for that window. To check it
without waiting, run the suite and confirm it passes, then confirm the assertion no longer contains
`toISOString`. It worked when `node scripts/selftest.js` prints `222 passed, 0 failed` and prints it
at any hour.

## Comments
**2026-09-06** Raised by card `0028`, which ran the suite before committing and found it red. The
failure is not `0028`'s change: the only modified file in that run was one markdown card in
`docs/board/`, and `scripts/selftest.js` reads nothing from `docs/board/`.

**2026-09-06** The diagnosis was watched, not inferred. The suite ran red at 00:57 and again at
00:59 local, naming the same two dates. It then ran at 01:00, with nothing edited in between, and
printed `222 passed, 0 failed`. A suite that repairs itself on the hour is the whole fault in one
observation. The clocks were read directly too: at 00:57 local, node's `toISOString()` gave
`2026-09-05` and both node's `toLocaleDateString('en-CA')` and Python's `date.today()` gave
`2026-09-06`.

**2026-09-06** RESULT: partial
TESTS: +0 new, all green — 225 passed, 0 failed (the existing test is the one repaired)
TOUCHED: scripts/selftest.js
TOUCHED: docs/HANDOVER.md (handover only - the two lines naming 0030 as open)
OUT-OF-SCOPE: none

#1 is met. #2 is left open, and the reason is the method it names rather than the fix.

**The window was reproduced without touching the machine clock, and the failure was watched.** The
fault is not really "after midnight"; it is "Python's local date and node's UTC date name different
days", and midnight-to-01:00 under BST is only when this machine falls into that. Setting
`TZ=XXX5` puts Python's `date.today()` a day behind UTC on demand, at any hour. Measured at 05:03
local on 2026-09-06, well outside the natural window:

    225 passed, 0 failed          # no TZ set
    224 passed, 1 failed          # TZ=XXX5, before the fix
      - fetch records a download date alongside every cached page — fetched.json =
        {"fls/pages/a-glen-2.html":"2026-09-05", ...}, wanted all four pages dated 2026-09-06

That is the reported failure verbatim: the same test, two dates one day apart, and the other 224
untouched, so the shift is not disturbing anything else. After the fix the same command prints
`225 passed, 0 failed`, and so does `TZ=XXX-14`, which throws the mismatch the other way.

**What changed.** The expected date is no longer computed in node at all. The Python stub that
drives `fetch.py` now prints `m.date.today().isoformat()` as its last line — literally the symbol
`record_fetch` uses, in the process that just wrote the index — and node reads that back. So the two
halves cannot read different clocks by construction, and there is no locale or ICU assumption in it.
The Plan's `toLocaleDateString('en-CA')` would also have worked and is one line shorter, but it is a
second clock that merely agrees with the first, and it keeps the midnight straddle the Plan's own
point 1 raises. The stub runs twice, so both runs report their day and either is accepted; in an
ordinary run they are the same date and the assertion is exact.

**The repaired test still bites.** It reads its expectation from the process under test, so that was
worth proving rather than assuming: `record_fetch` was mutated to write a literal `"1999-01-01"` and
the suite went red naming all four pages, then `scripts/fetch.py` was restored with
`git checkout --`. Nothing else in the tree was touched.

**Why #2 is not ticked.** It asks for the clock *set* inside 00:00-01:00 local, or the suite run in
that window. Neither happened: it was 05:03, and setting the system clock on Rob's machine
unattended is not a change to make on my own — other worktree sessions may be running against it,
and a clock jump reaches TLS, scheduled tasks and commit timestamps. The TZ reproduction above is
the same divergence by a safer route, and I would accept it as the evidence; but it is not the check
as written, so the box stays open for whoever is next at the keyboard between midnight and 01:00,
where it costs five seconds.

`toISOString` no longer appears in any assertion; the only remaining occurrence is the comment
explaining why it was removed. `scripts/fetch.py` was not changed, so nothing about the pipeline's
own local-versus-UTC question is settled here, as the card fenced out. There is no PHP suite in this
repository — no `vendor/`, no `composer.json` — so `pest.bat` and `pint.bat` could not run; the
suite is `node scripts/selftest.js`. Suite counts 225 rather than the card's 222 because card 0029
added three tests after this card was written.

**2026-09-06** The loop moved this card from in-progress/ to human-review/ WITHOUT trying it. All 1 of its open acceptance criteria say proves: manual, so there is nothing left an unattended session could close and starting one would change nothing. Each open criterion names what to look at and what a pass is: tick what passes and move the card on, or say what failed and move it back to todo/.

**2026-09-20** Rob: "need more context." The ask is rewritten, and rewriting it turned up something
the card had not noticed about its own remaining criterion.

**Criterion #2 asks for an experiment whose result is already determined.** It wants the suite seen
passing inside the window where the bug used to bite, between 00:00 and 01:00 local under BST. That
window existed because the test derived "today" from node's `toISOString()`, which is UTC, while the
fetcher stamps the local date. The fix removed that comparison outright: the expected date now comes
from `m.date.today().isoformat()` printed by the Python stub itself, read back by `dayOf()`, in the
process that wrote the index. Read today, the only occurrence of `toISOString` anywhere in that
block is inside a comment saying why it is no longer used.

**With no UTC value in the comparison, no hour differs from any other.** A run at 00:30 would pass
for exactly the reason a run at noon passes. So the check as written cannot distinguish a working
fix from a broken one, which is this project's recurring defect wearing the opposite face: usually
the check cannot fail; here the proof cannot fail.

**The `TZ` route is closed on this machine, and that is measured rather than assumed.** The card
says an earlier build run reproduced the divergence at 05:03 with a `TZ` override. I could not
repeat that today. Node was given `Asia/Dubai`, `Pacific/Kiritimati`, `XXX-4`, `XXX-13` and
`UTC-14`; every one either fell back to the system zone or behaved as UTC, and none produced a local
date ahead of UTC. Only `TZ=UTC` had any effect at all, and that moves the clock the safe way. So
whatever that earlier run did, it is not reproducible here and should not be relied on as evidence.

**Moving the system clock is refused**, and not because it is hard. Other worktree sessions run
against the same clock, and a jump reaches certificates, scheduled tasks and commit timestamps.

**So the ask is now one word**, with a recommendation attached: close it on the code, or insist on
the real hour and wait for a night before BST ends in late October. Criterion #1 is built and proved
by a named assertion and is not in question.

**2026-09-29** Checked by an attended agent under Rob's rule that human-review holds only what he must decide. **Criterion #2 was run as written, inside the real window, so the question above no longer needs an answer.** At 00:39 local on 2026-09-29, BST in force, on `main` at `154fe90` with a clean tree, `node scripts/selftest.js` printed `330 passed, 1 failed`, and `PASS  fetch records a download date alongside every cached page` was among the passes. The two clocks disagreed at that moment, read the same minute: node's `toISOString()` gave `2026-09-28`, node's `toLocaleDateString('en-CA')` and Python's `date.today()` both gave `2026-09-29`. That is the exact divergence that turned this test red on 2026-09-06, and it stayed green. The one failure was `no open card is blocked by a settled card` (`0027` needing the answered `0018`), which is card `0077`'s and unrelated. No clock was moved. Nothing is left to build. Moved to `ai-review/` for its review; #2 stays unticked, because this pass never ticks a box.

### 2026-09-29 review (v20260929012519-dd36)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I tried to break this card. I could not.

**#1 is met.** The fix is in `scripts/selftest.js`, in the fetch-date block (the card 0026 block, `ok('fetch records a download date alongside every cached page')`).
- The Python stub imports `scripts/fetch.py`. Its last line prints `m.date.today().isoformat()`.
- `fetch.py` does `from datetime import date`, so `m.date` is the same clock that `record_fetch` uses to write `fetched.json`.
- `dayOf()` reads that printed line back. The check needs all four pages dated to a day the fetcher itself reported.
- Node does not work out any date in this comparison. The only `toISOString` is inside a comment. So the result does not depend on the time of day.
- There are two runs, and the test accepts either run's day. This also stops a false fail if midnight falls between the two runs.

**#2 is not disproved.** It is a manual check. The card's 2026-09-29 comment says the suite ran at 00:39 local, with BST in force. The test passed at a moment when node's UTC date and Python's local date were different. The code agrees with that result: nothing in the comparison reads UTC. The box stays open. Ticking it is a person's job, not mine.

The script found no suite to run. I judged the code by reading it.

VERDICT: sound

**scope: sound**

**What I checked.** I looked at how much this change grew beyond the card. The card's own build entry says it touched only `scripts/selftest.js` and two lines of `docs/HANDOVER.md`.

**The large diff is not this card's work.** The 152-file list shows the whole branch since an old base. It includes work from many other cards, for example the tile proxy, Scotland and campsites. No commit for this card touches `scripts/fetch.py`, `scripts/parse.py` or `scripts/build_boundary.py`. So the fence in "Not this card" holds: nothing moved to UTC, and nothing was fetched again.

**The fix stays inside its scope.** In `scripts/selftest.js`, in the `fetch records a download date alongside every cached page` block, `dayOf()` reads the date that the Python stub prints. `toISOString` now appears only in a comment. No other assertion changed.

**Nothing is left half done.** Criterion #2 is still unticked, but that is correct: it is a manual check. The 2026-09-29 comment on the card records a run inside the real window (00:39 BST). That test passed while node's UTC date and the local date were different. The one failure in that run belongs to card `0077`.

None of the criteria is disproved.

VERDICT: sound

**breakage: sound**

I tried to break the fetch-date fix and could not. Nothing else calls the code it changed.

**How the test works now.** In `scripts/selftest.js`, the stub for the test `fetch records a download date alongside every cached page` imports `scripts/fetch.py`. On its last line it prints `m.date.today().isoformat()`. `m.date` is the same `date` (from `from datetime import date`) that `fetch.py` uses to stamp each page. `dayOf()` reads back only that last printed line. So both sides of the check use the same clock. No UTC value is in the check.

**The edge cases I checked:**
- **Midnight between the two runs.** Either day is accepted, so the test does not go red.
- **The stub prints no date.** The test fails and says why. It does not pass by mistake.
- **`fetch.py` is changed to stamp a UTC date or a fixed date.** The stamp stops matching the local date, so the test still goes red.
- **Comments.** The comments beside the test are still true. They do not claim anything the code does not do.

**Criterion #2** asks for the suite to pass inside the failing hour. The card's comment of 2026-09-29 records a run at 00:39 local time, with British Summer Time in force. At that moment the two clocks named different days, and this test passed. That is the check as the card wrote it. I did not see this run myself. The card's log records it.

I found nothing that disproves #1 or #2.

VERDICT: sound

