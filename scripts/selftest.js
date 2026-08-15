/* Self-test for Nearest Forest.

   Exercises the real shipped app/core.js against the real generated dataset, so this
   cannot pass while the app is broken. Run: node scripts/selftest.js
   Exits non-zero on any failure, and prints what failed and what was expected. */
'use strict';

const path = require('path');
const fs = require('fs');

const ROOT = path.dirname(__dirname);
const NF = require(path.join(ROOT, 'app', 'core.js'));
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'app', 'data', 'sites.json'), 'utf8'));

let pass = 0;
const failures = [];

function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { failures.push(name + (detail ? ' — ' + detail : '')); console.log('  FAIL  ' + name + (detail ? ' — ' + detail : '')); }
}
function near(name, got, want, tol) {
  ok(name, Math.abs(got - want) <= tol, `got ${got}, wanted ${want} ±${tol}`);
}

const BRIGHTON = { lat: 50.8168, lng: -0.0894 };   // Marine Gate, Marine Drive, BN2 5TP

console.log('\n--- geometry ---');
// Brighton -> London, great-circle, cross-checked against a manual haversine.
near('haversine Brighton->London ~47.5mi',
     NF.haversineMi(50.8225, -0.1372, 51.5074, -0.1278), 47.5, 1.0);
near('haversine is zero for identical points',
     NF.haversineMi(51, -1, 51, -1), 0, 1e-9);
near('haversine is symmetric',
     NF.haversineMi(50, -1, 52, 1) - NF.haversineMi(52, 1, 50, -1), 0, 1e-9);
near('bearing due north is 0deg', NF.bearingDeg(51, -1, 52, -1), 0, 0.001);
near('bearing due east is ~90deg', NF.bearingDeg(51, -1, 51, 0), 90, 0.5);
ok('compass index maps 0deg to N', NF.POINTS[NF.compassIdx(0)] === 'N');
ok('compass index maps 180deg to S', NF.POINTS[NF.compassIdx(180)] === 'S');
ok('compass index maps 270deg to W', NF.POINTS[NF.compassIdx(270)] === 'W');
ok('compass index maps 90deg to E', NF.POINTS[NF.compassIdx(90)] === 'E');
// The row shows the letters and screen readers get the spoken form, so a
// mismatch between the two arrays would say "west" beside an E.
ok('spoken point names align with the abbreviations',
   NF.POINT_NAMES.length === NF.POINTS.length &&
   NF.POINTS.every((p, i) =>
     p.toLowerCase() === NF.POINT_NAMES[i].split('-').map(w => w[0]).join('')));
ok('every compass index has an arrow and a name',
   [0, 45, 90, 135, 180, 225, 270, 315, 359].every(d => {
     const i = NF.compassIdx(d);
     return NF.ARROWS[i] && NF.POINTS[i] && NF.POINT_NAMES[i];
   }));

console.log('');
console.log('--- web mercator projection (map view) ---');
ok('equator projects to the vertical middle', Math.abs(NF.projY(0) - 0.5) < 1e-12);
ok('greenwich projects to the horizontal middle', Math.abs(NF.projX(0) - 0.5) < 1e-12);
ok('north is a smaller y than south', NF.projY(55) < NF.projY(50));
ok('east is a larger x than west', NF.projX(1) > NF.projX(-1));
// Round-tripping is what stops a marker drifting from where a tap lands.
ok('lng round-trips', Math.abs(NF.unprojX(NF.projX(-0.0894)) - -0.0894) < 1e-9);
ok('lat round-trips', Math.abs(NF.unprojY(NF.projY(50.8168)) - 50.8168) < 1e-9);
ok('lat round-trips at the top of Scotland', Math.abs(NF.unprojY(NF.projY(60.8)) - 60.8) < 1e-9);
// A pole would be infinity in Mercator; a NaN there would drop markers silently.
ok('poles are clamped rather than infinite', isFinite(NF.projY(90)) && isFinite(NF.projY(-90)));
ok('fitBounds centres on the box',
   (() => {
     const f = NF.fitBounds([-6, 50, 2, 59], 400, 600, 0);
     return Math.abs(f.cx - (NF.projX(-6) + NF.projX(2)) / 2) < 1e-12 &&
            Math.abs(f.cy - (NF.projY(59) + NF.projY(50)) / 2) < 1e-12;
   })());
ok('pickNearest returns null when nothing is in range',
   NF.pickNearest([{ x: 100, y: 100 }], 0, 0, 20) === null);
