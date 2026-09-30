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
- **Fail:** the coastline draws with no tiles on top. That means the file is empty or holds a key
  that is already revoked; a trailing newline is not it, because `api/tiles.php` trims the file.

Then one more thing, and it is the one that actually ends the exposure: **ask Thunderforest to
confirm the old key is revoked, not merely superseded.** A new key alongside a live old one changes
nothing about the key that reached a chat transcript.

**Do not paste the new key into this card, into the repository, or into a chat with me.** That is
the whole reason the old one needed rotating, and it is why no agent can do this step.

**Why it needs you.** Rule two: the key must reach the server without passing through the
repository, a card or a chat, and the revocation request has to come from the account's own
address. Step 1 of the original three, asking support for the replacement, you did on 2026-09-20.

No redeploy is needed: `api/tiles.php` reads the file on every request and trims it, which is why
the key lives in a file above the web root rather than in the app.

## Why
Hygiene rather than an incident. Nothing leaked into the repository: a self-test greps every
tracked file for a key and `.gitignore` refuses `*.key`. The server copy is `-rw-------` above the
web root, and `/tiles.key`, `/../tiles.key` and `/api/../../tiles.key` each return 404. The only
exposure is a chat transcript, and the realistic worst case is someone spending the free tier's
150k tiles a month. Card `0012` closed the hole that let the quota be spent with no key at all;
what is left is the original point: a key that has been in a transcript is not private until it is
revoked.

## Links

**Relates to**
- `0012` - closed the hole that made the quota spendable with no key at all. Not a prerequisite.
- `0009` - installed the key this card replaces, and set the pattern of a file above the web root.

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
