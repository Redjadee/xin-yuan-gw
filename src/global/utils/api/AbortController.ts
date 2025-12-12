// src/utils/AbortController.ts

// 1. 极简的 Signal 实现
class SimpleAbortSignal {
  aborted: boolean = false;
  private _listeners: Array<() => void> = [];

  // Axios/Taro 会调用这个方法来监听取消动作
  addEventListener(type: string, listener: () => void) {
    if (type === 'abort') {
      this._listeners.push(listener);
    }
  }

  // 良好的习惯：支持移除监听
  removeEventListener(type: string, listener: () => void) {
    if (type === 'abort') {
      const index = this._listeners.indexOf(listener);
      if (index > -1) {
        this._listeners.splice(index, 1);
      }
    }
  }

  // 内部触发函数
  _dispatchEvent() {
    this._listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('Abort listener error:', e);
      }
    });
  }
}

// 2. 极简的 Controller 实现
export class AbortController {
  signal: SimpleAbortSignal;

  constructor() {
    this.signal = new SimpleAbortSignal();
  }

  // 你的 POST/GET 逻辑调用的就是这个方法
  abort() {
    if (this.signal.aborted) return;
    this.signal.aborted = true;
    this.signal._dispatchEvent();
  }
}

// 默认导出，兼容 import AbortController from ...
export default AbortController;