/// <reference path="../bindings.ts" />

// bind-html
module bindingTypes{
	export class HTMLBinding extends bindings.OneWayBinding{
		public static id: string = 'html';
		private oldText: string;

		constructor(node:HTMLBRElement,attr: Attr){
			super(node, attr);
			
			this.oldText = this.node.textContent;
			this.run();
		}

		public run(){
			super.run();
			this.node.innerHTML = this.expression.value;
		}

		public unbind(){
			super.unbind();
			this.node.textContent = this.oldText;
		}
	}
}