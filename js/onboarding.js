/* Tellera — developer onboarding. Three chip questions -> generated setup config.
   Mock only: selections persist to localStorage and tailor the portal copy. */
(function () {
  'use strict';
  var T = window.TELLERA_API || {};
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };

  var TOOLS = ['Claude', 'Cursor', 'Claude Code', 'ChatGPT', 'Codex', 'VS Code', 'LangChain', 'Other'];
  var CONNS = ['MCP server', 'REST API', 'Python SDK', 'JavaScript SDK', 'cURL', 'n8n / Zapier'];
  var USES = [
    'People & identity', 'Property research', 'Vehicle / VIN', 'Phone & caller ID',
    'Court & legal', 'Lead / CRM enrichment', 'KYC & onboarding', 'Fraud & trust',
    'Skip tracing', 'Web research', 'Not sure yet'
  ];

  var state = { tool: 'Claude', conn: 'MCP server', use: [], desc: '' };

  function chip(label, on) {
    return '<button class="ob__chip' + (on ? ' selected' : '') + '" data-v="' + esc(label) + '"><span class="d"></span>' + esc(label) + '</button>';
  }
  function renderChips() {
    $('#obTool').innerHTML = TOOLS.map(function (t) { return chip(t, state.tool === t); }).join('');
    $('#obConn').innerHTML = CONNS.map(function (c) { return chip(c, state.conn === c); }).join('');
    $('#obUse').innerHTML = USES.map(function (u) { return chip(u, state.use.indexOf(u) > -1); }).join('');
  }
  renderChips();

  $('#obTool').addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (b) { state.tool = b.getAttribute('data-v'); renderChips(); } });
  $('#obConn').addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (b) { state.conn = b.getAttribute('data-v'); renderChips(); } });
  $('#obUse').addEventListener('click', function (e) {
    var b = e.target.closest('[data-v]'); if (!b) return;
    var v = b.getAttribute('data-v'), i = state.use.indexOf(v);
    if (i > -1) state.use.splice(i, 1); else state.use.push(v);
    renderChips();
  });

  /* map a chosen use case -> a specialist slug so the generated sample is relevant */
  var USE_SLUG = {
    'People & identity': 'people', 'Property research': 'property', 'Vehicle / VIN': 'vehicle',
    'Phone & caller ID': 'phone', 'Court & legal': 'court', 'Lead / CRM enrichment': 'business',
    'KYC & onboarding': 'people', 'Fraud & trust': 'safety', 'Skip tracing': 'people', 'Web research': 'web-search'
  };
  var SAMPLE = {
    people: 'Who is Jordan Blake in Austin, TX?',
    property: 'Who owns 13 Roland Dr, Phoenix AZ?',
    vehicle: 'What\'s the history on VIN 1HGCM82633A004352?',
    phone: 'Who does (512) 555-0142 belong to?',
    court: 'Any court records for Jordan Blake in Travis County?',
    business: 'Enrich acme-supply.com — owners, size, filings.',
    safety: 'Any fraud or watchlist flags on this applicant?',
    'web-search': 'What\'s been written about Acme Supply this year?'
  };
  function pickSlug() {
    for (var i = 0; i < state.use.length; i++) { if (USE_SLUG[state.use[i]]) return USE_SLUG[state.use[i]]; }
    return 'people';
  }

  function bar(title) {
    return '<div class="dv-code__bar"><span class="dv-code__dot" style="background:#FF5F57"></span><span class="dv-code__dot" style="background:#FEBC2E"></span><span class="dv-code__dot" style="background:#28C840"></span><span class="dv-code__title">' + esc(title) + '</span></div>';
  }
  function code(title, pre) { return '<div class="dv-code">' + bar(title) + '<pre>' + pre + '</pre></div>'; }

  function snippet(conn, tool, slug) {
    var q = SAMPLE[slug] || SAMPLE.people;
    if (conn === 'MCP server') {
      var file = tool === 'Cursor' ? '~/.cursor/mcp.json'
        : tool === 'Claude Code' ? '.mcp.json'
        : tool === 'VS Code' ? '.vscode/mcp.json'
        : 'claude_desktop_config.json';
      return code(file,
        '<span class="c-m">// Add the Tellera MCP server, then restart ' + esc(tool) + '</span>\n' +
        '{\n  <span class="c-k">"mcpServers"</span>: {\n    <span class="c-k">"tellera"</span>: {\n' +
        '      <span class="c-k">"url"</span>: <span class="c-g">"https://mcp.tellera.com"</span>,\n' +
        '      <span class="c-k">"headers"</span>: { <span class="c-k">"Authorization"</span>: <span class="c-g">"Bearer $TELLERA_KEY"</span> }\n' +
        '    }\n  }\n}');
    }
    if (conn === 'REST API' || conn === 'cURL') {
      return code('Terminal',
        '<span class="c-b">curl</span> https://api.tellera.com/v1/ask \\\n' +
        '  -H <span class="c-g">"Authorization: Bearer $TELLERA_KEY"</span> \\\n' +
        '  -H <span class="c-g">"Content-Type: application/json"</span> \\\n' +
        '  -d <span class="c-g">\'{ "question": "' + esc(q) + '" }\'</span>');
    }
    if (conn === 'Python SDK') {
      return code('setup.py',
        '<span class="c-m"># pip install tellera</span>\n' +
        '<span class="c-b">from</span> tellera <span class="c-b">import</span> Tellera\n\n' +
        'client = <span class="c-v">Tellera</span>(api_key=<span class="c-g">"$TELLERA_KEY"</span>)\n' +
        'answer = client.<span class="c-v">ask</span>(<span class="c-g">"' + esc(q) + '"</span>)\n' +
        '<span class="c-v">print</span>(answer.text, answer.sources)');
    }
    if (conn === 'JavaScript SDK') {
      return code('setup.ts',
        '<span class="c-m">// npm install @tellera/sdk</span>\n' +
        '<span class="c-b">import</span> Tellera <span class="c-b">from</span> <span class="c-g">"@tellera/sdk"</span>;\n\n' +
        '<span class="c-b">const</span> tellera = <span class="c-b">new</span> <span class="c-v">Tellera</span>({ apiKey: process.env.<span class="c-k">TELLERA_KEY</span> });\n' +
        '<span class="c-b">const</span> answer = <span class="c-b">await</span> tellera.<span class="c-v">ask</span>(<span class="c-g">"' + esc(q) + '"</span>);\n' +
        'console.<span class="c-v">log</span>(answer.text, answer.sources);');
    }
    /* n8n / Zapier */
    return code('Webhook / no-code',
      '<span class="c-m"># Add an HTTP request step in your workflow</span>\n' +
      'Method:  <span class="c-b">POST</span>\n' +
      'URL:     <span class="c-g">https://api.tellera.com/v1/ask</span>\n' +
      'Header:  <span class="c-k">Authorization</span>: <span class="c-g">Bearer $TELLERA_KEY</span>\n' +
      'Body:    { <span class="c-k">"question"</span>: <span class="c-g">"' + esc(q) + '"</span> }');
  }

  function agentName(slug) { var a = (T.AGENTS || []).filter(function (x) { return x.slug === slug; })[0]; return a ? a.app : 'People'; }

  $('#obGen').addEventListener('click', function () {
    state.desc = ($('#obDesc').value || '').trim();
    try { localStorage.setItem('tellera_onboarding', JSON.stringify(state)); } catch (e) {}

    var slug = pickSlug();
    var connLabel = state.conn === 'MCP server' ? 'the MCP server' : state.conn;
    var uses = state.use.length ? state.use : ['People & identity'];
    var tags = uses.map(function (u) { return '<span class="ob__result-tag">' + esc(u) + '</span>'; }).join('') +
      '<span class="ob__result-tag">' + esc(state.tool) + '</span><span class="ob__result-tag">' + esc(state.conn) + '</span>';

    var r = $('#obResult');
    r.innerHTML =
      '<div class="ob__result-h">You\'re set up for ' + esc(connLabel) + ' in ' + esc(state.tool) + '.</div>' +
      '<p class="ob__result-d">Drop this in to start asking real-world questions. Every answer comes back with a confidence score and cited sources — routed automatically through <b>/v1/ask</b> to the right specialists, starting with <b>' + esc(agentName(slug)) + '</b>.</p>' +
      '<div class="ob__result-tags">' + tags + '</div>' +
      '<div class="ob__codelabel">Your setup</div>' +
      snippet(state.conn, state.tool, slug) +
      '<div class="ob__actions">' +
        '<a class="dv-btn dv-btn--prism dv-btn--lg" href="/portal">Open my dashboard &rarr;</a>' +
        '<a class="dv-btn dv-btn--ghost dv-btn--lg" href="/deep-search">Try a question in chat first</a>' +
      '</div>';
    r.classList.add('show');
    r.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
