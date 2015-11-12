/// <reference path="../bindings.ts" />

module bindingTypes{
	export class StyleBinding extends bindings.OneWayBinding{
		public static id: string = 'style';

		/**
			@constructs bindingTypes.StyleBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@arg {string} style
			@extends bindings.OneWayBinding
		*/
		constructor(node: HTMLElement, expression: string, public style: string){
			super(node, expression);
			this.run();
		}

		/** @override */
		public run(){
			super.run();
			
			this.node.style[this.style] = this.expression.value;
		}
	}
}