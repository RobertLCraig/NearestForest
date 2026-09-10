# `scraped_at` says when the parser ran, not when the page was read

## What I need from you

**One choice, and I recommend the first.**

1. Untick a criterion and send this card back to `todo/`, so a session adds a warning to
   `CLAUDE.md`. That is a two-line edit.
2. Or write on the thread that the `CLAUDE.md` warning belongs on its own card, and let this one go
   to `done/`.

**What's wrong.** The work itself is right and two of the three reviewers said so. The break is in
`CLAUDE.md`, the file loaded into every session that opens this project. It still tells a fresh
session to run the pipeline as `python scripts/fetch.py && python scripts/parse.py && ...`. After
this change that command **exits 1** for the 552 pages already sitting in the cache, because none of
them carries a download date. Re-running the fetcher cannot repair it, since it skips any page it
already has; only deleting `data/raw/` and fetching everything again will. A session follows the
instruction, sees the pipeline go red, and reads a broken repository.

**Cause.** The build wrote that warning into `docs/HANDOVER.md` four times over and never into
`CLAUDE.md`, which is the file that actually loads itself into every session.

**Pass** is either route above, recorded here with today's date.

**Fail** is neither. `CLAUDE.md` keeps handing every new session a command that fails on purpose, and
nothing on the board says so.

**Why it needs you.** No criterion on this card was disproved, so a session has nothing to reopen on
its own. Whether a card that has met its acceptance may be sent back for a side effect is your call,
not a session's.

**Note on length.** This section takes the card past the 100-line budget. `## Comments` and the
review verdicts are append-only, so nothing here could be cut to make room.

## Why
Every forest and car park record carries a `scraped_at` date, and DATA-MODEL says that field exists
to make staleness visible. It does not. `scripts/parse.py` sets `TODAY = date.today()` at line 16 and
stamps it onto every record it writes, so the date says when the parser last ran, not when the page
behind the record was actually downloaded.

What it costs. `scripts/fetch.py` caches raw HTML to `data/raw/` on purpose, and re-running the
parser over that cache costs zero requests, which is the intended way to work. Every such re-run
silently makes the whole dataset look a day old when the pages behind it may be months old. It
already happened: on 2026-08-29 all 904 records read `2026-08-29` while the HTML they were built from
had been fetched on 2026-08-08, three weeks earlier. Anyone deciding whether a re-scrape is due reads
a date that always says "today", so the one field meant to answer that question can never answer it.

How it came to be this way. The parser was written before the fetcher had a cache, when parsing and
fetching happened in the same run and the two dates were the same date. The cache was added later and
nobody went back to the stamp. Card 0004 found this on 2026-08-29 and recorded it as out of its own
scope; it sat in HANDOVER's prose until card 0023 moved it into DATA-MODEL's divergences.

## Links

**Relates to**
- `0004` - found this while deriving car park names, and correctly left it alone as out of scope.
- `0023` - it folded this note out of HANDOVER's prose into DATA-MODEL's divergences, which is what
  turned it from a paragraph nobody owned into this card.

## Not this card
Not `scripts/parse_campsites.py`, which takes its stamp from the Overpass response rather than from
the clock and is not affected. Not adding a staleness warning to the app: this card makes the
recorded date honest and nothing more. Not re-fetching anything.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `scripts/fetch.py` writes a page into `data/raw/`, THE FETCHER SHALL record the date it
      downloaded that page, in a form the parser can read back per page. proves: `fetch records a
      download date alongside every cached page`
- [x] #2 WHEN `scripts/parse.py` builds a record from a cached page, THE PARSER SHALL set
      `scraped_at` to that page's recorded download date rather than to today. proves: `scraped_at is
      the page's download date, not the parse date`
- [x] #3 WHEN a cached page has no recorded download date, because it was cached before this change,
      THE PARSER SHALL fail loudly and name the page rather than falling back to today. proves:
      `parse fails loudly on a cached page with no download date`
<!-- AC:END -->

## Tasks
- [x] Have `fetch.py` record a per-page download date beside the cached HTML
- [x] Have `parse.py` read it back and use it for `scraped_at`, for both the English and Scottish builds
- [x] Make a missing date a loud failure, never a silent fallback to today
- [x] Re-run the pipeline and close the divergence in `docs/DATA-MODEL.md` - done 2026-09-10 on
      Rob's call, by card `0019`; see the thread below

