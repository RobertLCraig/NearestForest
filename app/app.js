/* Nearest Forest — UI layer. All pure logic lives in core.js (window.NF) so it can be
   tested in node by scripts/selftest.js against the real shipped code. */
'use strict';

var DATA = null;              // { generated_at, counts, sites: [] }
var POS = null;               // { lat, lng, stale:bool, at:ISO }
var TAB = 'forest';
var FILTER = '';
var TARGET = null;            // site queued for the map chooser
var RENDERED = [];            // last ranked list; holds the _mi/_bear copies
var LS_KEY = 'nf.lastpos';

var $ = function (s) { return document.querySelector(s); };
var listEl = $('#list'), statusEl = $('#status'), emptyEl = $('#empty'), metaEl = $('#meta');

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* Every state is reported. Nothing about location failure is allowed to be silent. */
function setStatus(text, kind) {
  statusEl.textContent = text;
  statusEl.className = 'status status--' + (kind || 'ok');
}

/* ---------- rendering ---------- */
function render() {
  if (!DATA) return;
  var sites = NF.rank(DATA.sites, TAB, POS, FILTER);
  RENDERED = sites;
  emptyEl.hidden = sites.length > 0;

  listEl.innerHTML = sites.map(function (s, i) {
    var st = NF.openState(s);
    var nearest = (i === 0 && POS && !FILTER);
    var sub = [];
    if (nearest) sub.push('<span class="row__badge">Nearest</span>');
    if (s.postcode_satnav) sub.push('<span>' + esc(s.postcode_satnav) + '</span>');
    if (st.state === 'closed') sub.push('<span class="row__closed">' + esc(st.label) + '</span>');
    else if (st.state === 'open') sub.push('<span>' + esc(st.label) + '</span>');
    if (s.source === 'carpark' && s.surface) sub.push('<span>' + esc(s.surface) + '</span>');

    var dist;
    if (s._mi === null || s._mi === undefined) {
      dist = '<div class="row__unit">no fix</div>';
    } else {
      var idx = NF.compassIdx(s._bear);
      dist = '<div class="row__mi">' + (s._mi < 10 ? s._mi.toFixed(1) : Math.round(s._mi)) + '</div>' +
             '<div class="row__unit">miles</div>' +
             '<div class="row__arrow" title="' + NF.POINTS[idx] + '">' + NF.ARROWS[idx] + '</div>';
    }

    return '<li class="row' + (nearest ? ' row--nearest' : '') + '">' +
      '<button class="row__main" data-id="' + esc(s.id) + '">' +
        '<div class="row__name' + (s.name_is_derived ? ' row__derived' : '') + '">' + esc(s.name) + '</div>' +
        '<div class="row__sub">' + sub.join('') + '</div>' +
      '</button>' +
      '<div class="row__dist">' + dist + '</div>' +
      '<button class="row__go" data-go="' + esc(s.id) + '" aria-label="Navigate to ' + esc(s.name) + '">▶</button>' +
    '</li>';
  }).join('');
}

/* ---------- detail sheet ---------- */
/* Prefer the rendered copy: it carries _mi/_bear. rank() no longer annotates the
   originals, so DATA.sites is only the fallback for an id not currently on screen. */
function siteById(id) {
  var i;
  for (i = 0; i < RENDERED.length; i++) if (RENDERED[i].id === id) return RENDERED[i];
  for (i = 0; i < DATA.sites.length; i++) if (DATA.sites[i].id === id) return DATA.sites[i];
  return null;
}
function field(label, value, opts) {
  opts = opts || {};
  var missing = (value == null || value === '');
  var body = missing ? '<dd class="is-missing">' + esc(opts.missing || 'Not listed') + '</dd>'
                     : '<dd>' + (opts.raw ? value : esc(value)) + '</dd>';
  return '<dt>' + esc(label) + '</dt>' + body;
}
function openSheet(site) {
  TARGET = site;
  $('#sheet-name').textContent = site.name;

  var sub = [];
  if (site._mi !== null && site._mi !== undefined) {
    sub.push(site._mi.toFixed(1) + ' miles ' + NF.POINTS[NF.compassIdx(site._bear)]);
  }
  if (POS && POS.stale) sub.push('from last known position');
  $('#sheet-sub').textContent = sub.join(' · ');

  var st = NF.openState(site);
  var h = '';
  if (st.state !== 'unknown') {
    h += field('Right now', (st.state === 'open' ? 'Open · ' : 'Closed · ') + st.label);
  }
  h += field('Sat nav postcode', site.postcode_satnav, { missing: 'No sat nav postcode published' });
  h += field('Address', site.address);
  h += field('Opening times', site.opening_times, { missing: 'Not published' });
  h += field('Parking', site.parking);
  if (site.facilities && site.facilities.length) {
    h += '<dt>Facilities</dt><dd><div class="tags">' +
         site.facilities.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
         '</div></dd>';
  }
  if (site.status) h += field('Status', site.status);
  h += field('Coordinates', site.lat.toFixed(5) + ', ' + site.lng.toFixed(5));
  if (site.url) {
    h += field('More', '<a href="' + esc(site.url) + '" target="_blank" rel="noopener">Forestry England page</a>',
               { raw: true });
  }
  h += field('Data checked', site.scraped_at);
  $('#sheet-body').innerHTML = h;
  $('#sheet').hidden = false;
}

