/*
 * @Author: chris.c Chris.C@frontop.cn
 * @Date: 2024-08-23 16:51:54
 * @LastEditors: chris.c Chris.C@frontop.cn
 * @LastEditTime: 2024-08-23 17:42:23
 * @FilePath: \jersey\src\world\SvgEditor.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { SVG } from '@svgdotjs/svg.js';
import $ from 'jquery';
import SvgCanvas from '../lib/svgcanvas';

function getIntersectionList(el, target) {}
const config = {
  initFill: { color: 'FFFFFF', opacity: 1 },
  initStroke: { color: '000000', opacity: 1, width: 1 },
  text: { stroke_width: 0, font_size: 24, font_family: 'serif' },
  initOpacity: 1,
  imgPath: '/',
  dimensions: [ 2048, 2048 ],
  baseUnit: 'px'
}

class SvgEditor {
  constructor(world) {
    this.world = world;
    this.init();
  }

  init() {
    const container = document.querySelector('#svgCtn');
    this.svgCanvas = new SvgCanvas(container, config);
  }

  async setSvgString(options) {
    const { url, svgString } = options;
    let svgStr;
    if(svgString) {
      svgStr = svgString;
    }else if(url){
      svgStr = await fetch(url).then(res => res.text())
    }else{
      return false;
    }
    const success = this.svgCanvas.setSvgString(svgStr);
    if(!success) {
      console.error('无法解析svg');
      return false;
    }
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgStr, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    this.svgEl = SVG(svgElement);
    this.svgCanvas.updateCanvas(this.svgEl.width(), this.svgEl.height());
    return true;
  }

  moveNode(e) {
    const svgEl = SVG(e.target);
    svgEl.move(e.clientX, e.clientY);
    this.world.editTextManager.svgToTexture(this.svgEl.node.outerHTML)
    console.log(e.clientX, e.clientY);
  }

  selectNode(el) {
    const box = el.getBBox();
    const symbol = this.svgEl.group()
    const rect = symbol.rect(box.width, box.height).fill({opacity: 0}).stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' });
    rect.attr('id', 'rectSelected')
    window.rect = rect;
    rect.move(box.x, box.y);
    window.symbol = symbol
    const image = symbol.image('https://cdn.img42.com/4b6f5e63ac50c95fe147052d8a4db676.jpeg')
    image.size(100, 100).move(box.x - 50, box.y- 50);
    this.world.editTextManager.svgToTexture(this.svgEl.node.outerHTML)
    // window.use = use
  }

  onDelegate(el, event, mouse) {
    this.trigger(el, event, mouse, (enable) => {
      this.world && this.world.controls && (this.world.controls.enabled = !enable);
    })
  }

  getSvgElement() {
    // return document.querySelector('#svgCtn');
    return this.svgCanvas.svgroot;
  }

  trigger(el, event, mouse, callback) {
    const svgElement = this.getSvgElement();
    let customEvent = null;
    let controlEnabled = false;

    let {type, button} = event;
    let isPreventDefault = false;
    switch(type){
      case 'touchstart':
        isPreventDefault = true;
        type = 'mousedown';
        break;
      case 'touchmove':
        isPreventDefault = true;
        type = 'mousemove';
        break;
      case 'touchend':
        isPreventDefault = true;
        type = 'mouseup';
        break;
      case 'touchstart':
        isPreventDefault = true;
        type = 'mousedown';
        break;
      case 'touchcancel':
        isPreventDefault = true;
        type = 'mouseup';
        break;
    }
    if(isPreventDefault) {
      event.preventDefault();
      button = 0;
    }
    const ctnEl = document.querySelector('#svgCtn');
    let intersectTarget = null;
    if(mouse.cursorOverCanvas || type === 'mouseup') {
      const rect = svgElement.getBoundingClientRect();
      const offsetX = rect.width * mouse.x;
      const offsetY = rect.height * mouse.y;
      const svgRect = svgElement.createSVGRect();
      svgRect.x = offsetX;
      svgRect.y = offsetY;
      svgRect.width = svgRect.height = 1;
      const intersectList = svgElement.getIntersectionList && !svgElement.querySelector(".layer svg[id^=svg_], use") ? svgElement.getIntersectionList(svgRect, null) : getIntersectionList(svgElement, svgRect);
      intersectTarget = intersectList[intersectList.length - 1];
      // 传递intersectionEvent事件

      
      el.style.cursor = intersectTarget ? intersectTarget.style.cursor : 'default';
      const screenRect = document.body.getBoundingClientRect();
      let topDiff = rect.top - screenRect.top;
      let leftDiff = rect.left - screenRect.left;
      if(type === 'drop') {
        console.log('drop event');
        const str = (mouse.originalEvent || mouse).dataTransfer.getData('text');
        if(typeof str === 'string') {
          str.trim();
          let dom = JSON.parse(str);
          // 传递addImage事件

        }
        return;
      }
      customEvent = new MouseEvent(type, {
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        view: event.view,
        detail: event.detail,
        // pageX: offsetX,
        // pageY: offsetY,        
        // clientX: offsetX,
        // clientY: offsetY,
        pageX: offsetX + leftDiff,
        pageY: offsetY + topDiff,        
        clientX: offsetX + leftDiff,
        clientY: offsetY + topDiff,
        target: intersectTarget,
        currentTarget: ctnEl,
        delegateTarget: ctnEl,
        srcElement: intersectTarget,
        toElement: intersectTarget,
        altKey: false,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        button: button
      })
      controlEnabled = !!intersectTarget;
    }
    if(intersectTarget && customEvent){
      intersectTarget.dispatchEvent(customEvent);
    }else if(!intersectTarget && customEvent){
      ctnEl.dispatchEvent(customEvent);
    }
    if(event.type === 'touchend' || event.type === 'touchcancel'){
      controlEnabled = false;
    }
    callback(controlEnabled);
  }

  _trigger(el, event, mouse, callback) {
    const svgElement = this.getSvgElement();
    let customEvent = null;
    let controlEnabled = false;

    let {type, button} = event;
    let isPreventDefault = false;
    switch(type){
      case 'touchstart':
        isPreventDefault = true;
        type = 'mousedown';
        break;
      case 'touchmove':
        isPreventDefault = true;
        type = 'mousemove';
        break;
      case 'touchend':
        isPreventDefault = true;
        type = 'mouseup';
        break;
      case 'touchstart':
        isPreventDefault = true;
        type = 'mousedown';
        break;
      case 'touchcancel':
        isPreventDefault = true;
        type = 'mouseup';
        break;
    }
    if(isPreventDefault) {
      event.preventDefault();
      button = 0;
    }
    if(mouse.cursorOverCanvas || type === 'mouseup') {
      const rect = svgElement.getBoundingClientRect();
      const offsetX = rect.width * mouse.x;
      const offsetY = rect.height * mouse.y;
      const svgRect = svgElement.createSVGRect();
      svgRect.x = offsetX;
      svgRect.y = offsetY;
      svgRect.width = svgRect.height = 1;
      const intersectList = svgElement.getIntersectionList && !svgElement.querySelector(".layer svg[id^=svg_], use") ? svgElement.getIntersectionList(svgRect, null) : getIntersectionList(svgElement, svgRect);
      const intersectTarget = intersectList[intersectList.length - 1];

      // 传递intersectionEvent事件
      
      el.style.cursor = intersectTarget ? intersectTarget.style.cursor : 'default';
      const screenRect = document.body.getBoundingClientRect();
      let topDiff = rect.top - screenRect.top;
      let leftDiff = rect.left - screenRect.left;
      if(type === 'drop') {
        console.log('drop event');
        const str = (mouse.originalEvent || mouse).dataTransfer.getData('text');
        if(typeof str === 'string') {
          str.trim();
          let dom = JSON.parse(str);
          // 传递addImage事件

        }
        return;
      }
      customEvent = $.Event(type, {
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        view: event.view,
        detail: event.detail,
        pageX: offsetX,
        pageY: offsetY,        
        clientX: offsetX,
        clientY: offsetY,
        // pageX: offsetX + leftDiff,
        // pageY: offsetY + topDiff,        
        // clientX: offsetX + leftDiff,
        // clientY: offsetY + topDiff,
        target: intersectTarget,
        currentTarget: svgElement,
        delegateTarget: svgElement,
        srcElement: intersectTarget,
        toElement: intersectTarget,
        altKey: false,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        button: button
      })
      controlEnabled = !!intersectTarget;
    }
    if(customEvent){
      $(svgElement).trigger(customEvent);
    }
    if(event.type === 'touchend' || event.type === 'touchcancel'){
      controlEnabled = false;
    }
    callback(controlEnabled);
  }


}

export {SvgEditor};