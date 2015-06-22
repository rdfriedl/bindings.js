/// <reference path="../bindings.ts" />

//bind-value
module bindingTypes{
	export class InputBinding extends bindings.TwoWayBinding{
		public static id: string = 'input';
		constructor(public element: HTMLInputElement, attr: Attr){
			super(<HTMLElement> element, attr);

			this.domEvents = ['input'];
			this.updateEvents();
		}
		public run(){
			super.run();
			this.element.value = this.expression.value;
		}
		public change(event:Event){
			super.change(event);
			var value = this.expression.runOnScope().value;
			if(value instanceof bindings.Value){
				value.updateValue(this.element.value);
			}
		}
	}
}