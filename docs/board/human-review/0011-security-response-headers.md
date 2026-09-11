---
no_outward_effect: "send" in criterion #2 is the server emitting HTTP response headers, not a message anybody receives
---
# Security response headers

## What I need from you

**One call, and I would take the first.** Untick criterion #7 and send this card to `todo/`, so a
builder closes the two things the 2026-09-11 reviewer found, **or** write on this thread that those
findings are the next card's work and let this one go to `done/`. Doing neither is the fail: it
comes back to this lane unchanged on the next run.

**What's wrong.** The reviewer graded the work itself sound, twice over, and then found two loose
ends underneath it.

1. `docs/HANDOVER.md` still teaches the old, narrower rule. Its `app/.htaccess` bullet says no
   inline script, inline handler or `style=` attribute may enter `index.html`. The tests now cover
   every shipped script, so somebody following the brief believes a handler inside a template
   string is allowed.
2. `setAttribute('style', ...)` breaks the same policy and slips past both of the widened checks,
   because each is a text match for a literal `style=`.

**Cause.** Neither finding disproves a criterion, so a reviewer had nothing to hand back, and a
builder opening the card sees seven ticked boxes and nothing to do. The card cycles instead of
moving.

**Pass** is either of:
- criterion #7 unticked and the card in `todo/`, so a builder widens the style check past a literal
  `style=` and corrects the brief's bullet; or
- a line here saying both are new work, with a new card carrying them.

**Fail** is leaving all seven ticked with the card in this lane.

**Why it needs you.** Only a person may untick. The judgement underneath is whether a gap a
reviewer found in a check counts as this card's debt or the next card's job, and nothing in the
repository settles that.

**Note on length.** This card is past the 100-line budget and this section could not bring it back:
`## Direction` and `## Comments` are append-only and hold most of the file.

## Why
An adversarial review and penetration test on 2026-08-10 (prompted by the app being shared with
other people) found the live site serving exactly one security header, and it was not ours:
`Content-Security-Policy: upgrade-insecure-requests`, which Hostinger adds by default. No CSP of
our own, no HSTS, no `frame-ancestors`, no `nosniff`, no `Referrer-Policy`, no `Permissions-Policy`.

Three of those matter here rather than in the abstract:

- **HSTS.** HTTPS is load-bearing in this app, not cosmetic: iOS grants `navigator.geolocation`
  only to secure origins, so a stripped connection is an app that loads and silently never locates
  you. The 301 helps only after the first request of a session, and this is a PWA opened over and
  over on whatever Wi-Fi is going.
- **`frame-ancestors`.** Anything could frame the app. The **Navigate** button is a tap-jacking
  target, and there is no legitimate reason to embed this.
- **A real CSP.** `app.js` renders the list and the detail sheet by building HTML strings. `esc()`
  is correct today, and the review checked it, but a strict `script-src` is what stands behind it
  if it is ever wrong.

The same pass found the `.htaccess` not serving what it says it serves: `sw.js` matches both
`FilesMatch` blocks, the general one is later, and for one header the last `Header set` wins. The
file has read `no-cache, no-store, must-revalidate` since it was written; `no-cache` is what was
actually going out. Harmless in effect, since revalidation is what matters, but this project has
lost hours to service-worker caching twice, and a file that lies about what it serves is how a
third one starts.

## Links

**Relates to**
- `0012` - the second finding of the same 2026-08-10 review: the tile proxy served anyone. Headers
  and an open endpoint are different defects on different surfaces, so they are separate cards.
- `0013` - the third finding of that review, on the scheme of a dataset's own URL. A strict CSP is
  what stands behind `esc()` here; that card is what stands behind an `href`.
- `0014` - the fourth finding, and the only one that is a statement to the reader rather than a
  control. It goes in the footer, not in `.htaccess`.
- `0015` - came out of the same phone screenshots that evidenced this card. It is a legibility
  defect the tile layer always had and nothing the CSP introduced.
