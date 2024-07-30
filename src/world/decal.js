import * as THREE from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";

export class DecalManager {
  constructor(options) {
    const {renderer, scene, controls, camera} = options;
    this.renderer = renderer;
    this.scene = scene;
    this.controls = controls;
    this.camera = camera;

    this.raycaster = new THREE.Raycaster();
    this.cloth = this.scene.getObjectByName("cloth");

    this.init();
  }

  /**
   * @description: 初始化decalManager
   */
  init() {
    // 点击属性
    this.intersection = {
      intersects: false,
      point: new THREE.Vector3(),
      orientation: new THREE.Vector3(),
    };

    this.mouse = new THREE.Vector2();
    this.moved = false;
    // mouseHelper for record status
    this.mouseHelper = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 10),
      new THREE.MeshNormalMaterial()
    );
    this.mouseHelper.name = 'mouseHelper';
    this.mouseHelper.visible = false;
    this.scene.add(this.mouseHelper);

    // 纹理属性
    this.decalOption = {
      scale: 0.1,
      scale: 0.1,
      scale: 0.1,
    };
    this.decals = [];
    this.createDecalMaterial();

    // 事件监听
    this.controls.addEventListener("change", () => {
      this.moved = true;
    });
    this.renderer.domElement.addEventListener(
      "mousedown",
      () => {
        this.moved = false;
      },
      false
    );
    // 点击衣服贴花
    this.renderer.domElement.addEventListener("click", (event) => {
      const mouse = this.getMouse(event);
      this.checkIntersection(mouse);
      if (!this.moved && this.intersection.intersects) this.decalCloth();
    });
  }

  /**
   * @description: 创建贴花纹理
   */
  createDecalMaterial() {
    const textureLoader = new THREE.TextureLoader();
    const decalDiffuse = textureLoader.load("/texture/logo/2.png");
    // const decalDiffuse = textureLoader.load("/texture/decal-diffuse.png");

    this.decalMaterial = new THREE.MeshBasicMaterial({
      map: decalDiffuse,
      // color: new THREE.Color(0xffeeff),
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    });
  }

  /**
   * @description: 给衣服贴图
   */
  decalCloth() {
    const position = new THREE.Vector3().copy(this.intersection.point);
    const orientation = new THREE.Vector3().copy(this.mouseHelper.rotation );

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

  /**
   * @description: 获取点击point
   */
  getMouse(event) {
    let mouse = {};
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
    return mouse;
  }

  /**
   * @description: 根据鼠标点射线求交
   * @param {*} mouse 
   */
  checkIntersection(mouse) {
    if (!this.cloth) return;
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects([this.cloth]);
    if (intersects.length === 0) {
      this.intersection.intersects = false;
      return;
    }

    const p = intersects[0].point;
    this.intersection.point.copy(p);

    this.clickMesh = intersects[0].object;
    const n = intersects[0].face.normal.clone();
    n.transformDirection(this.clickMesh.matrixWorld);
    n.multiplyScalar(10);
    n.add(intersects[0].point);

    this.mouseHelper.lookAt(n);
    this.intersection.intersects = true;

    intersects.length = 0;
  }
}
