/// <reference path="../bindings.ts" />

// bind-repeat
module bindingTypes{
	export class RepeatBinding extends bindings.OneWayBinding{
		public static id: string = 'repeat';
		private children: HTMLElement[] = [];

		constructor(node: HTMLElement, attr: Attr){
			super(node, attr);

			for (var i = 0; i < this.node.children.length; i++){
				this.children.push(<HTMLElement> this.node.children[i]);
			}
			this.removeChildren();

			this.run();
		}

		private restoreChildren(){
			for(var i in this.children){
				this.node.appendChild(this.children[i]);
			}
		}

		private removeChildren(){
			while (this.node.children.length !== 0) {
			    this.node.removeChild(this.node.children[0]);
			}
		}

		public run(){
			super.run();
			this.removeChildren();

			var times = this.expression.value;
			for (var i = 0; i < times; i++) {
				for (var k = 0; k < this.children.length; k++) {
					var el: HTMLElement = <HTMLElement> this.children[k].cloneNode(true);
					el.__addedScope__ = {
						$index: i,
						$isFirst: i==0,
						$isLast: i==times-1
					}
					this.node.appendChild(el)
				};
			};
		}

		public unbind(){
			this.removeChildren();
			super.unbind();
			this.restoreChildren();
		}
	}
}