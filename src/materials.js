var THREE = require('three.js')



module.exports = {

  basic: function (uniforms, colour) {

    if (!colour) {
      colour = 0xffffff;
    }

    return new THREE.MeshBasicMaterial({
      color: colour
    });

  },

  lambert : function (uniforms, colour) {

    if (!colour) {
      colour = 0xffffff;
    }

    return new THREE.MeshLambertMaterial({
      color: colour,
      shading: THREE.FlatShading
    });
  },

  colourBlender : function(uniforms) {
    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById( 'vertex-shader' ).textContent,
      fragmentShader: document.getElementById( 'fragment-shader-1' ).textContent
    });
  },

  spots : function(uniforms) {
    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById( 'vertex-shader' ).textContent,
      fragmentShader: document.getElementById( 'fragment-shader-2' ).textContent
    })
  },

  aliceStripes : function(uniforms) {
    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById( 'vertex-shader' ).textContent,
      fragmentShader: document.getElementById( 'fragment-shader-3' ).textContent
    })
  }




}