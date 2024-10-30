const CodexTypes = ['Collar', 'Cuff', 'Base', 'Gradient_1_'];
const CodexColor = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#F1C40F',
  '#8E44AD',
  '#E67E22',
  '#2ECC71',
  '#3498DB',
];
export const fontOptions = [
  {
    fontType: 'NotoSans',
    fontFile: '/fonts/NotoSansSC.ttf'
  },
  {
    fontType: 'ShipporiAntique',
    fontFile: '/fonts/ShipporiAntique.ttf'
  },
  {
    fontType: 'Anton',
    fontFile: '/fonts/Anton.ttf'
  },
  {
    fontType: 'LongCang',
    fontFile: '/fonts/LongCang.ttf'
  }
];
const StrikerColor = ["#4A90E2", "#50E3C2", "#F39C12", "#8E44AD", "#E74C3C", "#16A085", "#D35400", "#2ECC71", "#C0392B", "#3498DB", "#F1C40F", "#1ABC9C"]

class StyleManager {
  getColor_Codex(mainSvgEle) {
    const collarEl = mainSvgEle.querySelector('[id*="Collar"]');
    const cuffEl = mainSvgEle.querySelector('[id*="Cuff"]');
    const baseEl = mainSvgEle.querySelector('[id*="Base"]');
    const topEl = mainSvgEle.querySelector('[id*="Gradient_1_"]');
    return {
      styles: [
        {
          color: collarEl.style.fill,
          name: 'collar',
          type: 'Collar',
        },
        {
          color: cuffEl.style.fill,
          name: 'Cuffs & Hem',
          type: 'Cuff',
        },
        {
          color: baseEl.style.fill,
          name: 'BaseColor',
          type: 'Base',
        },
        {
          color: topEl.children[1].style.stopColor,
          name: 'topColor',
          type: 'Gradient_1_',
        },
      ],
      color: CodexColor,
    };
  }

  setCodexColor(mainSvgEle, type, color) {
    const elList = mainSvgEle.querySelectorAll(`[id*=${type}]`);
    if (type === 'Cuff') {
      const hemList = mainSvgEle.querySelectorAll('[id*=Hem]');
      hemList.forEach((v) => {
        v.style.fill = color;
      });
    }
    if (type === 'Base') {
      const armsList = mainSvgEle.querySelectorAll('[id*=Arms_]');
      armsList.forEach((v) => {
        v.style.fill = color;
      });
    }
    elList.forEach((element) => {
      if (type === 'Gradient_1_') {
        element.children[1].style.stopColor = color;
        return;
      }
      element.style.fill = color;
    });
  }

  getColor_Striker(mainSvgEle) {
    const collarEl = mainSvgEle.querySelector('[id*="Collar"]');
    const cuffEl = mainSvgEle.querySelector('[id*="Cuff"]');
    const baseEl = mainSvgEle.querySelector('[id*="Base"]');
    const topEl = mainSvgEle.querySelector('[id*="Front"]');
    return {
      styles: [
        {
          color: collarEl.style.fill,
          name: 'collar',
          type: 'Collar',
        },
        {
          color: cuffEl.style.fill,
          name: 'Cuffs & Hem',
          type: 'Cuff',
        },
        {
          color: baseEl.style.fill,
          name: 'BaseColor',
          type: 'Base',
        },
        {
          color: topEl.style.fill,
          name: 'Dot Pattern',
          type: 'Dot',
        },
      ],
      color: StrikerColor,
    };
  }

  setStrikerColor(mainSvgEle, type, color) {
    const elList = mainSvgEle.querySelectorAll(`[id*=${type}]`);
    if (type === 'Cuff') {
      const hemList = mainSvgEle.querySelectorAll('[id*=Hem]');
      hemList.forEach((v) => {
        v.style.fill = color;
      });
    }
    if (type === 'Base') {
      const armsList = mainSvgEle.querySelectorAll('[id*=Arms]');
      armsList.forEach((v) => {
        v.style.fill = color;
      });
    }
    if (type === 'Dot') {
      const dotsList = mainSvgEle.querySelectorAll('[id*=Tone]');
      dotsList.forEach((v) => {
        v.style.fill = color;
      });
      const dotsList1 = mainSvgEle.querySelectorAll('[id*=Spot]');
      dotsList1.forEach((v) => {
        v.style.fill = color;
      });
      return;
    }
    elList?.forEach((element) => {
      element.style.fill = color;
    });
  }

  getColorByType(type, el) {
    switch(type) {
      case 'Codex':
        return this.getColor_Codex(el);
      case 'Striker':
        return this.getColor_Striker(el);
      default:
        break;  
    }
  }

  setColorByType(style, el, type, color) {
    switch(style) {
      case 'Codex':
        return this.setCodexColor(el, type, color);
      case 'Striker':
        return this.setStrikerColor(el, type, color);
      default:
        break;  
    }
  }

  getFontList(svgEl) {
    const list = svgEl.querySelectorAll('image[id*=svg]');
    return Array.from(list).map((v) => {
      return {
        id: v.id,
        url: v.getAttribute('xlink:href'),
      };
    });
  }

  getTextList(svgEl) {
    const texts = svgEl.querySelectorAll('text');
    return Array.from(texts).map(text => {
      const textPath = svgEl.querySelector('#' + text.id + 'text');
      const fontType = text.getAttribute('fontType')
      const pathInside = textPath.querySelector('[textType=inside]')
      const pathMiddle = textPath.querySelector('[textType=middle]')
      const pathOutside = textPath.querySelector('[textType=outside]')
      return {
        id: text.id,
        content: text.textContent,
        fontType,
        fontFile: fontOptions.find(v => v.fontType === fontType).fontFile,
        fontSize: text.getAttribute('font-size'),
        borders: [
          { type: 'outside', color: pathOutside.getAttribute('stroke'), strokeWidth: pathOutside.getAttribute('stroke-width') },
          { type: 'middle',color: pathMiddle.getAttribute('stroke'), strokeWidth: pathMiddle.getAttribute('stroke-width') },
          { type: 'inside',color: pathInside.getAttribute('stroke'), strokeWidth: pathInside.getAttribute('stroke-width') },
        ],
      }
    })
  }
}

export { StyleManager };
