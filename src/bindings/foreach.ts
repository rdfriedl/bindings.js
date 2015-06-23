/// <reference path="../bindings.ts" />

// bind-foreach
module bindingTypes{
	export class ForEachBinding extends bindings.OneWayBinding{
		public static id: string = 'foreach';
		private children: HTMLElement[] = [];

		constructor(node: HTMLElement, attr: Attr){
			super(node, attr);

			for (var i = 0; i < this.node.children.length; i++){
				this.children.push(<HTMLElement> this.node.children[i]);
			}
			this.removeAllChildren();

			this.run();
		}

		private restoreChildren(){
			for(var i in this.children){
				this.node.appendChild(this.children[i]);
			}
		}

		private removeAllChildren(){
			while (this.node.children.length !== 0) {
			    this.node.removeChild(this.node.children[0]);
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
						el.__addedScope__ = {
							$index: i,
							$isFirst: i==0,
							$isLast: i==scope.values.length-1
						}
						this.node.appendChild(el)
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