# Nothing requires the HTTPS redirect to exist

## Why
**Delete the whole HTTPS redirect from `app/.htaccess` and the suite stays green.** The block is
four lines at line 66:

    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteCond %{HTTPS} !=on
      RewriteRule ^(.*)$ https://forestlocator.enhanceify.co.uk%{REQUEST_URI} [L,R=301]
    </IfModule>

One assertion in `scripts/selftest.js` mentions it, at line 1102, and it is negative: `the HTTPS
redirect does not echo the request Host` asserts that no `RewriteRule` contains `%{HTTP_HOST}`.
Remove the rule and that assertion is satisfied more easily than before. Nothing else in the suite
searches for `Rewrite` or for the site's own host.

**What it costs, and it is the app's one hard requirement.** iOS grants `navigator.geolocation` only
to a secure origin. On plain HTTP this app loads, looks entirely normal, and silently never locates
anybody, which is every one of its success criteria at once. That is written into `docs/HANDOVER.md`
under Deployment as the reason a self-contained file opened from the Files app was rejected. The
redirect is what makes a plain-HTTP visit become a secure one, and it is protected by nothing.

**This is the shape of defect this project keeps finding.** `docs/HANDOVER.md` names checks that
cannot fail as the recurring fault, and the reason this one survived is worth stating: the
`.htaccess` assertions were hardened by card `0011` so that a commented-out directive turns the run
red, and that hardening works by stripping comments before any assertion reads the file. Stripping
comments only helps an assertion that requires a directive to be **present**. A purely negative
assertion passes on an empty file.

**How it came to be this way.** The redirect was written as deployment configuration rather than as
behaviour, and the one assertion about it was added when an open-redirect shape was found and
replaced with a literal host. Nobody wrote the assertion that the thing itself is still there.

## Links

**Relates to**
- `0011` - the card that hardened the `.htaccess` assertions and owns
  `stripHtaccessComments`. Its 2026-09-11 review is the finding this card comes from, and that card
  is in `human-review/` waiting on a different question, so the finding would not have been picked
  up off its thread.
- `0069` - the merge that carried that review onto the surviving copy of `0011` and raised this.

## Not this card
**Not changing `app/.htaccess`.** The redirect is correct: it tests `%{HTTPS} !=on`, it names the
host literally rather than echoing `%{HTTP_HOST}`, and it is a 301. Nothing about it changes.

**Not a sweep of every other negative assertion in the suite.** One is uncovered and measured. The
same reasoning may apply elsewhere and looking is worth a card; guessing is not.

**Not the tile proxy, the security headers or the cache blocks.** All three have assertions that
require a directive to be present, and card `0011`'s comment-strip covers them.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the self-test suite runs, THE SUITE SHALL fail if `app/.htaccess` carries no
      `RewriteRule` redirecting to `https://forestlocator.enhanceify.co.uk`, including when the
      rule is present but commented out. proves: `the HTTPS redirect is present and literal`
- [x] #2 THE EXISTING ASSERTION that no `RewriteRule` echoes `%{HTTP_HOST}` SHALL still run and
      still pass. proves: `the HTTPS redirect does not echo the request Host`
<!-- AC:END -->

## Tasks
- [x] Write the positive assertion first and watch it red against a copy with the block removed
- [x] Put it beside the existing negative one, reading the same comment-stripped text
- [x] Re-run the suite and confirm both assertions pass against the real file

## Plan
**Where to stand.** This repository, on a branch of `main`. There is no PHP suite here and no
`vendor/`, so `pest` and `pint` do not exist. The suite is `node scripts/selftest.js`. It is red at
HEAD on three assertions that are not yours: two are the undeclared `requests` module, which is card
`0071`, and one is a board card over the file-reader size limit, which is card `0055`.

**Confirm the defect**, from the repository root in Git Bash:

    grep -n "Rewrite\|forestlocator" scripts/selftest.js

One hit, line 1102, and it is the negative assertion. Nothing requires the rule to exist.

