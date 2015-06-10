/// <reference path="bindings.ts" />

module bindings{
	export class Modal {
		public scope: bindings.Scope;
		public bindings: bindings.Binding[] = [];

		constructor(public object:Object,public element:HTMLElement){
			this.scope = new bindings.Scope('', object, this);
		}

		public applyBindings(element:HTMLElement = undefined){
			//remove old event
			this.element.removeEventListener('DOMNodeInserted',this.ElementChange.bind(this));
			this.element.removeEventListener('DOMNodeRemoved',this.ElementChange.bind(this));

			if (element) this.element = element;

			this.bindings = this.buildBindings();

			this.element.addEventListener('DOMNodeInserted',this.ElementChange.bind(this));
			this.element.addEventListener('DOMNodeRemoved',this.ElementChange.bind(this));
		}

		private buildBindings(element:HTMLElement = this.element,scope:bindings.Scope = element.__scope__ || this.scope){ //loop through this.elements children and create the bindings
			var bindingsCreated: bindings.Binding[] = [];

			//remove old bindings
			if(element.__bindings__){
				for (var i = 0; i < element.__bindings__.length; i++) {
					element.__bindings__[i].unbind();
				};
				element.__bindings__ = [];
			}
			element.__scope__ = scope;
			var data = this.parseBindings(element);
			element.__bindings__ = data;

			bindingsCreated = bindingsCreated.concat(element.__bindings__);

			//loop through and bind children
			if(element.children){
				for (var i = 0; i < element.children.length; i++) {
					var child: HTMLElement = <HTMLElement>element.children[i];
					child.__scope__ = child.__scope__ || scope;
					this.buildBindings(child,child.__scope__);
					bindingsCreated = bindingsCreated.concat(child.__bindings__);
				};
			}

			return bindingsCreated;
		}

		private parseBindings(element:HTMLElement): bindings.Binding[]{
			var bindingsCreated = [];
			var attrs: NodeList = element.attributes;
			for (var i = 0; i < attrs.length; i++) {
				var attr: Attr = <Attr>attrs.item(i);
				var type:string = attr.name;
				//find the binding attrs and extract the src
				if(type.search('bind-') == 0){
					type = type.substr(type.indexOf('-')+1,type.length);

					var binding: bindings.Binding = bindingTypes.createBinding(type, element, attr);
					if(binding){
						bindingsCreated.push(binding);
					}
					else{
						console.error('cant find binding: ' + type);
					}
				}
			};
			return bindingsCreated;
		}

		private ElementChange(event:Event){
			event.stopPropagation();

			var el: HTMLElement = <HTMLElement> event.target;
			if(el.nodeType !== 3){
				this.buildBindings(el);
			}
		}
	}
}
