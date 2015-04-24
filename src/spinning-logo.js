var THREE = require('three.js');


var materials = require('./materials');

module.exports = function (canvas) {

  var container = canvas;

  // these are used for the shaded materials;
  var uniforms = {
    time: { type: "f", value: 1.0 },
    resolution: { type: "v2", value: new THREE.Vector2() }
  };

  var clock = new THREE.Clock();

  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;

  var VIEW_ANGLE = 45;

  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 1;
  var FAR = 10000;

  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  var scene, light, camera, mesh;

  return {

    backgroundColor: "#000000",
    backgroundImage: "none",

    material: "plain", // default
    logoColour: 0xffffff,

    camDistance: 200,

    init: function initialise(onCompleteCallback) {
      //;_;
      var self = this;

      // Setup the renderer
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(WIDTH, HEIGHT);
      container.appendChild(renderer.domElement);

      // setup the scene
      scene = new THREE.Scene();

      // setup the camera
      var d = this.camDistance;
      camera = new THREE.OrthographicCamera(-d * ASPECT, d * ASPECT, d, -d, NEAR, FAR);
      camera.position.set(d, d, d);
      camera.lookAt(scene.position);
      scene.add(camera);

      // setup the lights
      light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, d, d);
      light.castShadow = true;
      light.shadowCameraLeft = -60;
      light.shadowCameraTop = -60;
      light.shadowCameraRight = 60;
      light.shadowCameraBottom = 60;
      light.shadowCameraNear = 1;
      light.shadowCameraFar = 10000;
      light.shadowBias = -.0001
      light.shadowMapWidth = light.shadowMapHeight = 1024;
      light.shadowDarkness = .7;
      scene.add(light);

      self.setBackground();
      // ACTION
      var loader = new THREE.JSONLoader();
      loader.load('data/turbocity.json', function(geometry, _) {

        var mat = self.getMaterial();

        mesh = new THREE.Mesh(geometry, mat);

        mesh.geometry.computeTangents();
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.scale.set(25, 25, 25);
        mesh.rotation.x = Math.PI/2;

        scene.add(mesh);
        self.onWindowResize();
        window.addEventListener('resize', self.onWindowResize.bind(self), false);

        // start
        onCompleteCallback();

      });

    },

    getMaterial: function() {
      var fn = materials[this.material];
      console.log(this.logoColour);
      return fn(this.logoColour);
    },

    onWindowResize: function resize() {


      WIDTH = window.innerWidth;
      HEIGHT = window.innerHeight;
      ASPECT = WIDTH / HEIGHT;

      uniforms.resolution.value.x = WIDTH;
      uniforms.resolution.value.y = HEIGHT;

      var d = this.camDistance;
      camera.left = - d * ASPECT;
      camera.right = d * ASPECT;
      camera.aspect = ASPECT;
      camera.updateProjectionMatrix();

      renderer.setSize( WIDTH, HEIGHT );
    },

    render: function render() {
      var delta = clock.getDelta();

      // XXX: MAKE THIS A VARIABLE --v
      uniforms.time.value += delta * 5;

      var time = clock.getElapsedTime();

      mesh.rotation.z = ((Math.PI/4) - Math.abs(((time/2) % Math.PI) - (Math.PI)));

      renderer.render(scene, camera);

    },

    setBackground: function setBackground() {

      var image = this.backgroundImage;

      if (image !== 'none') {
        image = 'url('+image+')'
      }

      document.body.style.backgroundImage = image;

      var colour = this.backgroundColor;

      document.body.style.backgroundColor = colour;

      if (this.animate) {
        document.body.classList.add('animate');
      } else {
        document.body.classList.remove('animate');
      }

    }


  };


}