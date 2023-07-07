class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    // Immediately invoke the callback with an entry whose `isIntersecting` property is true.
    callback([{ isIntersecting: true }]);
  }

  observe(target) {
    // You might want to do something with the target here
  }

  disconnect() {
    // You might want to do something here
  }

  unobserve() {
    // You might want to do something here
  }
}

global.IntersectionObserver = IntersectionObserver;
