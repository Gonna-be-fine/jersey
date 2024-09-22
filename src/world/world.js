import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { DecalManager } from './decalManager';
import { Lights } from './config';
import { ClothTexture } from './ClothTexture';
import { SvgEditor } from './SvgEditor';
import { throttle } from 'lodash';

export class World {
  constructor() {
    this.init();
    this.importModel();
    this.initGui();
  }

  /**
   * @description: 初始化场景
   */
  init() {
    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.setClearColor('#757575');
    // 颜色矫正
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(
      75,
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
      this.decalManager.resize();
    };
    window.addEventListener('resize', onWindowResize, false);

    this.scene.add(new THREE.AxesHelper(1));

    // init DecalManager
    this.decalManager = new DecalManager(this);

    // animation
    this.clock = new THREE.Clock();
    this.animation();
  }

  /**
   * @description: 添加灯光
   */
  addLights() {
    const lights = new THREE.Group();
    lights.name = 'lights';
    lights.add(new THREE.AmbientLight(0xffffff, 1));
    this.scene.add(lights);
    const objectLoader = new THREE.ObjectLoader();
    const o = objectLoader.parse(Lights);
    this.scene.add(o);
    // // 添加lightHelper
    // o.traverse(v => {
    //   if(v.isLight && v.type === "DirectionalLight"){
    //     const lh = new THREE.DirectionalLightHelper(v);
    //     lh.name = v.name + 'hp';
    //     o.add(lh);
    //     setTimeout(() => {
    //       this.addDirectionLightGui(v);
    //     }, 2000)
    //   }
    // })
  }

  /**
   * @description: 添加平行光GUI调试
   * @param {*} light THREE.DirectionalLight
   */
  addDirectionLightGui(light) {
    const param = {
      x: 0,
      y: 0,
      distance: 5,
      intensity: light.intensity,
      visible: 0,
    };
    this.gui.add(param, 'x', 0, 360).onChange((e) => {
      const result = this.getLightPositionAndDisitance({
        rotateX: param.x,
        rotateY: param.y,
        distance: param.distance,
        target: light.target.position,
      });
      light.position.copy(result.pos);

      this.scene.traverse((l) => {
        if (l.isMesh && l.name === 'hp') {
          l.updateMatrixWorld();
          l.update();
        }
      });
    });
    this.gui.add(param, 'y', 0, 180).onChange((e) => {
      const result = this.getLightPositionAndDisitance({
        rotateX: param.x,
        rotateY: param.y,
        distance: param.distance,
        target: light.target.position,
      });
      light.position.copy(result.pos);
      this.scene.traverse((l) => {
        if (l.isMesh && l.name === 'hp') {
          l.updateMatrixWorld();
          l.update();
        }
      });
    });
    this.gui.add(param, 'intensity', 0, 10).onChange(() => {
      light.intensity = param.intensity;
    });
    this.gui.add(param, 'visible', 0, 10).onChange(() => {
      light.visible = param.visible > 5;
      this.scene.getObjectByName(light.name + 'hp').visible = light.visible;
    });
  }

