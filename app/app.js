/* Nearest Forest — UI layer. All pure logic lives in core.js (window.NF) so it can be
   tested in node by scripts/selftest.js against the real shipped code. */
'use strict';

var DATA = null;              // { generated_at, counts, sites: [] }
var CAMP = null;              // campsites.json, a SEPARATE database under a separate licence
var CAMP_ERROR = null;        // why the campsite file did not load, if it did not
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
  /* An empty Campsites tab has two very different causes and they must not look alike:
     a filter that matched nothing, or a dataset that never arrived. */
  emptyEl.textContent = (TAB === 'campsite' && CAMP_ERROR)
    ? 'The campsite data could not be loaded (' + CAMP_ERROR + '). Forests and car parks are unaffected.'
    : 'No sites match that filter.';
  if (typeof NFMap !== 'undefined') NFMap.refresh();

  listEl.innerHTML = sites.map(function (s, i) {
    var st = NF.openState(s);
    var nearest = (i === 0 && POS && !FILTER);
    var sub = [];
    if (nearest) sub.push('<span class="row__badge">Nearest</span>');
    if (s.postcode_satnav) sub.push('<span>' + esc(s.postcode_satnav) + '</span>');
    if (st.state === 'closed') sub.push('<span class="row__closed">' + esc(st.label) + '</span>');
    else if (st.state === 'open') sub.push('<span>' + esc(st.label) + '</span>');
    if (s.source === 'carpark' && s.surface) sub.push('<span>' + esc(s.surface) + '</span>');
    /* On a campsite row the thing worth knowing before driving is whether you can
       actually get in, so a restriction outranks a facility for the space available. */
    if (s.source === 'campsite') {
      if (s.stay_the_night) sub.push('<span class="row__badge">Stay the Night</span>');
      if (s.access_note) sub.push('<span class="row__closed">' + esc(s.access_note) + '</span>');
      else if (s.parking === 'Free') sub.push('<span>Free</span>');
    }

    var dist;
    if (s._mi === null || s._mi === undefined) {
      dist = '<div class="row__unit">no fix</div>';
    } else {
      var idx = NF.compassIdx(s._bear);
      // The letters are not decoration. An arrow on its own reads as "straight
      // ahead" to someone in a moving car, but this is a compass bearing from
      // where you are standing: a northward arrow means north whichever way the
      // car happens to be pointing.
      dist = '<div class="row__mi">' + (s._mi < 10 ? s._mi.toFixed(1) : Math.round(s._mi)) + '</div>' +
             '<div class="row__unit">miles</div>' +
             '<div class="row__arrow" aria-label="' + esc(NF.POINT_NAMES[idx]) + ' of you">' +
               '<span class="row__glyph" aria-hidden="true">' + NF.ARROWS[idx] + '</span>' +
               '<span class="row__point">' + NF.POINTS[idx] + '</span>' +
             '</div>';
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

/* ---------- sheets ---------- */
/* Every close goes through here: a sheet dragged part-way down carries an inline
   transform, and reopening without clearing it would show an off-screen panel. */
function closeSheet(el) {
  var panel = el.querySelector('.sheet__panel');
  if (panel) { panel.style.transform = ''; panel.style.transition = ''; panel.style.animation = ''; }
  el.hidden = true;
}
function closeSheets() { closeSheet($('#sheet')); closeSheet($('#chooser')); }
function showSheet(el) {
  var panel = el.querySelector('.sheet__panel');
  if (panel) { panel.style.transform = ''; panel.style.transition = ''; panel.style.animation = ''; }
  el.hidden = false;
}

/* Drag-to-dismiss from the grip. The grip is the only drag zone: the panel body
   scrolls, and a drag started there would be ambiguous with a scroll. */
function dragSheet(el) {
  var panel = el.querySelector('.sheet__panel');
  var grip = el.querySelector('.sheet__grip');
  if (!panel || !grip) return;
  var startY = 0, lastY = 0, lastT = 0, v = 0, dragging = false;

  grip.addEventListener('pointerdown', function (e) {
    dragging = true;
    startY = lastY = e.clientY;
    lastT = e.timeStamp;
    v = 0;
    panel.style.transition = 'none';
    panel.style.animation = 'none';        // the open animation would fight the drag
    try { grip.setPointerCapture(e.pointerId); } catch (err) { /* drag still works while the finger stays put */ }
  });

  grip.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dt = e.timeStamp - lastT;
    if (dt > 0) v = (e.clientY - lastY) / dt;
    lastY = e.clientY; lastT = e.timeStamp;
    panel.style.transform = 'translateY(' + NF.sheetOffset(e.clientY - startY) + 'px)';
  });

  function release(e) {
    if (!dragging) return;
    dragging = false;
    var dy = e.clientY - startY;
    panel.style.transition = 'transform .2s ease-out';
    if (NF.sheetShouldClose(dy, v, panel.offsetHeight)) {
      panel.style.transform = 'translateY(100%)';
      // Hide only once it is actually off-screen, so the close is seen rather
      // than the panel blinking out from under the finger. If something reopened
      // the sheet inside that window, showSheet cleared the transform and this
      // timer must not steal it away again.
      setTimeout(function () {
        if (panel.style.transform === 'translateY(100%)') closeSheet(el);
      }, 200);
    } else {
      panel.style.transform = '';
    }
  }
  grip.addEventListener('pointerup', release);
  grip.addEventListener('pointercancel', release);
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
    sub.push(site._mi.toFixed(1) + ' miles ' + NF.POINTS[NF.compassIdx(site._bear)] + ' of you');
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
  /* Campsites: the source publishes hours for 99 of 3,723 records, so "Opening times"
     as a headline field would be an empty row on almost every one of them. What the
     source does say is who may use the place and what it takes, and that is what
     decides whether the drive is worth making. */
  if (site.source === 'campsite') {
    h += field('Takes', (site.vehicles || []).join(', '), { missing: 'Not stated' });
    if (site.access_note) h += field('Access', site.access_note);
    /* On a Stay the Night car park this field holds the scheme's rules, not a price,
       and "Charges" over the sentence that tells you no tents are allowed is the kind
       of mislabel someone reads past at 9pm. */
    h += site.stay_the_night ? field('Overnight rules', site.parking)
                             : field('Charges', site.parking, { missing: 'Not stated' });
    if (site.operator) h += field('Operator', site.operator);
    if (site.phone) h += field('Phone', site.phone);
    if (site.opening_times) h += field('Opening times', site.opening_times);
    if (site.country) h += field('Country', site.country);
  } else {
    h += field('Opening times', site.opening_times, { missing: 'Not published' });
    h += field('Parking', site.parking);
  }
  if (site.facilities && site.facilities.length) {
    h += '<dt>Facilities</dt><dd><div class="tags">' +
         site.facilities.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
         '</div></dd>';
  }
  if (site.status) h += field('Status', site.status);
  h += field('Coordinates', site.lat.toFixed(5) + ', ' + site.lng.toFixed(5));
  /* NF.safeHref, not site.url: a dataset URL only reaches an href through the
     scheme check. noreferrer as well as noopener, so following the link does not
     tell Forestry England which page sent you. */
  var moreHref = NF.safeHref(site.url);
  if (moreHref) {
    /* A campsite's website is whatever OpenStreetMap holds for it, so the link text
       must not claim it is a Forestry England page. Show the host instead: it is the
       one honest label available, and it lets you see where a tap will take you. */
    var label = 'Forestry England page';
    if (site.source === 'campsite') {
      label = site.stay_the_night ? 'Forestry and Land Scotland page'
                                  : moreHref.replace(/^https:\/\/(www\.)?/, '').split('/')[0];
    }
    h += field('More', '<a href="' + esc(moreHref) + '" target="_blank" rel="noopener noreferrer">' +
               esc(label) + '</a>', { raw: true });
  }
  h += field('Data checked', site.scraped_at || (site.source === 'campsite' && CAMP ? CAMP.generated_at : null));
  if (site.source === 'campsite' && !site.stay_the_night) {
    h += field('Source', 'OpenStreetMap contributors, ODbL');
  }
  $('#sheet-body').innerHTML = h;
  showSheet($('#sheet'));
}

function openChooser(site) {
  TARGET = site;
  $('#chooser-sub').textContent = site.name + (site.postcode_satnav ? ' · ' + site.postcode_satnav : '');
  showSheet($('#chooser'));
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

  if (t.closest('[data-close]')) { closeSheets(); return; }

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
    closeSheet($('#chooser'));
    if (url) window.location.href = url;
  }
});
$('#btn-locate').addEventListener('click', function () { locate(true); });
$('#sheet-nav').addEventListener('click', function () {
  closeSheet($('#sheet'));
  if (TARGET) openChooser(TARGET);
});
$('#filter').addEventListener('input', function (e) { FILTER = e.target.value.trim(); render(); });

