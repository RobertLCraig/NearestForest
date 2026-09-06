# The fetch-date self-test compares a UTC date to a local one, so it goes red after midnight

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
