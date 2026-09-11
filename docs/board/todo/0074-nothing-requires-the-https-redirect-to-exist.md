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
- [ ] #2 THE EXISTING ASSERTION that no `RewriteRule` echoes `%{HTTP_HOST}` SHALL still run and
      still pass. proves: `the HTTPS redirect does not echo the request Host`
<!-- AC:END -->

## Tasks
- [ ] Write the positive assertion first and watch it red against a copy with the block removed
- [ ] Put it beside the existing negative one, reading the same comment-stripped text
- [ ] Re-run the suite and confirm both assertions pass against the real file

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