/* ---------- map ---------- */
/* The map reads the same ranked list the rows are built from, so the two can
   never disagree about which sites are shown or which one is nearest. */
NFMap.init({
  getSites: function () { return RENDERED; },
  getPos: function () { return POS; },
  onPick: function (site) { openSheet(site); }
});
$('#btn-map').addEventListener('click', function () {
  if (NFMap.isOpen()) NFMap.hide(); else NFMap.show();
});
$('#map-close').addEventListener('click', function () { NFMap.hide(); });
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  if (!$('#chooser').hidden) { closeSheet($('#chooser')); return; }
  if (!$('#sheet').hidden) { closeSheet($('#sheet')); return; }
  if (NFMap.isOpen()) NFMap.hide();
});
dragSheet($('#sheet'));
dragSheet($('#chooser'));

/* ---------- boot ---------- */
function loadJson(url) {
  return fetch(url).then(function (r) {
    if (!r.ok) throw new Error(url + ' returned HTTP ' + r.status);
    return r.json();
  });
}

/* Two files, because they are two databases under two licences: sites.json is Open
   Government Licence and campsites.json is ODbL. They are merged into one array here
   and nowhere on disk. See the note inside campsites.json before changing that.

   The campsite file failing must not take the forests down with it, so it is caught
   separately. It is never swallowed: the Campsites tab says what went wrong. */
