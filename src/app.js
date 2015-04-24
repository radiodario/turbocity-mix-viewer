var THREE = require('three.js');

var container = document.querySelector('.viewport');

var logo = require('./spinning-logo')(container);

var dat = require('dat-gui');

function render() {
  logo.render();
  requestAnimationFrame(render);
}


var setup = function() {

  var gui = new dat.GUI();

  var c = gui.addColor(logo, "backgroundColor").name("BG Colour");
  c.onChange(function(val) {
    logo.setBackground();
  });
  // initialise and render once you're done boy;
  logo.init(render);

}


setup();


