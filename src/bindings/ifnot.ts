/// <reference path="../bindings.ts" />

// bind-ifnot
module bindingTypes{
	export class IfNotBinding extends bindings.OneWayBinding{
		public static id: string = 'ifnot';
		private children: HTMLElement[] = [];

		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			for (var i = 0; i < this.element.children.length; i++){
				this.children.push(<HTMLElement> this.element.children[i]);
			}

			this.run();
		}

		private restoreChildren(){
			for(var i in this.children){
				this.element.appendChild(this.children[i]);
			}
		}

		private removeChildren(){
			while (this.element.children.length !== 0) {
			    this.element.removeChild(this.element.children[0]);
			}
		}

		public run(){
			super.run();
			
			if(!this.expression.value){
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