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
// Great Britain, not England, since card 0016 added Scotland. Widened, never removed:
// this is the tripwire that catches an unprojected British National Grid value.
ok('all coords inside the Great Britain bbox',
   sites.every(s => s.lat >= 49.5 && s.lat <= 61.2 && s.lng >= -8.8 && s.lng <= 2.2));
ok('every English record is still inside the England bbox',
   sites.filter(s => s.country === 'England')
        .every(s => s.lat >= 49.5 && s.lat <= 56.2 && s.lng >= -6.8 && s.lng <= 2.2));
ok('no British National Grid leakage',
   sites.every(s => Math.abs(s.lat) < 90 && Math.abs(s.lng) < 180));
ok('attribution present', /Open Government Licence/.test(DATA.attribution || ''));
ok('every record names the country it is in',
   sites.every(s => s.country === 'England' || s.country === 'Scotland'),
   JSON.stringify(DATA.counts_by_country));
ok('every forest links to the agency that publishes it',
   forests.every(s => s.country === 'Scotland'
     ? /^https:\/\/forestryandland\.gov\.scot\//.test(s.url || '')
     : /^https:\/\/www\.forestryengland\.uk\//.test(s.url || '')));

console.log('\n--- derived car park names ---');
{
  // Must match NEAR_FOREST_MI in scripts/parse.py. Taken from the measured distribution
  // of unnamed-car-park-to-nearest-forest distances (q3 2.19, IQR ~2.16, Tukey fence
  // 5.45mi), not picked to make a number look good.
  const NEAR_MI = 5.0;
  const GENERIC = 'Unnamed car park';
  const nearestForest = (s) => forests.reduce((best, f) => {
    const d = NF.haversineMi(s.lat, s.lng, f.lat, f.lng);
    return (best === null || d < best.d) ? { d: d, f: f } : best;
  }, null);
  const derived = carparks.filter(s => s.name_is_derived);
  const bare = derived.filter(s => s.name === GENERIC);

  ok('some car park names are derived', derived.length > 100, `${derived.length} derived`);

  // The card's point: a row that names no place is useless read in a moving car.
  ok('no car park within the threshold is left unnamed',
     bare.every(s => nearestForest(s).d > NEAR_MI),
     bare.filter(s => nearestForest(s).d <= NEAR_MI).slice(0, 3)
         .map(s => `${s.id} at ${nearestForest(s).d.toFixed(2)}mi`).join(', '));

  // ...and the other half: beyond the threshold we say nothing rather than claim a
  // forest the car park is probably not part of.
  ok('no car park beyond the threshold claims a forest',
     derived.every(s => s.name === GENERIC || nearestForest(s).d <= NEAR_MI),
     derived.filter(s => s.name !== GENERIC && nearestForest(s).d > NEAR_MI)
            .slice(0, 3).map(s => s.name).join(', '));

  const named = derived.filter(s => s.name !== GENERIC);
  ok('every derived name reads as a place near a forest',
     named.every(s => /^(?:[A-Z][a-z]+ )?[Cc]ar park near \S/.test(s.name)),
     named.filter(s => !/^(?:[A-Z][a-z]+ )?[Cc]ar park near \S/.test(s.name))
          .slice(0, 3).map(s => s.name).join(' | '));

  // A join against the wrong forest is invisible by inspection and wrong in the one way
  // that matters: it sends someone to the wrong wood.
  ok('every derived name names the forest it is actually nearest to',
     named.every(s => s.name.endsWith(' near ' + nearestForest(s).f.name)),
     named.filter(s => !s.name.endsWith(' near ' + nearestForest(s).f.name))
          .slice(0, 3).map(s => `${s.name} vs ${nearestForest(s).f.name}`).join(' | '));

  // Only a car park may carry one, and only a derived name may look like one.
  ok('no forest carries a derived name', forests.every(s => !s.name_is_derived));
  ok('nothing reads as derived without the flag',
     sites.every(s => !/ car park near /i.test(s.name) || s.name_is_derived));

  // The row that started the card: the nearest car park to Brighton was "Unnamed car park".
  const nearestCp = NF.rank(sites, 'carpark', BRIGHTON, '')[0];
  ok('the nearest car park to Brighton is named after Friston Forest',
     nearestCp.name === 'Car park near Friston Forest', nearestCp.name);

  // A derived name reads like an official one, so every screen that shows a name has to
  // say it is ours. The list already did; the sheet and the map labels were the gap.
  const appjs004 = fs.readFileSync(path.join(ROOT, 'app', 'app.js'), 'utf8');
  const appcss = fs.readFileSync(path.join(ROOT, 'app', 'app.css'), 'utf8');
  const mapjs = fs.readFileSync(path.join(ROOT, 'app', 'map.js'), 'utf8');
  ok('the list marks a derived name', /row__derived/.test(appjs004) && /\.row__derived/.test(appcss));
  ok('the detail sheet marks a derived name',
     /sheet__name--derived/.test(appjs004) && /\.sheet__name--derived/.test(appcss));
  ok('the detail sheet says the name is ours', /not a published one/.test(appjs004));
  ok('the map marks a derived label', /name_is_derived \? 'italic/.test(mapjs));
}

console.log('\n--- Scotland, from Forestry and Land Scotland (card 0016) ---');
{
  const scots = forests.filter(s => s.country === 'Scotland');
  const english = forests.filter(s => s.country === 'England');

  // 278 destinations published on 2026-08-29, two of them marked closed. The floor is
  // well below that: it catches a broken index attribute, not week-to-week movement.
  ok('Scotland fills the Forests tab', scots.length >= 250, `${scots.length} destinations`);
  ok('England is still there too', english.length >= 250, `${english.length} forests`);
  ok('every Scottish id is prefixed fls-', scots.every(s => /^fls-[a-z0-9-]+$/.test(s.id)));
  ok('every Scottish record has a name', scots.every(s => s.name && s.name.trim().length));
  ok('no Scottish record is a car park or a campsite',
     scots.every(s => s.source === 'forest'));

  // Scotland reaches 60.86N at Shetland and -8.6E at St Kilda, so the useful assertion is
  // that nothing Scottish has landed in England or in the sea off Ireland.
  ok('Scottish coords are in Scotland',
     scots.every(s => s.lat >= 54.5 && s.lat <= 61.2 && s.lng >= -8.8 && s.lng <= 0.0),
     scots.filter(s => !(s.lat >= 54.5 && s.lat <= 61.2 && s.lng >= -8.8 && s.lng <= 0.0))
          .slice(0, 3).map(s => `${s.id} ${s.lat},${s.lng}`).join(' | '));
  ok('Scotland is north of every English forest',
     Math.min(...scots.map(s => s.lat)) > 54.0);

  // The names carry Gaelic diacritics, and the whole chain (fetch, parse, JSON, this
  // read) has to keep them. A mojibake name is how a wrong encoding shows up.
  const dia = scots.filter(s => /[À-ſ]/.test(s.name));
  ok('Gaelic diacritics survive the round trip', dia.length >= 10, `${dia.length} names`);
  ok('Allt na Criche keeps its grave accent',
     scots.some(s => s.name === 'Allt na Crìche'),
     dia.slice(0, 4).map(s => s.name).join(' | '));
  ok('no name arrived as mojibake', !scots.some(s => /Ã.|�/.test(s.name)),
     scots.filter(s => /Ã.|�/.test(s.name)).slice(0, 3).map(s => s.name).join(' | '));

  // A destination FLS has taken out of use is not somewhere to drive to. Both are
  // published as "<name> (closed)" on the index and again in their own page's h1.
  ok('a destination published as closed is not offered',
     !sites.some(s => /\(\s*closed\s*\)\s*$/i.test(s.name)),
     sites.filter(s => /\(\s*closed\s*\)\s*$/i.test(s.name)).map(s => s.id).join(', '));

  // The reason this card was not a copy of the English one. Glentrool publishes
  // "The cafe is open from 10.30am to 4.30pm" under its Opening hours heading. That is
  // the cafe, not the gate, and the forest itself never closes.
  const indoor = /caf|visitor centre|tea ?room|restaurant|kiosk|\bshop\b/i;
  const cafeOnly = scots.filter(s => s.opening_times && indoor.test(s.opening_times) &&
                                     !/24\s*hour|always open|dusk/i.test(s.opening_times));
  ok('some Scottish sites publish only indoor hours', cafeOnly.length > 0,
     `${cafeOnly.length} sites`);
  ok('indoor hours never become the site\'s access hours',
     cafeOnly.every(s => !s.opening_summary || s.opening_summary.access === 'unknown'),
     cafeOnly.filter(s => s.opening_summary && s.opening_summary.access !== 'unknown')
             .map(s => s.name).join(', '));
  ok('and the app never claims such a site is open',
     cafeOnly.every(s => NF.openState(s, new Date('2026-08-29T12:00:00')).state === 'unknown'),
     cafeOnly.filter(s => NF.openState(s, new Date('2026-08-29T12:00:00')).state !== 'unknown')
             .map(s => s.name).join(', '));
  ok('the raw text is still published for the reader to judge',
     cafeOnly.every(s => typeof s.opening_times === 'string' && s.opening_times.length));

  // Most Scottish forests publish no hours and no postcode at all. Null is the answer,
  // and an empty string would render as blank space rather than "not known".
  ok('a silent field is null, never an empty string',
     scots.every(s => ['postcode_satnav', 'opening_times', 'parking', 'address']
                        .every(k => s[k] === null || (typeof s[k] === 'string' && s[k].length))));
  ok('most Scottish sites carry a sat nav postcode',
     scots.filter(s => s.postcode_satnav).length > scots.length * 0.8,
     `${scots.filter(s => s.postcode_satnav).length}/${scots.length}`);
  ok('every sat nav postcode looks like a UK postcode',
     scots.every(s => !s.postcode_satnav || /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/.test(s.postcode_satnav)),
     scots.filter(s => s.postcode_satnav &&
                       !/^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/.test(s.postcode_satnav))
          .slice(0, 3).map(s => s.postcode_satnav).join(', '));
  ok('most Scottish sites list facilities',
     scots.filter(s => s.facilities && s.facilities.length).length > scots.length * 0.8);

  // The Forests tab is one ranked list, so a Scottish record has to rank like any other.
  const fromGlasgow = NF.rank(sites, 'forest', { lat: 55.8642, lng: -4.2518 }, '');
  ok('the nearest forest to Glasgow is Scottish', fromGlasgow[0].country === 'Scotland',
     `${fromGlasgow[0].name} (${fromGlasgow[0].country})`);
  ok('the nearest forest to Brighton is still English',
     NF.rank(sites, 'forest', BRIGHTON, '')[0].country === 'England');
}

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

  // Acceptance #6: a members-only site is not somewhere you can pull up for the night,
  // so it must be dropped by the parser rather than shipped with a "Members only" label.
  // Labelling is not excluding, and the label was what shipped until 2026-09-08.
  ok('no campsite is members-only, private, scout or a static-caravan park',
     camps.every(s => !/members only|private|scouts?\b|static caravan/i.test(s.access_note || '')),
     camps.filter(s => /members only/i.test(s.access_note || '')).map(s => s.id).join(', '));

  // Very few of these records publish any hours at all, so a badge here would be a guess,
  // and this project does not guess that a gate is open. The measured count is in
  // app/app.js and is checked against the shipped file by the prose-count block below.
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

  // The data carrying the rules is only half of "THE APP SHALL say". The sheet holds them
  // in `parking`, which on every other campsite is a price, and the field label is the only
  // thing telling the two apart. Under "Charges", the sentence saying no tents are allowed
  // is the kind of line somebody reads past at 9pm; that mislabel shipped once already.
  const appjs020 = fs.readFileSync(path.join(ROOT, 'app', 'app.js'), 'utf8');
  ok('the detail sheet gives a Stay the Night car park its own rules heading, not "Charges"',
     /site\.stay_the_night \? field\('Overnight rules', site\.parking\)/.test(appjs020),
     'listing the scheme rules under a price heading invites someone to break them');

  // Acceptance #2, the badge clause: "THE APP SHALL NOT show an open/closed badge".
  // `no campsite is ever reported open or closed` above proves NF.openState returns
  // `unknown`. It does not prove the app asks. Two places render the badge -- the list
  // row in draw() and the "Right now" field in openSheet() -- and both are gated on that
  // state by hand. Delete either gate and every campsite gets a badge built from an
  // undefined label, which is the guess this project refuses, and the suite stays green.
  // Source text rather than behaviour: both live inside DOM-only functions this harness
  // cannot run. The cost is that renaming `st` breaks the assertion loudly but unhelpfully.
  ok('the app shows an open or closed badge only when the state is known',
     /if \(st\.state !== 'unknown'\) \{\r?\n\s*h \+= field\('Right now'/.test(appjs020)
     && /if \(st\.state === 'closed'\)[\s\S]{0,160}?else if \(st\.state === 'open'\)/.test(appjs020),
     'an ungated badge tells a reader a campsite gate is open on no published hours');

  // Acceptance #2, "state only what its source publishes". The sheet's "Data checked" row
  // falls back to the file's `generated_at` when a record carries no `scraped_at` — and
  // `generated_at` is OpenStreetMap's snapshot date. A Stay the Night car park comes from
  // Forestry and Land Scotland, whose fetcher records no date at all, so all 44 of them
  // would report OSM's freshness as their own: a date the source never published, on the
  // one field a reader consults to decide whether to trust the row.
  ok('a Stay the Night car park is not given OpenStreetMap\'s data-checked date',
     NF.dataChecked({ source: 'campsite', stay_the_night: true },
                    { generated_at: '2026-08-15' }) === null,
     'FLS publishes no scrape date, so the sheet must say not listed rather than OSM\'s');
  ok('an OSM campsite still reports the snapshot it came from',
     NF.dataChecked({ source: 'campsite', scraped_at: '2026-08-15' }, null) === '2026-08-15' &&
     NF.dataChecked({ source: 'campsite' }, { generated_at: '2026-08-15' }) === '2026-08-15');
  ok('the sheet asks core.js for the data-checked date rather than deciding it inline',
     /NF\.dataChecked\(site, CAMP\)/.test(appjs020));

  // Acceptance #1 is "the app offers a Campsites tab, ranked like the other two", and the
  // ranking assertions below build the merged array themselves, so they prove `rank` and
  // not the app. The shell has to fetch the second file AND concat it into the list `rank`
  // reads; drop either line and every other campsite assertion here stays green while the
  // tab renders empty. The merge is in-memory only and must never reach disk (#4), so this
  // asserts the one place it is allowed to happen. Source text, because app.js is DOM-only.
  ok('the shell fetches the campsite file and merges it into the ranked list',
     /loadJson\('data\/campsites\.json'\)/.test(appjs020) &&
     /DATA\.sites = DATA\.sites\.concat\(CAMP\.sites\)/.test(appjs020),
     'without both lines the Campsites tab loads empty and nothing else here notices');

  // Acceptance #1 again, and the price #4 charges for it. Splitting the ODbL data into a
  // second file gives the shell a SECOND fetch that can fail on its own -- a half-populated
  // offline cache, an interrupted deploy, a corrupt json. That failure must land on the
  // Campsites tab and nowhere else: chained onto Promise.all without its own catch, one
  // missing campsites.json rejects the pair, and the app that "loads" offers no tabs at all,
  // Forests and Car parks included. And a tab that comes up empty has two causes a reader
  // cannot tell apart -- a filter that matched nothing, or data that never arrived -- so
  // "No sites match that filter" over a failed load tells somebody there is nowhere to sleep
  // near them, which is a thing no source published. Both guards are one line each and
  // nothing was watching either. Source text, because app.js is DOM-and-fetch only: the load
  // is a top-level Promise.all and the message is inside render(), so neither lifts out the
  // way field() does. The cost is that renaming CAMP_ERROR fails this loudly but unhelpfully.
  ok('a missing campsite file cannot take the forests down, and the tab says which happened',
     /loadJson\('data\/campsites\.json'\)\s*\r?\n?\s*\.?catch\(/.test(appjs020)
     && /CAMP_ERROR = err\.message/.test(appjs020)
     && /TAB === 'campsite' && CAMP_ERROR/.test(appjs020)
     && /could not be loaded/.test(appjs020),
     'an uncaught second fetch loses all three tabs, and an unexplained empty tab reads as "no campsites near you"');

  // Acceptance #3 and #4 on the OTHER front end. Every licence assertion on this card watches
  // the PWA: the footer credit, the map pill, the campsites.json header. api/nearest.php is a
  // second way this data can leave the machine, it already takes source=all, and its response
  // carries no attribution of any kind -- it does not need one today, because it reads
  // sites.json and nothing else. That is the whole guarantee, and nothing was watching it.
  // Adding `campsites.json` here is the obvious next move on the Shortcut (HANDOVER says the
  // two front ends no longer cover the same ground), and it would redistribute a Derivative
  // Database over HTTP with no credit, no licence name and no link -- #3's three obligations,
  // missed in the one place a reader never sees a footer. So: serve campsite data if somebody
  // decides to, but not without the notice travelling with it.
  {
    const php = fs.readFileSync(path.join(ROOT, 'app', 'api', 'nearest.php'), 'utf8');
    const servesCamps = /campsites\.json/.test(php);
    const credits = /'attribution'\s*=>/.test(php)
                 && /OpenStreetMap contributors/.test(php)
                 && /openstreetmap\.org\/copyright/.test(php);
    ok('the Shortcut endpoint never serves campsite data without the ODbL notice',
       !servesCamps || credits,
       'api/nearest.php reads campsites.json but its JSON response carries no attribution key ' +
       'crediting OpenStreetMap, naming the Open Database License and linking to the copyright page');
  }

  // Acceptance #2 has two clauses and only one was watched. "SHALL NOT show an open/closed
  // badge" is covered below; "SHALL state only what its source publishes, and say not known
  // for every field the source is silent on" was covered only as far as the parser — a silent
  // tag becomes null rather than "". Nothing asserted what the SHEET does with that null.
  // 3,675 campsites carry mostly nulls, so a `field()` that renders an empty <dd> leaves a
  // reader with a blank line beside "Charges", which reads as "free", not as "not known".
  // Run the real function rather than grep it: it depends only on `esc`, so both lift out of
  // app.js source cleanly and the assertion tests behaviour instead of spelling.
  const field020 = new Function(
    appjs020.match(/function esc\(s\) \{[\s\S]*?\r?\n\}\r?\n/)[0] +
    appjs020.match(/function field\(label, value, opts\) \{[\s\S]*?\r?\n\}\r?\n/)[0] +
    'return field;')();
  ok('a field the source is silent on is named as unknown, never left blank',
     ['<dd></dd>', '<dd> </dd>'].every(blank =>
       ![field020('Charges', null), field020('Charges', ''),
         field020('Sat nav postcode', null, { missing: 'No sat nav postcode published' })]
         .some(h => h.includes(blank))) &&
     /<dd class="is-missing">Not listed<\/dd>/.test(field020('Charges', null)) &&
     /<dd class="is-missing">No sat nav postcode published<\/dd>/
       .test(field020('Sat nav postcode', null, { missing: 'No sat nav postcode published' })),
     'a blank value beside a label reads as a published answer, not as silence');

  // ...and that one feeds `null` and `''`, which is a shape this file never ships. `compact()`
  // in parse_campsites.py DELETES every null key before writing, so a silent field arrives at
  // the sheet as `undefined`, not as null: 3,124 records carry no `parking` key at all and not
  // one carries an explicit null. So the assertion above proves a contract the data does not
  // use. Feed it the real records instead — tighten `value == null` to `value === null` and it
  // stays green while every absent field renders as an empty <dd>, which is #2's own failure.
  {
    const silent = (k, label, opts) => {
      const rec = camps.find(s => !(k in s));
      return rec && field020(label, rec[k], opts).includes('<dd class="is-missing">');
    };
    ok('a field the shipped record simply does not carry is named as unknown, not left blank',
       silent('parking', 'Charges', { missing: 'Not stated' }) &&
       silent('postcode_satnav', 'Sat nav postcode', { missing: 'No sat nav postcode published' }) &&
       silent('address', 'Address') &&
       silent('opening_times', 'Opening times', { missing: 'Not published' }),
       'campsites.json holds no nulls at all; every silence is an absent key');
  }

  // The run that added `a site the source says you pay for is never shown as free` pinned the
  // string `fee_text()` writes, and said plainly that the badge keying off it was still
  // unwatched. This is that half. It is the sharper one to get wrong: `parking` on the sheet
  // needs a tap to reach, but the badge is on the LIST ROW, which is the line a driver reads
  // and chooses by, and `=== 'Free'` loosened to a truthiness test badges every site that
  // publishes a price. Lift the campsite branch of the row builder out of app.js source and run
  // it, the way `field()` is lifted above: it depends only on `esc` and a `sub` array.
  {
    const rowBranch020 = new Function('s', 'esc',
      'var sub = [];\n' +
      appjs020.match(/if \(s\.source === 'campsite'\) \{[\s\S]*?\r?\n    \}\r?\n/)[0] +
      'return sub.join("");');
    const sub020 = (s) => rowBranch020(s, (x) => String(x));
    const badged = (s) => /<span>Free<\/span>/.test(sub020(Object.assign({ source: 'campsite' }, s)));
    const paying = [{ parking: 'Charges apply' }, { parking: 'GBP 20 per night' },
                    { parking: '£15 per pitch' }].filter(badged);
    ok('a campsite the source says you pay for never wears the Free badge on its row',
       paying.length === 0 && !badged({}) && badged({ parking: 'Free' }),
       paying.length
         ? paying.map(s => `parking=${JSON.stringify(s.parking)} wore the Free badge`).join(', ')
         : (!badged({ parking: 'Free' })
            ? 'a genuinely free site lost its badge'
            : 'a site carrying no fee at all wore the badge'));

    // The run that added `the access rule a campsite ships is the one its source published`
    // pinned the string `ACCESS_NOTE` writes and said plainly that the row drawing it was still
    // unwatched. This is that half, and it has a clause the fee badge does not: `access_note`
    // and `Free` share one `if / else if`, so the restriction OUTRANKS the badge on purpose.
    // Slip that `else` and a site OSM says needs a permit reads "Permit needed  Free" — two
    // answers to one question, on the line a driver chooses by. Drop the branch entirely and the
    // same site reads simply "Free", with nothing on the row saying the gate is shut.
    const restricted = (s) => sub020(Object.assign({ source: 'campsite' }, s));
    const shut = restricted({ access_note: 'Permit needed', parking: 'Free' });
    ok('a campsite restriction is drawn on its row, and outranks the Free badge',
       /<span class="row__closed">Permit needed<\/span>/.test(shut) &&
       !/<span>Free<\/span>/.test(shut) &&
       /<span class="row__closed">Customers only<\/span>/
         .test(restricted({ access_note: 'Customers only' })) &&
       /<span>Free<\/span>/.test(restricted({ parking: 'Free' })),
       !/row__closed">Permit needed/.test(shut)
         ? 'a site the source restricts says nothing about it on the row: ' + shut
         : (/<span>Free<\/span>/.test(shut)
            ? 'a restricted site wears the Free badge as well as its restriction: ' + shut
            : 'an unrestricted free site lost its badge'));

    // The third thing this branch draws, and the only one nothing has ever read: the
    // "Stay the Night" badge. It is not a translated field but a claim of MEMBERSHIP in
    // Forestry and Land Scotland's scheme, and OpenStreetMap publishes no such thing about
    // an ordinary campsite. Lose the `if` and all 3,574 campsite rows wear it, which invites
    // somebody to park overnight in a car park that is not in the scheme and is not theirs to
    // sleep in. Measured: with that condition dropped the whole suite still reported 267
    // passed, 0 failed -- the fee and access-note assertions above read their own substrings
    // and are blind to a badge appearing beside them.
    const stnRow = (s) => sub020(Object.assign({ source: 'campsite' }, s));
    const wearsStn = (s) => /<span class="row__badge">Stay the Night<\/span>/.test(stnRow(s));
    ok('only a Stay the Night car park wears the Stay the Night badge on its row',
       wearsStn({ stay_the_night: true }) &&
       !wearsStn({}) && !wearsStn({ parking: 'Free' }) &&
       !wearsStn({ access_note: 'Customers only' }),
       !wearsStn({ stay_the_night: true })
         ? 'a real Stay the Night car park lost its badge: ' + stnRow({ stay_the_night: true })
         : 'an ordinary campsite claims to be in the Stay the Night scheme: ' +
           [{}, { parking: 'Free' }, { access_note: 'Customers only' }]
             .filter(wearsStn).map(s => JSON.stringify(s)).join(', '));
  }

  // `vehicles` has the same two halves the fee and the access note had, and only the parser
  // half is watched: `a vehicle the source says the site does NOT take is never listed as one`
  // pins what parse_campsites.py writes. Nothing read the line that puts it on the SHEET, which
  // is the one field this whole tab exists for -- "can I get a van in". A `Takes` row naming a
  // vehicle the source never published is #2's own failure, stated on the screen a driver reads
  // before committing to the drive. Lift the campsite branch of openSheet out of app.js source
  // and run it: it depends only on `field`, which is already lifted above.
  {
    const sheetCamp020 = new Function('site', 'field',
      "var h = '';\n" +
      appjs020.match(/ {2}if \(site\.source === 'campsite'\) \{[\s\S]*?\r?\n {2}\}/)[0] +
      '\nreturn h;');
    const takes = (s) => {
      const m = /<dt>Takes<\/dt><dd[^>]*>([^<]*)<\/dd>/
        .exec(sheetCamp020(Object.assign({ source: 'campsite' }, s), field020));
      return m ? m[1] : null;
    };
    const only = takes({ vehicles: ['motorhomes'] });
    const all = takes({ vehicles: ['caravans', 'motorhomes', 'tents'] });
    ok('the detail sheet names the vehicles the source published, and no others',
       only === 'motorhomes' && all === 'caravans, motorhomes, tents' &&
       takes({}) === 'Not stated',
       `a site published as motorhomes-only reads "${only}", ` +
       `a site published as all three reads "${all}", ` +
       `a site the source is silent on reads "${takes({})}"`);

    // The other half of that same branch, and the last line in it nothing has ever read: the
    // `Access` row. `the access rule a campsite ships is the one its source published` pins the
    // string ACCESS_NOTE writes, and `a campsite restriction is drawn on its row, and outranks
    // the Free badge` pins the LIST ROW. Neither reaches the SHEET, which is the screen a
    // reader opens to decide whether the drive is worth making. Measured: with this line
    // collapsed to `if (false)` the whole suite still reported 269 passed, 0 failed, and every
    // restricted campsite's sheet went silent about the gate while its `Charges` row still
    // read `Free`. It also carries #7: a Stay the Night car park's `access_note` is where the
    // self-contained-vehicle rule reaches this sheet as a field of its own.
    const access = (s) => {
      const m = /<dt>Access<\/dt><dd[^>]*>([^<]*)<\/dd>/
        .exec(sheetCamp020(Object.assign({ source: 'campsite' }, s), field020));
      return m ? m[1] : null;
    };
    const permit = access({ access_note: 'Permit needed', parking: 'Free' });
    const selfContained = access({ stay_the_night: true, access_note: 'Self-contained vehicles only' });
    ok('the detail sheet states a published access restriction, and invents none',
       permit === 'Permit needed' &&
       selfContained === 'Self-contained vehicles only' &&
       access({}) === null && access({ parking: 'Free' }) === null,
       permit !== 'Permit needed'
         ? `a site the source restricts reads its access as ${JSON.stringify(permit)}`
         : (selfContained !== 'Self-contained vehicles only'
            ? `a Stay the Night car park reads its access as ${JSON.stringify(selfContained)}`
            : `a site the source is silent on invents an access rule: ` +
              JSON.stringify(access({}) || access({ parking: 'Free' }))));
  }

  // `More` is a link, and its LABEL is a claim about who published the page behind it. A
  // campsite's website is whatever OpenStreetMap holds for it, so "Forestry England page" over
  // one states a relationship no source ever published -- #2's own failure, on the single field
  // a reader taps to check the place out before driving. Nothing read those four lines: with the
  // campsite branch deleted every one of the other 266 assertions reports PASS while all 3,574
  // campsite websites read as Forestry England's. Lift the block out of app.js source and run
  // it, the way `field()` and the `Takes` row above are, because it depends on `field` and `esc`
  // alone. Same coupling those two carry and name: the regex is anchored on the block's opening
  // line and its two-space closing brace, so re-indenting it makes the suite throw, not fail.
  {
    const esc020 = new Function(
      appjs020.match(/function esc\(s\) \{[\s\S]*?\r?\n\}\r?\n/)[0] + 'return esc;')();
    const more020 = new Function('site', 'moreHref', 'field', 'esc',
      "var h = '';\n" +
      appjs020.match(/ {2}if \(moreHref\) \{[\s\S]*?\r?\n {2}\}\r?\n/)[0] +
      'return h;');
    const link = (s, url) => {
      const m = /<a href="([^"]*)"[^>]*>([^<]*)<\/a>/.exec(more020(s, url, field020, esc020));
      return m ? { href: m[1], text: m[2] } : { href: null, text: null };
    };
    const osm = link({ source: 'campsite' }, 'https://www.wildrosepark.co.uk/pitches');
    const stn = link({ source: 'campsite', stay_the_night: true },
                     'https://forestryandland.gov.scot/visit/stay-the-night');
    const fe = link({ source: 'forest' }, 'https://www.forestryengland.uk/bedgebury');
    ok('a campsite website is labelled by its own host, never as a Forestry England page',
       osm.text === 'wildrosepark.co.uk' &&
       stn.text === 'Forestry and Land Scotland page' &&
       fe.text === 'Forestry England page' &&
       osm.href === 'https://www.wildrosepark.co.uk/pitches',
       `an OpenStreetMap website reads "${osm.text}" and points at "${osm.href}", ` +
       `a Stay the Night car park reads "${stn.text}", ` +
       `a Forestry England forest reads "${fe.text}"`);
  }

  // Acceptance #3, on the one screen a reader actually looks a place up on. Every other
  // licence assertion on this card watches an artefact that travels whole: the footer, the
  // map pill, the campsites.json header, the Shortcut endpoint. The detail sheet is the
  // per-record notice, and it is the only place the credit sits beside the record it is
  // about. It also carries a clause the footer does not: it must NOT appear on a Stay the
  // Night car park, whose data is Forestry and Land Scotland's, not OpenStreetMap's --
  // crediting OSM there states a provenance no source published, which is #2's failure.
  // Measured: with the whole block collapsed to `if (false)` the suite still reported 268
  // passed, 0 failed, and every one of the 3,574 ODbL records lost its notice in silence.
  // Anchored on the tail of openSheet rather than on the `if` itself, so a deleted or
  // disabled condition fails this assertion instead of making the regex throw.
  {
    const credit020 = new Function('site', 'field', 'NF', 'CAMP',
      "var h = '';\n" +
      appjs020.match(/ {2}h \+= field\('Data checked'[\s\S]*?\r?\n(?= {2}\$\('#sheet-body'\))/)[0] +
      'return h;');
    const sourceRow = (s) => {
      const m = /<dt>Source<\/dt><dd[^>]*>([^<]*)<\/dd>/.exec(credit020(s, field020, NF, null));
      return m ? m[1] : null;
    };
    const osmRec = sourceRow({ source: 'campsite' });
    const stnRec = sourceRow({ source: 'campsite', stay_the_night: true });
    const forestRec = sourceRow({ source: 'forest' });
    ok('the detail sheet credits OpenStreetMap on an ODbL record, and on no other',
       osmRec === 'OpenStreetMap contributors, ODbL' &&
       stnRec === null && forestRec === null,
       osmRec !== 'OpenStreetMap contributors, ODbL'
         ? `an OpenStreetMap campsite reads its source as ${JSON.stringify(osmRec)}`
         : `a Stay the Night car park reads ${JSON.stringify(stnRec)} and a forest ` +
           `reads ${JSON.stringify(forestRec)}, crediting OSM for data it never published`);
  }

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
  ok('provider attribution is present', /Thunderforest.*OpenStreetMap/.test(
     fs.readFileSync(path.join(ROOT, 'app', 'core.js'), 'utf8')));
  // The attribution is a licence obligation, so it must appear with the layer it
  // credits and be readable against a light basemap while it does. Card 0015.
  // Card 0020 moved the wording decision into core.js so it can be asserted by
  // behaviour rather than by matching the line that writes it.
  ok('the map asks core.js what the hint should say',
     /NF\.mapHint\(tilesOn,/.test(map));
  ok('the hint gets its solid backing exactly when it is a credit',
     /hint\.classList\.toggle\('map__hint--attrib', h\.credit\)/.test(map));
  ok('with the layer on the hint credits the tile provider',
     NF.mapHint(true, false).credit &&
     /Thunderforest/.test(NF.mapHint(true, false).text));
  // With tiles OFF the map still draws every campsite marker, and those markers
  // ARE the ODbL database. Card 0015's pill credits Thunderforest and hides with
  // the layer, so it does not discharge this obligation. Card 0020.
  ok('with the layer off the OSM markers still carry their credit',
     NF.mapHint(false, true).credit &&
     /OpenStreetMap/.test(NF.mapHint(false, true).text) &&
     !/Thunderforest/.test(NF.mapHint(false, true).text));
  ok('a map with no OSM markers and no tiles keeps the plain hint',
     !NF.mapHint(false, false).credit &&
     !/OpenStreetMap/.test(NF.mapHint(false, false).text));
  ok('the map recomputes the hint when the list it draws changes',
     /refresh: function \(\) \{ if \(open\) \{ updateHint\(\);/.test(map));
  // The three assertions above prove NF.mapHint, which is a pure function the suite calls
  // itself, and `the map asks core.js what the hint should say` only greps `NF.mapHint(tilesOn,`
  // — so the SECOND argument is unwatched. Hardcode it to false and every one of them stays
  // green while the Campsites tab draws 3,574 ODbL markers under the plain hint, with tiles
  // off and no credit anywhere on the map. That is #3's own failure. Run the real updateHint
  // out of map.js source over a stub hint element, the way field() is lifted out of app.js
  // above, so what is asserted is the decision and not the spelling of the call.
  {
    const make020 = new Function('document', 'hooks', 'tilesOn', 'NF',
      map.match(/function updateHint\(\) \{[\s\S]*?\r?\n  \}\r?\n/)[0] + 'return updateHint;');
    const run = (tilesOn, drawn) => {
      const el = { textContent: '', attrib: null,
                   classList: { toggle: (c, on) => { el.attrib = on; } } };
      make020({ getElementById: id => (id === 'map-hint' ? el : null) },
              { getSites: () => drawn }, tilesOn, NF)();
      return el;
    };
    const forest = { source: 'forest' }, camp = { source: 'campsite' };
    const withCamps = run(false, [forest, camp]), forestsOnly = run(false, [forest]);
    ok('the map reads its own markers to decide whether OpenStreetMap needs crediting',
       /OpenStreetMap/.test(withCamps.textContent) && withCamps.attrib === true &&
       !/OpenStreetMap/.test(forestsOnly.textContent) && forestsOnly.attrib === false,
       `campsites drawn: "${withCamps.textContent}" | forests only: "${forestsOnly.textContent}"`);
  }
  {
    const css = fs.readFileSync(path.join(ROOT, 'app', 'app.css'), 'utf8');
    const attrib = /\.map__hint--attrib \{([^}]*)\}/.exec(css);
    ok('the attribution style exists and is opaque enough to read on white', !!attrib &&
       /background:rgba\(0,0,0,\.(7[2-9]|[89]\d)\)/.test(attrib[1]) && /color:#fff/.test(attrib[1]));
    // Both states share .map__hint, so one bottom rule keeps both off the home bar.
    ok('the hint clears the safe-area inset in both states',
       /\.map__hint \{[^}]*bottom:calc\(var\(--safe-b\)/.test(css) && !/bottom:/.test(attrib[1]));
  }

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
  // Two publishing agencies since card 0016, so two hosts. The set stays closed: an
  // href in the detail sheet may only reach the site the record was scraped from.
  const offSite = DATA.sites.filter(s => s.url != null &&
    !/^https:\/\/(www\.)?forestryengland\.uk\//.test(s.url) &&
    !/^https:\/\/forestryandland\.gov\.scot\//.test(s.url));
  ok('every dataset url survives safeHref', badUrls.length === 0,
     badUrls.slice(0, 3).map(s => s.id).join(', '));
  ok('every dataset url is on a publishing agency host', offSite.length === 0,
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

  // Attribution is a licence condition rather than a courtesy, and there are now two
  // agencies to name. Adding a name also means extending the non-affiliation line:
  // naming somebody without it is what implies an endorsement.
  ok('the footer credits both forest agencies',
     /Forestry England/.test(indexhtml) && /Forestry and\s+Land Scotland/.test(indexhtml));
  ok('the footer disclaims affiliation with both',
     /not affiliated with Forestry England or with Forestry and\s+Land Scotland/.test(indexhtml));

  // Card 0019. Two obligations, so two separate strings, checked against a
  // whitespace-flattened copy so re-wrapping the paragraph cannot break the test.
  // OGL v3 says to use the provider's own attribution statement where one is published.
  // Forestry England publish one (DECISIONS 2026-08-15), so the generic "contains public
  // sector information" line is no longer the right credit for their data -- it is the
  // fallback, and it still covers the car park dataset, which is a separate source.
  const flat = indexhtml.replace(/\s+/g, ' ');
  ok("the footer uses Forestry England's own published attribution wording",
     flat.includes('Crown Copyright, courtesy Forestry England, licensed under the Open Government Licence'));
  ok('the footer credits the Open Government Licence for the car park data',
     flat.includes('Car park details contain public sector information licensed under the Open Government Licence v3.0'));
  // The app is public and heading for a store listing, so a personal-use claim states a
  // licence basis that does not match what is happening. OGL is the real basis.
  ok('the footer makes no personal-use claim', !/personal use/i.test(indexhtml));

  // Card 0022. The car park dataset does publish its own attribution statement, in
  // copyrightText on the FeatureServer (DECISIONS 2026-08-15), so the same rule 0019
  // applied to Forestry England applies here: the licence alone is not the credit.
  // The (c) symbol is left out of the match on purpose -- HTML has two spellings of it
  // and neither one is the obligation; the holder's name and the statement are.
  ok('the footer names the copyright holder of the car park data',
     flat.includes('Forestry Commission copyright and/or database right 2025. All rights reserved.'));
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
  // Card 0020 #3 asks for three things and the assertion above proves two of them: the
  // credit and the licence name. Its third is "link to openstreetmap.org/copyright", and
  // a substring match cannot tell a link from a printed URL -- write the address out as
  // plain text in the footer and that check stays green while nothing is tappable. On a
  // phone, and on an app whose whole point is having no keyboard-and-address-bar moment,
  // an unclickable URL does not discharge the obligation. So this pins the anchor.
  ok('the OpenStreetMap credit is a real link, not a printed URL',
     /<a\s[^>]*href="https:\/\/(www\.)?openstreetmap\.org\/copyright"/.test(html));
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

console.log('');
console.log('--- staleness: scraped_at is the fetch date, not the parse date (card 0026) ---');
{
  // The pipeline is Python and this suite is node, so these three drive the real
  // scripts/fetch.py and scripts/parse.py in a throwaway tree. Nothing here touches
  // data/raw/ or app/data/sites.json: the fixture is synthetic and lives in a temp
  // directory, so the suite cannot overwrite the committed dataset or cost a request.
  const osmod = require('os');
  const { spawnSync } = require('child_process');
  const PY = process.env.PYTHON || 'python';
  // No .pyc, or running the suite litters scripts/ with an untracked __pycache__.
  const PYENV = Object.assign({}, process.env, { PYTHONDONTWRITEBYTECODE: '1' });
  const tmp = fs.mkdtempSync(path.join(osmod.tmpdir(), 'nf-0026-'));
  const write = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
  // Each stub run reports the day its own clock was on; this reads it back (card 0030).
  const dayOf = (r) => ((r && r.stdout) || '').trim().split('\n').pop().trim();

  try {
    // ---- #1: the fetcher records a download date for each page it writes.
    // requests.get is stubbed, so this downloads nothing; what is checked is the
    // artefact left beside the cached HTML.
    const raw1 = path.join(tmp, 'raw1');
    const stub = [
      'import importlib.util, os, sys',
      'raw = sys.argv[1]',
      'spec = importlib.util.spec_from_file_location("nf_fetch", os.path.join("scripts", "fetch.py"))',
      'm = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)',
      'm.RAW = raw',
      'm.PAGES = os.path.join(raw, "pages")',
      'm.FLS_DIR = os.path.join(raw, "fls")',
      'm.FLS_PAGES = os.path.join(m.FLS_DIR, "pages")',
      'm.DELAY = 0',
      'os.makedirs(m.PAGES, exist_ok=True); os.makedirs(m.FLS_PAGES, exist_ok=True)',
      'class R:',
      '    text = "<html>a page</html>"',
      '    encoding = "utf-8"',
      '    def raise_for_status(self): pass',
      'm.get = lambda url, **kw: R()',
      'm.requests.get = lambda url, **kw: R()',
      'n = sys.argv[2]',
      'print(m.fetch_page({"slug": "a-forest" + n, "url": "https://www.forestryengland.uk/x"}, 0, 1))',
      'print(m.fetch_fls_page({"slug": "a-glen" + n, "url": "https://forestryandland.gov.scot/visit/destinations/x"}))',
      // Last line, and the whole point of card 0030: the expected date comes from the
      // fetcher's own clock, in the process that just wrote the index, rather than from
      // node. node has only toISOString(), which is UTC, and the fetcher stamps the LOCAL
      // date, so between local midnight and 01:00 under BST the two named different days
      // and this test went red for an hour a night with nothing broken. Reading it here
      // also kills the midnight straddle: no gap for the day to turn in.
      'print(m.date.today().isoformat())',
    ].join('\n');
    // Twice, in two processes, because the fetcher is resumable: the second run must add
    // to the index rather than replace it, or every page fetched before today loses its
    // date the next time somebody resumes an interrupted scrape.
    const r1 = spawnSync(PY, ['-c', stub, raw1, ''], { cwd: ROOT, encoding: 'utf8', env: PYENV });
    const r1b = spawnSync(PY, ['-c', stub, raw1, '-2'], { cwd: ROOT, encoding: 'utf8', env: PYENV });
    // Either run's day is acceptable, because the two are separate processes and midnight
    // can fall between them. In every ordinary run they are the same date.
    const days = [...new Set([dayOf(r1), dayOf(r1b)])].filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
    const idxPath = path.join(raw1, 'fetched.json');
    const wroteHtml = fs.existsSync(path.join(raw1, 'pages', 'a-forest.html')) &&
                      fs.existsSync(path.join(raw1, 'fls', 'pages', 'a-glen.html'));
    let idx = null;
    if (fs.existsSync(idxPath)) { try { idx = JSON.parse(fs.readFileSync(idxPath, 'utf8')); } catch (e) { idx = null; } }
    const want = ['pages/a-forest.html', 'pages/a-forest-2.html',
                  'fls/pages/a-glen.html', 'fls/pages/a-glen-2.html'];
    ok('fetch records a download date alongside every cached page',
       wroteHtml && idx !== null && days.length > 0 && want.every(k => days.includes(idx[k])),
       !wroteHtml ? `the stub fetch wrote no page: ${(r1.stderr || '').trim().split('\n').slice(-3).join(' / ')}`
       : idx === null ? 'the fetcher wrote the pages but left no data/raw/fetched.json to read a date back from'
       : !days.length ? 'the stub ran but never reported the fetcher\'s own date, so there is nothing sound to compare against'
       : `fetched.json = ${JSON.stringify(idx)}, wanted all four pages dated ${days.join(' or ')}`);

    // ---- #2 and #3: the parser reads that date back, per page.
    // A copy of parse.py in a fixture tree, because parse.py derives its ROOT from
    // its own location, and the three dates differ from each other and from today.
    const fx = path.join(tmp, 'fixture');
    const FE_DATE = '2026-08-08', FLS_DATE = '2026-08-20', CP_DATE = '2026-08-25';
    fs.mkdirSync(path.join(fx, 'scripts'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'scripts', 'parse.py'), path.join(fx, 'scripts', 'parse.py'));
    const rawf = path.join(fx, 'data', 'raw');
    write(path.join(rawf, 'index.json'), JSON.stringify([{
      id: '1', name: 'Test Forest', slug: 'test-forest',
      url: 'https://www.forestryengland.uk/test-forest', lat: 51.0, lng: -1.0 }]));
    write(path.join(rawf, 'pages', 'test-forest.html'), '<html><body>Test Forest</body></html>');
    write(path.join(rawf, 'fls', 'index.json'), JSON.stringify([{
      slug: 'test-glen', name: 'Test Glen',
      url: 'https://forestryandland.gov.scot/visit/destinations/test-glen', lat: 56.5, lng: -4.0 }]));
    write(path.join(rawf, 'fls', 'pages', 'test-glen.html'), '<html><body>Test Glen</body></html>');
    write(path.join(rawf, 'carparks.json'), JSON.stringify({ features: [{
      attributes: { OBJECTID: 1, asset_name: 'Beacon Hill', category: 'Car Parks',
                    area_asset_type: 'Gravel', status: 'Permanent - Official', cots_district_id: 'X' },
      centroid: { x: -1.1, y: 51.1 } }] }));
    const dated = {
      'pages/test-forest.html': FE_DATE,
      'fls/pages/test-glen.html': FLS_DATE,
      'carparks.json': CP_DATE,
    };
    write(path.join(rawf, 'fetched.json'), JSON.stringify(dated));

    const runParse = () => spawnSync(PY, [path.join(fx, 'scripts', 'parse.py')],
                                     { cwd: fx, encoding: 'utf8', env: PYENV });
    const r2 = runParse();
    const outPath = path.join(fx, 'app', 'data', 'sites.json');
    let built = null;
    if (r2.status === 0 && fs.existsSync(outPath)) built = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    const stamp = (id) => built && (built.sites.find(s => s.id === id) || {}).scraped_at;
    ok("scraped_at is the page's download date, not the parse date",
       !!built && stamp('fe-test-forest') === FE_DATE && stamp('fls-test-glen') === FLS_DATE &&
       stamp('cp-1') === CP_DATE,
       !built ? `parse.py exited ${r2.status}: ${(r2.stdout || '').trim().split('\n').slice(-4).join(' / ')}`
       : `England ${stamp('fe-test-forest')} (wanted ${FE_DATE}), Scotland ${stamp('fls-test-glen')} ` +
         `(wanted ${FLS_DATE}), car park ${stamp('cp-1')} (wanted ${CP_DATE}); today is ${days[0] || '?'}`);

    // The migration case, and the one that must never be papered over: data/raw/ is
    // gitignored, so every page cached before this change carries no date and its age
    // is unknowable. Stamping today would be the original bug wearing a new coat.
    delete dated['pages/test-forest.html'];
    write(path.join(rawf, 'fetched.json'), JSON.stringify(dated));
    const r3 = runParse();
    const said = ((r3.stdout || '') + (r3.stderr || '')).includes('pages/test-forest.html');
    ok('parse fails loudly on a cached page with no download date',
       r3.status !== 0 && said,
       r3.status === 0 ? 'parse.py exited 0 on a page with no recorded download date'
                       : `exited ${r3.status} but never named pages/test-forest.html`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

console.log('');
console.log('--- a refused dataset does not overwrite the last good one (card 0029) ---');
{
  // Both parsers used to write their file and check `problems` afterwards, so a build
  // that judged the dataset untrustworthy had already replaced the committed copy with
  // it. Measured on 2026-09-05: parse.py exited 1 as it should and left 1,180 records
  // reading "scraped_at": null in app/data/sites.json.
  //
  // Same fixture discipline as the staleness block above: a copy of each parser in a
  // throwaway tree with a synthetic data/raw/. Running a deliberately failing parser
  // against the real tree is the exact fault under test.
  const osmod = require('os');
  const { spawnSync } = require('child_process');
  const PY = process.env.PYTHON || 'python';
  const PYENV = Object.assign({}, process.env, { PYTHONDONTWRITEBYTECODE: '1' });
  const tmp = fs.mkdtempSync(path.join(osmod.tmpdir(), 'nf-0029-'));
  const write = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
  const tail = (r) => ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-3).join(' / ');

  try {
    // ---- parse.py -------------------------------------------------------------
    const fx = path.join(tmp, 'forests');
    fs.mkdirSync(path.join(fx, 'scripts'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'scripts', 'parse.py'), path.join(fx, 'scripts', 'parse.py'));
    const rawf = path.join(fx, 'data', 'raw');
    write(path.join(rawf, 'index.json'), JSON.stringify([{
      id: '1', name: 'Test Forest', slug: 'test-forest',
      url: 'https://www.forestryengland.uk/test-forest', lat: 51.0, lng: -1.0 }]));
    write(path.join(rawf, 'pages', 'test-forest.html'), '<html><body>Test Forest</body></html>');
    write(path.join(rawf, 'fls', 'index.json'), JSON.stringify([{
      slug: 'test-glen', name: 'Test Glen',
      url: 'https://forestryandland.gov.scot/visit/destinations/test-glen', lat: 56.5, lng: -4.0 }]));
    write(path.join(rawf, 'fls', 'pages', 'test-glen.html'), '<html><body>Test Glen</body></html>');
    write(path.join(rawf, 'carparks.json'), JSON.stringify({ features: [{
      attributes: { OBJECTID: 1, asset_name: 'Beacon Hill', category: 'Car Parks',
                    area_asset_type: 'Gravel', status: 'Permanent - Official', cots_district_id: 'X' },
      centroid: { x: -1.1, y: 51.1 } }] }));
    const dated = {
      'pages/test-forest.html': '2026-08-08',
      'fls/pages/test-glen.html': '2026-08-20',
      'carparks.json': '2026-08-25',
    };
    write(path.join(rawf, 'fetched.json'), JSON.stringify(dated));

    const runParse = () => spawnSync(PY, [path.join(fx, 'scripts', 'parse.py')],
                                     { cwd: fx, encoding: 'utf8', env: PYENV });
    const outPath = path.join(fx, 'app', 'data', 'sites.json');

    const clean = runParse();
    let built = null;
    if (fs.existsSync(outPath)) { try { built = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch (e) { built = null; } }
    ok('a clean parse still writes the dataset',
       clean.status === 0 && !!built && built.sites.length === 3 &&
       ['fe-test-forest', 'fls-test-glen', 'cp-1'].every(id => built.sites.some(s => s.id === id)),
       !built ? `parse.py exited ${clean.status} and wrote no dataset: ${tail(clean)}`
              : `exited ${clean.status}, wrote ${built.sites.length} sites: ` +
                built.sites.map(s => s.id).join(', '));
    const before = built ? fs.readFileSync(outPath) : null;

    // Acceptance #4 of card 0020: two files, "each carrying its own licence statement".
    // The ODbL half is pinned on the PARSER (`every campsite file the parser writes
    // carries the full ODbL notice`); the OGL half was pinned only on the file already
    // committed here (`attribution present`, above). So deleting the attribution line
    // from parse.py runs fully green -- and the real pipeline is red on purpose pending
    // a re-fetch, so no rebuild would surface it for weeks. A copy of sites.json travels
    // without index.html's footer, and the Collective Database argument rests on each
    // file naming its own licence, so the statement belongs to the parser.
    ok('every OGL file the parser writes carries its own licence statement',
       !!built && /Open Government Licence/.test(built.attribution || ''),
       !built ? 'the clean parse wrote no dataset'
              : `attribution=${JSON.stringify(built.attribution)}`);

    // Break it the way the real tree broke: a cached page with no recorded download
    // date. Refusing that is correct (card 0026). Refusing it after overwriting the
    // last good file is not.
    delete dated['pages/test-forest.html'];
    write(path.join(rawf, 'fetched.json'), JSON.stringify(dated));
    const bad = runParse();
    const after = fs.existsSync(outPath) ? fs.readFileSync(outPath) : null;
    ok('a failed parse leaves the previous dataset untouched',
       bad.status !== 0 && before !== null && after !== null && before.equals(after),
       bad.status === 0 ? `parse.py exited 0 on a page with no download date: ${tail(bad)}`
       : after === null ? 'parse.py exited non-zero and deleted the previous dataset'
       : !before.equals(after)
         ? `parse.py exited ${bad.status} but had already replaced sites.json ` +
           `(${before.length} bytes -> ${after.length} bytes)`
         : 'no clean dataset to compare against');

    // ---- parse_campsites.py ---------------------------------------------------
    const cx = path.join(tmp, 'campsites');
    fs.mkdirSync(path.join(cx, 'scripts'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'scripts', 'parse_campsites.py'),
                    path.join(cx, 'scripts', 'parse_campsites.py'));
    const craw = path.join(cx, 'data', 'raw');
    const goodEl = { type: 'node', id: 1, lat: 54.0, lon: -2.0,
                     tags: { name: 'Test Campsite', tourism: 'camp_site', caravans: 'yes' } };
    const writeOsm = (el, sctEl) => {
      const body = (els) => JSON.stringify({ osm3s: { timestamp_osm_base: '2026-08-15T00:00:00Z' },
                                             elements: els });
      write(path.join(craw, 'osm', 'campsites-gb-eng.json'), body([].concat(el)));
      write(path.join(craw, 'osm', 'campsites-gb-sct.json'), body([].concat(sctEl || [])));
      write(path.join(craw, 'osm', 'campsites-gb-wls.json'), body([]));
    };
    writeOsm(goodEl);
    write(path.join(craw, 'fls', 'stay-the-night.json'), JSON.stringify([{
      slug: 'test-stn', name: 'Test Car Park',
      url: 'https://forestryandland.gov.scot/visit/x', lat: 56.0, lng: -4.5 }]));

    const runCamp = () => spawnSync(PY, [path.join(cx, 'scripts', 'parse_campsites.py')],
                                    { cwd: cx, encoding: 'utf8', env: PYENV });
    const cOut = path.join(cx, 'app', 'data', 'campsites.json');

    // Acceptance #4 of card 0020, and the one thing on that card that is a licence
    // boundary rather than a modelling choice: the OGL and ODbL databases must stay in
    // two files. The only guard was `the OGL file holds no campsite record`, which reads
    // the sites.json ALREADY COMMITTED here -- so a parse_campsites.py that appended its
    // records to sites.json would run fully green until somebody rebuilt and committed
    // the result, which is exactly the "tidy the two files into one" change the card
    // forbids. This puts an OGL file in the temp tree and requires the campsite build to
    // leave it alone, byte for byte.
    const cSites = path.join(cx, 'app', 'data', 'sites.json');
    write(cSites, JSON.stringify({
      generated_at: '2026-08-29',
      attribution: 'Contains public sector information licensed under the Open Government Licence v3.0.',
      sites: [{ id: 'fe-test', name: 'Test Forest', source: 'forest',
                country: 'England', lat: 54.0, lng: -2.0 }] }));
    const oglBefore = fs.readFileSync(cSites);

    const cClean = runCamp();
    const cBefore = fs.existsSync(cOut) ? fs.readFileSync(cOut) : null;

    const oglAfter = fs.existsSync(cSites) ? fs.readFileSync(cSites) : null;
    ok('a campsite build never writes into the OGL file',
       cClean.status === 0 && oglAfter !== null && oglBefore.equals(oglAfter),
       cClean.status !== 0 ? `the clean run exited ${cClean.status}: ${tail(cClean)}`
       : oglAfter === null ? 'parse_campsites.py deleted app/data/sites.json'
       : 'parse_campsites.py rewrote app/data/sites.json, merging two licences into one file ' +
         `(${oglBefore.length} bytes -> ${oglAfter.length} bytes)`);

    // An unprojected coordinate, which is what the Great Britain box exists to catch.
    writeOsm(Object.assign({}, goodEl, { lat: 12.3 }));
    const cBad = runCamp();
    const cAfter = fs.existsSync(cOut) ? fs.readFileSync(cOut) : null;
    ok('a failed campsite parse leaves the previous dataset untouched',
       cClean.status === 0 && cBad.status !== 0 &&
       cBefore !== null && cAfter !== null && cBefore.equals(cAfter),
       cBefore === null ? `the clean run wrote no campsites.json (exit ${cClean.status}): ${tail(cClean)}`
       : cClean.status !== 0 ? `the clean run exited ${cClean.status}: ${tail(cClean)}`
       : cBad.status === 0 ? `parse_campsites.py exited 0 on a coordinate outside Great Britain: ${tail(cBad)}`
       : cAfter === null ? 'parse_campsites.py exited non-zero and deleted the previous dataset'
       : `parse_campsites.py exited ${cBad.status} but had already replaced campsites.json ` +
         `(${cBefore.length} bytes -> ${cAfter.length} bytes)`);

    // Acceptance #5 of card 0020 says "a record's COORDINATES", and a coordinate is two
    // numbers. Every check on this card watches the latitude: the run above feeds lat 12.3,
    // and the far-north run below proves the lat box is not too tight. Delete the LNG_RANGE
    // branch from validate() in parse_campsites.py and the whole suite stays green, because
    // nothing anywhere feeds a longitude outside the box. It is not hypothetical: an
    // Overpass area id that resolves to the wrong relation returns continental Europe at
    // perfectly British latitudes, which the lat box waves straight through.
    writeOsm(Object.assign({}, goodEl, { lon: 10.0 }));
    const cEast = runCamp();
    const cEastAfter = fs.existsSync(cOut) ? fs.readFileSync(cOut) : null;
    ok('a longitude outside Great Britain fails the build as well as a latitude',
       cEast.status !== 0 && cEastAfter !== null && cBefore !== null &&
       cBefore.equals(cEastAfter),
       cEast.status === 0
         ? `parse_campsites.py exited 0 on lng 10.0, which is Germany: ${tail(cEast)}`
         : cEastAfter === null ? 'parse_campsites.py exited non-zero and deleted the dataset'
         : 'parse_campsites.py exited non-zero but had already replaced campsites.json');

    // Acceptance #6 of card 0020, the half the shipped file cannot prove: "say not known
    // for every field the source is silent on". Null renders as "not known"; an empty or
    // whitespace-only string renders as blank space, which reads as a published answer.
    // OSM is edited by anybody and does carry empty tag values, so the parser has to
    // normalise them. Today's extract happens to hold none, so a check over the shipped
    // file would be green from birth -- this feeds the parser the tags instead.
    // `fee` is the one of these that does NOT go through tag(): fee_text() passes an
    // unrecognised value straight through as published, because plenty of records carry
    // an actual price. A blank one therefore reaches the file as a blank string and the
    // sheet draws an empty line under "Charges", which reads as "free".
    writeOsm(Object.assign({}, goodEl, { tags: Object.assign({}, goodEl.tags, {
      'addr:postcode': '  ', opening_hours: '', operator: ' ', phone: '\t',
      'addr:street': '  ', website: '', fee: '  ' }) }));
    const cBlank = runCamp();
    let blankRec = null;
    if (cBlank.status === 0 && fs.existsSync(cOut)) {
      try { blankRec = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites
                          .find(s => s.id === 'os-n1'); } catch (e) { blankRec = null; }
    }
    const blankKeys = ['postcode_satnav', 'opening_times', 'operator', 'phone',
                       'address', 'url', 'access_note', 'parking'];
    ok('a blank OSM tag becomes null, never an empty string',
       !!blankRec && blankKeys.every(k => blankRec[k] == null ||
                                          (typeof blankRec[k] === 'string' &&
                                           blankRec[k] === blankRec[k].trim() &&
                                           blankRec[k].length > 0)),
       !blankRec ? `the blank-tag run exited ${cBlank.status} and wrote no os-n1: ${tail(cBlank)}`
                 : blankKeys.filter(k => typeof blankRec[k] === 'string' &&
                                         (!blankRec[k].trim() || blankRec[k] !== blankRec[k].trim()))
                            .map(k => `${k}=${JSON.stringify(blankRec[k])}`).join(', '));

    // Acceptance #2 of card 0020: "state ONLY what its source publishes". `facilities` is
    // the one campsite field that is a list of positive claims -- the sheet draws each as a
    // chip reading "toilets", "drinking water", "chemical disposal" -- and nothing anywhere
    // in this suite reads it. FACILITY_TAGS in parse_campsites.py pairs each OSM key with
    // the values that mean yes, and that pairing is the whole guarantee: relax it to a
    // truthiness test and `toilets=no` becomes a "toilets" chip, because "no" is a
    // non-empty string. That states the OPPOSITE of what OSM publishes, on the field a
    // campervanner picks a site by. Measured: with `in good` replaced by a truthiness test
    // the whole suite passed, 255 of 255. Today's extract carries the correct chips, so an
    // assertion over the shipped file would be green from birth; this feeds the parser a
    // site that publishes "no" to everything.
    const facsNo = { type: 'node', id: 30, lat: 55.1, lon: -3.1, tags: {
      name: 'Bare Field', tourism: 'camp_site', caravans: 'yes',
      toilets: 'no', shower: 'no', drinking_water: 'no', power_supply: 'no',
      sanitary_dump_station: 'no', waste_disposal: 'no', internet_access: 'no',
      laundry: 'no', bbq: 'no', openfire: 'no', dog: 'no' } };
    const facsYes = { type: 'node', id: 31, lat: 55.2, lon: -3.2, tags: {
      name: 'Full Facilities Park', tourism: 'camp_site', caravans: 'yes',
      toilets: 'yes', shower: 'hot', drinking_water: 'yes', dog: 'leashed' } };
    writeOsm([goodEl, facsNo, facsYes]);
    const cFacs = runCamp();
    let facsRecs = null;
    if (cFacs.status === 0 && fs.existsSync(cOut)) {
      try {
        const all = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites;
        facsRecs = { no: all.find(s => s.id === 'os-n30'), yes: all.find(s => s.id === 'os-n31') };
      } catch (e) { facsRecs = null; }
    }
    // compact() drops an empty list before writing, so "no facilities" is an ABSENT key
    // rather than an empty array. DATA-MODEL states that contract; both readings are
    // accepted here so this assertion fails on the chips and not on the encoding.
    const wantYes = ['toilets', 'showers', 'drinking water', 'dogs welcome'];
    const facsOf = (r) => (r && r.facilities) || [];
    ok('a facility the source says the site has NOT is never listed as one',
       !!facsRecs && !!facsRecs.no && !!facsRecs.yes &&
       facsOf(facsRecs.no).length === 0 &&
       wantYes.every(f => facsOf(facsRecs.yes).includes(f)),
       !facsRecs || !facsRecs.no || !facsRecs.yes
         ? `the run exited ${cFacs.status} and wrote no os-n30/os-n31: ${tail(cFacs)}`
       : facsOf(facsRecs.no).length
         ? 'a site publishing "no" to every facility was listed as having: ' +
           facsOf(facsRecs.no).join(', ')
         : 'a site publishing these facilities lost them: ' +
           wantYes.filter(f => !facsOf(facsRecs.yes).includes(f)).join(', '));

    // Acceptance #2 of card 0020: "state ONLY what its source publishes". `fee` is the
    // last campsite field nothing in this suite reads. It is not one more free-text
    // string: fee_text() in parse_campsites.py TRANSLATES it -- fee=no becomes the word
    // "Free" and fee=yes becomes "Charges apply" -- and `app/app.js` line 57 turns the
    // exact string 'Free' into a badge on the list row, which is the one campsite claim
    // a reader sees without opening anything. An unrecognised value is passed through as
    // published, because plenty of records carry a real price.
    // Measured: with the two return values swapped, so a site publishing fee=yes ships
    // parking "Free" and wears the badge, the whole suite passed, 259 of 259. The two
    // assertions that look like they cover money -- the Stay the Night ones -- read
    // `parking` on FLS records, which never go through fee_text at all. Today's extract
    // carries the correct wording, so an assertion over app/data/campsites.json would be
    // green from birth; this feeds the parser the three shapes of fee tag instead.
    const feeYes = { type: 'node', id: 60, lat: 55.3, lon: -3.3, tags: {
      name: 'Paid Pitch Park', tourism: 'camp_site', caravans: 'yes', fee: 'yes' } };
    const feeNo = { type: 'node', id: 61, lat: 55.4, lon: -3.4, tags: {
      name: 'Free Pitch Park', tourism: 'camp_site', caravans: 'yes', fee: 'no' } };
    const feePrice = { type: 'node', id: 62, lat: 55.5, lon: -3.5, tags: {
      name: 'Priced Pitch Park', tourism: 'camp_site', caravans: 'yes',
      fee: '£20 per night' } };
    writeOsm([goodEl, feeYes, feeNo, feePrice]);
    const cFee = runCamp();
    let feeRecs = null;
    if (cFee.status === 0 && fs.existsSync(cOut)) {
      try {
        const all = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites;
        feeRecs = { yes: all.find(s => s.id === 'os-n60'),
                    no: all.find(s => s.id === 'os-n61'),
                    price: all.find(s => s.id === 'os-n62') };
      } catch (e) { feeRecs = null; }
    }
    const feeWant = { yes: 'Charges apply', no: 'Free', price: '£20 per night' };
    const feeTag = { yes: 'yes', no: 'no', price: '£20 per night' };
    const feeKeys = ['yes', 'no', 'price'];
    ok('a site the source says you pay for is never shown as free',
       !!feeRecs && feeKeys.every(k => feeRecs[k] && feeRecs[k].parking === feeWant[k]),
       !feeRecs || feeKeys.some(k => !feeRecs[k])
         ? `the fee run exited ${cFee.status} and wrote no os-n60/61/62: ${tail(cFee)}`
         : feeKeys.filter(k => feeRecs[k].parking !== feeWant[k])
                  .map(k => `fee=${JSON.stringify(feeTag[k])} shipped ` +
                            `parking=${JSON.stringify(feeRecs[k].parking)}, ` +
                            `not ${JSON.stringify(feeWant[k])}`).join('; '));

    // Acceptance #2 of card 0020: "state ONLY what its source publishes", and #6, which is
    // about who may actually get through the gate. `access_note` is the last translated
    // campsite field nothing in this suite reads. ACCESS_NOTE in parse_campsites.py is a
    // three-entry map, and every entry is a different answer to "can I turn up tonight":
    // customers only, a permit needed in advance, or permissive access anyone may use.
    // It outranks the Free badge on the LIST ROW (app/app.js line 56) and draws in the
    // `row__closed` style, so it is the one campsite restriction a reader sees without
    // opening anything -- and mistranslating it sends somebody to a gate they cannot open.
    // Measured: with the `permit` and `permissive` entries swapped, so a site OSM says
    // needs a permit is shown as somewhere anyone may use, the whole suite passed, 263 of
    // 263. The only assertion that reads access_note at all is `no campsite is
    // members-only, private, scout or a static-caravan park`, which greps for four words
    // this map never produces. Today's extract carries the correct wording, so an
    // assertion over app/data/campsites.json would be green from birth; this feeds the
    // parser the three access values the map recognises, plus one site carrying none.
    const accCust = { type: 'node', id: 70, lat: 55.6, lon: -3.6, tags: {
      name: 'Customer Gate Farm', tourism: 'camp_site', caravans: 'yes', access: 'customers' } };
    const accPermit = { type: 'node', id: 71, lat: 55.7, lon: -3.7, tags: {
      name: 'Permit Gate Farm', tourism: 'camp_site', caravans: 'yes', access: 'permit' } };
    const accPermissive = { type: 'node', id: 72, lat: 55.8, lon: -3.8, tags: {
      name: 'Permissive Gate Farm', tourism: 'camp_site', caravans: 'yes', access: 'permissive' } };
    // Both ends pinned: a site the source says nothing about must gain no restriction
    // either, so a map widened into labelling everything fails this too. compact() drops
    // a null before writing, so "no note" is an absent key.
    const accNone = { type: 'node', id: 73, lat: 55.9, lon: -3.9, tags: {
      name: 'Open Gate Farm', tourism: 'camp_site', caravans: 'yes' } };
    writeOsm([goodEl, accCust, accPermit, accPermissive, accNone]);
    const cAcc = runCamp();
    let accRecs = null;
    if (cAcc.status === 0 && fs.existsSync(cOut)) {
      try {
        const all = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites;
        accRecs = { customers: all.find(s => s.id === 'os-n70'),
                    permit: all.find(s => s.id === 'os-n71'),
                    permissive: all.find(s => s.id === 'os-n72'),
                    none: all.find(s => s.id === 'os-n73') };
      } catch (e) { accRecs = null; }
    }
    const accWant = { customers: 'Customers only', permit: 'Permit needed',
                      permissive: 'Permissive access', none: null };
    const accKeys = ['customers', 'permit', 'permissive', 'none'];
    ok('the access rule a campsite ships is the one its source published',
       !!accRecs && accKeys.every(k => accRecs[k] &&
                                       (accRecs[k].access_note == null ? null
                                        : accRecs[k].access_note) === accWant[k]),
       !accRecs || accKeys.some(k => !accRecs[k])
         ? `the access run exited ${cAcc.status} and wrote no os-n70/71/72/73: ${tail(cAcc)}`
         : accKeys.filter(k => (accRecs[k].access_note == null ? null : accRecs[k].access_note)
                               !== accWant[k])
                  .map(k => `access=${JSON.stringify(k === 'none' ? null : k)} shipped ` +
                            `access_note=${JSON.stringify(accRecs[k].access_note || null)}, ` +
                            `not ${JSON.stringify(accWant[k])}`).join('; '));

    // Acceptance #2 of card 0020: "state ONLY what its source publishes". `vehicles` is the
    // second list of positive claims on a campsite record, and unlike `facilities` it is the
    // reason the tab exists: app/app.js renders it as "Takes: caravans, motorhomes" on the
    // detail sheet, and it is the field that answers "can I get my van in". vehicles_for()
    // in parse_campsites.py pairs each OSM key with the values that mean yes, exactly as
    // FACILITY_TAGS does, and that pairing is the whole guarantee: relax it to a truthiness
    // test and `caravans=no` becomes "caravans", because "no" is a non-empty string.
    // The site is still correctly LISTED in that case -- takes_a_van() reads motorhome=yes --
    // so the filter assertions cannot see it; the record simply claims a vehicle the source
    // says it does not take. Measured: with all three checks replaced by truthiness the whole
    // suite passed, 262 of 262. `every campsite names at least one vehicle it takes` and
    // `every campsite takes a caravan or a motorhome` read the shipped file and only ever
    // ask for MORE, so an added claim passes both. Today's extract is correct, so an
    // assertion over app/data/campsites.json would be green from birth; this feeds the
    // parser a site that publishes "no" to one vehicle and "yes" to another.
    const vehNo = { type: 'node', id: 70, lat: 55.6, lon: -3.6, tags: {
      name: 'No Caravans Farm', tourism: 'camp_site',
      caravans: 'no', motorhome: 'yes', tents: 'no' } };
    // The other end, so a vehicles_for() tightened into uselessness fails too: every value
    // the parser accepts as a yes, including motorhome=designated.
    const vehYes = { type: 'node', id: 71, lat: 55.7, lon: -3.7, tags: {
      name: 'Three Ways Site', tourism: 'camp_site',
      caravans: 'yes', motorhome: 'designated', tents: 'yes' } };
    writeOsm([goodEl, vehNo, vehYes]);
    const cVeh = runCamp();
    let vehRecs = null;
    if (cVeh.status === 0 && fs.existsSync(cOut)) {
      try {
        const all = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites;
        vehRecs = { no: all.find(s => s.id === 'os-n70'), yes: all.find(s => s.id === 'os-n71') };
      } catch (e) { vehRecs = null; }
    }
    const vehWant = { no: ['motorhomes'], yes: ['caravans', 'motorhomes', 'tents'] };
    const vehSame = (r, want) => r && Array.isArray(r.vehicles) &&
                                 r.vehicles.length === want.length &&
                                 want.every(v => r.vehicles.includes(v));
    ok('a vehicle the source says the site does NOT take is never listed as one',
       !!vehRecs && vehSame(vehRecs.no, vehWant.no) && vehSame(vehRecs.yes, vehWant.yes),
       !vehRecs || !vehRecs.no || !vehRecs.yes
         ? `the vehicles run exited ${cVeh.status} and wrote no os-n70/os-n71: ${tail(cVeh)}`
         : ['no', 'yes'].filter(k => !vehSame(vehRecs[k], vehWant[k]))
                        .map(k => `${vehRecs[k].name} takes ` +
                                  `${JSON.stringify(vehRecs[k].vehicles)}, ` +
                                  `not ${JSON.stringify(vehWant[k])}`).join('; '));

    // Acceptance #6 of card 0020, the half the shipped file cannot prove. The check over
    // app/data/campsites.json reads access_note text, so it catches only the failure that
    // actually happened: access=members labelled instead of dropped. If the scout, private
    // or static-caravan drop were removed, those records would ship with access_note null
    // and every existing assertion would stay green -- a dropped record leaves no text to
    // match on. This feeds the parser one of each kind and requires them gone.
    const excluded = [
      { type: 'node', id: 11, lat: 54.1, lon: -2.1, tags: {
          name: 'Private Field', tourism: 'camp_site', caravans: 'yes', access: 'private' } },
      { type: 'node', id: 12, lat: 54.2, lon: -2.2, tags: {
          name: 'Club Site', tourism: 'camp_site', caravans: 'yes', access: 'members' } },
      { type: 'node', id: 13, lat: 54.3, lon: -2.3, tags: {
          name: 'Scout Camp', tourism: 'camp_site', caravans: 'yes', scout: 'yes' } },
      { type: 'node', id: 14, lat: 54.4, lon: -2.4, tags: {
          name: 'Group Field', tourism: 'camp_site', caravans: 'yes', group_only: 'yes' } },
      { type: 'node', id: 15, lat: 54.5, lon: -2.5, tags: {
          name: 'Statics Park', tourism: 'caravan_site', caravans: 'yes',
          permanent_camping: 'only' } },
      { type: 'node', id: 16, lat: 54.6, lon: -2.6, tags: {
          name: 'Seaside Holiday Park', tourism: 'caravan_site', caravans: 'yes',
          operator: 'Parkdean Resorts' } },
    ];
    writeOsm([goodEl].concat(excluded));
    const cExcl = runCamp();
    let exclIds = null;
    if (cExcl.status === 0 && fs.existsSync(cOut)) {
      try { exclIds = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites.map(s => s.id); }
      catch (e) { exclIds = null; }
    }
    const shipped = exclIds && excluded.map(e => `os-n${e.id}`).filter(id => exclIds.includes(id));
    ok('a members-only, private, scout or static-caravan site never reaches the file',
       !!exclIds && exclIds.includes('os-n1') && shipped.length === 0,
       !exclIds ? `the run exited ${cExcl.status} and wrote no dataset: ${tail(cExcl)}`
       : !exclIds.includes('os-n1') ? 'the parser dropped the ordinary campsite too'
       : `these should not be listed as somewhere to pull up for the night: ${shipped.join(', ')}`);

    // Acceptance #6 of card 0020 again, and the half of it the `scout` tag cannot carry.
    // The drop reads tags.scout and group_only only. OSM tagging is sparse: measured over
    // the three cached Overpass responses, 89 elements carry scout=yes, but two sites that
    // are plainly scout sites carry no such tag and ship today -- "Rolleston Scout Group
    // Caravan Park" (way 127724548, tags: name and tourism=caravan_site, nothing else) and
    // "South London Scout Centre" (way 145180506, a scout centre with caravans=yes). The
    // static-caravan drop already reads the name and operator for exactly this reason.
    // "Scoutscroft" and "Scoutscroft Touring" in Coldingham are commercial holiday parks,
    // so the match has to be the word rather than the letters, and one is kept here to
    // hold that line.
    const scoutish = [
      { type: 'node', id: 17, lat: 54.7, lon: -2.7, tags: {
          name: 'Rolleston Scout Group Caravan Park', tourism: 'caravan_site' } },
      { type: 'node', id: 18, lat: 54.8, lon: -2.8, tags: {
          name: 'South London Scout Centre', tourism: 'camp_site', caravans: 'yes' } },
      { type: 'node', id: 19, lat: 54.9, lon: -2.9, tags: {
          name: 'Barnsfield Camp', tourism: 'camp_site', caravans: 'yes',
          operator: '1st Barnsfield Scouts' } },
    ];
    const notScout = { type: 'node', id: 20, lat: 55.0, lon: -3.0, tags: {
      name: 'Scoutscroft Touring', tourism: 'caravan_site', caravans: 'yes' } };
    writeOsm([goodEl, notScout].concat(scoutish));
    const cScout = runCamp();
    let scoutIds = null;
    if (cScout.status === 0 && fs.existsSync(cOut)) {
      try { scoutIds = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites.map(s => s.id); }
      catch (e) { scoutIds = null; }
    }
    const scoutShipped = scoutIds && scoutish.map(e => `os-n${e.id}`).filter(id => scoutIds.includes(id));
    ok('a site named as a scout site is dropped even when it carries no scout tag',
       !!scoutIds && scoutShipped.length === 0 &&
       scoutIds.includes('os-n1') && scoutIds.includes('os-n20'),
       !scoutIds ? `the run exited ${cScout.status} and wrote no dataset: ${tail(cScout)}`
       : scoutShipped.length ? `scout sites still listed as somewhere to pull up for the night: ${scoutShipped.join(', ')}`
       : !scoutIds.includes('os-n20')
         ? 'the match is too wide: it dropped "Scoutscroft Touring", a commercial holiday park'
         : 'the parser dropped the ordinary campsite too');

    // Acceptance #6 of card 0020 a third time, for the "static-caravan site" kind. The drop
    // rule is a brand list plus permanent_camping=only, and both are blind to the largest
    // group of static sites in the source: the ones a name alone identifies. Measured over
    // the shipped app/data/campsites.json, 22 residential parks and park-home estates ship
    // today -- "Whitearch Park. Residential Park Homes", "Lynwood Residential Park",
    // "Cringles Park Home estate" and so on -- places where people LIVE in static homes,
    // plus one literally called "Static Holiday Park", two called "Haven" (the brand the
    // list already names, missed because the name ends there) and "Martello Beach Holiday
    // Park", operated by Park Resorts. Every one carries caravans or tourism=caravan_site,
    // so takes_a_van() lets them through, and every existing #6 assertion stays green.
    // The line that must not move: a park that says Touring, or that takes tents, is a
    // mixed site with real pitches on it and has to survive.
    const statics = [
      { type: 'node', id: 31, lat: 55.1, lon: -3.1, tags: {
          name: 'Whitearch Park. Residential Park Homes', tourism: 'caravan_site' } },
      { type: 'node', id: 32, lat: 55.2, lon: -3.2, tags: {
          name: 'Static Holiday Park', tourism: 'caravan_site' } },
      { type: 'node', id: 33, lat: 55.3, lon: -3.3, tags: {
          name: 'Haven', tourism: 'caravan_site' } },
      { type: 'node', id: 34, lat: 55.4, lon: -3.4, tags: {
          name: 'Martello Beach Holiday Park', tourism: 'caravan_site',
          operator: 'Park Resorts' } },
    ];
    const mixed = { type: 'node', id: 35, lat: 55.5, lon: -3.5, tags: {
      name: 'Second Chance Touring & Residential Park', tourism: 'caravan_site',
      caravans: 'yes', tents: 'yes' } };
    writeOsm([goodEl, mixed].concat(statics));
    const cStatic = runCamp();
    let staticIds = null;
    if (cStatic.status === 0 && fs.existsSync(cOut)) {
      try { staticIds = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites.map(s => s.id); }
      catch (e) { staticIds = null; }
    }
    const staticShipped = staticIds &&
      statics.map(e => `os-n${e.id}`).filter(id => staticIds.includes(id));
    ok('a residential or park-home site is dropped even when only its name says so',
       !!staticIds && staticShipped.length === 0 &&
       staticIds.includes('os-n1') && staticIds.includes('os-n35'),
       !staticIds ? `the run exited ${cStatic.status} and wrote no dataset: ${tail(cStatic)}`
       : staticShipped.length ? `static-caravan sites still listed as somewhere to pull up for the night: ${staticShipped.join(', ')}`
       : !staticIds.includes('os-n35')
         ? 'the match is too wide: it dropped "Second Chance Touring & Residential Park", which takes tourers'
         : 'the parser dropped the ordinary campsite too');

    // Acceptance #6 of card 0020 a fourth time, for the "members-only" kind, which until now
    // rested entirely on the tag access=members. That tag is as sparse as `scout` was: measured
    // over the shipped app/data/campsites.json, 71 Certificated Locations and Certificated
    // Sites ship today -- "Arlebrook House CAMC CL", "Wyming Brook Farm Certificated Site",
    // "Lodge Farm C&CC CS" -- plus one named "Caravan Club Site (members)". A CL or CS is a
    // five-van site licensed only because an exempted organisation runs it for ITS MEMBERS
    // (Caravan Sites and Control of Development Act 1960, sch. 1), so members-only is the
    // definition of the scheme rather than a policy the site could change. None carries
    // access=members, so every existing #6 assertion stays green while a non-member drives
    // to a locked gate.
    // The line that must not move: a full Club Site -- the big network sites -- takes
    // non-members at a higher price, so "Abbey Wood Caravan Club Site" has to survive.
    const membersOnly = [
      { type: 'node', id: 41, lat: 55.6, lon: -3.6, tags: {
          name: 'Arlebrook House CAMC CL', tourism: 'caravan_site' } },
      { type: 'node', id: 42, lat: 55.7, lon: -3.7, tags: {
          name: 'Wyming Brook Farm Certificated Site', tourism: 'caravan_site',
          operator: 'Caravan and Camping Club' } },
      { type: 'node', id: 43, lat: 55.8, lon: -3.8, tags: {
          name: 'Lodge Farm C&CC CS', tourism: 'camp_site', caravans: 'yes' } },
      { type: 'node', id: 44, lat: 55.9, lon: -3.9, tags: {
          name: 'Caravan Club Site (members)', tourism: 'caravan_site' } },
    ];
    const openClub = { type: 'node', id: 45, lat: 56.1, lon: -4.1, tags: {
      name: 'Abbey Wood Caravan Club Site', tourism: 'caravan_site', caravans: 'yes',
      operator: 'Caravan and Motorhome Club' } };
    writeOsm([goodEl, openClub].concat(membersOnly));
    const cMembers = runCamp();
    let memberIds = null;
    if (cMembers.status === 0 && fs.existsSync(cOut)) {
      try { memberIds = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites.map(s => s.id); }
      catch (e) { memberIds = null; }
    }
    const memberShipped = memberIds &&
      membersOnly.map(e => `os-n${e.id}`).filter(id => memberIds.includes(id));
    ok('a certificated members-only site is dropped even when it carries no access tag',
       !!memberIds && memberShipped.length === 0 &&
       memberIds.includes('os-n1') && memberIds.includes('os-n45'),
       !memberIds ? `the run exited ${cMembers.status} and wrote no dataset: ${tail(cMembers)}`
       : memberShipped.length ? `members-only sites still listed as somewhere to pull up for the night: ${memberShipped.join(', ')}`
       : !memberIds.includes('os-n45')
         ? 'the match is too wide: it dropped "Abbey Wood Caravan Club Site", which takes non-members'
         : 'the parser dropped the ordinary campsite too');

    // Acceptance #6 of card 0020 a fifth time, for the "private" kind -- the one word of the
    // four that the parser has never checked against a NAME. The drop rests entirely on
    // access=private / access=no, and OSM's access tag is as sparse here as it was for
    // members and scout: measured over the shipped app/data/campsites.json,
    // "King Edward Park(private)" (os-w305916449) ships today carrying no access tag at all.
    // The line that must not move: operator=Private in OSM means privately OWNED, not closed
    // to the public -- "Llyn Gwynant Campsite" in Snowdonia carries it and anyone may book --
    // so this reads the name only, never the operator. That is why it is its own pattern
    // rather than another word inside MEMBERS_RE, which reads both.
    const privateNamed = [
      { type: 'node', id: 51, lat: 55.6, lon: -3.6, tags: {
          name: 'King Edward Park(private)', tourism: 'caravan_site', caravans: 'yes' } },
      { type: 'node', id: 52, lat: 55.7, lon: -3.7, tags: {
          name: 'Hillside Private Caravan Park', tourism: 'caravan_site' } },
    ];
    const privatelyOwned = { type: 'node', id: 53, lat: 56.1, lon: -4.1, tags: {
      name: 'Llyn Gwynant Campsite', tourism: 'camp_site', caravans: 'yes',
      operator: 'Private' } };
    writeOsm([goodEl, privatelyOwned].concat(privateNamed));
    const cPrivate = runCamp();
    let privIds = null;
    if (cPrivate.status === 0 && fs.existsSync(cOut)) {
      try { privIds = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites.map(s => s.id); }
      catch (e) { privIds = null; }
    }
    const privShipped = privIds &&
      privateNamed.map(e => `os-n${e.id}`).filter(id => privIds.includes(id));
    ok('a site named private is dropped even when it carries no access tag',
       !!privIds && privShipped.length === 0 &&
       privIds.includes('os-n1') && privIds.includes('os-n53'),
       !privIds ? `the run exited ${cPrivate.status} and wrote no dataset: ${tail(cPrivate)}`
       : privShipped.length ? `private sites still listed as somewhere to pull up for the night: ${privShipped.join(', ')}`
       : !privIds.includes('os-n53')
         ? 'the match is too wide: it dropped "Llyn Gwynant Campsite", whose operator=Private means privately owned, not closed'
         : 'the parser dropped the ordinary campsite too');

    // Acceptance #3 and #4 of card 0020, the half the shipped file cannot prove. The check
    // over app/data/campsites.json only matches /ODbL/ and /OpenStreetMap/, and it reads a
    // file that already happens to be right, so it is green from birth. #3 names three
    // things and the third is a LINK to openstreetmap.org/copyright; #4 says each file
    // carries its own licence statement. This file is the Derivative Database itself and
    // travels on its own -- that is the whole point of the Collective Database argument --
    // so the notice has to be written by the parser into every file it produces, not be a
    // property of the one in the repo. Drop attribution_url, or shorten the wording to
    // "OSM data", and today every campsite assertion stays green.
    let hdr = null;
    if (cExcl.status === 0 && fs.existsSync(cOut)) {
      try { hdr = JSON.parse(fs.readFileSync(cOut, 'utf8')); } catch (e) { hdr = null; }
    }
    ok('every campsite file the parser writes carries the full ODbL notice',
       !!hdr && /ODbL/.test(hdr.licence || '') &&
       /©\s*OpenStreetMap contributors/.test(hdr.attribution || '') &&
       /Open Database License/.test(hdr.attribution || '') &&
       /^https:\/\/(www\.)?openstreetmap\.org\/copyright$/.test(hdr.attribution_url || ''),
       !hdr ? `the run exited ${cExcl.status} and wrote no dataset: ${tail(cExcl)}`
            : `licence=${JSON.stringify(hdr.licence)} ` +
              `attribution=${JSON.stringify(hdr.attribution)} ` +
              `attribution_url=${JSON.stringify(hdr.attribution_url)}`);

    // Acceptance #5 of card 0020 has two halves and only one was watched. "Fail the build"
    // is proved above by the lat 12.3 run. "WITH THE BOUNDING BOX WIDENED FROM ENGLAND TO
    // GB RATHER THAN REMOVED" is the other half, and nothing tested it: narrow LAT_RANGE
    // back towards England and every assertion here stays green, because the shipped file
    // is only ever read for records already inside the box, and a build that wrongly
    // REFUSES a real Scottish campsite writes no file to be checked. The failure is silent
    // in the data and loud only on the day somebody re-fetches. So this feeds the parser
    // the two corners the widening exists for -- Shetland in the north, the Outer Hebrides
    // in the west -- and requires the build to accept them.
    const farNorth = [
      { type: 'node', id: 21, lat: 60.15, lon: -1.15, tags: {
          name: 'Shetland Campsite', tourism: 'camp_site', caravans: 'yes' } },
      { type: 'node', id: 22, lat: 57.9, lon: -7.0, tags: {
          name: 'Outer Hebrides Campsite', tourism: 'camp_site', caravans: 'yes' } },
    ];
    writeOsm(goodEl, farNorth);
    const cFar = runCamp();
    let farIds = null;
    if (cFar.status === 0 && fs.existsSync(cOut)) {
      try { farIds = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites.map(s => s.id); }
      catch (e) { farIds = null; }
    }
    const missing = farIds && farNorth.map(e => `os-n${e.id}`).filter(id => !farIds.includes(id));
    ok('the box reaches the whole of Great Britain, not just England',
       !!farIds && missing.length === 0,
       !farIds ? `the parser refused a British campsite (exit ${cFar.status}): ${tail(cFar)}`
               : `inside Great Britain but rejected or dropped: ${missing.join(', ')}`);

    // Acceptance #7 of card 0020, the half nothing was watching. `every Stay the Night
    // record carries the scheme rules` reads the COMMITTED app/data/campsites.json, so it
    // is a statement about a file already in the repository, not about the code that makes
    // one. Set `parking` to None in build_stn and the whole suite stays green -- measured,
    // 241 passed -- because that assertion never re-runs the parser and the sheet assertion
    // only greps app.js for the heading. The rules would vanish on the next re-fetch, in a
    // dataset nobody re-reads, and the first sign would be somebody fined in a car park.
    // #7 is a promise about what the pipeline produces, so it is tested on what the
    // pipeline produces: the STN fixture already in this temp tree, read back out.
    let stnRec = null;
    if (cFar.status === 0 && fs.existsSync(cOut)) {
      try { stnRec = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites
                        .find(s => s.stay_the_night); } catch (e) { stnRec = null; }
    }
    ok('the parser puts the Stay the Night rules on every record it builds',
       !!stnRec && /6pm to 10am/.test(stnRec.parking || '') &&
       /[Ss]elf-contained/.test(stnRec.parking || ''),
       !stnRec ? `the parser wrote no Stay the Night record at all (exit ${cFar.status})`
               : `parking=${JSON.stringify(stnRec.parking)} -- it must state the ` +
                 '6pm to 10am window and the self-contained-vehicle rule');

    // Acceptance #7 of card 0020, the way it fails without anyone touching build_stn.
    // #7 is about a piece of tarmac, not about a record: "WHEN an FLS Stay the Night car
    // park is listed, THE APP SHALL say that it is overnight-only between 6pm and 10am and
    // that it requires a self-contained vehicle". OSM maps some of those same car parks
    // itself, as ordinary campsites carrying none of the scheme's rules, and dedupe() in
    // parse_campsites.py is the only thing that stops the OSM twin shipping alongside the
    // FLS record. Both assertions above are blind to it: they read the FLS record, which
    // is still there and still correct. The twin sits beside it in the same ranked list,
    // under OSM's name for the place, and somebody taps that one and parks at 2pm.
    // Measured: with dedupe() reduced to `return osm`, the whole suite passed, 256 of 256.
    // The line that must not move is the radius -- a real campsite a mile from a Stay the
    // Night car park is a different place and has to survive -- so a control record sits
    // just outside it.
    const stnTwin = { type: 'node', id: 40, lat: 56.0005, lon: -4.5, tags: {
      name: 'Glenmore Forest Camping', tourism: 'camp_site', caravans: 'yes' } };
    const stnNeighbour = { type: 'node', id: 41, lat: 56.02, lon: -4.5, tags: {
      name: 'Loch Side Caravan Park', tourism: 'camp_site', caravans: 'yes' } };
    writeOsm(goodEl, [stnTwin, stnNeighbour]);
    const cTwin = runCamp();
    let twinSites = null;
    if (cTwin.status === 0 && fs.existsSync(cOut)) {
      try { twinSites = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites; }
      catch (e) { twinSites = null; }
    }
    const twinIds = twinSites && twinSites.map(s => s.id);
    const twinStn = twinSites && twinSites.find(s => s.stay_the_night);
    ok('an OSM copy of a Stay the Night car park never ships beside it without the rules',
       !!twinIds && !twinIds.includes('os-n40') && twinIds.includes('os-n41') &&
       !!twinStn && /6pm to 10am/.test(twinStn.parking || ''),
       !twinIds ? `the run exited ${cTwin.status} and wrote no dataset: ${tail(cTwin)}`
       : twinIds.includes('os-n40')
         ? 'the OSM record 55m from the Stay the Night car park is listed too, and it ' +
           'carries no 6pm-10am window and no self-contained-vehicle rule'
       : !twinIds.includes('os-n41')
         ? 'the merge is too wide: it swallowed a campsite 1.4 mi from the car park'
         : 'the Stay the Night record itself was dropped or lost its rules');

    // Card 0020's tab is "places where you could pull up in a campervan or RV / caravan
    // trailer", and takes_a_van() in parse_campsites.py is the whole of that promise: Rob
    // chose "named and explicitly caravan or motorhome capable" on 2026-08-15, over the
    // wider filter that would have taken the 2,370 records carrying no caravan tag at all.
    // Nothing anywhere watched it. Measured on 2026-09-08: replace the body of
    // takes_a_van() with `return True` and the suite passes 258 of 258, because
    // `every campsite names at least one vehicle it takes` and `every campsite takes a
    // caravan or a motorhome` both read the app/data/campsites.json ALREADY COMMITTED
    // here, which the filter already cleaned. A tents-only field, a backcountry pitch and
    // a site publishing caravans=no would then all rank in the Campsites tab as somewhere
    // to pull up for the night -- a claim OSM never made, which is acceptance #2's own
    // words, on the tab acceptance #1 exists to offer.
    //
    // Two of takes_a_van()'s four rules are already fenced downstream and are deliberately
    // NOT the fixture here: a site carrying no vehicle tag at all, and one publishing
    // caravans=no motorhome=no, both reach the file with an empty `vehicles` list, and
    // validate() already refuses that with "lists no vehicle type, so it does not belong
    // in this tab" and exits non-zero. Measured while writing this: with `return True` in
    // place, both were named by the parser itself. The two rules below have no such
    // second line. A tents-only field still derives vehicles=["tents"] and a backcountry
    // pitch tagged caravans=yes still derives vehicles=["caravans"], so both pass
    // validate() and rank in the tab -- one you cannot bring a van to at all, one you
    // cannot drive to.
    //
    // Both ends are pinned. The two kept records hold the "explicit" rule from being read
    // as "caravans=yes only": motorhome=yes is a van, and tourism=caravan_site with no
    // caravans tag is a caravan park saying so by its own primary tag.
    const vanNo = [
      { type: 'node', id: 51, lat: 53.2, lon: -1.2, tags: {
          name: 'Tents Only Field', tourism: 'camp_site', tents: 'only' } },
      { type: 'node', id: 52, lat: 53.3, lon: -1.3, tags: {
          name: 'Remote Walk-in Pitch', tourism: 'camp_site', backcountry: 'yes',
          caravans: 'yes' } },
    ];
    const vanYes = [
      { type: 'node', id: 54, lat: 53.5, lon: -1.5, tags: {
          name: 'Motorhome Stopover', tourism: 'camp_site', motorhome: 'yes' } },
      { type: 'node', id: 55, lat: 53.6, lon: -1.6, tags: {
          name: 'Riverside Touring Park', tourism: 'caravan_site' } },
    ];
    writeOsm(vanNo.concat(vanYes));
    const cVan = runCamp();
    let vanIds = null;
    if (cVan.status === 0 && fs.existsSync(cOut)) {
      try { vanIds = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites.map(s => s.id); }
      catch (e) { vanIds = null; }
    }
    const vanWrong = vanIds && vanNo.map(e => `os-n${e.id}`).filter(id => vanIds.includes(id));
    const vanLost = vanIds && vanYes.map(e => `os-n${e.id}`).filter(id => !vanIds.includes(id));
    ok('a site the source never says takes a van is not listed as somewhere to pull up',
       !!vanIds && vanWrong.length === 0 && vanLost.length === 0,
       !vanIds ? `the run exited ${cVan.status} and wrote no dataset: ${tail(cVan)}`
       : vanWrong.length
         ? 'the filter is too wide: the source publishes no caravan or motorhome access ' +
           `for ${vanWrong.join(', ')}, and they are listed as somewhere to pull up`
         : `the filter is too tight: it dropped ${vanLost.join(', ')}, which the source ` +
           'does say takes a van');

    // Card 0020's own "Answered, and built" records this as one of two faults found by
    // RUNNING the tab rather than reading it: OSM maps a lot of campsites twice, once as a
    // node and once as the area around it, and Housedean Farm Campsite came back as both
    // the nearest and the second nearest site to Brighton. dedupe_same_site() in
    // parse_campsites.py is the fix, and the card says it was "self-tested" -- but the only
    // assertion is `no campsite is listed twice under one name in one place`, which reads
    // the app/data/campsites.json ALREADY COMMITTED here. The parser has already cleaned
    // that file, so it is green from birth on this question. Measured on 2026-09-08: with
    // dedupe_same_site() reduced to `return sites`, the whole suite passed, 261 of 261.
    //
    // This is acceptance #1's ranked list -- two rows for one place pushes a real
    // alternative off the top of a list read in a moving vehicle -- and it is acceptance
    // #2's rule as well, because two entries claim two places to sleep where the source
    // published one.
    //
    // Both ends are pinned, the way the Stay the Night and takes_a_van fixtures above are.
    // The 0.5 mi threshold is a measured gap in the distribution, not taste (see the
    // function's docstring), so a control pair shares a name 6.9 mi apart and must BOTH
    // survive: two genuinely different farms called the same thing are two campsites.
    // The third requirement is the merge's own promise, "richest record wins, so the merge
    // never loses a postcode or a website" -- drop that sort and the survivor is whichever
    // record OSM happened to list first, and a published postcode silently becomes
    // "not known" on the one field this app exists to hand to a sat nav.
    const dupRich = { type: 'node', id: 60, lat: 50.8700, lon: -0.0300, tags: {
      name: 'Housedean Farm Campsite', tourism: 'camp_site', caravans: 'yes',
      'addr:postcode': 'BN7 3JW', website: 'https://example.org/housedean',
      phone: '01273 000000' } };
    const dupPoor = { type: 'node', id: 61, lat: 50.8715, lon: -0.0300, tags: {
      name: 'Housedean Farm Campsite', tourism: 'camp_site', caravans: 'yes' } };
    const farA = { type: 'node', id: 62, lat: 53.0000, lon: -1.0000, tags: {
      name: 'Oak Tree Farm', tourism: 'camp_site', caravans: 'yes' } };
    const farB = { type: 'node', id: 63, lat: 53.1000, lon: -1.0000, tags: {
      name: 'Oak Tree Farm', tourism: 'camp_site', caravans: 'yes' } };
    // The poor twin is listed FIRST, so a merge that keeps whatever came first rather than
    // whatever is richest fails on the postcode instead of passing by luck.
    writeOsm([dupPoor, dupRich, farA, farB]);
    const cDup = runCamp();
    let dupSites = null;
    if (cDup.status === 0 && fs.existsSync(cOut)) {
      try { dupSites = JSON.parse(fs.readFileSync(cOut, 'utf8')).sites; }
      catch (e) { dupSites = null; }
    }
    const dupKept = dupSites && dupSites.filter(s => /^os-n6[01]$/.test(s.id));
    const farKept = dupSites && dupSites.filter(s => /^os-n6[23]$/.test(s.id));
    ok('one campsite mapped twice by OpenStreetMap is listed once, and keeps its postcode',
       !!dupSites && dupKept.length === 1 && farKept.length === 2 &&
       dupKept[0].postcode_satnav === 'BN7 3JW',
       !dupSites ? `the run exited ${cDup.status} and wrote no dataset: ${tail(cDup)}`
       : dupKept.length !== 1
         ? `the same site 0.1 mi apart under one name ships ${dupKept.length} times ` +
           `(${dupKept.map(s => s.id).join(', ') || 'none at all'}), so it takes the top ` +
           'two rows of the list from anywhere nearby'
       : farKept.length !== 2
         ? 'the merge is too wide: it swallowed one of two real campsites 6.9 mi apart ' +
           `that happen to share a name (kept ${farKept.map(s => s.id).join(', ')})`
         : `the merge kept ${dupKept[0].id} but lost the published postcode ` +
           `(postcode_satnav=${JSON.stringify(dupKept[0].postcode_satnav)}), so the ` +
           'poorer of the two records won');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

console.log('\n--- dataset counts carried in prose (card 0036) ---');
{
  // Three files argue from a record count they wrote down by hand. Card 0016 grew the
  // dataset from 904 to 1,180 and none of them moved, because nothing re-reads a number
  // that lives in a comment. These read the number back out of the prose and check it
  // against the shipped file, so the next growth fails a run instead of a reader.
  const withUrl = sites.filter(s => s.url);
  // Card 0039: DATA-MODEL's "Known divergences" claims how many records still carry a
  // parse-date stamp rather than a fetch-date one. Read the date out of that same sentence
  // and count the records carrying it, so both halves of the claim are checked. Keyed on
  // "still read", which the correct 904 in the counts_by_country block cannot match.
  const dataModel = fs.readFileSync(path.join(ROOT, 'docs', 'DATA-MODEL.md'), 'utf8');
  const staleDate = (/still read `(\d{4}-\d{2}-\d{2})`/.exec(dataModel) || [])[1];
  const staleCount = sites.filter(s => s.scraped_at === staleDate).length;
  const carried = [
    // file, pattern whose capture group is the claimed count, what it must equal
    ['app/api/nearest.php', /ranking ([\d,]+) sites/, sites.length],
    ['docs/build/IOS-SHORTCUT.md', /rank ([\d,]+) sites on device/, sites.length],
    ['app/core.js', /Every one of the ([\d,]+) records/, withUrl.length],
    // Card 0038: the Forestry England briefing is handed to a session with no repository
    // access, so its counts cannot be checked by the person using them, and its row is
    // marked Verified. All three numbers on that row, because it names each separately.
    ['docs/outreach/forestry-england-handover.md',
     /\| ([\d,]+) locations, [\d,]+ forests, [\d,]+ car parks \|/, sites.length],
    ['docs/outreach/forestry-england-handover.md',
     /\| [\d,]+ locations, ([\d,]+) forests, [\d,]+ car parks \|/,
     sites.filter(s => s.source === 'forest').length],
    ['docs/outreach/forestry-england-handover.md',
     /\| [\d,]+ locations, [\d,]+ forests, ([\d,]+) car parks \|/,
     sites.filter(s => s.source === 'carpark').length],
    ['docs/DATA-MODEL.md', /all ([\d,]+) records still read/, staleCount],
    // Card 0020: this block read sites.json only, so the campsite counts written into
    // prose drifted silently the moment dedupe_same_site dropped records -- which is the
    // exact failure the block exists to stop. Both halves of app.js's sentence.
    ['app/app.js', /publishes hours for ([\d,]+) of [\d,]+ records/,
     CAMP.sites.filter(s => s.opening_times).length],
    ['app/app.js', /publishes hours for [\d,]+ of ([\d,]+) records/, CAMP.sites.length],
  ];
  // One test, named as the cards cite it, so a run log shows it by that name. The detail
  // says which file and by how much, because "a count is wrong" is not actionable on its own.
  const wrong = carried.map(([rel, re, want]) => {
    const m = re.exec(fs.readFileSync(path.join(ROOT, ...rel.split('/')), 'utf8'));
    if (!m) return `${rel}: no count matching ${re} found`;
    const got = Number(m[1].replace(/,/g, ''));
    return got === want ? null : `${rel}: says ${got}, dataset holds ${want}`;
  }).filter(Boolean);

  // 276 of the 550 URLs are Scottish, so naming one agency is wrong however the count reads.
  const core = fs.readFileSync(path.join(ROOT, 'app', 'core.js'), 'utf8');
  if (!(/forestryengland\.uk/.test(core) && /forestryandland\.gov\.scot/.test(core))) {
    wrong.push('app/core.js names only one upstream agency for its dataset URLs');
  }
  // Named exactly as card 0036 cites it, so the run log and the card agree.
  ok('dataset counts in comments match sites.json', wrong.length === 0, wrong.join(' | '));

  ok('both upstreams really are in the data',
     withUrl.some(s => /forestryengland\.uk/.test(s.url)) &&
     withUrl.some(s => /forestryandland\.gov\.scot/.test(s.url)));
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
