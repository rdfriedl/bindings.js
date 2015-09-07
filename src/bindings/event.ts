/// <reference path="../bindings.ts" />

// bind-event-*
module bindingTypes{
	export class EventBinding extends bindings.EventBinding{
		public static id: string = 'event';
		constructor(node: HTMLElement, expression: string, bindEvent: string){
			super(node, expression);

			this.domEvents = [bindEvent];
			this.updateEvents();
		}
	}
}