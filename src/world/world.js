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
      0.01,
      1000
    );
    this.camera.position.z = 120;
    this.camera.position.set(
      0.11459020972513605,
      0.11082042815194855,
      0.9883501457347775
    );
    // this.camera.position.set(
    //   8.644532098765922,
    //   2.5346311384277453,
    //   -4.494887454121001
    // );

    this.camera.target = new THREE.Vector3();

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 0.01;
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
    decalDiffuse.anisotropy = 16;
    decalDiffuse.flipY = true;

    const textTexture = textureLoader.load('/texture/style/text.svg');
    this.uvs = [];
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
      this.pathMesh(v, decalDiffuse, textTexture, 'MultiplyMixDiffuse');
    });
    setTimeout(() => {
      this.uvs.forEach(u => {
        const params = {
          tx: 0,
          ty: 0
        }
        this.gui.add(params, 'tx', 0, 1).name('tx').onChange(() => {
          u.uvUnifiedTransform.value = u.uvUnifiedTransform.value.setUvTransform(params.tx,params.ty, 1, 1, 0, 0, 0);
          console.log(u.uvUnifiedTransform.value, params)
        });
        this.gui.add(params, 'ty', 0, 1).name('ty').onChange(() => {
          u.uvUnifiedTransform.value.setUvTransform(params.tx,params.ty, 1, 1, 0, 0, 0);
        });
      })
    }, 2000)
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
        "#include <common>",
        `#include <common>
         uniform sampler2D unifiedMap;
         varying vec2 vUvUnified;
         #ifdef USE_UNIFIED_EDITOR_UV
          uniform sampler2D unifiedEditorMap;
          varying vec2 vUvUnifiedEditor;
         #endif
      `);
      m.fragmentShader = m.fragmentShader.replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        // SVGs added to diffuse map
        vec4 svgTexelColor;

        // Combine main svg and svg editor color if available
        #ifdef USE_UNIFIED_EDITOR_UV
          vec4 unifiedTexelColor = texture2D(unifiedMap, vUvUnified);
          // Editor SVG w/ different UVs
          vec4 unifiedEditorTexelColor = texture2D(unifiedEditorMap, vUvUnifiedEditor);
          // Combine SVG and Editor SVG
          svgTexelColor = vec4(mix(unifiedTexelColor.rgb, unifiedEditorTexelColor.rgb, unifiedEditorTexelColor.a), unifiedTexelColor.a);
        #else
          svgTexelColor = texture2D(unifiedMap, vUvUnified);
        #endif

        // // #ifdef DEBUG_UV
        // // // Combine
        // // if (gl_FragCoord.x <= 900.) {
        // //     //{{colorMixer.ReplaceDiffuse}}
        // // } else if (gl_FragCoord.x > 900. && gl_FragCoord.x < 1050.) {
        // //     //{{colorMixer.ReplaceMixDiffuse}}
        // // } else {
        // //     //{{colorMixer.MultiplyMixDiffuse}}
        // // }
        // // #else
        // // //{{mixer}}
        // // #endif

        // // If texture has diffuse use that (what about vertex colour?)
        #ifdef USE_MAP
          //   svgTexelColor = mapTexelToLinear(svgTexelColor);
          #ifndef MIX_TYPE_REPLACE_DIFFUSE
            #ifdef MIX_TYPE_REPLACE_MIX_DIFFUSE
                //  mix SVG texture and other maps, except for existing diffuse map
                diffuseColor = vec4(mix(diffuseColor.rgb, svgTexelColor.rgb, svgTexelColor.a), diffuseColor.a);
            #endif
            #ifdef MIX_TYPE_MULTIPLY_MIX_DIFFUSE
                // multiply SVG with existing diffuse map (requires white material) (comes out darker) e.g. KB-652-I-SS-1-Womens-Inline-Polo-Shirt-Polo-Collar-Multi-Size
                diffuseColor *= vec4(mix(diffuseColor.rgb, svgTexelColor.rgb, svgTexelColor.a), diffuseColor.a);
            #endif
          #endif
        #else
          // TODO:  USE_MAP enables mapTexelToLinear, so if material doesn't have it it's missing - using just sRGBToLinear for now?!
          // https://stackoverflow.com/questions/21630224/three-js-gamma-correction-and-custom-shaders
          // svgTexelColor = sRGBToLinear(svgTexelColor);
          diffuseColor = svgTexelColor;
        #endif

        #ifdef MIX_TYPE_REPLACE_DIFFUSE
          // svgTexelColor = sRGBToLinear(svgTexelColor);
          diffuseColor = svgTexelColor;
        #endif
        `);
      m.vertexShader = m.vertexShader.replace(
        "#include <common>",
        `#include <common>
          attribute vec2 uv2;
          varying vec2 vUv2;
          attribute vec2 uvUnified;
          varying vec2 vUvUnified;
          uniform mat3 uvUnifiedTransform;

          #ifdef USE_UNIFIED_EDITOR_UV
            attribute vec2 uvUnifiedEditor;
            varying vec2 vUvUnifiedEditor;
            uniform mat3 uvUnifiedEditorTransform;
          #endif
        `);
      m.vertexShader = m.vertexShader.replace(
        "#include <uv_vertex>",
        `#include <uv_vertex>
          vUv2 = uv2;
          vUvUnified = ( uvUnifiedTransform * vec3( uvUnified, 1 ) ).xy;
          #ifdef USE_UNIFIED_EDITOR_UV
            vUvUnifiedEditor = ( uvUnifiedEditorTransform * vec3( uvUnifiedEditor, 1 ) ).xy;
          #endif
        `);
        this.uvs.push(m.uniforms);
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