ok('pickNearest finds a marker under the finger',
   NF.pickNearest([{ x: 10, y: 10, id: 'a' }, { x: 200, y: 200, id: 'b' }], 12, 12, 20).id === 'a');
ok('pickNearest prefers the closer of two overlapping markers',
   NF.pickNearest([{ x: 0, y: 0, id: 'far' }, { x: 5, y: 0, id: 'near' }], 6, 0, 20).id === 'near');
// Exactly on the radius must still register, or the tap target is a pixel
// smaller than advertised and edge taps feel dead.
ok('pickNearest includes the boundary of the radius',
   NF.pickNearest([{ x: 20, y: 0, id: 'edge' }], 0, 0, 20).id === 'edge');

ok('fitBounds keeps the box inside the viewport',
   (() => {
     const w = 400, h = 600, f = NF.fitBounds([-6, 50, 2, 59], w, h, 10);
     const wpx = (NF.projX(2) - NF.projX(-6)) * f.scale;
     const hpx = (NF.projY(50) - NF.projY(59)) * f.scale;
     return wpx <= w - 19.9 && hpx <= h - 19.9;
   })());


console.log('\n--- marker clustering ---');
{
  const P = (x, y, name) => ({ x, y, site: { name: name || (x + ',' + y) } });

  ok('points far apart stay separate',
     NF.clusterPoints([P(0, 0), P(100, 0), P(200, 0)], 10).length === 3);
  ok('overlapping points become one group',
     NF.clusterPoints([P(0, 0), P(3, 0), P(0, 4)], 10).length === 1);

  const g = NF.clusterPoints([P(0, 0), P(10, 0)], 20)[0];
  ok('a group counts its members', g.count === 2);
  ok('a group is drawn at the centroid', g.x === 5 && g.y === 0);
  ok('a group of many exposes its members', g.items.length === 2);

  // Callers branch on this: a lone marker must still behave like a marker.
  const singles = NF.clusterPoints([P(0, 0), P(500, 500)], 10);
  ok('a group of one carries its site', singles[0].site && singles[0].count === 1);
  ok('a real group carries no single site', g.site === null);

  // The radius is a diameter-style test against the anchor, not a bounding box.
  ok('the radius is honoured exactly',
     NF.clusterPoints([P(0, 0), P(10, 0)], 10).length === 1 &&
     NF.clusterPoints([P(0, 0), P(11, 0)], 10).length === 2);

  ok('every input point lands in exactly one group', (() => {
    const pts = [];
    for (let i = 0; i < 200; i++) pts.push(P((i * 37) % 300, (i * 53) % 300));
    const cl = NF.clusterPoints(pts, 12);
    return cl.reduce((n, c) => n + c.count, 0) === pts.length;
  })());

  // Ranked order in, so the nearest site anchors its own group.
  const ranked = NF.clusterPoints([P(0, 0, 'nearest'), P(5, 5, 'other')], 20);
  ok('the first point anchors its group', ranked[0].items[0].site.name === 'nearest');

  ok('an empty list clusters to nothing', NF.clusterPoints([], 10).length === 0);
}

console.log('\n--- sheet drag (the grip has to actually dismiss) ---');
// A 600px panel: 28% of it is 168px.
ok('a short drag springs back', NF.sheetShouldClose(40, 0.1, 600) === false);
ok('a long drag closes', NF.sheetShouldClose(200, 0.1, 600) === true);
ok('the threshold scales with panel height',
   NF.sheetShouldClose(100, 0.1, 600) === false && NF.sheetShouldClose(100, 0.1, 300) === true);
ok('a fast flick closes without dragging far', NF.sheetShouldClose(30, 1.2, 600) === true);
ok('a twitchy tap on the grip does not close', NF.sheetShouldClose(4, 1.2, 600) === false);
ok('dragging upward never closes', NF.sheetShouldClose(-300, 0.1, 600) === false);
ok('a flick upward never closes', NF.sheetShouldClose(-300, -2, 600) === false);
ok('no movement never closes', NF.sheetShouldClose(0, 0, 600) === false);
ok('a zero-height panel does not close on distance alone',
   NF.sheetShouldClose(500, 0, 0) === false);
ok('downward drag tracks the finger 1:1', NF.sheetOffset(120) === 120);
ok('upward drag resists', NF.sheetOffset(-30) > -30 && NF.sheetOffset(-30) < 0);
ok('upward drag is capped', NF.sheetOffset(-5000) >= -32);

