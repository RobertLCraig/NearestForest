# The tile attribution is unreadable over tiles

## Why
`.map__hint` does two different jobs with one style. With the tile layer off it says "Tap a marker
for details. Pinch to zoom.", and with it on it becomes the provider attribution, "Maps ©
Thunderforest, Data © OpenStreetMap contributors".

It is styled for the first job: `color: var(--dim)` with `text-shadow: 0 1px 3px var(--bg)`, a
muted green-grey with a dark glow behind it. Over the bundled outline that is exactly right and
reads cleanly. With tiles on, the background stops being dark and becomes a light Thunderforest
Outdoors basemap, and the same muted text with a dark shadow washes out against it. Screenshots
from the phone on 2026-08-10 show it at three zoom levels, greyed into the map and hard to pick
out at a glance.

**The state where that text carries a licence obligation is the exact state where it is least
readable.** Thunderforest's terms and the OpenStreetMap licence both require visible attribution,
and this is the app being handed to other people. That is what lifts it above a styling nit: it is
the difference between crediting the data properly and only appearing to.

**Fresh evidence, and a new reason to do it now.** `docs/img/2026-08-14_Screenshots/IMG_5794.PNG`
and `IMG_5795.PNG` show the same failure four days on, at two zoom levels, the attribution greyed
into the basemap and barely picked out at all. Those shots were taken as candidate attachments for
the enquiry to Forestry England, card `0018`, which argues that this project handles data licensing
properly. They cannot be attached while they show the opposite.

## Links

**Relates to**
- `0018` - its email argues that this project credits data properly, and its candidate screenshots
  show the attribution greyed into the basemap. This card has to land before those can be attached.
- `0009` - built the tile layer whose light basemap is what the attribution is unreadable against.
- `0020` - added the OpenStreetMap credit to the same map hint, so this card now carries two
  licence obligations rather than one.
- `0001` - the phone check this card's Task 2 still needs is part of the same trip to a real device.

## Not this card
Not the marker labels, which collide and truncate over tiles ("Bedgebury National Pi…" sitting on
"Hemsted Forest", "Queen Elizabeth Count…" over "Creech Wood"). Same screenshots, same surface,
genuinely separate problem, and its own card. Not restyling the map controls, which read fine over
both backgrounds because they already carry a solid panel behind them. Not moving the attribution
into the detail sheet or a credits screen: it has to be on the map it credits.

## Acceptance
<!-- AC:BEGIN -->
- [x] #1 WHEN the tile layer is on, THE APP SHALL render the provider attribution legibly against a
      light basemap at every zoom level.
- [x] #2 WHEN the tile layer is off, THE APP SHALL render the hint exactly as it does today.
- [x] #3 WHEN either state is shown, THE APP SHALL keep the text clear of the safe-area inset.
<!-- AC:END -->

## Tasks
- [x] Give the hint a solid backing when, and only when, tiles are on
- [ ] Check it against a light basemap and a dark one, on the phone rather than the desktop
- [x] Self-test that the attribution string is still present and still tied to the tile toggle

## Plan
The controls above it already solve this problem: they sit on an opaque panel, which is why they
stay readable over both backgrounds. Do the same here rather than inventing something new. A class
toggled alongside `tilesOn` in `setTiles`, giving the text a dark semi-opaque pill and a light
colour, keeps the off state untouched and needs no new element.

Contrast is the whole point of the card, so pick the colours against the lightest part of the
Outdoors style, not against an average.

## Comments

**2026-08-29** Built the plan as written, in three files and no new element.

`app/app.css` gains one modifier, `.map__hint--attrib`: white text on `rgba(0,0,0,.72)`, a pill
that hugs the text (`left:50%` plus a translate) rather than a band across the map, capped at the
map width less the page padding so a long attribution wraps inside the pill instead of running off
the edge. `text-shadow` is cleared, because the dark glow was for a dark background.
`app/map.js` toggles that class on the same line that swaps the text, so the backing and the
attribution can never disagree about which state the map is in. `CACHE` and `BUILD` are bumped to
`v13-2026-08-29`; installed copies would otherwise keep the old stylesheet.

**Why .72 and not something lighter.** The card says pick against the lightest part of the Outdoors
style. `.72` was chosen so the worst case the basemap can produce is bounded: a pure white tile
composites the pill to `rgb(71)`, and white on that is **9.29:1**. Pale road and field give 10.05:1,
light wood 12.27:1, dark wood 16.48:1. All above AA (4.5:1) and AAA (7:1), and the bound holds at
every zoom level because no tile can be brighter than white.

