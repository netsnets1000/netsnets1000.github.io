/* Tellera homepage (V5 UHC MCP) — vanilla port of the Claude Design component.
   Self-contained: agent data lives here, not in js/data.js. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };

  /* ---------- category groups ---------- */
  var GROUPS = {
    'People & identity': { color: '#565C99', tint200: '#C9CBDE', icon: 'assets/icon-cat-people-identity.svg', bg: 'assets/bg-cat-people-identity.svg' },
    'Property & assets': { color: '#2B8A88', tint200: '#BBDAD9', icon: 'assets/icon-cat-property-assets.svg', bg: 'assets/bg-cat-property-assets.svg' },
    'Business & legal': { color: '#8B5E3C', tint200: '#DACBC1', icon: 'assets/icon-cat-business-legal.svg', bg: 'assets/bg-cat-business-legal.svg' }
  };

  /* ---------- 9 agents (order = design rows) ---------- */
  var AGENTS = [
    { name: 'Phone', app: 'Tellera Phone', cat: 'PHONE INTELLIGENCE', group: 'People & identity', desc: 'Identify callers, numbers, and carrier details.', ex: 'who owns (512) 555-0142?', extra: "Some AI can write your texts — we'll tell you who they're actually going to." },
    { name: 'Vehicle', app: 'Tellera Vehicle', cat: 'VEHICLE HISTORY', group: 'Property & assets', desc: 'VIN checks, title history, recalls, and more.', ex: 'is VIN 1FTFW1E5… clean?', extra: "Some AI can design your next car — ours finds the hidden history of the one in the driveway." },
    { name: 'Property', app: 'Tellera Property', cat: 'PROPERTY RECORDS', group: 'Property & assets', desc: 'Ownership, value, liens, taxes, and history.', ex: 'who owns 1234 Oakridge Dr?', extra: "Some AI can stage your dream home — we'll tell you who actually owns the one next door." },
    { name: 'People', app: 'Tellera People', cat: 'PEOPLE SEARCH', group: 'People & identity', desc: 'Backgrounds, relatives, and associations.', ex: "what's known about M. Decker?", extra: "Some AI can write your Tinder bio — we'll tell you who you're actually meeting up with." },
    { name: 'Legal', app: 'Tellera Court', cat: 'COURT & LEGAL', group: 'Business & legal', desc: 'Court records, lawsuits, and filings.', ex: 'any filings in Travis County?', extra: "Some AI can cite a case — we'll tell you what's actually on the record without a courthouse visit." },
    { name: 'Family', app: 'Tellera Family', cat: 'FAMILY & KIN', group: 'People & identity', desc: 'Relatives, ancestry, marriages, and lineage.', ex: "who are Decker's relatives?", extra: "Some AI can generate your family crest — we'll help you fully explore your ancestry." },
    { name: 'Trust & Safety', app: 'Tellera Safety', cat: 'TRUST & SAFETY', group: 'Business & legal', desc: 'Risk signals, watchlists, and verifications.', ex: 'any watchlist hits?', extra: "Some AI can generate thousands of scams — we'll tell you which one just landed in your inbox." },
    { name: 'Business', app: 'Tellera Business', cat: 'BUSINESS & ENTITIES', group: 'Business & legal', desc: 'Companies, licenses, and financial information.', ex: 'who owns Oakridge LLC?', extra: "Some AI can draft your reply — we'll tell you who's really behind the address that sent it." },
    { name: 'Money', app: 'Tellera Assets', cat: 'MONEY & ASSETS', group: 'Property & assets', desc: 'Bankruptcies, liens, judgments, and assets.', ex: 'any liens or judgments?', extra: "Some AI can help you forecast — we'll tell you about real money that's actually yours." }
  ];
  AGENTS.forEach(function (a) { var g = GROUPS[a.group]; a.color = g.color; a.tint200 = g.tint200; a.catIcon = g.icon; a.bgIcon = g.bg; });

  var BRANDS = [
    { name: 'BeenVerified', logo: 'assets/logo-bv.svg', cat: 'People & background', desc: 'A decade-plus of people search, background reports, and contact data at consumer scale.', color: '#357A46' },
    { name: 'Bumper.com', logo: 'assets/logo-bumper.svg', cat: 'Vehicle history', desc: 'VIN checks, title and lien history, recalls, and market value on used vehicles.', color: '#2E6BFF' },
    { name: 'Ownerly', logo: 'assets/logo-ownerly.svg', cat: 'Property & value', desc: 'Home ownership, valuations, tax and lien records across residential property.', color: '#7C6BFF' },
    { name: 'FamFinder', logo: 'assets/logo-famfinder.svg', cat: 'Family & kin', desc: 'Relatives, lineage, and household connections mapped from public records.', color: '#B0402F' }
  ];

  var COMPARE = [
    { front: 'assets/compare-property-default.svg', back: 'assets/compare-property-flipped.svg', q: 'Who owns the house behind me?' },
    { front: 'assets/compare-vehicle-default.svg', back: 'assets/compare-vehicle-flipped.svg', q: "Is this used truck's VIN clean?" },
    { front: 'assets/compare-phone-default.svg', back: 'assets/compare-phone-flipped.svg', q: 'Who keeps calling from this number?' }
  ];

  /* ---------- hero prism ray-fan ---------- */
  function specAt(t) { var s = [[164, 217, 242], [243, 159, 60], [123, 91, 255]]; var seg = t < 0.5 ? 0 : 1, lt = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5; var a = s[seg], b = s[seg + 1]; return a.map(function (v, i) { return Math.round(v + (b[i] - v) * lt); }); }
  function blend(c, tg, amt) { var m = c.map(function (v, i) { return Math.round(v + (tg[i] - v) * amt); }); return 'rgb(' + m[0] + ',' + m[1] + ',' + m[2] + ')'; }
  function makeRays(idp, bg) {
    var rc = 20, ox = -60, oy = 250, farX = 1000, defs = '', lines = '', glows = '';
    for (var i = 0; i < rc; i++) {
      var t = i / (rc - 1), ang = (-30 + t * 60) * Math.PI / 180, ey = oy + Math.tan(ang) * (farX - ox);
      var c = specAt(t), gid = idp + i, full = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
      defs += '<linearGradient id="' + gid + '" gradientUnits="userSpaceOnUse" x1="' + ox + '" y1="' + oy + '" x2="' + farX + '" y2="' + ey + '">' +
        '<stop offset="0%" stop-color="' + blend(c, bg, 0.9) + '"/><stop offset="45%" stop-color="' + blend(c, bg, 0.35) + '"/><stop offset="100%" stop-color="' + full + '"/></linearGradient>';
      lines += '<line x1="' + ox + '" y1="' + oy + '" x2="' + farX + '" y2="' + ey + '" stroke="url(#' + gid + ')" stroke-width="1"/>';
      var dur = (6 + ((i * 37) % 9) + (i % 3)) + 's', delay = (-1 * ((i * 53) % 12)) + 's', gap = 380 + ((i * 29) % 260);
      glows += '<line x1="' + ox + '" y1="' + oy + '" x2="' + farX + '" y2="' + ey + '" stroke="' + full + '" stroke-width="2" stroke-linecap="round" stroke-dasharray="60 ' + gap + '" style="opacity:.85;animation:rayflow ' + dur + ' linear ' + delay + ' infinite;filter:drop-shadow(0 0 3px rgba(255,255,255,.6))"/>';
    }
    var mask = 'linear-gradient(90deg,rgba(0,0,0,.35) 0%,rgba(0,0,0,.35) 42%,black 68%)';
    return '<svg viewBox="0 0 1000 620" preserveAspectRatio="none" style="opacity:.2"><defs>' + defs + '</defs>' + lines +
      '<g style="-webkit-mask-image:' + mask + ';mask-image:' + mask + '">' + glows + '</g></svg>';
  }

  /* ---------- agents: rail + category filter ---------- */
  var railTrack = $('#agentsTrack'), catsWrap = $('#agentCats'), activeCat = 'All';
  function agentCard(a) {
    return '<a class="agent-card" href="/deep-search?q=' + encodeURIComponent(a.ex) + '">' +
      '<div class="agent-card__bg" style="background-image:url(\'' + a.bgIcon + '\')"></div>' +
      '<div class="agent-card__body">' +
        '<span class="agent-card__ic"><img src="' + a.catIcon + '" alt="' + esc(a.name) + '"></span>' +
        '<div class="agent-card__app">' + esc(a.app) + '</div>' +
        '<div class="agent-card__desc">' + esc(a.desc) + '</div>' +
        '<div class="agent-card__extra">' + esc(a.extra) + '</div>' +
        '<div class="agent-card__foot"><span class="agent-card__ex">' + esc(a.ex) + '</span><span class="agent-card__go">→</span></div>' +
      '</div></a>';
  }
  function renderRail() {
    if (!railTrack) return;
    var list = AGENTS.filter(function (a) { return activeCat === 'All' || a.group === activeCat; });
    railTrack.innerHTML = list.map(agentCard).join('');
  }
  function renderCats() {
    if (!catsWrap) return;
    var labels = ['All'].concat(Object.keys(GROUPS));
    catsWrap.innerHTML = labels.map(function (l) {
      return '<button class="agents__cat' + (l === activeCat ? ' active' : '') + '" data-cat="' + esc(l) + '">' + esc(l) + '</button>';
    }).join('');
    catsWrap.querySelectorAll('.agents__cat').forEach(function (b) {
      b.addEventListener('click', function () { activeCat = b.getAttribute('data-cat'); renderCats(); renderRail(); });
    });
  }

  /* ---------- mega menu ---------- */
  var megaCats = $('#megaCats'), megaGrid = $('#megaGrid'), menuCat = 'All';
  function renderMega() {
    if (!megaGrid) return;
    var labels = ['All'].concat(Object.keys(GROUPS));
    if (megaCats) {
      megaCats.innerHTML = labels.map(function (l) {
        var count = l === 'All' ? AGENTS.length : AGENTS.filter(function (a) { return a.group === l; }).length;
        return '<div class="mega__cat' + (l === menuCat ? ' active' : '') + '" data-cat="' + esc(l) + '"><span>' + esc(l) + '</span><span class="c">' + count + '</span></div>';
      }).join('');
      megaCats.querySelectorAll('.mega__cat').forEach(function (d) {
        d.addEventListener('mouseenter', function () { menuCat = d.getAttribute('data-cat'); renderMega(); });
        d.addEventListener('click', function () { menuCat = d.getAttribute('data-cat'); renderMega(); });
      });
    }
    var list = AGENTS.filter(function (a) { return menuCat === 'All' || a.group === menuCat; });
    megaGrid.innerHTML = list.map(function (a) {
      return '<a class="mega__tile" href="/deep-search?q=' + encodeURIComponent(a.ex) + '">' +
        '<span class="mega__tile-ic"><img src="' + a.catIcon + '" alt="' + esc(a.name) + '"></span>' +
        '<div class="mega__tile-name">' + esc(a.app) + '</div>' +
        '<div class="mega__tile-desc">' + esc(a.desc) + '</div>' +
        '<div class="mega__tile-cat" style="color:' + a.color + '">' + esc(a.cat) + '</div></a>';
    }).join('');
  }
  function initMega() {
    var trigger = $('#agentsTrigger'), mega = $('#megamenu'), nav = $('#nav'), close = $('#megaClose');
    if (!trigger || !mega || !nav) return;
    var open = function () { mega.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); mega.setAttribute('aria-hidden', 'false'); };
    var shut = function () { mega.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); mega.setAttribute('aria-hidden', 'true'); };
    trigger.addEventListener('mouseenter', open);
    trigger.addEventListener('click', function () { mega.classList.contains('open') ? shut() : open(); });
    nav.addEventListener('mouseleave', shut);
    if (close) close.addEventListener('click', shut);
  }

  /* ---------- compare flip cards ---------- */
  function renderCompare() {
    var grid = $('#compareGrid'); if (!grid) return;
    grid.innerHTML = COMPARE.map(function (c) {
      return '<div class="flip"><div class="flip__inner">' +
        '<div class="flip__face"><img src="' + c.front + '" alt="' + esc(c.q) + '"></div>' +
        '<div class="flip__face flip__face--back"><img src="' + c.back + '" alt="Tellera answer"></div>' +
        '</div></div>';
    }).join('');
    grid.querySelectorAll('.flip').forEach(function (f) { f.addEventListener('click', function () { f.classList.toggle('flipped'); }); });
  }

  /* ---------- flow diagram ---------- */
  var AXIS = 240, agentLeft = 510, agentW = 190, agentH = 34;
  function rowY(i) { return 72 + i * 42; }
  function wavy(x1, y1, x2, y2, stroke, delay) {
    var midX = x1 + (x2 - x1) * 0.5, dy = (y2 - y1);
    var d = 'M' + x1 + ' ' + y1 + ' Q' + midX + ' ' + (y1 + dy * 0.15) + ' ' + midX + ' ' + ((y1 + y2) / 2) + ' T' + x2 + ' ' + y2;
    return '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="1.4" stroke-opacity="0.6" stroke-dasharray="2 4" style="animation:flowpulse 5.5s linear ' + delay + 's infinite"/>';
  }
  function renderFlow() {
    var lines = $('#flowLines'), nodesWrap = $('#flowAgents');
    if (nodesWrap) {
      nodesWrap.innerHTML = AGENTS.map(function (a, i) {
        return '<div class="flow__node" style="left:' + agentLeft + 'px;top:' + (rowY(i) - agentH / 2) + 'px;width:' + agentW + 'px">' +
          '<div class="flow__node-in"><span class="flow__node-dot" style="background:' + a.tint200 + '"></span>' +
          '<span class="flow__node-name">' + esc(a.app) + '</span></div></div>';
      }).join('');
    }
    if (lines) {
      var svg = '<svg viewBox="0 0 1352 480" preserveAspectRatio="none">' +
        '<defs><marker id="fa" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L6 3 L0 6 Z" fill="#7E8798"/></marker></defs>' +
        '<line x1="170" y1="' + AXIS + '" x2="230" y2="' + AXIS + '" stroke="#7E8798" stroke-width="1.7" stroke-opacity="0.85" stroke-dasharray="2 4" marker-end="url(#fa)" style="animation:flowpulse 5.5s linear infinite"/>';
      AGENTS.forEach(function (a, i) { svg += wavy(380, AXIS, agentLeft, rowY(i), a.color, -(i * 0.3)); });
      AGENTS.forEach(function (a, i) { svg += wavy(agentLeft + agentW, rowY(i), 830, AXIS, a.color, -(i * 0.3 + 0.15)); });
      svg += '<line x1="1050" y1="' + AXIS + '" x2="1120" y2="' + AXIS + '" stroke="#7E8798" stroke-width="1.4" stroke-opacity="0.85" stroke-dasharray="2 4" style="animation:flowpulse 5.5s linear infinite"/>';
      svg += '</svg>';
      lines.innerHTML = svg;
    }
  }

  /* ---------- scroll light beams (build + footer dark bands) ---------- */
  function wrap(v, range) { return ((v % range) + range) % range; }
  function initBeams(hostId, defs, speeds) {
    var host = $('#' + hostId); if (!host) return null;
    host.innerHTML = defs.map(function (b, i) {
      var dur = (6 + ((i * 37) % 9) + (i % 3)) + 's', delay = (-1 * ((i * 53) % 12)) + 's';
      return '<div class="beam" data-speed="' + speeds[i] + '" style="position:absolute;top:' + b.top + ';left:-30%;width:160%;height:1px;overflow:visible;' +
        'background:linear-gradient(90deg,transparent,' + b.color + ' 20%,' + b.color + ' 60%,#FFF3C4 88%,transparent);opacity:.35;transition:transform .1s linear;transform:translateX(-20%) rotate(-6deg)">' +
        '<div style="position:absolute;top:0;left:-18%;width:12%;height:100%;background:linear-gradient(90deg,transparent,' + b.color + ',#FFF6D8,transparent);' +
        'filter:blur(1px) drop-shadow(0 0 4px rgba(255,255,255,.65));mix-blend-mode:screen;opacity:0;animation:lighttravel ' + dur + ' linear ' + delay + ' infinite"></div></div>';
    }).join('');
    return host;
  }
  function initAllBeams() {
    var bhost = initBeams('buildBeams', [{ top: '8%', color: '#2E7BFF' }, { top: '42%', color: '#7B5BFF' }, { top: '74%', color: '#B06BFF' }], [0.07, 0.1, 0.13]);
    var fhost = initBeams('footerBeams', [{ top: '12%', color: '#2E7BFF' }, { top: '50%', color: '#7B5BFF' }, { top: '85%', color: '#B06BFF' }], [0.05, 0.08, 0.11]);
    function update() {
      var y = window.scrollY || window.pageYOffset || 0;
      [bhost, fhost].forEach(function (h) {
        if (!h) return;
        h.querySelectorAll('.beam').forEach(function (b) {
          var sp = parseFloat(b.getAttribute('data-speed'));
          b.style.transform = 'translateX(' + (-(wrap(y * sp, 40) - 20)) + '%) rotate(-6deg)';
        });
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- agents rail: wheel + drag + arrows ---------- */
  function initRail() {
    var el = $('#agentsRail'); if (!el) return;
    el.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { el.scrollLeft += e.deltaY; e.preventDefault(); }
    }, { passive: false });
    var down = false, sx = 0, sl = 0, moved = false;
    el.addEventListener('pointerdown', function (e) { if (e.button && e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; el.style.cursor = 'grabbing'; });
    window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; el.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', function () { down = false; el.style.cursor = 'grab'; });
    el.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

    var left = $('#railLeft'), right = $('#railRight');
    function upd() {
      var atStart = el.scrollLeft <= 2, atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
      if (left) left.classList.toggle('dim', atStart);
      if (right) right.classList.toggle('dim', atEnd);
    }
    if (left) left.addEventListener('click', function () { el.scrollBy({ left: -320, behavior: 'smooth' }); });
    if (right) right.addEventListener('click', function () { el.scrollBy({ left: 320, behavior: 'smooth' }); });
    el.addEventListener('scroll', upd, { passive: true });
    requestAnimationFrame(upd);
  }

  /* ---------- ask bar ---------- */
  function initAsk() {
    var input = $('#askInput'), go = $('#askGo');
    var submit = function () { var v = (input && input.value || '').trim(); location.href = '/deep-search' + (v ? '?q=' + encodeURIComponent(v) : ''); };
    if (go) go.addEventListener('click', submit);
    if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    document.querySelectorAll('.hchip[data-q]').forEach(function (chip) {
      chip.addEventListener('click', function () { if (input) { input.value = chip.getAttribute('data-q'); input.focus(); } });
    });
  }

  /* ---------- mobile menu ---------- */
  function initMobile() {
    var burger = $('#burger'), menu = $('#mobileMenu'); if (!burger || !menu) return;
    menu.innerHTML = '<a href="#agents">Agents</a><a href="#build">Developers</a><a href="#data">Our data</a><a href="#how">Trust</a><a href="#">Pricing</a>' +
      '<a href="/get-started">Sign in</a><a class="mm-get" href="/deep-search">Get started</a>';
    menu.hidden = false;
    var openState = false;
    var toggle = function () { openState = !openState; menu.classList.toggle('show', openState); burger.setAttribute('aria-expanded', openState ? 'true' : 'false'); };
    burger.addEventListener('click', toggle);
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { openState = false; menu.classList.remove('show'); burger.setAttribute('aria-expanded', 'false'); }); });
  }

  /* ---------- brands ---------- */
  function renderBrands() {
    var grid = $('#brandGrid'); if (!grid) return;
    grid.innerHTML = BRANDS.map(function (b) {
      return '<div class="brand"><div class="brand__body">' +
        '<div class="brand__logo" style="background-image:url(\'' + b.logo + '\')"></div>' +
        '<div class="brand__cat" style="color:' + b.color + '">' + esc(b.cat) + '</div>' +
        '<div class="brand__desc">' + esc(b.desc) + '</div></div></div>';
    }).join('');
  }

  /* ---------- boot ---------- */
  function boot() {
    var hr = $('#heroRays'); if (hr) hr.innerHTML = makeRays('ray', [255, 255, 255]);
    renderCats(); renderRail(); renderMega(); initMega(); renderCompare(); renderFlow(); renderBrands();
    initRail(); initAsk(); initMobile(); initAllBeams();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
