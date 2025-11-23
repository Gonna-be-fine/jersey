// CustomText.js
import {
  Group,
  FabricText,
  classRegistry,
  Rect,
  Path,
  StaticCanvas,
} from 'fabric';

export default class CustomText extends Group {
  static type = 'CustomText';
  /**
   * ---- 允许导出的属性列表 ----
   */
  static TEXT_PROPS = [
    'fill',
    'fontSize',
    'fontFamily',
    'fontWeight',
    'charSpacing',
    'textAlign',
    'lineHeight',
    'fontStyle',
    'underline',
    'stroke',
    'strokeWidth',
  ];

  constructor(text, options = {}, curveValue = 50) {
    const customTextId = options.id || `custom_text_${Date.now()}`;
    // 拆分 textElement 的属性
    const textOptions = CustomText.pickTextProps(options);

    const defaultOptions = {
      left: options.left || 100,
      top: options.top || 100,
      originX: 'center',
      originY: 'center',
      selectable: true,
      evented: true,
      _isCustomText: true,
      type: 'custom-text',
      id: customTextId,
      ...textOptions,
    };

    const textElement = new FabricText(text, {
      originX: 'center',
      originY: 'center',
      linkedId: customTextId,
      ...textOptions,
    });

    const hitbox = new Rect({
      left: textElement.left,
      top: textElement.top,
      fill: 'rgba(0, 0, 255, 0.3)',
      stroke: 'blue',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center',
      opacity: 0,
      linkedId: customTextId,
    });

    super([textElement, hitbox], defaultOptions);

    this.textElement = textElement;
    this.hitbox = hitbox;
    this.curveValue = curveValue;

    // 监听选中事件 - 显示 path
    this.on('selected', () => {
      this._showPath();
      this.updateProperties({ curveValue: this.curveValue });
    });

    // 监听取消选中事件 - 隐藏 path
    this.on('deselected', () => {
      this._hidePath();
      this.updateProperties({ curveValue: this.curveValue });
    });
  }

  init() {

  }

  _showPath() {
    if (this.textElement.path) {
      this.textElement.path.set({
        opacity: 1,
        visible: true,
        left: this.textElement.path.left,
        top: this.textElement.path.top,
      });
      if (this.canvas) {
        this.canvas.renderAll();
      }
    }
  }

  _hidePath() {
    if (this.textElement.path) {
      this.textElement.path.set({
        opacity: 0,
        visible: false,
        left: this.textElement.left,
        top: this.textElement.top,
      });
      if (this.canvas) {
        this.canvas.renderAll();
      }
    }
  }

  /**
   * ---- 从 options 中提取 textElement 的属性 ----
   */
  static pickTextProps(options) {
    const result = {};
    CustomText.TEXT_PROPS.forEach((key) => {
      if (options[key] !== undefined) {
        result[key] = options[key];
      }
    });
    return result;
  }

  /**
   * 导出对象表示,包含 curveValue
   */
  toObject(propertiesToInclude = []) {
    return {
      ...super.toObject([
        ...CustomText.TEXT_PROPS,
        'id',
        ...propertiesToInclude,
      ]),
      curveValue: this.curveValue,
      id: this.id,
      text: this.textElement.text,
    };
  }

  static async fromObject(object, { canvas }) {
    const { text, ...rest } = object;
    const textOptions = object.objects.find((v) => v.type === 'Text');
    const obj = {
      ...rest,
      ...CustomText.pickTextProps(textOptions)
    };
    const instance = new CustomText(text, obj);
    const curveValue = object.curveValue || 50;
    const charSpacing = textOptions.charSpacing || 0;


    if (canvas) instance.canvas = canvas;

    // 恢复弧形文本
    if (canvas) {
      instance.applyCurvedText(curveValue, charSpacing);
    } else {
      // 若无 canvas，延迟到 added 事件执行
      instance.on('added', () => {
        setTimeout(() => {
          instance.applyCurvedText(curveValue, charSpacing);
        }, 200)
      });
    }

    return instance;
  }

