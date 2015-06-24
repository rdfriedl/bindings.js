/// <reference path="../bindings.ts" />

// bind-click
module bindingTypes{
	export class ClickBinding extends bindings.EventBinding{
		public static id: string = 'click';
		constructor(node: HTMLElement, expression: string){
			super(node, expression);

			this.domEvents = ['click'];
			this.updateEvents();
		}
	}
}