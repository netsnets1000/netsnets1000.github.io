/* Tellera Pricing page — render plans (with monitoring toggle) + per-endpoint table. */
(function () {
  'use strict';
  var T = window.TELLERA_API;
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var check = '<svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function icon(a) { if (a.iconSvg) return a.iconSvg; if (a.icon) return '<img src="' + a.icon + '" alt="">'; return ''; }

  var withMon = false;
  function renderPlans() {
    if (!$('#prPlans') || !T) return;
    $('#prPlans').innerHTML = T.PLANS.map(function (p) {
      var pop = p.badge === 'Popular';
      var badge = pop ? '<span class="pr-plan__badge">Popular</span>' : '';
      var price = p.price, monNote = '', monFeat = '';
      if (withMon) {
        if (p.mon && p.mon.add === 'custom') {
          monNote = '<div class="pr-plan__monnote">Monitoring included</div>';
          monFeat = '<li class="mon">' + check + '<span>' + esc(p.mon.count) + ' · ' + esc(p.mon.cadence) + '</span></li>';
        } else if (p.mon) {
          var base = parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0;
          price = '$' + (base + p.mon.add);
          monNote = '<div class="pr-plan__monnote">incl. +$' + p.mon.add + '/mo monitoring</div>';
          monFeat = '<li class="mon">' + check + '<span>' + esc(p.mon.count) + ' · ' + esc(p.mon.cadence) + '</span></li>';
        } else {
          monNote = '<div class="pr-plan__monnote pr-plan__monnote--muted">Monitoring on Starter+</div>';
        }
      }
      var isEnt = p.name === 'Enterprise';
      var cta = isEnt
        ? '<a class="pr-plan__cta pr-plan__cta--ghost" href="#">Contact sales</a>'
        : '<button class="pr-plan__cta' + (pop ? '' : ' pr-plan__cta--ghost') + '" data-auth="signup">' + (p.name === 'Sandbox' ? 'Start free' : 'Choose ' + esc(p.name)) + '</button>';
      return '<div class="pr-plan' + (pop ? ' pr-plan--pop' : '') + '">' + badge +
        '<div class="pr-plan__name">' + esc(p.name) + '</div>' +
        '<div class="pr-plan__price">' + esc(price) + '<span>' + esc(p.cadence) + '</span></div>' + monNote +
        '<div class="pr-plan__calls">' + esc(p.calls) + '</div><div class="pr-plan__over">' + esc(p.overage) + '</div>' +
        '<ul class="pr-plan__feats">' + monFeat + p.features.map(function (f) { return '<li>' + check + '<span>' + esc(f) + '</span></li>'; }).join('') + '</ul>' +
        cta + '</div>';
    }).join('');
  }
  renderPlans();

  var toggle = $('#prToggle');
  if (toggle) toggle.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    withMon = b.getAttribute('data-mon') === '1';
    toggle.querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); });
    renderPlans();
  });

  /* per-endpoint pricing table (orchestrator first, then agents) */
  var epEl = $('#prEndpoints');
  if (epEl && T) {
    var rows = [T.ASK].concat(T.AGENTS);
    epEl.innerHTML = rows.map(function (a) {
      var ep = a.endpoints[0];
      var d = ep.desc.length > 62 ? ep.desc.slice(0, 62) + '…' : ep.desc;
      var routed = a.slug === 'ask' ? ' <span class="pr-epname">+ routed specialists</span>' : '';
      return '<tr><td><span class="pr-agent"><span class="pr-agent__ic">' + icon(a) + '</span>' + esc(a.app) + '</span></td>' +
        '<td><span class="pr-epname">' + esc(ep.name) + '</span></td>' +
        '<td>' + esc(d) + routed + '</td>' +
        '<td class="r"><span class="pr-price">$' + a.price.toFixed(2) + '</span></td></tr>';
    }).join('');
  }

  /* mobile menu */
  var burger = $('#prBurger'), menu = $('#prMenu');
  if (burger && menu) {
    menu.hidden = false;
    var open = false;
    burger.addEventListener('click', function () { open = !open; menu.classList.toggle('show', open); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { open = false; menu.classList.remove('show'); }); });
  }
})();