  /**
   * @description: 根据rotateY, rotateX, distance, target获取平行光灯光位置
   * @param {*} lightData {rotateY, rotateX, distance, target}
   * @param {*} realTarget light.target
   */
  getLightPositionAndDisitance(lightData, realTarget) {
    const { rotateY, rotateX, distance, target } = lightData;
    const rRad = THREE.MathUtils.degToRad(rotateY);
    const aRad = THREE.MathUtils.degToRad(rotateX - 90);
    const v = new THREE.Vector3(1, 0, 0);
    const tempQua = new THREE.Quaternion();
    const targetQua = new THREE.Quaternion();
    tempQua.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rRad);
    targetQua.multiply(tempQua);
    tempQua.setFromAxisAngle(new THREE.Vector3(0, 1, 0), aRad);
    targetQua.multiply(tempQua);
    v.applyQuaternion(targetQua);
    v.normalize();
    const tempTarget = realTarget || target;
    const targetThreePosition = tempTarget;
    const t = new THREE.Vector3().set(
      targetThreePosition.x,
      targetThreePosition.y,
      targetThreePosition.z
    );
    return {
      pos: t.add(v.multiplyScalar(distance)),
      distance,
    };
  }

  animation() {
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = this.clock.getDelta();
      this.controls.update(delta);
      this.decalManager.render();
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
          // 设置normalMap为空，去除DirectionalLight对衣服的会有白色块
          v.material.normalMap = null;
          if (!this.clothMaterial) {
            this.clothMaterial = v.material;
          }
          v.material = this.clothMaterial;
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

      this.pathMesh();
    });
  }

  mutateEditor() {
    this.svgEditor = new SvgEditor(this);
    this.svgEditor.setSvgString({ url: '/texture/style/editText.svg' });

    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, childList: true, subtree: true };
    // 当观察到变动时执行的回调函数
    const callback = throttle((mutationsList, observer) => {
      // Use traditional 'for loops' for IE 11
      // for (let mutation of mutationsList) {
      //   if (mutation.type === 'childList') {
      //     console.log('A child node has been added or removed.');
      //   } else if (mutation.type === 'attributes') {
      //     console.log(
      //       'The ' + mutation.attributeName + ' attribute was modified.'
      //     );
      //   }
      // }
      console.log('changes')
      // this.editTextManager.svgToTexture(this.svgEditor.svgCanvas.svgroot.outerHTML);
      // this.editTextManager.svgToTexture(this.svgEditor.svgCanvas.getSvgString());
      this.editTextManager.svgToTexture(this.svgEditor.svgCanvas.svg2String());
    }, 200);

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    const targetNode = this.svgEditor.svgCanvas.getSvgRoot();
    observer.observe(targetNode, config);
  }

  /**
   * @description: 配置衣服的uv和纹理
   */
  pathMesh() {
    this.mainTextManager = new ClothTexture({
      img: '/texture/style/style1.svg',
    });
    this.editTextManager = new ClothTexture({ img: '/texture/style/text.svg' });

    this.mutateEditor();

    this.cloth.traverse((v) => {
      if (!v.isMesh) return;
      v.geometry.setAttribute(
        'uvUnified',
        v.geometry.attributes.uv2 || v.geometry.attributes.uv
      );
      v.geometry.setAttribute(
        'uvUnifiedEditor',
        v.geometry.attributes.uv2 || v.geometry.attributes.uv
      );
      if (!this.firstMesh) {
        this.firstMesh = v;
      }
    });
    this.textureModel(
      this.firstMesh,
      this.mainTextManager.canvasTexture,
      this.editTextManager.canvasTexture,
      'MultiplyMixDiffuse'
    );
  }

  /**
   * @description: 纹理绘制
   * @param {THREE.Mesh} mesh mesh
   * @param {Texture} unifiedTexture 底图纹理
   * @param {Texture} editorTexture 文字纹理
   * @param {string} type 渲染类型
   */
  textureModel(mesh, unifiedTexture, editorTexture, type) {
    const material = this.clothMaterial;
    material.customProgramCacheKey = function () {
      return this.name;
    };

    material.onBeforeCompile = (m) => {
      m.defines = m.defines || {};
      if (mesh.geometry.attributes.uvUnifiedEditor && editorTexture) {
        m.defines.USE_UNIFIED_EDITOR_UV = '';
      }
      switch (type) {
        case 'MultiplyMixDiffuse':
          m.defines.MIX_TYPE_MULTIPLY_MIX_DIFFUSE = '';
          break;
        case 'ReplaceDiffuse':
          m.defines.MIX_TYPE_REPLACE_DIFFUSE = '';
          break;
        case 'ReplaceMixDiffuse':
          m.defines.MIX_TYPE_REPLACE_MIX_DIFFUSE = '';
          break;
      }
      m.uniforms.unifiedEditorMap = { value: editorTexture };
      m.uniforms.unifiedMap = { value: unifiedTexture };
      m.uniforms.uvUnifiedTransform = { value: new THREE.Matrix3() };
      m.uniforms.uvUnifiedEditorTransform = { value: new THREE.Matrix3() };

      m.fragmentShader = m.fragmentShader.replace(
        '#include <common>',
        `#include <common>
         uniform sampler2D unifiedMap;
         varying vec2 vUvUnified;
         #ifdef USE_UNIFIED_EDITOR_UV
          uniform sampler2D unifiedEditorMap;
          varying vec2 vUvUnifiedEditor;
         #endif
      `
      );
      m.fragmentShader = m.fragmentShader.replace(
        '#include <map_fragment>',
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
        `
      );
      m.vertexShader = m.vertexShader.replace(
        '#include <common>',
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
        `
      );
      m.vertexShader = m.vertexShader.replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>
          vUv2 = uv2;
          vUvUnified = ( uvUnifiedTransform * vec3( uvUnified, 1 ) ).xy;
          #ifdef USE_UNIFIED_EDITOR_UV
            vUvUnifiedEditor = ( uvUnifiedEditorTransform * vec3( uvUnifiedEditor, 1 ) ).xy;
          #endif
        `
      );
      this.uniforms = m.uniforms;
    };
    material.needsUpdate = true;
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
