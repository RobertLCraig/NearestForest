# Rotate the Thunderforest API key

## What I need from you
The key was pasted into a chat transcript on 2026-08-08, so it is no longer private. Only you can
replace it: it needs a login to the Thunderforest dashboard. Two steps, each with its own pass:

1. Regenerate the key at <https://www.thunderforest.com/dashboard/>.
   *Pass:* the dashboard shows a key you have not used before.
2. Replace the server copy. Do not paste the new key into chat, into the repo, or into a card:

       ssh hostinger "printf '%s' 'NEW_KEY' > ~/domains/forestlocator.enhanceify.co.uk/tiles.key && chmod 600 ~/domains/forestlocator.enhanceify.co.uk/tiles.key"

   *Pass:* open <https://forestlocator.enhanceify.co.uk/> , open the map, tap **Tiles**, and the
   basemap still draws. *Fail:* the outline draws but no tiles, which means the file is empty, has
   a trailing newline, or holds a key the dashboard has already revoked.

No redeploy is needed. `api/tiles.php` reads the file on every request, which is exactly why it was
built that way rather than baking the key into the app.

## Why
Hygiene rather than an incident, and worth stating plainly so nobody over- or under-reacts. Nothing
leaked into the repository: a self-test greps every tracked file for a key and `.gitignore` refuses
`*.key`. The server copy is `-rw-------` and sits above the web root, and `/tiles.key`,
`/../tiles.key` and `/api/../../tiles.key` were each checked and return 404. The only exposure is
the transcript, and the realistic worst case is someone spending the free tier's 150k tiles a month.

## Not this card
Not changing provider, not changing the proxy, not adding rate limiting or server-side tile caching.
If the quota ever actually gets abused, that is a new card with real numbers behind it rather than a
precaution invented now.

## Acceptance
<!-- AC:BEGIN -->
- [ ] #1 WHEN the tile layer is switched on after the key is replaced, THE APP SHALL draw tiles.
- [ ] #2 WHEN the repository is searched, THE APP SHALL contain no API key, old or new.
<!-- AC:END -->

## Tasks
- [ ] Regenerate the key in the Thunderforest dashboard
- [ ] Replace `tiles.key` on the server and re-check the Tiles toggle
- [ ] Confirm the old key is revoked rather than merely superseded
