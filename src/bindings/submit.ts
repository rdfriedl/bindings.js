/// <reference path="../bindings.ts" />

// bind-submit
module bindingTypes{
	export class SubmitBinding extends bindings.EventBinding{
		public static id: string = 'submit';
		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			this.domEvents = ['submit'];
			this.updateEvents();
		}

		public change(event:Event){
			super.change(event);
			event.preventDefault();
		}
	}
}