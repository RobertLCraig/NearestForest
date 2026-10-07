---
not_for_the_loop: the new key must reach the server without passing through the repository, a card or a chat, and no agent can hold it
---

# Put the new Thunderforest map key on the server, and get the old one revoked

## What I need from you
1. In your own terminal, run this with your new key in place of `NEW_KEY`. Do not paste the key anywhere else, including here or to me.
   `ssh hostinger "printf '%s' 'NEW_KEY' > ~/domains/forestlocator.enhanceify.co.uk/tiles.key && chmod 600 ~/domains/forestlocator.enhanceify.co.uk/tiles.key"`
   Pass: open https://forestlocator.enhanceify.co.uk/, open the map, tap **Tiles**, and the map pictures draw. Fail: only the coastline draws, so the file is empty or the key is already revoked.
2. Email Thunderforest support and ask them to confirm the old key is revoked, not just replaced.
   Pass: they confirm in writing.

**My recommendation:** do both in one sitting. The new key alone ends nothing while the old one still works.
Paste to answer: `**2026-10-07** **Decided:** new key on the server and tiles draw; Thunderforest confirmed the old key is revoked on <date>.`

## What you need to know
- Thunderforest is the paid map-picture service behind the **Tiles** button.
- The old key appeared in a chat transcript. Nothing leaked into the repository.
- Worst case if nothing is done: someone uses up the free 150,000 map pictures a month.
- You already got the new key from support on 2026-09-20.
- No redeploy is needed. The site reads the key file on every request.
- Ask from the address the Thunderforest account is registered to. They check it.

## See it
- Live site: https://forestlocator.enhanceify.co.uk/ (map, then **Tiles**)

---
## For the agent (Rob can stop reading here)

**Relates to**
- `0012` - closed the hole that let the quota be spent with no key at all. Not a prerequisite.
- `0009` - installed the key this card replaces, as a file above the web root.

After Rob answers: search the repository for any key, old or new, and tick #2 only if none is found.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the tile layer is switched on after the key is replaced, THE APP SHALL draw tiles.
- [ ] #2 WHEN the repository is searched, THE APP SHALL contain no API key, old or new.
<!-- AC:END -->

## Tasks
- [x] Ask Thunderforest support for a replacement key (no self-service rotation exists)
- [ ] Replace `tiles.key` on the server and re-check the Tiles toggle
- [ ] Confirm the old key is revoked rather than merely superseded

## Comments
**2026-08-18** Key rotation email has now been sent.

**2026-09-20** Rob: "rotation has been done, I just need to get around to loading the new key
somewhere secure (rather than lazily telling you and repeating the problem!)"

**2026-10-07** Condensed for reading. Git keeps the long version, including the 2026-09-10 mail-routing measurement.
