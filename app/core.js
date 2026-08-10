/* Nearest Forest — pure logic, no DOM.

   Kept separate from app.js so scripts/selftest.js can exercise the real shipped code in
   node rather than a copy that drifts. Loaded as a plain script in the browser (defines
   window.NF) and via require() in node. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NF = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* Shown in the footer so "which version is this phone actually running"
     is answerable by looking, not by guessing. A self-test asserts it matches
     the service worker CACHE name, so the two cannot drift. */
  var BUILD = 'v9-2026-08-10';

  var ARROWS = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  var POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  /* Spoken forms, for aria-label only: VoiceOver reads "NE" as "nee". */
  var POINT_NAMES = ['north', 'north-east', 'east', 'south-east',
                     'south', 'south-west', 'west', 'north-west'];

  /* Great-circle distance in statute miles. */
  function haversineMi(aLat, aLng, bLat, bLng) {
    var R = 3958.7613, r = Math.PI / 180;
    var dLat = (bLat - aLat) * r, dLng = (bLng - aLng) * r;
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
  }

  /* Initial great-circle bearing, degrees true, 0 = north. */
  function bearingDeg(aLat, aLng, bLat, bLng) {
    var r = Math.PI / 180;
    var y = Math.sin((bLng - aLng) * r) * Math.cos(bLat * r);
    var x = Math.cos(aLat * r) * Math.sin(bLat * r) -
            Math.sin(aLat * r) * Math.cos(bLat * r) * Math.cos((bLng - aLng) * r);
    return (Math.atan2(y, x) / r + 360) % 360;
  }

  /* ---- Web Mercator, for the map view ----------------------------------
     Normalised so the whole world is a 1x1 square with (0,0) at the top left,
     which keeps every map calculation independent of pixel size and zoom. It
     is the same projection the tile layer will want later (card 0009), so the
     two cannot disagree about where a marker goes. */
  function projX(lng) { return (lng + 180) / 360; }
  function projY(lat) {
    /* Clamped just short of the poles: the projection is infinite there and a
       NaN would silently drop a marker rather than misplace it visibly. */
    var s = Math.sin(Math.max(-85.05, Math.min(85.05, lat)) * Math.PI / 180);
    return 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI);
  }
  function unprojX(x) { return x * 360 - 180; }
  function unprojY(y) {
    var n = Math.PI * (1 - 2 * y);
    return Math.atan(Math.sinh(n)) * 180 / Math.PI;
  }

  /* Scale and centre that fit a lng/lat bbox into w x h pixels. Returned as
     world units so the caller can clamp or animate it before drawing. */
  function fitBounds(bbox, w, h, padPx) {
    var pad = padPx || 0;
    var x0 = projX(bbox[0]), x1 = projX(bbox[2]);
    var y0 = projY(bbox[3]), y1 = projY(bbox[1]);   /* north is the smaller y */
    var dx = Math.max(1e-9, x1 - x0), dy = Math.max(1e-9, y1 - y0);
    var scale = Math.min((w - pad * 2) / dx, (h - pad * 2) / dy);
    return { scale: scale, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
  }

  /* Nearest of a set of screen-space points within maxPx, or null. Pure, so
     the tap-target size is covered by the self-tests rather than by poking at
     a phone: a marker you cannot reliably hit is the map's main failure mode. */
  function pickNearest(pts, x, y, maxPx) {
    var best = null, bestD2 = maxPx * maxPx, i, dx, dy, d2;
    for (i = 0; i < pts.length; i++) {
      dx = pts[i].x - x; dy = pts[i].y - y; d2 = dx * dx + dy * dy;
      if (d2 <= bestD2) { bestD2 = d2; best = pts[i]; }
    }
    return best;
  }

  /* ---- Marker clustering -------------------------------------------------
     630 car parks zoomed out to the whole country is a solid band of dots that
     hides how many sites are really there and makes tapping a lottery. Group
     the ones that physically overlap on screen and show the count instead.

     Greedy, in the order given: the first point of a group anchors it and later
     points join if they land within `radius` of that anchor. `pts` arrives in
     ranked order, so the nearest site anchors its own group rather than being
     absorbed into one centred somewhere else. Drawn position is the centroid,
     which sits where the eye expects the blob to be. */
  function clusterPoints(pts, radius) {
    var out = [];
    var r2 = radius * radius;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i], joined = false;
      for (var j = 0; j < out.length; j++) {
        var g = out[j];
        var dx = p.x - g.ax, dy = p.y - g.ay;
        if (dx * dx + dy * dy <= r2) {
          g.items.push(p);
          g.sumX += p.x; g.sumY += p.y;
          joined = true;
          break;
        }
      }
      if (!joined) {
        out.push({ ax: p.x, ay: p.y, sumX: p.x, sumY: p.y, items: [p] });
      }
    }
    return out.map(function (g) {
      var n = g.items.length;
      return {
        x: g.sumX / n,
        y: g.sumY / n,
        count: n,
        items: g.items,
        /* A group of one is just a marker, and callers treat it as such. */
        site: n === 1 ? g.items[0].site : null
      };
    });
  }

  /* ---- Bottom-sheet drag ------------------------------------------------
     The sheet has a grip that looks draggable, so it has to be draggable.
     Kept here rather than in app.js because "did that gesture mean close?" is
     a rule worth testing, not something to eyeball on a phone. */
  var SHEET_CLOSE_FRAC = 0.28;   // dragged past this much of the panel -> close
  var SHEET_FLING_V = 0.5;       // px/ms downward at release -> close regardless
  var SHEET_FLING_MIN = 24;      // ...but only after this much travel, so a
                                 // twitchy tap on the grip is not a fling
  var SHEET_LIFT_MAX = 32;       // how far it rubber-bands upward

  /* How far the panel should actually be offset for a finger that has moved dy.
     Downward tracks 1:1; upward resists and caps, because the sheet is already
     as far up as it goes and a dead handle feels broken. */
  function sheetOffset(dy) {
    if (dy >= 0) return dy;
    return Math.max(dy / 3, -SHEET_LIFT_MAX);
  }

  /* Should releasing here close the sheet? dy is total travel (px, down is
     positive), v is the release speed in px/ms, height is the panel height. */
  function sheetShouldClose(dy, v, height) {
    if (!(dy > 0)) return false;                              // up or nowhere: never
    if (v >= SHEET_FLING_V && dy >= SHEET_FLING_MIN) return true;   // flicked away
    return height > 0 && dy >= height * SHEET_CLOSE_FRAC;     // dragged far enough
  }

  function compassIdx(deg) { return Math.round(deg / 45) % 8; }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function hhmmToMins(s) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(s || '');
    return m ? (+m[1]) * 60 + (+m[2]) : null;
  }

  /* Sunset as a local Date, or null inside a polar day/night.
     Standard NOAA/Astronomical Almanac solar formulas, inline to keep the app dependency-free.
     Verified within 60s of api.sunrise-sunset.org across summer/winter solstice and August. */
  function sunsetAt(lat, lng, when) {
    var rad = Math.PI / 180, dayMs = 86400000, J1970 = 2440588, J2000 = 2451545;
    var d = (when.valueOf() / dayMs - 0.5 + J1970) - J2000;
    var lw = rad * -lng, phi = rad * lat;
    var n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
    var ds = 0.0009 + lw / (2 * Math.PI) + n;
    var M = rad * (357.5291 + 0.98560028 * ds);
    var C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    var L = M + C + rad * 102.9372 + Math.PI;
    var dec = Math.asin(Math.sin(rad * 23.4397) * Math.sin(L));
    var cosW = (Math.sin(rad * -0.833) - Math.sin(phi) * Math.sin(dec)) /
               (Math.cos(phi) * Math.cos(dec));
    if (cosW > 1 || cosW < -1) return null;
    var a = 0.0009 + (Math.acos(cosW) + lw) / (2 * Math.PI) + n;
    var Jset = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    return new Date((Jset + 0.5 - J1970) * dayMs);
  }

  /* {state:'open'|'closed'|'unknown', label}. 'unknown' means the published text was not
     confidently understood and the UI must fall back to showing it verbatim.
     We never claim a gate is open on a guess: stranding someone at a locked car park at
     night is the worst thing this app could do. */
  function openState(site, now) {
    now = now || new Date();
    var o = site.opening_summary;
    if (!o) return { state: 'unknown', label: '' };

    if (o.access === 'always') return { state: 'open', label: 'Open 24h' };

    if (o.access === 'dusk') {
      var ss = sunsetAt(site.lat, site.lng, now);
      if (!ss) return { state: 'unknown', label: 'Closes at dusk' };
      var t = pad2(ss.getHours()) + ':' + pad2(ss.getMinutes());
      return now > ss ? { state: 'closed', label: 'Dusk was ' + t }
                      : { state: 'open', label: 'Dusk ~' + t };
    }

    if (o.access === 'hours' && o.confidence === 'parsed') {
      var mins = now.getHours() * 60 + now.getMinutes();
      var open = hhmmToMins(o.opens), close = hhmmToMins(o.closes);
      if (close === null) return { state: 'unknown', label: '' };
      if (open !== null && mins < open) return { state: 'closed', label: 'Opens ' + o.opens };
      if (mins >= close) return { state: 'closed', label: 'Closed ' + o.closes };
      return { state: 'open', label: 'Until ' + o.closes };
    }

    return { state: 'unknown', label: '' };
  }

  /* Deep links verified against vendor docs on 2026-08-08:
     Apple  https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
     Google https://developers.google.com/maps/documentation/urls/get-started
     Waze   https://developers.google.com/waze/deeplinks */
  function navUrl(app, site) {
    var ll = site.lat.toFixed(6) + ',' + site.lng.toFixed(6);
    if (app === 'apple') {
      return 'https://maps.apple.com/?daddr=' + encodeURIComponent(ll) + '&dirflg=d';
    }
    if (app === 'google') {
      return 'https://www.google.com/maps/dir/?api=1&destination=' +
             encodeURIComponent(ll) + '&travelmode=driving&dir_action=navigate';
    }
    if (app === 'waze') {
      return 'https://waze.com/ul?ll=' + encodeURIComponent(ll) + '&navigate=yes';
    }
    return null;
  }

  /* Sorted list of the sites in `source`, nearest first, or alphabetical when pos is null.

     Returns shallow COPIES carrying _mi/_bear rather than annotating the input objects.
     Annotating in place meant a later rank() call silently rewrote _mi on results an
     earlier caller still held (a null-position call wiped every distance), which is the
     kind of shared-mutable-state bug that shows up as a blank distance months later. */
  function rank(sites, source, pos, filter) {
    var out = sites.filter(function (s) { return s.source === source; });
    if (filter) {
      var f = filter.toLowerCase();
      out = out.filter(function (s) {
        return s.name.toLowerCase().indexOf(f) > -1 ||
               (s.postcode_satnav || '').toLowerCase().indexOf(f) > -1;
      });
    }
    out = out.map(function (s) {
      var c = {}, k;
      for (k in s) if (Object.prototype.hasOwnProperty.call(s, k)) c[k] = s[k];
      c._mi = pos ? haversineMi(pos.lat, pos.lng, s.lat, s.lng) : null;
      c._bear = pos ? bearingDeg(pos.lat, pos.lng, s.lat, s.lng) : null;
      return c;
    });
    out.sort(pos ? function (a, b) { return a._mi - b._mi; }
                 : function (a, b) { return a.name.localeCompare(b.name); });
    return out;
  }

  return { BUILD: BUILD, ARROWS: ARROWS, POINTS: POINTS, POINT_NAMES: POINT_NAMES,
           projX: projX, projY: projY, unprojX: unprojX, unprojY: unprojY,
           fitBounds: fitBounds, pickNearest: pickNearest,
           sheetOffset: sheetOffset, sheetShouldClose: sheetShouldClose,
           clusterPoints: clusterPoints,
           haversineMi: haversineMi, bearingDeg: bearingDeg,
           compassIdx: compassIdx, pad2: pad2, hhmmToMins: hhmmToMins, sunsetAt: sunsetAt,
           openState: openState, navUrl: navUrl, rank: rank };
}));
