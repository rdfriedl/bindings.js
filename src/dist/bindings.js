/// <reference path="bindings.ts" />
var EventEmiter = (function () {
    function EventEmiter() {
        this.events = {};
    }
    EventEmiter.prototype.on = function (event, fn, ctx) {
        if (ctx === void 0) { ctx = undefined; }
        if (!this.events[event]) {
            this.events[event] = [];
        }
        if (ctx)
            fn = fn.bind(ctx);
        this.events[event].push(fn);
    };
    EventEmiter.prototype.off = function (event, fn) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        if (this.events[event].indexOf(fn) !== -1) {
            this.events[event].splice(this.events[event].indexOf(fn), 1);
        }
    };
    EventEmiter.prototype.once = function (event, fn, ctx) {
        if (ctx === void 0) { ctx = undefined; }
        this.on(event, function (event, _this) {
            if (fn)
                fn();
            this.off(event, _this);
        }.bind(this), ctx);
    };
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
})();
/// <reference path="bindings.ts" />
var bindings;
(function (bindings) {
    var Modal = (function () {
        function Modal(object, element) {
            this.object = object;
            this.element = element;
            this.bindings = [];
            this.scope = new bindings.Scope('', object, this);
        }
        Modal.prototype.applyBindings = function (element) {
            if (element === void 0) { element = undefined; }
            //remove old event
            this.element.removeEventListener('DOMNodeInserted', this.ElementChange.bind(this));
            this.element.removeEventListener('DOMNodeRemoved', this.ElementChange.bind(this));
            if (element)
                this.element = element;
            this.bindings = this.buildBindings();
            this.element.addEventListener('DOMNodeInserted', this.ElementChange.bind(this));
            this.element.addEventListener('DOMNodeRemoved', this.ElementChange.bind(this));
        };
        Modal.prototype.buildBindings = function (element, scope) {
            if (element === void 0) { element = this.element; }
            if (scope === void 0) { scope = element.__scope__ || this.scope; }
            var bindingsCreated = [];
            //remove old bindings
            if (element.__bindings__) {
                for (var i = 0; i < element.__bindings__.length; i++) {
                    element.__bindings__[i].unbind();
                }
                ;
                element.__bindings__ = [];
            }
            element.__scope__ = scope;
            var data = this.parseBindings(element);
            element.__bindings__ = data;
            bindingsCreated = bindingsCreated.concat(element.__bindings__);
            //loop through and bind children
            if (element.children) {
                for (var i = 0; i < element.children.length; i++) {
                    var child = element.children[i];
                    child.__scope__ = child.__scope__ || scope;
                    this.buildBindings(child, child.__scope__);
                    bindingsCreated = bindingsCreated.concat(child.__bindings__);
                }
                ;
            }
            return bindingsCreated;
        };
        Modal.prototype.parseBindings = function (element) {
            var bindingsCreated = [];
            var attrs = element.attributes;
            for (var i = 0; i < attrs.length; i++) {
                var attr = attrs.item(i);
                var type = attr.name;
                //find the binding attrs and extract the src
                if (type.search('bind-') == 0) {
                    type = type.substr(type.indexOf('-') + 1, type.length);
                    var binding = bindingTypes.createBinding(type, element, attr);
                    if (binding) {
                        bindingsCreated.push(binding);
                    }
                    else {
                        console.error('cant find binding: ' + type);
                    }
                }
            }
            ;
            return bindingsCreated;
        };
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
        function Scope(key, object, modal, parent) {
            if (parent === void 0) { parent = undefined; }
            _super.call(this);
            this.key = key;
            this.object = object;
            this.modal = modal;
            this.parent = parent;
            this.values = (object instanceof Array) ? [] : {};
            this.setKeys(this.object);
            //watch for changes
            Object.observe(this.object, this.objectChange.bind(this));
        }
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
                if (value instanceof Object) {
                    this.values[key] = new bindings.Scope(key, value, this.modal, this);
                }
                else {
                    this.values[key] = new bindings.Value(key, value, this);
                }
            }
            if (this.values[key] instanceof bindings.Value) {
                this.values[key].setValue(value);
            }
            else if (this.values[key] instanceof bindings.Scope) {
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
                        break;
                    case 'update':
                        this.setKey(data[i].name, data[i].object[data[i].name], true);
                        break;
                    case 'delete':
                        this.removeKey(data[i].name, true);
                        break;
                }
            }
            this.update();
        };
        Scope.prototype.emit = function (event, data, direction) {
            if (data === void 0) { data = undefined; }
            if (direction === void 0) { direction = ''; }
            _super.prototype.emit.call(this, event, data);
            switch (direction) {
                case 'down':
                    for (var i in this.values) {
                        if (this.values[i] instanceof bindings.Scope) {
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
    })(EventEmiter);
    bindings.Scope = Scope;
})(bindings || (bindings = {}));
/// <reference path="bindings.ts" />
var bindings;
(function (bindings) {
    var Value = (function (_super) {
        __extends(Value, _super);
        function Value(key, value, parent) {
            _super.call(this);
            this.key = '';
            this.key = key;
            this.value = value;
            this.parent = parent;
        }
        Value.prototype.setValue = function (value) {
            this.value = value;
            this.update();
            return this.value;
        };
        Value.prototype.updateValue = function (value) {
            this.parent.updateKey(this.key, value);
        };
        Value.prototype.update = function () {
            this.emit('change', this.value);
        };
        return Value;
    })(EventEmiter);
    bindings.Value = Value;
})(bindings || (bindings = {}));
/// <reference path="bindings.ts" />
var bindings;
(function (bindings) {
    var Binding = (function () {
        function Binding(element, attr) {
            this.element = element;
            this.attr = attr;
            this.expression = new bindings.expression(attr, this.scope);
        }
        Object.defineProperty(Binding.prototype, "scope", {
            get: function () {
                return this.element.__scope__;
            },
            enumerable: true,
            configurable: true
        });
        Binding.prototype.run = function () {
        };
        Binding.prototype.unbind = function () {
        };
        Binding.id = '';
        return Binding;
    })();
    bindings.Binding = Binding;
    var OneWayBinding = (function (_super) {
        __extends(OneWayBinding, _super);
        function OneWayBinding(element, attr) {
            _super.call(this, element, attr);
            this.dependencies = []; //a list of scopes and values this bindings uses
            this.updateDependencies();
        }
        OneWayBinding.prototype.dependencyChange = function () {
            this.run();
        };
        OneWayBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.expression.run();
        };
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
            this.getDependencies(true);
            this.unbindDependencies();
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
        function TwoWayBinding(element, attr) {
            _super.call(this, element, attr);
            this.domEvents = []; //add events to this list to bind to them
            this.dontUpdate = false;
            this.bindEvents();
        }
        TwoWayBinding.prototype.change = function (event) {
            this.dontUpdate = true; //dont update (call this.run) the element
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
                this.element.addEventListener(this.domEvents[i], this.change.bind(this));
            }
        };
        TwoWayBinding.prototype.unbindEvents = function () {
            for (var i = 0; i < this.domEvents.length; i++) {
                this.element.removeEventListener(this.domEvents[i], this.change.bind(this));
            }
        };
        return TwoWayBinding;
    })(bindings.OneWayBinding);
    bindings.TwoWayBinding = TwoWayBinding;
    var EventBinding = (function (_super) {
        __extends(EventBinding, _super);
        function EventBinding(element, attr) {
            _super.call(this, element, attr);
            this.element = element;
            this.attr = attr;
            this.domEvents = [];
            this.bindEvents();
        }
        EventBinding.prototype.change = function (event) {
            this.expression.run();
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
                this.element.addEventListener(this.domEvents[i], this.change.bind(this));
            }
        };
        EventBinding.prototype.unbindEvents = function () {
            for (var i = 0; i < this.domEvents.length; i++) {
                this.element.removeEventListener(this.domEvents[i], this.change.bind(this));
            }
        };
        return EventBinding;
    })(bindings.Binding);
    bindings.EventBinding = EventBinding;
})(bindings || (bindings = {}));
var bindingTypes;
(function (bindingTypes) {
    function createBinding(type, element, attr) {
        var binding;
        for (var i in this) {
            if (this[i].id == type) {
                binding = new this[i](element, attr);
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
    var expression = (function () {
        function expression(attr, scope) {
            this.attr = attr;
            this.scope = scope;
            this.success = true;
            this.value = undefined;
            this.dependencies = [];
        }
        expression.prototype.run = function () {
            var data = {
                value: undefined,
                success: true,
            };
            var addedScope = {
                $modal: (this.scope.modal) ? this.scope.modal.scope.object : undefined,
                $parent: (this.scope.parent) ? this.scope.parent.object : undefined
            };
            var funcString = 'new Function("addedScope","', args = [];
            var context = this.scope.object;
            args.push(addedScope);
            funcString += 'with(this){';
            funcString += 'with(addedScope){';
            funcString += 'return ';
            funcString += this.attr.value;
            funcString += '}';
            funcString += '}';
            funcString += '")';
            var func = eval(funcString);
            try {
                data.value = func.apply(context, args);
            }
            catch (e) {
                data.success = false;
            }
            this.value = data.value;
            this.success = data.success;
            return data;
        };
        expression.prototype.runOnScope = function () {
            var data = {
                value: undefined,
                success: false
            };
            var _data = this.getDependencies();
            data.value = _data.gets[_data.gets.length - 1];
            data.success = !!data.value;
            return data;
        };
        expression.prototype.getDependencies = function () {
            var data = {
                success: true,
                requires: [],
                sets: [],
                gets: [] //array of values got
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
            var addedScope = {
                $modal: (this.scope.modal) ? this.buildContextFromScope(this.scope.modal.scope, data) : undefined,
                $parent: (this.scope.parent) ? this.buildContextFromScope(this.scope.parent, data) : undefined
            };
            var funcString = 'new Function("hidden","addedScope",', args = [];
            var context = {};
            args.push(hidden);
            args.push(addedScope);
            //build context
            context = this.buildContextFromScope(this.scope, data);
            funcString += '"';
            funcString += 'with(this){';
            funcString += 'with(hidden){';
            funcString += 'with(addedScope){';
            funcString += 'return ';
            funcString += this.attr.value;
            funcString += '}';
            funcString += '}';
            funcString += '}';
            funcString += '")';
            var func = eval(funcString);
            try {
                func.apply(context, args);
            }
            catch (e) {
                data.success = false;
            }
            this.dependencies = data.requires;
            return data;
        };
        expression.prototype.buildContextFromScope = function (scope, data) {
            var object = (scope.object instanceof Array) ? [] : {};
            for (var i in scope.values) {
                object.__defineGetter__(i, function (object, i, data, fn) {
                    if (data.gets.indexOf(this.values[i]) == -1) {
                        data.requires.push(this.values[i]);
                        data.gets.push(this.values[i]);
                    }
                    if (this.values[i].value instanceof Function) {
                        if (this.values[i] instanceof bindings.Scope) {
                            return fn(this.values[i]);
                            ;
                        }
                        else {
                            return this.values[i].value;
                        }
                    }
                }.bind(scope, object, i, data, this.buildContextFromScope));
                object.__defineSetter__(i, function (object, i, data, fn, val) {
                    data.requires.push(this.values[i]);
                    data.sets.push(this.values[i]);
                    // this.values[i].setValue(val);
                    // object[i] = val;
                }.bind(scope, object, i, data, this.buildContextFromScope));
            }
            ;
            return object;
        };
        return expression;
    })();
    bindings.expression = expression;
})(bindings || (bindings = {}));
/// <reference path="../bindings.ts" />
// bind-click
var bindingTypes;
(function (bindingTypes) {
    var ClickBinding = (function (_super) {
        __extends(ClickBinding, _super);
        function ClickBinding(element, attr) {
            _super.call(this, element, attr);
            this.domEvents = ['click'];
            this.updateEvents();
        }
        ClickBinding.id = 'click';
        return ClickBinding;
    })(bindings.EventBinding);
    bindingTypes.ClickBinding = ClickBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-enabled
var bindingTypes;
(function (bindingTypes) {
    var EnabledBinding = (function (_super) {
        __extends(EnabledBinding, _super);
        function EnabledBinding(element, attr) {
            _super.call(this, element, attr);
            this.run();
        }
        EnabledBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            if (this.expression.value) {
                this.element.removeAttribute('disabled');
            }
            else {
                this.element.setAttribute('disabled', 'disabled');
            }
        };
        EnabledBinding.id = 'enabled';
        return EnabledBinding;
    })(bindings.OneWayBinding);
    bindingTypes.EnabledBinding = EnabledBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-disabled
var bindingTypes;
(function (bindingTypes) {
    var DisabledBinding = (function (_super) {
        __extends(DisabledBinding, _super);
        function DisabledBinding(element, attr) {
            _super.call(this, element, attr);
            this.run();
        }
        DisabledBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            if (!this.expression.value) {
                this.element.removeAttribute('disabled');
            }
            else {
                this.element.setAttribute('disabled', 'disabled');
            }
        };
        DisabledBinding.id = 'disabled';
        return DisabledBinding;
    })(bindings.OneWayBinding);
    bindingTypes.DisabledBinding = DisabledBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-foreach
var bindingTypes;
(function (bindingTypes) {
    var ForEachBinding = (function (_super) {
        __extends(ForEachBinding, _super);
        function ForEachBinding(element, attr) {
            _super.call(this, element, attr);
            this.children = [];
            for (var i = 0; i < this.element.children.length; i++) {
                this.children.push(this.element.children[i]);
            }
            this.removeAllChildren();
            this.run();
        }
        ForEachBinding.prototype.restoreChildren = function () {
            for (var i in this.children) {
                this.element.appendChild(this.children[i]);
            }
        };
        ForEachBinding.prototype.removeAllChildren = function () {
            while (this.element.children.length !== 0) {
                this.element.removeChild(this.element.children[0]);
            }
        };
        ForEachBinding.prototype.run = function () {
            // super.run(); dont run because we arnt going to use .run on are expression
            var scope = this.expression.runOnScope().value;
            this.removeAllChildren();
            if (scope instanceof bindings.Scope) {
                for (var i in scope.values) {
                    for (var k = 0; k < this.children.length; k++) {
                        var el = this.children[k].cloneNode(true);
                        el.__scope__ = scope.values[i];
                        this.element.appendChild(el);
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
        ForEachBinding.id = 'foreach';
        return ForEachBinding;
    })(bindings.OneWayBinding);
    bindingTypes.ForEachBinding = ForEachBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-if
var bindingTypes;
(function (bindingTypes) {
    var IfBinding = (function (_super) {
        __extends(IfBinding, _super);
        function IfBinding(element, attr) {
            _super.call(this, element, attr);
            this.children = [];
            for (var i = 0; i < this.element.children.length; i++) {
                this.children.push(this.element.children[i]);
            }
            this.run();
        }
        IfBinding.prototype.restoreChildren = function () {
            for (var i in this.children) {
                this.element.appendChild(this.children[i]);
            }
        };
        IfBinding.prototype.removeChildren = function () {
            while (this.element.children.length !== 0) {
                this.element.removeChild(this.element.children[0]);
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
        IfBinding.id = 'if';
        return IfBinding;
    })(bindings.OneWayBinding);
    bindingTypes.IfBinding = IfBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-ifnot
var bindingTypes;
(function (bindingTypes) {
    var IfNotBinding = (function (_super) {
        __extends(IfNotBinding, _super);
        function IfNotBinding(element, attr) {
            _super.call(this, element, attr);
            this.children = [];
            for (var i = 0; i < this.element.children.length; i++) {
                this.children.push(this.element.children[i]);
            }
            this.run();
        }
        IfNotBinding.prototype.restoreChildren = function () {
            for (var i in this.children) {
                this.element.appendChild(this.children[i]);
            }
        };
        IfNotBinding.prototype.removeChildren = function () {
            while (this.element.children.length !== 0) {
                this.element.removeChild(this.element.children[0]);
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
        IfNotBinding.id = 'ifnot';
        return IfNotBinding;
    })(bindings.OneWayBinding);
    bindingTypes.IfNotBinding = IfNotBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-live-update
var bindingTypes;
(function (bindingTypes) {
    var LiveUpdateBinding = (function (_super) {
        __extends(LiveUpdateBinding, _super);
        function LiveUpdateBinding(element, attr) {
            _super.call(this, element, attr);
            this.domEvents = ['input'];
            this.updateEvents();
        }
        LiveUpdateBinding.prototype.change = function (event) {
            //super.change(event); //dont run the expression because we dont have on
            if ("createEvent" in document) {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                this.element.dispatchEvent(evt);
            }
        };
        LiveUpdateBinding.id = 'live-update';
        return LiveUpdateBinding;
    })(bindings.EventBinding);
    bindingTypes.LiveUpdateBinding = LiveUpdateBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-repeat
var bindingTypes;
(function (bindingTypes) {
    var RepeatBinding = (function (_super) {
        __extends(RepeatBinding, _super);
        function RepeatBinding(element, attr) {
            _super.call(this, element, attr);
            this.children = [];
            for (var i = 0; i < this.element.children.length; i++) {
                this.children.push(this.element.children[i]);
            }
            this.removeChildren();
            this.run();
        }
        RepeatBinding.prototype.restoreChildren = function () {
            for (var i in this.children) {
                this.element.appendChild(this.children[i]);
            }
        };
        RepeatBinding.prototype.removeChildren = function () {
            while (this.element.children.length !== 0) {
                this.element.removeChild(this.element.children[0]);
            }
        };
        RepeatBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.removeChildren();
            for (var i = 0; i < this.expression.value; i++) {
                for (var k = 0; k < this.children.length; k++) {
                    var el = this.children[k].cloneNode(true);
                    this.element.appendChild(el);
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
        RepeatBinding.id = 'repeat';
        return RepeatBinding;
    })(bindings.OneWayBinding);
    bindingTypes.RepeatBinding = RepeatBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-submit
var bindingTypes;
(function (bindingTypes) {
    var SubmitBinding = (function (_super) {
        __extends(SubmitBinding, _super);
        function SubmitBinding(element, attr) {
            _super.call(this, element, attr);
            this.domEvents = ['submit'];
            this.updateEvents();
        }
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
// bind-text
var bindingTypes;
(function (bindingTypes) {
    var TextBinding = (function (_super) {
        __extends(TextBinding, _super);
        function TextBinding(element, attr) {
            _super.call(this, element, attr);
            this.oldText = this.element.textContent;
            this.run();
        }
        TextBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.element.innerText = this.expression.value;
        };
        TextBinding.prototype.unbind = function () {
            _super.prototype.unbind.call(this);
            this.element.textContent = this.oldText;
        };
        TextBinding.id = 'text';
        return TextBinding;
    })(bindings.OneWayBinding);
    bindingTypes.TextBinding = TextBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
//bind-value
var bindingTypes;
(function (bindingTypes) {
    var ValueBinding = (function (_super) {
        __extends(ValueBinding, _super);
        function ValueBinding(element, attr) {
            _super.call(this, element, attr);
            this.element = element;
            this.domEvents = ['change'];
            this.updateEvents();
        }
        ValueBinding.prototype.run = function () {
            this.element.value = this.expression.value;
        };
        ValueBinding.prototype.change = function (event) {
            _super.prototype.change.call(this, event);
            var value = this.expression.runOnScope().value;
            if (value instanceof bindings.Value) {
                value.updateValue(this.element.value);
            }
        };
        ValueBinding.id = 'value';
        return ValueBinding;
    })(bindings.TwoWayBinding);
    bindingTypes.ValueBinding = ValueBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-with
var bindingTypes;
(function (bindingTypes) {
    var WithBinding = (function (_super) {
        __extends(WithBinding, _super);
        function WithBinding(element, attr) {
            _super.call(this, element, attr);
            this.run();
        }
        WithBinding.prototype.run = function () {
            // super.run(); dont run because we arnt going to use .run on are expression
            var scope = this.expression.runOnScope().value;
            if (scope instanceof bindings.Scope) {
                for (var i = 0; i < this.element.children.length; i++) {
                    var el = this.element.children[i];
                    el.__scope__ = scope;
                }
            }
            else {
                throw new Error('bind-with requires a Object or Array');
            }
        };
        WithBinding.id = 'with';
        return WithBinding;
    })(bindings.OneWayBinding);
    bindingTypes.WithBinding = WithBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-html
var bindingTypes;
(function (bindingTypes) {
    var HTMLBinding = (function (_super) {
        __extends(HTMLBinding, _super);
        function HTMLBinding(element, attr) {
            _super.call(this, element, attr);
            this.oldText = this.element.textContent;
            this.run();
        }
        HTMLBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.element.innerHTML = this.expression.value;
        };
        HTMLBinding.prototype.unbind = function () {
            _super.prototype.unbind.call(this);
            this.element.textContent = this.oldText;
        };
        HTMLBinding.id = 'html';
        return HTMLBinding;
    })(bindings.OneWayBinding);
    bindingTypes.HTMLBinding = HTMLBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-visible
var bindingTypes;
(function (bindingTypes) {
    var VisibleBinding = (function (_super) {
        __extends(VisibleBinding, _super);
        function VisibleBinding(element, attr) {
            _super.call(this, element, attr);
            this.run();
        }
        VisibleBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            if (this.expression.value) {
                this.element.style.display = '';
            }
            else {
                this.element.style.display = 'none';
            }
        };
        VisibleBinding.id = 'visible';
        return VisibleBinding;
    })(bindings.OneWayBinding);
    bindingTypes.VisibleBinding = VisibleBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-href
var bindingTypes;
(function (bindingTypes) {
    var HrefBinding = (function (_super) {
        __extends(HrefBinding, _super);
        function HrefBinding(element, attr) {
            _super.call(this, element, attr);
            this.run();
        }
        HrefBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.element.setAttribute('href', this.expression.value);
        };
        HrefBinding.id = 'href';
        return HrefBinding;
    })(bindings.OneWayBinding);
    bindingTypes.HrefBinding = HrefBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="../bindings.ts" />
// bind-src
var bindingTypes;
(function (bindingTypes) {
    var SrcBinding = (function (_super) {
        __extends(SrcBinding, _super);
        function SrcBinding(element, attr) {
            _super.call(this, element, attr);
            this.run();
        }
        SrcBinding.prototype.run = function () {
            _super.prototype.run.call(this);
            this.element.setAttribute('src', this.expression.value);
        };
        SrcBinding.id = 'src';
        return SrcBinding;
    })(bindings.OneWayBinding);
    bindingTypes.SrcBinding = SrcBinding;
})(bindingTypes || (bindingTypes = {}));
/// <reference path="eventEmiter.ts" />
/// <reference path="modal.ts" />
/// <reference path="scope.ts" />
/// <reference path="value.ts" />
/// <reference path="binding.ts" />
/// <reference path="expression.ts" />
//types
/// <reference path="bindings/click.ts" />
/// <reference path="bindings/enabled.ts" />
/// <reference path="bindings/disabled.ts" />
/// <reference path="bindings/foreach.ts" />
/// <reference path="bindings/if.ts" />
/// <reference path="bindings/ifnot.ts" />
/// <reference path="bindings/live-update.ts" />
/// <reference path="bindings/repeat.ts" />
/// <reference path="bindings/submit.ts" />
/// <reference path="bindings/text.ts" />
/// <reference path="bindings/value.ts" />
/// <reference path="bindings/with.ts" />
/// <reference path="bindings/html.ts" />
/// <reference path="bindings/visible.ts" />
/// <reference path="bindings/href.ts" />
/// <reference path="bindings/src.ts" />
var bindings;
(function (bindings) {
    function createModal(object, element) {
        if (object === void 0) { object = {}; }
        if (element === void 0) { element = document; }
        if (element instanceof Document)
            element = element.body;
        var modal = new bindings.Modal(object, element);
        object._bindings = modal;
        return object;
    }
    bindings.createModal = createModal;
    function applyBindings(modal, element) {
        if (modal === void 0) { modal = {}; }
        if (element === void 0) { element = document; }
        if (element instanceof Document)
            element = element.body;
        if (modal instanceof bindings.Modal) {
            modal.applyBindings(element);
        }
        else if (modal._bindings instanceof bindings.Modal) {
            modal._bindings.applyBindings(element);
        }
    }
    bindings.applyBindings = applyBindings;
    function duplicateObject(obj2, count) {
        if (count === void 0) { count = 20; }
        if (obj2 instanceof Object && obj2 !== null) {
            // count = (count !== undefined)? count : 20;
            if (count > 0) {
                // see if its an array
                if (obj2.hasOwnProperty('length')) {
                    var obj = new Array(0);
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
                    var obj;
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
    bindings.duplicateObject = duplicateObject;
    function noop() { }
    bindings.noop = noop;
})(bindings || (bindings = {}));
//# sourceMappingURL=bindings.js.map