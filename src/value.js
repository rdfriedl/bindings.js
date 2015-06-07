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