## Plan
Work in the NearestForest repository, on a branch off `main`. Only `scripts/fetch.py`,
`scripts/parse.py`, `scripts/selftest.js` and `docs/DATA-MODEL.md` are touched.

The stamp is `TODAY` at `scripts/parse.py:16`, used at lines 340, 501 and 575, the English forests,
the car parks and the Scottish forests. All three need the same treatment.

`scripts/fetch.py` currently records no date at all. The cheapest place to put one is a sidecar the
fetcher already controls: either the file modification time of the cached page, or one JSON index
under `data/raw/` mapping page to download date. Prefer the explicit index, a modification time is
changed by any file copy, and this worktree is itself a copy, so it would lie the first time somebody
moved the repository.

`data/raw/` is gitignored and is a 142MB cache on Rob's machine only, so pages cached before this
change will have no date. That is criterion #3: name the page and exit non-zero, per this project's
"nothing fails silently" rule in `CLAUDE.md`. Do not fall back to today, which is the exact bug.

Run it with `python scripts/fetch.py && python scripts/parse.py`, then `node scripts/selftest.js`.
It worked when the suite is green and `scraped_at` in `app/data/sites.json` reads the date the HTML
was downloaded rather than the date you ran the parser.

## Comments
**2026-09-05** Raised from card 0023, which folded the note out of HANDOVER's prose and into
DATA-MODEL's divergences. 0023 did not fix it; the fault is exactly as card 0004 first measured it.

**2026-09-05** RESULT: done
TESTS: +3 new, all green (222 passed, 0 failed)
TOUCHED: scripts/fetch.py, scripts/parse.py, scripts/selftest.js, docs/DATA-MODEL.md,
docs/HANDOVER.md, docs/board/todo/0029-a-failed-parse-overwrites-the-dataset-it-just-refused.md,
this card
OUT-OF-SCOPE: 0029

Built as the Plan proposed. `fetch.py` gains `record_fetch()`, which writes `data/raw/fetched.json`,
one JSON object mapping each cached file to the date it was downloaded, keyed by the path relative
to `data/raw/` with forward slashes so it reads the same on the server. It is rewritten after every
page rather than once at the end, through a temporary file and `os.replace`, because a run that dies
half way leaves cached HTML on disk and HTML whose date was never written is HTML the parser must
reject for ever. Five call sites record: both index pages, both page fetchers, and `carparks.json`.
`parse.py` gains `fetched_on()`, and the three `TODAY` stamps at the old lines 340, 501 and 575 now
read that index. Car parks ask once for the whole file, since one ArcGIS query answers for all 630,
so a missing date there is one problem rather than 630.

**The three tests drive the real Python scripts, not a copy of their logic.** The suite is node and
the pipeline is Python, so each test spawns `python` against a synthetic tree in `os.tmpdir()`:
criterion 1 calls the real `fetch_page` and `fetch_fls_page` with `requests.get` stubbed, so it
downloads nothing and asserts on the index left behind; criteria 2 and 3 copy `parse.py` into a
fixture root with one English page, one Scottish page and one car park, dated `2026-08-08`,
`2026-08-20` and `2026-08-25`, three dates that are not each other and are not today. Nothing in the
suite touches `data/raw/` or the committed `sites.json`. All three were watched failing first, each
for its own criterion's reason: no `fetched.json` written; all three stamps reading today; and
`parse.py` exiting 0 on a page with no date. **The first test fetches twice, in two processes**,
because the fetcher is resumable and a second run that replaced the index rather than adding to it
would silently drop the date of every page fetched before it. That was watched failing too, by
disabling the merge.

**The pipeline is red in this repository and that is the change working, not a regression.**
`data/raw/` is gitignored and its 552 pages were cached before any date was recorded, so
`python scripts/parse.py` now names them and exits 1. Verified: it did, listing
`pages/hicks-lodge.html` and 1,703 others. Their age is not recoverable and a modification time is
not a substitute, since this worktree is itself a copy and every file in it is dated today. So
`app/data/sites.json` still carries `2026-08-29` on all 1,180 records and cannot honestly be rebuilt
until `data/raw/` is re-fetched, which `## Not this card` rules out and which would change the data
as well as the dates. That is written into DATA-MODEL as an open divergence beside the closed one,
and it is the reason the fourth task is left open. **Whoever re-fetches gets the honest dates, and
until then the shipped file is unchanged rather than freshly wrong.**

