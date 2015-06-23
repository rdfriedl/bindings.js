/// <reference path="bindings.ts" />

module bindings{
	export class Modal {
		public scope: bindings.Scope;
		public bindings: bindings.Binding[] = [];
		public options: any = {
			prefix: 'bind',
			inlineDelimiters: ['{','}'],
			inlineBinding: bindingTypes.TextBinding,
			excludedElements: {
				script: true,
				link: true,
				meta: true,
				style: true
			}
		};

		constructor(public object: Object, options: any = {}, public node: Node = document.body) {
			this.scope = new bindings.Scope('', object, this);
			for (var i in options) {
				this.options[i] = options[i];
			}
		}

		public applyBindings(node: Node = undefined) {
			//remove old event
			this.node.removeEventListener('DOMNodeInserted', this.ElementChange.bind(this));
			this.node.removeEventListener('DOMNodeRemoved', this.ElementChange.bind(this));

			if (node) this.node = node;

			this.bindings = this.buildBindings();

			this.node.addEventListener('DOMNodeInserted', this.ElementChange.bind(this));
			this.node.addEventListener('DOMNodeRemoved', this.ElementChange.bind(this));
		}

		private buildBindings(node: Node = this.node, scope: bindings.Scope = node.__scope__ || this.scope) { //loop through this.nodes children and create the bindings
			var bindingsCreated: bindings.Binding[] = [];

			if (node.nodeName.toLowerCase() in this.options.excludedElements) return;

			//remove old bindings
			if (node.__bindings__) {
				for (var i = 0; i < node.__bindings__.length; i++) {
					node.__bindings__[i].unbind();
				};
				node.__bindings__ = [];
			}

			//set scope
			node.__scope__ = scope;
			node.__addedScope__ = node.__addedScope__ || {};

			this.createBindings(node); //createBindings handles setting __bindings__

			bindingsCreated = bindingsCreated.concat(node.__bindings__);

			//loop through and bind children
			for (var i = 0; i < node.childNodes.length; i++) { //if node was a text node then i will not have any children even though createInlineBindings splits it
				var childNode: Node = node.childNodes[i];

				if (childNode.nodeName.toLowerCase() in this.options.excludedElements) continue;

				//set scope
				childNode.__scope__ = childNode.__scope__ || scope;
				childNode.__addedScope__ = childNode.__addedScope__ || node.__addedScope__;

				this.buildBindings(childNode, childNode.__scope__);

				bindingsCreated = bindingsCreated.concat(childNode.__bindings__);
			};

			return bindingsCreated;
		}

		private createBindings(node: Node): bindings.Binding[]{
			var bindingsCreated: bindings.Binding[] = [];
			switch(node.nodeType){
				case node.ELEMENT_NODE:
					bindingsCreated = this.createAttrBindings(<HTMLElement> node);
					break;
				case node.TEXT_NODE:
					bindingsCreated = this.createInlineBindings(<Text> node);
					break;
			}
			return bindingsCreated;
		}

		private createAttrBindings(node: HTMLElement): bindings.Binding[] {
			var bindingsCreated = [];
			var attrs: NodeList = node.attributes;
			for (var i = 0; i < attrs.length; i++) {
				var attr: Attr = <Attr>attrs.item(i);
				var type: string = attr.name;
				//find the binding attrs and extract the src
				if (type.indexOf(this.options.prefix.toLowerCase() + '-') == 0) {
					type = type.replace(this.options.prefix.toLowerCase() + '-', '');

					var binding: bindings.Binding = bindingTypes.createBinding(type, node, attr);
					if (binding) {
						bindingsCreated.push(binding);
					}
					else {
						console.error('cant find binding: ' + type);
					}
				}
			};
			node.__bindings__ = bindingsCreated;
			return bindingsCreated;
		}

		private createInlineBindings(node: Node): bindings.Binding[] {
			var bindingsCreated = [];
			var tokens: any[] = this.parseInlineBindings(node.nodeValue, this.options.inlineDelimiters);

			if (!(tokens.length === 1 && tokens[0].type === 'text')) {
                for (var i = 0; i < tokens.length; i++) {
                    var token: any = tokens[i];
                    var textNode: Text = document.createTextNode(token.value);

                    //copy scopes
                    // textNode.__bindings__ = bindings.clone(node.__bindings__); dont clone the bindings array because no two nodes should have the same bindigns
                    textNode.__bindings__ = [];
                    textNode.__scope__ = node.__scope__;
                    textNode.__addedScope__ = bindings.clone(node.__addedScope__)

                    node.parentNode.insertBefore(textNode, node);
                    if (token.type === 'binding') {
						var b: bindings.Binding = new bindings.InlineBinding(textNode);
						textNode.__bindings__ = [b];
                    	bindingsCreated.push(b)
                    }
                }
                node.parentNode.removeChild(node);
            }
			return bindingsCreated;
		}

		private parseInlineBindings(template: string, delimiters: string[]): any[]{
			var index: number = 0, 
				lastIndex: number = 0, 
				lastToken, 
				length: number = template.length, 
				substring: string, 
				tokens: any = [], 
				value;
			while (lastIndex < length) {
			    index = template.indexOf(delimiters[0], lastIndex);
			    if (index < 0) {
			      	tokens.push({
			        	type: 'text',
			        	value: template.slice(lastIndex)
			      	});
			      	break;
			    } 
			    else {
			      	if (index > 0 && lastIndex < index) {
			        	tokens.push({
			          		type: 'text',
			          		value: template.slice(lastIndex, index)
			        	});
			      	}
			      	lastIndex = index + delimiters[0].length;
			      	index = template.indexOf(delimiters[1], lastIndex);
			      	if (index < 0) {
			        	substring = template.slice(lastIndex - delimiters[1].length);
			        	lastToken = tokens[tokens.length - 1];
			        	if ((lastToken != null ? lastToken.type : void 0) === 'text') {
			          		lastToken.value += substring;
			        	} 
			        	else {
			          		tokens.push({
			            		type: 'text',
			            		value: substring
			          		});
			        	}
			        	break;
			      	}
			      	value = template.slice(lastIndex, index).trim();
			      	tokens.push({
			        	type: 'binding',
			        	value: value
			      	});
			      	lastIndex = index + delimiters[1].length;
			    }
			}
			return tokens;
		}

		private ElementChange(event:Event){
			event.stopPropagation();

			var el: Node = <Node> event.target;
			if(el.nodeType !== 3){
				this.buildBindings(el);
			}
		}
	}
}
