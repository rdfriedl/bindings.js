/**
 * Reprsents a Object or Array on the a {@link bindings.Modal} or {@link bindings.Scope}
 *
 * @class
 * @param {String} Key - the key of this Scope in its parent.
 * @param {Object} Object - the Object this scope will handle.
 * @param {bindings.Modal} Modal - The Modal this scope belongs to
 * @param {bindings.Scope} [Parent] - The parnet Scope for this Scope
 */
bindings.Scope = function(key,data,modal,parent){ //creates scope object from data
	data = data || {};
	this.key = key || '';
	this.value = data;
	this.values = (data.hasOwnProperty('length'))? [] : {};
	this.events = {};
	this.parent = parent;
	this.modal = modal;
	this.setKeys(data);

	//listen for events on object
	Object.observe(this.value,bindings._modalChange.bind(this,this))

	return this;
};
bindings.Scope.prototype = {
	events: {},
	object: undefined,
	parent: undefined,
	modal: undefined,
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
				this.values[key] = new bindings.Scope(key,value,this.modal,this);
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