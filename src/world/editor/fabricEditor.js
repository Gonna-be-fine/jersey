import * as THREE from 'three';
import FabricCanvas from './FabricCanvas';
import { loadSVGFromString, loadSVGFromURL } from 'fabric';
import * as fabric from 'fabric';
import { initAligningGuidelines } from 'fabric/extensions';
import { SvgFontManager } from './SvgFontManager';
import { clone, throttle } from 'lodash';
import _fontManager from '../../utils/FontManager';
import CustomText from './CustomText';
import { CareLabel, pickTextOptions } from '../../configs';
import { isSVGString } from '../utils/utils';
import PerformanceDetector from './PerformanceDetector';
import { FabricMagnifier } from './FabricMagnifer';
import BrandLogo from '@/assets/logo/M1.svg';

window.fabric = fabric;
const DEFAULTSIZE = 2048;
// const DEFAULTSIZE = PerformanceDetector.getOptimalSize();
class FabricEditor {
  constructor(world, options) {
    this.world = world;
    this.options = options;
    this.initFabricCanvas();
  }

  async toSVG(
    filename = 'canvas.svg',
    scale = 1,
    options = { isDownload: true }
  ) {
    const canvas = this.canvas;
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const svgOptions = {
      width: width * scale,
      height: height * scale,
      viewBox: { x: 0, y: 0, width, height },
      // 下面两行非常关键
      multiplier: scale, // 告诉 Fabric 内部导出时放大
      // preserveObjectStacking: true // 可选，保持层级
    };
    let svgData = canvas.toSVG(svgOptions); // 生成SVG字符串

    const objects = this.canvas.getObjects();
    let texts = objects.filter(
      (obj) => obj.type === 'text' || obj.type === 'customtext'
    );
    texts = texts.concat(
      objects.filter((v) => v.type === 'customtext').map((v) => v.textElement)
    );
    const set = new Set(texts.map((v) => v.fontFamily));
    texts = Array.from(set);

    let styleTag = '';
    for (const text of texts) {
      const base64 = await _fontManager.getFontBase64(text);
      if (base64) {
        styleTag += `
          ${base64} \n
        `;
      }
    }
    styleTag = `
      <style>
        ${styleTag}
      </style>
    `;
    svgData = svgData.replace('</svg>', `${styleTag}</svg>`);

    if (!options.isDownload) {
      return svgData;
    }
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
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

    this.fabricMagnifer = new FabricMagnifier(this.canvas, {});
  }

  rotateElement(element, angle) {
    element.rotate(angle);
    element.setCoords(); // 添加这一行
    this.canvas.renderAll();
  }

