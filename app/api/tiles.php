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

/* Tiles one address may pull in a day. A whole-country pan at every zoom is a
   few hundred, and the app caps itself at 300 in memory, so a real user does not
   come near this. It exists to bound what one abuser can spend, not to ration
   anybody: the free tier is 150k tiles a month and this endpoint is reachable by
   anyone who can type a URL. */
const CAP_PER_DAY = 2000;

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

/* Per-address daily cap. A counter file per address per day, under the system
   temp directory: no database, no dependency on APCu being compiled in, and the
   OS clears it up.

   REMOTE_ADDR only. X-Forwarded-For is deliberately NOT consulted: this origin is
   reached directly (the Cloudflare record is unproxied by decision), so any such
   header is attacker-supplied, and honouring it would let one script reset its own
   counter on every request — a rate limiter that reads a spoofable key is worse
   than none, because it reports that it is working.

   Read-modify-write without a lock around the pair, so heavy concurrency from one
   address can undercount by a few. That is the right trade for a quota guard: the
   cost of a slightly leaky cap is a few extra tiles, and the cost of blocking on a
   lock is a slow map.

   Every failure path here lets the tile through. A filesystem hiccup must not take
   the map's optional layer down; the cap is a guard on spending, not a gate on
   correctness. */
function rateLimit(): void
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    if ($ip === '') {
        return;                                    // nothing to count against
    }
    $dir = sys_get_temp_dir() . '/nf-tiles';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return;                                    // cannot count; never fail closed
    }

    $today = gmdate('Ymd');
    /* Hashed so the counter directory is not itself a log of who used the app. */
    $file = $dir . '/' . $today . '-' . hash('sha256', $ip) . '.count';

    $n = is_readable($file) ? (int) @file_get_contents($file) : 0;
    if ($n >= CAP_PER_DAY) {
        header('Retry-After: 3600');
        fail(429, 'Daily tile limit reached for this address. The map still works without tiles.');
    }
    @file_put_contents($file, (string) ($n + 1), LOCK_EX);

    /* Yesterday's counters are dead weight. Sweep occasionally rather than on
       every request: one directory listing per ~200 tiles is unnoticeable, and
       leaving them is a slow leak on a shared host. */
    if ($n === 0 && random_int(1, 200) === 1) {
        foreach (glob($dir . '/*.count') ?: [] as $old) {
            if (!str_starts_with(basename($old), $today)) {
                @unlink($old);
            }
        }
    }
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

/* ---- who is allowed to spend the quota ------------------------------------------------
   The Referer check below used to be the whole control, and it was not one. A
   penetration test on 2026-08-10 served a real tile to `curl` with no Referer, to
   `curl` with a spoofed one, and — the case that matters — to an <img> on any
   third-party page carrying referrerpolicy="no-referrer". One HTML attribute made
   this a free tile server for the internet on our quota.

   So the control is now two layers, because neither is sufficient alone:

   1. Sec-Fetch-Site. A browser sets it on every subresource request and a page
      cannot forge it: it is a forbidden header name, so referrerpolicy, a meta
      tag and fetch() options all leave it alone. That kills the hotlink case
      outright. Absent means a non-browser client (curl, the Shortcut, something
      older than iOS 16.4), which is allowed through to layer 2 rather than
      refused, because failing closed here would break the debugging path this
      endpoint is checked with.
   2. A per-address daily cap, which is what actually bounds a scripted abuser,
      since a script can send any header it likes. */
$fetchSite = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';
if ($fetchSite !== '' && $fetchSite !== 'same-origin') {
    fail(403, 'Cross-site tile requests are not served.');
}

/* Kept as well: it costs nothing and catches an older browser that sends a
   Referer but no Sec-Fetch-Site. HTTP_HOST can carry a port, the Referer host
   never does, so compare only the host part. */
$ref = $_SERVER['HTTP_REFERER'] ?? '';
if ($ref !== '') {
    $refHost = parse_url($ref, PHP_URL_HOST);
    $ourHost = explode(':', (string) ($_SERVER['HTTP_HOST'] ?? ''))[0];
    if ($refHost !== $ourHost) {
        fail(403, 'Cross-site tile requests are not served.');
    }
}

rateLimit();

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
