# The "no caching needed" finding was measured on a dataset 40% smaller

## Why
`docs/HANDOVER.md`, under `## Current state`, tells a fresh session not to re-derive one thing about
`api/nearest.php`: it "was measured at ~65 ms with ten concurrent and no degradation", so its
re-parse of the whole dataset on every request "is **not** a DoS lever and does not need caching".

That measurement was taken on 2026-08-10. `app/data/sites.json` was 515 KB and held 274 forests plus
630 car parks. Card `0016` added Forestry and Land Scotland on 2026-08-29. The same file is 736,457
bytes today, which is 719 KB and 1,180 records, and the endpoint re-parses all of it per request.
Nobody has re-timed it. Measured 2026-09-06.

What it costs. The brief's whole job is to save a session the work of re-deriving a fact, and this
entry is written as a settled one: do not add caching, it has been measured. A reader has no way to
tell a conclusion that still holds from one whose input grew 40% underneath it, so either they trust
a number that may no longer be true or they re-run the measurement, which is the saving the brief
existed to make. The endpoint is public and unauthenticated, so if the conclusion has moved, what
moved is a live availability property rather than a nicety.

How it came to be this way. The finding was written during the 2026-08-10 security review, correctly
dated and correctly reasoned for the file that existed then. Card `0016` grew the dataset three weeks
later and had no reason to know a performance conclusion elsewhere in the brief depended on its size.
Nothing re-reads the finding when the file changes.

## Links

**Relates to**
- `0016` - added the 276 Scottish forests that grew the file from 515 KB to 719 KB. It is not a fault
  on that card: the dependency was invisible from where it stood.
- `0032` - found this while checking every count `docs/HANDOVER.md` carries against the thing it
  counts. It corrected the brief to say the timing has not been re-taken, which is honest but is not
  a measurement.

## Not this card
Not adding caching to `api/nearest.php`. Whether it needs any is what the measurement decides, and
deciding it first would be the same mistake in the other direction. Not re-reviewing the endpoint's
security, which `0011` to `0014` covered. Not the PWA, which never calls this endpoint.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN `docs/HANDOVER.md` states that `api/nearest.php` does not need caching, THE FILE SHALL
      cite a response time measured against the `app/data/sites.json` that ships today, with the date
      and the file size it was measured on. proves: none - `scripts/selftest.js` has no timing test
      and a wall-clock assertion in it would be flaky by construction; the check is running the
      measurement below and reading its output against the file
<!-- AC:END -->

## Tasks
- [x] Re-run the ten-concurrent measurement against the current 719 KB `app/data/sites.json`
- [x] Write the new figure, its date and the file size it was taken on into `## Current state`
- [x] If the figure has moved enough to change the conclusion, raise the caching card; do not build it here
      — it has not; no caching card raised, and why is in the thread below

## Plan
Work in the NearestForest repository, on a branch off `main`. Only `docs/HANDOVER.md` changes unless
the measurement says otherwise, and in that case the change is a new card rather than code.

**Measure locally, not against the live site.** `https://forestlocator.enhanceify.co.uk/` is Rob's
host and ten concurrent requests at it is load on somebody's server for no benefit; the thing being
measured is PHP parsing a local file, which is the same work in both places. From the repository
root, serve the app with the PHP that Laravel Herd provides (it is not on the Git Bash PATH, so use
PowerShell):

    php -S 127.0.0.1:8792 -t app

Then, in a second PowerShell window, ten concurrent requests and their times:

    1..10 | ForEach-Object -Parallel {
        (Measure-Command {
            Invoke-WebRequest "http://127.0.0.1:8792/api/nearest.php?lat=50.8225&lng=-0.1372&n=5" -UseBasicParsing
        }).TotalMilliseconds
    } -ThrottleLimit 10

`php -S` is single-threaded and serves requests one at a time, so it measures the parse cost honestly
but tells you nothing about concurrency. That is the whole answer here: what is in question is the
per-request cost of re-parsing a file that grew 40%, not the web server. Report the median and the
worst of the ten, and say in the brief that it was taken on the built-in server.

