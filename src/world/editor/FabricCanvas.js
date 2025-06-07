import { Canvas } from 'fabric';

export default class FabricCanvas extends Canvas {
  constructor(el, options, world) {
    super(el, options);
    this.world = world;
  }

  getObjectById(id) {
    const objects = this.getObjects()
    return objects.find(o => o.id === id);
  }
  
}
