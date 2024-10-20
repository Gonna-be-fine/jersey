export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 注册事件监听器
  addEventListener(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // 移除事件监听器
  removeEvent(event, listener) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(
      (registeredListener) => registeredListener !== listener
    );
  }

  // 触发事件
  fire(event, ...args) {
    if (!this.events[event]) return;

    this.events[event].forEach((listener) => {
      listener(...args);
    });
  }
}
