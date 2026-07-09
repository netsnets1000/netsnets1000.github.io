/* Tellera vision brief — render the nine agents + orchestrator dots from shared data */
(function () {
  var T = window.TELLERA;
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
  // platform order: Phone, VIN, Property, then the rest
  var AGENTS = ['PH', 'VE', 'PR', 'PE', 'LE', 'FA', 'TS', 'BU', 'MO'].map(function (code) {
    return T.AGENTS.filter(function (a) { return a.code === code; })[0];
  });

  var grid = document.getElementById('visionAgents');
  if (grid) grid.innerHTML = AGENTS.map(function (a) {
    return '<article class="v-agent">' +
      '<div class="v-agent__top" style="background:' + a.grad + '"></div>' +
      '<div class="v-agent__body">' +
        '<div class="v-agent__row">' +
          '<span class="v-agent__badge" style="border:1.5px solid ' + a.color + ';color:' + a.color + '">' + a.code + '</span>' +
          '<div><div class="v-agent__name">' + esc(a.app) + '</div><div class="v-agent__cat">' + esc(a.cat) + '</div></div>' +
        '</div>' +
        '<div class="v-agent__desc">' + esc(a.desc) + '</div>' +
      '</div>' +
    '</article>';
  }).join('');

  var dots = document.getElementById('visionDots');
  if (dots) dots.innerHTML = AGENTS.map(function (a) {
    return '<span style="background:' + a.color + '"></span>';
  }).join('');
})();
