/*!
 * bindings.js vv0.2.1
 * build-date: Mon Mar 20 2017 13:33:09 GMT-0500 (Central Daylight Time)
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["bindings"] = factory();
	else
		root["bindings"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding = (function () {
    function Binding() {
    }
    Object.defineProperty(Binding.prototype, "scope", {
        get: function () {
            return this.node.__scope__;
        },
        enumerable: true,
        configurable: true
    });
    Binding.prototype.run = function () { };
    Binding.prototype.unbind = function () { };
    return Binding;
}());
Binding.id = '';
Binding.priority = 0;
exports.Binding = Binding;
exports.default = Binding;
var OneWayBinding = (function (_super) {
    __extends(OneWayBinding, _super);
    function OneWayBinding(node, expression) {
        var _this = _super.call(this) || this;
        _this.node = node;
        /** a list of scopes or values this binding is listening to */
        _this.dependencies = [];
        _this.updateDependenciesOnChange = false;
        _this.expression = new Expression_1.default(node, expression, _this.scope);
        _this.updateDependencies();
        return _this;
    }
    /** this is called when one of the dependencies change */
    OneWayBinding.prototype.dependencyChange = function () {
        if (this.updateDependenciesOnChange) {
            this.updateDependencies();
        }
        this.run();
    };
    /** this is called when the expresion changes */
    OneWayBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        this.expression.run();
        if (this.dependencies.length == 0 && !this.expression.success) {
            this.dependencies.push(this.scope);
            this.bindDependencies();
            this.updateDependenciesOnChange = true; //when dependecies change update them
        }
    };
    /** unbinds the binding from the html node */
    OneWayBinding.prototype.unbind = function () {
        this.unbindDependencies();
    };
    OneWayBinding.prototype.getDependencies = function (refresh) {
        if (refresh === void 0) { refresh = false; }
        if (refresh || this.dependencies == undefined) {
            //get dependencies
            this.dependencies = this.expression.getDependencies().requires;
        }
        return this.dependencies;
    };
    OneWayBinding.prototype.updateDependencies = function () {
        this.unbindDependencies();
        this.getDependencies(true);
        this.bindDependencies();
    };
    OneWayBinding.prototype.bindDependencies = function () {
        for (var i = 0; i < this.dependencies.length; i++) {
            this.dependencies[i].on('change', this.dependencyChange.bind(this));
        }
    };
    OneWayBinding.prototype.unbindDependencies = function () {
        for (var i = 0; i < this.dependencies.length; i++) {
            this.dependencies[i].off('change', this.dependencyChange.bind(this));
        }
    };
    return OneWayBinding;
}(Binding));
exports.OneWayBinding = OneWayBinding;
var TwoWayBinding = (function (_super) {
    __extends(TwoWayBinding, _super);
    function TwoWayBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.domEvents = []; //add events to this list to bind to them
        _this.dontUpdate = false;
        //update the node
        _this.run();
        _this.bindEvents();
        return _this;
    }
    /** this is called when the dom changes */
    TwoWayBinding.prototype.change = function (event) {
        this.dontUpdate = true; //dont update (call this.run) the node
    };
    TwoWayBinding.prototype.dependencyChange = function () {
        if (!this.dontUpdate) {
            _super.prototype.dependencyChange.call(this);
        }
        this.dontUpdate = false;
    };
    TwoWayBinding.prototype.unbind = function () {
        _super.prototype.unbind.call(this);
        this.unbindEvents();
    };
    TwoWayBinding.prototype.updateEvents = function () {
        this.unbindEvents();
        this.bindEvents();
    };
    TwoWayBinding.prototype.bindEvents = function () {
        for (var i = 0; i < this.domEvents.length; i++) {
            this.node.addEventListener(this.domEvents[i], this.change.bind(this));
        }
    };
    TwoWayBinding.prototype.unbindEvents = function () {
        for (var i = 0; i < this.domEvents.length; i++) {
            this.node.removeEventListener(this.domEvents[i], this.change.bind(this));
        }
    };
    return TwoWayBinding;
}(OneWayBinding));
exports.TwoWayBinding = TwoWayBinding;
var EventBinding = (function (_super) {
    __extends(EventBinding, _super);
    function EventBinding(node, expression) {
        var _this = _super.call(this) || this;
        _this.node = node;
        _this.domEvents = [];
        _this.expression = new Expression_1.default(node, expression, _this.scope);
        _this.bindEvents();
        return _this;
    }
    EventBinding.prototype.change = function (event) {
        this.expression.run();
        if (this.expression.value instanceof Function && this.scope) {
            //run it on the scope
            this.expression.value.call(this.scope.object, event);
        }
    };
    EventBinding.prototype.unbind = function () {
        _super.prototype.unbind.call(this);
        this.unbindEvents();
    };
    EventBinding.prototype.updateEvents = function () {
        this.unbindEvents();
        this.bindEvents();
    };
    EventBinding.prototype.bindEvents = function () {
        for (var i = 0; i < this.domEvents.length; i++) {
            this.node.addEventListener(this.domEvents[i], this.change.bind(this));
        }
    };
    EventBinding.prototype.unbindEvents = function () {
        for (var i = 0; i < this.domEvents.length; i++) {
            this.node.removeEventListener(this.domEvents[i], this.change.bind(this));
        }
    };
    return EventBinding;
}(Binding));
exports.EventBinding = EventBinding;
var InlineBinding = (function (_super) {
    __extends(InlineBinding, _super);
    function InlineBinding(node) {
        var _this = _super.call(this) || this;
        _this.node = node;
        _this.dependencies = []; //a list of scopes and values this bindings uses
        _this.updateDependenciesOnChange = false;
        _this.expression = new Expression_1.default(node, node.nodeValue, _this.scope);
        _this.updateDependencies();
        _this.run();
        return _this;
    }
    Object.defineProperty(InlineBinding.prototype, "scope", {
        get: function () {
            return this.node.__scope__;
        },
        enumerable: true,
        configurable: true
    });
    InlineBinding.prototype.dependencyChange = function () {
        if (this.updateDependenciesOnChange) {
            this.updateDependencies();
        }
        this.run();
    };
    InlineBinding.prototype.run = function () {
        this.expression.run();
        this.node.nodeValue = this.expression.value;
        if (this.dependencies.length == 0 && !this.expression.success) {
            this.dependencies.push(this.scope);
            this.bindDependencies();
            this.updateDependenciesOnChange = true; //when dependecies change update them
        }
    };
    InlineBinding.prototype.unbind = function () {
        this.unbindDependencies();
    };
    InlineBinding.prototype.getDependencies = function (refresh) {
        if (refresh === void 0) { refresh = false; }
        if (refresh || this.dependencies == undefined) {
            //get dependencies
            this.dependencies = this.expression.getDependencies().requires;
        }
        return this.dependencies;
    };
    InlineBinding.prototype.updateDependencies = function () {
        this.unbindDependencies();
        this.getDependencies(true);
        this.bindDependencies();
    };
    InlineBinding.prototype.bindDependencies = function () {
        for (var i = 0; i < this.dependencies.length; i++) {
            this.dependencies[i].on('change', this.dependencyChange.bind(this));
        }
    };
    InlineBinding.prototype.unbindDependencies = function () {
        for (var i = 0; i < this.dependencies.length; i++) {
            this.dependencies[i].off('change', this.dependencyChange.bind(this));
        }
    };
    return InlineBinding;
}(Binding));
exports.InlineBinding = InlineBinding;
var Expression_1 = __webpack_require__(7);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function setAttr(el, attr, value) {
    if (value != null)
        el.setAttribute(attr, value);
    else
        el.removeAttribute(attr);
}
exports.setAttr = setAttr;
function loadJSON(url, cb, defaultObject) {
    var func = loadJSON;
    func.callbacks = func.callbacks || {};
    func.cache = func.cache || {};
    func.loading = func.loading || {};
    if (!func.cache[url]) {
        func.cache[url] = defaultObject || {};
        this.getJSON(url, 'GET', function (json) {
            func.cache[url].__proto__ = json.__proto__;
            if (json instanceof Array) {
                for (var i = 0; i < json.length; i++) {
                    func.cache[url].push(json[i]);
                }
                ;
            }
            else {
                for (var i in json) {
                    if (json[i] != null)
                        func.cache[url][i] = json[i];
                }
            }
            if (cb)
                cb(json);
            if (func.callbacks[url]) {
                for (var i = 0; i < func.callbacks[url].length; i++) {
                    func.callbacks[url][i](json);
                }
                ;
            }
        }, function (err) {
            if (cb)
                cb(false);
            if (func.callbacks[url]) {
                for (var i = 0; i < func.callbacks[url].length; i++) {
                    func.callbacks[url][i](false);
                }
                ;
            }
        });
    }
    else if (func.loading[url]) {
        func.callbacks[url] = func.callbacks[url] || [];
        func.callbacks[url].push(cb);
    }
    else {
        if (cb)
            cb(func.cache[url]);
    }
    return func.cache[url];
}
exports.loadJSON = loadJSON;
function getJSON(url, mode, resolve, reject) {
    if (mode === void 0) { mode = 'GET'; }
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function () {
        var json;
        try {
            json = JSON.parse(xhttp.responseText);
            resolve && resolve(json);
        }
        catch (e) {
            reject && reject(e);
        }
    };
    xhttp.open(mode.toUpperCase(), url, true);
    xhttp.send();
}
exports.getJSON = getJSON;
function extend(obj, obj2) {
    obj = obj || {};
    obj2 = obj2 || {};
    for (var i in obj2) {
        obj[i] = obj2[i];
    }
    return obj;
}
exports.extend = extend;
function noop() { }
exports.noop = noop;
function clone(obj) {
    if (typeof obj == 'object') {
        return JSON.parse(JSON.stringify(obj));
    }
}
exports.clone = clone;
function extendNew(o1, o2, o3, o4) {
    if (o1 === void 0) { o1 = {}; }
    if (o2 === void 0) { o2 = {}; }
    if (o3 === void 0) { o3 = {}; }
    if (o4 === void 0) { o4 = {}; }
    var o = {};
    for (var i in arguments) {
        this.extend(o, arguments[i]);
    }
    return o;
}
exports.extendNew = extendNew;
function duplicateObject(obj2, count) {
    if (count === void 0) { count = 20; }
    if (obj2 instanceof Object && obj2 !== null) {
        // count = (count !== undefined)? count : 20;
        var obj = {};
        if (count > 0) {
            // see if its an array
            if (obj2.hasOwnProperty('length')) {
                obj = new Array(0);
                for (var i = 0; i < obj2.length; i++) {
                    if (typeof obj2[i] !== 'object') {
                        obj[i] = obj2[i];
                    }
                    else {
                        obj[i] = this.duplicateObject(obj2[i], count - 1);
                    }
                }
                ;
            }
            else {
                for (var k in obj2) {
                    if (!(obj2[k] instanceof Object)) {
                        obj[k] = obj2[k];
                    }
                    else {
                        obj[k] = this.duplicateObject(obj2[k], count - 1);
                    }
                }
            }
        }
        return obj;
    }
    else {
        return obj2;
    }
}
exports.duplicateObject = duplicateObject;
function getBinding(type) {
    var binding;
    for (var i in bindingTypes) {
        if (bindingTypes[i].id == type) {
            return bindingTypes[i];
        }
    }
    return binding;
}
exports.getBinding = getBinding;
function createBinding(type, node, expression) {
    if (!(type instanceof Array)) {
        type = [type];
    }
    var binding;
    var id = type[0];
    type.splice(0, 1); //remove first entry
    var data = type.join('-');
    for (var i in bindingTypes) {
        if (bindingTypes[i].id == id) {
            binding = new bindingTypes[i](node, expression, data);
            break;
        }
    }
    return binding;
}
exports.createBinding = createBinding;
var bindingTypes = __webpack_require__(8);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmiter_1 = __webpack_require__(4);
__webpack_require__(5);
var Scope = (function (_super) {
    __extends(Scope, _super);
    function Scope(key, object, modal, parent) {
        if (parent === void 0) { parent = undefined; }
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.object = object;
        _this.modal = modal;
        _this.parent = parent;
        _this.values = (object instanceof Array) ? [] : {};
        _this.setKeys(_this.object);
        //watch for changes
        _this.observer = _this.objectChange.bind(_this);
        Object.observe(_this.object, _this.observer);
        return _this;
    }
    Scope.prototype.dispose = function () {
        Object.unobserve(this.object, this.observer);
    };
    Scope.prototype.getKey = function (value) {
        for (var i in this.values) {
            if (this.values[i].value == value) {
                return i;
            }
        }
        ;
    };
    Scope.prototype.setKey = function (key, value, dontFire) {
        if (dontFire === void 0) { dontFire = false; }
        if (this.values[key] == undefined) {
            //add it
            if (typeof value == 'object') {
                this.values[key] = new Scope(key, value, this.modal, this);
            }
            else {
                this.values[key] = new Value_1.default(key, value, this);
            }
        }
        if (this.values[key] instanceof Value_1.default) {
            this.values[key].setValue(value);
        }
        else if (this.values[key] instanceof Scope) {
            this.values[key].setKeys(value);
        }
        if (!dontFire)
            this.update();
    };
    Scope.prototype.setKeys = function (keys, dontFire) {
        if (dontFire === void 0) { dontFire = false; }
        for (var i in keys) {
            this.setKey(i, keys[i], true);
        }
        ;
        if (!dontFire)
            this.update();
    };
    Scope.prototype.removeKey = function (key, dontFire) {
        if (dontFire === void 0) { dontFire = false; }
        this.values[key].dispose();
        delete this.values[key];
        if (!dontFire)
            this.emit('change', this);
    };
    Scope.prototype.updateKey = function (key, value) {
        this.object[key] = value;
    };
    Scope.prototype.updateKeys = function (keys) {
        for (var i in keys) {
            this.updateKey(i, keys[i]);
        }
    };
    Scope.prototype.update = function () {
        this.emit('change', this.object);
    };
    Scope.prototype.objectChange = function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].name == '_bindings')
                continue;
            switch (data[i].type) {
                case 'add':
                    this.setKey(data[i].name, data[i].object[data[i].name], true);
                    this.update();
                    break;
                case 'update':
                    this.setKey(data[i].name, data[i].object[data[i].name], true);
                    break;
                case 'delete':
                    this.removeKey(data[i].name, true);
                    this.update();
                    break;
            }
        }
        // this.update(); dont update at end, only update if a key is delete/added
    };
    Scope.prototype.emit = function (event, data, direction) {
        if (data === void 0) { data = undefined; }
        if (direction === void 0) { direction = ''; }
        _super.prototype.emit.call(this, event, data);
        switch (direction) {
            case 'down':
                for (var i in this.values) {
                    if (this.values[i] instanceof Scope) {
                        this.values[i].emit(event, data, direction);
                    }
                    else {
                        this.values[i].emit(event, data);
                    }
                }
                break;
            case 'up':
                if (this.parent) {
                    this.parent.emit(event, data, direction);
                }
                break;
        }
    };
    return Scope;
}(EventEmiter_1.default));
exports.default = Scope;
var Value_1 = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmiter_1 = __webpack_require__(4);
var Value = (function (_super) {
    __extends(Value, _super);
    function Value(key, value, parent) {
        if (key === void 0) { key = ''; }
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.value = value;
        _this.parent = parent;
        return _this;
    }
    Value.prototype.dispose = function () {
    };
    Value.prototype.setValue = function (value) {
        this.value = value;
        this.update();
        return this.value;
    };
    Value.prototype.updateValue = function (value) {
        this.parent.updateKey(this.key, value);
    };
    /**
     * fires the change evnet
     */
    Value.prototype.update = function () {
        this.emit('change', this.value);
    };
    return Value;
}(EventEmiter_1.default));
exports.default = Value;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventEmiter = (function () {
    /**
        @constructs EventEmiter
    */
    function EventEmiter() {
        /**
            an array of event listeners\
            @member
            @private
            @type {Object[]}
        */
        this.events = {};
    }
    /**
        binds a listener to an event
        @public
        @param {string} event
        @param {function} listener
        @param {Object} [ctx] - the object to run the call back on
    */
    EventEmiter.prototype.on = function (event, fn, ctx) {
        if (ctx === void 0) { ctx = undefined; }
        if (!this.events[event]) {
            this.events[event] = [];
        }
        if (ctx)
            fn = fn.bind(ctx);
        this.events[event].push(fn);
    };
    /**
        unbinds a listener from an event
        @public
        @param {string} event
        @param {function} listener
    */
    EventEmiter.prototype.off = function (event, fn) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        if (this.events[event].indexOf(fn) !== -1) {
            this.events[event].splice(this.events[event].indexOf(fn), 1);
        }
    };
    /**
        binds a listener that is only called once to an event
        @public
        @param {string} event
        @param {function} listener
        @param {Object} [ctx] - the object to run the call back on
    */
    EventEmiter.prototype.once = function (event, fn, ctx) {
        if (ctx === void 0) { ctx = undefined; }
        this.on(event, function (event, _this) {
            if (fn)
                fn();
            this.off(event, _this);
        }.bind(this), ctx);
    };
    /**
        fires an event
        @public
        @param {string} event
        @param {*} [data]
    */
    EventEmiter.prototype.emit = function (event, data) {
        if (data === void 0) { data = undefined; }
        if (!this.events[event]) {
            this.events[event] = [];
        }
        for (var i = 0; i < this.events[event].length; i++) {
            this.events[event][i](data);
        }
        ;
    };
    return EventEmiter;
}());
exports.default = EventEmiter;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*!
 * Object.observe polyfill - v0.2.4
 * by Massimo Artizzu (MaxArt2501)
 *
 * https://github.com/MaxArt2501/object-observe
 *
 * Licensed under the MIT License
 * See LICENSE for details
 */

