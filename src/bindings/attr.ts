/// <reference path="../bindings.ts" />

// bind-attr-*
module bindingTypes{
	export class AttrBinding extends bindings.OneWayBinding{
		public static id: string = 'attr';

		constructor(node: HTMLElement, expression: string, public attr: string){
			super(node, expression);
			this.run();
		}

		public run(){
			super.run();
			
			bindings.utils.setAttr(this.node, this.attr, this.expression.value);
		}
	}
}