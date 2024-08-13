import { SVG } from '@svgdotjs/svg.js';
import $ from 'jquery';

function getIntersectionList(el, target) {}

class SvgEditor {
  constructor() {
    this.world = window.world;
  }

  getEditElement() {
    this.editList = ['svg_10'];
    this.svgEl = this.world.editTextManager.svgEl;    
    
    $(this.svgEl.node).on('mousedown', (e) => {
      console.log(e, 'mousedown');
      if(!e.srcElement) return;
      this.isMoving = this.selectedNode === e.srcElement || e.srcElement.id === 'rectSelected';
    })
    $(this.svgEl.node).on('mousemove', (e) => {
      // console.log(e, 'mousemove');
      if(this.isMoving) {
        this.moveNode(e);
      }
    })
    $(this.svgEl.node).on('mouseup', (e) => {
      console.log(e, 'mouseup');
      if(!e.srcElement || this.isMoving) {
        this.isMoving = false;
        return;
      }
      this.selectedNode = e.srcElement;
      this.selectNode(e.srcElement);
      this.isMoving = false;
    })
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
    return this.svgEl.node;
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