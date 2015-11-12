/// <reference path="../bindings.ts" />

module bindingTypes{
	export class AttrBinding extends bindings.OneWayBinding{
		public static id: string = 'attr';
		public attr: string;

		/**
			@constructs bindingTypes.AttrBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@arg {string} attr
			@extends bindings.OneWayBinding
		*/
		constructor(node: HTMLElement, expression: string, attr: string){
			super(node, expression);
			this.attr = attr;
			this.run();
		}

		/** @override */
		public run(){
			super.run();
			
			bindings.utils.setAttr(this.node, this.attr, this.expression.value);
		}
	}
}