**AC #1 is left open on purpose, and it is the only thing missing.** The contrast is proven, but
nobody has looked at it. This ran in a worktree, which Herd does not serve, and the browser tool
was not permitted in this session, so there was no desktop render either — let alone the phone
check the card asks for. That is Task 2, still open. What needs eyes is layout, not colour: does the
pill wrap to two lines at 390px, and does the wrapped pill still clear the home bar. Serve `app/`
from `C:\Dev\NearestForest`, open the map, tap **Tiles**, and look.

**Two things I could not settle from the repository.** The suite the card names,
`.\vendor\bin\pest.bat` and `.\vendor\bin\pint.bat`, does not exist here — this project has no
`vendor/` and no PHP test suite. `node scripts/selftest.js` is the suite, per CLAUDE.md, and it
passes at **190, 0 failed** (186 before; 4 new cover the attribution, the toggle, the opacity floor
and the shared safe-area rule). And the `--pad` used for the pill's `max-width` is the page padding,
not a map-specific one; there is no map padding variable, and it reads correctly against the
`.map__bar` above, which uses the same value.

**2026-08-29 (second run)** No code changed. The previous run left #1 open because nobody had looked
at it, so this run looked at it, and it holds. **#1 is now ticked. Task 2 is not**, because it asks
for a phone and this was a desktop render.

**How it was looked at, since the last run said a worktree cannot be.** It can. Herd serves
`C:\Dev\NearestForest`, but nothing stops a session serving this worktree itself:
`php -S 127.0.0.1:8791 -t app <router>`, with a throwaway router doing two jobs. It stood in for
`api/tiles.php`, which cannot run here because the Thunderforest key lives on the server and not in
the repo, and returned **a pure white 256px tile** — which is not a compromise but the exact worst
case the card says to design against, and the same bound the .72 figure was picked from. It also
served `index.html` with a script appended that opens the map and presses **Tiles**, because a
headless browser cannot tap a button. Chrome on this machine ignores `--window-size` and renders at
500px whatever is asked, so the phone width was imposed on `.map` instead; `.map` is the containing
block for both the bar and the hint, so that is the same geometry a 390px screen gives. `--safe-b`
was pinned to 34px, the iPhone home indicator, which desktop Chrome reports as 0. The router lived
in `%TEMP%` and is deleted; nothing under `app/` was touched.

**What it showed, measured rather than eyeballed** (`getBoundingClientRect`, three widths):

| map width | pill | centre | lines | gap below |
|---|---|---|---|---|
| 320 | 80–240, 160 wide | 160 | 3 | 44px |
| 390 | 98–293, 195 wide | 195 | 3 | 44px |
| 430 | 108–323, 215 wide | 215 | 2 | 44px |

So the two questions the last run left are answered. **It wraps** — to three lines at 320 and 390,
not the two that was guessed, and 430 is the width where it drops to two. **The wrapped pill still
clears the home bar**: the gap is 44px at every width, which is the 34px inset plus the 10px the
rule asks for, so the wrap grows the pill upward and never downward. The pill is centred to the
pixel in all three, and at 320 it is 160px against a 288px cap, so `max-width` is not close to
biting. White on the composited grey reads cleanly at a glance, which is the thing the screenshots
of 2026-08-10 and 2026-08-14 show it failing to do.

Tiles off was rendered too, and is untouched: full-width hint, no pill, the dim text and its dark
glow over the bundled outline, same 44px gap. That is #2 and #3 seen rather than assumed.

**What this check does not cover, and it is two things.** The basemap was synthetic white, not the
real Outdoors style — which bounds legibility rather than sampling it, since no tile can be brighter
than white at any zoom, but it does mean nobody has yet seen the pill over an actual
Thunderforest tile. And it was a desktop browser, not a phone: the safe-area inset was simulated,
not reported by iOS. **Task 2 stays open for both reasons.** Card 0018 needs fresh phone screenshots
anyway, so that look is already owed.

The suite the card names still does not exist here: no `vendor/`, no `pest.bat`, no `pint.bat`, and
this project has no PHP test suite. `node scripts/selftest.js` is the suite per CLAUDE.md, and it
passes at **190, 0 failed**, unchanged from the last run because no code changed.
