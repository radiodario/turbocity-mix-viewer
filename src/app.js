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

  var bgGui = gui.addFolder('Background');

  var bgCol = bgGui.addColor(logo, "backgroundColor")
    .name("BG Colour")
    .onChange(function(val) {
      logo.setBackground();
    });

  var bgImg = bgGui.add(logo, "backgroundImage")
    .name("BG Image url")
    .onChange(function(val) {
      logo.setBackground();
    });

  var anim = bgGui.add(logo, "animate")
    .name("BG animate")
    .onChange(function(val) {
      logo.setBackground();
    });

  var m = gui.addColor(logo, "logoColour")
    .name("FG Colour")
    .onChange(function(val) {
      logo.updateMaterialColour()
    });


  var lightGui = gui.addFolder('Light');
  var lX = lightGui.add(logo, 'lightX', -200, 200)
    .name("Light X")
    .listen()
    .onChange(function(val) {
      logo.updateLight();
    });
  var lY = lightGui.add(logo, 'lightY', -200, 200)
    .name("Light Y")
    .listen()
    .onChange(function(val) {
      logo.updateLight();
    });
  var lZ = lightGui.add(logo, 'lightZ', -200, 200)
    .name("Light Z")
    .listen()
    .onChange(function(val) {
      logo.updateLight();
    });
  var lightDef = lightGui.add(logo, 'resetLight')
    .name("Reset");


  // initialise and render once you're done boy;
  logo.init(render);

}


setup();


