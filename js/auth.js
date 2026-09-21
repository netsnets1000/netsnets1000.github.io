/* Tellera — mock signup / signin modal. Triggered by any [data-auth] element.
   Providers just simulate a connect and land in /portal. */
(function () {
  'use strict';
  var G = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"/><path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75z"/></svg>';
  var GH = '<svg viewBox="0 0 24 24" fill="#14161B"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>';
  var MS = '<svg viewBox="0 0 24 24"><path fill="#F25022" d="M3 3h8.5v8.5H3z"/><path fill="#7FBA00" d="M12.5 3H21v8.5h-8.5z"/><path fill="#00A4EF" d="M3 12.5h8.5V21H3z"/><path fill="#FFB900" d="M12.5 12.5H21V21h-8.5z"/></svg>';

  var modal, mode = 'signup';
  function prov(k, label, icon) { return '<button class="au-prov" data-prov="' + k + '">' + icon + label + '</button>'; }

  function build() {
    modal = document.createElement('div');
    modal.className = 'au-modal';
    modal.innerHTML = '<div class="au-card"><div class="au-card__strip"></div>' +
      '<div class="au-card__t" id="auTitle">Create your Tellera account</div>' +
      '<div class="au-card__d" id="auDesc">Free sandbox key in two minutes — no card required.</div>' +
      '<div class="au-provs">' + prov('google', 'Continue with Google', G) + prov('github', 'Continue with GitHub', GH) + prov('microsoft', 'Continue with Microsoft', MS) + '</div>' +
      '<div class="au-or"><span></span>or<span></span></div>' +
      '<div class="au-email"><input type="email" placeholder="you@company.com" id="auEmail" autocomplete="email"><button class="au-btn" data-prov="email">Continue with email</button></div>' +
      '<div class="au-fine">By continuing you agree to Tellera\'s <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</div>' +
      '<div class="au-switch" id="auSwitch"></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    modal.querySelectorAll('[data-prov]').forEach(function (b) { b.addEventListener('click', function () { go(b); }); });
  }
  function setMode(m) {
    mode = m === 'signin' ? 'signin' : 'signup';
    modal.querySelector('#auTitle').textContent = mode === 'signin' ? 'Sign in to Tellera' : 'Create your Tellera account';
    modal.querySelector('#auDesc').textContent = mode === 'signin' ? 'Welcome back — pick up where you left off.' : 'Free sandbox key in two minutes — no card required.';
    modal.querySelector('#auSwitch').innerHTML = mode === 'signin'
      ? 'New to Tellera? <a data-switch="signup">Create an account</a>'
      : 'Already have an account? <a data-switch="signin">Sign in</a>';
    modal.querySelector('[data-switch]').addEventListener('click', function () { setMode(this.getAttribute('data-switch')); });
  }
  function open(m) { if (!modal) build(); setMode(m); modal.classList.add('open'); }
  function close() { if (modal) modal.classList.remove('open'); }
  function go(btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="au-spin"></span>Connecting…';
    setTimeout(function () { window.location.href = '/portal'; }, 750);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-auth]'); if (!t) return;
    e.preventDefault();
    open(t.getAttribute('data-auth') || 'signup');
  });
})();
