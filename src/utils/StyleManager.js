import { ColorPrevList, DefaultTextItem } from "../configs";

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

class StyleManager {
  getColorParams(objects) {
    const filterObjects = []
    objects.forEach(v => {
      let item = ColorPrevList.find(v1 => v1.id === v.id)
      if (item) {
        item = JSON.parse(JSON.stringify(item))
        item.color = v.fill;
        filterObjects.push(item)
      }
    })
    return filterObjects
  }

  getImageParams(objects) {
    const list = []
    objects.forEach(v => {
      if (v.type === 'Image' && v.src && v.id.slice(0, 3) === 'img') {
        list.push({
          id: v.id,
          url: v.src,
        })
      }
    })
    return list;
  }

  pickTextOptions(text) {
    const options = JSON.parse(JSON.stringify(DefaultTextItem));
    options.id = text.id;
    for (const key in options) {
      options[key] = text[key];
    }
    return options;
  }

  getTextParams(objects) {
    const list = []
    objects.forEach(v => {
      if (v.type === 'CustomText' && v.id.slice(0, 4) === 'text') {
        const text = v.objects.find(v => v.type === 'Text');
        list.push({ 
          ...this.pickTextOptions(text),
          curveValue: v.curveValue || 50,
          isCurved: true,
          id: v.id
        });
        return;
      }
      if (v.type === 'Text' && v.id.slice(0, 4) === 'text') {
        list.push({
          ...this.pickTextOptions(v),
          isCurved: false,
          curveValue: v.curveValue || 50,
          id: v.id          
        });
      }
    })
    return list
  }

  getRenderFromJson(json) {
    const model = json.scene.model;
    return model.map(v => {
      return {
        type: v.type,
        logos: this.getImageParams(v.texture.main.objects),
        texts: this.getTextParams(v.texture.main.objects),
        colors: this.getColorParams(v.texture.main.objects),
      }
    })
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
