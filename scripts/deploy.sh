#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  NearestForest - server-side deploy (runs on the Hostinger host).
#
#  This is a static app: no build, no composer, no migrations. The vhost
#  docroot is a symlink to the checkout's app/ directory, so a fast-forward
#  pull IS the deploy. Nothing is copied.
#
#      ~/domains/forestlocator.enhanceify.co.uk/
#          repo/                      <- this checkout
#          public_html -> repo/app    <- Apache serves this
#
#  Serving app/ rather than the repo root is what keeps docs/, scripts/ and
#  the 142MB scrape cache out of the web root.
#
#  Usage (on server): bash ~/domains/forestlocator.enhanceify.co.uk/repo/scripts/deploy.sh
#  Usage (locally):   pwsh ./scripts/deploy.ps1   (companion wrapper)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SITE="${SITE:-forestlocator.enhanceify.co.uk}"
REPO_DIR="${REPO_DIR:-$HOME/domains/$SITE/repo}"
DOCROOT="${DOCROOT:-$HOME/domains/$SITE/public_html}"
BRANCH="${BRANCH:-main}"

cd "$REPO_DIR" || { echo "FAIL: cannot find $REPO_DIR"; exit 1; }

echo ""
echo "=================================================="
echo " $SITE - Deploy  $(date '+%Y-%m-%d %H:%M %Z')"
echo "=================================================="

echo ""
echo "[1/4] Pulling latest code from $BRANCH..."
git pull --ff-only origin "$BRANCH"

echo ""
echo "[2/4] Checking the docroot symlink..."
# A real directory here means someone uploaded files by hand and broke the
# git-pull deploy: the pull would then update the checkout and change nothing
# that Apache serves. Fail loudly rather than reporting a deploy that did nothing.
if [ ! -L "$DOCROOT" ]; then
    echo "  FAIL: $DOCROOT is not a symlink."
    echo "        Expected it to point at repo/app. Fix with:"
    echo "          mv '$DOCROOT' '$DOCROOT.bak' && ln -s repo/app '$DOCROOT'"
    exit 1
fi
TARGET="$(readlink "$DOCROOT")"
if [ "$TARGET" != "repo/app" ]; then
    echo "  FAIL: $DOCROOT points at '$TARGET', expected 'repo/app'."
    exit 1
fi
echo "  OK  public_html -> $TARGET"

echo ""
echo "[3/4] Service worker cache version now live..."
# Installed copies keep the old dataset forever if this was not bumped alongside
# a data or app change. Printing it makes a forgotten bump visible in the log.
CACHE_VER="$(grep -oE "CACHE = '[^']+'" app/sw.js | head -1 | cut -d"'" -f2 || true)"
if [ -z "$CACHE_VER" ]; then
    echo "  FAIL: could not read the CACHE constant from app/sw.js."
    exit 1
fi
echo "  CACHE = $CACHE_VER"

echo ""
echo "[4/4] Smoke test..."
FAILED=0
CODE="$(curl -s -o /dev/null -w '%{http_code}' "https://$SITE/" || echo 000)"
if [ "$CODE" = "200" ]; then echo "  OK  GET /                       200"; else echo "  FAIL GET / returned $CODE"; FAILED=1; fi

MIME="$(curl -sI "https://$SITE/manifest.webmanifest" | tr -d '\r' | awk -F': ' 'tolower($1)=="content-type"{print $2}')"
if [ "$MIME" = "application/manifest+json" ]; then
    echo "  OK  manifest.webmanifest        $MIME"
else
    echo "  FAIL manifest.webmanifest served as '${MIME:-nothing}', expected application/manifest+json"
    echo "       The .htaccess AddType did not apply; iOS will ignore the manifest."
    FAILED=1
fi

API="$(curl -s "https://$SITE/api/nearest.php?lat=50.8168&lng=-0.0894&n=1" | head -c 80)"
# Prefix match, not a fixed-length compare: the byte after the comma belongs to
# the next key and changes whenever the payload does.
case "$API" in
    '{"ok":true,'*)
        echo "  OK  api/nearest.php             executes" ;;
    *)
        echo "  FAIL api/nearest.php returned: ${API}"
        echo "       Expected a body starting {\"ok\":true,"
        echo "       Raw PHP source means PHP is not enabled for this vhost."
        FAILED=1 ;;
esac

echo ""
echo "=================================================="
if [ "$FAILED" -eq 0 ]; then
    echo " Deployment complete  $(date '+%H:%M %Z')"
else
    echo " Deployment FAILED its smoke test  $(date '+%H:%M %Z')"
fi
echo "=================================================="
echo ""
exit "$FAILED"
