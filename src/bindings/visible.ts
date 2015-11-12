/// <reference path="../bindings.ts" />

module bindingTypes{
	export class VisibleBinding extends bindings.OneWayBinding{
		public static id: string = 'visible';

		/**
			@constructs bindingTypes.VisibleBinding
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
			
			if(this.expression.value){
				this.node.style.display = ''
			}
			else{
				this.node.style.display = 'none'
			}
		}
	}
}