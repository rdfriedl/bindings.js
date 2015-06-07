/**
 * the main NameSpace for bindings.js
 *
 * @namespace bindings
 */
bindings = {
	bindings: {},

	/**
	 * Creates a new {@link bindings.Modal} based on an Object
	 *
	 * @param {Object} Object - The Object that the {@link bindings.Modal} will use.
	 * @param {Object} Options - An Object that contains options.
	 */
	createModal: function(object,options){
		var modal = new this.Modal(object,options);
		object._binding = modal;

		return object;
	},

	/**
	 * Binds a {@link bindings.Modal} to a dom element.
	 * 
	 * @param {bindings.Modal} Modal - The Modal to bind.
	 * @param {Node} Element - The Element to bind to.
	 */
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
		if(!(el instanceof Node)) throw new Error('first argument has to be a Node');
		if(!(scope instanceof bindings.Scope) && !(scope instanceof bindings.Value)) throw new Error('second argument has to be a Scope or a Value');
		var _bindings = [];

		//remove old bindings
		if(el.__bindings__){
			for (var i = el.__bindings__.length - 1; i >= 0; i--) {
				el.__bindings__[i]._unbind();
			};
			el.__bindings__ = [];
		}
		var data = bindings._parseBindings(el,scope);
		el.__bindings__ = data;

		_bindings = _bindings.concat(el.__bindings__);

		//loop through and bind children
		if(el.children){
			for (var i = 0; i < el.children.length; i++) {
				el.children[i].__scope__ = el.children[i].__scope__ || scope;
				bindings._applyBindings(el.children[i],el.children[i].__scope__);
				_bindings = _bindings.concat(el.children[i].__bindings__);
			};
		}

		return _bindings;
	},
	_parseBindings: function(el,scope){ //parses bindings for a specific element 
		if(!(el instanceof Node)) throw new Error('first argument has to be a Node');
		if(!(scope instanceof bindings.Scope) && !(scope instanceof bindings.Value)) throw new Error('second argument has to be a Scope or a Value');

		var _bindings = [];
		var attrs = el.attributes || [];
		for (var i = 0; i < attrs.length; i++) {
			var attr = attrs.item(i);
			var id = attr.name;
			//find the binding attrs and extract the src
			if(id.search('bind-') !== -1){
				id = id.substr(id.indexOf('-')+1,id.length);
				var src = attr.value;
				var binding = new bindings.Binding(el,src,scope,id);
				_bindings.push(binding);
			}
		};
		return _bindings;
	},
	_modalChange: function(scope,data){ //handles events from the modal object changing
		for (var i = 0; i < data.length; i++) {
			if(data[i].name == '_binding') continue;

			switch(data[i].type){
				case 'add':
					scope.setKey(data[i].name,data[i].object[data[i].name],true);
					break;
				case 'update':
					scope.setKey(data[i].name,data[i].object[data[i].name],true);
					break;
				case 'delete':
					scope.removeKey(data[i].name,true);
					break;
			}
		};
		scope.update();
	},
	_nodeChange: function(event){ //handles events for dom changes
		event.stopPropagation();

		var scope = event.target.__scope__ || event.relatedNode.__scope__;
		if(scope){
			bindings._applyBindings(event.target,scope);
		}
	},
	_eval: function(string,scope){
		if(!(scope instanceof bindings.Scope) && !(scope instanceof bindings.Value)) throw new Error('second argument has to be a Scope or a Value');

		string = string || '';
		var data = {
			value: undefined,
			success: true,
		}

		var func = 'new Function("', args = [];
		var context = scope.value;

		func += 'with(this){';
		func += 'return ';
		func += string;
		func += '}';
		func += '")';
		func = eval(func);

		try{
			data.value = func.apply(context,args);
		}
		catch(e){
			data.success = false;
		}

		return data;
	},
	_evalRequires: function(string,scope){ //only binds to values/scopes on the first level
		if(!(scope instanceof bindings.Scope) && !(scope instanceof bindings.Value)) throw new Error('second argument has to be a Scope or a Value');

		string = string || '';
		var data = {
			success: true,
			requires: [], //all values in this src
			sets: [], //array of values set
			gets: [] //array of values got
		}
		var scopeVars = {
			console: {},
			window: {},
			navigator:{},
			localStorage: {},
			location: {},
			alert: bindings.noop,
			eval: bindings.noop
		}

		//compile scope
		var buildContextFromScope = function(s){
			var o = new s.values.__proto__.constructor;
			for (var i in s.values) {
				o.__defineGetter__(i,function(o,i,data){
					data.requires.push(this.values[i]);
					data.gets.push(this.values[i]);

					if(typeof this.values[i].value !== 'function'){
						if(this.values[i] instanceof bindings.Scope){
							return buildContextFromScope(this.values[i]);;
						}
						else{
							return this.values[i].value;
						}
					}
				}.bind(s,o,i,data))

				o.__defineSetter__(i,function(o,i,data,val){
					data.requires.push(this.values[i]);
					data.sets.push(this.values[i]);
					
					// this.values[i].setValue(val);
					// o[i] = val;
				}.bind(s,o,i,data))
			};
			return o;
		}

		var func = 'new Function(', args = [];
		var context = {};

		//add scopeVars
		for (var i in scopeVars) {
			func += '"' + i + '",';
			args.push(scopeVars[i])
		};
		if(scope instanceof bindings.Scope){
			context = buildContextFromScope(scope);

			//reset gets & sets
			data.gets = [];
			data.sets = [];
			data.requires = [];
		}
		else if(scope instanceof bindings.Value){ //NOTE going to have to test/fix this for using values as a ctx for eval
			context = scope.value;
		}

		func += '"with(this){';
		func += 'return ';
		func += string;
		func += '}';
		func += '")';
		func = eval(func);

		try{
			func.apply(context,args);
		}
		catch(e){
			data.success = false;
		}

		//remove duplicates
		var d = [];
		for (var i = 0; i < data.requires.length; i++) {
			if(d.indexOf(data.requires[i]) == -1) d.push(data.requires[i]);
		};
		data.requires = d;

		return data;
	},
	_evalOnScope: function(){ //just like _eval but returns a scope or value, best used with simple expresion like { this.someValue }, this works { this.someValue + 'string' } but is not recomended as it will return only the first value that is gotten
		var data = {
			value: undefined,
			success: false
		}
		var _data = bindings._evalRequires.apply(this,arguments);
		data.value = _data.gets[_data.gets.length-1];
		data.success = !!data.value;
		return data;
	},
	_duplicateObject: function(obj2,count){
		if(typeof obj2 == 'object' && obj2 !== null){
			count = (count !== undefined)? count : 20;
			if(count > 0){
				// see if its an array
				if(obj2.hasOwnProperty('length')){
					var obj = []
					for (var i = 0; i < obj2.length; i++) {
						if(typeof obj2[i] !== 'object'){
							obj[i] = obj2[i]
						}
						else{
							obj[i] = bindings._duplicateObject(obj2[i],count-1)
						}
					};
				}
				else{
					var obj = {}
					for (var i in obj2){
						if(typeof obj2[i] !== 'object'){
							obj[i] = obj2[i]
						}
						else{
							obj[i] = bindings._duplicateObject(obj2[i],count-1)
						}
					}
				}
			}
			return obj;
		}
		else{
			return obj2
		}
	},
	noop: function(){}
}

