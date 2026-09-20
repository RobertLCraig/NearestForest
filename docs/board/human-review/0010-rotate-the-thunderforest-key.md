---
not_for_the_loop: the new key must reach the server without passing through the repository, a card or a chat, and no agent can hold it
---

# Rotate the Thunderforest API key

## What I need from you

**One command left. The key is already rotated; it just is not on the server yet.**

Paste this into a terminal with your new key in place of `NEW_KEY`, and nowhere else:

    ssh hostinger "printf '%s' 'NEW_KEY' > ~/domains/forestlocator.enhanceify.co.uk/tiles.key && chmod 600 ~/domains/forestlocator.enhanceify.co.uk/tiles.key"

- **Pass:** open <https://forestlocator.enhanceify.co.uk/>, open the map, tap **Tiles**, and the
  basemap draws.
- **Fail:** the coastline draws with no tiles on top. That means the file is empty, has a trailing
  newline, or holds a key that is already revoked. `printf` rather than `echo` is what avoids the
  newline, which is why the command is written that way.

Then one more thing, and it is the one that actually ends the exposure: **ask Thunderforest to
confirm the old key is revoked, not merely superseded.** A new key alongside a live old one changes
nothing about the key that reached a chat transcript.

**Do not paste the new key into this card, into the repository, or into a chat with me.** That is
the whole reason the old one needed rotating, and it is why no agent can do this step.

---

**Superseded, kept so nobody redoes it.** The original three steps were: ask support for a
replacement, install it, confirm revocation. Step 1 is done, and with it the blocker this card
carried for six weeks.

1. ~~Ask Thunderforest support for a replacement key, from the account's own email address.~~
   **Done, Rob, 2026-09-20.** The card had been waiting on `enhanceify.co.uk` mail being fixed,
   because Thunderforest checks the sending address against the account. That is no longer the
   blocker and the `waiting_on:` is gone.
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

**The mail blocker that held this card for six weeks is spent**, because step 1 has happened. The
measurement behind it is kept under `## Decided` below rather than repeated here, since it is still
true of the domain and still belongs to the enhanceify-V2 board. It no longer holds anything here.

No redeploy is needed. `api/tiles.php` reads the file on every request, which is exactly why it was
built that way rather than baking the key into the app.

## Why
Hygiene rather than an incident, and worth stating plainly so nobody over- or under-reacts. Nothing
leaked into the repository: a self-test greps every tracked file for a key and `.gitignore` refuses
`*.key`. The server copy is `-rw-------` and sits above the web root, and `/tiles.key`,
`/../tiles.key` and `/api/../../tiles.key` were each checked and return 404. The only exposure is
the transcript, and the realistic worst case is someone spending the free tier's 150k tiles a month.

**2026-08-10, and it cuts both ways.** A penetration test found the proxy would serve a tile to
anyone who omitted a `Referer`, so until card `0012` landed, spending the quota needed no key at all
and this rotation was not the control anyone thought it was. `0012` closed that. What is left here
is the original point, undiminished: a key that has been in a transcript is not private, and only a
revocation makes it so.

## Links

**Relates to**
- `0012` - closed the hole that made the quota spendable with no key at all, which is why this card
  is hygiene rather than the only control. It is not a prerequisite: the key is still exposed
  whether or not that card exists.
- `0009` - installed the key this card replaces, and set the pattern of keeping it in a file above
  the web root so a swap needs no redeploy.

## Not this card
Not changing provider and not changing the proxy. Rate limiting and the access control that should
have been on the endpoint are card `0012`, which was built rather than deferred once the review
showed the endpoint was open in practice and not merely in theory. Not server-side tile caching.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the tile layer is switched on after the key is replaced, THE APP SHALL draw tiles.
- [ ] #2 WHEN the repository is searched, THE APP SHALL contain no API key, old or new.
<!-- AC:END -->

## Tasks
- [x] Ask Thunderforest support for a replacement key (no self-service rotation exists)
- [ ] Replace `tiles.key` on the server and re-check the Tiles toggle
- [ ] Confirm the old key is revoked rather than merely superseded

## Decided
<!-- The answer, dated. Appended: a reversal is a later line, not an edit. -->

**2026-08-18** Key rotation email has now been sent.

**2026-09-10** Folded out of `docs/HANDOVER.md`, which is over its size budget and is not the place
for another project's DNS. **This is the card that mail routing blocks**, because Thunderforest
checks the sending address against the account, so the measurement belongs here.

Rob cannot send from `enhanceify.co.uk`. Receiving works, outbound does not. Measured 2026-08-14 by
direct DNS query against 1.1.1.1: MX points at Cloudflare Email Routing
(`route1/2/3.mx.cloudflare.net`) and SPF authorises `_spf.mx.cloudflare.net`, while Migadu's own
records are all still present alongside them (`hosted-email-verify=`, three DKIM CNAMEs,
`autoconfig`). Cloudflare Email Routing forwards inbound and sends nothing outbound, which matches
the symptom. **The fix belongs on the enhanceify-V2 board, not this one**, and Rob asked on
2026-08-14 that it be left alone for now. Cards `0017` and `0018` are **not** blocked by it: neither
cares which address the email leaves from.

## Comments

**2026-09-20** Rob: "rotation has been done, I just need to get around to loading the new key
somewhere secure (rather than lazily telling you and repeating the problem!)". Step 1 of three is
closed and the ask at the top of this card is now only the remaining two.

**The long-standing blocker on this card is dead.** It carried
`waiting_on: enhanceify.co.uk mail to be fixed before step 1 can even be sent`, because Thunderforest
checks the request against the account's own address. Step 1 has happened, so that key is removed.
It was also the only thing on this board waiting on that mail fix, which lives on the enhanceify-V2
board and is not this project's to chase.

**`not_for_the_loop:` added, with the real reason.** It was never on this card, which was an
oversight: a new API key has to reach the server without passing through the repository, a card or a
chat, and there is nowhere for an agent to stand in that. `docs/board/README.md` is explicit that
the key names why, and "no agent can hold the secret" is a better reason than "it is hard".

**Not closed, and this is the part worth being plain about.** Neither criterion is ticked and
neither should be. #1 needs tiles drawing on the live site with the new key in place, and #2 needs
the repository searched again afterwards. More to the point, **rotation on its own ends nothing**:
until Thunderforest confirm the old key is revoked rather than merely superseded, the key that
reached a chat transcript is still a working key. That is step 3 and it is the whole point of the
card.

**Still hygiene rather than an incident**, unchanged since 2026-08-10: nothing leaked into the
repository, `*.key` is refused by `.gitignore`, a self-test greps every tracked file for a key, and
the server copy sits at mode 600 one directory above the web root where Apache cannot reach it.
