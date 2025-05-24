class SvgFontManager {
  constructor() {
    this.fonts = new Map(); // Map<fontFamily, FontFace>
  }

  /**
   * 使用 CSSOM 安全提取并注册字体
   */
  async extractFontsFromSvg(svgText) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const styleNodes = svgDoc.querySelectorAll('style');

    for (const styleNode of styleNodes) {
      const cssText = styleNode.textContent;

      // 创建临时 style 元素用于解析 CSS
      const tempStyle = document.createElement('style');
      tempStyle.textContent = cssText;
      document.head.appendChild(tempStyle);

      // 获取对应的 styleSheet 对象
      const sheet = [...document.styleSheets].find(s => s.ownerNode === tempStyle);
      if (!sheet) {
        tempStyle.remove();
        continue;
      }

      for (const rule of sheet.cssRules) {
        if (rule.type === CSSRule.FONT_FACE_RULE) {
          const family = rule.style.getPropertyValue('font-family').replace(/['"]/g, '').trim();
          const src = rule.style.getPropertyValue('src');

          // const dataUrlMatch = src.match(/url\(['"]?(data:font\/\w+;base64,[^)]+)['"]?\)/);
          // if (!dataUrlMatch) continue;

          // const dataUrl = dataUrlMatch[1];
          // if (this.fonts.has(family)) continue;

          try {
            const font = new FontFace(family, src);
            await font.load();
            document.fonts.add(font);
            this.fonts.set(family, font);
          } catch (err) {
            console.warn(`字体加载失败: ${family}`, err);
          }
        }
      }

      // 清理
      tempStyle.remove();
    }
  }

  getCleanedSvg(svgText) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const styleNodes = svgDoc.querySelectorAll('style');

    styleNodes.forEach(node => node.parentNode.removeChild(node));

    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgDoc);
  }

  unregisterFont(family) {
    const font = this.fonts.get(family);
    if (font) {
      document.fonts.delete(font);
      this.fonts.delete(family);
    }
  }

  unregisterAll() {
    for (const [, font] of this.fonts) {
      document.fonts.delete(font);
    }
    this.fonts.clear();
  }

  listFonts() {
    return Array.from(this.fonts.keys());
  }
}

export { SvgFontManager }