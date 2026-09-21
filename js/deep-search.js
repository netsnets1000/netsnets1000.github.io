/* Tellera Deep Search — typable prompt → mock Tellera response + full findings panel */
(function () {
  var T = window.TELLERA;
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };

  var pillsWrap = document.getElementById('pills');
  var input = document.getElementById('dsInput');
  var form = document.getElementById('dsForm');
  var landing = document.getElementById('dsLanding');
  var result = document.getElementById('dsResult');
  var userQ = document.getElementById('dsUserQ');
  var thread = document.getElementById('dsThread');
  var scroll = document.getElementById('dsScroll');

  /* ---- agent quick-action pills seed the prompt ---- */
  var PILLS = [
    { label: 'Tellera People', seed: "What's known about Martin R. Decker in Austin, TX?", icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#7B5BFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-3.3 3.1-5 7-5s7 1.7 7 5"/></svg>' },
    { label: 'Tellera Phone', seed: 'Who owns (512) 555-0142?', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="#2E7BFF"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/></svg>' },
    { label: 'Tellera Email', seed: 'Who is behind mail@domain.com?', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#4C8DFF" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/></svg>' },
    { label: 'Tellera Property', seed: 'Who owns 1234 Oakridge Dr, Austin TX?', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="#B0402F"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>' },
    { label: 'Tellera Vehicle', seed: 'Is VIN 1FTFW1E5… clean?', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="#37B6A6"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>' }
  ];
  function renderPills() {
    pillsWrap.innerHTML = PILLS.map(function (p, i) {
      return '<button class="ds-pill" data-i="' + i + '"><span class="ds-pill__ic">' + p.icon + '</span><span class="ds-pill__label">' + esc(p.label) + '</span></button>';
    }).join('');
  }
  renderPills();
  pillsWrap.addEventListener('click', function (e) {
    var b = e.target.closest('.ds-pill'); if (!b) return;
    input.value = PILLS[+b.getAttribute('data-i')].seed;
    input.focus(); autogrow();
  });

  /* ---- typable prompt: autogrow + Enter to submit ---- */
  function autogrow() { input.style.height = 'auto'; input.style.height = Math.min(160, input.scrollHeight) + 'px'; }
  input.addEventListener('input', autogrow);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  /* ---- submit → show the result view ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim() || 'Who owns 13 Roland Dr, White Plains NY?';
    userQ.textContent = q;
    landing.hidden = true;
    result.hidden = false;
    result.classList.remove('open');
    scroll.scrollTop = 0;
    addRecent(q);
  });

  /* ---- sidebar "Recents": add the new chat, mark it active ---- */
  var recentsList = document.getElementById('dsRecentsList');
  function addRecent(q) {
    Array.prototype.forEach.call(recentsList.children, function (c) { c.classList.remove('active'); });
    var b = document.createElement('button');
    b.className = 'ds-recent active';
    b.textContent = q.length > 30 ? q.slice(0, 30) + '…' : q;
    recentsList.insertBefore(b, recentsList.firstChild);
  }
  recentsList.addEventListener('click', function (e) {
    var b = e.target.closest('.ds-recent'); if (!b) return;
    Array.prototype.forEach.call(recentsList.children, function (c) { c.classList.remove('active'); });
    b.classList.add('active');
    userQ.textContent = b.textContent.replace(/…$/, '');
    landing.hidden = true; result.hidden = false; result.classList.remove('open');
    var side = document.getElementById('side'); if (side) side.classList.remove('open');
  });

  /* ---- expand / close the full-findings right column ---- */
  document.getElementById('dsExpand').addEventListener('click', function () { result.classList.toggle('open'); });
  document.getElementById('dsReportClose').addEventListener('click', function () { result.classList.remove('open'); });

  /* ---- suggested follow-ups (feel like a real chat) ---- */
  var SPARK = '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8z" fill="currentColor"/></svg>';
  var FOLLOWUPS = [
    { q: 'Any liens or tax issues?', a: "Good news — <b>no open liens</b> on record, and property taxes are <b>current</b> as of the latest county filing. If anything outstanding ever shows up, I'll flag it right at the top.", cta: true },
    { q: 'How has the value changed?', a: "It last sold for <b>$512,000 in 2009</b> and now estimates around <b>$815,000</b> — about a 59% rise, roughly in line with the White Plains market. The full valuation history is in the findings.", cta: true },
    { q: 'Who owns the homes nearby?', a: "I can map the block — I found owners for the neighboring parcels on Roland Dr. Want the neighborhood view? That's a quick follow-up for Tellera Property.", cta: true },
    { q: 'What permits have been filed?', a: "Two on record: a <b>2020 HVAC replacement</b> ($20,500) and a <b>2005 kitchen renovation</b> ($30,000). No open or expired permits flagged.", cta: true },
    { q: 'Should I be worried about anything?', a: "Nothing jumps out. Clean title, taxes current, no liens, and permits properly closed. If you're weighing an offer, the value and equity picture is the main thing to review — it's all in the findings." }
  ];

  function appendExchange(q, a, cta) {
    var u = document.createElement('div'); u.className = 'ds-userq';
    var us = document.createElement('span'); us.textContent = q; u.appendChild(us);
    var r = document.createElement('div'); r.className = 'ds-fresp';
    r.innerHTML = '<span class="ds-fresp__avatar">' + SPARK + '</span>' +
      '<div class="ds-fresp__bubble">' + a + (cta ? '<div class="ds-fresp__cta" data-open-report>Open full findings →</div>' : '') + '</div>';
    var suggest = document.getElementById('dsSuggest');
    thread.insertBefore(u, suggest);
    thread.insertBefore(r, suggest);
    scroll.scrollTop = scroll.scrollHeight;
  }
  function answerFor(text) {
    var t = text.toLowerCase();
    if (/lien|tax|owe|debt/.test(t)) return FOLLOWUPS[0];
    if (/value|worth|equity|price|cost|sell/.test(t)) return FOLLOWUPS[1];
    if (/neighbor|nearby|next door|block|who else|around/.test(t)) return FOLLOWUPS[2];
    if (/permit|renovat|reno|hvac|construction|addition/.test(t)) return FOLLOWUPS[3];
    if (/worr|risk|red flag|problem|safe|concern/.test(t)) return FOLLOWUPS[4];
    return { q: text, a: "I've got the full picture on <b>13 Roland Dr</b> — owner, value, liens, permits, and sale history. Tell me what to zero in on, or open the full findings on the right for everything.", cta: true };
  }

  var suggestChips = document.getElementById('dsSuggestChips');
  var suggestBlock = document.getElementById('dsSuggest');
  function renderSuggest() {
    suggestChips.innerHTML = FOLLOWUPS.map(function (f, i) {
      return '<button class="ds-suggest__chip" data-i="' + i + '">' + SPARK + esc(f.q) + '</button>';
    }).join('');
  }
  renderSuggest();
  suggestChips.addEventListener('click', function (e) {
    var b = e.target.closest('.ds-suggest__chip'); if (!b) return;
    var f = FOLLOWUPS[+b.getAttribute('data-i')];
    b.remove();
    appendExchange(f.q, f.a, f.cta);
    if (!suggestChips.children.length) suggestBlock.style.display = 'none';
  });

  /* ---- follow-up composer ---- */
  document.getElementById('dsComposer').addEventListener('submit', function (e) {
    e.preventDefault();
    var inp = this.querySelector('input');
    var v = inp.value.trim(); if (!v) return;
    var f = answerFor(v);
    appendExchange(v, f.a, f.cta);
    inp.value = '';
  });

  /* ---- "open full findings" links inside follow-up replies ---- */
  thread.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-report]')) result.classList.add('open');
  });

  /* ---- New search resets to the landing ---- */
  var newBtn = document.getElementById('newSearch');
  if (newBtn) newBtn.addEventListener('click', function (e) {
    e.preventDefault();
    result.hidden = true; result.classList.remove('open');
    landing.hidden = false; input.value = ''; autogrow();
    var side = document.getElementById('side'); if (side) side.classList.remove('open');
    input.focus();
  });

  /* ---- mobile sidebar toggle ---- */
  var toggle = document.getElementById('sideToggle');
  var side = document.getElementById('side');
  if (toggle && side) toggle.addEventListener('click', function () { side.classList.toggle('open'); });
  var collapse = document.getElementById('sideCollapse');
  if (collapse && side) collapse.addEventListener('click', function () { side.classList.toggle('open'); });
})();
