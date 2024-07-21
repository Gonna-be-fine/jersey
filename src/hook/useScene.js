import {
  Engine,
  Vector3,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  Scene
} from '@babylonjs/core';

const createScene = (engine, canvas) => {
  const scene = new Scene(engine);

  const camera = new ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    3,
    new Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);

  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  const box = MeshBuilder.CreateBox('box', {}, scene);
  return scene;
};

export const useScene = function (dom) {
  if (!dom && dom.value instanceof HTMLCanvasElement) {
    console.error('Please give a canvas dom');
    return;
  }
  const engine = new Engine(dom.value, true); // Generate the BABYLON 3D engine

  // Add your code here matching the playground format
  const scene = createScene(engine, dom.value); //Call the createScene function

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener('resize', function () {
    engine.resize();
  });

  return {
    engine,
    scene,
  };
};