`docs/HANDOVER.md` is one file more than the Plan listed, and deliberately: "How to pick up" still
told a fresh session to run a pipeline that now exits 1, and a red step nobody warned about reads as
a broken repository. Four short edits, all about that.

Raised `0029`: running the failing parse to check criterion 3 overwrote `app/data/sites.json` with
`"scraped_at": null` on every record before the exit, because both parsers write their output and
check `problems` afterwards. It was restored with `git checkout`. `parse_campsites.py` has the same
ordering, so the card covers both.

### 2026-09-08 review (v20260908100929-77e0)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

Checked each criterion against the code.

**#1 ÔÇö fetcher records a download date.** `record_fetch()` in `scripts/fetch.py` writes `data/raw/fetched.json`, keyed by path relative to `data/raw/` with forward slashes, via a temp file and `os.replace`. It merges the existing index under a lock before writing, so a second run does not drop earlier dates. Called from `fetch_index`, `fetch_page`, `fetch_fls_index`, `fetch_fls_page` and `fetch_carparks` ÔÇö every place a file is actually downloaded, and correctly not on the cached branches.

**#2 ÔÇö `scraped_at` is the page's date.** `fetched_on()` in `scripts/parse.py` reads that index. `build_forests`, `build_fls` and `build_carparks` each set `"scraped_at": fetched_on(...)` with the same relative key the fetcher writes (`pages/<slug>.html`, `fls/pages/<slug>.html`, `carparks.json`). No `TODAY` is left on any record; `TODAY` now only fills `generated_at`, which is honest.

**#3 ÔÇö missing date fails loudly.** `fetched_on()` appends a named problem and returns `None`; `main()` prints the problem list and `sys.exit(1)` before writing, so the shipped `sites.json` is not clobbered. No fallback to today anywhere. `validate()` also flags `scraped_at` as a missing required field, so a null cannot slip out.

Tried to break it on the resume path, the cache path and the null path; each holds.

VERDICT: sound

**scope: sound**

Scope check done. I read the card's own commit (`b3f5297`), not the whole branch diff ÔÇö the branch bundle includes other cards' commits (`cd3263a`, `42876cf`, `1892a97`), which is why `parse_campsites.py`, `core.js` and `campsites.json` appear. Those are not this card.

What the card's commit touched: `scripts/fetch.py` (`record_fetch`, plus the five call sites), `scripts/parse.py` (`fetched_on`, `build_forests`, `build_fls`, `build_carparks`), `scripts/selftest.js`, `docs/DATA-MODEL.md`, `docs/HANDOVER.md`, its own card, and new card `0029`. That is the Plan's list plus HANDOVER, and HANDOVER is declared on the card.

Fences held:
- `scripts/parse_campsites.py` is untouched by this commit.
- No app-side staleness warning was added.
- Nothing was re-fetched; `app/data/sites.json` is unchanged by this commit.

Nothing crept: every page write in `fetch.py` is paired with `record_fetch`, and `TODAY` survives only for `generated_at` in `write_out`, which is honestly the build date.

Half done, and said out loud: task 4. `fetched_on` makes `parse.py` refuse the old cache, so the pipeline exits 1 until `data/raw/` is re-fetched. That is written into `docs/DATA-MODEL.md` as an open divergence and into HANDOVER's "How to pick up". Leaving it is what `## Not this card` demanded.

VERDICT: sound

**breakage: defect**

I traced fetch ÔåÆ parse ÔåÆ sites.json, the self-tests, and every reader of `scraped_at`.

**What holds.** `record_fetch()` keys relative to `data/raw/` with forward slashes, and `fetched_on()` in `parse.py` looks up exactly those keys (`pages/ÔÇª`, `fls/pages/ÔÇª`, `carparks.json`) ÔÇö the three build sites match. The merge-on-first-write makes a resumed run keep older dates. `app.js` `openSheet()` already falls back when `scraped_at` is null, so the new null path shows nothing wrong. `validate()` still requires the field, so a null cannot ship.

