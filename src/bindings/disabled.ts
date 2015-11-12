/// <reference path="../bindings.ts" />

module bindingTypes{
	export class DisabledBinding extends bindings.OneWayBinding{
		public static id: string = 'disabled';

		/**
			@constructs bindingTypes.DisabledBinding
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
			@overrid
		*/
		public run(){
			super.run();
			
			if(!this.expression.value){
				this.node.removeAttribute('disabled')
			}
			else{
				this.node.setAttribute('disabled','disabled')
			}
		}
	}
}