/**
 * Modal class
 *
 * @class
 * @param {Object} Object - The object that this modal will use.
 * @param {Object} Options - A object that contains options.
 */
bindings.Modal = function(object,options){
	this.options = Object.create(this.options);
	this.scope = new bindings.Scope('',object);

	options = options || {};
	for(var i in options){
		this.options[i] = options[i];
	}

	return this;
};
bindings.Modal.prototype = {
	/**
	 * @property {Array} Bindings - An Array of {@link bindings.Binding} made with this Modals {@link bindings.Modal#scope|Scope} and its dom element its bound to
	 *
	 */
	bindings: [], //an array of bindings with dom elements
	options: {
		element: document
	},

	/**
	 * @property {bindings.Scope} scope - The Root {@link bindings.Scope|Scope} for this Modal
	 */
	scope: undefined,

	/**
	 * Binds this Modals {@link bindings.Modal#scope|Scope} to a dom element
	 *
	 * @param {Node} Element - The element to bind to.
	 */
	applyBindings: function(el){
		if(!(el instanceof Node) && el) throw new Error('first argument has to be a Node');

		if(el) this.options.element = el;

		this.removeAllBindings();
		this.bindings = bindings._applyBindings(this.options.element,this.scope);

		this.options.element.removeEventListener('DOMNodeInserted',bindings._nodeChange);
		this.options.element.addEventListener('DOMNodeInserted',bindings._nodeChange);

		this.options.element.removeEventListener('DOMNodeRemoved',bindings._nodeChange);
		this.options.element.addEventListener('DOMNodeRemoved',bindings._nodeChange);
	},
	getBinding: function(el){
		if(!(el instanceof Node)) throw new Error('first argument has to be a Node');

		for (var i = 0; i < this.bindings.length; i++) {
			if(this.bindings[i].el === el){
				return this.bindings[i];
			}
		};
	},
	removeBinding: function(el){
		if(!(el instanceof Node)) throw new Error('first argument has to be a Node');

		var binding = this.getBinding(el);
		if(binding){
			binding._unbind();

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
			this.bindings[i]._unbind();
		};
		this.bindings = [];
	}
}
bindings.Modal.prototype.constructor = bindings.Modal;

