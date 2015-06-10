/// <reference path="../bindings.ts" />

//bind-value
module bindingTypes{
	export class ValueBinding extends bindings.TwoWayBinding{
		public static id: string = 'value';
		constructor(public element: HTMLInputElement, attr: Attr){
			super(<HTMLElement> element, attr);

			this.domEvents = ['change'];
			this.updateEvents();
		}
		public run(){
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