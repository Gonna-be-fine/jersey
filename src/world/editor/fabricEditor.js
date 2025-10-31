import * as THREE from 'three';
import FabricCanvas from './FabricCanvas';
import { loadSVGFromString, loadSVGFromURL } from 'fabric';
import * as fabric from 'fabric';
import { initAligningGuidelines } from 'fabric/extensions'
import { SvgFontManager } from './SvgFontManager';
import { throttle } from 'lodash';
window.fabric = fabric;
const DEFAULTSIZE = 1024;
class FabricEditor {
  constructor(world, options) {
    this.world = world;
    this.options = options;
    this.initFabricCanvas();
  }

  getJson() {
    const saveJson = this.canvas.toObject(['id', 'selectable']);
    // 保存canvas尺寸
    saveJson.canvasWidth = this.canvas.getWidth();
    saveJson.canvasHeight = this.canvas.getHeight();
    // top-left
    saveJson.objects.forEach((obj) => {
      if (isNaN(obj.left)) {
        obj.left = 0;
      }
      if (isNaN(obj.top)) {
        obj.top = 0;
      }
    });
    return saveJson;
  }

  clearSelection() {
    if (!this.canvas.getActiveObject()) return;
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }

  async initFabricCanvas() {
    this.containerId = this.options.type + 'Ctn';
    this.canvas = new FabricCanvas(this.containerId, {}, this.world);

    // 初始化对齐线
    const config = {
      /** At what distance from the shape does alignment begin? */
      // margin: 4,
      /** Aligning line dimensions */
      width: 1,
      /** Aligning line color */
      color: 'rgb(255,255,255,0.9)',
    };
    this.deactivate = initAligningGuidelines(this.canvas, config);

    this.canvas.selection = false; // 禁用框选
    this.canvas.skipTargetFind = false; // 保证还能选中单个对象
    if (typeof this.options.textureSvg === 'string') {
      this.loadSvg();
    } else {
      this.loadJson();
    }
    this.texture = new THREE.Texture(this.canvas.getElement());
    this.texture.flipY = false;
    this.canvas.on(
      'after:render',
      throttle(() => {
        this.texture.needsUpdate = true;
      }, 200)
    );
  }

  cleanJson(json) {
    json.objects = json.objects.filter((obj) => {
      if (obj.type !== 'Image') return true;
      // 过滤掉无 src、无尺寸的空图层
      return obj.src && obj.src.length > 0 && obj.width > 0 && obj.height > 0;
    });
    return json;
  }

  async loadJson() {
    const { textureSvg } = this.options;
    // const json = this.cleanJson(url);
    // console.log('-------', json);
    const svgWidth = DEFAULTSIZE || 1024;
    const svgHeight = DEFAULTSIZE || 1024;
    this.canvas.setDimensions({
      width: svgWidth,
      height: svgHeight,
    });
    await this.canvas.loadFromJSON(textureSvg);
    // this.canvas.renderAll();
    const scaleX = svgWidth / textureSvg.canvasWidth;
    const scaleY = svgHeight / textureSvg.canvasHeight;

    this.canvas.getObjects().forEach((obj) => {
      // console.log(obj.id);
      obj.scaleX *= scaleX;
      obj.scaleY *= scaleY;
      obj.left *= scaleX;
      obj.top *= scaleY;
      obj.setCoords();
      obj.selectable = false;
    });
    this.canvas.renderAll();
  }

  async loadSvg() {
    const { textureSvg } = this.options;
    let svgString = await fetch(textureSvg).then((res) => res.text());

    const fontManager = new SvgFontManager();
    this.fontManager = fontManager;
    await fontManager.extractFontsFromSvg(svgString);
    const cleanedSvg = fontManager.getCleanedSvg(svgString);

    loadSVGFromString(cleanedSvg).then((data) => {
      const { objects, options } = data;
      const svgWidth = options.width || 1024;
      const svgHeight = options.height || 1024;
      const scaleSize = DEFAULTSIZE / Math.max(svgWidth, svgHeight);
      this.canvas.setDimensions({
        width: scaleSize * svgWidth,
        height: scaleSize * svgHeight,
      });
      const canvas = this.canvas;
      // 计算缩放比例（保持宽高比）
      const scale = Math.min(
        canvas.width / svgWidth,
        canvas.height / svgHeight
      );
      // console.log(data);
      // 缩放并添加到画布
      objects.forEach((obj) => {
        obj.scaleX *= scale;
        obj.scaleY *= scale;
        obj.left = (obj.left ?? 0) * scale;
        obj.top = (obj.top ?? 0) * scale;
        obj.selectable = false;
        canvas.add(obj);
      });

      // objects.forEach(obj => {
      //   canvas.add(obj);
      // });
      canvas.requestRenderAll();
      requestAnimationFrame(() => {
        this.texture.needsUpdate = true;
      });
    });
  }

