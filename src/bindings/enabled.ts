/// <reference path="../bindings.ts" />

// bind-enabled
module bindingTypes{
	export class EnabledBinding extends bindings.OneWayBinding{
		public static id: string = 'enabled';

		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			this.run();
		}

		public run(){
			super.run();
			
			if(this.expression.value){
				this.element.removeAttribute('disabled')
			}
			else{
				this.element.setAttribute('disabled','disabled')
			}
		}
	}
}