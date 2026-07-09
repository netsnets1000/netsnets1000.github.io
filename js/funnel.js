/* Tellera funnel — step-by-step loading experience → gated result → mock sign-up.
   Duration is intentionally long (builds investment before the paywall). */
(function () {
  var DURATION = 35000;   // total loading time in ms (tweak here)
  var TICK = 100;

  /* ---- query from the property search ---- */
  var params = new URLSearchParams(window.location.search);
  var address = params.get('address');
  var ask = params.get('ask');
  var query = ask ? ask
    : address ? 'Who owns ' + address + ', and what is it worth?'
    : 'Who owns 13 Roland Dr, and what is it worth?';
  var qEl = document.getElementById('fnQuery');
  if (qEl) qEl.textContent = query;
  var addrEl = document.getElementById('fnAnswerAddr');
  if (addrEl && address) addrEl.textContent = address;

  /* ---- animated visuals ---- */
  function visual(key) {
    switch (key) {
      case 'pin': return '<svg viewBox="0 0 156 156" width="156" height="156">' +
        '<circle class="fn2-ring" cx="75" cy="82" r="26" fill="none" stroke="#7C6BFF" stroke-width="2"/>' +
        '<circle class="fn2-ring d2" cx="75" cy="82" r="26" fill="none" stroke="#2E7BFF" stroke-width="2"/>' +
        '<g class="fn2-float"><path d="M78 34 C62 34 51 47 51 63 C51 84 78 112 78 112 C78 112 105 84 105 63 C105 47 94 34 78 34 Z" fill="url(#fv1)"/><circle cx="78" cy="61" r="10" fill="#fff"/></g>' +
        '<defs><linearGradient id="fv1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7C6BFF"/><stop offset="1" stop-color="#5B45E0"/></linearGradient></defs></svg>';
      case 'docs': return '<svg viewBox="0 0 156 156" width="156" height="156">' +
        '<rect x="54" y="46" width="58" height="74" rx="7" fill="#E5EEFF" stroke="#CFE0FF" stroke-width="1.5"/>' +
        '<g class="fn2-float"><rect x="44" y="38" width="58" height="74" rx="7" fill="#fff" stroke="#CFD8E4" stroke-width="1.5"/>' +
        '<rect x="54" y="52" width="28" height="4" rx="2" fill="#C6D0DE"/><rect x="54" y="63" width="38" height="4" rx="2" fill="#E1E7F1"/><rect x="54" y="74" width="34" height="4" rx="2" fill="#E1E7F1"/>' +
        '<circle cx="86" cy="96" r="12" fill="#E7F1E8"/><path d="M81 96l4 4 7-8" fill="none" stroke="#357A46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';
      case 'shield': return '<svg viewBox="0 0 156 156" width="156" height="156">' +
        '<path d="M78 34 L108 46 V72 C108 96 95 112 78 120 C61 112 48 96 48 72 V46 Z" fill="url(#fv2)"/>' +
        '<path class="fn2-draw" d="M66 79 l9 9 18 -22" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<defs><linearGradient id="fv2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E7BFF"/><stop offset="1" stop-color="#5B45E0"/></linearGradient></defs></svg>';
      case 'value': return '<svg viewBox="0 0 156 156" width="156" height="156">' +
        '<line x1="42" y1="112" x2="116" y2="112" stroke="#D3DBE6" stroke-width="2"/>' +
        '<rect class="fn2-vbar" x="50" y="80" width="15" height="32" rx="3" fill="#5AA0FF" style="animation-delay:0s"/>' +
        '<rect class="fn2-vbar" x="72" y="64" width="15" height="48" rx="3" fill="#7B5BFF" style="animation-delay:.25s"/>' +
        '<rect class="fn2-vbar" x="94" y="50" width="15" height="62" rx="3" fill="#5B45E0" style="animation-delay:.5s"/></svg>';
      case 'timeline': return '<svg viewBox="0 0 156 156" width="156" height="156">' +
        '<line x1="42" y1="78" x2="114" y2="78" stroke="#D3DBE6" stroke-width="2"/>' +
        '<circle class="fn2-dot" cx="48" cy="78" r="7" fill="#2E7BFF" style="animation-delay:0s"/>' +
        '<circle class="fn2-dot" cx="70" cy="78" r="7" fill="#6B5BFF" style="animation-delay:.35s"/>' +
        '<circle class="fn2-dot" cx="92" cy="78" r="7" fill="#7B5BFF" style="animation-delay:.7s"/>' +
        '<circle class="fn2-dot" cx="114" cy="78" r="7" fill="#B0553F" style="animation-delay:1.05s"/></svg>';
      case 'prism': return '<svg viewBox="0 0 156 156" width="156" height="156"><g class="fn2-float">' +
        '<path d="M78 42 L112 104 L44 104 Z" fill="none" stroke="url(#fv3)" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<path d="M28 74 L52 74" stroke="#8A8475" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M96 68 L130 62" stroke="#2E7BFF" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M97 76 L132 76" stroke="#7B5BFF" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M96 84 L130 90" stroke="#B06BFF" stroke-width="3" stroke-linecap="round"/></g>' +
        '<defs><linearGradient id="fv3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E7BFF"/><stop offset="1" stop-color="#B06BFF"/></linearGradient></defs></svg>';
    }
    return '';
  }

  /* ---- the sequential screens (this is the pitch) ---- */
  var SCREENS = [
    { label: 'Step 1 of 6 · Locating the property', title: 'Finding every record tied to this address.', msg: 'Ask a general AI who owns a home and it stops cold — no access to property records. Tellera doesn’t.', check: 'Matching the parcel', visual: 'pin' },
    { label: 'Step 2 of 6 · Reading county records', title: 'Straight from the county — not a guess.', msg: 'Appraisal district and clerk records are the official source of truth. Tellera reads them directly.', check: 'County appraisal district · clerk deeds', visual: 'docs' },
    { label: 'Step 3 of 6 · Title, liens & taxes', title: 'Know what’s owed before you trust an address.', msg: 'Open liens, mortgages, and tax status — the red flags other tools make you dig for.', check: 'Title & lien registries', visual: 'shield' },
    { label: 'Step 4 of 6 · Valuing the property', title: 'What it’s really worth.', msg: 'Licensed partners estimate value and equity — data other sites bury in tabs or lock behind a paywall.', check: 'Ownerly valuation · comparable sales', visual: 'value' },
    { label: 'Step 5 of 6 · Tracing ownership', title: 'The full story, not a snapshot.', msg: 'Every owner and every sale tied to this address, as far back as the record goes.', check: 'Deed & MLS sale history', visual: 'timeline' },
    { label: 'Step 6 of 6 · Compiling your findings', title: 'One clear answer — not ten browser tabs.', msg: 'Tellera reads it all and answers the exact question you asked. That’s the difference.', check: 'Assembling your findings', visual: 'prism' }
  ];

  var stage = document.getElementById('fnStage');
  stage.innerHTML = SCREENS.map(function (s) {
    return '<div class="fn2-screen">' +
      '<div class="fn2-visual">' + visual(s.visual) + '</div>' +
      '<div class="fn2-stagelabel">' + s.label + '</div>' +
      '<h2 class="fn2-title">' + s.title + '</h2>' +
      '<p class="fn2-msg">' + s.msg + '</p>' +
      '<div class="fn2-checkrow"><span class="fn-spinner"></span>' + s.check + '</div>' +
    '</div>';
  }).join('');
  var screens = stage.children;

  var bar = document.getElementById('fnBar');
  var statusText = document.getElementById('fnStatusText');
  var statusEl = document.getElementById('fnStatus');
  var cur = -1;
  function setScreen(i) {
    if (i === cur) return;
    if (cur >= 0) screens[cur].classList.remove('active');
    cur = i;
    screens[i].classList.add('active');
  }
  setScreen(0);

  var elapsed = 0, N = SCREENS.length;
  var timer = setInterval(function () {
    elapsed += TICK;
    var p = Math.min(1, elapsed / DURATION);
    bar.style.width = (p * 100).toFixed(1) + '%';
    statusText.textContent = 'Analyzing · ' + Math.round(p * 100) + '%';
    setScreen(Math.min(N - 1, Math.floor(p * N)));
    if (p >= 1) { clearInterval(timer); finish(); }
  }, TICK);

  function finish() {
    statusEl.classList.add('done');
    statusEl.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13"><path d="M5 12l4 4 10-11" fill="none" stroke="#357A46" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>Findings ready';
    stage.style.display = 'none';
    document.getElementById('fnAnswer').hidden = false;
    document.getElementById('fnLock').classList.add('show');
  }

  /* ---- mock sign-up / sign-in modal ---- */
  var modal = document.getElementById('fnModal');
  var titleEl = document.getElementById('fnModalTitle');
  var descEl = document.getElementById('fnModalDesc');
  var submitEl = document.getElementById('fnModalSubmit');
  var altEl = document.getElementById('fnModalAlt');
  var MODES = {
    signup: { title: 'Create your free account', desc: 'See your Property findings and save your searches.', submit: 'Create account &amp; view findings', alt: 'Already have an account? <a data-switch="signin">Sign in</a>' },
    signin: { title: 'Welcome back', desc: 'Sign in to view your Property findings.', submit: 'Sign in &amp; view findings', alt: 'New to Tellera? <a data-switch="signup">Create a free account</a>' }
  };
  function openModal(mode) {
    var m = MODES[mode] || MODES.signup;
    titleEl.textContent = m.title; descEl.textContent = m.desc;
    submitEl.innerHTML = m.submit; altEl.innerHTML = m.alt;
    modal.hidden = false;
  }
  function closeModal() { modal.hidden = true; }
  function unlock() {
    closeModal();
    document.getElementById('fnLock').classList.remove('show');
    document.getElementById('fnCard').classList.add('fn-unlocked');
  }
  document.querySelectorAll('[data-open-signup]').forEach(function (b) { b.addEventListener('click', function () { openModal('signup'); }); });
  document.querySelectorAll('[data-open-signin]').forEach(function (b) { b.addEventListener('click', function () { openModal('signin'); }); });
  document.getElementById('fnModalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  altEl.addEventListener('click', function (e) { var a = e.target.closest('[data-switch]'); if (a) { e.preventDefault(); openModal(a.getAttribute('data-switch')); } });
  document.getElementById('fnModalForm').addEventListener('submit', function (e) { e.preventDefault(); unlock(); });
})();
