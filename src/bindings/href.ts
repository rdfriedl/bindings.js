/// <reference path="../bindings.ts" />

module bindingTypes{
	export class HrefBinding extends bindings.OneWayBinding{
		public static id: string = 'href';

		/**
			@constructs bindingTypes.HrefBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@extends bindings.OneWayBinding
		*/
		constructor(node: HTMLElement, expression: string){
			super(node, expression);
			this.run();
		}

		/**
			@override
			@public
		*/
		public run(){
			super.run();
			
			bindings.utils.setAttr(this.node, 'href', this.expression.value);
		}
	}
}