// Some type definitions
/**
 * This represents the data relative to an observed object
 * @typedef  {Object}                     ObjectData
 * @property {Map<Handler, HandlerData>}  handlers
 * @property {String[]}                   properties
 * @property {*[]}                        values
 * @property {Descriptor[]}               descriptors
 * @property {Notifier}                   notifier
 * @property {Boolean}                    frozen
 * @property {Boolean}                    extensible
 * @property {Object}                     proto
 */
/**
 * Function definition of a handler
 * @callback Handler
 * @param {ChangeRecord[]}                changes
*/
/**
 * This represents the data relative to an observed object and one of its
 * handlers
 * @typedef  {Object}                     HandlerData
 * @property {Map<Object, ObservedData>}  observed
 * @property {ChangeRecord[]}             changeRecords
 */
/**
 * @typedef  {Object}                     ObservedData
 * @property {String[]}                   acceptList
 * @property {ObjectData}                 data
*/
/**
 * Type definition for a change. Any other property can be added using
 * the notify() or performChange() methods of the notifier.
 * @typedef  {Object}                     ChangeRecord
 * @property {String}                     type
 * @property {Object}                     object
 * @property {String}                     [name]
 * @property {*}                          [oldValue]
 * @property {Number}                     [index]
 */
/**
 * Type definition for a notifier (what Object.getNotifier returns)
 * @typedef  {Object}                     Notifier
 * @property {Function}                   notify
 * @property {Function}                   performChange
 */
