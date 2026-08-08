# How should the map view get its basemap?

## What I need from you
Pick option 1, 2 or 3 below. It decides whether this app keeps its founding promise of working with
no signal, so it is not a call an agent should make quietly.

Rob asked on 2026-08-08 for "a visible map (same as forestry england already provides) that lets me
select a forest". Forestry England's map is an online tile map. This app's first constraint, in
CLAUDE.md and locked in DECISIONS, is the opposite: **no external requests at runtime, no map
tiles**, because forest car parks are where mobile data dies. Both cannot be true at once, and the
gap is the basemap specifically, not the map view: showing 904 sites spatially and letting you tap
one is possible either way.

The question is what sits *behind* the markers.

## Why
A distance-sorted list answers "what is nearest" but not "what is over that way", and it cannot show
that two of the top five are on the far side of the Downs. Card 0003 is open on exactly that: whether
straight-line ranking misleads in practice. A map makes the answer visible instead of arguable, so
this is worth building whichever basemap wins.

## Options

1. **Bundled vector outline, fully offline.** Ship a simplified England coastline and county
   boundaries as inline SVG or canvas, plot the 904 sites on it, pan/zoom, tap to select, with your
   own position marked. Source it at build time from Natural Earth (public domain) or the ONS Open
   Geography Portal (OGL v3, same licence as the car park data already used).
   *Cost:* a new pipeline step to fetch and simplify a boundary file, plus the map view itself.
   Roughly a day. Adds an estimated 50-150KB to the bundle depending on how hard it is simplified,
   which has to be measured rather than guessed. Keeps every existing constraint intact.
   *Limit:* it will look schematic. Coast, boundaries and dots. No roads, no terrain, no labels, so
   it will not look like Forestry England's map.

2. **Online tile basemap, list still works offline.** Real tiles when there is signal, exactly the
   FE experience; the map view degrades to unavailable with no connection while the list keeps
   working as it does now.
   *Cost:* reverses a locked decision and the CLAUDE.md rule outright. Needs a tile provider: OSM's
   public servers forbid this kind of use, so it means a keyed provider (free tier, but an account,
   a key to keep out of a public repo, and a rate limit) or self-hosting. Every pan sends your
   position to a third party. Roughly a day, and the map is dead exactly where the app is most
   needed, which is the case the whole design was built around.

3. **Both: bundled outline always, tiles layered on when online.** Option 1 as the base, with real
   tiles fading in when a connection exists, and a toggle.
   *Cost:* option 1 plus option 2 plus the switching logic and its failure modes, so roughly two to
   three days. Carries the third-party and key handling of option 2 whenever tiles are on.

## Recommendation
**Option 1.** The job is picking a forest spatially, and for that a coastline, county lines, your
dot and 904 site dots is genuinely enough: at the zoom where you choose between Friston and Abbot's
Wood, FE's street detail is decoration. It is the only option that survives the car park with no
signal, which is the entire reason this app exists rather than using FE's own finder. It is also the
cheapest, and it does not put a key in a public repo or send your location anywhere.

Worth saying plainly: option 1 will look plainer than what you asked for. If, once it is on the
phone, the outline turns out to be too sparse to orient by, option 3 is a clean addition on top of
it rather than a rewrite, so choosing 1 now does not close the door on tiles later.

## Decided
