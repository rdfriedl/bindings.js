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