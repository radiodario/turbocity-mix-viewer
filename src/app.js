var THREE = require('three.js');

var container = document.querySelector('.viewport');

var logo = require('./spinning-logo')(container);

function render() {
  logo.render();
  requestAnimationFrame(render);
}

// initialise and render once you're done boy;
logo.init(render);


