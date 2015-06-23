/// <reference path="../bindings.ts" />

// bind-click
module bindingTypes{
	export class ClickBinding extends bindings.EventBinding{
		public static id: string = 'click';
		constructor(node: HTMLElement, attr: Attr){
			super(node, attr);

			this.domEvents = ['click'];
			this.updateEvents();
		}
	}
}