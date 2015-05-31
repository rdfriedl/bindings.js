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
		for (var i = 0; i < this.el.children.length; i++) {
			this.el.children[i].__scope__ = this.src.value;
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
		    this.el.children[0].remove();
		}
		this.src.update();
		if(!(this.src.value instanceof bindings.Scope)) throw new Error('foreach requires a Object or Array')

		for (var i in this.src.value.values) {
			for (var k = 0; k < this.__foreach_children__.length; k++) {
				var el = this.__foreach_children__[k].cloneNode(true);
				el.__scope__ = this.src.value.values[i];
				this.el.appendChild(el)
			};
		};
	}
}
	
})(bindings)