- `0009` - built the tile layer that criterion #5 checks still draws under the policy.

## Not this card
Not the tile proxy, which is card `0012`. Not the dataset URL scheme, which is card `0013`. Not the
privacy note, which is card `0014`. Not moving the DNS record behind the Cloudflare proxy: the record is unproxied by decision so Hostinger
can issue its own certificate, and putting a WAF in front is a different card with a different
trade. Not adding `X-Frame-Options`; `frame-ancestors` supersedes it and every browser this app
targets honours the CSP form.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN any page is requested, THE APP SHALL send a Content-Security-Policy with no
      `unsafe-inline` and no `unsafe-eval`, and SHALL still render, locate, list and map correctly.
- [x] #2 WHEN any page is requested, THE APP SHALL send `Strict-Transport-Security`,
      `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`.
- [x] #3 WHEN the app is loaded in a frame by another origin, THE APP SHALL refuse to render.
- [x] #4 WHEN `sw.js` is requested, THE APP SHALL send the `no-store` value the file specifies
      rather than a value silently overridden by a later block.
- [x] #5 WHEN the tile layer is switched on, THE APP SHALL still draw tiles under the CSP.
- [x] #6 WHEN the self-tests read `app/.htaccess`, THE SUITE SHALL judge only the directives Apache
      would act on, so commenting a security header out turns the run red.
      proves: `a commented-out security header fails the suite`
- [x] #7 WHEN the self-tests check that the app stays inside the CSP, THE SUITE SHALL read every
      shipped file that builds markup rather than `index.html` alone, so an inline handler or a
      style attribute in a template string fails the run.
      proves: `no inline event handler in any shipped markup`
      and `no style attribute in any shipped markup`
<!-- AC:END -->

## Tasks
- [x] Add the header block to `app/.htaccess`, using `Header always set` so errors carry them too
- [x] Move the `sw.js` cache block below the general one and say why in the file
- [x] Replace `%{HTTP_HOST}` in the redirect with the literal host
- [x] Self-tests for every header, for the block order, and for the app staying CSP-satisfiable
      (no inline script, no inline handler, no `style=` in markup, no `eval`)
- [x] Verify the headers on the live site after deploy
- [x] Load the deployed app in a browser and confirm nothing is CSP-blocked
- [x] Confirm the same on the phone, the only place iOS Safari's CSP behaviour is real
- [x] Open the map on the phone with Tiles on, the one part the first screenshot did not cover
- [x] Strip comments from `.htaccess` once, in both blocks that read it, so no assertion can be
      satisfied by a commented-out line or by prose in a comment
- [x] Prove that strip with a check that runs the header patterns over an all-commented copy of the
      real file and requires every one of them to fail
- [x] Widen the inline-handler and style-attribute checks from `index.html` to every shipped script,
      which is what `.htaccess` already claims in its own comment

## Plan
The CSP is strict because it can be: no build step, no CDN, no inline script, no inline handler.
`img-src` needs `data:` for the paper grain, which is a data: SVG in `app.css`. `style-src 'self'`
is safe despite the drag code writing `panel.style.transform`, because CSP governs `<style>`
elements and `style` attributes parsed from markup, not CSSOM property assignment.

The self-tests are the durable part. Three of them assert the app stays *inside* the CSP, so a
future inline handler fails in node rather than as a blank screen on a phone, which is the only
other place it would show up, and only for whoever hits it first.

## Direction
**2026-08-10** Built and deployed. Live headers verified with `curl`; see the acceptance boxes.

**Confirmed on the device the same day**, which is the only check that counts for a CSP: iOS
Safari applies it, other browsers only rehearse it. Rob's screenshot of the installed PWA shows
the footer reading `build v10-2026-08-10`, so the strict policy is what the phone is actually
running, and nothing in it is blocked: the stylesheet, all three scripts, the `data:` paper grain
and the inline SVG icons all render, and geolocation still resolves (a fix at plus or minus 35 m,
list sorted by distance). The build string in the footer is exactly what it exists for. It also
shows the update landed on the first online launch rather than the second, so the
`controllerchange` reload added on 2026-08-08 is doing its job.

