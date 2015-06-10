/// <reference path="../bindings.ts" />

// bind-text
module bindingTypes{
	export class TextBinding extends bindings.OneWayBinding{
		public static id: string = 'text';
		private oldText: string;

		constructor(element:HTMLBRElement,attr: Attr){
			super(element, attr);
			
			this.oldText = this.element.textContent;
			this.run();
		}

		public run(){
			super.run();
			this.element.innerText = this.expression.value;
		}

		public unbind(){
			super.unbind();
			this.element.textContent = this.oldText;
		}
	}
}