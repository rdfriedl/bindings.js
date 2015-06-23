/// <reference path="../bindings.ts" />

// bind-submit
module bindingTypes{
	export class SubmitBinding extends bindings.EventBinding{
		public static id: string = 'submit';
		constructor(node: HTMLElement, attr: Attr){
			super(node, attr);

			this.domEvents = ['submit'];
			this.updateEvents();
		}

		public change(event:Event){
			super.change(event);
			event.preventDefault();
		}
	}
}