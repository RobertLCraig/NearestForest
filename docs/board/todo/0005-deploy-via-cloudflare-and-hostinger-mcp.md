---
not_for_the_loop: creates a live DNS record and deploys the app to a shared host, neither of which a deleted file undoes
---
# Deploy to the subdomain via the Cloudflare and Hostinger MCPs

## Why
The app is built, tested and committed but has never been served. Rob has since connected Cloudflare
(DNS) and Hostinger (shared hosting) MCP servers specifically so this can be done from a session
rather than by hand. The infrastructure half of the old card 0001 became agent-doable at that point,
so it was split out here; card `0001` kept only the on-phone checks that genuinely need a person.

## Links

**Relates to**
- `0001` - this card was cut out of it. That one keeps the five checks that need a physical iPhone,
  and none of them can run until this one has put the app on a real address.
- `0002` - the Shortcut recipe calls `api/nearest.php`, which does not exist anywhere until this
  card deploys it.

**The MCP servers were not visible in the session that wrote this card**, checked three ways: tool
search returned nothing for either, `ListMcpResourcesTool` found no such server, and there was no
`mcpServers` block in `~/.claude.json`, `~/.claude/settings.json`, `settings.local.json` or a project
`.mcp.json`. Claude Code loads MCP servers at session start, so they should appear after a restart.
Confirm with `/mcp` before starting, and if they are still absent say so rather than falling back to
hand-holding Rob through hPanel, because that was the previous plan and it is what this card exists
to replace.

**Do not assume the Hostinger MCP can upload files.** Their public API is largely domains, VPS and
billing. If file upload for shared hosting is not exposed, do the DNS and any subdomain creation that
is available, then hand the upload back to Rob explicitly and say which part could not be automated.
Discovering that is part of this card, not a failure of it.

## Facts already established, do not re-derive

Checked live over public DNS on 2026-08-08:

- `enhanceify.co.uk` runs on **Cloudflare nameservers** (`rachel.ns.cloudflare.com`, `yahir.ns.cloudflare.com`)
- apex A record points to **141.136.33.219** (Hostinger)
- `regenesis.enhanceify.co.uk` resolves to **the same 141.136.33.219**, and returns the Hostinger
  address rather than a Cloudflare one, so existing subdomains are **DNS-only (grey cloud), not proxied**
- `forestlocator.enhanceify.co.uk` had **no record yet** at the time of writing

So the DNS change is one record matching the pattern already working for regenesis:

```
forestlocator.enhanceify.co.uk   A   141.136.33.219   DNS only (grey cloud)
```

Keep it unproxied. Hostinger issues its own Let's Encrypt certificate, and proxying would put
Cloudflare in front of that validation for no benefit here.

**DNS lives at Cloudflare, not Hostinger.** The original checklist said "create the subdomain in
hPanel" and silently assumed that covered DNS. It does not: hPanel creates the vhost and the
certificate, Cloudflare serves the record. Both are needed.

## Not this card
Not the on-phone verification (card 0001). Not the Shortcut (0002). Not any code change: if a deploy
step reveals a bug, open a card rather than fixing it here. Do not proxy the record through
Cloudflare. Do not touch the apex record or the regenesis subdomain, both of which serve live sites.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN the subdomain is resolved, THE APP SHALL return 141.136.33.219 from an unproxied A record.
- [x] #2 WHEN the subdomain is loaded over HTTPS, THE APP SHALL serve index.html with a valid
      certificate and no warning.
- [x] #3 WHEN manifest.webmanifest is requested, THE APP SHALL return it with content-type
      `application/manifest+json`, proving the .htaccess AddType applied.
- [x] #4 WHEN `/api/nearest.php?lat=50.8168&lng=-0.0894&n=3` is requested, THE APP SHALL return JSON
      beginning `{"ok":true,` listing Friston Forest first, proving PHP executes rather than being
      served as source.
- [x] #5 WHEN any deploy step cannot be automated by the available MCP tools, THE APP SHALL report
      which step and why, rather than reporting the deploy as complete.
<!-- AC:END -->

## Tasks
- [x] Run `/mcp` and confirm both servers are connected and authorised
- [x] **Confirm the subdomain name with Rob before creating any record.** `forestlocator.enhanceify.co.uk`
      is a suggestion he has not yet agreed to, and a DNS record is outward-facing
- [x] Enumerate what the two MCPs can actually do before planning the sequence, rather than assuming
- [x] Create the A record at Cloudflare, unproxied
- [x] Create the subdomain in Hostinger with its document root at the **contents of `app/`**, not the
      repo root, which would expose `docs/` and the scrape cache
