/// <reference path="../bindings.ts" />

// bind-href
module bindingTypes{
	export class HrefBinding extends bindings.OneWayBinding{
		public static id: string = 'href';

		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			this.run();
		}

		public run(){
			super.run();
			
			this.element.setAttribute('href', this.expression.value);
		}
	}
}