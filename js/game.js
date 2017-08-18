var Colors ={
  red:#BE2A42FF,
  white:#EFF3FEFF,
  green:#95BC45FF,
  grey:#A0A2A2FF,
  blue:#62C6BEFF,
  pink:#EDB6C2FF,
  darkred:#4D0801FF,
  yellow:#FEDF2CFF,
};
window.addEventListener('load', init, false);

function init(){
  //set up the scene
  createScene();

  createLights();

//add objects
  createPlane();
  createEarth();
  createSky();

  loop();
}