- [x] Issue the SSL certificate
- [x] Upload the contents of `app/`, including the `.htaccess` dotfile that many tools skip
- [x] Verify acceptance #1 to #4 with curl and paste the actual output
- [x] Tick the matching lines in `HUMAN_ACTIONS.md`, then move card 0001 to the top of Rob's queue

## Direction
**2026-08-08** Rob confirmed the subdomain as **`forestlocator.enhanceify.co.uk`**, choosing the
longer explicit name over `forest` because it is never typed by hand.

**2026-08-08** Rob: "should stick to the existing git structure, not scp". Correct, and it changed
the answer to this card's central question. The first pass concluded the upload could not be
automated, because the Hostinger MCP exposes no file-upload tool for shared hosting (its archive
imports are Agency-Plan-only or Node.js-only) and it fell back to scp. Both readings missed that
`~/.ssh/config` already had a `hostinger` alias with a working key, and that every other site on
the account deploys by `git pull` onto a checkout with `public_html` symlinked into it. The deploy
now follows that pattern.

## Outcome
Deployed and verified. **https://forestlocator.enhanceify.co.uk/**

- DNS: one unproxied A record at Cloudflare, id `b110a9f9d9a730df168893e92d7f67cc`.
- Hosting: addon vhost via the Hostinger MCP, `public_html -> repo/app`, PHP pinned to 8.4
  (it came up on 8.3 while the account CLI is 8.4).
- Deploy: `pwsh ./scripts/deploy.ps1`, which tests, guards the service-worker cache key, pushes,
  and runs `scripts/deploy.sh` over SSH. Repo: `github.com/RobertLCraig/NearestForest` (public).

All five acceptance criteria verified by curl, including that `/docs/PRD.md` 404s and `/.git/config`
403s, so the checkout is not exposed. Two bugs in the deploy script were found by running it rather
than by reading it, and both are fixed: a fixed-length smoke-test compare that failed a working
endpoint, and `deploy.sh` running a splice of its old and new selves because `git pull` rewrote the
file bash was mid-way through reading.

**Not done, and deliberately:** nothing on a phone. That is card 0001, which this unblocks.

## Comments

### 2026-09-10 review

**How this card was reviewed, since it is `not_for_the_loop`.** Nothing left this machine. I did not
run `scripts/deploy.ps1` in any form including `-DryRun`, did not touch DNS, did not use the
Cloudflare or Hostinger tools, and did not fetch the live site. The card was attacked by reading
`scripts/deploy.ps1`, `scripts/deploy.sh`, `.gitattributes` and the Deployment section of
`docs/HANDOVER.md` against what it promised, plus what could be proven locally off a
`php -S 127.0.0.1:8791 -t app` server. `node scripts/selftest.js`: **280 passed, 0 failed**.

**acceptance: defect**

Criteria #1 to #4 are assertions about a live host, so by the rules of this run I could not settle
them and I am **not** claiming the deploy did not happen. What I could check locally, I did:

- **#4's payload, minus the host.** `curl` against my own server returned
  `{"ok":true,"generated_at":"2026-08-29",…` with **Friston Forest first at 10.8 miles** from
  `lat=50.8168&lng=-0.0894`. The ranking and the JSON envelope the criterion names are correct in
  the code; only "and it does this on the live vhost" is unverified here.
- **#3's mechanism.** `app/manifest.webmanifest` exists (604b) and
  `AddType application/manifest+json .webmanifest` is line 4 of `app/.htaccess`. `php -S` does not
  read `.htaccess`, so the served content-type is untestable locally by design.
- **#5.** Honoured in the record rather than dodged: the card's own `## Direction` says the first
  pass concluded upload could not be automated and explains what changed the answer, and
  `HUMAN_ACTIONS.md` line 28 marks the upload step superseded by the git deploy rather than ticked
  as if the MCP had done it. That is the criterion behaving as written.

**The defect is that not one of the five criteria carries `proves:`.** The board README is explicit:
`proves: manual` is required for anything only a person at a screen can settle, `proves: none` where
nothing here can test it with the reason on the line, and "what is refused is a criterion that is
silent about its proof, because that is the one that reads as tested and is not." All five are
silent. #1 to #4 are live-host assertions no repository test can ever settle, which is precisely the
case `proves: manual` exists for.

