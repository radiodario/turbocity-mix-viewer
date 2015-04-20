var THREE = require('three.js');

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


var gl = renderer.getContext();
debugger;

// camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

// camera.position.set(0, 0, 1000);

var aspect = window.innerWidth / window.innerHeight;
var d = 200;
camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, NEAR, FAR );

camera.position.set( d, d, d ); // all components equal
camera.lookAt( scene.position ); // or the origin


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

window.camera = camera;

scene.add(camera);

light = new THREE.DirectionalLight(0xffffff);

light.position.set(0, d, d);
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
  //   shading: THREE.FlatShading } )

  var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: document.getElementById( 'vertex-shader' ).textContent,
    fragmentShader: document.getElementById( 'fragment-shader-3' ).textContent
    } );


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

  var aspect = window.innerWidth / window.innerHeight;
  var d = 200;
  camera.left = - d * aspect;
  camera.right = d * aspect;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function render() {
  var delta = clock.getDelta();

  uniforms.time.value += delta * 5;

  var time = clock.getElapsedTime();
  // mesh.rotation.z -= .005;
  mesh.rotation.z = ((Math.PI/4) - Math.abs(((time/2) % Math.PI) - (Math.PI)));

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}