It worked when `## Current state` carries a figure, a date and a file size that a reader can check
against `app/data/sites.json`, and when the sentence no longer says the conclusion has not been
re-taken.

## Comments
**2026-09-06** Raised by card `0032` while it checked every carried count in `docs/HANDOVER.md`
against the thing it counted. `0032` corrected the brief to record that the 515 KB the timing was
taken on is now 719 KB and that nobody has re-timed it; taking the measurement is not what its
acceptance asked for, so it left it here.

**2026-09-06** RESULT: done
TESTS: +0 new, all green — 225 passed, 0 failed (`node scripts/selftest.js`). No test was added
because criterion #1 is `proves: none`: the check is the measurement itself, and this project has no
PHP suite at all (no `vendor/`, no Pest, no Pint, contrary to the standard run instructions).
TOUCHED: docs/HANDOVER.md; docs/board/todo/0036-the-904-record-count-outlived-card-0016.md;
this card
OUT-OF-SCOPE: 0036

**The conclusion holds, and it holds more comfortably than it did.** Measured on the built-in server
(`php -S 127.0.0.1:8792 -t app`) against the 736,457-byte, 1,180-record `app/data/sites.json`,
asking from Brighton (`lat=50.8225&lng=-0.1372&n=5`), which returns Friston Forest first:

| What was timed | Median | Worst |
|---|---|---|
| `file_get_contents` + `json_decode` of the whole file, 20 runs | 3.7 ms | 4.3 ms |
| one warm request end to end, 10 sequential | 5.3 ms | 7.0 ms |
| ten requests in flight at once, 3 batches | 35–47 ms | 53 ms |

Ten at once all complete in ~55 ms **in total**. That per-request median of 35–47 ms is queueing, not
work: `php -S` is single-threaded, so ten arrivals are served one after another and the tenth waits
for the nine before it. The card's Plan says as much. Caching the parse would buy under 4 ms a
request, so it is **not** a DoS lever and does not need caching.

**I did not raise the caching card**, because the figure did not move enough to change the
conclusion — it moved the other way.

What I could not settle from the repository, and wrote into the brief rather than guessing past.
**The 2026-08-10 measurement's harness is not recorded anywhere**, so the old ~65 ms and my numbers
are not comparable and I have not claimed a speed-up. That matters more than it looks, because
**this card's own measurement script over-reports**. `ForEach-Object -Parallel` charges PowerShell
runspace start-up to its first batch, so run 1 printed a median of 65.9 ms and worst 107 ms, and runs
2 and 3 printed 18.4 and 19.1 ms with nothing changed in between. The first number is the client
starting up, not the endpoint. I re-timed with a warmed `HttpClient` in one runspace to get the table
above, and put the warning in `## Current state` so the next person to re-run this is not fooled by
the same 65 ms coincidence.

I also corrected the second place in `docs/HANDOVER.md` that repeated the now-false "has not been
re-timed" claim, in `## Blockers / open questions`. **I deliberately left the lane counts and the
"two agent-ready cards are open" line alone**: those describe folder state, the scheduler owns it,
and it changes the moment this session ends.

**Raised `0036`.** While checking the dataset numbers I found three shipped files still describing it
as 904 records — `app/api/nearest.php`, `docs/build/IOS-SHORTCUT.md` and `app/core.js` — where it now
holds 1,180. The `core.js` one is wrong twice: it also says every dataset URL is a
`forestryengland.uk` page, and 276 of the 550 are `forestryandland.gov.scot`. The `safeHref()` guard
it sits above is fine, since it checks scheme and never host. Two other 904s in the tree are correct
and must not be "fixed"; the card says which.

**`docs/HANDOVER.md` is still under its 40,960-byte budget, at 39,306 bytes.** Card `0031` governs
that budget and left 2,985 bytes of headroom; this card's figures spent about half of it, so I went
back and cut the passage to its facts rather than leaving it at first draft. **1,654 bytes remain**,
which is less than `0031` handed over and worth knowing before the next HANDOVER edit. No new card:
`0031` is already in `ai-review/` and covers this.
