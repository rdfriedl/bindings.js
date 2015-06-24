/// <reference path="../bindings.ts" />

// bind-enabled
module bindingTypes{
	export class EnabledBinding extends bindings.OneWayBinding{
		public static id: string = 'enabled';

		constructor(node: HTMLElement, expression: string){
			super(node, expression);
			this.run();
		}

		public run(){
			super.run();
			
			if(this.expression.value){
				this.node.removeAttribute('disabled')
			}
			else{
				this.node.setAttribute('disabled','disabled')
			}
		}
	}
}