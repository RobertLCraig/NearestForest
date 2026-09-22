<?php
/**
 * Test harness for app/api/nearest.php, run by scripts/selftest.js under php-cli.
 *
 * The endpoint reads $_GET, which php-cli leaves empty, so this fills it from the NF_QUERY
 * environment variable and then runs the real file. Nothing else: no stubbing, no copy of
 * the ranking, so the self-test exercises the response the Shortcut actually receives.
 * It is a file rather than `php -r` because on Windows `php` is a .cmd shim that node can
 * only spawn through a shell, and inline code through cmd.exe quoting is not worth trusting.
 *
 *   NF_QUERY="lat=50.81&lng=-0.09&source=carpark&n=25" php scripts/selftest-nearest.php
 */

parse_str((string) getenv('NF_QUERY'), $_GET);
require __DIR__ . '/../app/api/nearest.php';
