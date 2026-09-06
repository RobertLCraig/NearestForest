# Three live files still say the dataset holds 904 records

## Why
`app/data/sites.json` holds **1,180 records** today: 630 car parks and 550 forests. Three files that
a reader treats as current still describe it as **904**, which is what it held before card `0016`
added Forestry and Land Scotland. Measured 2026-09-06 against the shipped file.

- `app/api/nearest.php:6` - "ranking 904 sites in-app would take far too long". This is the stated
  reason the endpoint exists at all.
- `docs/build/IOS-SHORTCUT.md:7` - "too slow to rank 904 sites on device". Same claim, second copy.
- `app/core.js:233` - "Every one of the 904 records is an https:// forestryengland.uk page today".
  **This one is wrong twice.** 550 records carry a `url`, not 904, and 276 of those 550 are
  `forestryandland.gov.scot` pages rather than `forestryengland.uk` ones.

What it costs. The first two overstate the on-device workload by a quarter, so anybody re-costing the
Shortcut decision starts from a number that is too small in the wrong direction: the real figure is
1,180 and the argument for the endpoint is *stronger* than the comment claims. The third is the
justification written above `safeHref()` for why that guard covers "a door that is already shut". A
reader checking that sentence finds it false and has no way to tell whether the guard is stale too.
**It is not**: `safeHref()` tests the scheme and never the host, so both upstreams pass it and
nothing is unguarded. The defect is that the comment no longer describes the data it is about, which
is the one thing a reader cannot verify without doing the count themselves.

How it came to be this way. Card `0016` grew the dataset from 904 to 1,180 and added a second
agency. It updated `docs/HANDOVER.md` and `docs/DATA-MODEL.md`, which is where counts were expected
to live. Nothing re-reads a number written into a code comment, and no test asserts one.

## Links

**Relates to**
- `0016` - added the 276 Scottish forests that moved the count from 904 to 1,180. Not a fault on that
  card: these three numbers were in comments, and nothing points from the dataset to them.
- `0032` - checked every count `docs/HANDOVER.md` carries against the thing it counts, and fixed that
  file. It did not look outside it, so these three survived.
- `0034` - found these while re-timing the endpoint against the grown dataset.

## Not this card
Not changing `safeHref()` or any other code path. The guard is correct; only the comment above it is
stale. Not touching `docs/DECISIONS.md:392`, which says 904 inside a dated 2026-08-10 entry and is
append-only: it was true when written and rewriting it would falsify the record. **Not touching
`docs/DATA-MODEL.md:89`, where `"counts_by_country": { "England": 904 }` is CORRECT** - England
really does hold 904 of the 1,180, being 274 English forests plus 630 car parks. That collision is
the trap on this card: two of the 904s in the tree are right.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN a reader opens `app/api/nearest.php`, `docs/build/IOS-SHORTCUT.md` or `app/core.js`,
      THE FILE SHALL state the record count `app/data/sites.json` holds today rather than 904.
      proves: `dataset counts in comments match sites.json`
- [ ] #2 WHEN `app/core.js` names the upstream that dataset URLs come from, THE FILE SHALL name both
      agencies, since 276 of the 550 URLs are `forestryandland.gov.scot`.
      proves: `dataset counts in comments match sites.json`
- [ ] #3 WHEN a future card grows the dataset again, THE SUITE SHALL fail if one of these carried
      counts no longer matches `app/data/sites.json`, so the next drift is caught by a run rather
      than by somebody reading. proves: `dataset counts in comments match sites.json`
<!-- AC:END -->

## Tasks
- [ ] Write the failing self-test first: assert the counts named in those three files against the
      counts read out of `app/data/sites.json`, and watch it fail on today's 904s
- [ ] Correct the three numbers, and the single-agency claim in `app/core.js`
- [ ] Leave `docs/DECISIONS.md` and `docs/DATA-MODEL.md` alone; see `## Not this card`

## Plan
Work in the NearestForest repository, on a branch off `main`. From the repository root, the numbers
this card asserts are read straight out of the shipped file:

    node -e "const d=require('./app/data/sites.json');console.log(d.sites.length)"

which prints 1180 today, and the per-source and per-host splits are in `## Why` above.

The suite is `node scripts/selftest.js` and it already reads `app/data/sites.json`; there is no PHP
suite in this project, no `vendor/`, no Pest. It also already greps every tracked file for a
committed key, so a test that reads a source file and checks a number against the data is the shape
the file is used to. `app/core.js` is `require()`d by the tests, so the comment lives in a file the
suite already loads.

**Bumping `CACHE` in `app/sw.js`.** `app/core.js` is a shipped file, so changing it is an `app/`
change and `scripts/deploy.ps1` refuses to ship one without a bump; `core.js` `BUILD` must match the
new cache name and a self-test enforces it. A comment-only edit still changes the bytes served.

It worked when `node scripts/selftest.js` passes, the new test fails if any of the three numbers is
put back to 904, and no number outside those three files moved.

## Comments
**2026-09-06** Raised by card `0034` while it re-timed `api/nearest.php` against the grown dataset.
`0034` only changed `docs/HANDOVER.md`, so correcting comments in shipped files was outside it.
</content>