**Tiles confirmed on the phone the same day.** Thunderforest Outdoors draws over the whole map at
three zoom levels with the toggle on, and the detail sheet still renders its **Forestry England
page** link, which is `NF.safeHref` from card 0013 passing on the device rather than in a test.
So `img-src 'self'` covers the proxy correctly under iOS Safari, and nothing in the policy is
blocking a tile.

Everything on this card is now evidenced on the device. Card 0015 came out of the same
screenshots, and is a legibility defect the tile layer has always had rather than anything the
CSP introduced.

### 2026-09-07 review (v20260907113904-f98e)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I traced each criterion to real code.

**#1 CSP** ÔÇö `app/.htaccess`, "Security headers" block: `Header always set Content-Security-Policy` with `script-src 'self'`, no `unsafe-inline`, no `unsafe-eval`. The app stays inside it: `loadJson()` in `app/app.js` and the boundary fetch in `app/map.js` use relative URLs (same origin, so `connect-src 'self'` holds); the grain is a `data:` SVG in `app/app.css`, covered by `img-src data:`. No `style=` and no `on*=` handler anywhere in `app/*.js` or `app/index.html` (grep found none).

**#2** ÔÇö same block sets `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, all with `always`.

**#3** ÔÇö `frame-ancestors 'none'` inside the same CSP.

**#4** ÔÇö the `sw\.js$` `FilesMatch` now sits after the general `.(html|css|js|json|webmanifest)$` block, so `no-store` is the last write and wins. `scripts/selftest.js` (hardening section) asserts the index order.

**#5** ÔÇö tiles come from `app/api/tiles.php`, same origin, so `img-src 'self'` serves them.

Self-tests back #1ÔÇô#4 in `scripts/selftest.js`. I tried to find a criterion with no code behind it and could not.

VERDICT: sound

**scope: defect**

**Scope: what grew.** Nothing. This card's own footprint is `app/.htaccess` and the hardening block in `scripts/selftest.js`. The other files in commit `de37fb2` (`app/api/tiles.php`, `NF.safeHref` in `app/core.js`, the footer in `app/index.html`) are cards 0012ÔÇô0014, not this one. Nothing crossed the fence: no `X-Frame-Options`, no Cloudflare proxy change, no tile-proxy or `href` work attributable here. The `%{HTTP_HOST}` literal is an explicit task on the card, not creep.

**Scope: what was left half done.** The task asked for self-tests that the app "stays CSP-satisfiable (no inline script, no inline handler, no `style=` in markup, no `eval`)". In `scripts/selftest.js`, the hardening block (`--- hardening (adversarial review, 2026-08-10) ---`) runs three of those four against `indexhtml` only. Just the `eval` check uses the `shipped` join of `app.js`, `core.js`, `map.js`, `sw.js`. But the card's own **Why** names `app.js` building HTML strings as the reason for the strict policy, and `app.js` writes `innerHTML` in three places. An inline `onclick=` or `style=` added inside those template strings passes node and fails only as dead UI on a phone ÔÇö the exact failure the Plan says these tests exist to stop.

VERDICT: defect

**breakage: defect**

I tried to break the header work. Here is what I found.

**Checked and it holds:** the CSP allows everything the app actually loads ÔÇö the three `<script src>` tags in `app/index.html`, the `data:` grain in the `--grain` variable in `app/app.css`, the same-origin tile URL built in `map.js` (`api/tiles.php?z=...`), and the service worker. No `<form>`, `<base>`, `<iframe>`, inline `<style>` or inline handler exists, so `form-action`/`base-uri`/`object-src 'none'` break nothing. `Referrer-Policy: strict-origin-when-cross-origin` still sends a same-origin `Referer`, so the `Referer` fallback in `app/api/tiles.php` keeps working. The `sw.js` block order and the literal-host redirect are both asserted in `scripts/selftest.js`.

