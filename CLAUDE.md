# NearestForest — agent instructions

**Orient before changing anything.** Read docs/HANDOVER.md first; it indexes this project's
docs (docs/PRD.md, docs/DATA-MODEL.md, docs/DECISIONS.md). Restate the goal, success criteria, and data
shape before proposing changes. Do not act on a partial read. This follows the global
project documentation standard.

## Conventions
- **No build step.** `app/` is plain HTML/CSS/JS served as static files. No bundler, no npm, no framework.
- **No external requests at runtime, with one bounded exception.** No CDNs, no fonts, no
  analytics. Everything the app needs is bundled or inlined, because it must work in a dead-signal
  area, which is the whole point of it. The **one** exception is the optional map tile layer
  (DECISIONS 2026-08-08): it is off by default, it layers over a bundled offline outline that is
  never removed, and with it off the app still makes zero requests. Do not treat that layer as a
  violation and delete it; equally, do not let anything else the app *needs* go over the network.
- **Data is generated, never hand-edited.** `data/sites.json` is the build output of `scripts/`.
  Fix the generator, re-run it, never patch the JSON.
- **Nothing fails silently.** Every scraper reports in-progress / succeeded / failed-with-reason,
  prints counts as it goes, and exits non-zero on any failure path. Partial success reports both
  the success count and the explicit failure list.
- **Scraper etiquette.** Rate-limit forestryengland.uk requests and cache raw HTML to `data/raw/`
  so re-runs of the parser cost zero requests. Never hammer their site to debug a regex.
- **Commands are for ubuntu-dev first**: run them from the worktree root in Bash. ubuntu-dev has
  `python3` and no `python`, so write `python3`.
- Run the pipeline (there is no `build_data.py`; that name was aspirational and never existed):
  `python3 scripts/fetch.py && python3 scripts/parse.py && python3 scripts/build_boundary.py`,
  then `node scripts/selftest.js`. Serve a checkout with `php -S 127.0.0.1:8791 -t app`.
  Deploy with `python3 scripts/deploy.py` (`--dry-run` changes nothing). `scripts/deploy.ps1` is
  the same trigger in PowerShell, laptop only, for a deploy run from the Windows laptop. **Deploy
  does not run on ubuntu-dev yet**: its clone has no `github` remote and its `~/.ssh/config` has no
  `hostinger` alias (checked 2026-11-04), so even `--dry-run` stops at step 2. A deploy is Rob's
  go-ahead in any case.
