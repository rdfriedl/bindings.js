/// <reference path="../bindings.ts" />

// bind-href
module bindingTypes{
	export class HrefBinding extends bindings.OneWayBinding{
		public static id: string = 'href';

		constructor(node: HTMLElement, attr: Attr){
			super(node, attr);

			this.run();
		}

		public run(){
			super.run();
			
			this.node.setAttribute('href', this.expression.value);
		}
	}
}