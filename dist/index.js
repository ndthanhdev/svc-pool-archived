(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global['@plugin-pool/core'] = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    function _isPlaceholder(a) {
           return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
    }

    /**
     * Optimized internal one-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    function _curry1(fn) {
      return function f1(a) {
        if (arguments.length === 0 || _isPlaceholder(a)) {
          return f1;
        } else {
          return fn.apply(this, arguments);
        }
      };
    }

    /**
     * Optimized internal two-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    function _curry2(fn) {
      return function f2(a, b) {
        switch (arguments.length) {
          case 0:
            return f2;
          case 1:
            return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
              return fn(a, _b);
            });
          default:
            return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
              return fn(_a, b);
            }) : _isPlaceholder(b) ? _curry1(function (_b) {
              return fn(a, _b);
            }) : fn(a, b);
        }
      };
    }

    function _arity(n, fn) {
      /* eslint-disable no-unused-vars */
      switch (n) {
        case 0:
          return function () {
            return fn.apply(this, arguments);
          };
        case 1:
          return function (a0) {
            return fn.apply(this, arguments);
          };
        case 2:
          return function (a0, a1) {
            return fn.apply(this, arguments);
          };
        case 3:
          return function (a0, a1, a2) {
            return fn.apply(this, arguments);
          };
        case 4:
          return function (a0, a1, a2, a3) {
            return fn.apply(this, arguments);
          };
        case 5:
          return function (a0, a1, a2, a3, a4) {
            return fn.apply(this, arguments);
          };
        case 6:
          return function (a0, a1, a2, a3, a4, a5) {
            return fn.apply(this, arguments);
          };
        case 7:
          return function (a0, a1, a2, a3, a4, a5, a6) {
            return fn.apply(this, arguments);
          };
        case 8:
          return function (a0, a1, a2, a3, a4, a5, a6, a7) {
            return fn.apply(this, arguments);
          };
        case 9:
          return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
            return fn.apply(this, arguments);
          };
        case 10:
          return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            return fn.apply(this, arguments);
          };
        default:
          throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
      }
    }

    /**
     * Internal curryN function.
     *
     * @private
     * @category Function
     * @param {Number} length The arity of the curried function.
     * @param {Array} received An array of arguments received thus far.
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    function _curryN(length, received, fn) {
      return function () {
        var combined = [];
        var argsIdx = 0;
        var left = length;
        var combinedIdx = 0;
        while (combinedIdx < received.length || argsIdx < arguments.length) {
          var result;
          if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
            result = received[combinedIdx];
          } else {
            result = arguments[argsIdx];
            argsIdx += 1;
          }
          combined[combinedIdx] = result;
          if (!_isPlaceholder(result)) {
            left -= 1;
          }
          combinedIdx += 1;
        }
        return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
      };
    }

    /**
     * Returns a curried equivalent of the provided function, with the specified
     * arity. The curried function has two unusual capabilities. First, its
     * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
     * following are equivalent:
     *
     *   - `g(1)(2)(3)`
     *   - `g(1)(2, 3)`
     *   - `g(1, 2)(3)`
     *   - `g(1, 2, 3)`
     *
     * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
     * "gaps", allowing partial application of any combination of arguments,
     * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
     * the following are equivalent:
     *
     *   - `g(1, 2, 3)`
     *   - `g(_, 2, 3)(1)`
     *   - `g(_, _, 3)(1)(2)`
     *   - `g(_, _, 3)(1, 2)`
     *   - `g(_, 2)(1)(3)`
     *   - `g(_, 2)(1, 3)`
     *   - `g(_, 2)(_, 3)(1)`
     *
     * @func
     * @memberOf R
     * @since v0.5.0
     * @category Function
     * @sig Number -> (* -> a) -> (* -> a)
     * @param {Number} length The arity for the returned function.
     * @param {Function} fn The function to curry.
     * @return {Function} A new, curried function.
     * @see R.curry
     * @example
     *
     *      const sumArgs = (...args) => R.sum(args);
     *
     *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
     *      const f = curriedAddFourNumbers(1, 2);
     *      const g = f(3);
     *      g(4); //=> 10
     */
    var curryN = /*#__PURE__*/_curry2(function curryN(length, fn) {
      if (length === 1) {
        return _curry1(fn);
      }
      return _arity(length, _curryN(length, [], fn));
    });

    /**
     * Optimized internal three-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    function _curry3(fn) {
      return function f3(a, b, c) {
        switch (arguments.length) {
          case 0:
            return f3;
          case 1:
            return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
              return fn(a, _b, _c);
            });
          case 2:
            return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
              return fn(_a, b, _c);
            }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
              return fn(a, _b, _c);
            }) : _curry1(function (_c) {
              return fn(a, b, _c);
            });
          default:
            return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
              return fn(_a, _b, c);
            }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
              return fn(_a, b, _c);
            }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
              return fn(a, _b, _c);
            }) : _isPlaceholder(a) ? _curry1(function (_a) {
              return fn(_a, b, c);
            }) : _isPlaceholder(b) ? _curry1(function (_b) {
              return fn(a, _b, c);
            }) : _isPlaceholder(c) ? _curry1(function (_c) {
              return fn(a, b, _c);
            }) : fn(a, b, c);
        }
      };
    }

    /**
     * Tests whether or not an object is an array.
     *
     * @private
     * @param {*} val The object to test.
     * @return {Boolean} `true` if `val` is an array, `false` otherwise.
     * @example
     *
     *      _isArray([]); //=> true
     *      _isArray(null); //=> false
     *      _isArray({}); //=> false
     */
    var _isArray = Array.isArray || function _isArray(val) {
      return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
    };

    function _isString(x) {
      return Object.prototype.toString.call(x) === '[object String]';
    }

    /**
     * Tests whether or not an object is similar to an array.
     *
     * @private
     * @category Type
     * @category List
     * @sig * -> Boolean
     * @param {*} x The object to test.
     * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
     * @example
     *
     *      _isArrayLike([]); //=> true
     *      _isArrayLike(true); //=> false
     *      _isArrayLike({}); //=> false
     *      _isArrayLike({length: 10}); //=> false
     *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
     */
    var _isArrayLike = /*#__PURE__*/_curry1(function isArrayLike(x) {
      if (_isArray(x)) {
        return true;
      }
      if (!x) {
        return false;
      }
      if (typeof x !== 'object') {
        return false;
      }
      if (_isString(x)) {
        return false;
      }
      if (x.nodeType === 1) {
        return !!x.length;
      }
      if (x.length === 0) {
        return true;
      }
      if (x.length > 0) {
        return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
      }
      return false;
    });

    var XWrap = /*#__PURE__*/function () {
      function XWrap(fn) {
        this.f = fn;
      }
      XWrap.prototype['@@transducer/init'] = function () {
        throw new Error('init not implemented on XWrap');
      };
      XWrap.prototype['@@transducer/result'] = function (acc) {
        return acc;
      };
      XWrap.prototype['@@transducer/step'] = function (acc, x) {
        return this.f(acc, x);
      };

      return XWrap;
    }();

    function _xwrap(fn) {
      return new XWrap(fn);
    }

    /**
     * Creates a function that is bound to a context.
     * Note: `R.bind` does not provide the additional argument-binding capabilities of
     * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
     *
     * @func
     * @memberOf R
     * @since v0.6.0
     * @category Function
     * @category Object
     * @sig (* -> *) -> {*} -> (* -> *)
     * @param {Function} fn The function to bind to context
     * @param {Object} thisObj The context to bind `fn` to
     * @return {Function} A function that will execute in the context of `thisObj`.
     * @see R.partial
     * @example
     *
     *      const log = R.bind(console.log, console);
     *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
     *      // logs {a: 2}
     * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
     */
    var bind = /*#__PURE__*/_curry2(function bind(fn, thisObj) {
      return _arity(fn.length, function () {
        return fn.apply(thisObj, arguments);
      });
    });

    function _arrayReduce(xf, acc, list) {
      var idx = 0;
      var len = list.length;
      while (idx < len) {
        acc = xf['@@transducer/step'](acc, list[idx]);
        if (acc && acc['@@transducer/reduced']) {
          acc = acc['@@transducer/value'];
          break;
        }
        idx += 1;
      }
      return xf['@@transducer/result'](acc);
    }

    function _iterableReduce(xf, acc, iter) {
      var step = iter.next();
      while (!step.done) {
        acc = xf['@@transducer/step'](acc, step.value);
        if (acc && acc['@@transducer/reduced']) {
          acc = acc['@@transducer/value'];
          break;
        }
        step = iter.next();
      }
      return xf['@@transducer/result'](acc);
    }

    function _methodReduce(xf, acc, obj, methodName) {
      return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
    }

    var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';

    function _reduce(fn, acc, list) {
      if (typeof fn === 'function') {
        fn = _xwrap(fn);
      }
      if (_isArrayLike(list)) {
        return _arrayReduce(fn, acc, list);
      }
      if (typeof list['fantasy-land/reduce'] === 'function') {
        return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
      }
      if (list[symIterator] != null) {
        return _iterableReduce(fn, acc, list[symIterator]());
      }
      if (typeof list.next === 'function') {
        return _iterableReduce(fn, acc, list);
      }
      if (typeof list.reduce === 'function') {
        return _methodReduce(fn, acc, list, 'reduce');
      }

      throw new TypeError('reduce: list must be array or iterable');
    }

    /**
     * Returns a single item by iterating through the list, successively calling
     * the iterator function and passing it an accumulator value and the current
     * value from the array, and then passing the result to the next call.
     *
     * The iterator function receives two values: *(acc, value)*. It may use
     * [`R.reduced`](#reduced) to shortcut the iteration.
     *
     * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
     * is *(value, acc)*.
     *
     * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
     * arrays), unlike the native `Array.prototype.reduce` method. For more details
     * on this behavior, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
     *
     * Dispatches to the `reduce` method of the third argument, if present. When
     * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
     * shortcuting, as this is not implemented by `reduce`.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig ((a, b) -> a) -> a -> [b] -> a
     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
     *        current element from the array.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @see R.reduced, R.addIndex, R.reduceRight
     * @example
     *
     *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
     *      //          -               -10
     *      //         / \              / \
     *      //        -   4           -6   4
     *      //       / \              / \
     *      //      -   3   ==>     -3   3
     *      //     / \              / \
     *      //    -   2           -1   2
     *      //   / \              / \
     *      //  0   1            0   1
     *
     * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
     */
    var reduce = /*#__PURE__*/_curry3(_reduce);

    /**
     * Returns a curried equivalent of the provided function. The curried function
     * has two unusual capabilities. First, its arguments needn't be provided one
     * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
     * following are equivalent:
     *
     *   - `g(1)(2)(3)`
     *   - `g(1)(2, 3)`
     *   - `g(1, 2)(3)`
     *   - `g(1, 2, 3)`
     *
     * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
     * "gaps", allowing partial application of any combination of arguments,
     * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
     * the following are equivalent:
     *
     *   - `g(1, 2, 3)`
     *   - `g(_, 2, 3)(1)`
     *   - `g(_, _, 3)(1)(2)`
     *   - `g(_, _, 3)(1, 2)`
     *   - `g(_, 2)(1)(3)`
     *   - `g(_, 2)(1, 3)`
     *   - `g(_, 2)(_, 3)(1)`
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (* -> a) -> (* -> a)
     * @param {Function} fn The function to curry.
     * @return {Function} A new, curried function.
     * @see R.curryN, R.partial
     * @example
     *
     *      const addFourNumbers = (a, b, c, d) => a + b + c + d;
     *
     *      const curriedAddFourNumbers = R.curry(addFourNumbers);
     *      const f = curriedAddFourNumbers(1, 2);
     *      const g = f(3);
     *      g(4); //=> 10
     */
    var curry = /*#__PURE__*/_curry1(function curry(fn) {
      return curryN(fn.length, fn);
    });

    function _cloneRegExp(pattern) {
                                      return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
    }

    /**
     * Gives a single-word string description of the (native) type of a value,
     * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
     * attempt to distinguish user Object types any further, reporting them all as
     * 'Object'.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Type
     * @sig (* -> {*}) -> String
     * @param {*} val The value to test
     * @return {String}
     * @example
     *
     *      R.type({}); //=> "Object"
     *      R.type(1); //=> "Number"
     *      R.type(false); //=> "Boolean"
     *      R.type('s'); //=> "String"
     *      R.type(null); //=> "Null"
     *      R.type([]); //=> "Array"
     *      R.type(/[A-z]/); //=> "RegExp"
     *      R.type(() => {}); //=> "Function"
     *      R.type(undefined); //=> "Undefined"
     */
    var type = /*#__PURE__*/_curry1(function type(val) {
      return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
    });

    /**
     * Copies an object.
     *
     * @private
     * @param {*} value The value to be copied
     * @param {Array} refFrom Array containing the source references
     * @param {Array} refTo Array containing the copied source references
     * @param {Boolean} deep Whether or not to perform deep cloning.
     * @return {*} The copied value.
     */
    function _clone(value, refFrom, refTo, deep) {
      var copy = function copy(copiedValue) {
        var len = refFrom.length;
        var idx = 0;
        while (idx < len) {
          if (value === refFrom[idx]) {
            return refTo[idx];
          }
          idx += 1;
        }
        refFrom[idx + 1] = value;
        refTo[idx + 1] = copiedValue;
        for (var key in value) {
          copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
        }
        return copiedValue;
      };
      switch (type(value)) {
        case 'Object':
          return copy({});
        case 'Array':
          return copy([]);
        case 'Date':
          return new Date(value.valueOf());
        case 'RegExp':
          return _cloneRegExp(value);
        default:
          return value;
      }
    }

    /**
     * Creates a deep copy of the value which may contain (nested) `Array`s and
     * `Object`s, `Number`s, `String`s, `Boolean`s and `Date`s. `Function`s are
     * assigned by reference rather than copied
     *
     * Dispatches to a `clone` method if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig {*} -> {*}
     * @param {*} value The object or array to clone
     * @return {*} A deeply cloned copy of `val`
     * @example
     *
     *      const objects = [{}, {}, {}];
     *      const objectsClone = R.clone(objects);
     *      objects === objectsClone; //=> false
     *      objects[0] === objectsClone[0]; //=> false
     */
    var clone = /*#__PURE__*/_curry1(function clone(value) {
      return value != null && typeof value.clone === 'function' ? value.clone() : _clone(value, [], [], true);
    });

    function _pipe(f, g) {
      return function () {
        return g.call(this, f.apply(this, arguments));
      };
    }

    /**
     * This checks whether a function has a [methodname] function. If it isn't an
     * array it will execute that function otherwise it will default to the ramda
     * implementation.
     *
     * @private
     * @param {Function} fn ramda implemtation
     * @param {String} methodname property to check for a custom implementation
     * @return {Object} Whatever the return value of the method is.
     */
    function _checkForMethod(methodname, fn) {
      return function () {
        var length = arguments.length;
        if (length === 0) {
          return fn();
        }
        var obj = arguments[length - 1];
        return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
      };
    }

    /**
     * Returns the elements of the given list or string (or object with a `slice`
     * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
     *
     * Dispatches to the `slice` method of the third argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.4
     * @category List
     * @sig Number -> Number -> [a] -> [a]
     * @sig Number -> Number -> String -> String
     * @param {Number} fromIndex The start index (inclusive).
     * @param {Number} toIndex The end index (exclusive).
     * @param {*} list
     * @return {*}
     * @example
     *
     *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
     *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
     *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
     *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
     *      R.slice(0, 3, 'ramda');                     //=> 'ram'
     */
    var slice = /*#__PURE__*/_curry3( /*#__PURE__*/_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
      return Array.prototype.slice.call(list, fromIndex, toIndex);
    }));

    /**
     * Returns all but the first element of the given list or string (or object
     * with a `tail` method).
     *
     * Dispatches to the `slice` method of the first argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig [a] -> [a]
     * @sig String -> String
     * @param {*} list
     * @return {*}
     * @see R.head, R.init, R.last
     * @example
     *
     *      R.tail([1, 2, 3]);  //=> [2, 3]
     *      R.tail([1, 2]);     //=> [2]
     *      R.tail([1]);        //=> []
     *      R.tail([]);         //=> []
     *
     *      R.tail('abc');  //=> 'bc'
     *      R.tail('ab');   //=> 'b'
     *      R.tail('a');    //=> ''
     *      R.tail('');     //=> ''
     */
    var tail = /*#__PURE__*/_curry1( /*#__PURE__*/_checkForMethod('tail', /*#__PURE__*/slice(1, Infinity)));

    /**
     * Performs left-to-right function composition. The leftmost function may have
     * any arity; the remaining functions must be unary.
     *
     * In some libraries this function is named `sequence`.
     *
     * **Note:** The result of pipe is not automatically curried.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
     * @param {...Function} functions
     * @return {Function}
     * @see R.compose
     * @example
     *
     *      const f = R.pipe(Math.pow, R.negate, R.inc);
     *
     *      f(3, 4); // -(3^4) + 1
     * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
     */
    function pipe() {
      if (arguments.length === 0) {
        throw new Error('pipe requires at least one argument');
      }
      return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
    }

    var BaseError = /** @class */ (function () {
        function BaseError(message) {
            Error.call(this, message);
        }
        return BaseError;
    }());

    var CircularDependency = /** @class */ (function (_super) {
        __extends(CircularDependency, _super);
        function CircularDependency(point) {
            return _super.call(this, "Cannot resolve circular dependencies: " + point) || this;
        }
        return CircularDependency;
    }(BaseError));

    var NotRegistered = /** @class */ (function (_super) {
        __extends(NotRegistered, _super);
        function NotRegistered(point) {
            return _super.call(this, "Point requested was not registered yet: " + point) || this;
        }
        return NotRegistered;
    }(BaseError));

    function isFullDefinition(definition) {
        return (definition instanceof Object &&
            definition.optional !== undefined);
    }
    function convertToFullDefinition(_a) {
        var _b = _a.deps, deps = _b === void 0 ? {} : _b, point = _a.point, factory = _a.factory;
        var re = {
            point: point,
            factory: factory,
            deps: {},
        };
        re.deps = Object.keys(deps).reduce(function (acc, k) {
            var depDef = deps[k];
            if (isFullDefinition(depDef)) {
                acc[k] = Object.assign({}, depDef);
            }
            else {
                acc[k] = {
                    point: depDef,
                    optional: false,
                };
            }
            return acc;
        }, {});
        return re;
    }

    var register = curry(function (definitions, definition) {
        var fullDefinition = convertToFullDefinition(definition);
        var inStock = (definitions.get(definition.point) ||
            []);
        definitions.set(definition.point, __spreadArrays(inStock, [fullDefinition]));
        return definitions;
    });
    var importPlugin = reduce(register);
    var curriedImportPlugin = curry(function (definitions, plugin) {
        return importPlugin(definitions, plugin);
    });
    var importPlugins = reduce(curriedImportPlugin);
    var curriedImportPlugins = curry(function (definitions, plugins) {
        return importPlugins(definitions, plugins);
    });
    var getServices = function (resolved, point) {
        return resolved[point];
    };
    var curriedGetServices = curry(getServices);
    var resolve = function (definition) { return function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolved, resolving, resolvePoint, points, _i, points_1, point, instances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolved = {};
                    resolving = new Set();
                    resolvePoint = function (point, root) {
                        if (root === void 0) { root = false; }
                        return __awaiter(void 0, void 0, void 0, function () {
                            var resolveDef, resolveServices, definitions, instances;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        resolveDef = function (def) { return __awaiter(void 0, void 0, void 0, function () {
                                            var theDefinitions;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        theDefinitions = definition.get(def.point);
                                                        if (!!theDefinitions) return [3 /*break*/, 1];
                                                        if (def.optional) {
                                                            return [2 /*return*/, undefined];
                                                        }
                                                        throw new NotRegistered(point);
                                                    case 1: return [4 /*yield*/, resolvePoint(def.point)];
                                                    case 2: return [2 /*return*/, _a.sent()];
                                                }
                                            });
                                        }); };
                                        resolveServices = function (definitions) { return __awaiter(void 0, void 0, void 0, function () {
                                            var resolveService, instances, _i, definitions_1, def, _a, _b;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0:
                                                        resolveService = function (definition) { return __awaiter(void 0, void 0, void 0, function () {
                                                            var deps, resolvedDeps, _a, _b, _i, key, registeredPoint, _c, _d, instance;
                                                            return __generator(this, function (_e) {
                                                                switch (_e.label) {
                                                                    case 0:
                                                                        deps = definition.deps;
                                                                        resolvedDeps = {};
                                                                        _a = [];
                                                                        for (_b in deps)
                                                                            _a.push(_b);
                                                                        _i = 0;
                                                                        _e.label = 1;
                                                                    case 1:
                                                                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                                                                        key = _a[_i];
                                                                        registeredPoint = deps[key];
                                                                        _c = resolvedDeps;
                                                                        _d = key;
                                                                        return [4 /*yield*/, resolveDef(registeredPoint)];
                                                                    case 2:
                                                                        _c[_d] = _e.sent();
                                                                        _e.label = 3;
                                                                    case 3:
                                                                        _i++;
                                                                        return [3 /*break*/, 1];
                                                                    case 4: return [4 /*yield*/, definition.factory(resolvedDeps)];
                                                                    case 5:
                                                                        instance = _e.sent();
                                                                        return [2 /*return*/, instance];
                                                                }
                                                            });
                                                        }); };
                                                        instances = [];
                                                        _i = 0, definitions_1 = definitions;
                                                        _c.label = 1;
                                                    case 1:
                                                        if (!(_i < definitions_1.length)) return [3 /*break*/, 4];
                                                        def = definitions_1[_i];
                                                        _b = (_a = instances).push;
                                                        return [4 /*yield*/, resolveService(def)];
                                                    case 2:
                                                        _b.apply(_a, [_c.sent()]);
                                                        _c.label = 3;
                                                    case 3:
                                                        _i++;
                                                        return [3 /*break*/, 1];
                                                    case 4: return [2 /*return*/, instances];
                                                }
                                            });
                                        }); };
                                        // if there is already a service for this point maybe this is a many point
                                        // @ts-ignore
                                        if (resolved[point] && !root) {
                                            // @ts-ignore
                                            return [2 /*return*/, resolved[point]];
                                        }
                                        // if currently resolving the same type, we have a circular dependency
                                        if (resolving.has(point)) {
                                            throw new CircularDependency(point);
                                        }
                                        resolving.add(point);
                                        definitions = definition.get(point);
                                        return [4 /*yield*/, resolveServices(definitions)];
                                    case 1:
                                        instances = _a.sent();
                                        resolving.delete(point);
                                        return [2 /*return*/, instances];
                                }
                            });
                        });
                    };
                    points = Array.from(definition.keys());
                    _i = 0, points_1 = points;
                    _a.label = 1;
                case 1:
                    if (!(_i < points_1.length)) return [3 /*break*/, 4];
                    point = points_1[_i];
                    return [4 /*yield*/, resolvePoint(point, true)];
                case 2:
                    instances = (_a.sent());
                    // @ts-ignore
                    resolved[point] = instances;
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, {
                        getServices: curriedGetServices(resolved),
                    }];
            }
        });
    }); }; };
    var createDefinitionPool = function (serviceDefinitions) {
        if (serviceDefinitions === void 0) { serviceDefinitions = new Map(); }
        var next = clone(serviceDefinitions);
        var theRegister = pipe(register(next), createDefinitionPool);
        var theImportPlugin = pipe(curriedImportPlugin(next), createDefinitionPool);
        var theImportPlugins = pipe(curriedImportPlugins(next), createDefinitionPool);
        return {
            register: theRegister,
            importPlugin: theImportPlugin,
            importPlugins: theImportPlugins,
            resolve: resolve(next),
        };
    };

    var createPlugin = function (definitions) { return __spreadArrays(definitions); };

    exports.createDefinitionPool = createDefinitionPool;
    exports.createPlugin = createPlugin;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