**One gap.** In `scripts/selftest.js`, the hardening block checks "no inline event handlers in index.html" and "no style attributes in index.html markup" against `index.html` only. But the markup the CSP exists to defend is built in `app/app.js` (`renderList`'s `listEl.innerHTML = sites.map(...)` and the sheet's `$('#sheet-body').innerHTML = h`). The `eval` check already scans all four shipped files; these two do not. A future `style="` or `onclick=` in one of those template strings passes the suite and fails only on a phone. The `.htaccess` comment claiming "no inline event handler anywhere in the app" is therefore not what the tests check.

VERDICT: defect


## Comments
<!-- The card's thread, appended by ProgressBoard. Append-only: entries are added, never edited or removed. An entry beginning **Decided:** is an answer, and that is what a decision card exits on. -->

**2026-09-07** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 1 time between todo and ai-review, all 5 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 5 of 5 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

**2026-09-10** Rob's call, answering the queue: **re-run this card through `ai-review/`.** It met
its own acceptance - the reviewer graded that lens `sound` - and the finding that returned it is
next door to the card rather than inside it. A builder could not act on it and a reviewer may not
untick a box, so the card sat here fully ticked while every unattended run promoted it again. It is
not closed and it is not reopened. It goes back for a fresh adversarial pass with the earlier
verdicts still on the thread, and that pass decides whether the finding is this card's to carry.

### 2026-09-10 review

**suite**

The earlier pass said it could find no suite. There is one: `node scripts/selftest.js` from the
repository root, and it printed `280 passed, 0 failed` before I started and again after I finished.
Every claim below about a test going red was produced by breaking the guarded thing in a private
copy of the tree and re-running that suite, then restoring the original bytes.

**How the headers were checked, and why not in a browser.** `php -S` does not read `app/.htaccess`
- that file is Apache configuration - so this card's headers cannot be observed from a local
server, and the live site is out of bounds for this pass. So I read `app/.htaccess` directly and
read what `scripts/selftest.js` asserts about it, then attacked those assertions. I did load the
app at `http://127.0.0.1:8792/` to confirm the *other* half of criterion #1, that the app stays
inside the policy: list, detail sheet, map and tile toggle all drive with no script error and no
CSP-shaped failure in the console.

**acceptance: sound**

Each criterion traced to code, then the test behind it broken to prove it can fail.

**#1** - `Header always set Content-Security-Policy` with `script-src 'self'`, no `unsafe-inline`,
no `unsafe-eval`. Dropping `always` turns `.htaccess sets Content-Security-Policy` red; adding
`'unsafe-inline'` turns `the CSP carries no unsafe-inline or unsafe-eval` red. The app is inside
the policy: every request it makes is a relative same-origin path (`loadJson` in `app.js`,
`fetch('data/boundary.json')` in `map.js`, the precache in `sw.js`, `api/tiles.php` in `map.js`),
and the only `url()` in `app.css` is the `data:` grain, covered by `img-src data:`.

**#2** - all four present with `always`. Weakening `max-age` to 600, or removing the nosniff or
Permissions-Policy line, each turns exactly one assertion red.

**#3** - `frame-ancestors 'none'`; deleting it goes red.

**#4** - the `sw\.js$` block sits below the general one. I swapped the two blocks for real and
`the sw.js cache block comes after the general js one` went red. I also deleted the general block
outright to test the `indexOf(-1)` hole in that comparison: it passes, but a neighbouring
assertion, `the app shell is not HTTP-cached`, catches that case, so the pair holds.

