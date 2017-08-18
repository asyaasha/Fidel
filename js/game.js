//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane,  
  HEIGHT, WIDTH, renderer, container, hemisphereLight, shadowLight;

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
container = document.getElementById('world');//add the DOM element of the renderer to the container in html
container.appendChild(renderer.domElement);

window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {   //update on resize
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function createLights(){
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  //the direction of the light  
  shadowLight.position.set(150, 350, 350);
  //shadows casting 
  shadowLight.castShadow = true;
  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better, 
  // but also the more expensive and less performant
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;
  
  // add lights to the scene to activate
  scene.add(hemisphereLight);  
  scene.add(shadowLight);
}

Earth = function(){
  var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2)); //rotate on x axis

  var mat = new THREE.MeshPhongMaterial({
    color:Colors.brown,
    transparent:true,
    opacity:.6,
    shading:THREE.FlatShading,
  });

  this.mesh = new THREE.Mesh(geom,mat);  //mesh combination of geometry and material
  this.mesh.recieveShadow = true;
}
var earth;
function createEarth(){
earth = new Earth();
earth.mesh.position.y = -600;
scene.add(earth.mesh);
}
renderer.render(scene, camera);
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