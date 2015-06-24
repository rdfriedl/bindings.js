/// <reference path="../bindings.ts" />

// bind-style-[style]
module bindingTypes{
	export class StyleBinding extends bindings.OneWayBinding{
		public static id: string = 'style';

		constructor(node: HTMLElement, expression: string, public style: string){
			super(node, expression);
			this.run();
		}

		public run(){
			super.run();
			
			this.node.style[this.style] = this.expression.value;
		}
	}
}