**#5** - tiles are `api/tiles.php`, same origin, so `img-src 'self'` covers them. Confirmed in the
browser: with Tiles on, twelve tile requests left the page and none was refused by policy (they
503 locally because the key file lives only on the server).

VERDICT: sound

**scope: defect**

The 2026-09-07 finding is unchanged and I re-measured it against today's tree rather than trusting
it. Task 4 asked for self-tests that the app stays CSP-satisfiable, listing "no inline script, no
inline handler, no `style=` in markup, no `eval`". Three of the four read `app/index.html` only:

- `onclick="alert(1)"` added to the `<li>` template inside `renderList` in `app/app.js`: **280
  passed, 0 failed**.
- `style="color:red"` in the same string: **280 passed, 0 failed**.
- a `style="` inside a markup string in `app/core.js`: **280 passed, 0 failed**.
- the same `onclick=` and `style=` in `index.html`: both red, as intended.

The `eval` check is the one that does the right thing, scanning `app.js`, `core.js`, `map.js` and
`sw.js` together. `.htaccess` states "no inline event handler anywhere in the app", and the tests
only check one file of five. The card's own `## Why` names `app.js` building HTML strings as the
reason the policy is strict, so the gap is in the middle of the thing the card is about. Nothing
crossed the fence in the other direction: no `X-Frame-Options`, no Cloudflare change, no work
belonging to 0012, 0013 or 0014 attributable here.

VERDICT: defect

**breakage: defect**

A second, wider hole, and this one is new. **Every `.htaccess` assertion is an unanchored regex
over the file's text, so commenting a directive out passes.** Measured, one at a time, each by
prefixing a single `#`:

- `# Header always set Content-Security-Policy ...` -> **280 passed, 0 failed**
- `# Header always set Strict-Transport-Security ...` -> **280 passed, 0 failed**
- `# Header always set Permissions-Policy ...` -> **280 passed, 0 failed**
- `# Header always set X-Content-Type-Options ...` -> **280 passed, 0 failed**
- `# Header always set Referrer-Policy ...` -> **280 passed, 0 failed**

That is the whole header suite passing on an app that serves no security headers at all, which is
the exact state the 2026-08-10 penetration test found and this card exists to end. Commenting a
header out to test something is an ordinary thing to do and forgetting to put it back is the
ordinary way it goes wrong; the suite would say nothing. The fix is one character per pattern:
anchor them, `/^\s*Header always set Content-Security-Policy/m`, and the same for the other five
and for the redirect check.

**What held.** The header values themselves are right and the redirect uses the literal host. The
directives are not wrapped in `<IfModule mod_headers.c>`, which is the right way round: without
that guard a host missing `mod_headers` fails loudly instead of silently serving nothing.

VERDICT: defect

**security**

**Weakest, said as an attacker would use it.** The whole control is one file on shared hosting and
nothing in the repository can prove it is being served. A control-panel edit, a vhost change, or a
LiteSpeed configuration that ignores `.htaccess` and the CSP is simply gone, with a green suite and
no symptom on any screen. The use is framing: with `frame-ancestors` absent, an attacker embeds
the app in a page of their own, overlays it, and lets a visitor tap **Navigate** - which fires
`window.location.href` to a maps URL with no confirmation step - or waits for the geolocation
prompt to be granted to what the user thinks is a different site. The 2026-08-10 `curl` check is
the only evidence the headers ever went out, and it is a month old.

**What is unchecked on the way in.** Nothing on this card takes user input; `.htaccess` is
configuration. The path worth naming is the one the card does not cover: `app/api/tiles.php`
writes its own `Content-Type` and `Cache-Control` on every response including its error bodies, and
its protection from sniffing comes from the global `nosniff` above rather than from anything in the
script. That coupling is invisible from either file.

