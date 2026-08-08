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

console.log(`\n${pass} passed, ${failures.length} failed`);
if (failures.length) {
  console.log('\nFAILURES:');
  failures.forEach(f => console.log('  - ' + f));
  process.exit(1);
}
console.log('All self-tests passed.');
