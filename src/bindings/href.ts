/// <reference path="../bindings.ts" />

// bind-href
module bindingTypes{
	export class HrefBinding extends bindings.OneWayBinding{
		public static id: string = 'href';

		constructor(node: HTMLElement, expression: string){
			super(node, expression);
			this.run();
		}

		public run(){
			super.run();
			
			bindings.utils.setAttr(this.node, 'href', this.expression.value);
		}
	}
}