**What it leaks when it fails.** Nothing directly: there is no server-side state and no other
tenant. The residual disclosure is referrer. `Referrer-Policy: strict-origin-when-cross-origin`
sends the bare origin cross-site, so a maps hand-off tells Google, Apple or Waze that
forestlocator.enhanceify.co.uk sent this person (card 0014 carries that). The two dataset links
carry `rel="noreferrer"` and send nothing. There is deliberately no CSP `report-uri`, because a
report endpoint would be an external request in an app whose whole point is making none, so a
violation on somebody's phone is visible to nobody. That is a cost worth stating, not a defect.

VERDICT: defect

**2026-09-10** RESULT: done
TESTS: +1 new, 2 widened, all green (285 passed, 0 failed)
TOUCHED: scripts/selftest.js
OUT-OF-SCOPE: none

Picked up because the brief's "What's next" makes this item 1: until the tests that cannot fail are
fixed, every other green run on this project means less than it looks like. **Two criteria were
added and were written before the code.** No existing box was touched. The 2026-09-10 reviewer
graded acceptance `sound` and both findings sat under a task rather than under a criterion, so there
was nothing to untick; what was missing was a criterion saying the tests must be able to fail, and
that is what #6 and #7 now say.

**The stale `## What I need from you` block is gone.** Rob answered the queue on 2026-09-10 and the
block still asked him to untick a box, which is the opposite of what he decided.

**Finding one, the unanchored `.htaccess` searches, fixed once rather than six times.** The reviewer
suggested anchoring each pattern. Stripping the comments in one place is smaller and covers more:
every present and future assertion about that file reads only the directives Apache would act on,
and it also closes the quieter half, which is that the file explains `frame-ancestors` in prose
three lines above the directive, so a comment could have satisfied a check on its own. Both blocks
that read `.htaccess` now go through the same helper.

**Finding two, the CSP-satisfiable checks, widened to what the card is actually about.** They read
`index.html` alone, and `index.html` is not where the markup lives: `renderList` and the detail
sheet in `app/app.js` build HTML strings and assign them with `innerHTML`, which is the reason this
card's `## Why` says the policy has to be strict. They now read every shipped script as well. The
`.htaccess` comment already claimed "no inline event handler anywhere in the app", so this is making
the test say what the file says.

**Every claim below was measured, then the file restored and confirmed byte-identical with `git
diff`.**

- Comment out `Strict-Transport-Security`: `FAIL .htaccess sets Strict-Transport-Security`. 284/1.
- Comment out the other four headers together: **five** failures, not four, because
  `frame-ancestors 'none'` lives on the CSP line and goes with it. 280/5. That is the exact run the
  reviewer measured as 280 passed, 0 failed, now red.
- Replace the strip with an identity function: `FAIL a commented-out security header fails the
  suite, 6 of 6 checks still pass with every directive commented out`. 284/1. That check reads the
  same `wantHeaders` list as the assertions it guards, so a pattern added later is covered without
  anybody remembering to.
- Put `onclick="alert(1)" style="color:red"` inside the list template in `app/app.js`: both widened
  checks red. 283/2. Under the old tests this run was green.

**Nothing under `app/` changed**, so `CACHE` and `BUILD` are untouched at `v26-2026-09-10` and there
is nothing to deploy.

**No browser check, and that is a claim rather than a skip.** This card's change is entirely inside
`scripts/selftest.js`. The headers themselves cannot be observed locally in any case: `php -S` does
not read `.htaccess`, because that file is Apache configuration, and the live site is out of bounds
for an unattended session. The 2026-09-10 reviewer drove the app at `127.0.0.1:8792` to confirm the
other half of criterion #1, that the app stays inside the policy, and nothing since then has
touched a file the browser loads.

### 2026-09-11 review (v20260911020323-f5a0)

**suite**

No suite this job could find in NearestForest, so none ran. That is not a pass.

**acceptance: sound**

I checked each box against the real code.

