/// <reference path="../bindings.ts" />

// bind-src
module bindingTypes{
	export class SrcBinding extends bindings.OneWayBinding{
		public static id: string = 'src';

		constructor(node: HTMLElement, expression: string){
			super(node, expression);
			this.run();
		}

		public run(){
			super.run();
			
			this.node.setAttribute('src', this.expression.value);
		}
	}
}