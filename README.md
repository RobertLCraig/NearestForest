# NearestForest

Finds the closest Forestry England site to where you are and hands it to your map app in one tap.
Built for phone use in a car, where the official site is unusable.

Two access methods over one dataset:
- **PWA** — add to iPhone Home Screen, works offline, distance-sorted list.
- **iOS Shortcut** — Siri-triggered, hands-free.

Personal use. Not affiliated with or endorsed by Forestry England.

## Data sources
- Forest list, opening times and facilities: [forestryengland.uk](https://www.forestryengland.uk/search-forests) (scraped; see `docs/DECISIONS.md`).
- Car park coordinates: [Forestry England Recreation Areas](https://www.data.gov.uk/dataset/3d279869-555d-45c2-a859-d029dab1fc39/forestry-england-recreation-areas),
  Contains public sector information licensed under the Open Government Licence v3.0.

## CI and deploy
**On every pull request and every push to `main`**, GitHub Actions runs
[`.github/workflows/ci.yml`](.github/workflows/ci.yml): the self-test (`node scripts/selftest.js`,
which also runs the PHP endpoint under php-cli and the Python data validators against fixtures)
and the service-worker cache-key guard, which fails a change to `app/` that did not bump `CACHE`
in `app/sw.js`. On a pull request it compares against the target branch; on a push to `main`,
against the commit before the push. These are the same two checks the deploy runs first.

**CI does not touch the scrape.** Rebuilding the dataset hits live websites and reads a 142MB
cache that is not in the repository, so it runs by hand. CI checks the committed dataset instead.

**Deploy is not done from GitHub.** It is one command, `python3 scripts/deploy.py`, run by me
from my own machine when I decide to ship: it runs the self-test, checks the cache key against
what is live, refuses a dirty tree, pushes, then SSHes to the Hostinger server, which pulls and
serves the checkout directly. Merging does not deploy. The SSH key and host details stay on my
machine, so no deploy secret is stored in GitHub. Detail: `docs/HANDOVER.md`, "Deployment".

## Docs
Start at [docs/HANDOVER.md](docs/HANDOVER.md).