**The check goes in `scripts/selftest.js`**, on the line directly below the existing negative one,
in the hardening block. Read the same `htaccess` variable the assertions around it read, which is
already comment-stripped by `stripHtaccessComments`, so a commented-out rule reads as absent and the
new assertion goes red. That is the whole point of putting it there rather than reading the file
again. Name it exactly `the HTTPS redirect is present and literal`.

**What to assert.** Both halves in one, because they are one fact: a `RewriteRule` whose target
begins `https://forestlocator.enhanceify.co.uk`. Matching the literal host is what keeps the new
positive assertion and the existing negative one from being satisfiable by the same wrong file.
Do not assert on `RewriteEngine` or the `<IfModule>` wrapper; the rule is the thing that redirects.

**Red-proof it on the real fault, which here means breaking the guarded thing.** The defect is an
absent check rather than an absent rule, so the proof runs the other way round from most cards on
this board. Three runs, all on a scratch copy, none committed:

1. Comment out the four `.htaccess` lines and run. The new assertion is red; confirm the old one
   still passes, which is the finding demonstrated.
2. Delete the four lines outright and run. The new assertion is red.
3. Restore the file, confirm it byte-for-byte with `git diff`, and run. Both pass.

## Comments

**2026-09-11** WRITTEN AFTER THE FINDING, NOT AFTER THE WORK. The criteria are the reviewer's
finding turned into checks and nothing here is built yet, so every box is honestly unticked. The
finding itself is the `breakage: defect` verdict of the 2026-09-11 review on card `0011`, which is
quoted in full on that card's thread.

**2026-09-12** RESULT: done
TESTS: +2 new, all green (one pre-existing unrelated failure, card `0055`)
TOUCHED: scripts/selftest.js
OUT-OF-SCOPE: none

Two assertions went in directly above the existing negative one, reading the same
comment-stripped `htaccess` variable. One pattern covers both halves of the fact the card names:
`RewriteRule\s+\S+\s+https://forestlocator.enhanceify.co.uk`, so a rule that echoed `%{HTTP_HOST}`
as its target would fail the new positive assertion as well as the old negative one. The second
new assertion, `a commented-out HTTPS redirect fails the suite`, applies that same pattern to the
`allCommented` copy the security-header proof already builds, because commenting the block out is
how the directive would actually go missing. `app/.htaccess` is unchanged.

Red-proof, four runs, nothing committed in a broken state:

1. All four redirect lines commented out: `the HTTPS redirect is present and literal` red,
   `the HTTPS redirect does not echo the request Host` still PASS. That is the finding
   demonstrated from the inside.
2. The four lines deleted outright: same assertion red.
3. `app/.htaccess` restored, confirmed byte-for-byte by `git diff` showing only `scripts/selftest.js`
   changed: 313 passed, 1 failed.
4. `stripHtaccessComments` temporarily replaced with the identity function: the new
   `a commented-out HTTPS redirect fails the suite` went red alongside the existing
   `a commented-out security header fails the suite`, which is that assertion watched catching
   the thing it is for rather than only ever seen green. Restored after.

The one remaining failure is the known `0055` one, card `0020` at 209.9 KB against the 200 KB
reader limit. **The card's Plan is stale in one detail and it cost nothing:** it says the suite is
red at HEAD on three assertions, two of them the undeclared `requests` module (card `0071`). At
HEAD in this worktree only the `0055` assertion is red, so `0071` appears already fixed or no
longer reproducing here. Not investigated and no card raised, since it is a Plan note about
baseline colour rather than a fault.

Not checked in a browser: nothing about this change is renderable, and a worktree is not what Herd
serves in any case. `CACHE` / `BUILD` are untouched because nothing under `app/` changed.

### 2026-09-12 review (v20260912152822-c707)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

