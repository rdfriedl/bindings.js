/// <reference path="../bindings.ts" />

// bind-repeat
module bindingTypes{
	export class RepeatBinding extends bindings.OneWayBinding{
		public static id: string = 'repeat';
		private children: Node[] = [];

		constructor(node: HTMLElement, attr: Attr){
			super(node, attr);

			for (var i = 0; i < this.node.childNodes.length; i++){
				this.children.push(this.node.childNodes[i]);
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
			while (this.node.childNodes.length !== 0) {
			    this.node.removeChild(this.node.childNodes[0]);
			}
		}

		public run(){
			super.run();
			this.removeChildren();

			var times = this.expression.value;
			for (var i = 0; i < times; i++) {
				for (var k = 0; k < this.children.length; k++) {
					var el: Node = this.children[k].cloneNode(true);
					el.__addedScope__ = bindings.extend(el.__addedScope__,{
						$index: i,
						$isFirst: i == 0,
						$isLast: i == times - 1
					});
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