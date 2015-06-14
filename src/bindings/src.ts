/// <reference path="../bindings.ts" />

// bind-src
module bindingTypes{
	export class SrcBinding extends bindings.OneWayBinding{
		public static id: string = 'src';

		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			this.run();
		}

		public run(){
			super.run();
			
			this.element.setAttribute('src', this.expression.value);
		}
	}
}