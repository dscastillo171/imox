define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  /**
   * @module Ready
   */

  /**
   * Execute callback when `DOMContentLoaded` fires for `document`, or immediately if called afterwards.
   *
   * @param handler Callback to execute when initial DOM content is loaded.
   * @return {Object} The wrapped collection
   * @chainable
   * @example
   *     $(document).ready(callback);
   */

  function ready(handler) {
    if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
      handler();
    } else {
      document.addEventListener('DOMContentLoaded', handler, false);
    }
    return this;
  }

  /*
   * Export interface
   */

  exports.ready = ready;
});