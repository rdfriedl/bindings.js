/// <reference path="../bindings.ts" />

// bind-foreach
module bindingTypes{
	export class ForEachBinding extends bindings.OneWayBinding{
		public static id: string = 'foreach';
		private children: HTMLElement[] = [];

		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			for (var i = 0; i < this.element.children.length; i++){
				this.children.push(<HTMLElement> this.element.children[i]);
			}
			this.removeAllChildren();

			this.run();
		}

		private restoreChildren(){
			for(var i in this.children){
				this.element.appendChild(this.children[i]);
			}
		}

		private removeAllChildren(){
			while (this.element.children.length !== 0) {
			    this.element.removeChild(this.element.children[0]);
			}
		}

		public run(){
			// super.run(); dont run because we arnt going to use .run on are expression
			var scope: bindings.Scope = this.expression.runOnScope().value;

			this.removeAllChildren();

			if(scope instanceof bindings.Scope){
				for (var i in scope.values) {
					for (var k = 0; k < this.children.length; k++) {
						var el: HTMLElement = <HTMLElement> this.children[k].cloneNode(true);
						el.__scope__ = scope.values[i];
						this.element.appendChild(el)
					};
				};
			}
			else{
				throw new Error('bind-foreach requires a Object or Array');
			}
		}

		public unbind(){
			this.removeAllChildren();
			super.unbind();
			this.restoreChildren();
		}
	}
}