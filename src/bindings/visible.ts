/// <reference path="../bindings.ts" />

// bind-visible
module bindingTypes{
	export class VisibleBinding extends bindings.OneWayBinding{
		public static id: string = 'visible';

		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			this.run();
		}

		public run(){
			super.run();
			
			if(this.expression.value){
				this.element.style.display = ''
			}
			else{
				this.element.style.display = 'none'
			}
		}
	}
}