  toSVG() {
    let svg = super.toSVG();
    // 修复任何属性之间缺少空格的问题
    svg = svg.replace(/"([a-z-]+)=/g, '" $1=');
    return svg;
  }

  /**
   * 批量更新文本元素的属性(性能优化版本)
   * @param {object} options - 属性对象
   */
  updateProperties(options) {
    if (typeof options !== 'object' || !options) {
      return this;
    }

    // 批量设置所有属性
    this.textElement.set(options);

    // 检查是否有影响布局的属性
    const layoutAffectingProps = [
      'fontSize',
      'fontFamily',
      'fontWeight',
      'fontStyle',
      'text',
      'charSpacing',
      'lineHeight',
      'textAlign',
    ];

    let needsUpdate =
      Object.keys(options).some((k) => layoutAffectingProps.includes(k)) ||
      options.curveValue !== undefined;

    if (options.curveValue) {
      this.curveValue = options.curveValue;
    }
    // needsUpdate = false;
    // 只执行一次更新
    if (needsUpdate && this.canvas) {
      this.applyCurvedText(
        this.curveValue,
        this.textElement.charSpacing,
        this.canvas
      );
    } else {
      this.triggerLayout();
      this.setCoords();
      this.dirty = true;
      if (this.canvas) {
        this.canvas.renderAll();
      }
    }

    return this;
  }

  /**
   * 更新文本元素的属性
   */
  updateTextProperty(key, value) {
    this.textElement.set(key, value);

    const layoutAffectingProps = [
      'fontSize',
      'fontFamily',
      'fontWeight',
      'fontStyle',
      'text',
      'charSpacing',
      'lineHeight',
      'textAlign',
    ];

    if (key === 'curveValue') {
      this.curveValue = value;
    }

    let needsUpdate = false;
    if (typeof key === 'object') {
      needsUpdate = Object.keys(key).some((k) =>
        layoutAffectingProps.includes(k)
      );
    } else {
      needsUpdate = layoutAffectingProps.includes(key);
    }

    if ((needsUpdate && this.canvas) || key === 'curveValue') {
      this.applyCurvedText(
        this.curveValue,
        this.textElement.charSpacing,
        this.canvas
      );
    } else {
      this.triggerLayout();
      this.setCoords();
      this.dirty = true;
      if (this.canvas) {
        this.canvas.requestRenderAll();
      }
    }

    return this;
  }

  /**
   * 获取文本元素的属性
   */
  getTextProperty(key) {
    return this.textElement.get(key);
  }

  applyCurvedText(curveValue, charSpacingValue, canvas) {
    if (!canvas) canvas = this.canvas;
    this.curveValue = curveValue;
    const activeText = this.textElement;
    const hitbox = this.hitbox;

    activeText.set({ charSpacing: charSpacingValue });

    const textWidth = activeText.calcTextWidth();
    const curveIntensity = Math.abs(curveValue - 50);
    const sweepFlag = curveValue < 50 ? 0 : 1;

    let pathD = '';
    let startX, endX, startY, endY, radius, theta;

    if (curveIntensity === 0) {
      startX = -textWidth / 2;
      endX = textWidth / 2;
      startY = activeText.top;
      endY = activeText.top;
      theta = 0;
      pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
      theta = Math.PI * (curveIntensity / 50);
      radius = textWidth / theta;
      startX = Math.floor(-radius * Math.sin(theta / 2) * 10) / 10;
      endX = Math.ceil(radius * Math.sin(theta / 2) * 10) / 10;
      startY = activeText.top;
      endY = activeText.top;
      pathD = `M ${startX} ${startY} A ${radius} ${radius} 0 0 ${sweepFlag} ${endX} ${endY}`;
    }

    const isSelected = this.canvas && this.canvas.getActiveObject() === this;
    const newPath = new Path(pathD, {
      fill: '',
      stroke: 'red',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      opacity: isSelected ? 1 : 0,
      visible: isSelected,
    });

    activeText.set({
      path: newPath,
      pathSide: 'center',
      pathAlign: 'center',
      pathStartOffset: 0,
      charSpacing: charSpacingValue,
    });

    const bounds = this.getObjectPixelBounds(activeText, canvas);
    hitbox.set({
      width: bounds.width,
      height: bounds.height,
      opacity: 0,
    });

    hitbox.setCoords();
    this.triggerLayout();
    this.setCoords();
    this.dirty = true;
    canvas.requestRenderAll();
  }

  getObjectPixelBounds(object, canvas) {
    const offCanvas = document.createElement('canvas');
    const scaleFactorX = object.calcTransformMatrix()[0];
    const scaleFactorY = object.calcTransformMatrix()[3];
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;
    const offCtx = offCanvas.getContext('2d');

    const tempCanvas = new StaticCanvas(offCanvas);
    tempCanvas.add(object);
    tempCanvas.renderAll();

    const imageData = offCtx.getImageData(
      0,
      0,
      offCanvas.width,
      offCanvas.height
    );
    const data = imageData.data;

    let minX = offCanvas.width,
      minY = offCanvas.height,
      maxX = 0,
      maxY = 0;
    let found = false;

    for (let y = 0; y < offCanvas.height; y++) {
      for (let x = 0; x < offCanvas.width; x++) {
        const index = (y * offCanvas.width + x) * 4;
        const alpha = data[index + 3];

        if (alpha > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          found = true;
        }
      }
    }

    tempCanvas.dispose();
    offCanvas.width = 0;
    offCanvas.height = 0;

    const minX_A = Math.floor(minX * 10) / 10;
    const maxX_A = Math.ceil(maxX * 10) / 10;
    const minY_A = Math.floor(minY * 10) / 10;
    const maxY_A = Math.ceil(maxY * 10) / 10;

    const centerX = (minX_A + maxX_A) / 2;
    const centerY = (minY_A + maxY_A) / 2;

    const minX_B = centerX - (centerX - minX_A) / scaleFactorX;
    const maxX_B = centerX + (maxX_A - centerX) / scaleFactorX;
    const minY_B = centerY - (centerY - minY_A) / scaleFactorY;
    const maxY_B = centerY + (maxY_A - centerY) / scaleFactorY;

    if (!found) return { x: 0, y: 0, width: 0, height: 0 };

    return {
      x: minX_B,
      y: minY_B,
      width: maxX_B - minX_B,
      height: maxY_B - minY_B,
    };
  }
}

classRegistry.setClass(CustomText);
