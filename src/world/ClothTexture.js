import { CanvasTexture } from "three";
import { SVG } from '@svgdotjs/svg.js';

const defaultOpts = {
  width: 2048,
  height: 2048,
}
class ClothTexture {
  constructor(options) {
    this.options = Object.assign(defaultOpts, options);
    this.init();
  }

  async init() {
    const { width, height, img } = this.options;
    // canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    // ctx
    this.ctx = this.canvas.getContext('2d');

    // canvasTexture
    this.canvasTexture = new CanvasTexture(this.canvas);
    this.canvasTexture.anisotropy = 16;
    this.canvasTexture.flipY = false;

    // fetch svg to generate texture
    const svgText = await fetch(img).then((res) =>
      res.text()
    );
    // const svgCtn = document.querySelector('#svgCtn');
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    // svgCtn.appendChild(svgElement);
    this.svgEl = SVG(svgElement);
    console.log(this.svgEl)
    this.svgToTexture(svgText);
  }

  svgToTexture(svgString) {
    // 创建一个 Image 元素
    var img = new Image();

    const canvas = this.canvas;
    const ctx = this.ctx;

    // 将 SVG 字符串绘制到 Canvas 上
    var DOMURL = window.URL || window.webkitURL || window;
    var svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    var url = DOMURL.createObjectURL(svgBlob);

    img.onload =  () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      DOMURL.revokeObjectURL(url); // 释放 URL 对象
      this.canvasTexture.needsUpdate = true;
    };

    img.src = url;
  }

  edit(x, y) {
    const rootSvg = SVG('#svgroot');
    const imageClone = rootSvg.findOne('#svg_10');
    imageClone.move(x, y);
    
    const svgText = rootSvg.node.outerHTML;
    this.svgToTexture(svgText);
  }
}

export { ClothTexture }