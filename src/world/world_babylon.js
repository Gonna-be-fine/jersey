import * as Babylon from '@babylonjs/core';
import * as Loaders from '@babylonjs/loaders';

window.loaders = Loaders
export class World {
  constructor(dom) {
    this.init(dom);
  }

  createScene(engine, canvas) {
    const scene = new Babylon.Scene(engine);
    const camera = new Babylon.ArcRotateCamera(
      'camera',
      -Math.PI,
      2* Math.PI,
      10,
      new Babylon.Vector3(0, 0, 0),
      scene
    );
    engine.scenes[0].cameras[0].lowerRadiusLimit = 0.1
    engine.scenes[0].cameras[0].minZ = 0.1
    camera.setPosition(new Babylon.Vector3(0, 0, 20));
    camera.attachControl(canvas, true);

    const light = new Babylon.HemisphericLight(
      'light',
      new Babylon.Vector3(0, 1, 0),
      scene
    );

    // const box = Babylon.MeshBuilder.CreateBox('box', {}, scene);
    return scene;
  }

  init(dom) {
    if (!dom && dom.value instanceof HTMLCanvasElement) {
      console.error('Please give a canvas dom');
      return;
    }
    this.engine = new Babylon.Engine(dom.value, true); // Generate the BABYLON 3D engine
    // Add your code here matching the playground format
    this.scene = this.createScene(this.engine, dom.value); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    window.engine = this.engine;
    // Watch for browser/canvas resize events
    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    this.importModel();

  }

  async importModel() {
    const cloth = await Babylon.SceneLoader.ImportMeshAsync(
      null,
      '/data/',
      'untitled.glb',
      this.scene
    );
    cloth.meshes.forEach(mesh => {
      mesh.position.y -= 0.1;
    })

    var decalMaterial = new Babylon.StandardMaterial('decalMat', this.scene);
    decalMaterial.diffuseTexture = new Babylon.Texture(
      'https://api.kitbuilder.co.uk/Api/file/98870799?width=128&height=128&distributorId=95183814',
      this.scene
    );
    decalMaterial.diffuseTexture.hasAlpha = true;
    decalMaterial.zOffset = -2;

    const onPointerDown = (evt) => {
      if (evt.button !== 0) {
        return;
      }
      // check if we are under a mesh
      var pickInfo = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY,
        // (mesh) => mesh === cloth
      );
      if (pickInfo.hit) {
        var decalSize = new Babylon.Vector3(0.1, 0.1, .1);

        /**************************CREATE DECAL*************************************************/
        var decal = Babylon.MeshBuilder.CreateDecal('decal', pickInfo.pickedMesh, {
          position: pickInfo.pickedPoint,
          normal: pickInfo.getNormal(true),
          size: decalSize,
        });
        decal.material = decalMaterial;
        /***************************************************************************************/
      }
    };
    const canvas = this.engine.getRenderingCanvas();
    canvas.addEventListener('pointerdown', onPointerDown, false);

    this.scene.onDispose = function () {
      canvas.removeEventListener('pointerdown', onPointerDown);
    };
  }
}