/**
 * Reprsents a Object or Array on the a {@link bindings.Modal} or {@link bindings.Scope}
 *
 * @class
 * @param {String} Key - the key of this Scope in its parent.
 * @param {Object} Object - the Object this scope will handle.
 * @param {bindings.Modal|bindings.Scope} [Parent] - The parnet Modal or Scope for this Scope
 */
bindings.Scope = function(key,data,parent){ //creates scope object from data
	data = data || {};
	this.key = key || '';
	this.value = data;
	this.values = (data.hasOwnProperty('length'))? [] : {};
	this.events = {};
	this.parent = parent;
	this.setKeys(data);

	//listen for events on object
	Object.observe(this.value,bindings._modalChange.bind(this,this))

	return this;
};
bindings.Scope.prototype = {
	events: {},
	object: undefined,
	parent: undefined,
	values: undefined,
	getKey: function(value){ //finds a key based on a value
		for (var i in this.values) {
			if(this.values[i].value == value){
				return i;
			}
		};
	},

	/**
	 * Sets a key in this Scope
	 *
	 * @param {String} Key - The key to set.
	 * @param {*} Value
	 * @param {boolean} DontUpdate - Set to true to prevent from firing the change event.
	 */
	setKey: function(key,value,dontFire){
		if(this.values[key] == undefined){
			//add it
			if(typeof value == 'object'){
				this.values[key] = new bindings.Scope(key,value,this);
			}
			else{
				this.values[key] = new bindings.Value(key,value,this);
			}
		}

		if(this.values[key] instanceof bindings.Value){
			this.values[key].setValue(value);
		}
		else if(this.values[key] instanceof bindings.Scope){
			this.values[key].setKeys(value);
		}
		if(!dontFire) this.emit('change',this);
	},

	/**
	 * Sets mutiple keys in the Scope
	 *
	 * @param {Object} Keys - An Object consisting of key - value pares.
	 * @param {boolean} DontUpdate - Set to true to prevent from firing the change event.
	 */
	setKeys: function(keys,dontFire){
		keys = keys || {};
		for (var i in keys) {
			this.setKey(i,keys[i],true);
		};
		if(!dontFire) this.emit('change',this);
	},

	/**
	 * Removes a Key from this Scope
	 *
	 * @param {String} Key
	 * @param {boolean} DontUpdate - Set to true to prevent from firing the change event.
	 */
	removeKey: function(key,dontFire){
		delete this.values[key];
		if(!dontFire) this.emit('change',this);
	},
	updateKey: function(key,value){ //update key on modal object
		this.value[key] = value;
	},
	updateKeys: function(keys){ //update key on modal object
		for(var i in keys){
			this.updateKey(i,keys[i]);
		}
	},

	/**
	 * Fires the change event
	 */
	update: function(){
		this.emit('change',this)
	},

	/**
	 * Listen for an event
	 *
	 * @public
	 * @param {String} Event
	 * @param {Function} Handler - The function that will be called when the event fires
	 */
	on: function(event,fn,ctx){
		if(!this.events[event]) this.events[event] = [];
		if(ctx) fn = fn.bind(ctx);
		this.events[event].push(fn);
	},

	/**
	 * Stop Listening for an event
	 *
	 * @public
	 * @param {String} Event
	 * @param {Function} Handler - The function that will be called when the event fires
	 */
	off: function(event,fn){
		if(!this.events[event]) this.events[event] = [];
		if(this.events[event].indexOf(fn) !== -1){
			this.events[event].splice(this.events[event].indexOf(fn),1);
		}
	},

	/**
	 * Fires an event
	 *
	 * @public
	 * @param {String} Event
	 * @param {*} Data - The data to be sent to the listeners
	 */
	emit: function(event,data,direction){
		if(!this.events[event]) this.events[event] = [];
		for (var i = 0; i < this.events[event].length; i++) {
		 	this.events[event][i](data);
	 	};
	 	//send event in direction
	 	switch(direction){
	 		case 'up':
	 			if(this.parent) this.parent.emit(event,undefined,direction);
	 			break;
	 		case 'down':
	 			for (var i in this.values) {
	 				this.values[i].emit(event,undefined,direction);
	 			};
	 			break;
	 	}
	}
}
bindings.Scope.prototype.constructor = bindings.Scope;

