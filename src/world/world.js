import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export class World {
  constructor() {
    this.init();
    this.importModel();
    this.initGui();
  }

  /**
   * @description: 初始化场景
   * @param {number} val
   */
  init() {
    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.setClearColor('#91a8de');

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 120;
    this.camera.position.set(
      0.11459020972513605,
      0.11082042815194855,
      0.9883501457347775
    );
    this.camera.target = new THREE.Vector3();

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 100;

    // lights
    this.addLights();

    // resize handler
    const onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);

    this.scene.add(new THREE.AxesHelper(1));
    // animation
    this.clock = new THREE.Clock();
    this.animation();
  }

  /**
   * @description: 添加灯光
   * @param {number} val
   */
  addLights() {
    const lights = new THREE.Group();
    lights.name = 'lights';
    lights.add(new THREE.AmbientLight(0xffffff, 3));
    this.scene.add(lights);
  }

  animation() {
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = this.clock.getDelta();
      this.controls.update(delta);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  /**
   * @description: 导入衣服模型
   */
  importModel() {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/lib/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load('/data/cloth.glb', (gltf) => {
      this.cloth = gltf.scene;
      this.cloth.position.y = -1.2;

      this.scene.add(gltf.scene);
      this.cloth.name = 'cloth';
      this.cloth.children.forEach((v) => {
        if (v.isMesh) {
          v.material = v.material.clone();
        }
      });
      // 找到mesh gui
      // this.cloth.children.forEach(v => {
      //   const fd = this.gui.addFolder(v.name);
      //   const params = {
      //     color: '#ffffff',
      //   };
      //   fd
      //   .addColor(params, 'color')
      //   .name('Color')
      //   .onChange((color) =>{
      //     v.material.color = new THREE.Color(color);
      //   });
      // })
      dracoLoader.dispose();
    });
  }

  initGui() {
    const gui = new dat.GUI();
    this.gui = gui;
    const params = {
      backgroundColor: '#ffffff',
    };
    // gui.add(params, 'rotationSpeed', 0, 0.1).name('Rotation Speed');
    gui
      .addColor(params, 'backgroundColor')
      .name('Background Color')
      .onChange((color) => {
        this.renderer.setClearColor(color);
      });
  }

  destroy() {}
}