Promise.all([
  loadJson('data/sites.json'),
  loadJson('data/campsites.json').catch(function (err) {
    CAMP_ERROR = err.message;
    return null;
  })
]).then(function (res) {
  DATA = res[0];
  CAMP = res[1];

  var meta = 'Data generated ' + DATA.generated_at + ' · ' +
    DATA.counts.forest + ' forests, ' + DATA.counts.carpark + ' car parks';
  if (CAMP && CAMP.sites) {
    DATA.sites = DATA.sites.concat(CAMP.sites);
    meta += ', ' + CAMP.counts.campsite + ' campsites';
  }
  metaEl.textContent = meta + ' · build ' + NF.BUILD;

  loadStale();
  render();
  locate(false);
}).catch(function (err) {
  setStatus('Could not load the site data (' + err.message + '). The app cannot work without it.', 'err');
  listEl.innerHTML = '';
});

if ('serviceWorker' in navigator) {
  /* A page loaded under the old worker keeps running the old code even after the new
     one has installed and taken over, so a deploy needed TWO online launches to appear
     and never appeared at all while offline. Reload once when control changes hands.
     Guarded on there having been a controller to begin with: on a first-ever visit
     clients.claim() also fires this, and there is nothing stale to replace. */
  var hadController = !!navigator.serviceWorker.controller;
  var reloadingForUpdate = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!hadController || reloadingForUpdate) return;
    reloadingForUpdate = true;
    window.location.reload();
  });
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function (e) {
      console.warn('Service worker registration failed, so offline use is unavailable:', e);
    });
  });
}
