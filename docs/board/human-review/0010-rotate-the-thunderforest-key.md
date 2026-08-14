---
waiting_on: enhanceify.co.uk mail to be fixed before step 1 can even be sent - recheck 2026-08-28
---

# Rotate the Thunderforest API key

## What I need from you

**Ask Thunderforest support for a replacement key, install it on the server, and get the old one
revoked.** The dashboard has no self-service rotation (established 2026-08-10), so step 1 is an
email rather than a button. Three steps, each with its own pass:

1. Ask Thunderforest support for a replacement key, from the account's own email address, saying
   the existing key should be revoked once the new one is live. There is a contact form at
   <https://www.thunderforest.com/contact/>.
   *Pass:* a reply carrying a new key. *Fail:* silence for a week, which is the recheck date in
   this card's `waiting_on`.
2. Replace the server copy. Do not paste the new key into chat, into the repo, or into a card:

       ssh hostinger "printf '%s' 'NEW_KEY' > ~/domains/forestlocator.enhanceify.co.uk/tiles.key && chmod 600 ~/domains/forestlocator.enhanceify.co.uk/tiles.key"

   *Pass:* open <https://forestlocator.enhanceify.co.uk/> , open the map, tap **Tiles**, and the
   basemap still draws. *Fail:* the outline draws but no tiles, which means the file is empty, has
   a trailing newline, or holds a key that has already been revoked.
3. Confirm the old key is dead rather than merely superseded, by asking support to say so.
   *Pass:* a reply confirming revocation. This is the step that actually ends the exposure; a new
   key alongside a live old one changes nothing.

**Pass** is all three, and step 3 is the one that ends the exposure: a new key alongside a live old
one changes nothing.

**Fail** at step 1 is silence for a week, which is the recheck date in this card's `waiting_on`. At
step 2 it is the outline drawing with no tiles, which means the file is empty, carries a trailing
newline, or holds a key that has already been revoked.

**Why it needs you** The request has to come from the account's own email address, and the new key
must not pass through chat, the repository or a card. That leaves nowhere for an agent to stand.

**Step 1 is blocked on something else entirely, and this is why the card has not moved.** Mail for
`enhanceify.co.uk` is not reaching its Migadu mailbox. Measured 2026-08-14 by direct DNS query: the
domain's MX records point at Cloudflare Email Routing (`route1/2/3.mx.cloudflare.net`) and SPF
authorises `_spf.mx.cloudflare.net`, while every Migadu artefact is still in place beside them
(`hosted-email-verify`, all three DKIM CNAMEs, the `autoconfig` CNAME). Inbound mail is therefore
being accepted by Cloudflare and forwarded somewhere, and Migadu never sees it. Step 1 asks
Thunderforest to reply to that address, so sending it now means losing the reply and the key with
it. Fix the mail first. That work belongs on the **enhanceify-V2** board, not this one.

No redeploy is needed. `api/tiles.php` reads the file on every request, which is exactly why it was
built that way rather than baking the key into the app.

## Why
Hygiene rather than an incident, and worth stating plainly so nobody over- or under-reacts. Nothing
leaked into the repository: a self-test greps every tracked file for a key and `.gitignore` refuses
`*.key`. The server copy is `-rw-------` and sits above the web root, and `/tiles.key`,
`/../tiles.key` and `/api/../../tiles.key` were each checked and return 404. The only exposure is
the transcript, and the realistic worst case is someone spending the free tier's 150k tiles a month.

**2026-08-10, and it cuts both ways.** A penetration test found the proxy would serve a tile to
anyone who omitted a `Referer`, so until card 0012 landed, spending the quota needed no key at all
and this rotation was not the control anyone thought it was. 0012 closed that. What is left here is
the original point, undiminished: a key that has been in a transcript is not private, and only a
revocation makes it so.

## Not this card
Not changing provider and not changing the proxy. Rate limiting and the access control that should
have been on the endpoint are card 0012, which was built rather than deferred once the review
showed the endpoint was open in practice and not merely in theory. Not server-side tile caching.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the tile layer is switched on after the key is replaced, THE APP SHALL draw tiles.
- [ ] #2 WHEN the repository is searched, THE APP SHALL contain no API key, old or new.
<!-- AC:END -->

## Tasks
- [ ] Ask Thunderforest support for a replacement key (no self-service rotation exists)
- [ ] Replace `tiles.key` on the server and re-check the Tiles toggle
- [ ] Confirm the old key is revoked rather than merely superseded
