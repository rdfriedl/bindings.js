(function(bindings){

// binding types
bindings.bindings['text'] = {
	update: function(){
		this.src.update();
		this.el.textContent = this.src.value;
	}
}

bindings.bindings['click'] = {
	bind: function(){
		this.event = this.event || function(){
			this.src.update();
		}.bind(this)
	},
	update: function(){
		this.el.removeEventListener('click',this.event);
		this.el.addEventListener('click',this.event);
	}
}

bindings.bindings['with'] = {
	update: function(){
		this.src.update();
		var val = this.scope.getValueFromValue(this.src.value); //dose not matter if this is a number or string because it will be stoped on the next line
		if(!(val instanceof bindings.Scope)) throw new Error('with requires a Object or Array')

		for (var i = 0; i < this.el.children.length; i++) {
			this.el.children[i].__scope__ = val;
		};
	}
}

bindings.bindings['foreach'] = {
	__foreach_children__: [],
	bind: function(){
		var a = [];
		for (var i = 0; i < this.el.children.length; i++) {
			a.push(this.el.children[i]);
		};
		this.__foreach_children__ = a;
	},
	update: function(){
		while (this.el.children.length !== 0) {
		    this.el.removeChild(this.el.children[0]);
		}
		this.src.update();
		var val = this.scope.getValueFromValue(this.src.value);
		if(!(val instanceof bindings.Scope)) throw new Error('foreach requires a Object or Array')

		for (var i in val.values) {
			for (var k = 0; k < this.__foreach_children__.length; k++) {
				var el = this.__foreach_children__[k].cloneNode(true);
				el.__scope__ = val.values[i];
				this.el.appendChild(el)
			};
		};
	},
	unbind: function(){
		while (this.el.children.length !== 0) {
		    this.el.removeChild(this.el.children[0]);
		}
		for (var k = 0; k < this.__foreach_children__.length; k++) {
			var el = this.__foreach_children__[k].cloneNode(true);
			this.el.appendChild(el)
		};
	}
}

bindings.bindings['repeat'] = {
	__foreach_children__: [],
	bind: function(){
		var a = [];
		for (var i = 0; i < this.el.children.length; i++) {
			a.push(this.el.children[i]);
		};
		this.__foreach_children__ = a;
	},
	update: function(){
		while (this.el.children.length !== 0) {
		    this.el.removeChild(this.el.children[0]);
		}
		this.src.update();

		for (var i = 0; i < this.src.value; i++) {
			for (var k = 0; k < this.__foreach_children__.length; k++) {
				var el = this.__foreach_children__[k].cloneNode(true);
				this.el.appendChild(el)
			};
		};
	},
	unbind: function(){
		while (this.el.children.length !== 0) {
		    this.el.removeChild(this.el.children[0]);
		}
		for (var k = 0; k < this.__foreach_children__.length; k++) {
			var el = this.__foreach_children__[k].cloneNode(true);
			this.el.appendChild(el)
		};
	}
}
	
})(bindings)