/// <reference path="bindings.ts" />
var bindings;
(function (bindings) {
    var EventEmiter = (function () {
        /**
        @constructs bindings.EventEmiter
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
        @arg {string} event
        @arg {function} listener
        @arg {Object} [ctx] - the object to run the call back on
        */
        EventEmiter.prototype.on = function (event, fn, ctx) {
            if (typeof ctx === "undefined") { ctx = undefined; }
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
        @arg {string} event
        @arg {function} listener
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
        @arg {string} event
        @arg {function} listener
        @arg {Object} [ctx] - the object to run the call back on
        */
        EventEmiter.prototype.once = function (event, fn, ctx) {
            if (typeof ctx === "undefined") { ctx = undefined; }
            this.on(event, function (event, _this) {
                if (fn)
                    fn();
                this.off(event, _this);
            }.bind(this), ctx);
        };

        /**
        fires an event
        @public
        @arg {string} event
        @arg {*} [data]
        */
        EventEmiter.prototype.emit = function (event, data) {
            if (typeof data === "undefined") { data = undefined; }
            if (!this.events[event]) {
                this.events[event] = [];
            }
            for (var i = 0; i < this.events[event].length; i++) {
                this.events[event][i](data);
            }
            ;
        };
        return EventEmiter;
    })();
    bindings.EventEmiter = EventEmiter;
})(bindings || (bindings = {}));
/// <reference path="bindings.ts" />
/** @namespace bindings.utils */
var bindings;
(function (bindings) {
    (function (utils) {
        /**
        @func setAttr
        @memberof bindings.utils
        @arg {node} element - the html element to set the attr on
        @arg {string} attr - the name of the attr
        @arg {*} value
        */
        function setAttr(el, attr, value) {
            if (value != null)
                el.setAttribute(attr, value);
            else
                el.removeAttribute(attr);
        }
        utils.setAttr = setAttr;

        /**
        loads a json file
        @func loadJSON
        @memberof bindings.utils
        @arg {string} url
        @arg {function} [callback]
        @arg {object|array} defaultObject
        @returns {object|array}
        */
        function loadJSON(url, cb, defaultObject) {
            var func = bindings.utils.loadJSON;

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
                    } else {
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
            } else if (func.loading[url]) {
                func.callbacks[url] = func.callbacks[url] || [];
                func.callbacks[url].push(cb);
            } else {
                if (cb)
                    cb(func.cache[url]);
            }
            return func.cache[url];
        }
        utils.loadJSON = loadJSON;

        /**
        @func getJSON
        @memberof bindings.utils
        @arg {string} url
        @arg {string} [mode=GET]
        @arg {function} [resolve]
        @arg {function} [reject]
        @returns {json}
        */
        function getJSON(url, mode, resolve, reject) {
            var xhttp = new XMLHttpRequest();
            xhttp.onloadend = function () {
                var json;

                try  {
                    json = JSON.parse(xhttp.responseText);
                    resolve && resolve(json);
                } catch (e) {
                    reject && reject(e);
                }
            };
            xhttp.open(mode ? mode.toUpperCase() : "GET", url, true);
            xhttp.send();
        }
        utils.getJSON = getJSON;
    })(bindings.utils || (bindings.utils = {}));
    var utils = bindings.utils;
})(bindings || (bindings = {}));
/// <reference path="bindings.ts" />
var bindings;
(function (bindings) {
    var Modal = (function () {
        /**
        @constructs bindings.Modal
        @arg {Object} object
        @arg {Object} options
        @arg {string} [options.prefix=bind] - the prefix to use when binding
        @arg {Node} node
        */
        function Modal(object, options, node) {
            if (typeof options === "undefined") { options = {}; }
            if (typeof node === "undefined") { node = document.body; }
            this.object = object;
            this.node = node;
            /**
            an array of bindings for this modal
            @member
            @type {bindings.Binding[]}
            */
            this.bindings = [];
            /**
            @property {Object} options - options for this modal
            @property {Object} options.prefix=bind - the prefix this modal will use
            */
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
            this.scope = new bindings.Scope('', object, this);
            for (var i in options) {
                this.options[i] = options[i];
            }
        }
        /**
        @arg {Node} node - the node to bind to
        */
        Modal.prototype.applyBindings = function (node) {
            if (typeof node === "undefined") { node = undefined; }
            //remove old event
            this.node.removeEventListener('DOMNodeInserted', this.ElementChange.bind(this));
            this.node.removeEventListener('DOMNodeRemoved', this.ElementChange.bind(this));

            if (node)
                this.node = node;

            this.bindings = this.buildBindings();

            this.node.addEventListener('DOMNodeInserted', this.ElementChange.bind(this));
            this.node.addEventListener('DOMNodeRemoved', this.ElementChange.bind(this));
        };

        /**
        loop through this.nodes children and create the bindings
        @private
        @arg {Node} [node=this.node]
        @arg {bindings.Scope} [scope=this.scope]
        @returns {bindings.Binding[]}
        */
        Modal.prototype.buildBindings = function (node, scope) {
            if (typeof node === "undefined") { node = this.node; }
            if (typeof scope === "undefined") { scope = node.__scope__ || this.scope; }
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
                node.__addedScope__ = bindings.extendNew(node.parentNode.__addedScope__ || {}, node.__addedScope__ || {});
            }

            bindingsCreated = bindingsCreated.concat(this.createBindings(node)); //createBindings handles setting __bindings__

            for (var i = 0; i < node.childNodes.length; i++) {
                var childNode = node.childNodes[i];

                if (childNode.nodeName.toLowerCase() in this.options.excludedElements)
                    continue;

                bindingsCreated = bindingsCreated.concat(this.buildBindings(childNode, childNode.__scope__ || scope));
            }
            ;

            return bindingsCreated;
        };

        /** @private */
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

        /** @private */
        Modal.prototype.createAttrBindings = function (node) {
            var bindingsCreated = [];
            var attrs = node.attributes;
            var types = [];

            for (var i = 0; i < attrs.length; i++) {
                var attr = attrs.item(i);
                var _types = attr.name.split('-');

                if (_types[0] == this.options.prefix) {
                    _types.splice(0, 1); //remove the prefix
                    var fn = bindingTypes.getBinding(_types[0]);
                    if (fn) {
                        types.push({
                            types: _types,
                            attr: attr,
                            constructor: fn
                        });
                    } else {
                        console.error('cant find binding: ' + attr.name);
                    }
                }
            }
            ;

            //sort by priority
            types.sort(function (a, b) {
                if (a.constructor.priority < b.constructor.priority) {
                    return 1;
                } else if (a.constructor.priority > b.constructor.priority) {
                    return -1;
                } else {
                    return 0;
                }
            });

            for (var i = 0; i < types.length; i++) {
                var t = types[i];

                try  {
                    bindingsCreated.push(bindingTypes.createBinding(t.types, node, t.attr.value));
                } catch (e) {
                    console.error('failed to create binding: ' + t.attr.name);
                    console.error(e);
                }
            }

            node.__bindings__ = bindingsCreated;
            return bindingsCreated;
        };

        /** @private */
        Modal.prototype.createInlineBindings = function (node) {
            var bindingsCreated = [];
            var tokens = this.parseInlineBindings(node.nodeValue, this.options.inlineDelimiters);

            if (!(tokens.length === 1 && tokens[0].type === 'text')) {
                for (var i = 0; i < tokens.length; i++) {
                    var token = tokens[i];
                    var textNode = document.createTextNode(token.value);

                    //copy scopes
                    // textNode.__bindings__ = bindings.clone(node.__bindings__); dont clone the bindings array because no two nodes should have the same bindigns
                    textNode.__bindings__ = [];
                    textNode.__scope__ = node.__scope__;
                    textNode.__addedScope__ = bindings.clone(node.__addedScope__);

                    node.parentNode.insertBefore(textNode, node);
                    if (token.type === 'binding') {
                        var b = new bindings.InlineBinding(textNode);
                        textNode.__bindings__ = [b];
                        bindingsCreated.push(b);
                    }
                }
                node.parentNode.removeChild(node);
            }
            return bindingsCreated;
        };

        /** @private */
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
                } else {
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
                        } else {
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

        /** @private */
        Modal.prototype.ElementChange = function (event) {
            event.stopPropagation();

            var el = event.target;
            if (el.nodeType !== 3) {
                this.buildBindings(el);
            }
        };
        return Modal;
    })();
    bindings.Modal = Modal;
})(bindings || (bindings = {}));
/// <reference path="bindings.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var bindings;
(function (bindings) {
    var Scope = (function (_super) {
        __extends(Scope, _super);
        /**
        @constructs bindings.Scope
        @arg {string} key
        @arg {object} object
        @arg {bindings.Modal} modal
        @arg {bindings.Scope} [parent]
        @extends bindings.EventEmiter
        */
        function Scope(key, object, modal, parent) {
            if (typeof parent === "undefined") { parent = undefined; }
            _super.call(this);
            this.key = key;
            this.object = object;
            this.modal = modal;
            this.parent = parent;

            this.values = (object instanceof Array) ? [] : {};
            this.setKeys(this.object);

            //watch for changes
            this.observer = this.objectChange.bind(this);
            Object.observe(this.object, this.observer);
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
            if (typeof dontFire === "undefined") { dontFire = false; }
            if (this.values[key] == undefined) {
                //add it
                if (typeof value == 'object') {
                    this.values[key] = new bindings.Scope(key, value, this.modal, this);
                } else {
                    this.values[key] = new bindings.Value(key, value, this);
                }
            }

            if (this.values[key] instanceof bindings.Value) {
                this.values[key].setValue(value);
            } else if (this.values[key] instanceof bindings.Scope) {
                this.values[key].setKeys(value);
            }
            if (!dontFire)
                this.update();
        };

        Scope.prototype.setKeys = function (keys, dontFire) {
            if (typeof dontFire === "undefined") { dontFire = false; }
            for (var i in keys) {
                this.setKey(i, keys[i], true);
            }
            ;
            if (!dontFire)
                this.update();
        };

        Scope.prototype.removeKey = function (key, dontFire) {
            if (typeof dontFire === "undefined") { dontFire = false; }
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

        /**
        called when the object changes
        @private
        */
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

        /**
        @override
        @arg {string} event
        @arg {*} [data]
        @arg {string} [direction]
        */
        Scope.prototype.emit = function (event, data, direction) {
            if (typeof data === "undefined") { data = undefined; }
            if (typeof direction === "undefined") { direction = ''; }
            _super.prototype.emit.call(this, event, data);

            switch (direction) {
                case 'down':
                    for (var i in this.values) {
                        if (this.values[i] instanceof bindings.Scope) {
                            this.values[i].emit(event, data, direction);
                        } else {
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
    })(bindings.EventEmiter);
    bindings.Scope = Scope;
})(bindings || (bindings = {}));
/// <reference path="bindings.ts" />
var bindings;
(function (bindings) {
    var Value = (function (_super) {
        __extends(Value, _super);
        /**
        @constructs bindings.Value
        @extends bindings.EventEmiter
        @arg {string} key
        @arg {*} value
        @arg {bindings.Scope} parent
        */
        function Value(key, value, parent) {
            _super.call(this);
            this.key = '';

            this.key = key;
            this.value = value;
            this.parent = parent;
        }
        Value.prototype.dispose = function () {
        };

        /**
        @public
        @arg {*} value
        */
        Value.prototype.setValue = function (value) {
            this.value = value;
            this.update();
            return this.value;
        };

        /**
        @public
        @arg {*} value
        */
        Value.prototype.updateValue = function (value) {
            this.parent.updateKey(this.key, value);
        };

        /**
        fires the change evnet
        @public
        */
        Value.prototype.update = function () {
            this.emit('change', this.value);
        };
        return Value;
    })(bindings.EventEmiter);
    bindings.Value = Value;
})(bindings || (bindings = {}));
/// <reference path="bindings.ts" />
var bindings;
(function (bindings) {
    var Binding = (function () {
        /**
        @constructs bindings.Binding
        */
        function Binding() {
        }
        Object.defineProperty(Binding.prototype, "scope", {
            /**
            @public
            @member
            @readonly
            @memberof bindings.Binding
            @type {bindings.Scope}
            */
            get: function () {
                return this.node.__scope__;
            },
            enumerable: true,
            configurable: true
        });

        Binding.prototype.run = function () {
        };

        Binding.prototype.unbind = function () {
        };
        Binding.id = '';

        Binding.priority = 0;
        return Binding;
    })();
    bindings.Binding = Binding;
    var OneWayBinding = (function (_super) {
        __extends(OneWayBinding, _super);
        /**
        @constructs bindings.OneWayBinding
        @extends bindings.Binding
        @arg {Node} node - the html node to use in the binding
        @arg {String} expression - the expression to use for this binding
        */
        function OneWayBinding(node, expression) {
            _super.call(this);
            this.node = node;
            /**
            a list of scopes or values this binding is listening to
            @public
            @member
            @type {bindings.Scope|bindings.Value}
            */
            this.dependencies = [];
            /**
            @public
            @member
            @type {boolean}
            */
            this.updateDependenciesOnChange = false;
            this.expression = new bindings.Expression(node, expression, this.scope);

            this.updateDependencies();
        }
        /**
        this is called when one of the {@link bindings.OneWayBinding#dependencies dependencies} change
        @public
        */
        OneWayBinding.prototype.dependencyChange = function () {
            if (this.updateDependenciesOnChange) {
                this.updateDependencies();
            }
            this.run();
        };

        /**
        this is called when the expresion changes
        @public
        @override
        */
        OneWayBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.expression.run();

            if (this.dependencies.length == 0 && !this.expression.success) {
                this.dependencies.push(this.scope);
                this.bindDependencies();
                this.updateDependenciesOnChange = true; //when dependecies change update them
            }
        };

        /**
        unbinds the binding from the html node
        @public
        @override
        */
        OneWayBinding.prototype.unbind = function () {
            this.unbindDependencies();
        };

        /**
        @public
        */
        OneWayBinding.prototype.getDependencies = function (refresh) {
            if (typeof refresh === "undefined") { refresh = false; }
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
    })(bindings.Binding);
    bindings.OneWayBinding = OneWayBinding;
    var TwoWayBinding = (function (_super) {
        __extends(TwoWayBinding, _super);
        /**
        @constructs bindings.TwoWayBinding TwoWayBinding
        @extends bindings.OneWayBinding
        @arg {Node} node - the html node to use in the binding
        @arg {String} expression - the expression to use for this binding
        */
        function TwoWayBinding(node, expression) {
            _super.call(this, node, expression);
            this.domEvents = [];
            this.dontUpdate = false;

            //update the node
            this.run();

            this.bindEvents();
        }
        /**
        this is called when the dom changes
        @arg {Event} event - the event
        */
        TwoWayBinding.prototype.change = function (event) {
            this.dontUpdate = true; //dont update (call this.run) the node
        };

        /**
        @public
        @override
        */
        TwoWayBinding.prototype.dependencyChange = function () {
            if (!this.dontUpdate) {
                _super.prototype.dependencyChange.call(this);
            }
            this.dontUpdate = false;
        };

        /**
        @public
        @override
        */
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
    })(bindings.OneWayBinding);
    bindings.TwoWayBinding = TwoWayBinding;
    var EventBinding = (function (_super) {
        __extends(EventBinding, _super);
        /**
        @constructs bindings.EventBinding EventBinding
        @extends bindings.Binding
        @arg {Node} node - the html node to use in the binding
        @arg {String} expression - the expression to use for this binding
        */
        function EventBinding(node, expression) {
            _super.call(this);
            this.node = node;
            this.domEvents = [];
            this.expression = new bindings.Expression(node, expression, this.scope);

            this.bindEvents();
        }
        EventBinding.prototype.change = function (event) {
            this.expression.run();

            if (this.expression.value instanceof Function && this.scope) {
                //run it on the scope
                this.expression.value.call(this.scope.object, event);
            }
        };

        /**
        @public
        @override
        */
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
    })(bindings.Binding);
    bindings.EventBinding = EventBinding;
    var InlineBinding = (function (_super) {
        __extends(InlineBinding, _super);
        /**
        @constructs bindings.InlineBinding InlineBinding
        @extends bindings.Binding
        @arg {Node} node - the html node to use in the binding
        */
        function InlineBinding(node) {
            _super.call(this);
            this.node = node;
            this.dependencies = [];
            this.updateDependenciesOnChange = false;
            this.expression = new bindings.Expression(node, node.nodeValue, this.scope);
            this.updateDependencies();

            this.run();
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

        /**
        @public
        @override
        */
        InlineBinding.prototype.run = function () {
            this.expression.run();

            this.node.nodeValue = this.expression.value;

            if (this.dependencies.length == 0 && !this.expression.success) {
                this.dependencies.push(this.scope);
                this.bindDependencies();
                this.updateDependenciesOnChange = true; //when dependecies change update them
            }
        };

        /**
        @public
        @override
        */
        InlineBinding.prototype.unbind = function () {
            this.unbindDependencies();
        };

        InlineBinding.prototype.getDependencies = function (refresh) {
            if (typeof refresh === "undefined") { refresh = false; }
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
    })(bindings.Binding);
    bindings.InlineBinding = InlineBinding;
})(bindings || (bindings = {}));

/**
@namespace bindingTypes
*/
var bindingTypes;
(function (bindingTypes) {
    /**
    @func getBinding
    @memberof bindingTypes
    @arg {string} type - the type of binding
    */
    function getBinding(type) {
        var binding;
        for (var i in this) {
            if (this[i].id == type) {
                return this[i];
            }
        }
        return binding;
    }
    bindingTypes.getBinding = getBinding;

    /**
    create a binding with type that is attached to the node
    @func getBinding
    @memberof bindingTypes
    @arg {string[]|string} type - the type of binding
    @arg {Node} node - the html node
    @arg {string} expresion - the expresion for this binding to use
    @return binding.Binding
    */
    function createBinding(type, node, expression) {
        if (!(type instanceof Array)) {
            type = [type];
        }
        var binding;
        var id = type[0];
        type.splice(0, 1); //remove first entry
        var data = type.join('-');
        for (var i in this) {
            if (this[i].id == id) {
                binding = new this[i](node, expression, data);
                break;
            }
        }
        return binding;
    }
    bindingTypes.createBinding = createBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="bindings.ts" />
var bindings;
(function (bindings) {
    var Expression = (function () {
        /**
        @constructs bindings.Expression
        @arg {node} node - the node to use for this expression
        @arg {string} expression
        @arg {bindings.Scope} scope
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

            try  {
                data.value = func.apply(context, args);
            } catch (e) {
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
                alert: bindings.noop,
                eval: bindings.noop
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

            try  {
                func.apply(context.context, args);
            } catch (e) {
                data.success = false;
                data.error = e;
            }

            this.dependencies = data.requires;

            return data;
        };

        Expression.prototype.buildContext = function (scope, requires, dontSet) {
            if (typeof requires === "undefined") { requires = { requires: [], gets: [], sets: [] }; }
            if (typeof dontSet === "undefined") { dontSet = false; }
            var object = (scope.object instanceof Array) ? [] : {};
            var get = function (scope, object, index, requires) {
                if (requires.gets.indexOf(scope.values[index]) == -1) {
                    requires.requires.push(scope.values[index]);
                    requires.gets.push(scope.values[index]);
                }

                if (scope.values[index] instanceof bindings.Scope) {
                    return this.buildContext(scope.values[index], requires, dontSet).context;
                } else if (scope.values[index] instanceof bindings.Value) {
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
            } else {
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
            } else {
                object.$modal = undefined;
            }

            return {
                context: object,
                requires: requires
            };
        };
        return Expression;
    })();
    bindings.Expression = Expression;
})(bindings || (bindings = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var AttrBinding = (function (_super) {
        __extends(AttrBinding, _super);
        /**
        @constructs bindingTypes.AttrBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @arg {string} attr
        @extends bindings.OneWayBinding
        */
        function AttrBinding(node, expression, attr) {
            _super.call(this, node, expression);
            this.attr = attr;
            this.run();
        }
        /** @override */
        AttrBinding.prototype.run = function () {
            _super.prototype.run.call(this);

            bindings.utils.setAttr(this.node, this.attr, this.expression.value);
        };
        AttrBinding.id = 'attr';
        return AttrBinding;
    })(bindings.OneWayBinding);
    bindingTypes.AttrBinding = AttrBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var ClassBinding = (function (_super) {
        __extends(ClassBinding, _super);
        /**
        @constructs bindingTypes.ClassBinding
        @extends bindings.OneWayBinding
        */
        function ClassBinding(node, expression, bindClass) {
            _super.call(this, node, expression);
            this.bindClass = bindClass;
            this.run();
        }
        /**
        @public
        @override
        */
        ClassBinding.prototype.run = function () {
            _super.prototype.run.call(this);

            if (this.expression.value && !this.hasClass()) {
                this.addClass();
            } else if (this.hasClass()) {
                this.removeClass();
            }
        };

        /** @private */
        ClassBinding.prototype.addClass = function () {
            this.node.className += ' ' + this.bindClass;
            this.node.className = this.node.className.trim();
        };

        /** @private */
        ClassBinding.prototype.removeClass = function () {
            this.node.className = this.node.className.replace(new RegExp('(?:^|\s)' + this.bindClass + '(?!\S)', 'g'), '');
            this.node.className = this.node.className.trim();
        };

        /** @private */
        ClassBinding.prototype.hasClass = function () {
            return this.node.className.indexOf(this.bindClass) !== -1;
        };
        ClassBinding.id = 'class';
        return ClassBinding;
    })(bindings.OneWayBinding);
    bindingTypes.ClassBinding = ClassBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var ClickBinding = (function (_super) {
        __extends(ClickBinding, _super);
        /**
        @constructs bindingTypes.ClickBinding
        @extends bindings.EventBinding
        @arg {HTMLElement} node
        @arg {string} expression
        */
        function ClickBinding(node, expression) {
            _super.call(this, node, expression);

            this.domEvents = ['click'];
            this.updateEvents();
        }
        ClickBinding.id = 'click';
        return ClickBinding;
    })(bindings.EventBinding);
    bindingTypes.ClickBinding = ClickBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var DisabledBinding = (function (_super) {
        __extends(DisabledBinding, _super);
        /**
        @constructs bindingTypes.DisabledBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function DisabledBinding(node, expression) {
            _super.call(this, node, expression);
            this.run();
        }
        /**
        @public
        @overrid
        */
        DisabledBinding.prototype.run = function () {
            _super.prototype.run.call(this);

            if (!this.expression.value) {
                this.node.removeAttribute('disabled');
            } else {
                this.node.setAttribute('disabled', 'disabled');
            }
        };
        DisabledBinding.id = 'disabled';
        return DisabledBinding;
    })(bindings.OneWayBinding);
    bindingTypes.DisabledBinding = DisabledBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var EnabledBinding = (function (_super) {
        __extends(EnabledBinding, _super);
        /**
        @constructs bindingTypes.EnabledBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function EnabledBinding(node, expression) {
            _super.call(this, node, expression);
            this.run();
        }
        /**
        @public
        @override
        */
        EnabledBinding.prototype.run = function () {
            _super.prototype.run.call(this);

            if (this.expression.value) {
                this.node.removeAttribute('disabled');
            } else {
                this.node.setAttribute('disabled', 'disabled');
            }
        };
        EnabledBinding.id = 'enabled';
        return EnabledBinding;
    })(bindings.OneWayBinding);
    bindingTypes.EnabledBinding = EnabledBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-event-*
var bindingTypes;
(function (bindingTypes) {
    var EventBinding = (function (_super) {
        __extends(EventBinding, _super);
        /**
        @constructs bindingTypes.EventBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @arg {string} attr
        @arg {string} bindEvent
        @extends bindings.EventBinding
        */
        function EventBinding(node, expression, bindEvent) {
            _super.call(this, node, expression);

            this.domEvents = [bindEvent];
            this.updateEvents();
        }
        EventBinding.id = 'event';
        return EventBinding;
    })(bindings.EventBinding);
    bindingTypes.EventBinding = EventBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var ForEachBinding = (function (_super) {
        __extends(ForEachBinding, _super);
        /**
        @constructs bindingTypes.ForEachBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function ForEachBinding(node, expression) {
            _super.call(this, node, expression);
            this.children = [];
            for (var i = 0; i < this.node.childNodes.length; i++) {
                this.children.push(this.node.childNodes[i]);
            }
            this.removeAllChildren();

            this.run();
        }
        /** @private */
        ForEachBinding.prototype.restoreChildren = function () {
            for (var i in this.children) {
                this.node.appendChild(this.children[i]);
            }
        };

        /** @private */
        ForEachBinding.prototype.removeAllChildren = function () {
            while (this.node.childNodes.length !== 0) {
                this.node.removeChild(this.node.childNodes[0]);
            }
        };

        /**
        @override
        @public
        */
        ForEachBinding.prototype.run = function () {
            // super.run(); dont run because we arnt going to use .run on are expression
            var scope = this.expression.runOnScope().value;

            this.removeAllChildren();

            if (scope instanceof bindings.Scope) {
                for (var i = 0; i < scope.values.length; i++) {
                    for (var k = 0; k < this.children.length; k++) {
                        var el = this.children[k].cloneNode(true);
                        el.__scope__ = scope.values[i];
                        el.__addedScope__ = bindings.extend(el.__addedScope__, {
                            $index: i,
                            $isFirst: i == 0,
                            $isLast: i == scope.values.length - 1
                        });
                        this.node.appendChild(el);
                    }
                    ;
                }
                ;
            } else {
                throw new Error('bind-foreach requires a Object or Array');
            }
        };

        /**
        @override
        @public
        */
        ForEachBinding.prototype.unbind = function () {
            this.removeAllChildren();
            _super.prototype.unbind.call(this);
            this.restoreChildren();
        };
        ForEachBinding.id = 'foreach';
        ForEachBinding.priority = 3;
        return ForEachBinding;
    })(bindings.OneWayBinding);
    bindingTypes.ForEachBinding = ForEachBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var HrefBinding = (function (_super) {
        __extends(HrefBinding, _super);
        /**
        @constructs bindingTypes.HrefBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function HrefBinding(node, expression) {
            _super.call(this, node, expression);
            this.run();
        }
        /**
        @override
        @public
        */
        HrefBinding.prototype.run = function () {
            _super.prototype.run.call(this);

            bindings.utils.setAttr(this.node, 'href', this.expression.value);
        };
        HrefBinding.id = 'href';
        return HrefBinding;
    })(bindings.OneWayBinding);
    bindingTypes.HrefBinding = HrefBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var HTMLBinding = (function (_super) {
        __extends(HTMLBinding, _super);
        /**
        @constructs bindingTypes.HTMLBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function HTMLBinding(node, expression) {
            _super.call(this, node, expression);

            this.oldText = this.node.textContent;
            this.run();
        }
        /**
        @override
        @public
        */
        HTMLBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.node.innerHTML = this.expression.value;
        };

        /**
        @override
        @public
        */
        HTMLBinding.prototype.unbind = function () {
            _super.prototype.unbind.call(this);
            this.node.textContent = this.oldText;
        };
        HTMLBinding.id = 'html';
        return HTMLBinding;
    })(bindings.OneWayBinding);
    bindingTypes.HTMLBinding = HTMLBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var IfBinding = (function (_super) {
        __extends(IfBinding, _super);
        /**
        @constructs bindingTypes.IfBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function IfBinding(node, expression) {
            _super.call(this, node, expression);
            this.children = [];
            for (var i = 0; i < this.node.children.length; i++) {
                this.children.push(this.node.children[i]);
            }

            this.run();
        }
        /** @private */
        IfBinding.prototype.restoreChildren = function () {
            for (var i in this.children) {
                this.node.appendChild(this.children[i]);
            }
        };

        /** @private */
        IfBinding.prototype.removeChildren = function () {
            while (this.node.children.length !== 0) {
                this.node.removeChild(this.node.children[0]);
            }
        };

        /**
        @override
        @public
        */
        IfBinding.prototype.run = function () {
            _super.prototype.run.call(this);

            if (this.expression.value) {
                this.restoreChildren();
            } else {
                this.removeChildren();
            }
        };

        /**
        @override
        @public
        */
        IfBinding.prototype.unbind = function () {
            _super.prototype.unbind.call(this);
            this.removeChildren();
            this.restoreChildren();
        };
        IfBinding.id = 'if';
        return IfBinding;
    })(bindings.OneWayBinding);
    bindingTypes.IfBinding = IfBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var IfNotBinding = (function (_super) {
        __extends(IfNotBinding, _super);
        /**
        @constructs bindingTypes.IfNotBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function IfNotBinding(node, expression) {
            _super.call(this, node, expression);
            this.children = [];
            for (var i = 0; i < this.node.children.length; i++) {
                this.children.push(this.node.children[i]);
            }

            this.run();
        }
        /** @private */
        IfNotBinding.prototype.restoreChildren = function () {
            for (var i in this.children) {
                this.node.appendChild(this.children[i]);
            }
        };

        /** @private */
        IfNotBinding.prototype.removeChildren = function () {
            while (this.node.children.length !== 0) {
                this.node.removeChild(this.node.children[0]);
            }
        };

        /**
        @override
        @public
        */
        IfNotBinding.prototype.run = function () {
            _super.prototype.run.call(this);

            if (!this.expression.value) {
                this.restoreChildren();
            } else {
                this.removeChildren();
            }
        };

        /**
        @override
        @public
        */
        IfNotBinding.prototype.unbind = function () {
            _super.prototype.unbind.call(this);
            this.removeChildren();
            this.restoreChildren();
        };
        IfNotBinding.id = 'ifnot';
        return IfNotBinding;
    })(bindings.OneWayBinding);
    bindingTypes.IfNotBinding = IfNotBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var InputBinding = (function (_super) {
        __extends(InputBinding, _super);
        /**
        @constructs bindingTypes.InputBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.TwoWayBinding
        */
        function InputBinding(node, expression) {
            _super.call(this, node, expression);
            this.node = node;

            this.domEvents = ['input'];
            this.updateEvents();
        }
        /** @override */
        InputBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.node.value = this.expression.value;
        };

        /** @override */
        InputBinding.prototype.change = function (event) {
            _super.prototype.change.call(this, event);
            var value = this.expression.runOnScope().value;
            if (value instanceof bindings.Value) {
                value.updateValue(this.node.value);
            }
        };
        InputBinding.id = 'input';
        return InputBinding;
    })(bindings.TwoWayBinding);
    bindingTypes.InputBinding = InputBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var RepeatBinding = (function (_super) {
        __extends(RepeatBinding, _super);
        /**
        @constructs bindingTypes.InputBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function RepeatBinding(node, expression) {
            _super.call(this, node, expression);
            this.children = [];
            for (var i = 0; i < this.node.childNodes.length; i++) {
                this.children.push(this.node.childNodes[i]);
            }
            this.removeChildren();

            this.run();
        }
        /** @private */
        RepeatBinding.prototype.restoreChildren = function () {
            for (var i in this.children) {
                this.node.appendChild(this.children[i]);
            }
        };

        /** @private */
        RepeatBinding.prototype.removeChildren = function () {
            while (this.node.childNodes.length !== 0) {
                this.node.removeChild(this.node.childNodes[0]);
            }
        };

        /** @override */
        RepeatBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.removeChildren();

            var times = this.expression.value;
            for (var i = 0; i < times; i++) {
                for (var k = 0; k < this.children.length; k++) {
                    var el = this.children[k].cloneNode(true);
                    el.__addedScope__ = bindings.extend(el.__addedScope__, {
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

        /** @override */
        RepeatBinding.prototype.unbind = function () {
            this.removeChildren();
            _super.prototype.unbind.call(this);
            this.restoreChildren();
        };
        RepeatBinding.id = 'repeat';
        RepeatBinding.priority = 1;
        return RepeatBinding;
    })(bindings.OneWayBinding);
    bindingTypes.RepeatBinding = RepeatBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var SrcBinding = (function (_super) {
        __extends(SrcBinding, _super);
        /**
        @constructs bindingTypes.SrcBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function SrcBinding(node, expression) {
            _super.call(this, node, expression);
            this.run();
        }
        /** @override */
        SrcBinding.prototype.run = function () {
            _super.prototype.run.call(this);

            bindings.utils.setAttr(this.node, 'src', this.expression.value);
        };
        SrcBinding.id = 'src';
        return SrcBinding;
    })(bindings.OneWayBinding);
    bindingTypes.SrcBinding = SrcBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var StyleBinding = (function (_super) {
        __extends(StyleBinding, _super);
        /**
        @constructs bindingTypes.StyleBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @arg {string} style
        @extends bindings.OneWayBinding
        */
        function StyleBinding(node, expression, style) {
            _super.call(this, node, expression);
            this.style = style;
            this.run();
        }
        /** @override */
        StyleBinding.prototype.run = function () {
            _super.prototype.run.call(this);

            this.node.style[this.style] = this.expression.value;
        };
        StyleBinding.id = 'style';
        return StyleBinding;
    })(bindings.OneWayBinding);
    bindingTypes.StyleBinding = StyleBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var SubmitBinding = (function (_super) {
        __extends(SubmitBinding, _super);
        /**
        @constructs bindingTypes.SubmitBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.EventBinding
        */
        function SubmitBinding(node, expression) {
            _super.call(this, node, expression);
            this.domEvents = ['submit'];
            this.updateEvents();
        }
        /** @override */
        SubmitBinding.prototype.change = function (event) {
            _super.prototype.change.call(this, event);
            event.preventDefault();
        };
        SubmitBinding.id = 'submit';
        return SubmitBinding;
    })(bindings.EventBinding);
    bindingTypes.SubmitBinding = SubmitBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var TextBinding = (function (_super) {
        __extends(TextBinding, _super);
        /**
        @constructs bindingTypes.TextBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function TextBinding(node, expression) {
            _super.call(this, node, expression);

            this.oldText = this.node.textContent;
            this.run();
        }
        /** @override */
        TextBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.node.innerText = this.expression.value;
        };

        /** @override */
        TextBinding.prototype.unbind = function () {
            _super.prototype.unbind.call(this);
            this.node.textContent = this.oldText;
        };
        TextBinding.id = 'text';
        return TextBinding;
    })(bindings.OneWayBinding);
    bindingTypes.TextBinding = TextBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var ValueBinding = (function (_super) {
        __extends(ValueBinding, _super);
        /**
        @constructs bindingTypes.ValueBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.TwoWayBinding
        */
        function ValueBinding(node, expression) {
            _super.call(this, node, expression);
            this.node = node;

            this.domEvents = ['change'];
            this.updateEvents();
        }
        /** @override */
        ValueBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.node.value = this.expression.value;
        };

        /** @override */
        ValueBinding.prototype.change = function (event) {
            _super.prototype.change.call(this, event);

            var value = this.expression.runOnScope().value;
            if (value instanceof bindings.Value) {
                value.updateValue(this.node.value);
            }
        };
        ValueBinding.id = 'value';
        return ValueBinding;
    })(bindings.TwoWayBinding);
    bindingTypes.ValueBinding = ValueBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var VisibleBinding = (function (_super) {
        __extends(VisibleBinding, _super);
        /**
        @constructs bindingTypes.VisibleBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function VisibleBinding(node, expression) {
            _super.call(this, node, expression);
            this.run();
        }
        /** @override */
        VisibleBinding.prototype.run = function () {
            _super.prototype.run.call(this);

            if (this.expression.value) {
                this.node.style.display = '';
            } else {
                this.node.style.display = 'none';
            }
        };
        VisibleBinding.id = 'visible';
        return VisibleBinding;
    })(bindings.OneWayBinding);
    bindingTypes.VisibleBinding = VisibleBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var HiddenBinding = (function (_super) {
        __extends(HiddenBinding, _super);
        /**
        @constructs bindingTypes.HiddenBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function HiddenBinding(node, expression) {
            _super.call(this, node, expression);
            this.run();
        }
        /**
        @override
        @public
        */
        HiddenBinding.prototype.run = function () {
            _super.prototype.run.call(this);

            if (this.expression.value) {
                this.node.style.display = 'none';
            } else {
                this.node.style.display = '';
            }
        };
        HiddenBinding.id = 'hidden';
        return HiddenBinding;
    })(bindings.OneWayBinding);
    bindingTypes.HiddenBinding = HiddenBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
var bindingTypes;
(function (bindingTypes) {
    var WithBinding = (function (_super) {
        __extends(WithBinding, _super);
        /**
        @constructs bindingTypes.WithBinding
        @arg {HTMLElement} node
        @arg {string} expression
        @extends bindings.OneWayBinding
        */
        function WithBinding(node, expression) {
            _super.call(this, node, expression);
            this.run();
        }
        /** @override */
        WithBinding.prototype.run = function () {
            // super.run(); dont run because we arnt going to use .run on are expression
            var scope = this.expression.runOnScope().value;

            if (scope instanceof bindings.Scope) {
                for (var i = 0; i < this.node.childNodes.length; i++) {
                    var el = this.node.childNodes[i];
                    el.__scope__ = scope;
                }
            } else {
                throw new Error('bind-with requires a Object or Array');
            }
        };
        WithBinding.id = 'with';
        WithBinding.priority = 1;
        return WithBinding;
    })(bindings.OneWayBinding);
    bindingTypes.WithBinding = WithBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="eventEmiter.ts" />
/// <reference path="utils.ts" />
/// <reference path="modal.ts" />
/// <reference path="scope.ts" />
/// <reference path="value.ts" />
/// <reference path="binding.ts" />
/// <reference path="expression.ts" />
//types
/// <reference path="bindings/attr.ts" />
/// <reference path="bindings/class.ts" />
/// <reference path="bindings/click.ts" />
/// <reference path="bindings/disabled.ts" />
/// <reference path="bindings/enabled.ts" />
/// <reference path="bindings/event.ts" />
/// <reference path="bindings/foreach.ts" />
/// <reference path="bindings/href.ts" />
/// <reference path="bindings/html.ts" />
/// <reference path="bindings/if.ts" />
/// <reference path="bindings/ifnot.ts" />
/// <reference path="bindings/input.ts" />
/// <reference path="bindings/repeat.ts" />
/// <reference path="bindings/src.ts" />
/// <reference path="bindings/style.ts" />
/// <reference path="bindings/submit.ts" />
/// <reference path="bindings/text.ts" />
/// <reference path="bindings/value.ts" />
/// <reference path="bindings/visible.ts" />
/// <reference path="bindings/hidden.ts" />
/// <reference path="bindings/with.ts" />
/**
@namespace bindings
*/
var bindings;
(function (bindings) {
    /**
    creates a {@link bindings.Modal} from a Object
    @func createModal
    @memberof bindings
    @arg {Object} modal - the object that this modal will use
    @arg {Object} options - a object that contains some options
    @see {@link bindings.Modal}
    @returns {@link Bindings.Modal}
    */
    function createModal(modalObject, options) {
        if (typeof modalObject === "undefined") { modalObject = {}; }
        if (typeof options === "undefined") { options = {}; }
        var modal = new bindings.Modal(modalObject, options);

        modalObject._bindings = modal;

        return modal;
    }
    bindings.createModal = createModal;

    /**
    @func createModal
    @memberof bindings
    @arg {bindings.Modal} modal - the modal to use when applying bindings to the html
    @arg {Node} node - the html element
    */
    function applyBindings(modal, node) {
        if (typeof modal === "undefined") { modal = {}; }
        if (typeof node === "undefined") { node = document; }
        if (modal instanceof bindings.Modal) {
            modal.applyBindings(node);
        } else if (modal._bindings instanceof bindings.Modal) {
            modal._bindings.applyBindings(node);
        }
    }
    bindings.applyBindings = applyBindings;
    function duplicateObject(obj2, count) {
        if (typeof count === "undefined") { count = 20; }
        if (obj2 instanceof Object && obj2 !== null) {
            // count = (count !== undefined)? count : 20;
            if (count > 0) {
                // see if its an array
                if (obj2.hasOwnProperty('length')) {
                    var obj = new Array(0);
                    for (var i = 0; i < obj2.length; i++) {
                        if (typeof obj2[i] !== 'object') {
                            obj[i] = obj2[i];
                        } else {
                            obj[i] = this.duplicateObject(obj2[i], count - 1);
                        }
                    }
                    ;
                } else {
                    var obj;
                    for (var k in obj2) {
                        if (!(obj2[k] instanceof Object)) {
                            obj[k] = obj2[k];
                        } else {
                            obj[k] = this.duplicateObject(obj2[k], count - 1);
                        }
                    }
                }
            }
            return obj;
        } else {
            return obj2;
        }
    }
    bindings.duplicateObject = duplicateObject;
    function noop() {
    }
    bindings.noop = noop;
    function clone(obj) {
        if (typeof obj == 'object') {
            return JSON.parse(JSON.stringify(obj));
        }
    }
    bindings.clone = clone;
    function extend(obj, obj2) {
        obj = obj || {};
        obj2 = obj2 || {};
        for (var i in obj2) {
            obj[i] = obj2[i];
        }
        return obj;
    }
    bindings.extend = extend;
    function extendNew(o1, o2, o3, o4) {
        if (typeof o1 === "undefined") { o1 = {}; }
        if (typeof o2 === "undefined") { o2 = {}; }
        if (typeof o3 === "undefined") { o3 = {}; }
        if (typeof o4 === "undefined") { o4 = {}; }
        var o = {};
        for (var i in arguments) {
            this.extend(o, arguments[i]);
        }
        return o;
    }
    bindings.extendNew = extendNew;
})(bindings || (bindings = {}));
