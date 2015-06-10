/// <reference path="../bindings.ts" />

// bind-with
module bindingTypes{
	export class WithBinding extends bindings.OneWayBinding{
		public static id: string = 'with';

		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			this.run();
		}

		run(){
			// super.run(); dont run because we arnt going to use .run on are expression
			var scope: bindings.Scope = this.expression.runOnScope().value;

			if(scope instanceof bindings.Scope){
				for (var i = 0; i < this.element.children.length; i++){
					var el: HTMLElement = <HTMLElement> this.element.children[i];
					el.__scope__ = scope;
				}
			}
			else{
				throw new Error('bind-with requires a Object or Array');
			}
		}
	}
}