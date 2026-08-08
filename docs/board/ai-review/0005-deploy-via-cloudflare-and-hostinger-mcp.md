# Deploy to the subdomain via the Cloudflare and Hostinger MCPs

## Why
The app is built, tested and committed but has never been served. Rob has since connected Cloudflare
(DNS) and Hostinger (shared hosting) MCP servers specifically so this can be done from a session
rather than by hand. The infrastructure half of the old card 0001 became agent-doable at that point,
so it was split out here; 0001 kept only the on-phone checks that genuinely need a person.

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