**#1** ÔÇö `scripts/selftest.js`, in the `.htaccess` block that begins `const htaccess = htaccessDirectives()`. The new assertion `the HTTPS redirect is present and literal` tests `/RewriteRule\s+\S+\s+https:\/\/forestlocator\.enhanceify\.co\.uk/` against `htaccess`, which is the return of `htaccessDirectives()` and therefore already passed through `stripHtaccessComments`. Deleting the rule leaves nothing for the pattern to match; commenting the four lines out drops them before the assertion reads them, since the strip filters any line matching `^\s*#`, which covers the indented `RewriteEngine`/`RewriteCond`/`RewriteRule` lines once prefixed. The companion assertion `a commented-out HTTPS redirect fails the suite` applies the same pattern to `allCommented`, the whole-file comment-out the security-header proof already builds, so the comment case is asserted directly rather than only inferred.

I tried to satisfy the pattern with a wrong file and could not: a target echoing `%{HTTP_HOST}` does not begin with the literal host, and a prose mention of the rule is stripped before the read.

**#2** ÔÇö the assertion `the HTTPS redirect does not echo the request Host` is unchanged, sits immediately below, and still reads `htaccess`.

Suite run here: 315 passed, 1 failed. All three redirect assertions PASS. The single failure is the card-size one, which is card 0055 and not this card's.

VERDICT: sound

**scope: sound**

Scope checked against the card's own commit `c7f6703`, not the branch-cumulative diff in the brief. Everything else in that file list belongs to cards 0071, 0072, 0073, 0076 and the board moves, each with its own commit.

What this card actually changed: 16 lines in `scripts/selftest.js` inside the hardening block, plus its own card file. Nothing else.

- **The `## Not this card` fences all hold.** `app/.htaccess` is untouched, last written by `1359bf1`, three weeks before this card. Nothing in the commit reaches the tile proxy, the security headers or the cache blocks. No other negative assertion in the suite was swept or rewritten.
- **Nothing grew quietly.** The second assertion, `a commented-out HTTPS redirect fails the suite`, is not scope creep: criterion #1 requires the suite to fail when the rule is present but commented out, and it reuses the existing `allCommented` copy the security-header proof already builds rather than adding machinery.
- **Nothing is left half done.** Both new assertions run, and the existing negative one still runs and passes. I ran the suite: 315 passed, 1 failed, the failure being the card-size assertion that is card `0055`.
- **One deviation from the Plan, immaterial.** The Plan said to put the check on the line directly below the negative assertion; it went directly above, reading the same comment-stripped `htaccess` variable, which is what the Plan's reasoning actually required. The builder also recorded the stale Plan note about the baseline colour instead of investigating card `0071`, which is the right call since `0071` was fixed in `7658de6` on this branch.

No criterion is disproved.

VERDICT: sound

**breakage: defect**

**Finding ÔÇö the host pattern matches any host that merely *begins* with the literal.**

In `scripts/selftest.js`, the `.htaccess` hardening block, `httpsRedirect` is
`/RewriteRule\s+\S+\s+https:\/\/forestlocator\.enhanceify\.co\.uk/` with nothing anchoring the end of the host. I ran the pattern against fixtures in memory (no files touched). A rule whose target is `https://forestlocator.enhanceify.co.uk.evil.com%{REQUEST_URI}` passes `the HTTPS redirect is present and literal`, and it also passes `the HTTPS redirect does not echo the request Host`, because it contains no `%{HTTP_HOST}`. So the file can carry no redirect to the site's own host at all, send every plain-HTTP visitor to somebody else's domain, and the suite stays green. That is the same silent shape the card was raised to close, moved one character along.

The comment directly above the assertion is made false by this: it states that matching the literal "is what stops this assertion and the negative one below being satisfied by the same wrong file". The suffixed-host file satisfies both.

The fix is one character: require the host to be followed by `/`, `%` or whitespace.

Confirmed green otherwise: 315 passed, 1 failed, the one red being the known card 0055 size check. Deletion and comment-out both go red as claimed.

UNMET: #1 the pattern is unanchored at the end of the host, so a `RewriteRule` redirecting to `forestlocator.enhanceify.co.uk.evil.com` satisfies it while the file carries no redirect to the site itself.

VERDICT: defect

**acceptance**

- **#1 reopened**, by the breakage lens: the pattern is unanchored at the end of the host, so a `RewriteRule` redirecting to `forestlocator.enhanceify.co.uk.evil.com` satisfies it while the file carries no redirect to the site itself.

