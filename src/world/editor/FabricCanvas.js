import { Canvas } from 'fabric';
import * as THREE from 'three';

var getMousePosition = function (dom, x, y) {
  var rect = dom.getBoundingClientRect();
  return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
};

export default class FabricCanvas extends Canvas {
  constructor(el, options, world) {
    super(el, options);
    this.world = world;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clickedPointCoords = new THREE.Vector2();
  }
  _onMouseMove(e) {
    const positionOnScene = getPositionOnScene(
      canvasForDrawingThreejsSceneEl,
      e
    );
    if (positionOnScene) {
      const canvasRect = fabricCanvas._offset;
      const simEvt = new MouseEvent(e.type, {
        clientX: canvasRect.left + positionOnScene.x,
        clientY: canvasRect.top + positionOnScene.y,
      });

      super._onMouseMove(simEvt);
    } else {
      super._onMouseMove(e);
    }
  }

  getIntersects(point, objects) {
    this.mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
    this.raycaster.setFromCamera(this.mouse, this.world.camera);
    return this.raycaster.intersectObjects(objects);
  }

  /**
   * Three.js Helper functions
   */
  getPositionOnScene(evt) {
    // console.log('evt', evt);
    let clientX = 0;
    let clientY = 0;
    if (evt instanceof MouseEvent) {
      clientX = evt.clientX;
      clientY = evt.clientY;
    } else {
      throw new Error('event type is not supported');
    }

    var array = getMousePosition(
      this.world.renderer.domElement,
      clientX,
      clientY
    );
    this.clickedPointCoords.fromArray(array);

    var intersects = this.getIntersects(
      this.clickedPointCoords,
      this.world.scene.children
    );
    if (intersects.length > 0 && intersects[0].uv) {
      var uv = intersects[0].uv;
      intersects[0].object.material.map.transformUv(uv);
      let x1 = this.getRealPosition('x', uv.x);
      let y1 = this.getRealPosition('y', uv.y);

      return {
        x: x1,
        y: y1,
      };
    }
    return null;
  }

  getRealPosition(axis, value) {
    let CORRECTION_VALUE = axis === 'x' ? 4.5 : 5.5;

    return (
      Math.round(value * this.world.renderer.domElement.clientHeight) -
      CORRECTION_VALUE
    );
  }
}
