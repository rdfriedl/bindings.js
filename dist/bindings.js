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

// scope
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
	setKeys: function(keys,dontFire){
		keys = keys || {};
		for (var i in keys) {
			this.setKey(i,keys[i],true);
		};
		if(!dontFire) this.emit('change',this);
	},
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
	getValue: function(key){
		return this.values[key];
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
	}
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
	key: '',
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
		this.value = (val !== undefined)? val : this.value;
		this.emit('change',val);
	},
	updateValue: function(val){ //changes value on the modal object
		//just set the value, dont bother about the change event or sett my value, the scope will handle that
		this.parent.updateKey(this.key,val);
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
bindings.Src.prototype.constructor = bindings.Src;

//fix for IE
if(!document.children){
	document.__defineGetter__('children',function(){
		return this.body.children;
	})
}

(function(bindings){

// binding types
bindings.bindings['text'] = {
	update: function(){
		this.src.update();
		this.el.textContent = this.src.value;
	}
}

bindings.bindings['click'] = {
	_event: undefined,
	bind: function(){
		this._event = function(){
			this.src.update();
		}.bind(this)

		this.el.addEventListener('click',this._event);
	},
	unbind: function(){
		this.el.removeEventListener('click',this._event);
	}
}

bindings.bindings['submit'] = {
	_event: undefined,
	bind: function(){
		this._event = this.submit.bind(this)

		this.el.addEventListener('submit',this._event);
	},
	submit: function(event){
		event.preventDefault();
		this.src.update();
	},
	unbind: function(){
		this.el.removeEventListener('submit',this._event);
	}
}

bindings.bindings['value'] = {
	_event: undefined,
	_dontUpdate: false,
	bind: function(){
		this._event = this.change.bind(this);

		this.el.addEventListener('change',this._event);

		this.src.setEval(bindings._evalOnScope);
	},
	change: function(){ //event from el
		this.src.update();

		if(!(this.src.value instanceof bindings.Value)) throw new Error('bind-value requires a instance of bindings.Value');

		this._dontUpdate = true;
		this.src.value.updateValue(this.el.value);
	},
	update: function(){
		if(!this._dontUpdate){
			this.src.update();
			this.el.value = this.src.value.value;
		}
		else{
			this._dontUpdate = false;
		}
	},
	unbind: function(){
		this.el.removeEventListener('change',this._event);
	}
}

bindings.bindings['with'] = {
	bind: function(){
		this.src.setEval(bindings._evalOnScope);
	},
	update: function(){
		this.src.update();
		if(!(this.src.value instanceof bindings.Scope)) throw new Error('with requires a Object or Array')

		for (var i = 0; i < this.el.children.length; i++) {
			this.el.children[i].__scope__ = this.src.value;
		};
	}
}

bindings.bindings['foreach'] = {
	__foreach_children__: [],
	removeAllChildren: function(){
		while (this.el.children.length !== 0) {
		    this.el.removeChild(this.el.children[0]);
		}
	},
	bind: function(){
		this.src.setEval(bindings._evalOnScope);

		var a = [];
		for (var i = 0; i < this.el.children.length; i++) {
			a.push(this.el.children[i]);
		};
		this.__foreach_children__ = a;
	},
	update: function(){
		this.removeAllChildren();
		this.src.update();

		if(!(this.src.value instanceof bindings.Scope)) throw new Error('foreach requires a Object or Array')

		for (var i in this.src.value.values) {
			for (var k = 0; k < this.__foreach_children__.length; k++) {
				var el = this.__foreach_children__[k].cloneNode(true);
				el.__scope__ = this.src.value.values[i];
				this.el.appendChild(el)
			};
		};
	},
	unbind: function(){
		this.removeAllChildren();
		for (var k = 0; k < this.__foreach_children__.length; k++) {
			var el = this.__foreach_children__[k].cloneNode(true);
			this.el.appendChild(el)
		};
	}
}

bindings.bindings['repeat'] = {
	__foreach_children__: [],
	removeAllChildren: function(){
		while (this.el.children.length !== 0) {
		    this.el.removeChild(this.el.children[0]);
		}
	},
	bind: function(){
		var a = [];
		for (var i = 0; i < this.el.children.length; i++) {
			a.push(this.el.children[i]);
		};
		this.__foreach_children__ = a;
	},
	update: function(){
		this.removeAllChildren();
		this.src.update();

		for (var i = 0; i < this.src.value; i++) {
			for (var k = 0; k < this.__foreach_children__.length; k++) {
				var el = this.__foreach_children__[k].cloneNode(true);
				this.el.appendChild(el)
			};
		};
	},
	unbind: function(){
		this.removeAllChildren();
		for (var k = 0; k < this.__foreach_children__.length; k++) {
			var el = this.__foreach_children__[k].cloneNode(true);
			this.el.appendChild(el)
		};
	}
}
	
})(bindings)

ctx.bindings = bindings;
})(this);