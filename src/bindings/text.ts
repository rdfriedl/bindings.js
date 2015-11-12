/// <reference path="../bindings.ts" />

module bindingTypes{
	export class TextBinding extends bindings.OneWayBinding{
		public static id: string = 'text';
		private oldText: string;

		/**
			@constructs bindingTypes.TextBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@extends bindings.OneWayBinding
		*/
		constructor(node:HTMLBRElement, expression: string){
			super(node, expression);
			
			this.oldText = this.node.textContent;
			this.run();
		}

		/** @override */
		public run(){
			super.run();
			this.node.innerText = this.expression.value;
		}

		/** @override */
		public unbind(){
			super.unbind();
			this.node.textContent = this.oldText;
		}
	}
}