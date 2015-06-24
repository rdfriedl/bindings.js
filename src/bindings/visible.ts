/// <reference path="../bindings.ts" />

// bind-visible
module bindingTypes{
	export class VisibleBinding extends bindings.OneWayBinding{
		public static id: string = 'visible';

		constructor(node: HTMLElement, expression: string){
			super(node, expression);
			this.run();
		}

		public run(){
			super.run();
			
			if(this.expression.value){
				this.node.style.display = ''
			}
			else{
				this.node.style.display = 'none'
			}
		}
	}
}