  setColor(id, color) {
    const el = this.canvas.getObjectById(id);
    if (!el) {
      console.warn('找不到对象', id);
      return;
    }
    el.set('fill', color);
    this.canvas.renderAll();
  }

  addText(options) {
    const {
      left,
      top,
      fontFamily,
      fontSize,
      fill,
      originX,
      originY,
      charSpacing,
      text,
    } = options;
    const len = this.canvas.getObjects('text').length + 1;
    const newText = new fabric.FabricText(
      text || 'NAME',
      Object.assign({}, options, {
        id: 'text-' + len,
        left: left || 360,
        top: top || 700,
        fontFamily: fontFamily || 'Komikazoom',
        fontSize: fontSize || 40,
        fill: fill || '#ffffff',
        originX: originX || 'center',
        originY: originY || 'center',
        charSpacing: charSpacing || 100,
      })
    );
    this.canvas.add(newText);
    this.canvas.requestRenderAll();
    return newText;
  }

  updateText(id, options) {
    const text = this.canvas.getObjectById(id);
    if (!text) {
      console.warn('找不到对象', id);
      return;
    }
    for (const key in options) {
      if (key == 'id') continue;
      text.set(key, options[key]);
    }
    this.canvas.renderAll();
  }

  removeObjectById(id) {
    const obj = this.canvas.getObjectById(id);
    this.canvas.remove(obj);
  }

  selectObjectById(id) {
    const obj = this.canvas.getObjectById(id);
    if (!obj) {
      console.warn('找不到对象', id);
      return;
    }
    this.canvas.setActiveObject(obj);
    this.canvas.requestRenderAll();
    return obj;
  }

  async addLogo(base64, options = {}) {
    const canvas = this.canvas;
    const id = this.canvas.getObjects('image').length + 1;
    const img = await fabric.FabricImage.fromURL(base64, {
      crossOrigin: 'anonymous',
    });
    img.id = `img-${id}`;

    // 自动缩放适配画布
    const canvasWidth = canvas.getWidth() / 8;
    const canvasHeight = canvas.getHeight() / 8;
    const imgWidth = img.width;
    const imgHeight = img.height;

    const scale = Math.min(
      canvasWidth / imgWidth,
      canvasHeight / imgHeight,
      1 // 不放大
    );

    img.set({
      scaleX: scale,
      scaleY: scale,
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: 'center',
      originY: 'center',
      ...options,
    });

    canvas.add(img);
    canvas.setActiveObject(img);
    return img;
  }

  addImage(options = {}) {
    const canvas = this.canvas;
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async (e) => {
          const base64 = e.target.result;

          try {
            const id = canvas.getObjects('image').length + 1;
            const img = await fabric.FabricImage.fromURL(base64, {
              crossOrigin: 'anonymous',
            });
            img.id = `img-${id}`;
            // 自动缩放适配画布
            const canvasWidth = canvas.getWidth() / 8;
            const canvasHeight = canvas.getHeight() / 8;
            const imgWidth = img.width;
            const imgHeight = img.height;

            const scale = Math.min(
              canvasWidth / imgWidth,
              canvasHeight / imgHeight,
              1 // 不放大
            );

            img.set({
              scaleX: scale,
              scaleY: scale,
              left: canvasWidth / 2,
              top: canvasHeight / 2,
              originX: 'center',
              originY: 'center',
              ...options,
            });

            canvas.add(img);
            canvas.setActiveObject(img);
            resolve(img);
          } catch (err) {
            reject(err);
          }
        };

        reader.onerror = () => reject(new Error('图片读取失败'));
        reader.readAsDataURL(file);
      };

      input.click();
    });
  }
}

export default FabricEditor;
