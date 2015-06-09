'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * @module HTML
 */

var _each = require('../util');

/*
 * Get the HTML contents of the first element, or set the HTML contents for each element in the collection.
 *
 * @param {String} [fragment] HTML fragment to set for the element. If this argument is omitted, the HTML contents are returned.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').html();
 *     $('.item').html('<span>more</span>');
 */

function html(fragment) {

  if (typeof fragment !== 'string') {
    var element = this.nodeType ? this : this[0];
    return element ? element.innerHTML : undefined;
  }

  _each.each(this, function (element) {
    element.innerHTML = fragment;
  });

  return this;
}

/*
 * Export interface
 */

exports.html = html;