  moveElement(element, left, top) {
    element.left = left;
    element.top = top;
    element.setCoords();
    this.canvas.renderAll();
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
    const svgWidth = DEFAULTSIZE || 2048;
    const svgHeight = DEFAULTSIZE || 2048;
    this.canvas.setDimensions({
      width: svgWidth,
      height: svgHeight,
    });
    textureSvg.objects = textureSvg.objects.filter(
      (obj) =>
        !(
          obj.type === 'Text' &&
          (obj.text.includes('MACHINE') ||
            obj.text.includes('MADE IN AUSTRALIA') ||
            obj.text.includes('100% POLYESTER'))
        )
    );
    // 加载font
    for (const obj of textureSvg.objects) {
      if (obj.type === 'Text') {
        await _fontManager.loadFont(obj.fontFamily);
      }
      if (obj.type === 'CustomText') {
        const text = obj.objects.find((v) => v.type === 'Text');
        await _fontManager.loadFont(text.fontFamily);
      }
    }
    await this.canvas.loadFromJSON(textureSvg);
    const scaleX = svgWidth / textureSvg.canvasWidth;
    const scaleY = svgHeight / textureSvg.canvasHeight;

    this.canvas.getObjects().forEach((obj) => {
      obj.scaleX *= scaleX;
      obj.scaleY *= scaleY;
      obj.left *= scaleX;
      obj.top *= scaleY;
      obj.setCoords();
      // obj.selectable = false;
    });

    // MARK: 默认添加
    this.fixDefaultDesign();

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
      const svgWidth = options.width || 2048;
      const svgHeight = options.height || 2048;
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
    const len = this.getMaxTextId() + 1;
    const newText = new CustomText(
      text.replaceAll('\n', '') || 'NAME',
      Object.assign({}, options, {
        id: options.id || 'text-' + len,
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
    window.text = newText;
    this.canvas.requestRenderAll();
    return newText;
  }

  _addText(options) {
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
    const len = this.getMaxTextId() + 1;
    const newText = new fabric.FabricText(
      text || 'NAME',
      Object.assign({}, options, {
        id: options.id || 'text-' + len,
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

  getMaxTextId() {
    const ids = this.canvas
      .getObjects('text')
      .map((obj) => obj.id.split('-')[1] || 0);
    const ids2 = this.canvas
      .getObjects('customtext')
      .map((obj) => obj.id.split('-')[1] || 0);
    return Math.max(...ids, ...ids2);
  }

  setNewText(id, options) {
    const text = this.canvas.getObjectById(id);
    if (!text) {
      console.warn('找不到对象', id);
      return;
    }
    if (options.isCurved !== undefined) {
      // 相同的情况return
      if (
        (options.isCurved && text.textElement) ||
        (!options.isCurved && !text.textElement)
      ) {
        return;
      }
      this.removeObjectById(id);
      let textOptions = {};
      if (options.isCurved) {
        textOptions = pickTextOptions(text);
        textOptions.left = text.left;
        textOptions.top = text.top;
        textOptions.id = id;
        textOptions.curveValue = options.textOptions.curveValue || 50;
        return this.addText(textOptions);
      } else {
        textOptions = pickTextOptions(text.textElement);
        textOptions.left = text.left;
        textOptions.top = text.top;
        textOptions.id = id;
        return this._addText(textOptions);
      }
    }
  }

  updateText(id, options) {
    const text = this.canvas.getObjectById(id);
    if (!text) {
      console.warn('找不到对象', id);
      return;
    }

    if (text.textElement) {
      text.updateProperties(options);
    } else {
      text.set(options);
      this.canvas.renderAll();
    }
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

  async loadImage(input) {
    let img = null;
    // 1. Check if the base64 string is an SVG data URI
    if (isSVGString(input)) {
      // Use fabric.loadSVGFromString for vector data
      const data = await fabric.loadSVGFromString(input);

      // Fabric 6 推荐创建 SVG 对象（新方式）
      const svg = fabric.util.groupSVGElements(data.objects, data.options);

      img = svg;
    } else if (input.slice(-4) === '.svg') {
      const text = await fetch(input).then((res) => res.text());
      // Use fabric.loadSVGFromString for vector data
      const data = await fabric.loadSVGFromString(text);
      // Fabric 6 推荐创建 SVG 对象（新方式）
      const svg = fabric.util.groupSVGElements(data.objects, data.options);
      img = svg;
    } else {
      // Use fabric.FabricImage for image data
      img = await fabric.FabricImage.fromURL(input, {
        crossOrigin: 'anonymous',
      });
    }
    return img;
  }

  async addLogo(base64, options = {}) {
    const canvas = this.canvas;
    const id = this.canvas.getObjects('image').length + 1;

    let img = await this.loadImage(base64);
    img.id = `image-${id}`;

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
            img.id = `image-${id}`;
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

  async copyElement(objectId) {
    const activeObject = this.canvas.getObjectById(objectId);
    if (!activeObject) {
      console.warn('找不到对象', objectId);
      return;
    }
    let id = objectId + '-copy';
    if (activeObject.type === 'text' || activeObject.type === 'customtext') {
      id = 'text-' + (this.getMaxTextId() + 1);
    } else {
      id =
        `${activeObject.type}-` +
        (this.canvas.getObjects(activeObject.type).length + 1);
    }
    const cloned = await activeObject.clone();
    cloned.set({
      id,
      left: activeObject.left + 20,
      top: activeObject.top + 20,
      evented: true,
    });

    this.canvas.add(cloned);
    this.canvas.setActiveObject(cloned);
    this.canvas.requestRenderAll();
    return cloned;
  }

  fixDefaultDesign() {
    // 替换品牌logo
    const logo = this.canvas.getObjectById('FE_LOGO');
    if (logo) {
      const { originX, originY } = logo;
      const { width, height, left, top } = logo.getBoundingRect();
      this.addLogo(BrandLogo, {
        id: 'logoFront-0',
        left,
        top,
        scaleX: 0.165,
        scaleY: 0.165,
        originX,
        originY,
        selectable: false,
      });
      this.addLogo(BrandLogo, {
        id: 'logoBack-1',
        left: left + width,
        top: top + height,
        scaleX: 0.165,
        scaleY: 0.165,
        originX: 'right',
        originY: 'bottom',
        selectable: false,
      });
      this.canvas.remove(logo);
    }
    // 添加洗水唛
    fabric.util.enlivenObjects([CareLabel]).then((objects) => {
      const textObj = objects[0];
      textObj.selectable = false;
      this.canvas.add(textObj);
      this.canvas.setActiveObject(textObj);
    });
  }

  /**
   * 替换 Fabric.Image 的内容（不创建新对象）
   * 支持：
   *  - 普通图片 URL
   *  - SVG URL
   *  - SVG 字符串
   *
   * @param {fabric.Image} imgObj   需要被替换的 Image 对象
   * @param {string} source         url 或 svg 字符串
   */
  async replaceFabricImage(imgObj, source) {
    if (!imgObj || !source) return;
    const canvas = this.canvas;
    // 记录原对象状态
    const { id, left, top, angle, scaleX, scaleY, originX, originY } = imgObj;

    // 旧对象「可视尺寸」
    const oldMaxSide = Math.max(
      imgObj.getScaledWidth(),
      imgObj.getScaledHeight()
    );

    const newImg = await this.loadImage(source);
    // 3️⃣ 计算比例（关键）
    const newMaxSide = Math.max(newImg.width, newImg.height);
    const scale = oldMaxSide / newMaxSide;
    newImg.set({
      id,
      left,
      top,
      angle,
      scaleX: scale,
      scaleY: scale,
      originX,
      originY,
    });

    newImg.setCoords();

    // 4️⃣ 删除旧对象，添加新对象
    canvas.remove(imgObj);
    canvas.add(newImg);
    canvas.setActiveObject(newImg);

    canvas.requestRenderAll();
  }

  destroy() {
    this.fabricMagnifer.destroy();
    this.canvas.dispose();
    this.canvas = null;
  }
}

export default FabricEditor;
