/// <reference path="../bindings.ts" />

module bindingTypes{
	export class EnabledBinding extends bindings.OneWayBinding{
		public static id: string = 'enabled';

		/**
			@constructs bindingTypes.EnabledBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@extends bindings.OneWayBinding
		*/
		constructor(node: HTMLElement, expression: string){
			super(node, expression);
			this.run();
		}

		/**
			@public
			@override
		*/
		public run(){
			super.run();
			
			if(this.expression.value){
				this.node.removeAttribute('disabled')
			}
			else{
				this.node.setAttribute('disabled','disabled')
			}
		}
	}
}