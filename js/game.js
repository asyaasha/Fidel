//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane,  HEIGHT, WIDTH, renderer, container;

function createScene(){
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  //create camera
  aspectRatio = WIDTH/HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PrespectiveCamera (
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
//set the camera position
camera.position.x = 0;
camera.position.z = 200;
camera.position.y = 100;
//create renderer
renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;

//add the DOM element of the renderer to the container in html
container = document.getElementById('world');
container.appendChild(renderer.domElement);
//listen to the screen, update it on resize
window.addEventListener('resize', handleWindowResize, false);

}

function init(){
  //set up the scene
  createScene();

  createLights();

//add objects
  createPlane();
  createEarth();
  createSky();

  loop();

  window.addEventListener('load', init, false);
}