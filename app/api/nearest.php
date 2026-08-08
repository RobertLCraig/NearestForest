<?php
/**
 * Nearest-site lookup for the iOS Shortcut.
 *
 * The PWA does this maths on the device and needs no server. The Shortcut cannot:
 * Shortcuts iterates roughly tens of items per second, so ranking 904 sites in-app would
 * take far too long to be useful in a car. This endpoint does it in one request instead.
 *
 * GET /api/nearest.php?lat=50.81&lng=-0.09[&n=5][&source=forest|carpark|all]
 * Always returns JSON. Errors carry an HTTP status and an explicit "error" string;
 * nothing fails silently and no empty 200 is ever returned.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function fail(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_SLASHES);
    exit;
}

$dataPath = __DIR__ . '/../data/sites.json';
if (!is_readable($dataPath)) {
    fail(500, 'sites.json is missing or unreadable on the server at ' . basename($dataPath));
}

$raw = file_get_contents($dataPath);
if ($raw === false) {
    fail(500, 'Could not read sites.json.');
}

$data = json_decode($raw, true);
if (!is_array($data) || empty($data['sites'])) {
    fail(500, 'sites.json is present but did not parse into any sites.');
}

// ---- input validation, explicit rather than coerced -------------------------------------
if (!isset($_GET['lat'], $_GET['lng'])) {
    fail(400, 'Both lat and lng query parameters are required.');
}
if (!is_numeric($_GET['lat']) || !is_numeric($_GET['lng'])) {
    fail(400, 'lat and lng must be numbers.');
}
$lat = (float) $_GET['lat'];
$lng = (float) $_GET['lng'];
if ($lat < -90 || $lat > 90 || $lng < -180 || $lng > 180) {
    fail(400, 'lat/lng out of range.');
}

$n = isset($_GET['n']) ? (int) $_GET['n'] : 5;
$n = max(1, min(25, $n));

$source = $_GET['source'] ?? 'forest';
if (!in_array($source, ['forest', 'carpark', 'all'], true)) {
    fail(400, 'source must be one of: forest, carpark, all.');
}

// ---- rank -------------------------------------------------------------------------------
/** Great-circle distance in statute miles. Mirrors haversineMi() in app/core.js. */
function haversine_mi(float $aLat, float $aLng, float $bLat, float $bLng): float
{
    $R = 3958.7613;
    $dLat = deg2rad($bLat - $aLat);
    $dLng = deg2rad($bLng - $aLng);
    $s = sin($dLat / 2) ** 2
       + cos(deg2rad($aLat)) * cos(deg2rad($bLat)) * sin($dLng / 2) ** 2;
    return 2 * $R * asin(min(1.0, sqrt($s)));
}

$ranked = [];
foreach ($data['sites'] as $s) {
    if ($source !== 'all' && ($s['source'] ?? '') !== $source) {
        continue;
    }
    if (!isset($s['lat'], $s['lng'])) {
        continue;
    }
    $s['miles'] = round(haversine_mi($lat, $lng, (float) $s['lat'], (float) $s['lng']), 1);
    $ranked[] = $s;
}

if (!$ranked) {
    fail(500, 'No sites matched source=' . $source . '. The dataset may be truncated.');
}

usort($ranked, static fn(array $a, array $b): int => $a['miles'] <=> $b['miles']);
$ranked = array_slice($ranked, 0, $n);

// ---- shape the response for Shortcuts ---------------------------------------------------
$out = array_map(static function (array $s): array {
    $ll = $s['lat'] . ',' . $s['lng'];
    $summary = $s['opening_summary'] ?? null;
    $access = is_array($summary) ? ($summary['access'] ?? null) : null;

    return [
        'name'      => $s['name'],
        'miles'     => $s['miles'],
        'label'     => $s['name'] . ' - ' . $s['miles'] . ' miles'
                       . (!empty($s['postcode_satnav']) ? ' (' . $s['postcode_satnav'] . ')' : ''),
        'postcode'  => $s['postcode_satnav'] ?? null,
        'lat'       => $s['lat'],
        'lng'       => $s['lng'],
        'access'    => $access,          // always | dusk | hours | unknown | null
        'opening'   => $s['opening_times'] ?? null,
        'url'       => $s['url'] ?? null,
        'apple_url' => 'https://maps.apple.com/?daddr=' . rawurlencode($ll) . '&dirflg=d',
        'google_url' => 'https://www.google.com/maps/dir/?api=1&destination=' . rawurlencode($ll)
                        . '&travelmode=driving&dir_action=navigate',
        'waze_url'  => 'https://waze.com/ul?ll=' . rawurlencode($ll) . '&navigate=yes',
    ];
}, $ranked);

echo json_encode([
    'ok'           => true,
    'generated_at' => $data['generated_at'] ?? null,
    'from'         => ['lat' => $lat, 'lng' => $lng],
    'source'       => $source,
    'count'        => count($out),
    'results'      => $out,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
