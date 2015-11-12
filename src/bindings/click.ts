/// <reference path="../bindings.ts" />

module bindingTypes{
	export class ClickBinding extends bindings.EventBinding {
		public static id: string = 'click';
		
		/**
			@constructs bindingTypes.ClickBinding
			@extends bindings.EventBinding
			@arg {HTMLElement} node
			@arg {string} expression
		*/
		constructor(node: HTMLElement, expression: string){
			super(node, expression);

			this.domEvents = ['click'];
			this.updateEvents();
		}
	}
}