/// <reference path="../bindings.ts" />

module bindingTypes{
	export class HiddenBinding extends bindings.OneWayBinding{
		public static id: string = 'hidden';

		/**
			@constructs bindingTypes.HiddenBinding
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
			
			if(this.expression.value){
				this.node.style.display = 'none'
			}
			else{
				this.node.style.display = ''
			}
		}
	}
}