This is not pedantry about a finished job. It is why this card cannot be re-verified by anything:
every unattended pass can only re-read five ticks, and there is nothing on the card that says those
ticks were settled by a person with curl rather than by an agent with optimism. The evidence does
exist (record id `b110a9f9d9a730df168893e92d7f67cc`, `ssl_verify_result=0`, `{"ok":true,` with
Friston first), but it is in `HUMAN_ACTIONS.md` and in `## Outcome`, not against the criteria it
proves. **A reviewer may not edit an `## Acceptance` block**, so I have not added the markers.

VERDICT: defect

**scope: sound**

The fence: not the phone checks (0001), not the Shortcut (0002), no code change, do not proxy the
record, do not touch the apex or the regenesis subdomain. Nothing in the tree contradicts any of
those. `deploy.ps1` and `deploy.sh` are new infrastructure rather than app code, and `app/` carries
no change attributable to this card.

**The one thing I nearly failed it for.** `## Not this card` says "if a deploy step reveals a bug,
open a card rather than fixing it here", and `## Outcome` says two bugs in the deploy script were
found and both were fixed in place. I let it stand, and the reason is the word "deploy step": the
fence is protecting the *app* from a deploy session, and the two bugs were in this card's own
instrument: a fixed-length smoke-test compare that failed a working endpoint, and `deploy.sh`
running a splice of its old and new selves after `git pull` rewrote the file mid-read. A card whose
job is "make the deploy work" that may not repair the deploy script cannot be finished at all. Both
fixes are visible and both are defensive: the smoke test is now a prefix match with the reasoning in
a comment, and the script re-execs itself in a second stage.

VERDICT: sound

**breakage: sound**

`.gitattributes` pins `*.sh`, `*.php` and `.htaccess` to `eol=lf`, which is the thing that stops a
CRLF checkout on this Windows box shipping `bad interpreter: /usr/bin/env bash^M` to a Linux host.
That matches what `deploy.sh` needs. `deploy.sh` refuses to run when `public_html` is a real
directory rather than the `repo/app` symlink, which is the failure that would otherwise report a
clean deploy while changing nothing Apache serves, and it checks the symlink *target* too. It reads
the `CACHE` constant and fails if absent. `deploy.ps1` refuses a branch mismatch, a failed suite, a
stale service-worker key and an unclean tree. HANDOVER's Deployment section agrees with both scripts
on every detail I checked. This is a careful pair of scripts.

**The three questions.**

1. **Where is it weakest.** `deploy.ps1` builds the remote command by string interpolation and hands
   it to `ssh`: `$RemoteDir` lands inside `"$HOME/$RemoteDir"` in a string the *remote* bash
   evaluates, so a value carrying `$(…)` or backticks is command substitution on the shared host as
   that account. Same shape for `$Site` and `$Branch` inside their single quotes, which a `'`
   closes. Nobody can reach this from the internet; the way it gets used is somebody pasting a
   longer invocation, or a later script filling those parameters from a variable. Today all three
   have safe literal defaults and a person types the command, so it is latent rather than open, but
   it is the one place in this card's output where untrusted text would become code on the server.
2. **What is unchecked.** Those three parameters are never validated against anything. Separately,
   `-Force` is one switch that bypasses **two** unrelated guards, the stale `CACHE` key and the
   uncommitted working tree. The cache guard exists because shipping changed files under an
   installed cache key strands every installed copy on the old dataset *silently*, which the script's
   own comment calls out as worth a hard stop; sharing a flag with "I know my tree is dirty" makes it
   easy to spend the serious one to buy the trivial one.
3. **What it leaks when it fails.** Little, and deliberately. `deploy.sh` echoes the first 80 bytes
   of the API response and the site host on a smoke-test failure, which is our own data. The
   Thunderforest key is never printed: `readKey()`'s value is only interpolated into the upstream
   URL, and `curl_error` is swallowed behind a fixed `'Tile upstream unreachable.'` with a comment
   saying why. I checked the public-repo angle the card's own Outcome raises: no `tiles.key` in the
   tree, `tiles.key` and `*.key` both in `.gitignore`, and a self-test greps tracked files for a
   leaked `apikey=`. I found no secret in the repository.

Neither note is a defect and neither blocks the card. Both are worth a line in a follow-up if this
script ever gets called by something other than a person.

VERDICT: sound

**Where it should go.** `todo/`, for the acceptance markers only. The deploy itself is done,
evidenced in three places and not in question; what is missing is five `proves:` clauses, and
because that means editing `## Acceptance` it needs a person or a builder rather than a reviewer.