/**
 * Function called with Notifier.performChange. It may optionally return a
 * ChangeRecord that gets automatically notified, but `type` and `object`
 * properties are overridden.
 * @callback Performer
 * @returns {ChangeRecord|undefined}
 */

Object.observe || (function(O, A, root, _undefined) {
    "use strict";

        /**
         * Relates observed objects and their data
         * @type {Map<Object, ObjectData}
         */
    var observed,
        /**
         * List of handlers and their data
         * @type {Map<Handler, Map<Object, HandlerData>>}
         */
        handlers,

        defaultAcceptList = [ "add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions" ];

    // Functions for internal usage

        /**
         * Checks if the argument is an Array object. Polyfills Array.isArray.
         * @function isArray
         * @param {?*} object
         * @returns {Boolean}
         */
    var isArray = A.isArray || (function(toString) {
            return function (object) { return toString.call(object) === "[object Array]"; };
        })(O.prototype.toString),

        /**
         * Returns the index of an item in a collection, or -1 if not found.
         * Uses the generic Array.indexOf or Array.prototype.indexOf if available.
         * @function inArray
         * @param {Array} array
         * @param {*} pivot           Item to look for
         * @param {Number} [start=0]  Index to start from
         * @returns {Number}
         */
        inArray = A.prototype.indexOf ? A.indexOf || function(array, pivot, start) {
            return A.prototype.indexOf.call(array, pivot, start);
        } : function(array, pivot, start) {
            for (var i = start || 0; i < array.length; i++)
                if (array[i] === pivot)
                    return i;
            return -1;
        },

        /**
         * Returns an instance of Map, or a Map-like object is Map is not
         * supported or doesn't support forEach()
         * @function createMap
         * @returns {Map}
         */
        createMap = root.Map === _undefined || !Map.prototype.forEach ? function() {
            // Lightweight shim of Map. Lacks clear(), entries(), keys() and
            // values() (the last 3 not supported by IE11, so can't use them),
            // it doesn't handle the constructor's argument (like IE11) and of
            // course it doesn't support for...of.
            // Chrome 31-35 and Firefox 13-24 have a basic support of Map, but
            // they lack forEach(), so their native implementation is bad for
            // this polyfill. (Chrome 36+ supports Object.observe.)
            var keys = [], values = [];

            return {
                size: 0,
                has: function(key) { return inArray(keys, key) > -1; },
                get: function(key) { return values[inArray(keys, key)]; },
                set: function(key, value) {
                    var i = inArray(keys, key);
                    if (i === -1) {
                        keys.push(key);
                        values.push(value);
                        this.size++;
                    } else values[i] = value;
                },
                "delete": function(key) {
                    var i = inArray(keys, key);
                    if (i > -1) {
                        keys.splice(i, 1);
                        values.splice(i, 1);
                        this.size--;
                    }
                },
                forEach: function(callback/*, thisObj*/) {
                    for (var i = 0; i < keys.length; i++)
                        callback.call(arguments[1], values[i], keys[i], this);
                }
            };
        } : function() { return new Map(); },

        /**
         * Simple shim for Object.getOwnPropertyNames when is not available
         * Misses checks on object, don't use as a replacement of Object.keys/getOwnPropertyNames
         * @function getProps
         * @param {Object} object
         * @returns {String[]}
         */
        getProps = O.getOwnPropertyNames ? (function() {
            var func = O.getOwnPropertyNames;
            try {
                arguments.callee;
            } catch (e) {
                // Strict mode is supported

                // In strict mode, we can't access to "arguments", "caller" and
                // "callee" properties of functions. Object.getOwnPropertyNames
                // returns [ "prototype", "length", "name" ] in Firefox; it returns
                // "caller" and "arguments" too in Chrome and in Internet
                // Explorer, so those values must be filtered.
                var avoid = (func(inArray).join(" ") + " ").replace(/prototype |length |name /g, "").slice(0, -1).split(" ");
                if (avoid.length) func = function(object) {
                    var props = O.getOwnPropertyNames(object);
                    if (typeof object === "function")
                        for (var i = 0, j; i < avoid.length;)
                            if ((j = inArray(props, avoid[i++])) > -1)
                                props.splice(j, 1);

                    return props;
                };
            }
            return func;
        })() : function(object) {
            // Poor-mouth version with for...in (IE8-)
            var props = [], prop, hop;
            if ("hasOwnProperty" in object) {
                for (prop in object)
                    if (object.hasOwnProperty(prop))
                        props.push(prop);
            } else {
                hop = O.hasOwnProperty;
                for (prop in object)
                    if (hop.call(object, prop))
                        props.push(prop);
            }

            // Inserting a common non-enumerable property of arrays
            if (isArray(object))
                props.push("length");

            return props;
        },

        /**
         * Return the prototype of the object... if defined.
         * @function getPrototype
         * @param {Object} object
         * @returns {Object}
         */
        getPrototype = O.getPrototypeOf,

        /**
         * Return the descriptor of the object... if defined.
         * IE8 supports a (useless) Object.getOwnPropertyDescriptor for DOM
         * nodes only, so defineProperties is checked instead.
         * @function getDescriptor
         * @param {Object} object
         * @param {String} property
         * @returns {Descriptor}
         */
        getDescriptor = O.defineProperties && O.getOwnPropertyDescriptor,

        /**
         * Sets up the next check and delivering iteration, using
         * requestAnimationFrame or a (close) polyfill.
         * @function nextFrame
         * @param {function} func
         * @returns {number}
         */
        nextFrame = root.requestAnimationFrame || root.webkitRequestAnimationFrame || (function() {
            var initial = +new Date,
                last = initial;
            return function(func) {
                return setTimeout(function() {
                    func((last = +new Date) - initial);
                }, 17);
            };
        })(),

        /**
         * Sets up the observation of an object
         * @function doObserve
         * @param {Object} object
         * @param {Handler} handler
         * @param {String[]} [acceptList]
         */
        doObserve = function(object, handler, acceptList) {
            var data = observed.get(object);

            if (data) {
                performPropertyChecks(data, object);
                setHandler(object, data, handler, acceptList);
            } else {
                data = createObjectData(object);
                setHandler(object, data, handler, acceptList);

                if (observed.size === 1)
                    // Let the observation begin!
                    nextFrame(runGlobalLoop);
            }
        },

        /**
         * Creates the initial data for an observed object
         * @function createObjectData
         * @param {Object} object
         */
        createObjectData = function(object, data) {
            var props = getProps(object),
                values = [], descs, i = 0,
                data = {
                    handlers: createMap(),
                    frozen: O.isFrozen ? O.isFrozen(object) : false,
                    extensible: O.isExtensible ? O.isExtensible(object) : true,
                    proto: getPrototype && getPrototype(object),
                    properties: props,
                    values: values,
                    notifier: retrieveNotifier(object, data)
                };

            if (getDescriptor) {
                descs = data.descriptors = [];
                while (i < props.length) {
                    descs[i] = getDescriptor(object, props[i]);
                    values[i] = object[props[i++]];
                }
            } else while (i < props.length)
                values[i] = object[props[i++]];

            observed.set(object, data);

            return data;
        },

        /**
         * Performs basic property value change checks on an observed object
         * @function performPropertyChecks
         * @param {ObjectData} data
         * @param {Object} object
         * @param {String} [except]  Doesn't deliver the changes to the
         *                           handlers that accept this type
         */
        performPropertyChecks = (function() {
            var updateCheck = getDescriptor ? function(object, data, idx, except, descr) {
                var key = data.properties[idx],
                    value = object[key],
                    ovalue = data.values[idx],
                    odesc = data.descriptors[idx];

                if ("value" in descr && (ovalue === value
                        ? ovalue === 0 && 1/ovalue !== 1/value
                        : ovalue === ovalue || value === value)) {
                    addChangeRecord(object, data, {
                        name: key,
                        type: "update",
                        object: object,
                        oldValue: ovalue
                    }, except);
                    data.values[idx] = value;
                }
                if (odesc.configurable && (!descr.configurable
                        || descr.writable !== odesc.writable
                        || descr.enumerable !== odesc.enumerable
                        || descr.get !== odesc.get
                        || descr.set !== odesc.set)) {
                    addChangeRecord(object, data, {
                        name: key,
                        type: "reconfigure",
                        object: object,
                        oldValue: ovalue
                    }, except);
                    data.descriptors[idx] = descr;
                }
            } : function(object, data, idx, except) {
                var key = data.properties[idx],
                    value = object[key],
                    ovalue = data.values[idx];

                if (ovalue === value ? ovalue === 0 && 1/ovalue !== 1/value
                        : ovalue === ovalue || value === value) {
                    addChangeRecord(object, data, {
                        name: key,
                        type: "update",
                        object: object,
                        oldValue: ovalue
                    }, except);
                    data.values[idx] = value;
                }
            };

            // Checks if some property has been deleted
            var deletionCheck = getDescriptor ? function(object, props, proplen, data, except) {
                var i = props.length, descr;
                while (proplen && i--) {
                    if (props[i] !== null) {
                        descr = getDescriptor(object, props[i]);
                        proplen--;

                        // If there's no descriptor, the property has really
                        // been deleted; otherwise, it's been reconfigured so
                        // that's not enumerable anymore
                        if (descr) updateCheck(object, data, i, except, descr);
                        else {
                            addChangeRecord(object, data, {
                                name: props[i],
                                type: "delete",
                                object: object,
                                oldValue: data.values[i]
                            }, except);
                            data.properties.splice(i, 1);
                            data.values.splice(i, 1);
                            data.descriptors.splice(i, 1);
                        }
                    }
                }
            } : function(object, props, proplen, data, except) {
                var i = props.length;
                while (proplen && i--)
                    if (props[i] !== null) {
                        addChangeRecord(object, data, {
                            name: props[i],
                            type: "delete",
                            object: object,
                            oldValue: data.values[i]
                        }, except);
                        data.properties.splice(i, 1);
                        data.values.splice(i, 1);
                        proplen--;
                    }
            };

            return function(data, object, except) {
                if (!data.handlers.size || data.frozen) return;

                var props, proplen, keys,
                    values = data.values,
                    descs = data.descriptors,
                    i = 0, idx,
                    key, value,
                    proto, descr;

                // If the object isn't extensible, we don't need to check for new
                // or deleted properties
                if (data.extensible) {

                    props = data.properties.slice();
                    proplen = props.length;
                    keys = getProps(object);

                    if (descs) {
                        while (i < keys.length) {
                            key = keys[i++];
                            idx = inArray(props, key);
                            descr = getDescriptor(object, key);

                            if (idx === -1) {
                                addChangeRecord(object, data, {
                                    name: key,
                                    type: "add",
                                    object: object
                                }, except);
                                data.properties.push(key);
                                values.push(object[key]);
                                descs.push(descr);
                            } else {
                                props[idx] = null;
                                proplen--;
                                updateCheck(object, data, idx, except, descr);
                            }
                        }
                        deletionCheck(object, props, proplen, data, except);

                        if (!O.isExtensible(object)) {
                            data.extensible = false;
                            addChangeRecord(object, data, {
                                type: "preventExtensions",
                                object: object
                            }, except);

                            data.frozen = O.isFrozen(object);
                        }
                    } else {
                        while (i < keys.length) {
                            key = keys[i++];
                            idx = inArray(props, key);
                            value = object[key];

                            if (idx === -1) {
                                addChangeRecord(object, data, {
                                    name: key,
                                    type: "add",
                                    object: object
                                }, except);
                                data.properties.push(key);
                                values.push(value);
                            } else {
                                props[idx] = null;
                                proplen--;
                                updateCheck(object, data, idx, except);
                            }
                        }
                        deletionCheck(object, props, proplen, data, except);
                    }

                } else if (!data.frozen) {

                    // If the object is not extensible, but not frozen, we just have
                    // to check for value changes
                    for (; i < props.length; i++) {
                        key = props[i];
                        updateCheck(object, data, i, except, getDescriptor(object, key));
                    }

                    if (O.isFrozen(object))
                        data.frozen = true;
                }

                if (getPrototype) {
                    proto = getPrototype(object);
                    if (proto !== data.proto) {
                        addChangeRecord(object, data, {
                            type: "setPrototype",
                            name: "__proto__",
                            object: object,
                            oldValue: data.proto
                        });
                        data.proto = proto;
                    }
                }
            };
        })(),

        /**
         * Sets up the main loop for object observation and change notification
         * It stops if no object is observed.
         * @function runGlobalLoop
         */
        runGlobalLoop = function() {
            if (observed.size) {
                observed.forEach(performPropertyChecks);
                handlers.forEach(deliverHandlerRecords);
                nextFrame(runGlobalLoop);
            }
        },

        /**
         * Deliver the change records relative to a certain handler, and resets
         * the record list.
         * @param {HandlerData} hdata
         * @param {Handler} handler
         */
        deliverHandlerRecords = function(hdata, handler) {
            var records = hdata.changeRecords;
            if (records.length) {
                hdata.changeRecords = [];
                handler(records);
            }
        },

        /**
         * Returns the notifier for an object - whether it's observed or not
         * @function retrieveNotifier
         * @param {Object} object
         * @param {ObjectData} [data]
         * @returns {Notifier}
         */
        retrieveNotifier = function(object, data) {
            if (arguments.length < 2)
                data = observed.get(object);

            /** @type {Notifier} */
            return data && data.notifier || {
                /**
                 * @method notify
                 * @see http://arv.github.io/ecmascript-object-observe/#notifierprototype._notify
                 * @memberof Notifier
                 * @param {ChangeRecord} changeRecord
                 */
                notify: function(changeRecord) {
                    changeRecord.type; // Just to check the property is there...

                    // If there's no data, the object has been unobserved
                    var data = observed.get(object);
                    if (data) {
                        var recordCopy = { object: object }, prop;
                        for (prop in changeRecord)
                            if (prop !== "object")
                                recordCopy[prop] = changeRecord[prop];
                        addChangeRecord(object, data, recordCopy);
                    }
                },

                /**
                 * @method performChange
                 * @see http://arv.github.io/ecmascript-object-observe/#notifierprototype_.performchange
                 * @memberof Notifier
                 * @param {String} changeType
                 * @param {Performer} func     The task performer
                 * @param {*} [thisObj]        Used to set `this` when calling func
                 */
                performChange: function(changeType, func/*, thisObj*/) {
                    if (typeof changeType !== "string")
                        throw new TypeError("Invalid non-string changeType");

                    if (typeof func !== "function")
                        throw new TypeError("Cannot perform non-function");

                    // If there's no data, the object has been unobserved
                    var data = observed.get(object),
                        prop, changeRecord,
                        thisObj = arguments[2],
                        result = thisObj === _undefined ? func() : func.call(thisObj);

                    data && performPropertyChecks(data, object, changeType);

                    // If there's no data, the object has been unobserved
                    if (data && result && typeof result === "object") {
                        changeRecord = { object: object, type: changeType };
                        for (prop in result)
                            if (prop !== "object" && prop !== "type")
                                changeRecord[prop] = result[prop];
                        addChangeRecord(object, data, changeRecord);
                    }
                }
            };
        },

        /**
         * Register (or redefines) an handler in the collection for a given
         * object and a given type accept list.
         * @function setHandler
         * @param {Object} object
         * @param {ObjectData} data
         * @param {Handler} handler
         * @param {String[]} acceptList
         */
        setHandler = function(object, data, handler, acceptList) {
            var hdata = handlers.get(handler);
            if (!hdata)
                handlers.set(handler, hdata = {
                    observed: createMap(),
                    changeRecords: []
                });
            hdata.observed.set(object, {
                acceptList: acceptList.slice(),
                data: data
            });
            data.handlers.set(handler, hdata);
        },

        /**
         * Adds a change record in a given ObjectData
         * @function addChangeRecord
         * @param {Object} object
         * @param {ObjectData} data
         * @param {ChangeRecord} changeRecord
         * @param {String} [except]
         */
        addChangeRecord = function(object, data, changeRecord, except) {
            data.handlers.forEach(function(hdata) {
                var acceptList = hdata.observed.get(object).acceptList;
                // If except is defined, Notifier.performChange has been
                // called, with except as the type.
                // All the handlers that accepts that type are skipped.
                if ((typeof except !== "string"
                        || inArray(acceptList, except) === -1)
                        && inArray(acceptList, changeRecord.type) > -1)
                    hdata.changeRecords.push(changeRecord);
            });
        };

    observed = createMap();
    handlers = createMap();

    /**
     * @function Object.observe
     * @see http://arv.github.io/ecmascript-object-observe/#Object.observe
     * @param {Object} object
     * @param {Handler} handler
     * @param {String[]} [acceptList]
     * @throws {TypeError}
     * @returns {Object}               The observed object
     */
    O.observe = function observe(object, handler, acceptList) {
        if (!object || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.observe cannot observe non-object");

        if (typeof handler !== "function")
            throw new TypeError("Object.observe cannot deliver to non-function");

        if (O.isFrozen && O.isFrozen(handler))
            throw new TypeError("Object.observe cannot deliver to a frozen function object");

        if (acceptList === _undefined)
            acceptList = defaultAcceptList;
        else if (!acceptList || typeof acceptList !== "object")
            throw new TypeError("Third argument to Object.observe must be an array of strings.");

        doObserve(object, handler, acceptList);

        return object;
    };

    /**
     * @function Object.unobserve
     * @see http://arv.github.io/ecmascript-object-observe/#Object.unobserve
     * @param {Object} object
     * @param {Handler} handler
     * @throws {TypeError}
     * @returns {Object}         The given object
     */
    O.unobserve = function unobserve(object, handler) {
        if (object === null || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.unobserve cannot unobserve non-object");

        if (typeof handler !== "function")
            throw new TypeError("Object.unobserve cannot deliver to non-function");

        var hdata = handlers.get(handler), odata;

        if (hdata && (odata = hdata.observed.get(object))) {
            hdata.observed.forEach(function(odata, object) {
                performPropertyChecks(odata.data, object);
            });
            nextFrame(function() {
                deliverHandlerRecords(hdata, handler);
            });

            // In Firefox 13-18, size is a function, but createMap should fall
            // back to the shim for those versions
            if (hdata.observed.size === 1 && hdata.observed.has(object))
                handlers["delete"](handler);
            else hdata.observed["delete"](object);

            if (odata.data.handlers.size === 1)
                observed["delete"](object);
            else odata.data.handlers["delete"](handler);
        }

        return object;
    };

    /**
     * @function Object.getNotifier
     * @see http://arv.github.io/ecmascript-object-observe/#GetNotifier
     * @param {Object} object
     * @throws {TypeError}
     * @returns {Notifier}
     */
    O.getNotifier = function getNotifier(object) {
        if (object === null || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.getNotifier cannot getNotifier non-object");

        if (O.isFrozen && O.isFrozen(object)) return null;

        return retrieveNotifier(object);
    };

    /**
     * @function Object.deliverChangeRecords
     * @see http://arv.github.io/ecmascript-object-observe/#Object.deliverChangeRecords
     * @see http://arv.github.io/ecmascript-object-observe/#DeliverChangeRecords
     * @param {Handler} handler
     * @throws {TypeError}
     */
    O.deliverChangeRecords = function deliverChangeRecords(handler) {
        if (typeof handler !== "function")
            throw new TypeError("Object.deliverChangeRecords cannot deliver to non-function");

        var hdata = handlers.get(handler);
        if (hdata) {
            hdata.observed.forEach(function(odata, object) {
                performPropertyChecks(odata.data, object);
            });
            deliverHandlerRecords(hdata, handler);
        }
    };

})(Object, Array, this);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(5);
var Modal = (function () {
    function Modal(object, options, node) {
        if (options === void 0) { options = {}; }
        if (node === void 0) { node = document.body; }
        this.object = object;
        /** an array of bindings for this modal */
        this.bindings = [];
        this.options = {
            prefix: 'bind',
            inlineDelimiters: ['{', '}'],
            excludedElements: {
                script: true,
                link: true,
                meta: true,
                style: true
            }
        };
        this.scope = new Scope_1.default('', object, this);
        this.node = node;
        for (var i in options) {
            this.options[i] = options[i];
        }
        this.observer = new MutationObserver(this.ElementChange.bind(this));
    }
    Modal.prototype.applyBindings = function (node) {
        if (node === void 0) { node = undefined; }
        //remove old event
        this.observer.disconnect();
        if (node)
            this.node = node;
        this.bindings = this.buildBindings();
        // watch the new node
        this.observer.observe(this.node, {
            childList: true
        });
    };
    /** loop through this.nodes children and create the bindings */
    Modal.prototype.buildBindings = function (node, scope) {
        if (node === void 0) { node = this.node; }
        if (scope === void 0) { scope = node.__scope__ || this.scope; }
        var bindingsCreated = [];
        if (node.nodeName.toLowerCase() in this.options.excludedElements)
            return;
        //remove old bindings
        if (node.__bindings__) {
            for (var i = 0; i < node.__bindings__.length; i++) {
                node.__bindings__[i].unbind();
            }
            ;
            node.__bindings__ = [];
        }
        //set scope
        node.__scope__ = node.__scope__ || scope;
        if (node.parentNode) {
            node.__addedScope__ = utils_1.extendNew(node.parentNode.__addedScope__ || {}, node.__addedScope__ || {});
        }
        bindingsCreated = bindingsCreated.concat(this.createBindings(node)); //createBindings handles setting __bindings__
        //if node was a text node then it will not have any children even though createInlineBindings splits it into mutiple textNodes
        //loop through and bind children
        for (var i = 0; i < node.childNodes.length; i++) {
            var childNode = node.childNodes[i];
            if (childNode.nodeName.toLowerCase() in this.options.excludedElements)
                continue;
            bindingsCreated = bindingsCreated.concat(this.buildBindings(childNode, childNode.__scope__ || scope));
        }
        ;
        return bindingsCreated;
    };
    Modal.prototype.createBindings = function (node) {
        var bindingsCreated = [];
        switch (node.nodeType) {
            case node.ELEMENT_NODE:
                bindingsCreated = this.createAttrBindings(node);
                break;
            case node.TEXT_NODE:
                bindingsCreated = this.createInlineBindings(node);
                break;
        }
        return bindingsCreated;
    };
    Modal.prototype.createAttrBindings = function (node) {
        var bindingsCreated = [];
        var attrs = node.attributes;
        var types = [];
        //find the bindings
        for (var i = 0; i < attrs.length; i++) {
            var attr = attrs.item(i);
            var _types = attr.name.split('-');
            if (_types[0] == this.options.prefix) {
                _types.splice(0, 1); //remove the prefix
                var fn = utils_1.getBinding(_types[0]);
                if (fn) {
                    types.push({
                        types: _types,
                        attr: attr,
                        constructor: fn
                    });
                }
                else {
                    console.error('cant find binding: ' + attr.name);
                }
            }
        }
        ;
        //sort by priority
        types.sort(function (a, b) {
            if (a.constructor.priority < b.constructor.priority) {
                return 1;
            }
            else if (a.constructor.priority > b.constructor.priority) {
                return -1;
            }
            else {
                return 0;
            }
        });
        //create the bindings
        for (var i = 0; i < types.length; i++) {
            var t = types[i];
            try {
                bindingsCreated.push(utils_1.createBinding(t.types, node, t.attr.value));
            }
            catch (e) {
                console.error('failed to create binding: ' + t.attr.name);
                console.error(e);
            }
        }
        node.__bindings__ = bindingsCreated;
        return bindingsCreated;
    };
    Modal.prototype.createInlineBindings = function (node) {
        var bindingsCreated = [];
        var tokens = this.parseInlineBindings(node.nodeValue, this.options.inlineDelimiters);
        if (!(tokens.length === 1 && tokens[0].type === 'text')) {
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                var textNode = document.createTextNode(token.value);
                //copy scopes
                // textNode.__bindings__ = clone(node.__bindings__); dont clone the bindings array because no two nodes should have the same bindigns
                textNode.__bindings__ = [];
                textNode.__scope__ = node.__scope__;
                textNode.__addedScope__ = utils_1.clone(node.__addedScope__);
                node.parentNode.insertBefore(textNode, node);
                if (token.type === 'binding') {
                    var b = new Binding_1.InlineBinding(textNode);
                    textNode.__bindings__ = [b];
                    bindingsCreated.push(b);
                }
            }
            node.parentNode.removeChild(node);
        }
        return bindingsCreated;
    };
    Modal.prototype.parseInlineBindings = function (template, delimiters) {
        var index = 0, lastIndex = 0, lastToken, length = template.length, substring, tokens = [], value;
        while (lastIndex < length) {
            index = template.indexOf(delimiters[0], lastIndex);
            if (index < 0) {
                tokens.push({
                    type: 'text',
                    value: template.slice(lastIndex)
                });
                break;
            }
            else {
                if (index > 0 && lastIndex < index) {
                    tokens.push({
                        type: 'text',
                        value: template.slice(lastIndex, index)
                    });
                }
                lastIndex = index + delimiters[0].length;
                index = template.indexOf(delimiters[1], lastIndex);
                if (index < 0) {
                    substring = template.slice(lastIndex - delimiters[1].length);
                    lastToken = tokens[tokens.length - 1];
                    if ((lastToken != null ? lastToken.type : void 0) === 'text') {
                        lastToken.value += substring;
                    }
                    else {
                        tokens.push({
                            type: 'text',
                            value: substring
                        });
                    }
                    break;
                }
                value = template.slice(lastIndex, index).trim();
                tokens.push({
                    type: 'binding',
                    value: value
                });
                lastIndex = index + delimiters[1].length;
            }
        }
        return tokens;
    };
    Modal.prototype.ElementChange = function (event) {
        event.stopPropagation();
        var el = event.target;
        if (el.nodeType !== 3) {
            this.buildBindings(el);
        }
    };
    return Modal;
}());
exports.default = Modal;
var Scope_1 = __webpack_require__(2);
var Binding_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Expression = (function () {
    /**
        @constructs Expression
        @param {node} node - the node to use for this expression
        @param {string} expression
        @param {Scope} scope
    */
    function Expression(node, expression, scope) {
        this.node = node;
        this.expression = expression;
        this.scope = scope;
        this.success = true;
        this.value = undefined;
        this.dependencies = [];
    }
    /**
        @public
    */
    Expression.prototype.run = function () {
        var data = {
            value: undefined,
            success: true,
            error: undefined
        };
        var variables = {
            $node: this.node
        };
        var funcString = 'new Function("variables","addedScope","', args = [];
        var context = this.buildContext(this.scope).context;
        args.push(variables);
        args.push(this.node.__addedScope__ || {});
        funcString += 'with(this){';
        funcString += 'with(variables){';
        funcString += 'with(addedScope){';
        funcString += 'return ';
        funcString += this.expression;
        funcString += '}';
        funcString += '}';
        funcString += '}';
        funcString += '")';
        var func = eval(funcString);
        try {
            data.value = func.apply(context, args);
        }
        catch (e) {
            data.success = false;
            data.error = e;
        }
        this.value = data.value;
        this.success = data.success;
        return data;
    };
    Expression.prototype.runOnScope = function () {
        var data = {
            value: undefined,
            success: false
        };
        var _data = this.getDependencies();
        data.value = _data.gets[_data.gets.length - 1];
        data.success = !!data.value;
        return data;
    };
    Expression.prototype.getDependencies = function () {
        var data = {
            success: true,
            error: undefined,
            requires: [],
            gets: [],
            sets: []
        };
        var hidden = {
            console: {},
            window: {},
            navigator: {},
            localStorage: {},
            location: {},
            alert: utils_1.noop,
            eval: utils_1.noop
        };
        var variables = {
            $node: this.node
        };
        var funcString = 'new Function("hidden","variables","addedScope",', args = [];
        args.push(hidden);
        args.push(variables);
        args.push(this.node.__addedScope__ || {});
        //build context
        var context = this.buildContext(this.scope, data, true);
        funcString += '"';
        funcString += 'with(this){';
        funcString += 'with(hidden){';
        funcString += 'with(variables){';
        funcString += 'with(addedScope){';
        funcString += 'return ';
        funcString += this.expression;
        funcString += '}';
        funcString += '}';
        funcString += '}';
        funcString += '}';
        funcString += '")';
        var func = eval(funcString);
        try {
            func.apply(context.context, args);
        }
        catch (e) {
            data.success = false;
            data.error = e;
        }
        this.dependencies = data.requires;
        return data;
    };
    Expression.prototype.buildContext = function (scope, requires, dontSet) {
        if (requires === void 0) { requires = { requires: [], gets: [], sets: [] }; }
        if (dontSet === void 0) { dontSet = false; }
        var object = (scope.object instanceof Array) ? [] : {};
        var get = function (scope, object, index, requires) {
            if (requires.gets.indexOf(scope.values[index]) == -1) {
                requires.requires.push(scope.values[index]);
                requires.gets.push(scope.values[index]);
            }
            if (scope.values[index] instanceof Scope_1.default) {
                return this.buildContext(scope.values[index], requires, dontSet).context;
            }
            else if (scope.values[index] instanceof Value_1.default) {
                if (!(scope.values[index].value instanceof Function) || !dontSet) {
                    return scope.values[index].value;
                }
            }
        };
        var set = function (scope, object, index, requires, val) {
            requires.requires.push(scope.values[index]);
            requires.sets.push(scope.values[index]);
            if (!dontSet) {
                scope.object[index] = val;
            }
        };
        for (var i in scope.values) {
            object.__defineGetter__(i, get.bind(this, scope, object, i, requires));
            object.__defineSetter__(i, set.bind(this, scope, object, i, requires));
        }
        ;
        //$parent
        if (scope.parent) {
            object.__defineGetter__('$parent', function (scope, object, requires, dontSet) {
                if (!scope.parent)
                    return;
                if (requires.gets.indexOf(scope.parent) == -1) {
                    requires.requires.push(scope.parent);
                    requires.gets.push(scope.parent);
                }
                return this.buildContext(scope.parent, requires, dontSet).context;
            }.bind(this, scope, object, requires, dontSet));
        }
        else {
            object.$parent = undefined;
        }
        // $Modal
        if (scope.modal) {
            object.__defineGetter__('$modal', function (scope, object, requires, dontSet) {
                if (!scope.modal)
                    return;
                if (requires.gets.indexOf(scope.modal.scope) == -1) {
                    requires.requires.push(scope.modal.scope);
                    requires.gets.push(scope.modal.scope);
                }
                return this.buildContext(scope.modal.scope, requires, dontSet).context;
            }.bind(this, scope, object, requires, dontSet));
        }
        else {
            object.$modal = undefined;
        }
        return {
            context: object,
            requires: requires
        };
    };
    return Expression;
}());
exports.default = Expression;
var Scope_1 = __webpack_require__(2);
var Value_1 = __webpack_require__(3);
var utils_1 = __webpack_require__(1);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var attr_1 = __webpack_require__(9);
exports.attr = attr_1.default;
var class_1 = __webpack_require__(10);
exports.class = class_1.default;
var click_1 = __webpack_require__(11);
exports.click = click_1.default;
var disabled_1 = __webpack_require__(12);
exports.disabled = disabled_1.default;
var enabled_1 = __webpack_require__(13);
exports.enabled = enabled_1.default;
var event_1 = __webpack_require__(14);
exports.event = event_1.default;
var foreach_1 = __webpack_require__(15);
exports.foreach = foreach_1.default;
var hidden_1 = __webpack_require__(16);
exports.hidden = hidden_1.default;
var href_1 = __webpack_require__(17);
exports.href = href_1.default;
var html_1 = __webpack_require__(18);
exports.html = html_1.default;
var if_1 = __webpack_require__(19);
exports.if = if_1.default;
var ifnot_1 = __webpack_require__(20);
exports.ifnot = ifnot_1.default;
var input_1 = __webpack_require__(21);
exports.input = input_1.default;
var repeat_1 = __webpack_require__(22);
exports.repeat = repeat_1.default;
var src_1 = __webpack_require__(23);
exports.src = src_1.default;
var style_1 = __webpack_require__(24);
exports.style = style_1.default;
var submit_1 = __webpack_require__(25);
exports.submit = submit_1.default;
var text_1 = __webpack_require__(26);
exports.text = text_1.default;
var value_1 = __webpack_require__(27);
exports.value = value_1.default;
var visible_1 = __webpack_require__(28);
exports.visible = visible_1.default;
var with_1 = __webpack_require__(29);
exports.with = with_1.default;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var AttrBinding = (function (_super) {
    __extends(AttrBinding, _super);
    function AttrBinding(node, expression, attr) {
        var _this = _super.call(this, node, expression) || this;
        _this.attr = attr;
        _this.run();
        return _this;
    }
    AttrBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        utils_1.setAttr(this.node, this.attr, this.expression.value);
    };
    return AttrBinding;
}(Binding_1.OneWayBinding));
AttrBinding.id = 'attr';
exports.default = AttrBinding;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var ClassBinding = (function (_super) {
    __extends(ClassBinding, _super);
    function ClassBinding(node, expression, bindClass) {
        var _this = _super.call(this, node, expression) || this;
        _this.bindClass = bindClass;
        _this.run();
        return _this;
    }
    ClassBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        if (this.expression.value && !this.hasClass()) {
            this.addClass();
        }
        else if (this.hasClass()) {
            this.removeClass();
        }
    };
    ClassBinding.prototype.addClass = function () {
        this.node.className += ' ' + this.bindClass;
        this.node.className = this.node.className.trim();
    };
    ClassBinding.prototype.removeClass = function () {
        this.node.className = this.node.className.replace(new RegExp('(?:^|\s)' + this.bindClass + '(?!\S)', 'g'), '');
        this.node.className = this.node.className.trim();
    };
    ClassBinding.prototype.hasClass = function () {
        return this.node.className.indexOf(this.bindClass) !== -1;
    };
    return ClassBinding;
}(Binding_1.OneWayBinding));
ClassBinding.id = 'class';
exports.default = ClassBinding;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var ClickBinding = (function (_super) {
    __extends(ClickBinding, _super);
    function ClickBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.domEvents = ['click'];
        _this.updateEvents();
        return _this;
    }
    return ClickBinding;
}(Binding_1.EventBinding));
ClickBinding.id = 'click';
exports.default = ClickBinding;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var DisabledBinding = (function (_super) {
    __extends(DisabledBinding, _super);
    function DisabledBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.run();
        return _this;
    }
    DisabledBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        if (!this.expression.value) {
            this.node.removeAttribute('disabled');
        }
        else {
            this.node.setAttribute('disabled', 'disabled');
        }
    };
    return DisabledBinding;
}(Binding_1.OneWayBinding));
DisabledBinding.id = 'disabled';
exports.default = DisabledBinding;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var EnabledBinding = (function (_super) {
    __extends(EnabledBinding, _super);
    function EnabledBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.run();
        return _this;
    }
    EnabledBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        if (this.expression.value) {
            this.node.removeAttribute('disabled');
        }
        else {
            this.node.setAttribute('disabled', 'disabled');
        }
    };
    return EnabledBinding;
}(Binding_1.OneWayBinding));
EnabledBinding.id = 'enabled';
exports.default = EnabledBinding;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var EventBinding = (function (_super) {
    __extends(EventBinding, _super);
    function EventBinding(node, expression, bindEvent) {
        var _this = _super.call(this, node, expression) || this;
        _this.domEvents = [bindEvent];
        _this.updateEvents();
        return _this;
    }
    return EventBinding;
}(Binding_1.EventBinding));
EventBinding.id = 'event';
exports.default = EventBinding;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var ForEachBinding = (function (_super) {
    __extends(ForEachBinding, _super);
    function ForEachBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.children = [];
        for (var i = 0; i < _this.node.childNodes.length; i++) {
            _this.children.push(_this.node.childNodes[i]);
        }
        _this.removeAllChildren();
        _this.run();
        return _this;
    }
    ForEachBinding.prototype.restoreChildren = function () {
        for (var i in this.children) {
            this.node.appendChild(this.children[i]);
        }
    };
    ForEachBinding.prototype.removeAllChildren = function () {
        while (this.node.childNodes.length !== 0) {
            this.node.removeChild(this.node.childNodes[0]);
        }
    };
    ForEachBinding.prototype.run = function () {
        // super.run(); dont run because we arnt going to use .run on are expression
        var scope = this.expression.runOnScope().value;
        this.removeAllChildren();
        if (scope instanceof Scope_1.default) {
            for (var i = 0; i < scope.values.length; i++) {
                for (var k = 0; k < this.children.length; k++) {
                    var el = this.children[k].cloneNode(true);
                    el.__scope__ = scope.values[i];
                    el.__addedScope__ = utils_1.extend(el.__addedScope__, {
                        $index: i,
                        $isFirst: i == 0,
                        $isLast: i == scope.values.length - 1
                    });
                    this.node.appendChild(el);
                }
                ;
            }
            ;
        }
        else {
            throw new Error('bind-foreach requires a Object or Array');
        }
    };
    ForEachBinding.prototype.unbind = function () {
        this.removeAllChildren();
        _super.prototype.unbind.call(this);
        this.restoreChildren();
    };
    return ForEachBinding;
}(Binding_1.OneWayBinding));
ForEachBinding.id = 'foreach';
ForEachBinding.priority = 3;
exports.default = ForEachBinding;
var utils_1 = __webpack_require__(1);
var Scope_1 = __webpack_require__(2);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var HiddenBinding = (function (_super) {
    __extends(HiddenBinding, _super);
    function HiddenBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.run();
        return _this;
    }
    HiddenBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        if (this.expression.value) {
            this.node.style.display = 'none';
        }
        else {
            this.node.style.display = '';
        }
    };
    return HiddenBinding;
}(Binding_1.OneWayBinding));
HiddenBinding.id = 'hidden';
exports.default = HiddenBinding;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var HrefBinding = (function (_super) {
    __extends(HrefBinding, _super);
    function HrefBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.run();
        return _this;
    }
    HrefBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        utils_1.setAttr(this.node, 'href', this.expression.value);
    };
    return HrefBinding;
}(Binding_1.OneWayBinding));
HrefBinding.id = 'href';
exports.default = HrefBinding;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var HTMLBinding = (function (_super) {
    __extends(HTMLBinding, _super);
    function HTMLBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.oldText = _this.node.textContent;
        _this.run();
        return _this;
    }
    HTMLBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        this.node.innerHTML = this.expression.value;
    };
    HTMLBinding.prototype.unbind = function () {
        _super.prototype.unbind.call(this);
        this.node.textContent = this.oldText;
    };
    return HTMLBinding;
}(Binding_1.OneWayBinding));
HTMLBinding.id = 'html';
exports.default = HTMLBinding;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var IfBinding = (function (_super) {
    __extends(IfBinding, _super);
    function IfBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.children = [];
        for (var i = 0; i < _this.node.children.length; i++) {
            _this.children.push(_this.node.children[i]);
        }
        _this.run();
        return _this;
    }
    IfBinding.prototype.restoreChildren = function () {
        for (var i in this.children) {
            this.node.appendChild(this.children[i]);
        }
    };
    IfBinding.prototype.removeChildren = function () {
        while (this.node.children.length !== 0) {
            this.node.removeChild(this.node.children[0]);
        }
    };
    IfBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        if (this.expression.value) {
            this.restoreChildren();
        }
        else {
            this.removeChildren();
        }
    };
    IfBinding.prototype.unbind = function () {
        _super.prototype.unbind.call(this);
        this.removeChildren();
        this.restoreChildren();
    };
    return IfBinding;
}(Binding_1.OneWayBinding));
IfBinding.id = 'if';
exports.default = IfBinding;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var IfNotBinding = (function (_super) {
    __extends(IfNotBinding, _super);
    function IfNotBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.children = [];
        for (var i = 0; i < _this.node.children.length; i++) {
            _this.children.push(_this.node.children[i]);
        }
        _this.run();
        return _this;
    }
    IfNotBinding.prototype.restoreChildren = function () {
        for (var i in this.children) {
            this.node.appendChild(this.children[i]);
        }
    };
    IfNotBinding.prototype.removeChildren = function () {
        while (this.node.children.length !== 0) {
            this.node.removeChild(this.node.children[0]);
        }
    };
    IfNotBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        if (!this.expression.value) {
            this.restoreChildren();
        }
        else {
            this.removeChildren();
        }
    };
    IfNotBinding.prototype.unbind = function () {
        _super.prototype.unbind.call(this);
        this.removeChildren();
        this.restoreChildren();
    };
    return IfNotBinding;
}(Binding_1.OneWayBinding));
IfNotBinding.id = 'ifnot';
exports.default = IfNotBinding;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var InputBinding = (function (_super) {
    __extends(InputBinding, _super);
    function InputBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.node = node;
        _this.domEvents = ['input'];
        _this.updateEvents();
        return _this;
    }
    InputBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        this.node.value = this.expression.value;
    };
    InputBinding.prototype.change = function (event) {
        _super.prototype.change.call(this, event);
        var value = this.expression.runOnScope().value;
        if (value instanceof Value_1.default)
            value.updateValue(this.node.value);
    };
    return InputBinding;
}(Binding_1.TwoWayBinding));
InputBinding.id = 'input';
exports.default = InputBinding;
var Value_1 = __webpack_require__(3);


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var RepeatBinding = (function (_super) {
    __extends(RepeatBinding, _super);
    function RepeatBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.children = [];
        for (var i = 0; i < _this.node.childNodes.length; i++) {
            _this.children.push(_this.node.childNodes[i]);
        }
        _this.removeChildren();
        _this.run();
        return _this;
    }
    RepeatBinding.prototype.restoreChildren = function () {
        for (var i in this.children) {
            this.node.appendChild(this.children[i]);
        }
    };
    RepeatBinding.prototype.removeChildren = function () {
        while (this.node.childNodes.length !== 0) {
            this.node.removeChild(this.node.childNodes[0]);
        }
    };
    RepeatBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        this.removeChildren();
        var times = this.expression.value;
        for (var i = 0; i < times; i++) {
            for (var k = 0; k < this.children.length; k++) {
                var el = this.children[k].cloneNode(true);
                el.__addedScope__ = utils_1.extend(el.__addedScope__, {
                    $index: i,
                    $isFirst: i == 0,
                    $isLast: i == times - 1
                });
                this.node.appendChild(el);
            }
            ;
        }
        ;
    };
    RepeatBinding.prototype.unbind = function () {
        this.removeChildren();
        _super.prototype.unbind.call(this);
        this.restoreChildren();
    };
    return RepeatBinding;
}(Binding_1.OneWayBinding));
RepeatBinding.id = 'repeat';
RepeatBinding.priority = 1;
exports.default = RepeatBinding;
var utils_1 = __webpack_require__(1);


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var SrcBinding = (function (_super) {
    __extends(SrcBinding, _super);
    function SrcBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.run();
        return _this;
    }
    SrcBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        utils_1.setAttr(this.node, 'src', this.expression.value);
    };
    return SrcBinding;
}(Binding_1.OneWayBinding));
SrcBinding.id = 'src';
exports.default = SrcBinding;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var StyleBinding = (function (_super) {
    __extends(StyleBinding, _super);
    function StyleBinding(node, expression, style) {
        var _this = _super.call(this, node, expression) || this;
        _this.style = style;
        _this.run();
        return _this;
    }
    StyleBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        this.node.style[this.style] = this.expression.value;
    };
    return StyleBinding;
}(Binding_1.OneWayBinding));
StyleBinding.id = 'style';
exports.default = StyleBinding;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var SubmitBinding = (function (_super) {
    __extends(SubmitBinding, _super);
    function SubmitBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.domEvents = ['submit'];
        _this.updateEvents();
        return _this;
    }
    SubmitBinding.prototype.change = function (event) {
        _super.prototype.change.call(this, event);
        event.preventDefault();
    };
    return SubmitBinding;
}(Binding_1.EventBinding));
SubmitBinding.id = 'submit';
exports.default = SubmitBinding;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var TextBinding = (function (_super) {
    __extends(TextBinding, _super);
    function TextBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.oldText = _this.node.textContent;
        _this.run();
        return _this;
    }
    TextBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        this.node.innerText = this.expression.value;
    };
    TextBinding.prototype.unbind = function () {
        _super.prototype.unbind.call(this);
        this.node.textContent = this.oldText;
    };
    return TextBinding;
}(Binding_1.OneWayBinding));
TextBinding.id = 'text';
exports.default = TextBinding;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var ValueBinding = (function (_super) {
    __extends(ValueBinding, _super);
    function ValueBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.node = node;
        _this.domEvents = ['change'];
        _this.updateEvents();
        return _this;
    }
    ValueBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        this.node.value = this.expression.value;
    };
    ValueBinding.prototype.change = function (event) {
        _super.prototype.change.call(this, event);
        var value = this.expression.runOnScope().value;
        if (value instanceof Value_1.default) {
            value.updateValue(this.node.value);
        }
    };
    return ValueBinding;
}(Binding_1.TwoWayBinding));
ValueBinding.id = 'value';
exports.default = ValueBinding;
var Value_1 = __webpack_require__(3);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var VisibleBinding = (function (_super) {
    __extends(VisibleBinding, _super);
    function VisibleBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.run();
        return _this;
    }
    VisibleBinding.prototype.run = function () {
        _super.prototype.run.call(this);
        if (this.expression.value)
            this.node.style.display = '';
        else
            this.node.style.display = 'none';
    };
    return VisibleBinding;
}(Binding_1.OneWayBinding));
VisibleBinding.id = 'visible';
exports.default = VisibleBinding;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Binding_1 = __webpack_require__(0);
var WithBinding = (function (_super) {
    __extends(WithBinding, _super);
    function WithBinding(node, expression) {
        var _this = _super.call(this, node, expression) || this;
        _this.run();
        return _this;
    }
    WithBinding.prototype.run = function () {
        // super.run(); dont run because we arnt going to use .run on are expression
        var scope = this.expression.runOnScope().value;
        if (scope instanceof Scope_1.default) {
            for (var i = 0; i < this.node.childNodes.length; i++) {
                var el = this.node.childNodes[i];
                el.__scope__ = scope;
            }
        }
        else {
            throw new Error('bind-with requires a Object or Array');
        }
    };
    return WithBinding;
}(Binding_1.OneWayBinding));
WithBinding.id = 'with';
WithBinding.priority = 1;
exports.default = WithBinding;
var Scope_1 = __webpack_require__(2);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var Modal_1 = __webpack_require__(6);
__webpack_require__(5);
/**
 * creates a {@link Modal} from a Object
 * @func createModal
 * @memberof bindings
 * @param {Object} modal - the object that this modal will use
 * @param {Object} options - a object that contains some options
 * @see {@link Modal}
 * @returns {@link Bindings.Modal}
 */
function createModal(modalObject, options) {
    if (modalObject === void 0) { modalObject = {}; }
    if (options === void 0) { options = {}; }
    var modal = new Modal_1.default(modalObject, options);
    modalObject._bindings = modal;
    return modal;
}
exports.createModal = createModal;
/**
 * @func createModal
 * @memberof bindings
 * @param {Modal} modal - the modal to use when applying bindings to the html
 * @param {Node} node - the html element
 */
function applyBindings(modal, node) {
    if (modal === void 0) { modal = {}; }
    if (node === void 0) { node = document; }
    if (modal instanceof Modal_1.default) {
        modal.applyBindings(node);
    }
    else if (modal._bindings instanceof Modal_1.default) {
        modal._bindings.applyBindings(node);
    }
}
exports.applyBindings = applyBindings;
__export(__webpack_require__(4));
__export(__webpack_require__(7));
__export(__webpack_require__(0));
__export(__webpack_require__(6));
__export(__webpack_require__(2));
__export(__webpack_require__(3));
var bindingTypes = __webpack_require__(8);
exports.bindingTypes = bindingTypes;
var utils = __webpack_require__(1);
exports.utils = utils;


/***/ })
/******/ ]);
});
//# sourceMappingURL=bindings.bundle.js.map