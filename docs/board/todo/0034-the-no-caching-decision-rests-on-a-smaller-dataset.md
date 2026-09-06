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
- [ ] #1 WHEN `docs/HANDOVER.md` states that `api/nearest.php` does not need caching, THE FILE SHALL
      cite a response time measured against the `app/data/sites.json` that ships today, with the date
      and the file size it was measured on. proves: none - `scripts/selftest.js` has no timing test
      and a wall-clock assertion in it would be flaky by construction; the check is running the
      measurement below and reading its output against the file
<!-- AC:END -->

## Tasks
- [ ] Re-run the ten-concurrent measurement against the current 719 KB `app/data/sites.json`
- [ ] Write the new figure, its date and the file size it was taken on into `## Current state`
- [ ] If the figure has moved enough to change the conclusion, raise the caching card; do not build it here

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
