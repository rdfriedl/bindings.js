// binding types
bindings.bindings['text'] = {
	update: function(){
		this.src.update();
		this.el.innerText = this.src.value;
	}
}

bindings.bindings['html'] = {
	update: function(){
		this.src.update();
		this.el.innerHTML = this.src.value;
	}
}

bindings.bindings['href'] = {
	update: function(){
		this.src.update();
		this.el.setAttribute('href',this.src.value);
	}
}

bindings.bindings['src'] = {
	update: function(){
		this.src.update();
		this.el.setAttribute('src',this.src.value);
	}
}

bindings.bindings['display'] = {
	update: function(){
		this.src.update();
		if(!!this.src.value){
			this.el.style.removeProperty('display','none');
		}
		else{
			this.el.style.setProperty('display','none');
		}
	}
}

bindings.bindings['visible'] = {
	update: function(){
		this.src.update();
		if(!!this.src.value){
			this.el.style.setProperty('visibility','visible');
		}
		else{
			this.el.style.setProperty('visibility','hidden');
		}
	}
}

bindings.bindings['enabled'] = {
	update: function(){
		this.src.update();
		if(!!this.src.value){
			this.el.removeAttribute('disabled');
		}
		else{
			this.el.setAttribute('disabled','disabled');
		}
	}
}

bindings.bindings['disabled'] = {
	update: function(){
		this.src.update();
		if(this.src.value){
			this.el.setAttribute('disabled','disabled');
		}
		else{
			this.el.removeAttribute('disabled');
		}
	}
}

bindings.bindings['if'] = {
	children: [],
	restoreChildren: function(){
		if(!this.children.length){
			for (var i = 0; i < this.children.length; i++) {
				 this.el.appendChild(this.children[i]);
			};
		}
	},
	removeChildren: function(){
		if(this.children.length){
			while (this.el.children.length !== 0) {
			    this.el.removeChild(this.el.children[0]);
			}
		}
	},
	bind: function(){
		for (var i = 0; i < this.el.children.length; i++) {
			this.children.push(this.el.children[i]);
		};
	},
	update: function(){
		this.src.update();
		if(!!this.src.value){
			this.restoreChildren();
		}
		else{
			this.removeChildren();
		}
	}
}

bindings.bindings['ifnot'] = {
	children: [],
	restoreChildren: function(){
		if(!this.children.length){
			for (var i = 0; i < this.children.length; i++) {
				 this.el.appendChild(this.children[i]);
			};
		}
	},
	removeChildren: function(){
		if(this.children.length){
			while (this.el.children.length !== 0) {
			    this.el.removeChild(this.el.children[0]);
			}
		}
	},
	bind: function(){
		for (var i = 0; i < this.el.children.length; i++) {
			this.children.push(this.el.children[i]);
		};
	},
	update: function(){
		this.src.update();
		if(!this.src.value){
			this.restoreChildren();
		}
		else{
			this.removeChildren();
		}
	}
}

// bindings.bindings['attr'] = { NOTE: have to have muti bindings first
// 	update: function(){
// 		this.src.update();
// 		var attrs = this.src.value;

// 		if(typeof attrs != 'object') throw new Error('bind-attr requires a object');

// 		for (var i in attrs) {
// 			this.el.setAttribute(i,attrs[i]);
// 		};
// 	}
// }

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

bindings.bindings['dblclick'] = {
	_event: undefined,
	bind: function(){
		this._event = function(){
			this.src.update();
		}.bind(this)

		this.el.addEventListener('dblclick',this._event);
	},
	unbind: function(){
		this.el.removeEventListener('dblclick',this._event);
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

bindings.bindings['live-update'] = {
	event: function(){
		if ("createEvent" in document) {
		    var evt = document.createEvent("HTMLEvents");
		    evt.initEvent("change", false, true);
		    this.el.dispatchEvent(evt);
		}
	},
	bind: function(){
		this.el.addEventListener('keypress',this.event.bind(this))
		this.el.addEventListener('keyup',this.event.bind(this))
	},
	unbind: function(){
		this.el.removeEventListener('keypress',this.event.bind(this))
		this.el.removeEventListener('keyup',this.event.bind(this))
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