/* Tellera Agent Portal — view switching + mock-data rendering. */
(function () {
  'use strict';
  var T = window.TELLERA_API;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var money = function (n) { return '$' + n.toFixed(2); };
  var num = function (n) { return n.toLocaleString('en-US'); };
  var bucketOf = function (k) { for (var i = 0; i < T.BUCKETS.length; i++) if (T.BUCKETS[i].key === k) return T.BUCKETS[i]; return { label: k, color: '#888' }; };
  function agentIcon(a) {
    if (a.iconSvg) return a.iconSvg;
    if (a.icon) return '<img src="' + a.icon + '" alt="">';
    return '<span style="font-weight:700;color:var(--ink-2)">' + esc(a.code || '') + '</span>';
  }
  function brandMark(p, big) {
    if (!p) return '<span class="pf-brandtxt">Live web index</span>';
    if (p.logo) return '<img class="pf-brandimg" src="' + p.logo + '" alt="' + esc(p.name) + '"' + (big ? ' style="height:20px"' : '') + '>';
    return '<span class="pf-brandtxt' + (big ? ' pf-brandtxt--big' : '') + '">' + esc(p.name) + '</span>';
  }

  /* ---------- view switching ---------- */
  function showView(v) {
    $$('.pf-view').forEach(function (s) { s.classList.toggle('active', s.getAttribute('data-view') === v); });
    $$('.pf-nav__item').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-view') === v); });
    var sc = $('.pf-scroll'); if (sc) sc.scrollTop = 0;
    var side = $('#pfSide'); if (side) side.classList.remove('open');
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('button[data-view], a[data-view]'); if (!el) return;
    if (el.tagName === 'A') e.preventDefault();
    showView(el.getAttribute('data-view'));
  });

  /* ---------- account switcher ---------- */
  var acctBtn = $('#acctBtn'), acctMenu = $('#acctMenu');
  if (acctBtn) acctBtn.addEventListener('click', function (e) { e.stopPropagation(); acctMenu.classList.toggle('open'); });
  document.addEventListener('click', function () { if (acctMenu) acctMenu.classList.remove('open'); });

  /* ---------- overview ---------- */
  function renderOverview() {
    var o = T.OVERVIEW;
    var tiles = [
      { k: 'Requests', v: num(o.requests), sub: 'last 30 days', ic: 'M4 19V5M4 15l4-4 4 3 6-7' },
      { k: 'Agents used', v: o.agents + ' / ' + T.AGENTS.length, sub: 'of your connectors', ic: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z' },
      { k: 'Endpoints used', v: o.endpoints, sub: 'across all agents', ic: 'M5 5h14M5 12h14M5 19h9' },
      { k: 'Plan usage', v: '83%', sub: num(o.planUsed) + ' / ' + num(o.planCalls) + ' calls', ic: 'M4 13h7V4H4zM13 20h7V4h-7z' }
    ];
    $('#pfTiles').innerHTML = tiles.map(function (t) {
      return '<div class="pf-tile"><div class="pf-tile__ic"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + t.ic + '"/></svg></div>' +
        '<div class="pf-tile__k">' + t.k + '</div><div class="pf-tile__v">' + t.v + '</div><div class="pf-tile__sub">' + t.sub + '</div></div>';
    }).join('');

    $('#pfRecent').innerHTML = T.RECENT.map(function (r) {
      var ok = r.status < 400;
      return '<tr><td><span class="pf-agentcell">' + esc(r.agent) + '</span></td>' +
        '<td><span class="pf-meth">' + r.m + '</span> <span class="pf-path">' + esc(r.path) + '</span></td>' +
        '<td><span class="pf-src">' + r.src + '</span></td>' +
        '<td><span class="pf-status pf-status--' + (ok ? 'ok' : 'err') + '"><span class="dot"></span>' + r.status + '</span></td>' +
        '<td class="r">' + money(r.price) + '</td><td class="r" style="color:var(--muted)">' + r.time + '</td></tr>';
    }).join('');

    var max = Math.max.apply(null, T.TOP.map(function (t) { return t.calls; }));
    $('#pfTop').innerHTML = T.TOP.map(function (t) {
      return '<div class="pf-rank__row"><div class="pf-rank__top"><span class="pf-rank__name">' + esc(t.app) + '</span><span class="pf-rank__n">' + num(t.calls) + ' calls</span></div>' +
        '<div class="pf-rank__bar"><div class="pf-rank__fill" style="width:' + Math.round(t.calls / max * 100) + '%;background:' + t.color + '"></div></div></div>';
    }).join('');

    $('#pfPlanNum').textContent = num(o.planUsed) + ' / ' + num(o.planCalls);
    $('#pfPlanFill').style.width = Math.round(o.planUsed / o.planCalls * 100) + '%';
  }

  /* ---------- first-login / getting started ---------- */
  var GS_SETUP = {
    mcp: { title: 'claude_desktop_config.json', code: '{\n  <span class="c-k">"mcpServers"</span>: {\n    <span class="c-k">"tellera"</span>: {\n      <span class="c-k">"url"</span>: <span class="c-g">"https://mcp.tellera.com"</span>,\n      <span class="c-k">"headers"</span>: { <span class="c-k">"Authorization"</span>: <span class="c-g">"Bearer $TELLERA_KEY"</span> }\n    }\n  }\n}' },
    sdk: { title: 'setup.ts', code: '<span class="c-b">import</span> Tellera <span class="c-b">from</span> <span class="c-g">"@tellera/sdk"</span>;\n\n<span class="c-b">const</span> t = <span class="c-b">new</span> <span class="c-v">Tellera</span>({ apiKey: process.env.<span class="c-k">TELLERA_KEY</span> });\n<span class="c-b">const</span> a = <span class="c-b">await</span> t.<span class="c-v">ask</span>(<span class="c-g">"Who owns 13 Roland Dr?"</span>);' },
    curl: { title: 'Terminal', code: '<span class="c-b">curl</span> https://api.tellera.com<span class="c-v">/v1/ask</span> \\\n  -H <span class="c-g">"Authorization: Bearer $TELLERA_KEY"</span> \\\n  -d <span class="c-g">\'{ "question": "Who owns 13 Roland Dr?" }\'</span>' }
  };
  function renderGettingStarted() {
    var chipEl = $('#pfGsChips');
    if (chipEl) {
      var chips = ['Who owns this address?', 'Skip-trace a person', 'Look up a phone number', 'Pull court records', 'Enrich a company'];
      chipEl.innerHTML = chips.map(function (c) { return '<button class="pf-gschip" data-q="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
    }
    var setupSeg = $('#pfGsSetupSeg'), setupCode = $('#pfGsSetupCode'), setupTitle = $('#pfGsSetupTitle');
    function setSetup(k) { if (setupCode) setupCode.innerHTML = GS_SETUP[k].code; if (setupTitle) setupTitle.textContent = GS_SETUP[k].title; }
    setSetup('mcp');
    if (setupSeg) setupSeg.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      setupSeg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); });
      setSetup(b.getAttribute('data-s'));
    });
    var agEl = $('#pfGsAgents');
    if (agEl) agEl.innerHTML = T.AGENTS.filter(function (a) { return a.badge !== 'Teaser'; }).map(function (a) {
      var prov = a.provider ? a.provider.name : 'Live web index';
      return '<button class="pf-gsagent" data-slug-open="' + a.slug + '"><span class="pf-gsagent__ic">' + agentIcon(a) + '</span><span><span class="pf-gsagent__n">' + esc(a.app) + '</span><span class="pf-gsagent__b">' + esc(prov) + '</span></span></button>';
    }).join('');
  }

  /* overview state toggle (prototype preview) */
  function setOvState(s) {
    var isNew = s !== 'active';
    var nEl = $('#pfOvNew'), aEl = $('#pfOvActive');
    if (nEl) nEl.hidden = !isNew;
    if (aEl) aEl.hidden = isNew;
    var seg = $('#pfOvSeg');
    if (seg) seg.querySelectorAll('button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-ov') === (isNew ? 'new' : 'active')); });
  }

  /* ---------- agents catalog ---------- */
  var activeBucket = 'all';
  function renderCats() {
    var cats = [{ key: 'all', label: 'All agents', n: T.AGENTS.length }].concat(T.BUCKETS.map(function (b) {
      return { key: b.key, label: b.label, n: T.AGENTS.filter(function (a) { return a.bucket === b.key; }).length };
    }));
    $('#pfCats').innerHTML = cats.map(function (c) {
      return '<button class="pf-cat' + (c.key === activeBucket ? ' active' : '') + '" data-bucket="' + c.key + '">' + esc(c.label) + '<span class="n">' + c.n + '</span></button>';
    }).join('');
    $$('#pfCats .pf-cat').forEach(function (b) { b.addEventListener('click', function () { activeBucket = b.getAttribute('data-bucket'); renderCats(); renderConns(); }); });
  }
  function renderConns() {
    var list = T.AGENTS.filter(function (a) { return activeBucket === 'all' || a.bucket === activeBucket; });
    $('#pfConns').innerHTML = list.map(function (a) {
      var bk = bucketOf(a.bucket);
      var badge = a.badge ? '<span class="pf-conn__badge pf-conn__badge--new">' + esc(a.badge) + '</span>' : '';
      var eps = a.endpoints.map(function (e) {
        return '<div class="pf-ep"><span class="pf-ep__m">' + e.m + '</span><span class="pf-ep__path">' + esc(e.path) + '</span><span class="pf-ep__price">$' + e.price.toFixed(2) + '</span></div>';
      }).join('');
      return '<div class="pf-conn" data-slug="' + a.slug + '"><div class="pf-conn__top"><span class="pf-conn__ic">' + agentIcon(a) + '</span>' +
        '<div style="min-width:0"><div class="pf-conn__name">' + esc(a.app) + '</div><div class="pf-conn__cat" style="color:' + bk.color + '">' + esc(bk.label) + '</div></div>' + badge + '</div>' +
        '<div class="pf-conn__desc">' + esc(a.desc) + '</div>' +
        '<div class="pf-conn__eps">' + eps + '</div>' +
        '<div class="pf-conn__priceline">from <b>$' + a.price.toFixed(2) + '</b>/call</div>' +
        '<div class="pf-conn__data"><div class="pf-conn__data-l"><div class="pf-conn__data-k">Featured data</div>' + brandMark(a.provider) + '</div><span class="pf-conn__go">View →</span></div></div>';
    }).join('');
  }
  function renderComing() {
    $('#pfComing').innerHTML = T.COMING.map(function (c) {
      var bk = bucketOf(c.bucket);
      return '<div class="pf-conn pf-conn--soon"><div class="pf-conn__top"><span class="pf-conn__ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="' + bk.color + '" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg></span>' +
        '<div style="min-width:0"><div class="pf-conn__name">' + esc(c.app) + '</div><div class="pf-conn__cat" style="color:' + bk.color + '">' + esc(bk.label) + '</div></div>' +
        '<span class="pf-conn__badge pf-conn__badge--soon">Coming soon</span></div>' +
        '<div class="pf-conn__desc">' + esc(c.desc) + '</div></div>';
    }).join('');
  }

  /* ---------- connect ---------- */
  var CONN = {
    mcp: { name: 'MCP', icon: 'M8 8l-4 4 4 4M16 8l4 4-4 4', apps: ['Claude', 'ChatGPT', 'Cursor'], server: 'https://mcp.tellera.com', label: 'SERVER URL',
      steps: ['Open Customize → Connectors in your app.', 'Select Add custom connector and paste the server URL.', 'Select Connect and sign in — then just ask.'] },
    cli: { name: 'CLI', icon: 'M5 7l5 5-5 5M12 17h7', apps: ['Codex', 'Claude Code', 'Cursor'], server: 'https://tellera.com/skill.md', label: 'TERMINAL',
      steps: ['Open the terminal your agent uses.', 'Set up the Tellera skill using the URL below.', 'Start a chat and ask your agent to use Tellera.'] },
    sdk: { name: 'SDK', icon: 'M9 8l-3 4 3 4M15 8l3 4-3 4', apps: ['Node', 'Python', 'Go'], server: 'npm install @tellera/sdk', label: 'INSTALL',
      steps: ['Install the Tellera SDK for your language.', 'Set TELLERA_API_KEY from your API keys.', 'Call any endpoint — auth and billing are handled.'] }
  };
  var connState = { opt: 'mcp', app: 'Claude' };
  function renderConnect() {
    $('#pfConnOpts').innerHTML = Object.keys(CONN).map(function (k) {
      var c = CONN[k];
      return '<button class="pf-opt' + (connState.opt === k ? ' active' : '') + '" data-opt="' + k + '"><span class="pf-opt__ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + c.icon + '"/></svg></span><div><div class="pf-opt__t">' + c.name + '</div><div class="pf-opt__d">' + (k === 'mcp' ? 'Chat apps &amp; agents' : k === 'cli' ? 'Terminal agents' : 'Your backend') + '</div></div></button>';
    }).join('');
    var apps = CONN[connState.opt].apps;
    if (apps.indexOf(connState.app) < 0) connState.app = apps[0];
    $('#pfApps').innerHTML = apps.map(function (a) {
      return '<button class="pf-app' + (connState.app === a ? ' active' : '') + '" data-app="' + esc(a) + '"><span class="pf-app__ic">' + esc(a.slice(0, 2)) + '</span>' + esc(a) + '</button>';
    }).join('');
    var c = CONN[connState.opt];
    $('#pfSteps').innerHTML =
      '<div>' + c.steps.map(function (s, i) { return '<div class="pf-step"><span class="pf-step__n">' + (i + 1) + '</span><span class="pf-step__t">' + s + '</span></div>'; }).join('') + '</div>' +
      '<div class="pf-code"><div class="pf-code__bar"><span class="pf-code__title">' + c.label + ' · ' + esc(connState.app) + '</span><button class="pf-code__copy">Copy</button></div>' +
      '<pre><span class="c-b">' + esc(c.server) + '</span></pre></div>';
    $$('#pfConnOpts .pf-opt').forEach(function (b) { b.addEventListener('click', function () { connState.opt = b.getAttribute('data-opt'); renderConnect(); }); });
    $$('#pfApps .pf-app').forEach(function (b) { b.addEventListener('click', function () { connState.app = b.getAttribute('data-app'); renderConnect(); }); });
  }

  /* ---------- usage ---------- */
  function renderUsage() {
    var cols = 30, segColors = ['#2B8A88', '#565C99', '#2E6BFF', '#8B5E3C'];
    var html = '';
    for (var i = 0; i < cols; i++) {
      var t = i / (cols - 1);
      var total = 24 + t * 120 + (i % 4) * 8;          // px, trending up
      var parts = [0.42, 0.26, 0.18, 0.14];
      var seg = parts.map(function (p, j) { return '<div class="pf-chart__seg" style="height:' + Math.round(total * p) + 'px;background:' + segColors[j] + (j === 0 ? '' : '') + '"></div>'; }).join('');
      html += '<div class="pf-chart__col" title="Sep ' + (i + 1) + '">' + seg + '</div>';
    }
    $('#pfChart').innerHTML = html;
    var labs = ['Aug 24', 'Sep 1', 'Sep 8', 'Sep 15', 'Sep 21'];
    $('#pfChartX').innerHTML = labs.map(function (l) { return '<span>' + l + '</span>'; }).join('');
    $('#pfUsageTable').innerHTML = T.USAGE_ROWS.map(function (r) {
      return '<tr><td><span class="pf-agentcell"><span class="pf-agentdot" style="background:' + r.color + '"></span>' + esc(r.app) + '</span></td><td class="r">' + num(r.calls) + '</td><td class="r" style="font-weight:700;color:var(--ink)">' + money(r.spend) + '</td></tr>';
    }).join('');
  }

  /* ---------- logs ---------- */
  function renderLogs() {
    $('#pfLogs').innerHTML = T.LOGS.map(function (r) {
      var ok = r.status < 400;
      return '<tr><td style="color:var(--muted);white-space:nowrap">' + esc(r.time) + '</td>' +
        '<td><span class="pf-agentcell">' + esc(r.agent) + '</span></td>' +
        '<td><span class="pf-meth">' + r.m + '</span></td>' +
        '<td><span class="pf-path">' + esc(r.path) + '</span></td>' +
        '<td><span class="pf-src">' + r.src + '</span></td>' +
        '<td><span class="pf-status pf-status--' + (ok ? 'ok' : 'err') + '"><span class="dot"></span>' + r.status + '</span></td>' +
        '<td class="r">' + money(r.price) + '</td></tr>';
    }).join('');
  }

  /* ---------- keys ---------- */
  var eyeSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>';
  var copySvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  var gearSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M4 12h2M18 12h2M12 4v2M12 18v2"/></svg>';
  var trashSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></svg>';
  function renderKeys() {
    $('#pfKeys').innerHTML =
      '<div class="pf-keyrow" style="font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted-2);">' +
        '<span>Name</span><span>Key</span><span>Created</span><span>Last used</span><span>Status</span><span></span></div>' +
      T.KEYS.map(function (k) {
        return '<div class="pf-keyrow"><span class="pf-keyrow__name">' + esc(k.name) + '<div style="font-size:11px;font-weight:400;color:var(--muted)">' + esc(k.scope) + '</div></span>' +
          '<span class="pf-keyrow__key">' + esc(k.key) + '<button title="Reveal">' + eyeSvg + '</button><button title="Copy">' + copySvg + '</button></span>' +
          '<span style="color:var(--muted)">' + esc(k.created) + '</span><span style="color:var(--muted)">' + esc(k.last) + '</span>' +
          '<span><span class="pf-pill pf-pill--active">' + esc(k.status) + '</span></span>' +
          '<span class="pf-keyrow__actions"><button title="Edit">' + gearSvg + '</button><button title="Revoke">' + trashSvg + '</button></span></div>';
      }).join('');
  }

  /* ---------- plans ---------- */
  var checkSvg = '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M5 12l4 4 10-11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var plansWithMon = false;
  function renderPlans() {
    $('#pfPlans').innerHTML = T.PLANS.map(function (p) {
      var badge = p.badge ? '<span class="pf-plan__badge">' + esc(p.badge) + '</span>' : '';
      var price = p.price, monNote = '', monFeat = '';
      if (plansWithMon) {
        if (p.mon && p.mon.add === 'custom') {
          monNote = '<div class="pf-plan__monnote">Monitoring included</div>';
          monFeat = '<li class="mon">' + checkSvg + '<span>Monitoring — ' + esc(p.mon.count) + ' · ' + esc(p.mon.cadence) + '</span></li>';
        } else if (p.mon) {
          var base = parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0;
          price = '$' + (base + p.mon.add);
          monNote = '<div class="pf-plan__monnote">includes +$' + p.mon.add + '/mo monitoring</div>';
          monFeat = '<li class="mon">' + checkSvg + '<span>Monitoring — ' + esc(p.mon.count) + ' · ' + esc(p.mon.cadence) + '</span></li>';
        } else {
          monNote = '<div class="pf-plan__monnote pf-plan__monnote--muted">Monitoring on Starter+</div>';
        }
      }
      return '<div class="pf-plan' + (p.current ? ' pf-plan--current' : '') + '">' + badge +
        '<div class="pf-plan__name">' + esc(p.name) + '</div>' +
        '<div class="pf-plan__price">' + esc(price) + '<span>' + esc(p.cadence) + '</span></div>' + monNote +
        '<div class="pf-plan__calls">' + esc(p.calls) + '</div><div class="pf-plan__over">' + esc(p.overage) + '</div>' +
        (p.seats ? '<div class="pf-plan__seats">' + esc(p.seats) + ' · shared usage</div>' : '') +
        '<ul class="pf-plan__feats">' + monFeat + p.features.map(function (f) { return '<li>' + checkSvg + '<span>' + esc(f) + '</span></li>'; }).join('') + '</ul>' +
        '<button class="pf-btn ' + (p.current ? 'pf-btn--ghost' : 'pf-btn--prism') + ' pf-plan__cta" data-plan="' + esc(p.name) + '"' + (p.current ? ' disabled style="opacity:.6"' : '') + '>' + esc(p.cta) + '</button></div>';
    }).join('');
    $$('#pfPlans .pf-plan__cta').forEach(function (b) {
      if (b.disabled) return;
      b.addEventListener('click', function () {
        var name = b.getAttribute('data-plan');
        if (name === 'Enterprise') { showView('support'); return; }
        openUpgrade(name);
      });
    });
  }

  /* ---------- integrations ---------- */
  function renderIntegrations() {
    $('#pfIntegr').innerHTML = T.INTEGRATIONS.map(function (it) {
      return '<div class="pf-integr__row"><span class="pf-integr__ic">' + esc(it.name.slice(0, 2)) + '</span>' +
        '<div style="flex:1"><div class="pf-integr__name">' + esc(it.name) + ' <span class="pf-integr__cat">' + esc(it.cat) + '</span></div><div class="pf-integr__desc">' + esc(it.desc) + '</div></div>' +
        '<button class="pf-btn pf-btn--ghost">Connect</button></div>';
    }).join('');
  }

  /* ---------- endpoint / agent detail ---------- */
  function agentBySlug(s) { if (s === 'ask') return T.ASK; for (var i = 0; i < T.AGENTS.length; i++) if (T.AGENTS[i].slug === s) return T.AGENTS[i]; return null; }
  function sampleVal(n) {
    var m = { name: '"Martin R. Decker"', state: '"TX"', city: '"Austin"', age: '52', address: '"1234 Oakridge Dr, Austin TX"',
      number: '"(512) 555-0142"', vin: '"1FTFW1E5XKFA00000"', query: '"latest news on Ramp"', person_id: '"prs_8c21f0"',
      limit: '10', recency: '"week"', county: '"Travis"', type: '"person"' };
    return m[n] !== undefined ? m[n] : '"…"';
  }
  function jsonBody(all) { return all.map(function (p) { return '    <span class="c-k">"' + p.n + '"</span>: <span class="c-g">' + sampleVal(p.n) + '</span>'; }).join(',\n'); }
  function codeFor(ep, kind) {
    var all = ep.params || [];
    if (kind === 'curl') {
      if (ep.m === 'GET') {
        var qs = all.slice(0, 2).map(function (p) { return p.n + '=' + sampleVal(p.n).replace(/"/g, '').replace(/ /g, '%20'); }).join('&');
        return '<span class="c-b">$</span> curl <span class="c-g">"https://api.tellera.com' + ep.path + (qs ? '?' + qs : '') + '"</span> \\\n  -H <span class="c-g">"Authorization: Bearer $TELLERA_KEY"</span>';
      }
      return '<span class="c-b">$</span> curl https://api.tellera.com<span class="c-v">' + ep.path + '</span> \\\n  -H <span class="c-g">"Authorization: Bearer $TELLERA_KEY"</span> \\\n  -d <span class="c-g">\x27</span>{\n' + jsonBody(all) + '\n}<span class="c-g">\x27</span>';
    }
    if (kind === 'sdk') {
      var args = all.map(function (p) { return '  <span class="c-k">' + p.n + '</span>: <span class="c-g">' + sampleVal(p.n) + '</span>'; }).join(',\n');
      return 'import Tellera from <span class="c-g">"@tellera/sdk"</span>;\n\nconst tellera = new Tellera({ apiKey: process.env.TELLERA_API_KEY });\n\nconst res = await tellera.<span class="c-v">call</span>(<span class="c-g">"' + ep.name + '"</span>, {\n' + args + '\n});';
    }
    return '{\n  <span class="c-k">"tool"</span>: <span class="c-g">"' + ep.name + '"</span>,\n  <span class="c-k">"arguments"</span>: {\n' + jsonBody(all) + '\n  }\n}';
  }
  var chatSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1.1-4A8 8 0 1 1 21 12z"/></svg>';
  function openEndpoint(slug) {
    var a = agentBySlug(slug); if (!a) return;
    var bk = bucketOf(a.bucket);
    var firstPrompt = (a.prompts && a.prompts[0]) || '';
    var badge = a.badge ? '<span class="pf-conn__badge pf-conn__badge--new" style="position:static;display:inline-block;margin-left:10px;">' + esc(a.badge) + '</span>' : '';
    var hero = '<div class="pf-ephero"><span class="pf-ephero__ic">' + agentIcon(a) + '</span>' +
      '<div class="pf-ephero__main"><div class="pf-ephero__name">' + esc(a.app) + badge + '</div>' +
      '<div class="pf-ephero__cat" style="color:' + bk.color + '">' + esc(bk.label) + '</div>' +
      '<div class="pf-ephero__desc">' + esc(a.desc) + '</div>' +
      '<div class="pf-ephero__meta"><span><b>' + a.endpoints.length + '</b> endpoint' + (a.endpoints.length > 1 ? 's' : '') + '</span><span>from <b>$' + a.price.toFixed(2) + '</b>/call</span><span>REST · MCP · SDK</span></div>' +
      (a.provider ? '<div class="pf-ephero__prov"><span class="pf-ephero__prov-k">Featured data</span>' + brandMark(a.provider, true) + '</div>' : '') + '</div>' +
      '<div class="pf-ephero__actions"><a class="pf-trychat" href="/deep-search?q=' + encodeURIComponent(firstPrompt) + '">' + chatSvg + 'Try in Tellera Chat</a>' +
      '<a class="pf-btn pf-btn--ghost" data-view="keys" href="#" style="justify-content:center">Get API key</a></div></div>';
    var blocks = a.endpoints.map(function (ep, ei) {
      var params = (ep.params || []).map(function (p) {
        return '<tr><td style="font-family:var(--font-mono);color:var(--ink)">' + esc(p.n) + (p.req ? ' <span style="color:#B0402F">*</span>' : '') + '</td><td style="font-family:var(--font-mono);color:var(--muted)">' + esc(p.t) + '</td><td>' + esc(p.d) + '</td></tr>';
      }).join('');
      var id = 'ep' + ei;
      return '<div class="pf-epblock"><div class="pf-epblock__head"><span class="pf-meth">' + ep.m + '</span><span class="pf-epblock__name">' + esc(ep.path) + '</span><span class="pf-epblock__price">$' + ep.price.toFixed(2) + ' / call</span></div>' +
        '<div class="pf-epblock__desc">' + esc(ep.desc) + '</div>' +
        '<div class="pf-eplabel">Parameters</div><table class="pf-table"><thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead><tbody>' + params + '</tbody></table>' +
        '<div class="pf-eplabel">Example request</div>' +
        '<div class="pf-tabs" data-tabs="' + id + '"><button class="pf-tab active" data-k="curl">cURL</button><button class="pf-tab" data-k="sdk">SDK</button><button class="pf-tab" data-k="mcp">MCP</button></div>' +
        '<div class="pf-tabbody"><pre data-body="' + id + '">' + codeFor(ep, 'curl') + '</pre></div></div>';
    }).join('');
    var prompts = '<div class="pf-epblock"><div class="pf-epblock__head"><span class="pf-epblock__name" style="font-family:inherit;font-size:16px;font-weight:700">Sample prompts</span></div>' +
      '<div class="pf-epblock__desc">Try these in Tellera Chat — the agent picks the right endpoint automatically.</div>' +
      '<div class="pf-prompts" style="margin-top:14px">' + (a.prompts || []).map(function (p) {
        return '<div class="pf-prompt"><span class="pf-prompt__q">"' + esc(p) + '"</span><a class="pf-trychat" href="/deep-search?q=' + encodeURIComponent(p) + '">' + chatSvg + 'Try in chat</a></div>';
      }).join('') + '</div></div>';
    var host = $('#pfEpDetail');
    host.innerHTML = hero + blocks + prompts;
    host.__eps = a.endpoints;
    showView('endpoint');
  }

  /* ---------- upgrade modal ---------- */
  var upModal = $('#upgradeModal');
  function openUpgrade(planName) {
    var p = null; T.PLANS.forEach(function (x) { if (x.name === planName) p = x; });
    if (!p) T.PLANS.forEach(function (x) { if (x.name === 'Scale') p = x; });
    if (!p) return;
    if (p.name === 'Enterprise') { showView('support'); return; }
    $('#upTitle').textContent = 'Upgrade to ' + p.name;
    $('#upPlan').textContent = p.name + ' — ' + p.price + ' ' + p.cadence;
    $('#upCalls').textContent = p.calls;
    $('#upOver').textContent = p.overage;
    $('#upDue').textContent = p.name === 'Scale' ? '$412.06' : (p.name === 'Sandbox' ? '$0.00' : '$' + (p.price.replace(/[^0-9.]/g, '') || '0') + '.00');
    upModal.classList.add('open');
  }

  /* ---------- add credits modal ---------- */
  var creditModal = $('#creditModal'), creditAmt = 50;
  function renderCreditAmts() {
    $('#creditAmts').innerHTML = T.CREDITS.presets.map(function (a) {
      return '<button class="pf-credit__amt' + (a === creditAmt ? ' active' : '') + '" data-amt="' + a + '">$' + a + '</button>';
    }).join('');
    $$('#creditAmts .pf-credit__amt').forEach(function (b) {
      b.addEventListener('click', function () { creditAmt = +b.getAttribute('data-amt'); renderCreditAmts(); $('#creditConfirm').textContent = 'Add $' + creditAmt + ' in credits'; });
    });
  }
  function openCredits() { $('#creditBal').textContent = '$' + T.CREDITS.balance.toFixed(2); renderCreditAmts(); $('#creditConfirm').textContent = 'Add $' + creditAmt + ' in credits'; creditModal.classList.add('open'); }

  /* ---------- ask playground ---------- */
  function askCode(q, kind) {
    var qq = esc(q);
    if (kind === 'curl') return '<span class="c-b">$</span> curl https://api.tellera.com<span class="c-v">/v1/ask</span> \\\n  -H <span class="c-g">"Authorization: Bearer $TELLERA_KEY"</span> \\\n  -d <span class="c-g">\x27</span>{ <span class="c-k">"question"</span>: <span class="c-g">"' + qq + '"</span> }<span class="c-g">\x27</span>';
    if (kind === 'py') return '<span class="c-b">from</span> tellera <span class="c-b">import</span> Tellera\n\ntellera = <span class="c-v">Tellera</span>(api_key=<span class="c-g">"$TELLERA_KEY"</span>)\nres = tellera.<span class="c-v">ask</span>(<span class="c-g">"' + qq + '"</span>)\n<span class="c-v">print</span>(res.answer, res.confidence, res.sources)';
    if (kind === 'js' || kind === 'sdk') return '<span class="c-b">import</span> Tellera <span class="c-b">from</span> <span class="c-g">"@tellera/sdk"</span>;\n\n<span class="c-b">const</span> tellera = <span class="c-b">new</span> <span class="c-v">Tellera</span>({ apiKey: process.env.<span class="c-k">TELLERA_KEY</span> });\n<span class="c-b">const</span> res = <span class="c-b">await</span> tellera.<span class="c-v">ask</span>(<span class="c-g">"' + qq + '"</span>);\nconsole.<span class="c-v">log</span>(res.answer, res.confidence, res.sources);';
    return '{\n  <span class="c-k">"tool"</span>: <span class="c-g">"ask"</span>,\n  <span class="c-k">"arguments"</span>: { <span class="c-k">"question"</span>: <span class="c-g">"' + qq + '"</span> }\n}';
  }
  /* plain-text prompt+context blob to paste into an LLM */
  function askAIContext(q) {
    return [
      'I\'m integrating the Tellera API. Here\'s the endpoint and my request — please write the integration and explain the response shape.',
      '',
      '## Endpoint',
      'POST https://api.tellera.com/v1/ask (orchestrator).',
      'Send a plain-language question; Tellera routes it to the right specialist agents (People, Property, Phone, Court, Business, and more), cross-checks the record, and returns one synthesized answer with a confidence score and cited sources.',
      '',
      '## Auth',
      'Header: Authorization: Bearer $TELLERA_KEY',
      '',
      '## Example request (cURL)',
      'curl https://api.tellera.com/v1/ask \\',
      '  -H "Authorization: Bearer $TELLERA_KEY" \\',
      '  -d \'{ "question": "' + q + '" }\'',
      '',
      '## Example response',
      '{ "answer": "…", "confidence": "high", "sources": [ { "name": "…", "url": "…" } ] }',
      '',
      '## My question',
      '"' + q + '"'
    ].join('\n');
  }
  function flashCopied(btn, label) {
    if (!btn) return;
    if (!btn.__html) btn.__html = btn.innerHTML;
    btn.classList.add('copied');
    btn.textContent = label || 'Copied!';
    clearTimeout(btn.__t);
    btn.__t = setTimeout(function () { btn.classList.remove('copied'); btn.innerHTML = btn.__html; }, 1400);
  }
  function copyText(txt, btn, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).catch(function () {});
    flashCopied(btn, label);
  }
  function initPlayground() {
    var chips = $('#pfPlayChips'), input = $('#pfPlayInput'), out = $('#pfPlayOut'), code = $('#pfPlayCode'), tabs = $('#pfPlayTabs'), chat = $('#pfPlayChat'), run = $('#pfPlayRun');
    if (!input) return;
    if (chips) chips.innerHTML = T.ASK.prompts.map(function (p) { return '<button class="pf-play__chip" data-q="' + esc(p) + '">' + esc(p) + '</button>'; }).join('');
    var current = '';
    function go() {
      var q = (input.value || '').trim() || T.ASK.prompts[0];
      current = q;
      code.innerHTML = askCode(q, 'curl');
      tabs.querySelectorAll('.pf-tab').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-k') === 'curl'); });
      if (chat) chat.setAttribute('href', '/deep-search?q=' + encodeURIComponent(q));
      out.classList.add('show');
    }
    if (run) run.addEventListener('click', go);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go(); } });
    if (chips) chips.addEventListener('click', function (e) { var b = e.target.closest('.pf-play__chip'); if (!b) return; input.value = b.getAttribute('data-q'); go(); });
    if (tabs) tabs.addEventListener('click', function (e) { var t = e.target.closest('.pf-tab'); if (!t) return; tabs.querySelectorAll('.pf-tab').forEach(function (b) { b.classList.toggle('active', b === t); }); code.innerHTML = askCode(current || T.ASK.prompts[0], t.getAttribute('data-k')); });
    var copyAI = $('#pfPlayCopyAI');
    if (copyAI) copyAI.addEventListener('click', function () { copyText(askAIContext(current || T.ASK.prompts[0]), copyAI, 'Copied for AI'); });
  }

  /* ---------- monitors ---------- */
  function renderMonitors() {
    var el = $('#pfMon'); if (!el) return;
    var head = '<div class="pf-mon__row pf-mon__row--h"><span>Subject</span><span>Agent</span><span>Trigger</span><span>Delivery</span><span>Status</span><span></span></div>';
    el.innerHTML = head + T.MONITORS.map(function (m) {
      var paused = m.status === 'Paused';
      return '<div class="pf-mon__row"><span class="pf-mon__subj">' + esc(m.subject) + '</span>' +
        '<span class="pf-mon__agent">' + esc(m.agent) + '</span>' +
        '<span class="pf-mon__trig">' + esc(m.trigger) + '</span>' +
        '<span class="pf-mon__deliv"><b>' + esc(m.delivery) + '</b>' + (m.dest ? ' · ' + esc(m.dest) : '') + '</span>' +
        '<span><span class="pf-pill ' + (paused ? 'pf-pill--paused' : 'pf-pill--active') + '">' + esc(m.status) + '</span></span>' +
        '<span class="pf-mon__actions"><button title="Edit">' + gearSvg + '</button><button title="Delete">' + trashSvg + '</button></span></div>';
    }).join('');
    var wh = $('#pfWebhook');
    if (wh) {
      var w = T.WEBHOOKS;
      wh.innerHTML = '<div class="pf-webhook__row"><span class="pf-webhook__k">Endpoint URL</span><span class="pf-webhook__v">' + esc(w.url) + '</span></div>' +
        '<div class="pf-webhook__row"><span class="pf-webhook__k">Signing secret</span><span class="pf-webhook__v">' + esc(w.secret) + '</span></div>' +
        '<div class="pf-webhook__row"><span class="pf-webhook__k">Events</span><span class="pf-evt">' + w.events.map(function (e) { return '<span>' + esc(e) + '</span>'; }).join('') + '</span></div>';
    }
  }
  var monModal = $('#monitorModal');
  function openMonitor() {
    var sel = $('#monAgent');
    if (sel && !sel.__filled) { sel.innerHTML = T.AGENTS.map(function (a) { return '<option>' + esc(a.app) + '</option>'; }).join(''); sel.__filled = true; }
    if ($('#monSubject')) $('#monSubject').value = '';
    monModal.classList.add('open');
  }

  /* ---------- edit profile / company ---------- */
  var profModal = $('#profileModal'), compModal = $('#companyModal');
  function acGet(id) { var e = $(id); return e ? e.textContent.trim() : ''; }
  function acSet(id, v) { var e = $(id); if (e) e.textContent = v; }
  function openProfile() {
    $('#fName').value = acGet('#acNameV'); $('#fEmail').value = acGet('#acEmail'); $('#fEmail2').value = acGet('#acEmail2'); $('#fPhone').value = acGet('#acPhone'); $('#fTitle').value = acGet('#acTitle');
    profModal.classList.add('open');
  }
  function saveProfile() {
    var n = $('#fName').value.trim() || '—', e = $('#fEmail').value.trim();
    acSet('#acNameV', n); acSet('#acName', n); acSet('#acEmailTop', e); acSet('#acEmail', e);
    acSet('#acEmail2', $('#fEmail2').value.trim() || '—'); acSet('#acPhone', $('#fPhone').value.trim()); acSet('#acTitle', $('#fTitle').value.trim());
    var ini = (n.charAt(0) || '—').toUpperCase(); acSet('#acAvatar', ini);
    var un = document.querySelector('.pf-user__name'); if (un) un.textContent = n;
    var uav = document.querySelector('.pf-user__avatar'); if (uav) uav.textContent = ini;
    profModal.classList.remove('open');
  }
  function openCompany() {
    $('#cCompany').value = acGet('#acCompany'); $('#cWebsite').value = acGet('#acWebsite'); $('#cIndustry').value = acGet('#acIndustry'); $('#cUseCase').value = acGet('#acUseCase'); $('#cWorkPhone').value = acGet('#acWorkPhone');
    var sel = $('#cTeam'), cur = acGet('#acTeam'); for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].text === cur) sel.selectedIndex = i; }
    compModal.classList.add('open');
  }
  function saveCompany() {
    acSet('#acCompany', $('#cCompany').value.trim()); acSet('#acWebsite', $('#cWebsite').value.trim()); acSet('#acIndustry', $('#cIndustry').value.trim());
    acSet('#acTeam', $('#cTeam').value); acSet('#acUseCase', $('#cUseCase').value.trim()); acSet('#acWorkPhone', $('#cWorkPhone').value.trim());
    compModal.classList.remove('open');
  }

  /* ---------- team & seats ---------- */
  var MEMBERS = [
    { name: 'Shawn Siegel', email: 'ssiegel@ltvco.com', role: 'Owner', status: 'Active', initial: 'S' },
    { name: 'Jordan Lee', email: 'jordan@ltvco.com', role: 'Admin', status: 'Active', initial: 'J' },
    { name: 'Priya Nair', email: 'priya@ltvco.com', role: 'Developer', status: 'Active', initial: 'P' },
    { name: 'Pending invite', email: 'newhire@ltvco.com', role: 'Developer', status: 'Invited', initial: '?' }
  ];
  var SEAT_CAP = 5, invModal = $('#inviteModal');
  function renderMembers() {
    var el = $('#pfMembers'); if (!el) return;
    el.innerHTML = MEMBERS.map(function (m) {
      var pending = m.status === 'Invited';
      return '<div class="pf-member"><span class="pf-member__av' + (pending ? ' pf-member__av--pending' : '') + '">' + esc(m.initial) + '</span>' +
        '<div style="min-width:0"><div class="pf-member__name">' + esc(m.name) + '</div><div class="pf-member__email">' + esc(m.email) + '</div></div>' +
        '<span class="pf-member__role">' + esc(m.role) + '</span>' +
        '<span class="pf-member__status pf-member__status--' + (pending ? 'invited' : 'active') + '">' + esc(m.status) + '</span>' +
        (m.role === 'Owner' ? '<span style="width:28px;flex:0 0 auto"></span>' : '<button class="pf-member__x" title="Remove seat" data-rm="' + esc(m.email) + '">✕</button>') + '</div>';
    }).join('');
    var used = MEMBERS.length;
    var v = $('#pfSeatV'); if (v) v.textContent = used + ' of ' + SEAT_CAP + ' seats' + (used > SEAT_CAP ? ' · ' + (used - SEAT_CAP) + ' over' : '');
    var fill = $('#pfSeatFill'); if (fill) fill.style.width = Math.min(used / SEAT_CAP, 1) * 100 + '%';
    var note = $('#pfSeatNote'); if (note) note.textContent = used > SEAT_CAP
      ? ((used - SEAT_CAP) + ' seat' + (used - SEAT_CAP > 1 ? 's' : '') + ' over your plan · billed at $19/seat / mo.')
      : ('Pro includes ' + SEAT_CAP + ' seats · additional seats $19/seat / mo.');
    el.querySelectorAll('[data-rm]').forEach(function (b) { b.addEventListener('click', function () { var em = b.getAttribute('data-rm'); MEMBERS = MEMBERS.filter(function (x) { return x.email !== em; }); renderMembers(); }); });
  }
  function openInvite() { if ($('#invEmail')) $('#invEmail').value = ''; invModal.classList.add('open'); }

  /* ---------- cancel modal ---------- */
  var modal = $('#cancelModal');
  function openModal() { modal.classList.add('open'); }
  function closeModal() { modal.classList.remove('open'); }
  var cb = $('#pfCancelBtn'); if (cb) cb.addEventListener('click', openModal);
  var keep = $('#pfCancelKeep'); if (keep) keep.addEventListener('click', closeModal);
  var conf = $('#pfCancelConfirm'); if (conf) conf.addEventListener('click', function () {
    closeModal();
    var sec = $('.pf-danger'); if (sec) sec.innerHTML = '<div class="pf-acctsec__h" style="color:#357A46">Subscription cancelled</div><p style="font-size:14px;line-height:1.6;color:var(--ink-2)">Your Pro plan is set to cancel on <b>Oct 2, 2026</b>. You\'ll keep full access until then, and can resubscribe anytime.</p>';
  });
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

  /* ---------- mobile ---------- */
  var side = $('#pfSide'), tog = $('#pfToggle'), col = $('#pfCollapse');
  if (tog && side) tog.addEventListener('click', function () { side.classList.toggle('open'); });
  if (col && side) col.addEventListener('click', function () { side.classList.remove('open'); });

  /* ---------- boot ---------- */
  renderOverview(); renderGettingStarted(); renderCats(); renderConns(); renderComing(); renderConnect();

  /* overview preview toggle + getting-started ask bar */
  var ovSeg = $('#pfOvSeg');
  if (ovSeg) ovSeg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setOvState(b.getAttribute('data-ov')); });
  var gsAsk = $('#pfGsAsk'), gsChips = $('#pfGsChips');
  function gsGo(q) {
    var play = $('#pfPlayInput');
    if (play && q) { play.value = q; var run = $('#pfPlayRun'); if (run) run.click(); }
    showView('playground');
  }
  if (gsAsk) gsAsk.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); gsGo((gsAsk.value || '').trim()); } });
  var gsGoBtn = document.querySelector('.pf-gsask__go');
  if (gsGoBtn) gsGoBtn.addEventListener('click', function (e) { e.preventDefault(); gsGo((gsAsk && gsAsk.value || '').trim() || 'Who owns 13 Roland Dr, White Plains NY?'); });
  if (gsChips) gsChips.addEventListener('click', function (e) { var b = e.target.closest('.pf-gschip'); if (b) { if (gsAsk) gsAsk.value = b.getAttribute('data-q'); gsGo(b.getAttribute('data-q')); } });
  renderUsage(); renderLogs(); renderKeys(); renderPlans(); renderIntegrations();

  var navBadge = document.querySelector('.pf-nav__item[data-view="agents"] .pf-nav__badge');
  if (navBadge) navBadge.textContent = T.AGENTS.length;

  var connsEl = $('#pfConns');
  if (connsEl) connsEl.addEventListener('click', function (e) { var c = e.target.closest('.pf-conn[data-slug]'); if (c) openEndpoint(c.getAttribute('data-slug')); });

  var epHost = $('#pfEpDetail');
  if (epHost) epHost.addEventListener('click', function (e) {
    var t = e.target.closest('.pf-tab'); if (!t) return;
    var tabs = t.closest('.pf-tabs'); var id = tabs.getAttribute('data-tabs'); var idx = +id.replace('ep', '');
    tabs.querySelectorAll('.pf-tab').forEach(function (b) { b.classList.toggle('active', b === t); });
    var pre = epHost.querySelector('pre[data-body="' + id + '"]');
    if (pre && epHost.__eps && epHost.__eps[idx]) pre.innerHTML = codeFor(epHost.__eps[idx], t.getAttribute('data-k'));
  });

  var ovUp = $('#pfOverviewUpgrade'); if (ovUp) ovUp.addEventListener('click', function () { openUpgrade('Scale'); });
  var upCancel = $('#upCancel'); if (upCancel) upCancel.addEventListener('click', function () { upModal.classList.remove('open'); });
  var upConfirm = $('#upConfirm'); if (upConfirm) upConfirm.addEventListener('click', function () { upModal.classList.remove('open'); });
  if (upModal) upModal.addEventListener('click', function (e) { if (e.target === upModal) upModal.classList.remove('open'); });

  var addCred = $('#pfAddCredits'); if (addCred) addCred.addEventListener('click', openCredits);
  var addCred2 = $('#pfUsageCredits'); if (addCred2) addCred2.addEventListener('click', openCredits);
  var crCancel = $('#creditCancel'); if (crCancel) crCancel.addEventListener('click', function () { creditModal.classList.remove('open'); });
  var crConfirm = $('#creditConfirm'); if (crConfirm) crConfirm.addEventListener('click', function () {
    T.CREDITS.balance += creditAmt; $('#creditBal').textContent = '$' + T.CREDITS.balance.toFixed(2); creditModal.classList.remove('open');
  });
  if (creditModal) creditModal.addEventListener('click', function (e) { if (e.target === creditModal) creditModal.classList.remove('open'); });

  renderMonitors(); initPlayground();

  var planToggle = $('#pfPlanToggle');
  if (planToggle) planToggle.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    plansWithMon = b.getAttribute('data-mon') === '1';
    planToggle.querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); });
    renderPlans();
  });

  var askView = $('#pfAskView'); if (askView) askView.addEventListener('click', function () { openEndpoint('ask'); });
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-slug-open]'); if (b) openEndpoint(b.getAttribute('data-slug-open')); });

  var newMon = $('#pfNewMonitor'); if (newMon) newMon.addEventListener('click', openMonitor);
  var monCancel = $('#monCancel'); if (monCancel) monCancel.addEventListener('click', function () { monModal.classList.remove('open'); });
  var monConfirm = $('#monConfirm'); if (monConfirm) monConfirm.addEventListener('click', function () {
    var dv = ($('#monDelivery').value || '').split(' · ');
    T.MONITORS.unshift({ subject: ($('#monSubject').value || '').trim() || 'New watch', agent: $('#monAgent').value, trigger: $('#monTrigger').value, delivery: dv[0], dest: dv[1] || '', status: 'Active', last: 'just now' });
    renderMonitors(); monModal.classList.remove('open');
  });
  if (monModal) monModal.addEventListener('click', function (e) { if (e.target === monModal) monModal.classList.remove('open'); });

  var editProf = $('#pfEditProfile'); if (editProf) editProf.addEventListener('click', openProfile);
  var profCancel = $('#profCancel'); if (profCancel) profCancel.addEventListener('click', function () { profModal.classList.remove('open'); });
  var profSave = $('#profSave'); if (profSave) profSave.addEventListener('click', saveProfile);
  if (profModal) profModal.addEventListener('click', function (e) { if (e.target === profModal) profModal.classList.remove('open'); });

  var editComp = $('#pfEditCompany'); if (editComp) editComp.addEventListener('click', openCompany);
  var compCancel = $('#compCancel'); if (compCancel) compCancel.addEventListener('click', function () { compModal.classList.remove('open'); });
  var compSave = $('#compSave'); if (compSave) compSave.addEventListener('click', saveCompany);
  if (compModal) compModal.addEventListener('click', function (e) { if (e.target === compModal) compModal.classList.remove('open'); });

  renderMembers();
  var inviteBtn = $('#pfInvite'); if (inviteBtn) inviteBtn.addEventListener('click', openInvite);
  var invCancel = $('#invCancel'); if (invCancel) invCancel.addEventListener('click', function () { invModal.classList.remove('open'); });
  var invSend = $('#invSend'); if (invSend) invSend.addEventListener('click', function () {
    var e = ($('#invEmail').value || '').trim(); if (!e) { $('#invEmail').focus(); return; }
    MEMBERS.push({ name: 'Pending invite', email: e, role: $('#invRole').value, status: 'Invited', initial: '?' });
    renderMembers(); invModal.classList.remove('open');
  });
  if (invModal) invModal.addEventListener('click', function (e) { if (e.target === invModal) invModal.classList.remove('open'); });
})();
