import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { DecalManager } from "./decal";

const ClothkeyMap = {
  领座: "Pattern2D_2361708",
  领面: "Pattern2D_70819",
  前主外布: "Pattern2D_486144",
  后主外布: "Pattern2D_483306",
  前下外布: "Pattern2D_486129",
  后下外布: "Pattern2D_483920",
  左袖领: "Pattern2D_484659",
  右袖领: "Pattern2D_485516",
  左外袖: "Pattern2D_484674",
  右外袖: "Pattern2D_485220",
  前主里布: "Pattern2D_486144_1",
  后主里布: "Pattern2D_483306_1",
  左里袖: "Pattern2D_484674_1",
  右里袖: "Pattern2D_485220_1",
  后领下: "Pattern2D_2361709",
};
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
    this.renderer.domElement.style.position = "absolute";
    this.renderer.setClearColor("#91a8de");

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
    // this.camera.position.set(
    //   0.11459020972513605,
    //   0.11082042815194855,
    //   0.9883501457347775
    // );
    this.camera.position.set(
      8.644532098765922,
      2.5346311384277453,
      -4.494887454121001
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
    window.addEventListener("resize", onWindowResize, false);

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
    lights.name = "lights";
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
    dracoLoader.setDecoderPath("/lib/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load("/data/cloth.glb", (gltf) => {
      this.cloth = gltf.scene;
      this.cloth.position.y = -1.2;

      this.scene.add(gltf.scene);
      this.cloth.name = "cloth";
      this.cloth.children.forEach((v) => {
        if (v.isMesh) {
          v.material = v.material.clone();
        }
      });
      // // 找到mesh gui
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

      // this.textureModel();
      this.setGeometryAttribute();
      this.decalManager = new DecalManager({
        renderer: this.renderer,
        scene: this.scene,
        controls: this.controls,
        camera: this.camera,
      });
    });
  }

  setGeometryAttribute() {
    const textureLoader = new THREE.TextureLoader();
    const decalDiffuse = textureLoader.load("/texture/style/2.svg");
    decalDiffuse.wrapS = THREE.RepeatWrapping;
    decalDiffuse.wrapT = THREE.RepeatWrapping;
    decalDiffuse.flipY = true;

    this.cloth.traverse((v) => {
      if (!v.isMesh) return;
      v.geometry.setAttribute(
        "uvUnified",
        v.geometry.attributes.uv2 || v.geometry.attributes.uv
      );
      v.geometry.setAttribute(
        "uvUnifiedEditor",
        v.geometry.attributes.uv2 || v.geometry.attributes.uv
      );
      this.pathMesh(v, decalDiffuse, decalDiffuse, 'MultiplyMixDiffuse');
    });
  }

  pathMesh(mesh, unifiedTexture, editorTexture, type) {
    const material = mesh.material;
    material.customProgramCacheKey = function () {
      return this.name;
    };

    material.onBeforeCompile = (m) => {
      m.defines = m.defines || {};
      if (mesh.geometry.attributes.uvUnifiedEditor && editorTexture) {
        m.defines.USE_UNIFIED_EDITOR_UV = "";
      }
      m.uniforms.unifiedEditorMap = { value: editorTexture };
      switch (type) {
        case "MultiplyMixDiffuse":
          m.defines.MIX_TYPE_MULTIPLY_MIX_DIFFUSE = "";
          break;
        case "ReplaceDiffuse":
          m.defines.MIX_TYPE_REPLACE_DIFFUSE = "";
          break;
        case "ReplaceMixDiffuse":
          m.defines.MIX_TYPE_REPLACE_MIX_DIFFUSE = "";
          break;
      }

      m.uniforms.unifiedMap = { value: unifiedTexture };
      m.uniforms.uvUnifiedTransform = { value: new THREE.Matrix3() };
      m.uniforms.uvUnifiedEditorTransform = { value: new THREE.Matrix3() };

      m.fragmentShader = m.fragmentShader.replace(
        "#include <uv2_pars_fragment>",
        "#include <uv2_pars_fragment>\n////////////\nuniform sampler2D unifiedMap;\nvarying vec2 vUvUnified;\n\n#ifdef USE_UNIFIED_EDITOR_UV\n    uniform sampler2D unifiedEditorMap;\n    varying vec2 vUvUnifiedEditor;\n#endif\n////////////\n"
      );
      m.fragmentShader = m.fragmentShader.replace(
        "#include <map_fragment>",
        "#include <map_fragment>\n////////////\n// SVGs added to diffuse map\n\nvec4 svgTexelColor;\n\n// Combine main svg and svg editor color if available\n#ifdef USE_UNIFIED_EDITOR_UV\n    vec4 unifiedTexelColor = texture2D(unifiedMap, vUvUnified);\n    // Editor SVG w/ different UVs\n    vec4 unifiedEditorTexelColor = texture2D(unifiedEditorMap, vUvUnifiedEditor);\n    // Combine SVG and Editor SVG\n    svgTexelColor = vec4(mix(unifiedTexelColor.rgb, unifiedEditorTexelColor.rgb, unifiedEditorTexelColor.a), unifiedTexelColor.a);\n#else\n    svgTexelColor = texture2D(unifiedMap, vUvUnified);\n#endif\n\n// // #ifdef DEBUG_UV\n// // // Combine\n// // if (gl_FragCoord.x <= 900.) {\n// //     //{{colorMixer.ReplaceDiffuse}}\n// // } else if (gl_FragCoord.x > 900. && gl_FragCoord.x < 1050.) {\n// //     //{{colorMixer.ReplaceMixDiffuse}}\n// // } else {\n// //     //{{colorMixer.MultiplyMixDiffuse}}\n// // }\n// // #else\n// // //{{mixer}}\n// // #endif\n\n// If texture has diffuse use that (what about vertex colour?)\n#ifdef USE_MAP\n    svgTexelColor = mapTexelToLinear(svgTexelColor);\n    #ifndef MIX_TYPE_REPLACE_DIFFUSE\n        #ifdef MIX_TYPE_REPLACE_MIX_DIFFUSE\n            //  mix SVG texture and other maps, except for existing diffuse map\n            diffuseColor = vec4(mix(diffuseColor.rgb, svgTexelColor.rgb, svgTexelColor.a), diffuseColor.a);\n        #endif\n        #ifdef MIX_TYPE_MULTIPLY_MIX_DIFFUSE\n            // multiply SVG with existing diffuse map (requires white material) (comes out darker) e.g. KB-652-I-SS-1-Womens-Inline-Polo-Shirt-Polo-Collar-Multi-Size\n            diffuseColor *= vec4(mix(diffuseColor.rgb, svgTexelColor.rgb, svgTexelColor.a), diffuseColor.a);\n        #endif\n    #endif\n#else\n    // TODO:  USE_MAP enables mapTexelToLinear, so if material doesn't have it it's missing - using just sRGBToLinear for now?!\n    // https://stackoverflow.com/questions/21630224/three-js-gamma-correction-and-custom-shaders\n    svgTexelColor = sRGBToLinear(svgTexelColor);\n    diffuseColor = svgTexelColor;\n#endif\n\n#ifdef MIX_TYPE_REPLACE_DIFFUSE\n    svgTexelColor = sRGBToLinear(svgTexelColor);\n    diffuseColor = svgTexelColor;\n#endif\n\n////////////\n"
      );
      m.vertexShader = m.vertexShader.replace(
        "#include <uv2_pars_vertex>",
        "#include <uv2_pars_vertex>\n////////////\nattribute vec2 uvUnified;\nvarying vec2 vUvUnified;\nuniform mat3 uvUnifiedTransform;\n\n#ifdef USE_UNIFIED_EDITOR_UV\n    attribute vec2 uvUnifiedEditor;\n    varying vec2 vUvUnifiedEditor;\n    uniform mat3 uvUnifiedEditorTransform;\n#endif\n////////////\n"
      );
      m.vertexShader = m.vertexShader.replace(
        "#include <uv2_vertex>",
        "#include <uv2_vertex>\n\n////////////\n\nvUvUnified = ( uvUnifiedTransform * vec3( uvUnified, 1 ) ).xy;\n#ifdef USE_UNIFIED_EDITOR_UV\n    vUvUnifiedEditor = ( uvUnifiedEditorTransform * vec3( uvUnifiedEditor, 1 ) ).xy;\n#endif\n\n\n////////////\n"
      );
    };
  }

  textureModel() {
    const textureLoader = new THREE.TextureLoader();
    const decalDiffuse = textureLoader.load("/texture/style/2.svg");
    decalDiffuse.wrapS = THREE.RepeatWrapping;
    decalDiffuse.wrapT = THREE.RepeatWrapping;
    decalDiffuse.flipY = true;

    const material = new THREE.MeshBasicMaterial({
      map: decalDiffuse,
      transparent: true,
      polygonOffset: true,
    });
    const mesh = this.cloth.getObjectByName(ClothkeyMap["前主外布"]);
    mesh.material = material;
    const params = {
      offsetX: 0,
      offsetY: 0,
      repeatX: 1,
      repeatY: 1,
      polygonOffsetFactor: 0,
    };
    this.gui
      .add(params, "offsetX", -10, 10)
      .name("offsetX")
      .onChange((e) => {
        decalDiffuse.offset.x = e;
      });
    this.gui
      .add(params, "offsetY", -10, 10)
      .name("offsetY")
      .onChange((e) => {
        decalDiffuse.offset.y = e;
      });
    this.gui
      .add(params, "repeatX", -10, 10)
      .name("repeatX")
      .onChange((e) => {
        decalDiffuse.repeat.x = e;
      });
    this.gui
      .add(params, "repeatX", -10, 10)
      .name("repeatX")
      .onChange((e) => {
        decalDiffuse.repeat.y = e;
      });
    this.gui
      .add(params, "polygonOffsetFactor", -5, 5)
      .name("polygonOffsetFactor")
      .onChange((e) => {
        material.polygonOffsetFactor = e;
      });
  }

  initGui() {
    const gui = new dat.GUI();
    this.gui = gui;
    const params = {
      backgroundColor: "#ffffff",
    };
    // gui.add(params, 'rotationSpeed', 0, 0.1).name('Rotation Speed');
    gui
      .addColor(params, "backgroundColor")
      .name("Background Color")
      .onChange((color) => {
        this.renderer.setClearColor(color);
      });
  }

  destroy() {}
}
