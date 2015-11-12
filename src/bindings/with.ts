/// <reference path="../bindings.ts" />

module bindingTypes{
	export class WithBinding extends bindings.OneWayBinding{
		public static id: string = 'with';
		public static priority: number = 1;

		/**
			@constructs bindingTypes.WithBinding
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
			// super.run(); dont run because we arnt going to use .run on are expression
			var scope: bindings.Scope = this.expression.runOnScope().value;

			if(scope instanceof bindings.Scope){
				for (var i = 0; i < this.node.childNodes.length; i++){
					var el: Node = this.node.childNodes[i];
					el.__scope__ = scope;
				}
			}
			else{
				throw new Error('bind-with requires a Object or Array');
			}
		}
	}
}