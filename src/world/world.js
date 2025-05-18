import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { DecalManager } from './decalManager';
import EventDispatch from '../utils/EventDispatch';
import { Lights, Lights1 } from './config';
import { ClothTexture } from './ClothTexture';
import { SvgEditor } from './SvgEditor';
import { throttle } from 'lodash';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';

export class World extends EventDispatch {
  constructor(dom, options) {
    super();
    this.glDom = dom;
    this.width = this.glDom.clientWidth || window.innerWidth;
    this.height = this.glDom.clientHeight || window.innerHeight;
    this.options = options;
    this.init();
    this.importModel();
    // this.initGui();
  }

  /**
   * @description: 初始化场景
   */
  init() {
    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    if(!this.glDom) {
      document.body.appendChild(this.renderer.domElement);
      this.renderer.domElement.style.position = 'absolute';
    }else{
      this.glDom.appendChild(this.renderer.domElement)
    }
    this.renderer.setClearColor(this.options.backgroundColor || '#1e1e1e');
    // 颜色矫正
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.01,
      1000
    );
    // this.camera.position.z = 120;
    if(this.options.cameraPosition) {
      this.camera.position.copy(this.options.cameraPosition);
    }else{
      this.camera.position.set(
        -0.009666748088079795,
        0.1459023549040876,
        0.6137803763666974
      );
    }
    this.camera.target = new THREE.Vector3();

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 0.01;
    this.controls.maxDistance = 100;

    // lights
    this.addLights();

    // resize handler
    this.onWindowResize = () => {
      this.width = this.glDom.clientWidth;
      this.height = this.glDom.clientHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.decalManager.resize();
    };
    if(!this.glDom){
      window.addEventListener('resize', this.onWindowResize, false);
    }else{
      const resizeObserver = new ResizeObserver(this.onWindowResize)
      resizeObserver.observe(this.glDom);
      this.resizeObserver = resizeObserver;
    }

    // this.scene.add(new THREE.AxesHelper(1));

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
      this.animationFrameId = requestAnimationFrame(animate);

      const delta = this.clock.getDelta();
      this.controls.update(delta);
      this.decalManager.render();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  loadAsync() {
    const loadModels = modelList.map(model => {
      return new Promise((resolve, reject) => {
        loader.load(model.url, (gltf) => {
          console.log('Loaded', model.url);
          resolve(gltf);
        }, undefined, (error) => {
          console.error('Error loading', model.url, error);
          reject(error);
        });
      });
    });
  }

  /**
   * @description: 导入衣服模型
   */
  importModel() {
    // set loaders
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/lib/draco/');
    const ktxLoader = new KTX2Loader();			
    ktxLoader.setTranscoderPath( '/lib/basis/' ).detectSupport( this.renderer );
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktxLoader);

    const modelList = this.options.model;
    this.resource = {};
    let index = 0;
    modelList.forEach(model => {
      loader.load(model.url, (gltf) => {
        const clothGltf = gltf.scene;
        this.resource[model.type] = {
          model: clothGltf
        }
        if(model.position) {
          clothGltf.position.copy(model.position);
        }
        console.log(gltf.scene);
        this.scene.add(gltf.scene);
        clothGltf.name = model.type;
        clothGltf.children.forEach((v) => {
          if (v.isMesh) {
            v.userData.type = model.type;
            // 设置normalMap为空，去除DirectionalLight对衣服的会有白色块
            v.material.normalMap = null;
            if (!this.resource[model.type].material) {
              this.resource[model.type].material = v.material;
            }
            v.material = this.resource[model.type].material;
          }
        });
        this.pathMesh(model);
        // dispose draco
        index++;
        if(index >= modelList.length) {
          dracoLoader.dispose();
        }
      });
    })    
  }

  mutateEditor(options) {
    const { texture, type } = options;
    const svgEditor = new SvgEditor(this, type);
    this.resource[type].svgEditor = svgEditor;
    svgEditor.setSvgString({ url: texture.edit });
    
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
      this.resource[type].editTexManager.svgToTexture(svgEditor.svgCanvas.svg2String());
    }, 200);

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    const targetNode = svgEditor.svgCanvas.getSvgRoot();
    observer.observe(targetNode, config);
  }

  /**
   * @description: 配置衣服的uv和纹理
   */
  pathMesh(options) {
    const { texture, type } = options;
    // cloth texture
    const mainTextManager = new ClothTexture({
      img: texture.main,
    });
    const editTextManager = new ClothTexture({ img: texture.edit });
    this.resource[type].mainTexManager = mainTextManager;
    this.resource[type].editTexManager = editTextManager;

    // 监听edit svg变化，更新纹理
    this.mutateEditor(options);

    let firstMesh = null;
    this.resource[type].model.traverse((v) => {
      if (!v.isMesh) return;
      v.geometry.setAttribute(
        'uvUnified',
        v.geometry.attributes.uv1 || v.geometry.attributes.uv
      );
      v.geometry.setAttribute(
        'uvUnifiedEditor',
        v.geometry.attributes.uv1 || v.geometry.attributes.uv
      );
      if (!firstMesh) {
        firstMesh = v;
      }
    });
    this.textureModel(
      firstMesh,
      this.resource[type].mainTexManager.canvasTexture,
      this.resource[type].editTexManager.canvasTexture,
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
    const material = mesh.material;
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
      material.uniforms = m.uniforms;
    };
    material.needsUpdate = true;
  }

  switchClothType(type) {
    if(type === 'suit') {
      this.resource.pant.model.visible = true;
      this.resource.jersey.model.visible = true;
      this.updateCameraAndControls(this.scene);
    }else{
      for(let key in this.resource) {
        this.resource[key].model.visible = false;
      }
      this.resource[type].model.visible = true;
      this.updateCameraAndControls(this.resource[type].model);
    }
  }

  updateCameraAndControls(group) {
    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
  
    const fov = this.camera.fov * (Math.PI / 180);
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim / (2 * Math.tan(fov / 2)) * 1.8;
  
    this.camera.position.set(center.x, center.y, center.z + distance);
    this.camera.lookAt(center);
  
    this.controls.target.copy(center);
    this.controls.update();
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

  destroy() {
    if(!this.glDom){
      window.removeEventListener('resize', this.onWindowResize, false);
    }else{
      this.resizeObserver.disconnect();
    }

    // 清理 Three.js 相关资源
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
        if (object.texture) {
          object.texture.dispose();
        }
      });
    }

    // 清理渲染器
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.domElement = null;
    }

    // 清理动画循环
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // // 清理编辑器相关资源
    // if (this.svgEditor) {
    //   this.svgEditor.destroy();
    // }

    // 清空场景
    if (this.scene) {
      while(this.scene.children.length > 0) { 
        this.scene.remove(this.scene.children[0]);
      }
    }

    // 清空引用
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.resource = null;

  }
}
