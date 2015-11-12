/// <reference path="../bindings.ts" />

module bindingTypes{
	export class ValueBinding extends bindings.TwoWayBinding{
		public static id: string = 'value';

		/**
			@constructs bindingTypes.ValueBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@extends bindings.TwoWayBinding
		*/
		constructor(public node: HTMLInputElement, expression: string){
			super(<HTMLElement> node, expression);

			this.domEvents = ['change'];
			this.updateEvents();
		}

		/** @override */
		public run(){
			super.run();
			this.node.value = this.expression.value;
		}

		/** @override */
		public change(event:Event){
			super.change(event);

			var value = this.expression.runOnScope().value;
			if(value instanceof bindings.Value){
				value.updateValue(this.node.value);
			}
		}
	}
}