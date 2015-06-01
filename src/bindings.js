(function(ctx){

function duplicateObject(obj2,count){
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
						obj[i] = duplicateObject(obj2[i],count-1)
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
						obj[i] = duplicateObject(obj2[i],count-1)
					}
				}
			}
		}
		return obj;
	}
	else{
		return obj2
	}
}
	
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

	_applyBindings: function(el,scope){ //applys bindings for el and its children
		if(!(scope instanceof bindings.Scope) && !(scope instanceof bindings.Value)) throw new Error('second argument has to be a Scope or a Value');

		var _scope;
		var _bindings = [];
		for (var i = 0; i < el.children.length; i++) {
			var data = this._parseBindings(el.children[i],scope);

			_bindings = _bindings.concat(data);

			//children
			if(el.children[i].children){
				_bindings = _bindings.concat(this._applyBindings(el.children[i],el.children[i].__scope__ || scope));
			}
		};
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
	_eval: function(string,scope){
		if(!(scope instanceof bindings.Scope) && !(scope instanceof bindings.Value)) throw new Error('second argument has to be a Scope or a Value');

		string = string || '';
		var data = {
			value: undefined,
			success: true,
		}

		var func = 'new Function(', args = [];
		var context = scope.value;

		func += '"return ';
		func += string;
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

					if(typeof this.values[i].value !== 'function') return this.values[i].value;
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

		func += '"return ';
		func += string;
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
	noop: function(){}
}

// modal
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
	bindings: [], //an array of bindings with dom elements
	options: {
		element: document
	},
	scope: undefined,
	applyBindings: function(el){
		if(!(el instanceof Node) && el) throw new Error('first argument has to be a Node');

		if(el) this.options.element = el;

		this.removeAllBindings();
		this.bindings = bindings._applyBindings(this.options.element,this.scope);
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

// scope
bindings.Scope = function(key,data,parent){ //creates scope object from data
	data = data || {};
	this.key = key || '';
	this.value = data;
	this.values = (data.hasOwnProperty('length'))? [] : {};
	this.events = {};
	this.parent = parent;
	this.updateKeys(data);

	//listen for events on object
	Object.observe(this.value,function(data){
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
	parent: undefined,
	values: undefined,
	addKey: function(key,value){
		if(typeof value == 'object'){
			this.values[key] = new bindings.Scope(key,value,this);
		}
		else{
			this.values[key] = new bindings.Value(key,value,this);
		}
		this.emit('change',this)
	},
	removeKey: function(key){
		delete this.values[key];
		this.emit('change',this)
	},
	updateKey: function(key,value){
		if(!this.values[key]) this.addKey(key,value);
		if(this.values[key] instanceof bindings.Value){
			this.values[key].setValue(value);
		}
		else if(this.values[key] instanceof bindings.Scope){
			this.values[key].updateKeys(value);
		}
		this.emit('change',this)
	},
	updateKeys: function(keys){
		keys = keys || {};
		for (var i in keys) {
			this.updateKey(i,keys[i]);
		};
	},
	getKey: function(value){ //finds a key based on a value
		for (var i in this.values) {
			if(this.values[i].value == value){
				return i;
			}
		};
	},
	getValue: function(key){
		return this.values[key];
	},
	getValueFromValue: function(val){
		return this.getValue(this.getKey(val));
	},
	update: function(){
		this.emit('change',this)
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
	},
}
bindings.Scope.prototype.constructor = bindings.Scope;

// value
bindings.Value = function(key,val,parent){
	this.key = key;
	this.value = val;
	this.events = {};
	this.parent = parent;

	return this;
};
bindings.Value.prototype = {
	value: undefined,
	parent: undefined,
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
	setValue: function(val){
		this.value = val || this.value;
		this.emit('change',val);
	},
	update: function(){
		this.emit('change',this.value);
	}
}
bindings.Value.prototype.constructor = bindings.Value;

// binding
bindings.Binding = function(el,srcString,scope,type){ //type is id in the bindings array
	if(!(scope instanceof bindings.Scope) && !(scope instanceof bindings.Value)) throw new Error('third argument has to be a Scope or a Value');

	this.el = el;
	this.scope = scope;
	this.src = new bindings.Src(srcString,this.scope);
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
		this.el.__bindings__ = this.el.__bindings__ || [];
		this.el.__bindings__.push(this);

		this._updateEvents();
		this.bind();
	},
	_update: function(){
		try{
			this.update();
		}
		catch(e){
			console.error('failed to bind: { '+this.src.string+' } on element');
			console.error(this.el);
			console.error(e);
		}
	},
	_unbind: function(){
		this.el.__bindings__.splice(this.el.__bindings__.indexOf(this),1);
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

// src
bindings.Src = function(srcString,scope){
	if(!(scope instanceof bindings.Scope) && !(scope instanceof bindings.Value)) throw new Error('second argument has to be a Scope or a Value');

	this.string = srcString || '';
	this.scope = scope;

	return this;
}
bindings.Src.prototype = {
	value: undefined,
	success: true,
	sting: '',
	scope: undefined,
	requires: undefined,
	update: function(){
		//run string
		var e = bindings._eval(this.string,this.scope);
		this.value = e.value;
		this.success = e.success;

		return this;
	},
	getRequires: function(refresh){
		if(!this.requires || refresh){
			this.requires = bindings._evalRequires(this.string,this.scope).requires;
		}

		return this.requires;
	}
}
bindings.Src.prototype.constructor = bindings.Src;

ctx.bindings = bindings;
})(window)