**What broke.** `CLAUDE.md` "Conventions" still tells every fresh session: *"Run the pipeline: `python scripts/fetch.py && python scripts/parse.py && ÔÇª`, then `node scripts/selftest.js`."* After this change that command exits 1 on Rob's machine for all 552 undated cached pages, and `fetch.py`'s `fetch_page()`/`fetch_fls_page()` skip anything already over 20,000 bytes, so re-running `fetch.py` cannot repair it ÔÇö only deleting `data/raw/` can. `HANDOVER.md` got four warning edits; the file that is auto-loaded into every session got none. A session follows it, sees a red pipeline, and reads a broken repository.

VERDICT: defect


**2026-09-08** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 3 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 3 of 3 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-10** Rob's call, answering the queue: **re-run this card through `ai-review/`.** It met
its own acceptance - the reviewer graded that lens `sound` - and the finding that returned it is
next door to the card rather than inside it. A builder could not act on it and a reviewer may not
untick a box, so the card sat here fully ticked while every unattended run promoted it again. It is
not closed and it is not reopened. It goes back for a fresh adversarial pass with the earlier
verdicts still on the thread, and that pass decides whether the finding is this card's to carry.

### 2026-09-10 review

**suite**

`node scripts/selftest.js` from the repository root, before touching anything: **280 passed, 0
failed**. All three tests this card names ran, under `--- staleness: scraped_at is the fetch date,
not the parse date (card 0026) ---`, and I read them out of the run log rather than off the card.
Restored tree re-run at the end: **280 passed, 0 failed**.

**acceptance: sound**

I did not read the criteria and agree with them. I broke each guarded behaviour in turn and watched
the named test go red, then put the file back byte-exact.

**#1 `fetch records a download date alongside every cached page`.** Made `record_fetch()` in
`scripts/fetch.py` return before writing anything. RED: *"the fetcher wrote the pages but left no
data/raw/fetched.json to read a date back from"*. Restored, green.

**#2 `scraped_at is the page's download date, not the parse date`.** The card claims three stamps.
I attacked the third rather than the first, because it is the one with different code around it -
`scripts/parse.py:578`, where car parks take one stamp for the whole ArcGIS file. Replaced it with
`TODAY`. RED, and the failure named all three build sites: *"England 2026-08-08 (wanted
2026-08-08), Scotland 2026-08-20 (wanted 2026-08-20), car park 2026-09-10 (wanted 2026-08-25)"*.
So the test really does cover all three, and it uses three dates that are not each other and not
today. Restored, green.

**#3 `parse fails loudly on a cached page with no download date`.** Replaced the body of
`fetched_on()` with `return fetched.get(rel) or TODAY`, which is the exact original bug. RED:
*"parse.py exited 0 on a page with no recorded download date"* - and it also took down
`a failed parse leaves the previous dataset untouched`, card 0029's guard, which is the right
coupling rather than a duplicate. Restored, green.

No criterion is disproved. Nothing here is a test that cannot fail.

VERDICT: sound

**scope: sound**

Stated up front: this pass ran **no git command**, three reviewers being in this checkout at once,
so I reviewed the tree as it stands rather than the card's commit. The earlier pass did read the
commit and found the fences held; what I can check today agrees with it.

`scripts/parse_campsites.py` still takes its stamp from the Overpass response and has no
`fetched_on` call, so the fence in `## Not this card` holds. No app-side staleness warning exists.
`TODAY` survives in `parse.py` only for `generated_at`, which is honestly the build date. Nothing
was re-fetched: `app/data/sites.json` still reads `2026-08-29` on all **1,180** records, which I
counted rather than took from the card.

Task 4 is still open and still correctly open.

VERDICT: sound

**breakage: defect**

I re-measured the earlier reviewer's finding instead of reading it, and it is worse today than the
entry above describes.

**`data/raw/fetched.json` does not exist in this checkout at all.** Not partial - absent. So every
one of the **277** cached HTML pages under `data/raw/`, plus `carparks.json`, `index.json` and
`search-forests.html`, is undated, and `parse.py` refuses the lot. (The card says 552 pages; the
cache holds 277 `.html` files today. The count moved, the conclusion did not.)

**`CLAUDE.md` lines 23-25 still say:** *"Run the pipeline ...
`python scripts/fetch.py && python scripts/parse.py && python scripts/build_boundary.py`, then
`node scripts/selftest.js`."* No warning anywhere near it. That file is auto-loaded into every
session that opens this project, so it is the first thing a fresh agent reads and the command it
will run. It exits 1.

