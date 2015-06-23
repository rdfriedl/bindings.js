/// <reference path="../bindings.ts" />

// bind-text
module bindingTypes{
	export class TextBinding extends bindings.OneWayBinding{
		public static id: string = 'text';
		private oldText: string;

		constructor(node:HTMLBRElement,attr: Attr){
			super(node, attr);
			
			this.oldText = this.node.textContent;
			this.run();
		}

		public run(){
			super.run();
			this.node.innerText = this.expression.value;
		}

		public unbind(){
			super.unbind();
			this.node.textContent = this.oldText;
		}
	}
}