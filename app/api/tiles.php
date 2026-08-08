<?php
/**
 * Thunderforest tile proxy.
 *
 * The map's basemap is the bundled outline in app/data/boundary.json; these tiles
 * are the optional layer decided on board card 0007 and are never load-bearing.
 * With the layer switched off the app makes no request at all, which is the whole
 * point: forest car parks have no signal.
 *
 * This exists so the API key never reaches the browser. The repository is public,
 * so an embedded key would be readable by anyone, and a proxied one can be rotated
 * by replacing a single file without redeploying the app.
 *
 * GET /api/tiles.php?z=11&x=1021&y=679[&s=outdoors]
 * Returns image/png on success. Errors are plain text and never echo the key.
 */

declare(strict_types=1);

/* Styles Thunderforest serves on this account. Whitelisted rather than passed
   through, so the query string cannot be used to probe arbitrary paths. */
const STYLES = [
    'outdoors', 'landscape', 'atlas', 'cycle', 'transport',
    'transport-dark', 'spinal-map', 'pioneer', 'mobile-atlas', 'neighbourhood',
];
const DEFAULT_STYLE = 'outdoors';   // woodland and footpaths: the useful one here
const MAX_ZOOM = 20;
const TIMEOUT = 8;                  // seconds; a slow tile must not hang the map

function fail(int $status, string $message): void
{
    http_response_code($status);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-store');
    echo $message;
    exit;
}

/* The key lives above the web root, so Apache cannot serve it even if this
   script is removed or misconfigured. Resolved relative to this file rather
   than hard-coded, but the layout is asserted so a move fails loudly. */
function readKey(): string
{
    $candidates = [
        getenv('THUNDERFOREST_KEY') ?: null,
        __DIR__ . '/../../../tiles.key',   // api -> app -> repo -> <domain dir>
        __DIR__ . '/../../tiles.key',      // if the docroot is ever the repo root
    ];
    foreach ($candidates as $c) {
        if ($c === null) {
            continue;
        }
        if (!str_contains($c, '/')) {      // an env var holds the key itself
            return trim($c);
        }
        if (is_readable($c)) {
            $k = trim((string) file_get_contents($c));
            if ($k !== '') {
                return $k;
            }
        }
    }
    fail(503, 'Tile layer is not configured on this server: no API key file found. '
            . 'The map still works without it.');
}

/* ---- input validation, explicit rather than coerced ------------------------------------ */
$z = filter_input(INPUT_GET, 'z', FILTER_VALIDATE_INT);
$x = filter_input(INPUT_GET, 'x', FILTER_VALIDATE_INT);
$y = filter_input(INPUT_GET, 'y', FILTER_VALIDATE_INT);

if ($z === false || $z === null || $z < 0 || $z > MAX_ZOOM) {
    fail(400, 'z must be an integer between 0 and ' . MAX_ZOOM . '.');
}
$max = (1 << $z) - 1;
if ($x === false || $x === null || $x < 0 || $x > $max ||
    $y === false || $y === null || $y < 0 || $y > $max) {
    fail(400, "x and y must be integers between 0 and $max at zoom $z.");
}

$style = (string) (filter_input(INPUT_GET, 's') ?? DEFAULT_STYLE);
if (!in_array($style, STYLES, true)) {
    fail(400, 'Unknown style.');
}

/* A speed bump, not a lock: it stops the endpoint being casually hotlinked as a
   free tile server on our quota. Browsers send a Referer for <img> on our own
   pages; a missing one is allowed so curl checks and the Shortcut still work. */
$ref = $_SERVER['HTTP_REFERER'] ?? '';
if ($ref !== '') {
    $refHost = parse_url($ref, PHP_URL_HOST);
    if ($refHost !== ($_SERVER['HTTP_HOST'] ?? '')) {
        fail(403, 'Cross-site tile requests are not served.');
    }
}

$url = sprintf(
    'https://api.thunderforest.com/%s/%d/%d/%d.png?apikey=%s',
    $style, $z, $x, $y, rawurlencode(readKey())
);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => TIMEOUT,
    CURLOPT_CONNECTTIMEOUT => 4,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_USERAGENT      => 'NearestForest/1.0 (+https://forestlocator.enhanceify.co.uk)',
]);
$body   = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$err    = curl_error($ch);
curl_close($ch);

if ($body === false || $err !== '') {
    /* curl_error can contain the URL, and the URL contains the key. Never echo it. */
    fail(502, 'Tile upstream unreachable.');
}
if ($status !== 200) {
    fail($status === 404 ? 404 : 502, 'Tile upstream returned ' . $status . '.');
}

/* Tiles for a given z/x/y never change, so let the browser keep them: it is the
   difference between a map that redraws instantly on a second look and one that
   re-downloads the country. */
header('Content-Type: image/png');
header('Cache-Control: public, max-age=604800, immutable');
header('Content-Length: ' . strlen($body));
echo $body;
