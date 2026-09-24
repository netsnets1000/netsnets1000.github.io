/* Tellera — Use cases hub: filterable grid (category chips + keyword search). */
(function () {
  'use strict';
  var T = window.TELLERA_API;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var chatSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1.1-4A8 8 0 1 1 21 12z"/></svg>';

  var USES = [
    /* Sales & marketing */
    { c: 'Sales & marketing', t: 'Lead verification & enrichment', d: 'Confirm every inbound lead is real and reachable, then append name, address, and company details before it hits your CRM.', a: ['phone', 'people', 'business'], q: 'Does (303) 555-0177 belong to Dana Whitfield?' },
    { c: 'Sales & marketing', t: 'Speed-to-lead routing', d: 'Score leads the moment they arrive — real person, working phone, homeowner — and send the best ones to reps first.', a: ['phone', 'property', 'people'], q: 'Is the owner of 88 Birch Ln, Denver the person who filled out this form?' },
    { c: 'Sales & marketing', t: 'CRM data hygiene', d: 'Flag disconnected numbers, stale addresses, and people who\'ve moved so your database stays accurate.', a: ['phone', 'people'], q: 'Is (702) 555-0133 still active, and who owns it now?' },
    { c: 'Sales & marketing', t: 'Account research', d: 'Pull owners, filings, lawsuits, and the latest news on a target account before the first call.', a: ['business', 'web-search', 'court'], q: 'What should I know about Acme Supply Co. before a sales call?' },
    /* Fraud & trust */
    { c: 'Fraud & trust', t: 'Contact-center fraud prevention', d: 'Check for recent ports and SIM swaps before an agent resets a password or moves money.', a: ['phone', 'safety'], q: 'Was (646) 555-0199 recently ported to a new carrier?' },
    { c: 'Fraud & trust', t: 'Marketplace buyer & seller checks', d: 'Match names to phones and addresses at signup, and flag burner numbers and watchlist hits.', a: ['phone', 'people', 'safety'], q: 'Is (415) 555-0110 a prepaid or VoIP number?' },
    { c: 'Fraud & trust', t: 'Scam call & text screening', d: 'Tell users who\'s calling or texting — and whether others have reported the number as a scam.', a: ['phone'], q: 'Is (212) 555-0100 a spam number?' },
    { c: 'Fraud & trust', t: 'Sanctions & watchlist screening', d: 'Screen people and companies against OFAC and international sanctions lists in a single call.', a: ['safety', 'business'], q: 'Any sanctions or watchlist hits for Oakridge Holdings LLC?' },
    /* Real estate */
    { c: 'Real estate', t: 'Property owner lookup', d: 'Find the owner of record behind any address — even when it\'s held in an LLC.', a: ['property', 'business', 'people'], q: 'Who owns 1234 Oakridge Dr, Austin TX?' },
    { c: 'Real estate', t: 'Investor prospecting', d: 'Spot absentee owners, long-held homes, and high-equity properties — then reach the owner directly.', a: ['property', 'phone'], q: 'Is 13 Roland Dr owner-occupied, and how long have they owned it?' },
    { c: 'Real estate', t: 'Property due diligence', d: 'Liens, permits, flood zone, taxes, and sale history before you make an offer.', a: ['property', 'assets'], q: 'Any liens, permits, or flood risk on 55 Elm St, Denver?' },
    { c: 'Real estate', t: 'Know the neighborhood', d: 'Schools, reported crime, demographics, and environmental risks around any address.', a: ['property'], q: 'What\'s the neighborhood like around 88 Birch Ln, Denver?' },
    /* Automotive */
    { c: 'Automotive', t: 'Used-car history check', d: 'Title brands, odometer history, total-loss records, and open recalls before you buy.', a: ['vehicle'], q: 'Is VIN 1FTFW1E5… clean, or does it have a salvage title?' },
    { c: 'Automotive', t: 'Private-seller verification', d: 'Confirm the person selling the car is the one whose name is on the title.', a: ['vehicle', 'people'], q: 'Is the seller of VIN 1HGCM82633A004352 the titled owner?' },
    { c: 'Automotive', t: 'Dealer trade-in checks', d: 'Instant history and market value on every trade-in that rolls onto the lot.', a: ['vehicle'], q: 'Market value and history for VIN 1G1ZE51234567' },
    /* Legal & investigations */
    { c: 'Legal & investigations', t: 'Locate people & witnesses', d: 'Current addresses and contact info for parties, witnesses, and heirs — for attorneys and process servers.', a: ['people', 'phone', 'family'], q: 'Current address for Martin R. Decker, last known in Austin TX' },
    { c: 'Legal & investigations', t: 'Litigation research', d: 'Every case, docket, and judgment tied to a person or company across federal and state courts.', a: ['court', 'business'], q: 'Any lawsuits involving Oakridge LLC?' },
    { c: 'Legal & investigations', t: 'Judgment recovery & asset discovery', d: 'Find property, vehicles, aircraft, and business interests tied to a judgment debtor.', a: ['assets', 'property', 'vehicle'], q: 'What assets are tied to Martin R. Decker?' },
    /* Business & due diligence */
    { c: 'Business & due diligence', t: 'Vendor & partner due diligence', d: 'Verify a company exists, who runs it, and whether it has lawsuits, liens, or sanctions.', a: ['business', 'court', 'safety'], q: 'Is Acme Supply Co. in good standing, and who runs it?' },
    { c: 'Business & due diligence', t: 'Check a contractor before hiring', d: 'Licenses, complaints, and lawsuits before you hand over a deposit.', a: ['business', 'court'], q: 'Is Denver Pro Roofing licensed, and are there any complaints?' },
    { c: 'Business & due diligence', t: 'Who\'s really behind an LLC', d: 'Unmask the officers, registered agents, and related entities behind a company name.', a: ['business', 'people'], q: 'Who owns Oakridge Holdings LLC?' },
    /* Personal & family */
    { c: 'Personal & family', t: 'Reconnect with lost friends & family', d: 'Find an old friend, classmate, or relative with just a name and a city.', a: ['people', 'family'], q: 'Find Jordan Blake, about 40, formerly of Austin TX' },
    { c: 'Personal & family', t: 'Online dating safety check', d: 'Make sure your match is who they say they are before you meet in person.', a: ['people', 'court', 'phone'], q: 'Is Alex Rivera from Denver who they say they are?' },
    { c: 'Personal & family', t: 'Find unclaimed money', d: 'Search state unclaimed-property records for money owed to you or your family.', a: ['assets'], q: 'Is there unclaimed money for John Doe in Minnesota?' },
    { c: 'Personal & family', t: 'Explore your family tree', d: 'Map relatives and ancestors through census, vital, and family records.', a: ['family'], q: 'Who are the Decker family\'s ancestors?' },
    /* AI agents & automation */
    { c: 'AI agents & automation', t: 'Ground your AI agent in real records', d: 'Give Claude, ChatGPT, or your own agent verified public-record answers over MCP — not guesses.', a: ['ask'], q: 'Who owns 13 Roland Dr, White Plains NY?' },
    { c: 'AI agents & automation', t: 'Research copilots for analysts', d: 'One question to /v1/ask fans out across every agent and returns a single cited brief.', a: ['ask'], q: 'Give me a background brief on Oakridge Holdings LLC' },
    { c: 'AI agents & automation', t: 'Monitors & automated alerts', d: 'Watch a property, vehicle, person, or company and get a webhook when the record changes.', a: ['property', 'court', 'business'], q: 'Alert me if ownership of 1234 Oakridge Dr changes' }
  ];
  var CATS = ['All'].concat(USES.map(function (u) { return u.c; }).filter(function (c, i, arr) { return arr.indexOf(c) === i; }));

  function agentChip(slug) {
    if (slug === 'ask') return '<a href="/developers#ask">Tellera Ask</a>';
    var a = T && T.AGENTS.filter(function (x) { return x.slug === slug; })[0];
    if (!a) return '';
    var label = a.app.replace('Tellera ', '');
    return a.page ? '<a href="' + a.page + '">' + esc(label) + '</a>' : '<span>' + esc(label) + '</span>';
  }

  var active = 'All', term = '';
  var filterEl = document.getElementById('ucFilter'), gridEl = document.getElementById('ucGrid'), countEl = document.getElementById('ucCount'), searchEl = document.getElementById('ucSearch');

  if (gridEl) gridEl.innerHTML = USES.map(function (u, i) {
    return '<div class="uc-card" data-i="' + i + '"><div class="uc-card__tag">' + esc(u.c) + '</div><div class="uc-card__t">' + esc(u.t) + '</div><div class="uc-card__d">' + esc(u.d) + '</div>' +
      '<div class="uc-card__agents">' + u.a.map(agentChip).join('') + '</div>' +
      '<a class="uc-card__try" href="/deep-search?q=' + encodeURIComponent(u.q) + '">' + chatSvg + 'Try: "' + esc(u.q) + '"</a></div>';
  }).join('');

  function apply() {
    if (filterEl) filterEl.innerHTML = CATS.map(function (c) {
      var n = c === 'All' ? USES.length : USES.filter(function (u) { return u.c === c; }).length;
      return '<button class="' + (c === active ? 'active' : '') + '" data-c="' + esc(c) + '">' + esc(c) + ' <span style="opacity:.55">' + n + '</span></button>';
    }).join('');
    var shown = 0, t = term.toLowerCase();
    Array.prototype.forEach.call(gridEl.querySelectorAll('.uc-card'), function (el) {
      var u = USES[+el.getAttribute('data-i')];
      var ok = (active === 'All' || u.c === active) && (!t || (u.t + ' ' + u.d + ' ' + u.c).toLowerCase().indexOf(t) > -1);
      el.hidden = !ok; if (ok) shown++;
    });
    if (countEl) countEl.textContent = shown ? 'Showing ' + shown + ' of ' + USES.length + ' use cases' : 'No matches — try another word, or just ask Tellera Chat.';
  }
  apply();
  if (filterEl) filterEl.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { active = b.getAttribute('data-c'); apply(); } });
  if (searchEl) searchEl.addEventListener('input', function () { term = searchEl.value.trim(); apply(); });
})();
