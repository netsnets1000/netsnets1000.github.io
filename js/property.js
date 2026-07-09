/* Tellera Property interactions + rendering */
(function () {
  var T = window.TELLERA;
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };

  /* ---- Hero ray-fan — same horizontal fan as the homepage (origin left-center, fans right) ---- */
  (function buildHeroRays() {
    var host = document.getElementById('pheroRays');
    if (!host) return;
    var stops = [[46, 123, 255], [123, 91, 255], [176, 64, 47]];
    function specAt(t) { var seg = t < 0.5 ? 0 : 1, lt = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5; var a = stops[seg], b = stops[seg + 1]; return a.map(function (v, i) { return Math.round(v + (b[i] - v) * lt); }); }
    function blend(c, target, amt) { var m = c.map(function (v, i) { return Math.round(v + (target[i] - v) * amt); }); return 'rgb(' + m[0] + ',' + m[1] + ',' + m[2] + ')'; }
    var bg = [245, 248, 252], tail = 0.55; // property hero bg #F5F8FC
    var rayCount = 20, ox = -60, oy = 250, farX = 1000, defs = '', lines = '';
    for (var i = 0; i < rayCount; i++) {
      var t = i / (rayCount - 1);
      var ey = oy + Math.tan((-30 + t * 60) * Math.PI / 180) * (farX - ox);
      var c = specAt(t), gid = 'pray' + i;
      defs += '<linearGradient id="' + gid + '" gradientUnits="userSpaceOnUse" x1="' + ox + '" y1="' + oy + '" x2="' + farX + '" y2="' + ey + '">' +
        '<stop offset="0%" stop-color="' + blend(c, bg, 0.9) + '" stop-opacity="0.12"/>' +
        '<stop offset="45%" stop-color="' + blend(c, bg, 0.35) + '" stop-opacity="0.3"/>' +
        '<stop offset="100%" stop-color="rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')" stop-opacity="' + tail + '"/></linearGradient>';
      lines += '<line x1="' + ox + '" y1="' + oy + '" x2="' + farX + '" y2="' + ey + '" stroke="url(#' + gid + ')" stroke-width="1"/>';
    }
    host.innerHTML = '<svg viewBox="0 0 1000 620" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none"><defs>' + defs + '</defs>' + lines + '</svg>';
  })();

  /* ---- How-it-works comparison (Property-specific copy) ---- */
  var PCOMPARE = [
    { q: 'Who owns the house behind me?', generic: 'I can’t access property ownership records.', tellera: 'Martin R. Decker — Travis County warranty deed. Confidence: High.' },
    { q: 'Are there any liens on 1234 Oakridge Dr?', generic: 'I don’t have access to lien or title data.', tellera: 'No open liens — clerk records current as of Q1 2026.' },
    { q: 'What did this house last sell for?', generic: 'I can’t look up historical sale prices.', tellera: '$610,000 in Mar 2019 — deed + MLS-derived record.' }
  ];
  var xIcon = '<svg viewBox="0 0 20 20" width="17" height="17"><circle cx="10" cy="10" r="9" fill="rgba(220,0,21,0.16)"/><path d="M7 7 L13 13 M13 7 L7 13" stroke="#FF6B7A" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var triIcon = '<svg viewBox="0 0 40 40" width="19" height="19"><defs><linearGradient id="cmpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FB861"/><stop offset="1" stop-color="#4E7A3E"/></linearGradient></defs><path d="M20 4 L34 31 L6 31 Z" fill="none" stroke="url(#cmpg)" stroke-width="2.4" stroke-linejoin="round"/><path d="M2 20 L15 20" stroke="#9DB58C" stroke-width="2" stroke-linecap="round"/><path d="M25 16 L38 14" stroke="#7FB861" stroke-width="2" stroke-linecap="round"/><path d="M25.5 20 L39 20" stroke="#4E7A3E" stroke-width="2" stroke-linecap="round"/><path d="M25 24 L38 26" stroke="#63A34A" stroke-width="2" stroke-linecap="round"/></svg>';
  var pc = document.getElementById('phowCompare');
  if (pc) pc.innerHTML = PCOMPARE.map(function (c) {
    return '<div class="phow-cmp"><div class="phow-cmp__q">' + esc(c.q) + '</div>' +
      '<div class="phow-cmp__row">' +
        '<div class="phow-cmp__cell">' + xIcon + '<span class="phow-cmp__generic">' + esc(c.generic) + '</span></div>' +
        '<div class="phow-cmp__cell">' + triIcon + '<span class="phow-cmp__tellera">' + esc(c.tellera) + '</span></div>' +
      '</div></div>';
  }).join('');

  /* ---- Agents rail (Property = current, first) ---- */
  // reorder so Property is first
  var ordered = T.AGENTS.slice();
  var track = document.getElementById('pagentTrack');
  if (track) track.innerHTML = ordered.map(function (a) {
    var cur = a.code === 'PR';
    var cta = cur ? 'You’re viewing this' : 'Open →';
    var ctaColor = cur ? '#5B45E0' : '#24408F';
    var here = cur ? '<span class="pagent-card__here">You’re here</span>' : '';
    var href = cur ? '/property' : '/deep-search';
    return '<article class="pagent-card' + (cur ? ' current' : '') + '">' +
      '<div class="pagent-card__top" style="background:' + a.grad + '"></div>' +
      '<div class="pagent-card__body">' +
        '<div class="pagent-card__row">' +
          '<span class="pagent-card__badge" style="border:1.5px solid ' + a.color + ';color:' + a.color + '">' + a.code + '</span>' + here +
        '</div>' +
        '<div class="pagent-card__cat">' + esc(a.cat) + '</div>' +
        '<div class="pagent-card__name">' + esc(a.app) + '</div>' +
        '<div class="pagent-card__desc">' + esc(a.desc) + '</div>' +
        '<div class="pagent-card__foot">' +
          '<span class="pagent-card__ex">' + esc(a.ex) + '</span>' +
          '<a class="pagent-card__cta" href="' + href + '" style="color:' + ctaColor + '">' + cta + '</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join('');

  /* ---- Code tabs ---- */
  var TABS = [
    { name: 'REST', code: '$ curl https://api.tellera.ai/v1/property \\\n   -H "Authorization: Bearer $TELLERA_KEY" \\\n   -d address="1234 Oakridge Dr, Austin TX 78704"' },
    { name: 'MCP', code: '{\n  "tool": "property.lookup",\n  "arguments": {\n    "address": "1234 Oakridge Dr, Austin TX 78704",\n    "fields": ["owner", "value", "liens"]\n  }\n}' },
    { name: 'GraphQL', code: 'query {\n  property(address: "1234 Oakridge Dr, Austin TX") {\n    owner { name, since }\n    value { estimate, equity }\n    liens { status }\n    sources { name, type }\n  }\n}' }
  ];
  var tabsEl = document.getElementById('codeTabs');
  var bodyEl = document.getElementById('codeBody');
  var activeTab = 0;
  function renderTabs() {
    tabsEl.innerHTML = TABS.map(function (t, i) {
      return '<button class="pcode__tab' + (i === activeTab ? ' active' : '') + '" data-i="' + i + '">' + t.name + '</button>';
    }).join('') + '<span class="pcode__dot"></span>';
    bodyEl.textContent = TABS[activeTab].code;
  }
  if (tabsEl) {
    tabsEl.addEventListener('click', function (e) {
      var b = e.target.closest('.pcode__tab'); if (!b) return;
      activeTab = +b.getAttribute('data-i'); renderTabs();
    });
    renderTabs();
  }

  /* ---- Mobile nav dropdown ---- */
  var pburger = document.getElementById('pnavBurger');
  var pmenu = document.getElementById('pnavMenu');
  if (pburger && pmenu) {
    pburger.addEventListener('click', function () {
      var open = pmenu.classList.toggle('show');
      pburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    pmenu.addEventListener('click', function (e) { if (e.target.tagName === 'A') pmenu.classList.remove('show'); });
  }

  /* ---- Sample-question chips seed the open-ended ask bar ---- */
  var askInput = document.getElementById('pheroAsk');
  document.querySelectorAll('.qchip[data-seed]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (askInput) { askInput.value = chip.getAttribute('data-seed'); askInput.focus(); }
    });
  });

  /* ---- Primary: address search → funnel with ?address ---- */
  document.querySelectorAll('[data-property-search]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('.psearch__input');
      var val = input && input.value.trim();
      if (!val) { if (input) input.focus(); return; }
      window.location.href = '/get-started?address=' + encodeURIComponent(val);
    });
  });

  /* ---- Secondary: open-ended AI ask → funnel with ?ask ---- */
  document.querySelectorAll('[data-property-ask]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('.pask__input');
      var val = input && input.value.trim();
      if (!val) { if (input) input.focus(); return; }
      window.location.href = '/get-started?ask=' + encodeURIComponent(val);
    });
  });

  /* ---- Drag / wheel horizontal scroll on the agent rail ---- */
  document.querySelectorAll('[data-drag-scroll]').forEach(function (el) {
    el.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { el.scrollLeft += e.deltaY; e.preventDefault(); }
    }, { passive: false });
    var down = false, sx = 0, sl = 0, moved = false;
    el.addEventListener('pointerdown', function (e) {
      if (e.button && e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = el.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 4) { moved = true; el.style.cursor = 'grabbing'; }
      if (moved) el.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () { down = false; el.style.cursor = ''; });
    el.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
})();
