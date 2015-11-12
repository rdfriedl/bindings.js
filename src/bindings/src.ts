/// <reference path="../bindings.ts" />

module bindingTypes{
	export class SrcBinding extends bindings.OneWayBinding{
		public static id: string = 'src';

		/**
			@constructs bindingTypes.SrcBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@extends bindings.OneWayBinding
		*/
		constructor(node: HTMLElement, expression: string){
			super(node, expression);
			this.run();
		}

		/** @override */
		public run(){
			super.run();
			
			bindings.utils.setAttr(this.node, 'src', this.expression.value);
		}
	}
}