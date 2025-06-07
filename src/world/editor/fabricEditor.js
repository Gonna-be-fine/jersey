import * as THREE from 'three';
import FabricCanvas from './FabricCanvas';
import { loadSVGFromString, loadSVGFromURL } from 'fabric';
import * as fabric from 'fabric';
import { SvgFontManager } from './SvgFontManager';
import { throttle } from 'lodash';
window.fabric = fabric;
const DEFAULTSIZE = 512;
let Count = 0;
class FabricEditor {
  constructor(world, options) {
    this.world = world;
    this.options = options;
    this.initFabricCanvas();
    // this.canvas.on('object:moving', (e) => {
    //   console.log(e.pointer);
    // });
  }

  getJson() {
    return this.canvas.toJSON();
  }

  clearSelection() {
    if (!this.canvas.getActiveObject()) return;
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }

  async initFabricCanvas() {
    this.containerId = this.options.type + 'Ctn';
    this.canvas = new FabricCanvas(this.containerId, {}, this.world);

    this.canvas.selection = false; // 禁用框选
    this.canvas.skipTargetFind = false; // 保证还能选中单个对象

    this.loadSvg();
    this.texture = new THREE.Texture(this.canvas.getElement());
    this.texture.flipY = false;
    this.canvas.on(
      'after:render',
      throttle(() => {
        this.texture.needsUpdate = true;
      }, 200)
    );
  }

  async loadSvg() {
    const { url } = this.options;
    let svgString = await fetch(url).then((res) => res.text());

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
      console.log(data);
      // 缩放并添加到画布
      objects.forEach((obj) => {
        obj.scaleX *= scale;
        obj.scaleY *= scale;
        obj.left *= scale;
        obj.top *= scale;
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
    } = options;
    const text = new fabric.FabricText('你好 Fabric！', {
      id: 'text-' + Count++,
      left: left || 100,
      top: top || 100,
      fontFamily: fontFamily || 'Komikazoom',
      fontSize: fontSize || 40,
      fill: fill || '#ffffff',
      originX: originX || 'center',
      originY: originY || 'center',
      charSpacing: charSpacing || 100,
    });
    this.canvas.add(text);
    this.canvas.requestRenderAll();
  }

  updateText(id, options) {
    const text = this.canvas.getObjectById(id);
    if (!text) {
      console.warn('找不到对象', id);
      return;
    }
    for (const key in options) {
      text.set(key, options[key]);
    }
    this.canvas.renderAll();
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
            const img = await fabric.FabricImage.fromURL(base64, {
              crossOrigin: 'anonymous',
            });

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
