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
  function renderPills() {
    pillsWrap.innerHTML = T.AGENTS.map(function (a, i) {
      return '<button class="ds-pill" data-i="' + i + '">' +
        '<span class="ds-pill__badge" style="border:1.5px solid ' + a.color + ';color:' + a.color + '">' + a.code + '</span>' +
        '<span class="ds-pill__col"><span class="ds-pill__app">' + esc(a.app) + '</span><span class="ds-pill__cat">' + esc(T.SEED_CAT[a.code]) + '</span></span>' +
      '</button>';
    }).join('');
  }
  renderPills();
  pillsWrap.addEventListener('click', function (e) {
    var b = e.target.closest('.ds-pill'); if (!b) return;
    input.value = T.SEED[T.AGENTS[+b.getAttribute('data-i')].code];
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
})();
