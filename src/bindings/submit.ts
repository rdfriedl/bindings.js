/// <reference path="../bindings.ts" />

module bindingTypes{
	export class SubmitBinding extends bindings.EventBinding{
		public static id: string = 'submit';

		/**
			@constructs bindingTypes.SubmitBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@extends bindings.EventBinding
		*/
		constructor(node: HTMLElement, expression: string){
			super(node, expression);
			this.domEvents = ['submit'];
			this.updateEvents();
		}

		/** @override */
		public change(event:Event){
			super.change(event);
			event.preventDefault();
		}
	}
}