**Re-running the fetcher cannot repair it**, which I confirmed in the code rather than by running
it: `fetch.py:134` and `:226` return `("cached", ...)` for any page already on disk over 20,000
bytes, so a second `fetch.py` never re-downloads and never records a date. `fetched_on()`'s own
error message is accurate about this - it says *delete it from `data/raw/` and re-run* - so the
repair instruction exists in the one place a session only reaches after the failure.

**Why I am calling this the card's and not next door.** The builder saw the obligation and acted on
it: four edits to `docs/HANDOVER.md` exist precisely because a red step nobody warned about reads as
a broken repository. That reasoning is inside this card. It was applied to the handover and not to
the file that loads itself into every session, which is the same obligation left half done rather
than a new one. `## Not this card` fences off re-fetching; it does not fence off saying so.

**It does not need an untick and it must not wait for one.** No criterion here is disproved, so
there is nothing for a person to untick, and that is exactly why this card looped: every session
looked for an open box and found none. The action is additive - add one sentence beside the pipeline
line in `CLAUDE.md` saying the pipeline exits 1 on a cache predating card 0026, that only deleting
`data/raw/` and re-fetching repairs it, and that this is the change working. Two lines. A builder can
do it with the acceptance untouched.

**Security, per the board README's three questions.** This card produced code.

1. **Weakest point.** The cached filename is built from remote content: `fetch.py:133` takes the
   `slug` off an href on forestryengland.uk and does `slug.replace("/", "__")` before joining it to
   `data/raw/pages/`. Forward slashes are neutralised, backslashes are not, and this runs on Windows,
   so an upstream page serving an href containing `\` steers both a cache write and the key written
   into `fetched.json` outside the intended directory. It predates this card; this card made that
   same string a key in a second file, so it is now the weak point in one more place.
2. **Unchecked.** `fetched.json` is trusted absolutely and validated not at all. Its contents become
   `scraped_at` on every shipped record, so anything that can write `data/raw/` can make the whole
   dataset claim any age it likes, and the one field meant to answer "is a re-scrape due" would
   answer confidently and wrongly. It is also `json.load`ed at import in `parse.py:24` with no
   `try`, so a truncated index gives a traceback rather than one of this project's named reasons.
   Local-only, machine-facing, no permission boundary crossed - but unchecked is unchecked.
3. **Leak on failure.** Relative cache paths and nothing else: `pages/hicks-lodge.html` and its
   siblings. No credentials, no absolute paths, no third-party data. The failure list is long rather
   than sensitive.

**No UI surface, and I am claiming that rather than skipping it.** This card changed
`scripts/fetch.py`, `scripts/parse.py`, `scripts/selftest.js` and two docs. Nothing under `app/` was
touched, `app/data/sites.json` is unchanged, and `BUILD`/`CACHE` are untouched at `v24-2026-09-08`.
There is no screen whose behaviour differs, so there is nothing a browser could show.

VERDICT: defect

**2026-09-10** The last task is now ticked. It was the only one open and it was open for a reason
this card could not resolve on its own: closing it meant re-fetching `data/raw/`, and re-fetching
changes the data, which `## Not this card` put out of bounds. **Rob authorised the re-fetch on
2026-09-10** while fast-tracking Scotland, so card `0019` ran it and rebuilt the dataset.

274 English pages and 278 Scottish pages downloaded, 0 failures. All 1,180 records now read
`scraped_at: 2026-09-10`, which is the date the HTML behind them was downloaded rather than the date
the parser ran. That is this card's whole point, now true of the shipped file and not only of the
generator. The divergence in `docs/DATA-MODEL.md` moved to `### Closed`.

The re-fetch also proved the guard from criterion `#3` in the real world, which no test could:
the first parse after the re-fetch still refused, naming 531 English pages that had been cached
before dates were recorded, and it wrote nothing. Deleting those pages and re-fetching them cleared
it. It failed loudly and it did not fall back to today, which is exactly what this card asked for.

Upstream moved a little in the eleven days since the last build. Counts are unchanged at 550 forests
and 630 car parks. One English record was renamed at source, `fe-new-forest-reptile-centre` is now
`fe-the-old-reptiliary`; one Scottish record moved 0.8 miles, `fls-winding-walks`; and 22 records
changed their opening times, parking or facilities text. Nothing was added or lost on balance.
