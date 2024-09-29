import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { Scene_1 } from './scenes/Scene_1';
import { Scene_2 } from './scenes/Scene_2';

const canvas = document.getElementById('renderCanvas');
// render the scene in this canvas element
const engine = new BABYLON.Engine(canvas);

const createScene1 = function(){
  const scene1 = new Scene_1(engine, () => {
    disposeScene(scene1.getScene());
    createScene2();
  });
  engine.runRenderLoop(function() {
    scene1.getScene().render();
  });
}

const createScene2 = function(){
  console.log("Second Scene Creation...");
  const scene2 = new Scene_2(engine);
    engine.runRenderLoop(function() {
        scene2.getScene().render();
    });
}

const disposeScene = function(scene) {
  if (scene) {
      scene.dispose();
  }
};

createScene1();

window.addEventListener('resize', function() {
  engine.resize();
});
