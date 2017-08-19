//COLORS
var Colors = {
    red:0xf25346,
    white:0xffffff,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
    green:0xadff2f,
};

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane,  
  HEIGHT, WIDTH, renderer, container, hemisphereLight, shadowLight;

function createScene(){

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf7cd68, 100, 1000);

  //create camera
  aspectRatio = WIDTH/HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera (
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
renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
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
  shadowLight.position.set(150, 350, 350);  //the direction of the light  
  shadowLight.castShadow = true;  //shadows casting 
  shadowLight.shadow.camera.left = -400;   // define the visible area of the projected shadow
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;    // define the resolution of the shadow; the higher the better, 
  shadowLight.shadow.mapSize.height = 2048;    // but also the more expensive and less performant
  
  scene.add(hemisphereLight);    // add lights to the scene to activate
  scene.add(shadowLight);
}

//***** CREATE CLOUDS *******

Cloud = function(){
  // Create an empty container that will hold the different parts of the cloud
  this.mesh = new THREE.Object3D();
  var geom = new THREE.SphereGeometry( 20, 20, 20 );
  
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white,  
  });
  
  // duplicate the geometry a random number of times
  var nBlocs = 3+Math.floor(Math.random()*3);
  for (var i=0; i<nBlocs; i++ ){
    
    var m = new THREE.Mesh(geom, mat);     // create the mesh by cloning the geometry
    m.position.x = i*15;                // set the position and the rotation randomly
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = .1 + Math.random()*.9;      // set the size randomly
    m.scale.set(s,s,s);
    m.castShadow = true;
    m.receiveShadow = true;
    
    // add to the container 
    this.mesh.add(m);
  } 
}

// ***** CREATE SKY ********

Sky = function(){

  this.mesh = new THREE.Object3D();  //empty container
  this.numberClouds = 30;    
  var stepAngle = Math.PI*2 / this.numberClouds;    // To distribute the clouds consistently they need to be placed accordingly to a uniform angle
  
  for(var i=0; i<this.numberClouds; i++){    // create the clouds
    var c = new Cloud();
    var a = stepAngle*i; // this is the final angle of the cloud
    var h = 750 + Math.random()*200; // this is the distance between the center of the axis and the cloud itselF
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.rotation.z = a + Math.PI/2;              // rotate the cloud according to its position
    c.mesh.position.z = -400-Math.random()*400;      // random depths inside of the scene
    var s = 1+Math.random()*2;    // random scale for each cloud
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);  //add the mesh of each cloud in the scene
  }  
}
var sky;
function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -550;
  scene.add(sky.mesh);
}

//***** CREATE EARTH *******

Earth = function(){
  var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2)); //rotate on x axis

  var mat = new THREE.MeshBasicMaterial({
    color:Colors.green,
    transparent:true,
    opacity:.6,
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

function loop(){
  sky.mesh.rotation.z += .007;
  earth.mesh.rotation.z += .005;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
function init(){
  createScene();//set up the scene
  createLights();
  // createPlane();//add objects
  createEarth();
  createSky();
  loop();
}
window.addEventListener('load', init, false);