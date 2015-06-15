/// <reference path="../bindings.ts" />

// bind-disabled
module bindingTypes{
	export class DisabledBinding extends bindings.OneWayBinding{
		public static id: string = 'disabled';

		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			this.run();
		}

		public run(){
			super.run();
			
			if(!this.expression.value){
				this.element.removeAttribute('disabled')
			}
			else{
				this.element.setAttribute('disabled','disabled')
			}
		}
	}
}