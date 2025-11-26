

/**
 * Three.js Helper functions
 */
function getPositionOnScene(sceneContainer, evt) {
  let clientX = 0;
  let clientY = 0;
  if (evt instanceof MouseEvent) {
    clientX = evt.clientX;
    clientY = evt.clientY;
  } else {
    throw new Error('event type is not supported');
  }

  var array = getMousePosition(
    canvasForDrawingThreejsSceneEl,
    clientX,
    clientY
  );
  clickedPointCoords.fromArray(array);

  var intersects = getIntersects(clickedPointCoords, scene.children);
  if (intersects.length > 0 && intersects[0].uv) {
    var uv = intersects[0].uv;
    intersects[0].object.material.map.transformUv(uv);
    let x1 = getRealPosition('x', uv.x);
    let y1 = getRealPosition('y', uv.y);

    return {
      x: x1,
      y: y1,
    };
  }
  return null;
}

function getRealPosition(axis, value) {
  let CORRECTION_VALUE = axis === 'x' ? 4.5 : 5.5;

  return (
    Math.round(value * canvasForDrawingThreejsSceneEl.clientHeight) -
    CORRECTION_VALUE
  );
}

var getMousePosition = function (dom, x, y) {
  var rect = dom.getBoundingClientRect();
  return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
};

var getIntersects = function (point, objects) {
  mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObjects(objects);
};
