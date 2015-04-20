var THREE = require('three.js');
require('./ExplodeModifier')(THREE);
require('./TessellateModifier')(THREE);


var container, scene, renderer, camera, light, clock, loader;
var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;

container = document.querySelector('.viewport');

clock = new THREE.Clock();

WIDTH = window.innerWidth,
HEIGHT = window.innerHeight;

VIEW_ANGLE = 45,
ASPECT = WIDTH / HEIGHT,
NEAR = 1,
FAR = 10000;

scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(WIDTH, HEIGHT);

container.appendChild(renderer.domElement);

camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

camera.position.set(0, 0, 1000);

var debugaxis = function(axisLength){
    //Shorten the vertex function
    function v(x,y,z){
            return new THREE.Vector3(x,y,z);
    }

    //Create axis (point1, point2, colour)
    function createAxis(p1, p2, color){
            var line, lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: color, lineWidth: 1});
            lineGeometry.vertices.push(p1, p2);
            line = new THREE.Line(lineGeometry, lineMat);
            scene.add(line);
    }

    createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000);
    createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00);
    createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);
};

//To use enter the axis length
// debugaxis(100);

var uniforms = {
  time: { type: "f", value: 1.0 },
  resolution: { type: "v2", value: new THREE.Vector2() }
};

var attributes = {
  displacement: {type: 'v3',value: []},
  customColor: {type: 'c',value: []}
};

window.camera = camera;

scene.add(camera);

light = new THREE.DirectionalLight(0xffffff);

light.position.set(0, 0, 1000);
light.castShadow = true;
light.shadowCameraLeft = -60;
light.shadowCameraTop = -60;
light.shadowCameraRight = 60;
light.shadowCameraBottom = 60;
light.shadowCameraNear = 1;
light.shadowCameraFar = 1000;
light.shadowBias = -.0001
light.shadowMapWidth = light.shadowMapHeight = 1024;
light.shadowDarkness = .7;

scene.add(light);

loader = new THREE.JSONLoader();
var mesh;
loader.load('data/turbocity.json', function (geometry, materials) {
  // var material = new THREE.MeshLambertMaterial( {
  //   color: 0xffffff,
  //   shading: THREE.FlatShading } );

  // var material = new THREE.ShaderMaterial( {
  //   uniforms: uniforms,
  //   vertexShader: document.getElementById( 'vertex-shader' ).textContent,
  //   fragmentShader: document.getElementById( 'fragment-shader-3' ).textContent
  //   } );

  var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    attributes: attributes,
    vertexShader: document.getElementById( 'vertex-shader-displacement' ).textContent,
    fragmentShader: document.getElementById( 'fragment-shader-displacement' ).textContent,
    shading:    THREE.FlatShading,
    side:       THREE.DoubleSide

    } );

  geometry.computeBoundingBox();

  var bb = geometry.boundingBox;
  var i, n = 6, maxEdgeLength = 4;
  var tessellator = new THREE.TessellateModifier(maxEdgeLength);
  for (i = 0; i < n; i++)
      tessellator.modify(geometry);
  var exploder = new THREE.ExplodeModifier();
  exploder.modify(geometry);
  var vertices = geometry.vertices;
  var colors = attributes.customColor.value;
  var displacement = attributes.displacement.value;
  var h, d, x, y, z;
  var nv, v = 0;
  var rand = function() {
      return Math.random() - 0.5;
  }
  for (var f = 0; f < geometry.faces.length; f++) {
      var face = geometry.faces[f];
      if (face instanceof THREE.Face3) {
          nv = 3;
      } else {
          nv = 4;
      }
      h = 0.15 * Math.random();
      s = 0.7 * Math.random();
      d = 10 * (0.5 - Math.random());
      x = rand() * (bb.max.x - bb.min.x);
      y = rand() * (bb.max.y - bb.min.y) * 4;
      z = rand() * (bb.max.z - bb.min.z) * 10;
      for (var i = 0; i < nv; i++) {
          colors[v] = new THREE.Color();
          displacement[v] = new THREE.Vector3();
          colors[v].setHSL(h, s, 1);
          colors[v].convertGammaToLinear();
          displacement[v].set(x, y, z);
          v += 1;
      }
  }

  // debugger;
  // var material = new THREE.MeshBasicMaterial({
  //   color: 0xffffff,
  //   wireframe: true
  // });

  mesh = new THREE.Mesh(
    geometry,
    material
  );

  mesh.geometry.computeTangents();

  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.scale.set(25,25,25);
  mesh.rotation.x = Math.PI/2;

  scene.add(mesh);
  onWindowResize();

  window.addEventListener( 'resize', onWindowResize, false );



  render();
});


function onWindowResize( event ) {

  uniforms.resolution.value.x = window.innerWidth;
  uniforms.resolution.value.y = window.innerHeight;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function render() {
  // var delta = clock.getDelta();

  // uniforms.time.value += delta * 5;

  var t = Date.now() * 0.0005;
  var interval = 10;
  uniforms.time.value = t % interval / interval;



  var time = clock.getElapsedTime();
  // mesh.rotation.z = ((Math.PI/2) - Math.abs((time % Math.PI) - (Math.PI)));
  mesh.rotation.z -= 0.001;


  renderer.render(scene, camera);
  requestAnimationFrame(render);
}