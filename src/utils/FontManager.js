import { FontTypeList } from '../configs/index.js';

class FontManager {
  constructor() {
    this.loadedFonts = new Set(); // 跟踪已加载的字体
    // 常见系统字体列表（可按需扩充）
    this.systemFonts = new Set([
      // 'American Captain',
      // 'Athletic',
      // 'Komikazoom',
      // 'Marguerite',
      // 'DELIRIUM NCV',

      'Arial',
      'Helvetica',
      'Times New Roman',
      'Courier New',
      'Verdana',
      'Georgia',
      'Tahoma',
      'Trebuchet MS',
      'Comic Sans MS',
      'Impact',
      'Palatino Linotype',
      'Lucida Console',
      'Segoe UI',
      'System-ui',
      'sans-serif',
      'serif',
      'monospace',
    ]);
  }

  async getFontBase64(fontName) {
    const font = FontTypeList.find((v) => v.type === fontName);
    if (font) {
      return await fetch(font.base64).then((res) => res.text());
    }
    return '';
  }

  /**
   * 动态加载字体
   * @param {string} fontName - 字体名称（如 'Roboto' 或 'MyCustomFont'）
   * @param {Object} options - 配置项
   * @param {boolean} [options.isGoogleFont=true] - 是否为 Google Fonts
   * @param {string} [options.fontUrl=''] - 自定义字体文件路径
   * @param {string} [options.fontFormat='woff2'] - 自定义字体格式
   * @returns {Promise<void>}
   */
  async loadFont(
    fontName,
    { isGoogleFont = false, fontUrl = '', fontFormat = 'woff2' } = {}
  ) {
    if (!fontName) {
      throw new Error('Font name is required');
    }
    // 🔸 检查是否系统字体
    if (this.systemFonts.has(fontName)) {
      console.log(`Font "${fontName}" is a system font, skip loading.`);
      this.loadedFonts.add(fontName); // 可选，标记为已存在
      return;
    }

    // 如果字体已加载，直接返回
    if (this.loadedFonts.has(fontName)) {
      console.log(`Font ${fontName} is already loaded`);
      return;
    }

    try {
      if (isGoogleFont) {
        // 加载 Google Fonts
        await this._loadGoogleFont(fontName);
      } else {
        // 加载自定义字体
        const font = FontTypeList.find((v) => v.type === fontName);
        if (!fontUrl) {
          if (font) {
            fontUrl = font.url;
          }
        }
        if (!fontUrl && !(font && font.base64)) {
          console.warn('Font URL is required for custom fonts');
          return;
        }
        if (!fontUrl && font.base64) {
          await this.loadCssFont(font.base64, font.type);
        } else if (fontUrl) {
          await this._loadCustomFont(fontName, fontUrl, fontFormat);
        }
      }

      // 标记字体已加载
      this.loadedFonts.add(fontName);
      console.log(`Font ${fontName} loaded successfully`);
    } catch (error) {
      console.error(`Failed to load font ${fontName}:`, error);
      throw error;
    }
  }

  async loadCssFont(cssUrl, fontName) {
    const cssString = await fetch(cssUrl).then((res) => res.text());
    const container = document.createElement('div');
    container.innerHTML = cssString;

    const style = container.querySelector('style');
    if (style) {
      document.head.appendChild(style);
    }

    // ⭐ 等待浏览器解析 style
    await new Promise(requestAnimationFrame);

    // ⭐ 等待指定字体加载完成
    await document.fonts.load(`1em ${fontName}`);
    console.log('Font loaded!');
  }

  /**
   * 加载 Google Fonts
   * @param {string} fontName - 字体名称
   * @returns {Promise<void>}
   */
  _loadGoogleFont(fontName) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
        / /g,
        '+'
      )}&display=swap`;
      link.rel = 'stylesheet';
      link.onload = () => {
        document.fonts.load(`16px ${fontName}`).then(resolve).catch(reject);
      };
      link.onerror = () =>
        reject(new Error(`Failed to load Google Font: ${fontName}`));
      document.head.appendChild(link);
    });
  }

  /**
   * 加载自定义字体
   * @param {string} fontName - 字体名称
   * @param {string} fontUrl - 字体文件路径
   * @param {string} fontFormat - 字体格式
   * @returns {Promise<void>}
   */
  _loadCustomFont(fontName, fontUrl, fontFormat) {
    return new Promise((resolve, reject) => {
      const font = new FontFace(
        fontName,
        `url(${fontUrl}) ${fontFormat ? `format("${fontFormat}")` : ''}`
      );
      font
        .load()
        .then((loadedFont) => {
          document.fonts.add(loadedFont);
          document.fonts.load(`16px ${fontName}`).then(resolve).catch(reject);
        })
        .catch(reject);
    });
  }

  /**
   * 将字体应用到指定文本对象
   * @param {fabric.Text|fabric.IText|fabric.Textbox} textObject - Fabric.js 文本对象
   * @param {string} fontName - 字体名称
   */
  applyFontToText(canvas, textObject, fontName) {
    if (!this.loadedFonts.has(fontName)) {
      console.warn(`Font ${fontName} is not loaded yet`);
      return;
    }
    if (
      !(
        textObject instanceof fabric.Text ||
        textObject instanceof fabric.IText ||
        textObject instanceof fabric.Textbox
      )
    ) {
      console.warn('Invalid text object');
      return;
    }
    textObject.set('fontFamily', fontName);
    canvas.renderAll();
  }

  /**
   * 将字体应用到画布中的所有文本对象
   * @param {string} fontName - 字体名称
   */
  applyFontToAllTexts(canvas, fontName) {
    if (!this.loadedFonts.has(fontName)) {
      console.warn(`Font ${fontName} is not loaded yet`);
      return;
    }
    canvas.getObjects('text').forEach((obj) => {
      obj.set('fontFamily', fontName);
    });
    canvas.getObjects('i-text').forEach((obj) => {
      obj.set('fontFamily', fontName);
    });
    canvas.getObjects('textbox').forEach((obj) => {
      obj.set('fontFamily', fontName);
    });
    canvas.renderAll();
  }

  /**
   * 检查字体是否已加载
   * @param {string} fontName - 字体名称
   * @returns {boolean}
   */
  isFontLoaded(fontName) {
    return this.loadedFonts.has(fontName);
  }

  /**
   * 获取已加载的字体列表
   * @returns {string[]}
   */
  getLoadedFonts() {
    return Array.from(this.loadedFonts);
  }

  /**
   * 清理已加载的字体（仅从跟踪列表中移除，不影响浏览器字体）
   */
  clearLoadedFonts() {
    this.loadedFonts.clear();
  }
}

export default new FontManager();
