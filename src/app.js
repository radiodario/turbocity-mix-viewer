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

  var bgCol = gui.addColor(logo, "backgroundColor")
    .name("BG Colour")
    .onChange(function(val) {
      logo.setBackground();
    });

  var bgImg = gui.add(logo, "backgroundImage")
    .name("BG Image url")
    .onChange(function(val) {
      logo.setBackground();
    });

  var anim = gui.add(logo, "animate")
    .name("BG animate")
    .onChange(function(val) {
      logo.setBackground();
    });

  var m = gui.addColor(logo, "logoColour").name("FG Colour");
  m.onChange(function(val) {
    // logo.updateMaterial
  })

  // initialise and render once you're done boy;
  logo.init(render);

}


setup();


