/**
 * Modal class
 *
 * @class
 * @param {Object} Object - The object that this modal will use.
 * @param {Object} Options - A object that contains options.
 */
bindings.Modal = function(object,options){
	this.options = Object.create(this.options);
	this.scope = new bindings.Scope('',object,this);

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