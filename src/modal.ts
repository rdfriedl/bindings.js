/// <reference path="bindings.ts" />

module bindings{
	export class Modal {
		public scope: bindings.Scope;
		public bindings: bindings.Binding[] = [];
		public options: any = {
			prefix: 'bind',
			inlineDelimiters: ['{','}'],
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
			node.__scope__ = node.__scope__ || scope;
			if(node.parentNode){
				node.__addedScope__ = bindings.extendNew(node.parentNode.__addedScope__ || {}, node.__addedScope__ || {});
			}

			bindingsCreated = bindingsCreated.concat(this.createBindings(node)); //createBindings handles setting __bindings__
			
			//if node was a text node then it will not have any children even though createInlineBindings splits it into mutiple textNodes

			//loop through and bind children
			for (var i = 0; i < node.childNodes.length; i++) {
				var childNode: Node = node.childNodes[i];

				if (childNode.nodeName.toLowerCase() in this.options.excludedElements) continue;

				bindingsCreated = bindingsCreated.concat(this.buildBindings(childNode, childNode.__scope__ || scope));
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

				var types: string[] = type.split('-');

				if (types[0] == this.options.prefix) {
					types.splice(0,1); //remove the prefix

					var binding: bindings.Binding = bindingTypes.createBinding(types, node, attr.value);
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
