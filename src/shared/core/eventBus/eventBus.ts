export default class EventBus<E extends string> {
  private listeners: Record<string, Function[]>;
  constructor() {
    this.listeners = {};
    console.log(this.listeners)
  }
  on(event: E, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  off(event: E, callback: Function) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    this.listeners[event] = this.listeners[event].filter(
        (listener) => listener !== callback,
    );
  }
  emit<T extends unknown[] = []>(event: E, ...args: T) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach(function (listener) {
      listener(...args);
    });
  }
}
