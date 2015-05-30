(function(ctx){

// Object.observe pollyfill https://github.com/MaxArt2501/object-observe
Object.observe||function(e,t,n){"use strict";var r,o,i=["add","update","delete","reconfigure","setPrototype","preventExtensions"],s=t.isArray||function(e){return function(t){return"[object Array]"===e.call(t)}}(e.prototype.toString),c=t.prototype.indexOf?t.indexOf||function(e,n,r){return t.prototype.indexOf.call(e,n,r)}:function(e,t,n){for(var r=n||0;r<e.length;r++)if(e[r]===t)return r;return-1},a="undefined"!=typeof n.Map&&Map.prototype.forEach?function(){return new Map}:function(){var e=[],t=[];return{size:0,has:function(t){return c(e,t)>-1},get:function(n){return t[c(e,n)]},set:function(n,r){var o=c(e,n);-1===o?(e.push(n),t.push(r),this.size++):t[o]=r},"delete":function(n){var r=c(e,n);r>-1&&(e.splice(r,1),t.splice(r,1),this.size--)},forEach:function(n){for(var r=0;r<e.length;r++)n.call(arguments[1],t[r],e[r],this)}}},f=e.getOwnPropertyNames?function(){var t=e.getOwnPropertyNames;try{arguments.callee}catch(n){var r=(t(c).join(" ")+" ").replace(/prototype |length |name /g,"").slice(0,-1).split(" ");r.length&&(t=function(t){var n=e.getOwnPropertyNames(t);if("function"==typeof t)for(var o,i=0;i<r.length;)(o=c(n,r[i++]))>-1&&n.splice(o,1);return n})}return t}():function(t){var n,r,o=[];if("hasOwnProperty"in t)for(n in t)t.hasOwnProperty(n)&&o.push(n);else{r=e.hasOwnProperty;for(n in t)r.call(t,n)&&o.push(n)}return s(t)&&o.push("length"),o},u=e.getPrototypeOf,p=e.defineProperties&&e.getOwnPropertyDescriptor,l=n.requestAnimationFrame||n.webkitRequestAnimationFrame||function(){var e=+new Date,t=e;return function(n){return setTimeout(function(){n((t=+new Date)-e)},17)}}(),h=function(e,t,n){var o=r.get(e);o?j(e,o,t,n):(o=d(e),j(e,o,t,n),1===r.size&&l(v))},d=function(t,n){var o,i=f(t),s=[],c=0,n={handlers:a(),frozen:e.isFrozen?e.isFrozen(t):!1,extensible:e.isExtensible?e.isExtensible(t):!0,proto:u&&u(t),properties:i,values:s,notifier:y(t,n)};if(p)for(o=n.descriptors=[];c<i.length;)o[c]=p(t,i[c]),s[c]=t[i[c++]];else for(;c<i.length;)s[c]=t[i[c++]];return r.set(t,n),n},b=function(){var t=p?function(e,t,n,r,o){var i=t.properties[n],s=e[i],c=t.values[n],a=t.descriptors[n];"value"in o&&(c===s?0===c&&1/c!==1/s:c===c||s===s)&&(w(e,t,{name:i,type:"update",object:e,oldValue:c},r),t.values[n]=s),!a.configurable||o.configurable&&o.writable===a.writable&&o.enumerable===a.enumerable&&o.get===a.get&&o.set===a.set||(w(e,t,{name:i,type:"reconfigure",object:e,oldValue:c},r),t.descriptors[n]=o)}:function(e,t,n,r){var o=t.properties[n],i=e[o],s=t.values[n];(s===i?0===s&&1/s!==1/i:s===s||i===i)&&(w(e,t,{name:o,type:"update",object:e,oldValue:s},r),t.values[n]=i)},n=p?function(e,n,r,o,i){for(var s,c=n.length;r&&c--;)null!==n[c]&&(s=p(e,n[c]),r--,s?t(e,o,c,i,s):(w(e,o,{name:n[c],type:"delete",object:e,oldValue:o.values[c]},i),o.properties.splice(c,1),o.values.splice(c,1),o.descriptors.splice(c,1)))}:function(e,t,n,r,o){for(var i=t.length;n&&i--;)null!==t[i]&&(w(e,r,{name:t[i],type:"delete",object:e,oldValue:r.values[i]},o),r.properties.splice(i,1),r.values.splice(i,1),n--)};return function(r,o,i){if(r.handlers.size&&!r.frozen){var s,a,l,h,d,b,v,g,y=r.values,j=r.descriptors,m=0;if(r.extensible)if(s=r.properties.slice(),a=s.length,l=f(o),j){for(;m<l.length;)d=l[m++],h=c(s,d),g=p(o,d),-1===h?(w(o,r,{name:d,type:"add",object:o},i),r.properties.push(d),y.push(o[d]),j.push(g)):(s[h]=null,a--,t(o,r,h,i,g));n(o,s,a,r,i),e.isExtensible(o)||(r.extensible=!1,w(o,r,{type:"preventExtensions",object:o},i),r.frozen=e.isFrozen(o))}else{for(;m<l.length;)d=l[m++],h=c(s,d),b=o[d],-1===h?(w(o,r,{name:d,type:"add",object:o},i),r.properties.push(d),y.push(b)):(s[h]=null,a--,t(o,r,h,i));n(o,s,a,r,i)}else if(!r.frozen){for(;m<s.length;m++)d=s[m],t(o,r,m,i,p(o,d));e.isFrozen(o)&&(r.frozen=!0)}u&&(v=u(o),v!==r.proto&&(w(o,r,{type:"setPrototype",name:"__proto__",object:o,oldValue:r.proto}),r.proto=v))}}}(),v=function(){r.size&&(r.forEach(b),o.forEach(g),l(v))},g=function(e,t){e.changeRecords.length&&(t(e.changeRecords),e.changeRecords=[])},y=function(e,t){return arguments.length<2&&(t=r.get(e)),t&&t.notifier||{notify:function(t){t.type;var n=r.get(e);if(n){var o,i={object:e};for(o in t)"object"!==o&&(i[o]=t[o]);w(e,n,i)}},performChange:function(t,n){if("string"!=typeof t)throw new TypeError("Invalid non-string changeType");if("function"!=typeof n)throw new TypeError("Cannot perform non-function");var o,i,s=r.get(e),c=n.call(arguments[2]);if(s&&b(s,e,t),s&&c&&"object"==typeof c){i={object:e,type:t};for(o in c)"object"!==o&&"type"!==o&&(i[o]=c[o]);w(e,s,i)}}}},j=function(e,t,n,r){var i=o.get(n);i||o.set(n,i={observed:a(),changeRecords:[]}),i.observed.set(e,{acceptList:r.slice(),data:t}),t.handlers.set(n,i)},w=function(e,t,n,r){t.handlers.forEach(function(t){var o=t.observed.get(e).acceptList;("string"!=typeof r||-1===c(o,r))&&c(o,n.type)>-1&&t.changeRecords.push(n)})};r=a(),o=a(),e.observe=function(t,n,r){if(!t||"object"!=typeof t&&"function"!=typeof t)throw new TypeError("Object.observe cannot observe non-object");if("function"!=typeof n)throw new TypeError("Object.observe cannot deliver to non-function");if(e.isFrozen&&e.isFrozen(n))throw new TypeError("Object.observe cannot deliver to a frozen function object");if(arguments.length>2){if(!r||"object"!=typeof r)throw new TypeError("Object.observe cannot use non-object accept list")}else r=i;return h(t,n,r),t},e.unobserve=function(e,t){if(null===e||"object"!=typeof e&&"function"!=typeof e)throw new TypeError("Object.unobserve cannot unobserve non-object");if("function"!=typeof t)throw new TypeError("Object.unobserve cannot deliver to non-function");var n,i=o.get(t);return i&&(n=i.observed.get(e))&&(i.observed.forEach(function(e,t){b(e.data,t)}),l(function(){g(i,t)}),1===i.observed.size&&i.observed.has(e)?o["delete"](t):i.observed["delete"](e),1===n.data.handlers.size?r["delete"](e):n.data.handlers["delete"](t)),e},e.getNotifier=function(t){if(null===t||"object"!=typeof t&&"function"!=typeof t)throw new TypeError("Object.getNotifier cannot getNotifier non-object");return e.isFrozen&&e.isFrozen(t)?null:y(t)},e.deliverChangeRecords=function(e){if("function"!=typeof e)throw new TypeError("Object.deliverChangeRecords cannot deliver to non-function");var t=o.get(e);t&&(t.observed.forEach(function(e,t){b(e.data,t)}),g(t,e))}}(Object,Array,this);

bindings = {
	bindings: {},
	createModal: function(object,options){
		var modal = new this.Modal(object,options);
		object._binding = modal;

		return object;
	},
	applyBindings: function(modal,el){
		modal = modal || {};
		if(modal instanceof this.Modal){
			modal.applyBindings(el)
		}
		else if(modal._binding instanceof this.Modal){
			modal._binding.applyBindings(el)
		}
	},

	_applyBindings: function(el,scope){
		var _bindings = [];
		for (var i = 0; i < el.childNodes.length; i++) {
			_bindings = _bindings.concat(this._parseBindings(el.childNodes[i],scope));
			if(el.childNodes[i].childNodes){
				_bindings = _bindings.concat(this._applyBindings(el.childNodes[i],scope));
			}
		};
		return _bindings;
	},
	_parseBindings: function(el,scope){
		var _bindings = [];
		if(el instanceof Node){
			var attrs = el.attributes || [];
			for (var i = 0; i < attrs.length; i++) {
				var attr = attrs.item(i);
				var id = attr.name;
				//find the binding attrs and extract the src
				if(id.search('bind-') !== -1){
					id = id.substr(id.indexOf('-')+1,id.length);
					var src = attr.value;
					_bindings.push(new bindings.Binding(el,src,scope,id));
				}
			};
		}
		return _bindings;
	},
	_eval: function(string,ctx,justValue){
		ctx = ctx || window;
		var val, success = true, args = [];
		var func = 'new Function(';

		//add the args
		for (var i in ctx) {
			func += '"'+i+'",';
			args.push(ctx[i]);
		};
		func += '"';
		func += "return ";
		func += string;
		func += '")';
		func = eval(func);

		try{
			val = func.apply(ctx,args);
		}
		catch(e){
			success = false;
		}

		return (justValue)? val : {value: val, success: success};
	}
}

// modal
bindings.Modal = function(object,options){
	this.options = options || {};
	this.scope = new bindings.Scope('',object);
	return this;
};
bindings.Modal.prototype = {
	bindings: [], //an array of bindings with dom elements
	options: {},
	scope: undefined,
	applyBindings: function(el){
		if(el) this.options.element = el;

		this.bindings = bindings._applyBindings(this.options.element,this.scope);
	},
	getBinding: function(el){
		for (var i = 0; i < this.bindings.length; i++) {
			if(this.bindings[i].el === el){
				return this.bindings[i];
			}
		};
	},
	removeBinding: function(el){
		var binding = this.getBinding(el);
		if(binding){
			binding.unbind();

			for (var i = 0; i < this.bindings.length; i++) {
				if(this.bindings[i].el === el){
					delete this.bindings[i];
					return;
				}
			};
		}
	},
	removeAllBindings: function(){
		for (var i = 0; i < this.bindings.length; i++) {
			this.bindings[i].unbind();
		};
		this.bindings = [];
	}
}
bindings.Modal.prototype.constructor = bindings.Modal;

// scope
bindings.Scope = function(key,data){ //creates scope object from data
	data = data || {};
	this.key = key || '';
	this.object = data;
	this.values = (data.hasOwnProperty('length'))? [] : {};
	this.events = {};
	this.updateKeys(data);

	//listen for events on object
	Object.observe(this.object,function(data){
		for (var i = 0; i < data.length; i++) {
			if(data[i].name == '_binding') continue;

			switch(data[i].type){
				case 'add':
					this.addKey(data[i].name,data[i].object[data[i].name]);
					break;
				case 'update':
					this.updateKey(data[i].name,data[i].object[data[i].name]);
					break;
				case 'delete':
					this.removeKey(data[i].name);
					break;
			}
		};
	}.bind(this))

	return this;
};
bindings.Scope.prototype = {
	events: {},
	object: undefined,
	values: undefined,
	addKey: function(key,value){
		if(typeof value == 'object'){
			this.values[key] = new bindings.Scope(key,value);
		}
		else{
			this.values[key] = new bindings.Value(key,value);
		}
		this.emit('change')
	},
	removeKey: function(key){
		delete this.values[key];
		this.emit('change')
	},
	updateKey: function(key,value){
		if(!this.values[key]) this.addKey(key,value);
		if(this.values[key] instanceof bindings.Value){
			this.values[key].setValue(value);
		}
		else if(this.values[key] instanceof bindings.Scope){
			this.values[key].updateKeys(value);
		}
		this.emit('change')
	},
	updateKeys: function(keys){
		for (var i in keys) {
			this.updateKey(i,keys[i]);
		};
	},
	on: function(event,fn,ctx){
		if(!this.events[event]) this.events[event] = [];
		if(ctx) fn = fn.bind(ctx);
		this.events[event].push(fn);
	},
	off: function(event,fn){
		if(!this.events[event]) this.events[event] = [];
		if(this.events[event].indexOf(fn) !== -1){
			this.events[event].splice(this.events[event].indexOf(fn),1);
		}
	},
	emit: function(event,data){
		if(!this.events[event]) this.events[event] = [];
		for (var i = 0; i < this.events[event].length; i++) {
		 	this.events[event][i](data);
	 	};
	},
}
bindings.Scope.prototype.constructor = bindings.Scope;

// value
bindings.Value = function(key,val){
	this.key = key;
	this.value = val;
	this.events = {};

	return this;
};
bindings.Value.prototype = {
	value: undefined,
	events: {},
	on: function(event,fn,ctx){
		if(!this.events[event]){
			this.events[event] = [];
		}
		if(ctx) fn = fn.bind(ctx);
		this.events[event].push(fn);
	},
	off: function(event,fn){
		if(!this.events[event]){
			this.events[event] = [];
		}
		if(this.events[event].indexOf(fn) !== -1){
			this.events[event].splice(this.events[event].indexOf(fn),1);
		}
	},
	emit: function(event,data){
		if(!this.events[event]){
			this.events[event] = [];
		}
		for (var i = 0; i < this.events[event].length; i++) {
		 	this.events[event][i](data);
	 	};
	},
	setValue: function(val){
		this.value = val;
		this.emit('change',val);
	}
}
bindings.Value.prototype.constructor = bindings.Value;

// binding
bindings.Binding = function(el,src,scope,type){ //type is id in the bindings array
	this.el = el;
	this.src = new bindings.Src(src,scope);
	this.type = type;

	//apply type
	var type = bindings.bindings[type];
	for (var i in type) {
		this[i] = type[i];
	};

	this._bind();
	this._update();

	return this;
}
bindings.Binding.prototype = {
	el: undefined,
	src: undefined, //src
	_bind: function(){
		//unbind all bindings
		if(this.src.values.length){
			for (var i = 0; i < this.src.values.length; i++) {
				this.src.values[i].off('change',this._update.bind(this));
			};
		}
		//bind to values change events
		for (var i = 0; i < this.src.values.length; i++) {
			this.src.values[i].on('change',this._update.bind(this));
		};
		this.bind();
	},
	_update: function(){
		this.update();
	},
	_unbind: function(){
		//unbind all bindings
		for (var i = 0; i < this.src.values.length; i++) {
			this.src.values[i].off('change',this._update.bind(this));
		};
		this.unbind();
	},

	//set these in the when defining bindings
	bind: function(el){ //binds to dom events

	},
	unbind: function(el){ //unbinds from dom events

	},
	update: function(el,val){ //updates dom el, val is parsed from the src

	}
}
bindings.Binding.prototype.constructor = bindings.Binding;

// src
bindings.Src = function(srcString,scope){
	this.string = srcString || '';
	this.scope = scope;

	this.updateValues();

	return this;
}
bindings.Src.prototype = {
	value: undefined,
	success: true,
	sting: '',
	scope: undefined,
	values: [],
	update: function(){
		//run string
		var e = bindings._eval(this.string,this.scope.object);
		this.value = e.value;
		this.success = e.success;
	},
	updateValues: function(){
		this.values = [];
		//scan string for values in scope
		for (var i in this.scope.values) {
			if(this.string.search(i) !== -1){
				this.values.push(this.scope.values[i]);
			}
		};

		//if the eval failed bind to change event on scope to wait for new value
		this.values.push(this.scope);
	}
}
bindings.Src.prototype.constructor = bindings.Src;

// binding types
bindings.bindings['text'] = {
	update: function(){
		this.src.update();
		this.el.textContent = this.src.value;
	}
}

bindings.bindings['click'] = {
	update: function(){
		this.event = this.event || function(){
			this.src.update();
		}.bind(this)
		this.el.removeEventListener('click',this.event);
		this.el.addEventListener('click',this.event);
	}
}

bindings.bindings['with'] = {
}

ctx.bindings = bindings;
})(window)