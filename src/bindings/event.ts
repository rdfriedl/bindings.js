/// <reference path="../bindings.ts" />

// bind-event-*
module bindingTypes{
	export class EventBinding extends bindings.EventBinding{
		public static id: string = 'event';
		
		/**
			@constructs bindingTypes.EventBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@arg {string} attr
			@arg {string} bindEvent
			@extends bindings.EventBinding
		*/
		constructor(node: HTMLElement, expression: string, bindEvent: string){
			super(node, expression);

			this.domEvents = [bindEvent];
			this.updateEvents();
		}
	}
}