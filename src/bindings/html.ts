/// <reference path="../bindings.ts" />

// bind-html
module bindingTypes{
	export class HTMLBinding extends bindings.OneWayBinding{
		public static id: string = 'html';
		private oldText: string;

		constructor(element:HTMLBRElement,attr: Attr){
			super(element, attr);
			
			this.oldText = this.element.textContent;
			this.run();
		}

		public run(){
			super.run();
			this.element.innerHTML = this.expression.value;
		}

		public unbind(){
			super.unbind();
			this.element.textContent = this.oldText;
		}
	}
}