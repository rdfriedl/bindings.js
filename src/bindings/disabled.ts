/// <reference path="../bindings.ts" />

// bind-disabled
module bindingTypes{
	export class DisabledBinding extends bindings.OneWayBinding{
		public static id: string = 'disabled';

		constructor(node: HTMLElement, expression: string){
			super(node, expression);
			this.run();
		}

		public run(){
			super.run();
			
			if(!this.expression.value){
				this.node.removeAttribute('disabled')
			}
			else{
				this.node.setAttribute('disabled','disabled')
			}
		}
	}
}