/**
 * Reprsents a value in a {@link bindings.Scope}.
 *
 * @class
 * @param {String} Key - The key of this value in its parent scope.
 * @param {*} Value - The value to watch.
 * @param {bindings.Scope} Parent - The scope this value blongs to.
 */
bindings.Value = function(key,val,parent){
	this.key = key;
	this.value = val;
	this.events = {};
	this.parent = parent;

	return this;
};
bindings.Value.prototype = {
	key: '',
	value: undefined,
	parent: undefined,
	events: {},

	/**
	 * Listen for an event
	 *
	 * @public
	 * @param {String} Event
	 * @param {Function} Handler - The function that will be called when the event fires
	 */
	on: function(event,fn,ctx){
		if(!this.events[event]){
			this.events[event] = [];
		}
		if(ctx) fn = fn.bind(ctx);
		this.events[event].push(fn);
	},

	/**
	 * Stop Listening for an event
	 *
	 * @public
	 * @param {String} Event
	 * @param {Function} Handler - The function that will be called when the event fires
	 */
	off: function(event,fn){
		if(!this.events[event]){
			this.events[event] = [];
		}
		if(this.events[event].indexOf(fn) !== -1){
			this.events[event].splice(this.events[event].indexOf(fn),1);
		}
	},

	/**
	 * Fires an event
	 *
	 * @public
	 * @param {String} Event
	 * @param {*} Data - The data to be sent to the listeners
	 */
	emit: function(event,data,direction){
		if(!this.events[event]){
			this.events[event] = [];
		}
		for (var i = 0; i < this.events[event].length; i++) {
		 	this.events[event][i](data);
	 	};
	 	//send event in direction
	 	switch(direction){
	 		case 'up':
	 			if(this.parent) this.parent.emit(event,undefined,direction);
	 			break;
	 		case 'down':
	 			//this is a value so we cant go any further down
	 			break;
	 	}
	},

	/**
	 * Sets the value
	 *
	 * @param {*} Value
	 * @param {boolean} DontUpdate - Set to true to prevent from firing the change event.
	 */
	setValue: function(val,dontFire){
		this.value = (val !== undefined)? val : this.value;
		if(!dontFire) this.emit('change',val);
	},

	/**
	 * Sets the value on the scopes object
	 *
	 * @private
	 * @param {*} Value
	 * @param {boolean} DontUpdate - Set to true to prevent from firing the change event.
	 */
	updateValue: function(val){
		//just set the value, dont bother about the change event or sett my value, the scope will handle that
		this.parent.updateKey(this.key,val);
	},

	/**
	 * Fires the change event
	 */
	update: function(){
		this.emit('change',this.value);
	}
}
bindings.Value.prototype.constructor = bindings.Value;

