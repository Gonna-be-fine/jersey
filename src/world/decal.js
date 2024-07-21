import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry';

export class DecalManager {
  constructor(renderer, scene, controls) {
    this.renderer = renderer;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.cloth = this.scene.getObjectByName('cloth');

    this.init(controls);
  }

  init() {
    this.intersection = {
      intersects: false,
      point: new THREE.Vector3(),
      orientation: new THREE.Vector3()
    };
    this.decalOption = {
      scale: 1,
    };
    this.decals = [];
    this.mouse = new THREE.Vector2();
    this.moved = false;
    this.createDecalMaterial();

    this.controls.addEventListener('change', () => {
      this.moved = true;
    });
    this.renderer.domElement.addEventListener(
      'mousedown',
      () => {
        this.moved = false;
      },
      false
    );
    this.renderer.domElement.addEventListener('click', () => {
      checkIntersection();
      if (!this.moved && intersection.intersects) this.decalCloth();
    });
    // this.renderer.domElement.addEventListener('mousemove', this.onTouchMove);
    // this.renderer.domElementow.addEventListener('touchmove', this.onTouchMove);
  }

  createDecalMaterial() {
    const textureLoader = new THREE.TextureLoader();
    const decalDiffuse = textureLoader.load('textures/decal/decal-diffuse.png');

    this.decalMaterial = new THREE.MeshBasicMaterial({
      map: decalDiffuse,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    });
  }

  decalCloth() {
    const position = new THREE.Vector3().copy(this.intersection.point);
    // orientation.copy( mouseHelper.rotation );

    const size = new THREE.Vector3();
    size.set(
      this.decalOption.scale,
      this.decalOption.scale,
      this.decalOption.scale
    );

    const m = new THREE.Mesh(
      new DecalGeometry(this.clickMesh, position, orientation, size),
      this.decalMaterial
    );
    this.decals.push(m);
    this.scene.add(m);
  }

  onTouchMove(event) {
    let x, y;
    if (event.changedTouches) {
      x = event.changedTouches[0].pageX;
      y = event.changedTouches[0].pageY;
    } else {
      x = event.clientX;
      y = event.clientY;
    }
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    this.checkIntersection();
  }

  checkIntersection() {
    if (!this.cloth) return;
    this.raycaster.setFromCamera(mouse, camera);
    const intersects = this.raycaster.intersectObjects([this.cloth]);
    if (intersects.length === 0) {
      intersection.intersects = false;
      return;
    }

    const p = intersects[0].point;
    intersection.point.copy(p);
    intersection.intersects = true;
  }
}
