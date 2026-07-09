/* Tellera homepage interactions + rendering */
(function () {
  var T = window.TELLERA;
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };

  // Homepage platform order: Phone, VIN, Property, then the rest (matches the design's rail + flow)
  var HOME_AGENTS = ['PH', 'VE', 'PR', 'PE', 'LE', 'FA', 'TS', 'BU', 'MO'].map(function (code) {
    return T.AGENTS.filter(function (a) { return a.code === code; })[0];
  });

  /* ---- prism ray-fan agent triangle glyph (small, per-agent color) ---- */
  function agentTri(color) {
    return '<svg class="agent-card__tri" viewBox="0 0 32 32" width="27" height="27"><path d="M16 5 L27 26 L5 26 Z" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-linejoin="round"/><path d="M2 16 L11 16" stroke="' + color + '" stroke-width="1.3" stroke-linecap="round"/><path d="M20.5 14 L30 13" stroke="' + color + '" stroke-width="1.3" stroke-linecap="round" stroke-opacity="0.65"/><path d="M20.5 16 L30 16" stroke="' + color + '" stroke-width="1.3" stroke-linecap="round" stroke-opacity="0.65"/><path d="M20.5 18 L30 19" stroke="' + color + '" stroke-width="1.3" stroke-linecap="round" stroke-opacity="0.65"/></svg>';
  }

  /* ---- Hero ray-fan (horizontal, origin at left-center, fans right) ----
     Ported verbatim from the design's makeRays('ray',[233,238,245],0.55):
     each ray is muted/faded near the left origin (behind the text) and vivid on the right. */
  (function buildHeroRays() {
    var host = document.getElementById('heroRays');
    if (!host) return;
    var stops = [[46, 123, 255], [123, 91, 255], [176, 64, 47]]; // blue → violet → rust
    function specAt(t) {
      var seg = t < 0.5 ? 0 : 1, lt = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
      var a = stops[seg], b = stops[seg + 1];
      return a.map(function (v, i) { return Math.round(v + (b[i] - v) * lt); });
    }
    function blend(c, target, amt) {
      var m = c.map(function (v, i) { return Math.round(v + (target[i] - v) * amt); });
      return 'rgb(' + m[0] + ',' + m[1] + ',' + m[2] + ')';
    }
    var bg = [233, 238, 245], tail = 0.55;          // cool paper #E9EEF5
    var rayCount = 20, ox = -60, oy = 250, farX = 1000;
    var defs = '', lines = '';
    for (var i = 0; i < rayCount; i++) {
      var t = i / (rayCount - 1);
      var ang = (-30 + t * 60) * Math.PI / 180;      // fan ±30°
      var ey = oy + Math.tan(ang) * (farX - ox);
      var c = specAt(t), gid = 'ray' + i;
      defs += '<linearGradient id="' + gid + '" gradientUnits="userSpaceOnUse" x1="' + ox + '" y1="' + oy + '" x2="' + farX + '" y2="' + ey + '">' +
        '<stop offset="0%" stop-color="' + blend(c, bg, 0.9) + '" stop-opacity="0.12"/>' +
        '<stop offset="45%" stop-color="' + blend(c, bg, 0.35) + '" stop-opacity="0.3"/>' +
        '<stop offset="100%" stop-color="rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')" stop-opacity="' + tail + '"/>' +
        '</linearGradient>';
      lines += '<line x1="' + ox + '" y1="' + oy + '" x2="' + farX + '" y2="' + ey + '" stroke="url(#' + gid + ')" stroke-width="1"/>';
    }
    host.innerHTML = '<svg viewBox="0 0 1000 620" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">' +
      '<defs>' + defs + '</defs>' + lines + '</svg>';
  })();

  /* ---- Agent rail ---- */
  var track = document.getElementById('agentTrack');
  if (track) {
    track.innerHTML = HOME_AGENTS.map(function (a, i) {
      var href = a.code === 'PR' ? '/property' : '/deep-search';
      return '<a class="agent-card" href="' + href + '">' +
        '<div class="agent-card__top" style="background:' + a.grad + '"></div>' +
        '<div class="agent-card__body">' +
          '<div class="agent-card__row">' +
            '<span class="agent-badge" style="border:1.5px solid ' + a.color + ';color:' + a.color + '">' + a.code + '</span>' +
            agentTri(a.color) +
          '</div>' +
          '<div class="agent-card__cat">A0' + (i + 1) + ' · ' + esc(a.cat) + '</div>' +
          '<div class="agent-card__name">' + esc(a.app) + '</div>' +
          '<div class="agent-card__desc">' + esc(a.desc) + '</div>' +
          '<div class="agent-card__foot">' +
            '<span class="agent-card__ex">' + esc(a.ex) + '</span>' +
            '<span class="agent-card__open">Open →</span>' +
          '</div>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  /* ---- Orchestration flow diagram (fixed 1352x440, scaled to fit) ---- */
  (function buildFlow() {
    var diagram = document.getElementById('flowDiagram');
    if (!diagram) return;
    var rowY = function (i) { return 70 + i * 40; };          // 9 rows: 70..390

    // connector lines (ported from the design's flow geometry)
    function line(x1, y1, x2, y2, stroke, op, dash, arrow) {
      return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
        '" stroke="' + stroke + '" stroke-width="' + (arrow ? 1.7 : 1.4) + '" stroke-opacity="' + op + '"' +
        (dash ? ' stroke-dasharray="' + dash + '"' : '') + (arrow ? ' marker-end="url(#fa)"' : '') + '/>';
    }
    var svg = '<svg class="flow__lines" viewBox="0 0 1352 440" preserveAspectRatio="none">' +
      '<defs><marker id="fa" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L6 3 L0 6 Z" fill="#8A8475"/></marker></defs>';
    svg += line(172, 230, 206, 230, '#8A8475', 0.85, null, true);                       // you → hub
    svg += '<line x1="760" y1="70" x2="760" y2="390" stroke="#8A8475" stroke-width="1.6" stroke-opacity="0.5"/>'; // vertical bus
    HOME_AGENTS.forEach(function (a, i) { svg += line(382, 230, 496, rowY(i), a.color, 0.5, '3 5', false); }); // hub → agents
    HOME_AGENTS.forEach(function (a, i) { svg += line(676, rowY(i), 758, rowY(i), a.color, 0.5, '3 5', false); }); // agents → bus
    [110, 230, 350].forEach(function (y) { svg += line(762, y, 856, y, '#8A8475', 0.85, null, true); });     // bus → sources
    [110, 230, 350].forEach(function (y) { svg += line(1056, y, 1148, 230, '#8A8475', 0.85, null, true); }); // sources → answer
    svg += '</svg>';
    diagram.insertAdjacentHTML('afterbegin', svg);

    // 9 specialist agent nodes
    var nodes = HOME_AGENTS.map(function (a, i) {
      return '<div class="flow__agent" style="top:' + (rowY(i) - 15) + 'px">' +
        '<div class="flow__agent-card">' +
          '<span class="flow__agent-dot" style="background:' + a.color + '"></span>' +
          '<span class="flow__agent-name">' + esc(a.app) + '</span>' +
          '<span class="flow__agent-code">' + a.code + '</span>' +
        '</div></div>';
    }).join('');
    diagram.insertAdjacentHTML('beforeend', nodes);

    // mobile flow stack: 9 colored dots inside the orchestrator card
    var mdots = document.getElementById('flowMDots');
    if (mdots) mdots.innerHTML = HOME_AGENTS.map(function (a) {
      return '<span style="background:' + a.color + '"></span>';
    }).join('');

    // scale the fixed diagram down to fit its container
    var stage = diagram.parentNode;
    function fit() {
      var s = Math.min(1, stage.clientWidth / 1352);
      diagram.style.transform = 'scale(' + s + ')';
      stage.style.height = (440 * s) + 'px';
    }
    fit();
    window.addEventListener('resize', fit);
  })();

  /* ---- Comparison rows ---- */
  var cmp = document.getElementById('compareRows');
  if (cmp) {
    var xIcon = '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="10" r="9" fill="#FCE8E8"/><path d="M7 7 L13 13 M13 7 L7 13" stroke="#DC0015" stroke-width="1.8" stroke-linecap="round"/></svg>';
    var triIcon = '<svg viewBox="0 0 40 40" width="20" height="20"><defs><linearGradient id="pbcmp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#63A34A"/><stop offset="1" stop-color="#3E7A34"/></linearGradient></defs><path d="M20 4 L34 31 L6 31 Z" fill="none" stroke="url(#pbcmp)" stroke-width="2.4" stroke-linejoin="round"/><path d="M2 20 L15 20" stroke="#9DB58C" stroke-width="2" stroke-linecap="round"/><path d="M25 16 L38 14" stroke="#63A34A" stroke-width="2" stroke-linecap="round"/><path d="M25.5 20 L39 20" stroke="#4E7A3E" stroke-width="2" stroke-linecap="round"/><path d="M25 24 L38 26" stroke="#7FB861" stroke-width="2" stroke-linecap="round"/></svg>';
    cmp.innerHTML = T.COMPARE.map(function (c) {
      return '<div class="cmp-row">' +
        '<div class="cmp-row__q">' + esc(c.q) + '</div>' +
        '<div class="cmp-cell cmp-cell--generic">' + xIcon + '<span>' + esc(c.generic) + '</span></div>' +
        '<div class="cmp-cell cmp-cell--tellera">' + triIcon + '<span>' + esc(c.tellera) + '</span></div>' +
      '</div>';
    }).join('');
  }

  /* ---- Brand cards ---- */
  var bg = document.getElementById('brandGrid');
  if (bg) {
    bg.innerHTML = T.BRANDS.map(function (b) {
      return '<article class="brandcard">' +
        '<div class="brandcard__top" style="background:' + b.color + '"></div>' +
        '<div class="brandcard__body">' +
          '<div class="brandcard__name">' + esc(b.name) + '</div>' +
          '<div class="brandcard__cat" style="color:' + b.color + '">' + esc(b.cat) + '</div>' +
          '<div class="brandcard__desc">' + esc(b.desc) + '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ---- Record carousel ---- */
  var record = document.getElementById('record');
  var dotsWrap = document.getElementById('recordDots');
  var active = 0;
  function confColors(conf) {
    return conf === 'HIGH' ? { ink: '#357A46', bg: 'rgba(53,122,70,0.10)' }
         : conf === 'MEDIUM' ? { ink: '#9A6B1E', bg: 'rgba(154,107,30,0.10)' }
         : { ink: '#357A46', bg: 'rgba(53,122,70,0.10)' };
  }
  function set(el, sel, txt) { var n = el.querySelector('[data-rec="' + sel + '"]'); if (n) n.textContent = txt; }
  function renderRecord() {
    if (!record) return;
    var r = T.RECORDS[active];
    set(record, 'agent', r.agent);
    set(record, 'time', r.time);
    set(record, 'question', r.question);
    set(record, 'label', r.label);
    set(record, 'value', r.value);
    set(record, 'sub', r.sub);
    set(record, 'conf', r.conf);
    set(record, 'srchead', 'Sources');
    var cc = confColors(r.conf);
    var stamp = record.querySelector('[data-rec="stamp"]');
    stamp.style.border = '1px solid ' + cc.ink;
    stamp.style.color = cc.ink;
    stamp.style.background = cc.bg;
    var src = record.querySelector('[data-rec="sources"]');
    src.innerHTML = r.sources.map(function (s) {
      var off = s[1] === 1;
      var dot = off ? '#357A46' : '#C89A2E';
      var tk = off ? 'Official' : 'Third-party';
      var ti = off ? '#357A46' : '#9A6B1E';
      var tb = off ? 'rgba(53,122,70,0.10)' : 'rgba(154,107,30,0.10)';
      return '<div class="srcrow"><span class="srcrow__dot" style="background:' + dot + '"></span>' +
        '<span class="srcrow__name">' + esc(s[0]) + '</span>' +
        '<span class="srcrow__type" style="color:' + ti + ';background:' + tb + '">' + tk + '</span></div>';
    }).join('');
  }
  if (dotsWrap) {
    dotsWrap.innerHTML = T.RECORDS.map(function (_, i) {
      return '<button role="tab" aria-label="Example ' + (i + 1) + '" data-i="' + i + '" class="' + (i === 0 ? 'active' : '') + '"></button>';
    }).join('');
    dotsWrap.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      active = +b.getAttribute('data-i');
      Array.prototype.forEach.call(dotsWrap.children, function (c, i) { c.classList.toggle('active', i === active); });
      renderRecord();
    });
    renderRecord();
    // auto-advance
    setInterval(function () {
      active = (active + 1) % T.RECORDS.length;
      Array.prototype.forEach.call(dotsWrap.children, function (c, i) { c.classList.toggle('active', i === active); });
      renderRecord();
    }, 5000);
  }

  /* ---- Sample-question chips → fill ask bar ---- */
  var ph = document.querySelector('[data-ph]');
  document.querySelectorAll('.qchip[data-seed]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (ph) { ph.textContent = chip.getAttribute('data-seed'); ph.classList.add('filled'); }
    });
  });
  var askform = document.querySelector('[data-seed-target]');
  if (askform) askform.addEventListener('submit', function (e) {
    // let it navigate to deep-search; nothing to prevent
  });

  /* ---- Drag / wheel horizontal scroll on the agent rail ---- */
  document.querySelectorAll('[data-drag-scroll]').forEach(function (el) {
    el.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { el.scrollLeft += e.deltaY; e.preventDefault(); }
    }, { passive: false });
    var down = false, sx = 0, sl = 0, moved = false;
    el.addEventListener('pointerdown', function (e) {
      if (e.button && e.button !== 0) return;          // primary button only
      down = true; moved = false; sx = e.clientX; sl = el.scrollLeft;
      // NOTE: no setPointerCapture — it retargets the click and breaks card <a> navigation
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 4) { moved = true; el.style.cursor = 'grabbing'; }
      if (moved) el.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () { down = false; el.style.cursor = ''; });
    // only swallow the click if this was an actual drag, so plain clicks navigate
    el.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });

  /* ---- Mobile menu ---- */
  var burger = document.getElementById('burger');
  if (burger) {
    // build a slide-down menu once
    var menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.innerHTML = '<a href="#agents">Agents</a><a href="#developers">Developers</a><a href="#data">Our data</a><a href="#comparison">Trust</a><a href="#">Pricing</a><a href="#">Sign in</a><a href="/deep-search">Get started</a>';
    var nav = document.querySelector('.nav');
    nav.parentNode.insertBefore(menu, nav.nextSibling);
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('show');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') menu.classList.remove('show'); });
  }
})();