console.log('\n--- sunset (vs api.sunrise-sunset.org, checked 2026-08-08) ---');
function londonHHMM(d) {
  return d.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' });
}
function minsDiff(a, b) {
  const [ah, am] = a.split(':').map(Number), [bh, bm] = b.split(':').map(Number);
  return Math.abs((ah * 60 + am) - (bh * 60 + bm));
}
[['2026-12-21', '15:58'], ['2026-06-21', '21:19'], ['2026-08-08', '20:36']].forEach(([d, want]) => {
  const got = londonHHMM(NF.sunsetAt(50.8225, -0.1372, new Date(d + 'T12:00:00Z')));
  ok(`sunset Brighton ${d} ~= ${want}`, minsDiff(got, want) <= 2, `got ${got}`);
});
ok('sunset is later further north in August',
   NF.sunsetAt(55.233, -2.556, new Date('2026-08-08T12:00:00Z')) >
   NF.sunsetAt(50.8225, -0.1372, new Date('2026-08-08T12:00:00Z')));

console.log('\n--- map deep links (vendor docs verified 2026-08-08) ---');
const site = { lat: 51.0722493, lng: 0.4470063 };
ok('apple maps url',
   NF.navUrl('apple', site) === 'https://maps.apple.com/?daddr=51.072249%2C0.447006&dirflg=d',
   NF.navUrl('apple', site));
ok('google maps url',
   NF.navUrl('google', site) === 'https://www.google.com/maps/dir/?api=1&destination=51.072249%2C0.447006&travelmode=driving&dir_action=navigate',
   NF.navUrl('google', site));
ok('waze url',
   NF.navUrl('waze', site) === 'https://waze.com/ul?ll=51.072249%2C0.447006&navigate=yes',
   NF.navUrl('waze', site));
ok('unknown map app returns null', NF.navUrl('bing', site) === null);

console.log('\n--- dataset integrity ---');
const sites = DATA.sites;
const forests = sites.filter(s => s.source === 'forest');
const carparks = sites.filter(s => s.source === 'carpark');
ok('forest count matches header', forests.length === DATA.counts.forest,
   `${forests.length} vs ${DATA.counts.forest}`);
ok('carpark count matches header', carparks.length === DATA.counts.carpark,
   `${carparks.length} vs ${DATA.counts.carpark}`);
ok('ids are unique', new Set(sites.map(s => s.id)).size === sites.length);
ok('every site has a name', sites.every(s => s.name && s.name.trim().length));
ok('all coords inside England bbox',
   sites.every(s => s.lat >= 49.5 && s.lat <= 56.2 && s.lng >= -6.8 && s.lng <= 2.2));
ok('no British National Grid leakage',
   sites.every(s => Math.abs(s.lat) < 90 && Math.abs(s.lng) < 180));
