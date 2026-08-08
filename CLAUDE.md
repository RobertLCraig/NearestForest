# NearestForest — agent instructions

**Orient before changing anything.** Read docs/HANDOVER.md first; it indexes this project's
docs (docs/PRD.md, docs/DATA-MODEL.md, docs/DECISIONS.md). Restate the goal, success criteria, and data
shape before proposing changes. Do not act on a partial read. This follows the global
project documentation standard.

## Conventions
- **No build step.** `app/` is plain HTML/CSS/JS served as static files. No bundler, no npm, no framework.
- **No external requests at runtime.** No CDNs, no fonts, no map tiles, no analytics. Everything is
  bundled or inlined. The app must work in a dead-signal area, which is the whole point of it.
- **Data is generated, never hand-edited.** `data/sites.json` is the build output of `scripts/`.
  Fix the generator, re-run it, never patch the JSON.
- **Nothing fails silently.** Every scraper reports in-progress / succeeded / failed-with-reason,
  prints counts as it goes, and exits non-zero on any failure path. Partial success reports both
  the success count and the explicit failure list.
- **Scraper etiquette.** Rate-limit forestryengland.uk requests and cache raw HTML to `data/raw/`
  so re-runs of the parser cost zero requests. Never hammer their site to debug a regex.
- Run the pipeline: `python scripts/build_data.py` (see `docs/build/` for the phase plan).
