import 'object.observe';

export default class Modal {
	/** ths scope for this modal */
	public scope: Scope;
	/** an array of bindings for this modal */
	public bindings: Binding[] = [];
	public node: Node;

	private observer:MutationObserver;

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

	constructor(public object: Object, options: any = {}, node: Node = document.body) {
		this.scope = new Scope('', object, this);
		this.node = node;
		for (var i in options) {
			this.options[i] = options[i];
		}

		this.observer = new MutationObserver(this.ElementChange.bind(this));
	}

	public applyBindings(node: Node = undefined) {
		//remove old event
		this.observer.disconnect();

		if (node) this.node = node;

		this.bindings = this.buildBindings();

		// watch the new node
		this.observer.observe(this.node, {
			childList: true
		});
	}

	/** loop through this.nodes children and create the bindings */
	private buildBindings(node: Node = this.node, scope: Scope = node.__scope__ || this.scope) { //loop through this.nodes children and create the bindings
		var bindingsCreated: Binding[] = [];

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
			node.__addedScope__ = extendNew(<Node>node.parentNode.__addedScope__ || {}, node.__addedScope__ || {});
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

	private createBindings(node: Node): Binding[]{
		var bindingsCreated: Binding[] = [];
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

	private createAttrBindings(node: HTMLElement): Binding[] {
		var bindingsCreated = [];
		var attrs: NodeList = node.attributes;
		var types: any[] = [];

		//find the bindings
		for (var i = 0; i < attrs.length; i++) {
			var attr: Attr = <Attr>attrs.item(i);
			var _types: string[] = attr.name.split('-');

			if (_types[0] == this.options.prefix) {
				_types.splice(0,1); //remove the prefix
				var fn = getBinding(_types[0]);
				if(fn){
					types.push({
						types: _types,
						attr: attr,
						constructor: fn
					});
				}
				else{
					console.error('cant find binding: ' + attr.name);
				}
			}
		};

		//sort by priority
		types.sort(function(a,b){
			if(a.constructor.priority < b.constructor.priority){
				return 1;
			}
			else if(a.constructor.priority > b.constructor.priority){
				return -1;
			}
			else{
				return 0;
			}
		})

		//create the bindings
		for (var i = 0; i < types.length; i++){
			var t: any = types[i];

			try{
				bindingsCreated.push(createBinding(t.types, node, t.attr.value));
			}
			catch(e){
				console.error('failed to create binding: ' + t.attr.name);
				console.error(e);
			}
		}

		node.__bindings__ = bindingsCreated;
		return bindingsCreated;
	}

	private createInlineBindings(node: Node): Binding[] {
		var bindingsCreated = [];
		var tokens: any[] = this.parseInlineBindings(node.nodeValue, this.options.inlineDelimiters);

		if (!(tokens.length === 1 && tokens[0].type === 'text')) {
            for (var i = 0; i < tokens.length; i++) {
                var token: any = tokens[i];
                var textNode: Text = document.createTextNode(token.value);

                //copy scopes
                // textNode.__bindings__ = clone(node.__bindings__); dont clone the bindings array because no two nodes should have the same bindigns
                textNode.__bindings__ = [];
                textNode.__scope__ = node.__scope__;
                textNode.__addedScope__ = clone(node.__addedScope__)

                node.parentNode.insertBefore(textNode, node);
                if (token.type === 'binding') {
					var b: Binding = new InlineBinding(textNode);
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

import Scope from './Scope';
import Binding from './Binding';
import {InlineBinding} from './Binding';
import * as bindingTypes from './bindingTypes';
import {extendNew, clone, createBinding, getBinding} from './utils';
