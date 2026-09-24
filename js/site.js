/* Tellera — shared behavior for content pages (Our data, agent pages, use cases). */
(function () {
  'use strict';
  var burger = document.getElementById('stBurger'), menu = document.getElementById('stMenu');
  if (burger && menu) {
    var links = Array.prototype.slice.call(document.querySelectorAll('.dv-nav__links a')).map(function (a) {
      return '<a href="' + a.getAttribute('href') + '">' + a.textContent + '</a>';
    }).join('');
    menu.innerHTML = links + '<a href="/portal" data-auth="signin">Sign in</a><a class="g" href="/deep-search">Try Tellera</a>';
    menu.hidden = false;
    var open = false;
    burger.addEventListener('click', function () { open = !open; menu.classList.toggle('show', open); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) { open = false; menu.classList.remove('show'); } });
  }
})();
