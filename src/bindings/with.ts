/// <reference path="../bindings.ts" />

// bind-with
module bindingTypes{
	export class WithBinding extends bindings.OneWayBinding{
		public static id: string = 'with';

		constructor(node: HTMLElement, attr: Attr){
			super(node, attr);

			this.run();
		}

		run(){
			// super.run(); dont run because we arnt going to use .run on are expression
			var scope: bindings.Scope = this.expression.runOnScope().value;

			if(scope instanceof bindings.Scope){
				for (var i = 0; i < this.node.childNodes.length; i++){
					var el: Node = this.node.childNodes[i];
					el.__scope__ = scope;
				}
			}
			else{
				throw new Error('bind-with requires a Object or Array');
			}
		}
	}
}