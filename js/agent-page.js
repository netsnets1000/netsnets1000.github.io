/* Tellera — agent page template. Pages are <body data-agent="slug">; content comes from
   AGENT_PAGES (marketing copy) + TELLERA_API.AGENTS (endpoints, price, provider).
   To add an agent: add a config below and copy /agents/phone/index.html with a new data-agent. */
(function () {
  'use strict';
  var T = window.TELLERA_API;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var chatSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1.1-4A8 8 0 1 1 21 12z"/></svg>';
  var dots = '<span class="dv-code__dot" style="background:#E0574C"></span><span class="dv-code__dot" style="background:#E0B44C"></span><span class="dv-code__dot" style="background:#357A46"></span>';

  var AGENT_PAGES = {
    phone: {
      cat: 'People & identity',
      tagline: 'Know who\'s behind any number.',
      desc: 'Tellera Phone turns a phone number into a verified identity — owner, carrier, line type, location, and risk signals — with a source and confidence score on every field. Call it by API, or let your AI agent use it over MCP.',
      lookupPlaceholder: '(512) 555-0142',
      lookupPrompt: function (v) { return 'Who owns ' + v + '?'; },
      provPlus: '+ carrier portability data, CNAM & FCC complaint records',
      stats: [['4 line types', 'Mobile, landline, VoIP & toll-free'], ['< 300 ms', 'Typical response time'], ['From $0.01', 'Per call, no minimums'], ['Every field', 'Sourced & confidence-scored']],
      heroEp: 'phone.lookup',
      heroBody: '{ "number": "+15125550142" }',
      heroResp: '{\n  <span class="c-k">"owner"</span>:    { <span class="c-k">"name"</span>: <span class="c-g">"Martin R. Decker"</span>, <span class="c-k">"type"</span>: <span class="c-g">"person"</span>, <span class="c-k">"confidence"</span>: <span class="c-g">"high"</span> },\n  <span class="c-k">"line"</span>:     { <span class="c-k">"type"</span>: <span class="c-g">"mobile"</span>, <span class="c-k">"carrier"</span>: <span class="c-g">"Verizon Wireless"</span>, <span class="c-k">"prepaid"</span>: <span class="c-b">false</span>, <span class="c-k">"status"</span>: <span class="c-g">"active"</span> },\n  <span class="c-k">"location"</span>: { <span class="c-k">"rate_center"</span>: <span class="c-g">"Austin, TX"</span>, <span class="c-k">"tz"</span>: <span class="c-g">"America/Chicago"</span> },\n  <span class="c-k">"risk"</span>:     { <span class="c-k">"spam_score"</span>: <span class="c-b">4</span>, <span class="c-k">"reports"</span>: <span class="c-b">0</span>, <span class="c-k">"recent_port"</span>: <span class="c-b">false</span> },\n  <span class="c-k">"sources"</span>:  [<span class="c-g">"ReversePhone.com"</span>, <span class="c-g">"NPAC"</span>, <span class="c-g">"FCC"</span>]\n}',
      dataGroups: [
        { t: 'Identity', color: '#565C99', d: 'Who the number belongs to.', items: [['Current owner name(s)', 'owner.name'], ['Person or business', 'owner.type'], ['Name-match score', 'owner.match'], ['Associated people', 'owner.associates']] },
        { t: 'Line intelligence', color: '#2E6BFF', d: 'What kind of line it is and who carries it.', items: [['Mobile, landline, VoIP, toll-free', 'line.type'], ['Current & original carrier', 'line.carrier'], ['Prepaid / burner flag', 'line.prepaid'], ['Active or disconnected', 'line.status'], ['SMS-capable', 'line.sms']] },
        { t: 'Risk & reputation', color: '#B0402F', d: 'Is it safe to answer — or to trust?', items: [['Spam / robocall score (0–100)', 'risk.spam_score'], ['Report categories (scam, collector…)', 'risk.reports'], ['FCC complaint matches', 'risk.fcc'], ['Recently ported (SIM-swap signal)', 'risk.recent_port'], ['Disposable / VoIP signal', 'risk.disposable']] },
        { t: 'Location', color: '#2B8A88', d: 'Where the number and its owner are tied to.', items: [['Rate-center city & state', 'location.rate_center'], ['Time zone', 'location.tz'], ['Owner\'s current address', 'location.address'], ['Past addresses', 'location.history']] },
        { t: 'History', color: '#8B5E3C', d: 'How the number has changed hands.', items: [['Ownership timeline', 'history.owners'], ['Porting events & dates', 'history.ports'], ['First & last seen', 'history.seen']] },
        { t: 'Connections', color: '#7B5BFF', d: 'What else links to the number.', items: [['Linked email addresses', 'links.emails'], ['Other numbers, same owner', 'links.numbers'], ['Related businesses', 'links.businesses']] }
      ],
      chat: { q: 'Who keeps calling me from (512) 555-0142?', tool: 'phone.lookup → phone.reputation', a: 'That number belongs to <b>Martin R. Decker</b> in Austin, TX — a Verizon mobile line he\'s had since 2016. It isn\'t flagged as spam (score 4/100), has no FCC complaints, and hasn\'t been recently ported.', src: ['ReversePhone.com', 'Carrier portability data', 'FCC complaints'] },
      uses: [
        { tag: 'Consumer apps', t: 'Caller ID & spam screening', d: 'Show users who\'s calling before they pick up — and flag scams, robocalls, and spoofed numbers.', q: 'Who\'s calling me from (512) 555-0142?' },
        { tag: 'Fraud & trust', t: 'Contact-center fraud prevention', d: 'Catch recent ports and SIM swaps before an agent resets a password or moves money.', q: 'Was (646) 555-0199 recently ported to a new carrier?' },
        { tag: 'Sales & marketing', t: 'Lead verification', d: 'Confirm the number on a form belongs to the person who submitted it — before a rep dials.', q: 'Does (303) 555-0177 belong to Dana Whitfield?' },
        { tag: 'Fraud & trust', t: 'Marketplace trust', d: 'Verify buyers, sellers, and hosts at signup with a name-to-number match and burner check.', q: 'Is (415) 555-0110 a VoIP or prepaid number?' },
        { tag: 'Sales & marketing', t: 'CRM data hygiene', d: 'Find disconnected and reassigned numbers so reps stop calling the wrong person.', q: 'Is (702) 555-0133 still active, and who owns it now?' },
        { tag: 'Personal', t: 'Reconnect with people', d: 'Turn an old number into a current name and address to get back in touch.', q: 'Who used to own (617) 555-0164?' }
      ],
      prompts: ['Who owns (512) 555-0142?', 'Is (212) 555-0100 a spam number?', 'What carrier is (818) 555-0123 on?', 'Is this a landline or a cell: (305) 555-0188?', 'Has (646) 555-0199 been ported recently?', 'Find other numbers for the owner of (720) 555-0145'],
      faq: [
        ['Where does Tellera Phone data come from?', 'ReversePhone.com\'s reverse-lookup index, carrier portability and routing data, CNAM caller-name databases, FCC complaint data, and community spam reports — cross-checked and scored. See <a href="/data#sources">Our data</a>.'],
        ['Which numbers are covered?', 'U.S. numbers of every line type — mobile, landline, VoIP, and toll-free. International coverage is on the roadmap.'],
        ['How accurate is the owner data?', 'Every field returns a confidence score and its source. Use <code>phone.verify</code> when you need a yes/no match, and watch for the recent-port flag — reassigned numbers are the most common cause of mismatches.'],
        ['Can I use it for tenant, hiring, or credit decisions?', 'No. Tellera is not a consumer reporting agency, and its data can\'t be used for any purpose covered by the Fair Credit Reporting Act.'],
        ['How does the MCP server work?', 'Add <code>https://mcp.tellera.com</code> as a connector in Claude, ChatGPT, or Cursor. Your agent gets <code>phone_lookup</code>, <code>phone_verify</code>, <code>phone_reputation</code>, and <code>phone_history</code> tools and calls them when a question needs them.'],
        ['Can someone remove their number?', 'Yes. Anyone can opt out or request removal, and opted-out records are suppressed across the API, MCP, and Tellera Chat.']
      ],
      related: ['people', 'safety', 'family']
    }
  };

  var slug = document.body.getAttribute('data-agent');
  var P = AGENT_PAGES[slug];
  var A = T && T.AGENTS.filter(function (x) { return x.slug === slug; })[0];
  var main = document.getElementById('agMain');
  if (!P || !A || !main) return;

  document.title = A.app + ' API & MCP — ' + P.tagline.replace(/\.$/, '') + ' | Tellera';
  var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', P.desc);

  var minPrice = Math.min.apply(null, A.endpoints.map(function (e) { return e.price; }));
  var prov = A.provider ? (A.provider.logo ? '<img src="' + A.provider.logo + '" alt="' + esc(A.provider.name) + '" style="height:20px">' : '<span class="ag-prov__brand">' + esc(A.provider.name) + '</span>') : '<span class="ag-prov__brand">Live web index</span>';
  var mcpName = function (e) { return e.name.replace('.', '_'); };
  var heroEp = A.endpoints.filter(function (e) { return e.name === P.heroEp; })[0] || A.endpoints[0];

  function codeFor(kind) {
    var body = P.heroBody, url = 'https://api.tellera.com' + heroEp.path;
    if (kind === 'curl') return '<span class="c-b">$</span> curl ' + url.replace(heroEp.path, '<span class="c-v">' + heroEp.path + '</span>') + ' \\\n  -H <span class="c-g">"Authorization: Bearer $TELLERA_KEY"</span> \\\n  -d <span class="c-g">\'' + esc(body) + '\'</span>';
    var call = heroEp.name.split('.');
    if (kind === 'py') return '<span class="c-b">from</span> tellera <span class="c-b">import</span> Tellera\n\ntellera = <span class="c-v">Tellera</span>(api_key=<span class="c-g">"$TELLERA_KEY"</span>)\nres = tellera.' + call[0] + '.<span class="c-v">' + call[1] + '</span>(number=<span class="c-g">"+15125550142"</span>)\n<span class="c-v">print</span>(res.owner.name, res.risk.spam_score)';
    if (kind === 'js') return '<span class="c-b">import</span> Tellera <span class="c-b">from</span> <span class="c-g">"@tellera/sdk"</span>;\n\n<span class="c-b">const</span> tellera = <span class="c-b">new</span> <span class="c-v">Tellera</span>({ apiKey: process.env.<span class="c-k">TELLERA_KEY</span> });\n<span class="c-b">const</span> res = <span class="c-b">await</span> tellera.' + call[0] + '.<span class="c-v">' + call[1] + '</span>({ number: <span class="c-g">"+15125550142"</span> });\nconsole.<span class="c-v">log</span>(res.owner.name, res.risk.spam_score);';
    return '<span class="c-m"># MCP server: https://mcp.tellera.com</span>\n{\n  <span class="c-k">"tool"</span>: <span class="c-g">"' + mcpName(heroEp) + '"</span>,\n  <span class="c-k">"arguments"</span>: ' + esc(body) + '\n}';
  }

  var html = '';

  /* hero */
  html += '<section class="st-hero"><div class="dv-wrap">' +
    '<div class="st-crumb"><a href="/">Home</a> / <a href="/#agents">Agents</a> / <b>' + esc(A.app) + '</b></div>' +
    '<div class="st-hero__grid"><div>' +
      '<div class="ag-badges"><span class="ag-badge ag-badge--cat">' + esc(P.cat) + '</span><span class="ag-badge">REST API</span><span class="ag-badge">MCP tool</span><span class="ag-badge">From $' + minPrice.toFixed(2) + ' / call</span></div>' +
      '<div class="ag-title"><span class="ag-title__ic"><img src="' + A.icon + '" alt=""></span><h1>' + esc(A.app) + '<span>API &amp; MCP</span></h1></div>' +
      '<div class="ag-tagline">' + esc(P.tagline) + '</div>' +
      '<p class="ag-desc">' + esc(P.desc) + '</p>' +
      '<form class="ag-lookup" id="agLookup"><input id="agLookupIn" placeholder="' + esc(P.lookupPlaceholder) + '" aria-label="Try a lookup"><button type="submit">Look it up</button></form>' +
      '<div class="ag-lookup__hint">Try it free in Tellera Chat — no API key needed.</div>' +
      '<div class="ag-cta"><a class="dv-btn dv-btn--prism dv-btn--lg" href="/portal" data-auth="signup">Get a free API key</a><a class="dv-btn dv-btn--ghost dv-btn--lg" href="#endpoints">View endpoints</a></div>' +
      '<div class="ag-prov"><span class="ag-prov__k">Featured data</span>' + prov + '<span class="ag-prov__plus">' + esc(P.provPlus) + '</span></div>' +
    '</div>' +
    '<div class="dv-code"><div class="dv-code__bar">' + dots + '<span class="dv-code__title">tellera · ' + esc(heroEp.name) + '</span><img src="/assets/prism-logo-mark.svg" alt="" class="dv-code__mark"></div>' +
      '<pre>' + codeFor('curl') + '\n\n' + P.heroResp + '</pre></div>' +
    '</div>' +
    '<div class="st-stats">' + P.stats.map(function (s) { return '<div class="st-stat"><div class="st-stat__n">' + esc(s[0]) + '</div><div class="st-stat__l">' + esc(s[1]) + '</div></div>'; }).join('') + '</div>' +
  '</div></section>';

  /* data points */
  html += '<section class="dv-sec"><div class="dv-wrap"><div class="dv-kicker">What you get back</div><h2 class="dv-h2">One number in. A full picture out.</h2>' +
    '<p class="dv-lede">Every response is structured JSON with a confidence score and source on each field. Ask for only the blocks you need with <code style="font-family:var(--font-mono);font-size:15px">include</code>.</p>' +
    '<div class="ag-dp">' + P.dataGroups.map(function (g) {
      return '<div class="ag-dpg"><div class="ag-dpg__t"><i style="background:' + g.color + '"></i>' + esc(g.t) + '</div><div class="ag-dpg__d">' + esc(g.d) + '</div><ul>' +
        g.items.map(function (i) { return '<li><span>' + esc(i[0]) + '</span><code>' + esc(i[1]) + '</code></li>'; }).join('') + '</ul></div>';
    }).join('') + '</div></div></section>';

  /* endpoints */
  html += '<section class="dv-sec dv-sec--alt" id="endpoints"><div class="dv-wrap"><div class="dv-kicker">Endpoints</div><h2 class="dv-h2">' + A.endpoints.length + ' endpoints. Pay only for what you call.</h2>' +
    '<p class="dv-lede">Use the full lookup, or drop down to a cheaper, narrower call when that\'s all you need. Every endpoint is also an MCP tool.</p>' +
    '<div class="ag-eps">' + A.endpoints.map(function (e) {
      return '<div class="ag-ep"><div class="ag-ep__head"><span class="ag-ep__m">' + e.m + '</span><span class="ag-ep__p">' + esc(e.path) + '</span><span class="ag-ep__price">$' + e.price.toFixed(2) + '</span></div>' +
        '<div class="ag-ep__d">' + esc(e.desc) + '</div>' +
        '<div class="ag-ep__params">' + (e.params || []).map(function (p) { return '<span>' + esc(p.n) + (p.req ? '<b>*</b>' : '') + ': ' + esc(p.t) + '</span>'; }).join('') + '<span>MCP: ' + esc(mcpName(e)) + '</span></div></div>';
    }).join('') + '</div></div></section>';

  /* code + MCP chat */
  html += '<section class="dv-sec"><div class="dv-wrap"><div class="dv-kicker">API or MCP</div><h2 class="dv-h2">Call it from code. Or just ask your agent.</h2>' +
    '<p class="dv-lede">Same data, same sources — whether it\'s a line in your backend or a question in Claude, ChatGPT, or Cursor.</p>' +
    '<div class="ag-code">' +
      '<div class="ag-chat"><div class="ag-chat__label">In your AI agent · via MCP</div><div class="ag-chat__me">' + esc(P.chat.q) + '</div><div class="ag-chat__tool">⚙ tellera · ' + esc(P.chat.tool) + '</div>' +
        '<div class="ag-chat__ai">' + P.chat.a + '<div class="ag-chat__src">' + P.chat.src.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</div></div></div>' +
      '<div class="dv-code"><div class="ag-tabs" id="agTabs"><button class="active" data-k="curl">cURL</button><button data-k="py">Python</button><button data-k="js">JavaScript</button><button data-k="mcp">MCP</button></div><pre id="agCodePre">' + codeFor('curl') + '</pre></div>' +
    '</div></div></section>';

  /* use cases + prompts */
  html += '<section class="dv-sec dv-sec--alt"><div class="dv-wrap"><div class="dv-kicker">Use cases</div><h2 class="dv-h2">What teams build with ' + esc(A.app) + '.</h2>' +
    '<div class="uc-grid">' + P.uses.map(function (u) {
      return '<div class="uc-card"><div class="uc-card__tag">' + esc(u.tag) + '</div><div class="uc-card__t">' + esc(u.t) + '</div><div class="uc-card__d">' + esc(u.d) + '</div>' +
        '<a class="uc-card__try" href="/deep-search?q=' + encodeURIComponent(u.q) + '">' + chatSvg + '"' + esc(u.q) + '"</a></div>';
    }).join('') + '</div>' +
    '<div class="dv-trybar" style="margin-top:22px"><div class="dv-trybar__lead">' + chatSvg + 'More to try in Tellera Chat:</div><div class="dv-trybar__chips">' +
      P.prompts.map(function (q) { return '<a class="dv-trychip" href="/deep-search?q=' + encodeURIComponent(q) + '">' + chatSvg + esc(q) + '</a>'; }).join('') + '</div></div>' +
    '<div style="margin-top:20px"><a class="dv-door__go" href="/use-cases">Browse all Tellera use cases →</a></div>' +
    '</div></section>';

  /* pricing */
  html += '<section class="dv-sec"><div class="dv-wrap"><div class="dv-kicker">Pricing</div><h2 class="dv-h2">Simple, per-call pricing.</h2>' +
    '<p class="dv-lede">Calls count toward your plan\'s allowance, with overage at list price. The free Sandbox plan includes $25 in credits to start.</p>' +
    '<table class="ag-table"><thead><tr><th>Endpoint</th><th>What it returns</th><th class="r">Price / call</th></tr></thead><tbody>' +
      A.endpoints.map(function (e) { return '<tr><td><code>' + esc(e.name) + '</code></td><td>' + esc(e.desc) + '</td><td class="r"><b>$' + e.price.toFixed(2) + '</b></td></tr>'; }).join('') +
    '</tbody></table><div style="margin-top:16px"><a class="dv-door__go" href="/pricing">See plans &amp; volume pricing →</a></div></div></section>';

  /* faq */
  html += '<section class="dv-sec dv-sec--alt"><div class="dv-wrap"><div class="dv-kicker">FAQ</div><h2 class="dv-h2">Questions about ' + esc(A.app) + '.</h2>' +
    '<div class="ag-faq">' + P.faq.map(function (f, i) { return '<details' + (i === 0 ? ' open' : '') + '><summary>' + esc(f[0]) + '</summary><p>' + f[1] + '</p></details>'; }).join('') + '</div></div></section>';

  /* related agents */
  var rel = P.related.map(function (s) { return T.AGENTS.filter(function (x) { return x.slug === s; })[0]; }).filter(Boolean);
  html += '<section class="dv-sec"><div class="dv-wrap"><div class="dv-kicker">Works well with</div><h2 class="dv-h2">Pair it with other agents.</h2>' +
    '<p class="dv-lede">Or skip the wiring — send one question to <b>/v1/ask</b> and Tellera routes across every agent it needs.</p>' +
    '<div class="ag-related">' + rel.map(function (r) {
      var href = r.page || '/deep-search?q=' + encodeURIComponent((r.prompts && r.prompts[0]) || r.app);
      var rp = r.provider ? (r.provider.logo ? '<img class="dv-brandimg" src="' + r.provider.logo + '" alt="' + esc(r.provider.name) + '">' : '<span class="dv-brandtxt">' + esc(r.provider.name) + '</span>') : '';
      return '<a class="dv-agent" href="' + href + '"><div class="dv-agent__top"><span class="dv-agent__ic"><img src="' + r.icon + '" alt=""></span><div><div class="dv-agent__name">' + esc(r.app) + '</div><div class="dv-agent__ep">' + esc(r.endpoints[0].name) + ' · from $' + r.price.toFixed(2) + '</div></div></div>' +
        '<div class="dv-agent__desc">' + esc(r.desc) + '</div><div class="dv-agent__prov"><span class="dv-agent__prov-k">Featured data</span>' + rp + '</div></a>';
    }).join('') + '</div></div></section>';

  /* cta */
  html += '<section class="dv-sec" style="padding-top:0"><div class="dv-wrap"><div class="dv-ctaband"><div class="dv-ctaband__h">Start with ' + esc(A.app) + ' today.</div>' +
    '<div class="dv-ctaband__d">Free sandbox key in two minutes. No card required.</div>' +
    '<div class="dv-ctaband__cta"><a class="dv-btn dv-btn--lg" href="/portal" data-auth="signup">Get a free API key</a><a class="dv-btn dv-btn--out dv-btn--lg" href="/deep-search?q=' + encodeURIComponent(P.prompts[0]) + '">Try it in Tellera Chat</a></div></div></div></section>';

  main.innerHTML = html;

  /* interactions */
  var form = document.getElementById('agLookup'), inp = document.getElementById('agLookupIn');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = (inp.value || '').trim() || P.lookupPlaceholder;
    location.href = '/deep-search?q=' + encodeURIComponent(P.lookupPrompt(v));
  });
  var tabs = document.getElementById('agTabs'), pre = document.getElementById('agCodePre');
  if (tabs) tabs.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    tabs.querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); });
    pre.innerHTML = codeFor(b.getAttribute('data-k'));
  });
})();