/**
 * Reprsents a binding between a dom element and a {@link bindings.Value} or {@link bindings.Scope}.
 *
 * @class
 * @param {Node} Element - The element to bind to.
 * @param {String} String - The script to run.
 * @param {bindings.Scope} Scope - The scope this binding will be using.
 * @param {bindings.Type} Type - The type of binding this is.
 */
bindings.Binding = function(el,srcString,scope,type){ //type is id in the bindings array
	if(!(scope instanceof bindings.Scope) && !(scope instanceof bindings.Value)) throw new Error('third argument has to be a Scope or a Value');

	this.el = el;
	this.scope = scope;
	this.src = new bindings.Script(srcString,this.scope);
	this.type = type;

	//apply type
	var _type = bindings.bindings[type];
	if(_type){
		for (var i in _type) {
			this[i] = _type[i];
		};
	}
	else{
		console.error('cant find binding type: '+type)
	}

	this._bind();
	this._update();

	return this;
}
bindings.Binding.prototype = {
	el: undefined,
	scope: undefined,
	src: undefined, //src
	events: [], //list of events and the object they are on
	_bind: function(){
		this._updateEvents();
		this.bind();
	},
	_update: function(){
		try{
			this.update();
		}
		catch(e){
			console.error('failed to bind: "'+this.src.string+'" on element');
			console.error(this.el);
			console.error(e);
		}
	},
	_unbind: function(){
		//unbind all events
		this._unbindEvents();
		this.unbind();
	},
	_unbindEvents: function(){
		//unbind all events
		for (var i = 0; i < this.events.length; i++) {
			this.events[i].obj.off(this.events[i].type,this.events[i].func);
		};
		this.events = [];
	},
	_bindEvents: function(){
		//bind events
		var a = this.src.getRequires();
		for (var i = 0; i < a.length; i++) {
			this.events.push({
				type: 'change',
				func: this._update.bind(this),
				obj: a[i]
			})
			a[i].on('change',this._update.bind(this));
		};
	},
	_updateEvents: function(){
		this._unbindEvents();
		this._bindEvents();
	},

	//set these in the when defining bindings
	bind: function(el){ //binds to dom events

	},
	unbind: function(el){ //unbinds from dom events

	},
	update: function(el,val){ //updates dom el, val is parsed from the src

	},
	getScope: function(){ //returns scope to use for children, or array of scopes for children

	}
}
bindings.Binding.prototype.constructor = bindings.Binding;

/**
 * Reprsents a srcipt on a dom element.
 *
 * @class
 * @param {String} Script - The Script as a String.
 * @param {bindings.Scope} Scope - The scope this script will run on.
 */
bindings.Script = function(srcString,scope){
	if(!(scope instanceof bindings.Scope) && !(scope instanceof bindings.Value)) throw new Error('second argument has to be a Scope or a Value');

	this.string = srcString || '';
	this.scope = scope;

	return this;
}
bindings.Script.prototype = {
	value: undefined,
	success: true,
	string: '',
	scope: undefined,
	requires: undefined,
	eval: bindings._eval,
	update: function(){
		//run string
		var e = this.eval(this.string,this.scope);
		this.value = e.value;
		this.success = e.success;

		return this;
	},
	getRequires: function(refresh){
		if(!this.requires || refresh){
			this.requires = bindings._evalRequires(this.string,this.scope).requires;
		}

		return this.requires;
	},
	setEval: function(evalFunction){ //eval has to return a object containing two values, success and value
		//test function
		try{
			var data = evalFunction('this',this.scope);

			if(data !== undefined){
				if(!data.hasOwnProperty('value') && !data.hasOwnProperty('success')){
					throw new Error('function dose not return a object or returned object is missing values');
				}
			}
			else{
				throw new Error('function dose not return a object');
			}

			this.eval = evalFunction
		}
		catch(e){
			console.error('invalid eval function');
			console.error(e);
		}
	}
}
bindings.Script.prototype.constructor = bindings.Script;

//fix for IE
if(!document.children){
	document.__defineGetter__('children',function(){
		return this.body.children;
	})
}