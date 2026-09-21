/* Tellera Developers landing — render agents catalog + pricing from connectors.js. */
(function () {
  'use strict';
  var T = window.TELLERA_API;
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  function icon(a) { if (a.iconSvg) return a.iconSvg; if (a.icon) return '<img src="' + a.icon + '" alt="">'; return ''; }

  var chatSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1.1-4A8 8 0 1 1 21 12z"/></svg>';

  /* try-in-chat chip strip */
  var TRY = [
    'Who owns 13 Roland Dr, White Plains NY?',
    "Who's calling from (512) 555-0142?",
    'Is VIN 1FTFW1E5… salvage or clean?',
    'Any court filings for M. Decker in Travis County?',
    'Latest news on Ramp'
  ];
  var tryEl = $('#dvTryChips');
  if (tryEl) tryEl.innerHTML = TRY.map(function (q) { return '<a class="dv-trychip" href="/deep-search?q=' + encodeURIComponent(q) + '">' + chatSvg + esc(q) + '</a>'; }).join('');

  /* agents catalog */
  var agentsEl = $('#dvAgents');
  if (agentsEl && T) {
    var cards = T.AGENTS.map(function (a) {
      var badge = a.badge ? '<span class="dv-agent__badge dv-agent__badge--new">' + esc(a.badge) + '</span>' : '';
      var q = (a.prompts && a.prompts[0]) || '';
      return '<div class="dv-agent">' +
        '<div class="dv-agent__top"><span class="dv-agent__ic">' + icon(a) + '</span>' +
        '<div style="min-width:0"><div class="dv-agent__name">' + esc(a.app) + '</div><div class="dv-agent__ep">' + esc(a.endpoints[0].name) + ' · from $' + a.price.toFixed(2) + '</div></div>' + badge + '</div>' +
        '<div class="dv-agent__desc">' + esc(a.desc) + '</div>' +
        '<div class="dv-agent__foot"><a class="dv-agent__try" href="/deep-search?q=' + encodeURIComponent(q) + '">' + chatSvg + 'Try in chat</a><a class="dv-agent__view" href="/portal">View API →</a></div></div>';
    }).join('');
    var soon = T.COMING.map(function (c) {
      return '<div class="dv-agent" style="opacity:.72">' +
        '<div class="dv-agent__top"><span class="dv-agent__ic"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#7E8798" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg></span>' +
        '<div style="min-width:0"><div class="dv-agent__name">' + esc(c.app) + '</div></div><span class="dv-agent__badge dv-agent__badge--soon">Soon</span></div>' +
        '<div class="dv-agent__desc">' + esc(c.desc) + '</div></div>';
    }).join('');
    agentsEl.innerHTML = cards + soon;
  }

  /* pricing */
  var priceEl = $('#dvPricing');
  if (priceEl && T) {
    priceEl.innerHTML = T.PLANS.map(function (p) {
      var badge = p.badge === 'Popular' ? '<span class="dv-tier__badge">Popular</span>' : '';
      return '<div class="dv-tier' + (p.badge === 'Popular' ? ' dv-tier--pop' : '') + '">' + badge +
        '<div class="dv-tier__name">' + esc(p.name) + '</div>' +
        '<div class="dv-tier__price">' + esc(p.price) + '<span>' + esc(p.cadence) + '</span></div>' +
        '<div class="dv-tier__calls">' + esc(p.calls) + '</div>' +
        '<div class="dv-tier__over">' + esc(p.overage) + '</div>' +
        '<a class="dv-tier__cta" href="/portal">' + (p.name === 'Enterprise' ? 'Contact sales →' : 'Choose →') + '</a></div>';
    }).join('');
  }

  /* mobile menu */
  var burger = $('#dvBurger'), menu = $('#dvMenu');
  if (burger && menu) {
    menu.innerHTML = '<a href="#agents">Agents</a><a href="#connect">MCP &amp; API</a><a href="#pricing">Pricing</a><a href="#">Docs</a><a href="/portal">Sign in</a><a class="g" href="/portal">Get API key</a>';
    menu.hidden = false;
    var open = false;
    burger.addEventListener('click', function () { open = !open; menu.classList.toggle('show', open); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { open = false; menu.classList.remove('show'); }); });
  }
})();
