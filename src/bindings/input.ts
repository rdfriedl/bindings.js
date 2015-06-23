/// <reference path="../bindings.ts" />

//bind-value
module bindingTypes{
	export class InputBinding extends bindings.TwoWayBinding{
		public static id: string = 'input';
		constructor(public node: HTMLInputElement, attr: Attr){
			super(<HTMLElement> node, attr);

			this.domEvents = ['input'];
			this.updateEvents();
		}
		public run(){
			super.run();
			this.node.value = this.expression.value;
		}
		public change(event:Event){
			super.change(event);
			var value = this.expression.runOnScope().value;
			if(value instanceof bindings.Value){
				value.updateValue(this.node.value);
			}
		}
	}
}