function openChooser(site) {
  TARGET = site;
  $('#chooser-sub').textContent = site.name + (site.postcode_satnav ? ' · ' + site.postcode_satnav : '');
  $('#chooser').hidden = false;
}

/* ---------- geolocation ---------- */
function applyPos(lat, lng, stale) {
  POS = { lat: lat, lng: lng, stale: !!stale, at: new Date().toISOString() };
  render();
}
function loadStale() {
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    var p = JSON.parse(raw);
    if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return false;
    applyPos(p.lat, p.lng, true);
    return true;
  } catch (e) { return false; }
}
function locate(manual) {
  var btn = $('#btn-locate');
  if (!('geolocation' in navigator)) {
    setStatus('This browser has no location support, so the list is alphabetical.', 'err');
    return;
  }
  btn.classList.add('is-spinning');
  setStatus('Getting your location…', 'wait');

  navigator.geolocation.getCurrentPosition(function (p) {
    btn.classList.remove('is-spinning');
    applyPos(p.coords.latitude, p.coords.longitude, false);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ lat: POS.lat, lng: POS.lng, at: POS.at }));
    } catch (e) { /* private mode: the position simply is not remembered */ }
    setStatus('Sorted by distance from you (±' + Math.round(p.coords.accuracy) + ' m).', 'ok');
  }, function (err) {
    btn.classList.remove('is-spinning');
    var msg = { 1: 'Location permission denied. Enable it in Settings > Safari > Location.',
                2: 'Your position is unavailable right now. No GPS fix.',
                3: 'Timed out waiting for a GPS fix.' }[err.code] ||
              ('Location failed: ' + err.message);
    if (loadStale()) {
      setStatus(msg + ' Showing distances from your last known position.', 'stale');
    } else {
      setStatus(msg + ' The list is alphabetical until a fix arrives.', 'err');
    }
    render();
  }, { enableHighAccuracy: true, timeout: manual ? 20000 : 12000, maximumAge: manual ? 0 : 60000 });
}

/* ---------- events ---------- */
document.addEventListener('click', function (e) {
  var t = e.target;
  if (!t.closest) return;

  var go = t.closest('[data-go]');
  if (go) { var s1 = siteById(go.getAttribute('data-go')); if (s1) openChooser(s1); return; }

  var main = t.closest('[data-id]');
  if (main) { var s2 = siteById(main.getAttribute('data-id')); if (s2) openSheet(s2); return; }

  if (t.closest('[data-close]')) { $('#sheet').hidden = true; $('#chooser').hidden = true; return; }

  var tab = t.closest('.tab');
  if (tab) {
    TAB = tab.getAttribute('data-tab');
    document.querySelectorAll('.tab').forEach(function (b) {
      var on = (b === tab);
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    render();
    window.scrollTo(0, 0);
    return;
  }

  var map = t.closest('[data-app]');
  if (map && TARGET) {
    var url = NF.navUrl(map.getAttribute('data-app'), TARGET);
    $('#chooser').hidden = true;
    if (url) window.location.href = url;
  }
});
$('#btn-locate').addEventListener('click', function () { locate(true); });
$('#sheet-nav').addEventListener('click', function () {
  $('#sheet').hidden = true;
  if (TARGET) openChooser(TARGET);
});
$('#filter').addEventListener('input', function (e) { FILTER = e.target.value.trim(); render(); });

/* ---------- boot ---------- */
fetch('data/sites.json').then(function (r) {
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}).then(function (d) {
  DATA = d;
  metaEl.textContent = 'Data generated ' + d.generated_at + ' · ' +
    d.counts.forest + ' forests, ' + d.counts.carpark + ' car parks.';
  loadStale();
  render();
  locate(false);
}).catch(function (err) {
  setStatus('Could not load the site data (' + err.message + '). The app cannot work without it.', 'err');
  listEl.innerHTML = '';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function (e) {
      console.warn('Service worker registration failed, so offline use is unavailable:', e);
    });
  });
}
