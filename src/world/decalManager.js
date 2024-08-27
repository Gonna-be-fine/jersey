import * as THREE from 'three';

class DecalManager {
  constructor(world) {
    this.world = world;
    this.init();
  }

  init() {
    this.customUvmaterial = new THREE.RawShaderMaterial({
      vertexShader:
        'precision mediump float;\nprecision mediump int;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nattribute vec3 position;\nattribute vec4 color;\nattribute vec2 uvUnifiedEditor;\nvarying vec2 vUvUnifiedEditor;\nvarying vec3 vPosition;\nvarying vec4 vColor;\nvoid main() {\n    vUvUnifiedEditor = uvUnifiedEditor;\n    vPosition = position;\n    vColor = color;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}',
      fragmentShader:
        'precision mediump float;\nprecision mediump int;\nvarying vec2 vUvUnifiedEditor;\nvoid main()\t{\n    gl_FragColor = vec4( vUvUnifiedEditor.x, vUvUnifiedEditor.y, 1.0 , 1.0 );\n}',
    });

    const n =
      -1 !== navigator.userAgent.indexOf('Safari') &&
      -1 === navigator.userAgent.indexOf('Chrome');
    this.useTextureFloat =
      this.world.renderer.capabilities.isWebGL2 ||
      (this.world.renderer.extensions.get('OES_texture_float') && !n);
    this.useTextureFloat
      ? (this.uvReadPixelArray = new Float32Array(4))
      : (this.uvReadPixelArray = new Uint8Array(4));
    const v2 = new THREE.Vector2();
    this.world.renderer.getSize(v2);
    this.renderTarget = new THREE.WebGLRenderTarget(v2.width, v2.height, {
      format: THREE.RGBAFormat,
      type: this.useTextureFloat ? THREE.FloatType : THREE.UnsignedByteType,
    });
    this.el = this.world.renderer.domElement;

    this.mouse = {
      x: void 0,
      y: void 0,
      cursorOverCanvas: void 0,
    };
    this.setupEvent();
  }

  updateUv(e) {
    const renderer = this.world.renderer;
    let offsetX, offsetY;
    if (
      [
        'click',
        'mousedown',
        'mouseup',
        'mousemove',
        'mouseover',
        'mouseout',
        'mouseenter',
        'mouseleave',
      ].includes(e.type)
    ) {
      offsetX = e.offsetX || e.layerX;
      offsetY = e.offsetY || e.layerY;
    } else {
      if ('dragover' !== e.type) {
        console.warn('unsupported event', e.type);
        return;
      }
      offsetX = e.offsetX || e.layerX;
      offsetY = e.offsetY || e.layerY;
    }
    if (renderer.readRenderTargetPixels) {
      renderer.readRenderTargetPixels(
        this.renderTarget,
        offsetX,
        this.renderTarget.height - offsetY,
        1,
        1,
        this.uvReadPixelArray
      );
    }
    if (this.useTextureFloat) {
      this.mouse.x = this.uvReadPixelArray[0];
      this.mouse.y = this.uvReadPixelArray[1];
    } else {
      this.mouse.x = this.uvReadPixelArray[0] / 255;
      this.mouse.y = this.uvReadPixelArray[1] / 255;
    }
    this.mouse.cursorOverCanvas = 0 !== this.mouse.x && 1 !== this.mouse.y;
    // console.log(this.mouse);
    // this.updateTexture();
  }
  delegate(e) {
    this.world.svgEditor && this.world.svgEditor.onDelegate(this.world.renderer.domElement, e, this.mouse);
  }
  delegateDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.updateUv(e);
  }
  delegateDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.updateUv(e);
  }

  updateTexture() {
    const editTextureManager = this.world.editTextManager;
    const x = this.mouse.x * editTextureManager.svgEl.width();
    const y = this.mouse.y * editTextureManager.svgEl.height();
    console.log(x, y);
    this.world.editTextManager.edit(x, y);
  }

  setupEvent() {
    let events = ['click', 'mousemove', 'touchstart', 'touchmove', 'touchend'];
    for (let t = 0; t < events.length; t++) {
      this.el.addEventListener(events[t], (e) => {
        return this.updateUv(e);
      });
    }

    events = [
      'mousedown',
      // 'pointerdown',
      // 'pointerup',
      'mousemove',
      'dblclick',
      'mouseup',
      'touchstart',
      // 'mousemove',
      'touchmove',
      'touchend',
    ];
    for (let i = 0; i < events.length; i++) {
      this.el.addEventListener(events[i], (e) => {
        return this.delegate(e);
      });
    }
    this.el.addEventListener('dragover', (t) => {
      return this.delegateDragOver(t);
    });
    this.el.addEventListener('drop', (t) => {
      return this.delegateDrop(t);
    });
  }

  render() {
    if (!this.world.camera) return;
    this.world.scene.overrideMaterial = this.customUvmaterial;
    this.world.renderer.setRenderTarget(this.renderTarget);
    this.world.renderer.render(this.world.scene, this.world.camera);
    this.world.renderer.setRenderTarget(null);
    this.world.scene.overrideMaterial = null;
  }

  resize() {
    const v = new THREE.Vector2();
    this.world.renderer.getSize(v);
    this.renderTarget.setSize(v.x, v.y);
  }
}

export { DecalManager };
