class FontManager {
  constructor() {
    this.loadedFonts = new Set(); // 跟踪已加载的字体
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
  async loadFont(fontName, { isGoogleFont = false, fontUrl = '', fontFormat = 'woff2' } = {}) {
    if (!fontName) {
      throw new Error('Font name is required');
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
        if (!fontUrl) {
          throw new Error('Font URL is required for custom fonts');
        }
        await this._loadCustomFont(fontName, fontUrl, fontFormat);
      }

      // 标记字体已加载
      this.loadedFonts.add(fontName);
      console.log(`Font ${fontName} loaded successfully`);
    } catch (error) {
      console.error(`Failed to load font ${fontName}:`, error);
      throw error;
    }
  }

  /**
   * 加载 Google Fonts
   * @param {string} fontName - 字体名称
   * @returns {Promise<void>}
   */
  _loadGoogleFont(fontName) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`;
      link.rel = 'stylesheet';
      link.onload = () => {
        document.fonts.load(`16px ${fontName}`).then(resolve).catch(reject);
      };
      link.onerror = () => reject(new Error(`Failed to load Google Font: ${fontName}`));
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
      const font = new FontFace(fontName, `url(${fontUrl}) ${fontFormat ? `format("${fontFormat}")` : ''}`);
      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        document.fonts.load(`16px ${fontName}`).then(resolve).catch(reject);
      }).catch(reject);
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
    if (!(textObject instanceof fabric.Text || textObject instanceof fabric.IText || textObject instanceof fabric.Textbox)) {
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
  applyFontToAllTexts (canvas, fontName) {
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