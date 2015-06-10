/// <reference path="../bindings.ts" />

// bind-live-update
module bindingTypes{
	export class LiveUpdateBinding extends bindings.EventBinding{
		public static id: string = 'live-update';
		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			this.domEvents = ['keypress','keyup'];
			this.updateEvents();
		}

		public change(event: Event){
			//super.change(event); //dont run the expression because we dont have on
			if ("createEvent" in document) {
			    var evt = document.createEvent("HTMLEvents");
			    evt.initEvent("change", false, true);
			    this.element.dispatchEvent(evt);
			}
		}
	}
}