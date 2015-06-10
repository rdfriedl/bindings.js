/// <reference path="../bindings.ts" />

// bind-click
module bindingTypes{
	export class ClickBinding extends bindings.EventBinding{
		public static id: string = 'click';
		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			this.domEvents = ['click'];
			this.updateEvents();
		}
	}
}