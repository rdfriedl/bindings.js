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
		var addedScope = {
			$modal: (scope.modal)? scope.modal.scope.value : undefined,
			$parent: (scope.parent)? scope.parent.value : undefined
		};

		var func = 'new Function("addedScope","', args = [];
		var context = scope.value;
		args.push(addedScope);

		func += 'with(this){';
		func += 'with(addedScope){';
		func += 'return ';
		func += string;
		func += '}';
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

		var addedScope = {
			$modal: (scope.modal)? buildContextFromScope(scope.modal.scope) : undefined,
			$parent: (scope.parent)? buildContextFromScope(scope.parent) : undefined
		};

		var func = 'new Function("addedScope",', args = [];
		var context = {};
		args.push(addedScope);

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

		func += '"';
		func += 'with(this){';
		func += 'with(addedScope){';
		func += 'return ';
		func += string;
		func += '}';
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

//fix for IE
if(!document.children){
	document.__defineGetter__('children',function(){
		return this.body.children;
	})
}