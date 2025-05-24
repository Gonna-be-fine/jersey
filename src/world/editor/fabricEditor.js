import * as THREE from 'three';
import FabricCanvas from './FabricCanvas';
import { loadSVGFromString, loadSVGFromURL } from 'fabric';
import { SvgFontManager } from './SvgFontManager';

const DEFAULTSIZE = 2048;

class FabricEditor {
  constructor(world, options) {
    this.world = world;
    this.options = options;
    this.initFabricCanvas();
  }

  async initFabricCanvas() {
    this.containerId = this.options.type + 'Ctn';
    this.canvas = new FabricCanvas(this.containerId, {}, this.world);
    this.loadSvg();
    this.texture = new THREE.Texture(this.canvas.getElement());
    this.texture.flipY = false;
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
      console.log(data)
      // 缩放并添加到画布
      objects.forEach((obj) => {
        // if(obj.type === 'text') {
        //   console.log(obj.toObject())
        //   obj = obj.toObject();
        // }
        obj.scaleX *= scale;
        obj.scaleY *= scale;
        obj.left *= scale;
        obj.top *= scale;
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
}

export default FabricEditor;
