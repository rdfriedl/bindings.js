/**
 * Reprsents a binding between a dom element and a {@link bindings.Value|Value} or {@link bindings.Scope|Scope}.
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