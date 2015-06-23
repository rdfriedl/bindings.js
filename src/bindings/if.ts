/// <reference path="../bindings.ts" />

// bind-if
module bindingTypes{
	export class IfBinding extends bindings.OneWayBinding{
		public static id: string = 'if';
		private children: HTMLElement[] = [];

		constructor(node: HTMLElement, attr: Attr){
			super(node, attr);

			for (var i = 0; i < this.node.children.length; i++){
				this.children.push(<HTMLElement> this.node.children[i]);
			}

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
			
			if(this.expression.value){
				this.restoreChildren();
			}
			else{
				this.removeChildren();
			}
		}

		public unbind(){
			super.unbind();
			this.removeChildren();
			this.restoreChildren();
		}
	}
}