- **#1** `app/.htaccess` "Security headers" block sets `Content-Security-Policy` with `script-src 'self'`, no `unsafe-inline`, no `unsafe-eval`. The app stays inside it: `loadJson` in `app/app.js`, the boundary fetch in `app/map.js` and the precache in `app/sw.js` all use same-origin relative paths, and the only `url()` in `app/app.css` is the `data:` grain, which `img-src data:` allows.
- **#2** Same block sets `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`, each with `always`.
- **#3** `frame-ancestors 'none'` sits inside that same policy.
- **#4** The `sw\.js$` `FilesMatch` block is below the general one, so `no-store` is the last write and wins.
- **#5** Tiles come from `app/api/tiles.php`, same origin, so `img-src 'self'` covers them.
- **#6** `htaccessDirectives` and `stripHtaccessComments` in `scripts/selftest.js` drop every comment line, and the "a commented-out security header fails the suite" check re-runs the same `wantHeaders` list over an all-commented copy of the real file.
- **#7** The hardening block joins `app.js`, `core.js`, `map.js` and `sw.js` with `index.html` into `markup`, and the inline-handler and style-attribute checks read that join.

I ran `node scripts/selftest.js`. It printed 306 passed, 0 failed. I could not find a criterion with no code behind it.

VERDICT: sound

**scope: sound**

Scope check on card 0011, second pass.

**What the change touched.** Only `scripts/selftest.js`: the `stripHtaccessComments` / `htaccessDirectives` helper near the top, and the `--- hardening ---` block. The other files in the branch diff belong to cards 0012, 0013, 0014, 0016, 0019 and 0021, not here.

**Nothing crossed the fence.** No `X-Frame-Options`, no Cloudflare or DNS change, no tile-proxy work, no `href` scheme work, no footer privacy text added by this pass. The `.htaccess` wording edits in the diff are card 0021's reading pass, not this card.

**Nothing left half done.** Both places that read `app/.htaccess` now go through `htaccessDirectives`, which is the task as written. The widened checks join `index.html` with `app.js`, `core.js`, `map.js` and `sw.js`, and those are every shipped script; `innerHTML` appears only in `render` and `openSheet` in `app/app.js`, both covered. The all-commented proof reads the same `wantHeaders` list it guards, so a later pattern is covered without anyone remembering.

I tried to find growth and an unfinished edge and found neither.

VERDICT: sound

**breakage: defect**

I attacked the widened checks and the comment strip.

**Held.** Both `.htaccess` readers go through `htaccessDirectives()` in `scripts/selftest.js`, so no assertion still reads the raw file. Commenting out the general `FilesMatch` block leaves `indexOf` at -1, but `the app shell is not HTTP-cached` in the service-worker block catches that. No shipped file trips the widened regexes today: every `style` write in `app/app.js` (`dragSheet`) and `app/map.js` is `panel.style.x`, with no space before `style`, so CSSOM assignment cannot false-positive.

**Broken.** `docs/HANDOVER.md`, in the `app/.htaccess` bullet of the file map, still says "no inline script, inline handler or `style=` attribute may enter `index.html`". That was true of the old tests. The rule is now every shipped script, and the file map is where a contributor reads the rule. A person following the doc believes a handler inside a `renderList` template string is allowed.

**Gap the tests do not build.** In the hardening block of `scripts/selftest.js`, `no style attribute in any shipped markup` is a text match. `setAttribute('style', ...)` violates `style-src 'self'` and passes both widened checks.

VERDICT: defect

**2026-09-11** The reviewer returned this card and its finding is the last review entry at the bottom of ## Direction. The loop moved it from todo/ to human-review/ because it has bounced 3 times between todo and ai-review, all 7 criteria ticked. THE BUILDER COULD NOT ACT ON THAT FINDING. A reviewer never unticks a criterion - it is forbidden from editing acceptance at all - so the card came back with 7 of 7 criteria still ticked, every session found nothing open to do, and the loop promoted it again on the boxes. Untick what the reviewer disproved and move it back to todo/, or say here why the finding is wrong.