ok('attribution present', /Open Government Licence/.test(DATA.attribution || ''));
ok('every forest has a Forestry England url', forests.every(s => /^https:\/\/www\.forestryengland\.uk\//.test(s.url || '')));

console.log('\n--- campsites (a second database, under a second licence) ---');
const CAMP = JSON.parse(fs.readFileSync(path.join(ROOT, 'app', 'data', 'campsites.json'), 'utf8'));
{
  const camps = CAMP.sites;
  ok('campsite count matches header', camps.length === CAMP.counts.campsite,
     `${camps.length} vs ${CAMP.counts.campsite}`);
  ok('every record in campsites.json is a campsite', camps.every(s => s.source === 'campsite'));
  ok('campsite ids are unique', new Set(camps.map(s => s.id)).size === camps.length);

  // The two files are two databases. sites.json is Open Government Licence and this one
  // is ODbL, and ODbL 1.0 s4.5(a) only exempts them from share-alike while they stay
  // independent. A campsite record inside sites.json would end that argument.
  ok('the OGL file holds no campsite record', !sites.some(s => s.source === 'campsite'));
  ok('the two files share no id', (() => {
    const a = new Set(sites.map(s => s.id));
    return camps.every(s => !a.has(s.id));
  })());
  ok('the campsite file states its own licence and attribution',
     /ODbL/.test(CAMP.licence || '') && /OpenStreetMap/.test(CAMP.attribution || ''));

  // Great Britain, not England: Scotland and Wales are the point of this tab.
  // Widened, never removed, because it is the tripwire for unprojected coordinates.
  ok('all campsite coords inside the Great Britain bbox',
     camps.every(s => s.lat >= 49.5 && s.lat <= 61.2 && s.lng >= -8.8 && s.lng <= 2.2));
  ok('campsites exist in all three countries',
     ['England', 'Scotland', 'Wales'].every(c => camps.some(s => s.country === c)),
     JSON.stringify(CAMP.counts_by_country));

  // Rob's call on 2026-08-15: named and explicitly able to take a van, or not listed.
  ok('every campsite has a real name',
     camps.every(s => s.name && s.name.trim().length && !s.name_is_derived));
  ok('every campsite names at least one vehicle it takes',
     camps.every(s => Array.isArray(s.vehicles) && s.vehicles.length > 0));
  ok('every campsite takes a caravan or a motorhome',
     camps.every(s => s.vehicles.some(v => v === 'caravans' || v === 'motorhomes')),
     'a tents-only site does not belong in this tab');

  // 99 of 3,723 records publish any hours at all, so a badge here would be a guess,
  // and this project does not guess that a gate is open.
  ok('no campsite carries a parsed opening summary',
     camps.every(s => s.opening_summary == null));
  ok('no campsite is ever reported open or closed',
     camps.every(s => NF.openState(s, new Date('2026-08-15T23:30:00Z')).state === 'unknown'));

  // These URLs come from a source anybody may edit, and the app puts them in an href.
  ok('every campsite url is https', camps.every(s => s.url == null || /^https:\/\//.test(s.url)));
  ok('every campsite url survives the href guard',
     camps.every(s => s.url == null || NF.safeHref(s.url) === s.url));

  // OSM maps a lot of campsites twice, once as a node and once as the area around it.
  // Both pass every other check, and the result was the same name in the first two
  // rows of the list from Brighton.
  ok('no campsite is listed twice under one name in one place', (() => {
    const by = new Map();
    for (const s of camps) {
      const k = s.name.trim().toLowerCase();
      if (!by.has(k)) by.set(k, []);
      by.get(k).push(s);
    }
    for (const g of by.values()) {
      for (let i = 0; i < g.length; i++) {
        for (let j = i + 1; j < g.length; j++) {
          if (NF.haversineMi(g[i].lat, g[i].lng, g[j].lat, g[j].lng) < 0.5) return false;
        }
      }
    }
    return true;
  })());

  const stn = camps.filter(s => s.stay_the_night);
  ok('the Stay the Night car parks are present', stn.length >= 30, `${stn.length} found`);
  ok('every Stay the Night record carries the scheme rules',
     stn.every(s => /6pm to 10am/.test(s.parking || '') && /[Ss]elf-contained/.test(s.parking || '')),
     'listing one without its rules invites someone to break them');
  ok('every Stay the Night record is in Scotland', stn.every(s => s.country === 'Scotland'));

  const ranked = NF.rank(sites.concat(camps), 'campsite', BRIGHTON, '');
  ok('ranking the campsite tab returns only campsites', ranked.every(s => s.source === 'campsite'));
  ok('campsite ranking is sorted ascending',
     ranked.every((s, i) => i === 0 || s._mi >= ranked[i - 1]._mi));
  ok('the nearest campsite to Brighton is plausibly close', ranked[0]._mi < 25,
     `${ranked[0].name} at ${ranked[0]._mi.toFixed(1)} mi`);
}

console.log('\n--- opening logic safety ---');
ok('never reports open without a parsed summary',
   sites.every(s => {
     const st = NF.openState(s, new Date('2026-08-08T23:30:00Z'));
     return st.state !== 'open' || (s.opening_summary && s.opening_summary.confidence === 'parsed');
   }));
ok('sites with no opening_summary are unknown',
   sites.filter(s => !s.opening_summary).every(s => NF.openState(s).state === 'unknown'));
{
  const dusk = forests.find(s => s.opening_summary && s.opening_summary.access === 'dusk');
  const noon = NF.openState(dusk, new Date('2026-06-21T11:00:00Z'));
  const night = NF.openState(dusk, new Date('2026-06-21T23:30:00Z'));
  ok('dusk site is open at midday in June', noon.state === 'open', JSON.stringify(noon));
  ok('dusk site is closed at 23:30 in June', night.state === 'closed', JSON.stringify(night));
  const always = forests.find(s => s.opening_summary && s.opening_summary.access === 'always');
  ok('24h site is open at 03:00', NF.openState(always, new Date('2026-01-15T03:00:00Z')).state === 'open');
}

console.log('');
console.log('');
console.log('');
console.log('--- tile layer (optional, must never be load-bearing) ---');
{
  const map = fs.readFileSync(path.join(ROOT, 'app', 'map.js'), 'utf8');
  const php = fs.readFileSync(path.join(ROOT, 'app', 'api', 'tiles.php'), 'utf8');

  ok('tile layer defaults to off', /var tilesOn = false/.test(map));
  ok('tiles are only fetched when the layer is on', /if \(tilesOn\) drawTiles\(\)/.test(map));
  // Tiles draw after the outline is filled and stroked, so a failed or offline
  // tile reveals the coastline rather than a grey hole.
  ok('tiles draw over the bundled outline, not instead of it',
     map.indexOf('ctx.fill();') < map.indexOf('if (tilesOn) drawTiles()'));
  ok('provider attribution is present', /Thunderforest.*OpenStreetMap/.test(map));

  ok('the proxy whitelists styles rather than passing them through', /in_array\(\$style, STYLES/.test(php));
  ok('the proxy validates z, x and y', /FILTER_VALIDATE_INT/.test(php) && /MAX_ZOOM/.test(php));
  // curl_error() embeds the request URL, and the URL carries the key.
  ok('the proxy never echoes curl_error', !/echo\s+\$err|curl_error\(\$ch\)\s*\)/.test(php.replace(/\$err\s*=\s*curl_error\(\$ch\);/, '')));
  ok('the key is read from outside the web root', /tiles\.key/.test(php) && /\.\.\/\.\.\/\.\./.test(php));

  // The repository is public. A committed key would be readable by anyone.
  const tracked = require('child_process')
    .execSync('git ls-files', { cwd: ROOT }).toString().trim().split('\n');
  const leaked = tracked.filter(f => {
    if (/\.(png|json)$/.test(f)) return false;
    // git ls-files still reports a path that has been moved but not yet
    // staged, so a run mid-rename must not crash the whole suite.
    const abs = path.join(ROOT, f);
    if (!fs.existsSync(abs)) return false;
    const t = fs.readFileSync(abs, 'utf8');
    // Line-scoped on purpose. Matching a 32-hex token anywhere in a file that
    // also says "thunderforest" somewhere else flagged HUMAN_ACTIONS.md, which
    // legitimately carries a Cloudflare DNS record id. A guard that cries wolf
    // gets muted, and this one has to stay trustworthy.
    return t.split('\n').some(line =>
      /apikey=[0-9a-f]{16,}/i.test(line) ||
      (/\b[0-9a-f]{32}\b/.test(line) && /thunderforest|apikey|tiles\.key/i.test(line)));
  });
  ok('no provider key is committed anywhere', leaked.length === 0, leaked.join(', '));
}

console.log('');
console.log('--- hardening (adversarial review, 2026-08-10) ---');
{
  const htaccess = fs.readFileSync(path.join(ROOT, 'app', '.htaccess'), 'utf8');
  const appjs = fs.readFileSync(path.join(ROOT, 'app', 'app.js'), 'utf8');
  const indexhtml = fs.readFileSync(path.join(ROOT, 'app', 'index.html'), 'utf8');
  const tiles = fs.readFileSync(path.join(ROOT, 'app', 'api', 'tiles.php'), 'utf8');
  const shipped = ['app.js', 'core.js', 'map.js', 'sw.js']
    .map(f => fs.readFileSync(path.join(ROOT, 'app', f), 'utf8')).join('\n');

  // A dataset URL goes into an href. esc() stops an attribute breakout; it cannot
  // stop a javascript: scheme sitting legitimately inside one.
  ok('safeHref passes an ordinary https page',
     NF.safeHref('https://www.forestryengland.uk/bedgebury') === 'https://www.forestryengland.uk/bedgebury');
  ok('safeHref rejects javascript:', NF.safeHref('javascript:alert(1)') === null);
  ok('safeHref rejects a leading-whitespace javascript:',
     NF.safeHref('  \t javascript:alert(1)') === null);
  ok('safeHref rejects data:', NF.safeHref('data:text/html,<script>alert(1)</script>') === null);
  ok('safeHref rejects plain http', NF.safeHref('http://example.com') === null);
  ok('safeHref rejects a protocol-relative URL', NF.safeHref('//evil.example.com') === null);
  ok('safeHref rejects null and empty', NF.safeHref(null) === null && NF.safeHref('') === null);
  ok('app.js puts site.url through safeHref rather than straight into the href',
     /NF\.safeHref\(site\.url\)/.test(appjs) && !/href="'\s*\+\s*esc\(site\.url\)/.test(appjs));

  // The generator refuses to emit anything else, so this should never trip; it is
  // here because the app ships the file rather than rebuilding it.
  const badUrls = DATA.sites.filter(s => s.url != null && NF.safeHref(s.url) === null);
  const offSite = DATA.sites.filter(s => s.url != null &&
    !/^https:\/\/(www\.)?forestryengland\.uk\//.test(s.url));
  ok('every dataset url survives safeHref', badUrls.length === 0,
     badUrls.slice(0, 3).map(s => s.id).join(', '));
  ok('every dataset url is on forestryengland.uk', offSite.length === 0,
     offSite.slice(0, 3).map(s => s.url).join(', '));

  // The CSP below has no 'unsafe-inline' and no 'unsafe-eval'. These assert the app
  // stays inside it, so a violation fails here rather than as a blank screen on a
  // phone, which is the only other place it would show up.
  ok('no inline <script> in index.html',
     !/<script(?![^>]*\bsrc=)[^>]*>/i.test(indexhtml));
  ok('no inline event handlers in index.html',
     !/\son[a-z]{3,}\s*=\s*["']/i.test(indexhtml));
  ok('no style attributes in index.html markup', !/\sstyle\s*=\s*["']/i.test(indexhtml));
  ok('no eval or Function constructor in the shipped JS',
     !/\beval\s*\(|\bnew\s+Function\s*\(/.test(shipped));

  const wantHeaders = [
    ['Content-Security-Policy', /Header always set Content-Security-Policy/],
    ['frame-ancestors none', /frame-ancestors 'none'/],
    ['Strict-Transport-Security', /Header always set Strict-Transport-Security "max-age=\d{7,}/],
    ['X-Content-Type-Options', /Header always set X-Content-Type-Options "nosniff"/],
    ['Referrer-Policy', /Header always set Referrer-Policy/],
    ['Permissions-Policy scoping geolocation', /Permissions-Policy "geolocation=\(self\)/]
  ];
  wantHeaders.forEach(([name, re]) => ok('.htaccess sets ' + name, re.test(htaccess)));
  ok('the CSP carries no unsafe-inline or unsafe-eval', !/unsafe-(inline|eval)/.test(htaccess));

  // sw.js matches both FilesMatch patterns and the last `Header set` wins, so the
  // stricter block has to be the later one. Reversed, the file reads as though the
  // strict value were in force while "no-cache" is what actually ships.
  ok('the sw.js cache block comes after the general js one',
     htaccess.indexOf('\\.(html|css|js|json|webmanifest)$') < htaccess.indexOf('sw\\.js$'));
  // A redirect that echoes the request's own Host header is an open redirect.
  ok('the HTTPS redirect does not echo the request Host',
     !/RewriteRule.*%\{HTTP_HOST\}/.test(htaccess));

  // The Referer check alone served a real tile to curl with no Referer and to any
  // page using referrerpolicy="no-referrer". Sec-Fetch-Site is unforgeable from a
  // page; the per-address cap is what bounds a script that sends its own headers.
  ok('the tile proxy checks Sec-Fetch-Site', /HTTP_SEC_FETCH_SITE/.test(tiles));
  ok('the tile proxy refuses a cross-site fetch',
     /\$fetchSite !== 'same-origin'[\s\S]{0,120}fail\(403/.test(tiles));
  ok('the tile proxy caps tiles per address per day',
     /CAP_PER_DAY/.test(tiles) && /fail\(429/.test(tiles));
  ok('the tile cap keys on REMOTE_ADDR and never on a forwarded header',
     /REMOTE_ADDR/.test(tiles) && !/HTTP_X_FORWARDED_FOR|X-Forwarded-For['"]\]/.test(tiles));

  // Now that other people use it, the app says what it does with a location.
  ok('the app states its privacy position in the footer',
     /location stays on this phone/i.test(indexhtml));
}

console.log('');
console.log('--- update path ---');
{
  const sw = fs.readFileSync(path.join(ROOT, 'app', 'sw.js'), 'utf8');
  const cache = (sw.match(/var CACHE = '([^']+)'/) || [])[1];

  // The footer shows NF.BUILD so "which version is this phone running" is
  // answerable by looking. It is only useful if it tracks the real cache name.
  ok('service worker cache name embeds the build string',
     cache === 'nearest-forest-' + NF.BUILD, `CACHE is ${cache}, BUILD is ${NF.BUILD}`);

  // A plain addAll() fetches through the browser HTTP cache, so a new cache
  // name can be populated with old bytes and stay stale forever. This is the
  // bug that made the map render on desktop but not on the phone.
  ok('precache bypasses the HTTP cache',
     /cache:\s*'reload'/.test(sw),
     "install must fetch with { cache: 'reload' }");
  ok('precache still fails as a unit rather than half-populating',
     /Promise\.all/.test(sw) && /skipWaiting/.test(sw));

  // A tab whose data is not precached works on the sofa and fails in the car park,
  // which is the one place this app has to work.
  ok('the campsite dataset is precached', /\.\/data\/campsites\.json/.test(sw));

  // ODbL requires the credit and requires saying the data is under that licence.
  // It is a licence condition, not a nicety, so it is tested rather than trusted.
  const html = fs.readFileSync(path.join(ROOT, 'app', 'index.html'), 'utf8');
  ok('the app credits OpenStreetMap and names the licence',
     /OpenStreetMap/.test(html) && /Open Database License/.test(html) &&
     /openstreetmap\.org\/copyright/.test(html));
  ok('the Campsites tab exists in the shell', /data-tab="campsite"/.test(html));

  const ht = fs.readFileSync(path.join(ROOT, 'app', '.htaccess'), 'utf8');
  ok('the app shell is not HTTP-cached', /\(html\|css\|js\|json\|webmanifest\)/.test(ht) &&
     /Cache-Control "no-cache"/.test(ht));

  // The offline cache must stay exactly as big as ASSETS. api/tiles.php is
  // same-origin, so a handler that caches same-origin misses quietly fills the
  // app's offline cache with map tiles until iOS evicts the lot.
  ok('the service worker never caches api/ responses',
     /\/api\//.test(sw) && /pathname\.indexOf\('\/api\/'\)/.test(sw),
     'fetch handler must bail out on api/ before it can cache anything');
  ok('the service worker writes nothing at runtime',
     !/c\.put\(req/.test(sw) && (sw.match(/\.put\(/g) || []).length === 1,
     'the only put() belongs to install; a runtime put grows the cache without bound');
  ok('cache lookups are scoped to the current cache name',
     !/caches\.match\((req|'\.\/index\.html')\)/.test(sw) &&
     /cacheName:\s*CACHE/.test(sw),
     'an unscoped caches.match() lets a stale cache answer mid-update');

  const appjs = fs.readFileSync(path.join(ROOT, 'app', 'app.js'), 'utf8');
  // Without this a deploy takes two online launches to show up, and offline it
  // never shows up at all -- which is how drag-to-dismiss appeared to be broken.
  ok('the page reloads when a new worker takes over',
     /controllerchange/.test(appjs) && /location\.reload/.test(appjs));
  ok('the update reload cannot loop or fire on a first visit',
     /hadController/.test(appjs) && /reloadingForUpdate/.test(appjs));
}

console.log('--- offline precache ---');
{
  const sw = fs.readFileSync(path.join(ROOT, 'app', 'sw.js'), 'utf8');
  const html = fs.readFileSync(path.join(ROOT, 'app', 'index.html'), 'utf8');
  const listed = new Set([...sw.matchAll(/'\.\/([^']*)'/g)].map(m => m[1]));

  // Everything index.html pulls in must be precached, or the app half-works
  // offline: the shell loads and the missing piece fails silently, somewhere
  // with no signal, which is the one place that must not happen.
  const referenced = [
    ...[...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]),
    ...[...html.matchAll(/<link[^>]+href="([^"]+)"/g)].map(m => m[1])
  ].filter(u => !/^https?:/.test(u));

  referenced.forEach(u => {
    ok('sw precaches ' + u, listed.has(u), 'not in the ASSETS list in sw.js');
  });
  ok('sw precaches the map outline', listed.has('data/boundary.json'));
  ok('sw precaches the dataset', listed.has('data/sites.json'));

  // addAll is atomic: one 404 fails the whole install, so a listed-but-absent
  // file means the app never becomes offline-capable at all.
  [...listed].forEach(u => {
    if (u === '') return;                      // './' is the directory index
    ok('precached file exists: ' + u, fs.existsSync(path.join(ROOT, 'app', u)));
  });
}

console.log('');
console.log('--- map outline registration ---');
{
  const B = JSON.parse(fs.readFileSync(path.join(ROOT, 'app', 'data', 'boundary.json'), 'utf8'));
  const P = B.precision;
  const decode = (flat) => {
    const pts = []; let x = 0, y = 0;
    for (let i = 0; i < flat.length; i += 2) { x += flat[i]; y += flat[i + 1]; pts.push([x / P, y / P]); }
    return pts;
  };
  const rings = B.parts.flatMap(p => p.rings.map(decode));

  const inRing = (ring, lng, lat) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > lat) !== (yj > lat) &&
          lng < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  const onLand = (lng, lat) => rings.some(r => inRing(r, lng, lat));

  ok('outline declares the vertex count it contains',
     B.vertices === rings.reduce((n, r) => n + r.length, 0));

  // Registration: if the projection or the source were wrong, inland sites
  // would land in the sea and the map would be confidently misleading.
  const inland = [
    ['Kielder', 55.2333, -2.5667], ['Sherwood', 53.2050, -1.0700],
    ['Grizedale', 54.3670, -3.0350], ['Forest of Dean', 51.8100, -2.5800]
  ];
  inland.forEach(([name, lat, lng]) => ok('outline contains ' + name, onLand(lng, lat)));
  ok('outline excludes a point in the North Sea', !onLand(2.5, 54.0));
  ok('outline excludes a point in the Irish Sea', !onLand(-5.0, 53.6));

  // Coastal sites can fall marginally outside a 450m-simplified coastline, so
  // this is a proportion rather than an absolute: a projection error would put
  // the figure near zero, not near 100.
  const sites = DATA.sites;
  const hits = sites.filter(s => onLand(s.lng, s.lat)).length;
  const pct = (hits / sites.length) * 100;
  ok('at least 90% of sites fall inside the outline',
     pct >= 90, `${pct.toFixed(1)}% of ${sites.length} sites (${sites.length - hits} outside)`);
}

console.log('\n--- ranking from Brighton ---');
const rankedF = NF.rank(sites, 'forest', BRIGHTON, '');
const rankedC = NF.rank(sites, 'carpark', BRIGHTON, '');
ok('forest ranking is sorted ascending',
   rankedF.every((s, i) => i === 0 || rankedF[i - 1]._mi <= s._mi));
ok('ranking only returns the requested source', rankedF.every(s => s.source === 'forest'));
ok('nearest forest is within 30 miles of Brighton', rankedF[0]._mi < 30,
   `${rankedF[0].name} at ${rankedF[0]._mi.toFixed(1)}mi`);
ok('filter narrows results', NF.rank(sites, 'forest', BRIGHTON, 'friston').length < rankedF.length);
ok('no-position ranking falls back to alphabetical',
   (() => { const a = NF.rank(sites, 'forest', null, ''); return a[0].name.localeCompare(a[1].name) <= 0; })());

console.log('\n  Nearest 6 forests to Marine Gate, Brighton:');
rankedF.slice(0, 6).forEach(s => {
  const st = NF.openState(s);
  console.log(`    ${s._mi.toFixed(1).padStart(5)} mi ${NF.POINTS[NF.compassIdx(s._bear)].padEnd(3)} ` +
              `${s.name.slice(0, 38).padEnd(38)} ${(s.postcode_satnav || '-').padEnd(9)} ${st.label}`);
});
console.log('\n  Nearest 3 car parks:');
rankedC.slice(0, 3).forEach(s => {
  console.log(`    ${s._mi.toFixed(1).padStart(5)} mi ${NF.POINTS[NF.compassIdx(s._bear)].padEnd(3)} ` +
              `${s.name.slice(0, 38).padEnd(38)} ${s.surface || ''}`);
});

console.log('\n  Nearest 5 campsites:');
NF.rank(CAMP.sites, 'campsite', BRIGHTON, '').slice(0, 5).forEach(s => {
  console.log(`    ${s._mi.toFixed(1).padStart(5)} mi ${NF.POINTS[NF.compassIdx(s._bear)].padEnd(3)} ` +
              `${s.name.slice(0, 38).padEnd(38)} ${(s.postcode_satnav || '-').padEnd(9)} ` +
              `${(s.vehicles || []).join('/')}`);
});

console.log(`\n${pass} passed, ${failures.length} failed`);
if (failures.length) {
  console.log('\nFAILURES:');
  failures.forEach(f => console.log('  - ' + f));
  process.exit(1);
}
console.log('All self-tests passed.');
