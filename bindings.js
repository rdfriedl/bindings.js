bindings = {
	bindings: {},
	createModal: function(object,options){
		var modal = new this.Modal(object,options);

		//bind object to scope
		this._bindObjectToScope(object,modal.scope);
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

	_bindObjectToScope: function(object,scope){
		if(!(scope instanceof bindings.Scope)) throw new Error('scope not valid');

		Object.observe(object,function(scope,data){
			for (var i = 0; i < data.length; i++) {
				if(data[i].name == '_binding') continue;

				switch(data[i].type){
					case 'add':
						scope.addKey(data[i].name,data[i].object[data[i].name]);
						break;
					case 'update':
						scope.updateKey(data[i].name,data[i].object[data[i].name]);
						break;
					case 'delete':
						scope.removeKey(data[i].name);
						break;
				}
			};
		}.bind(object,scope))

		for (var i in object) {
			if(scope[i] instanceof bindings.Scope){
				bindings._bindObjectToScope(object,scope[i]);
			}
		};
	},
	_applyBindings: function(el,scope){
		var _bindings = [];
		for (var i = 0; i < el.children.length; i++) {
			_bindings = _bindings.concat(this._parseBindings(el.children[i],scope));
			if(el.children[i].children){
				_bindings = _bindings.concat(this._applyBindings(el.children[i],scope));
			}
		};
		return _bindings;
	},
	_parseBindings: function(el,scope){
		var _bindings = [];
		if(el instanceof Node){
			for (var i = 0; i < el.attributes.length; i++) {
				var attr = el.attributes.item(i);
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
	this.key = key || '';
	this.object = data || {};
	this.values = {};
	this.events = {};
	this.updateKeys(data);

	return this;
};
bindings.Scope.prototype = {
	events: {},
	object: {},
	values: {},
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