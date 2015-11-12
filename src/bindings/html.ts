/// <reference path="../bindings.ts" />

module bindingTypes{
	export class HTMLBinding extends bindings.OneWayBinding{
		public static id: string = 'html';
		private oldText: string;

		/**
			@constructs bindingTypes.HTMLBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@extends bindings.OneWayBinding
		*/
		constructor(node:HTMLBRElement,expression: string){
			super(node, expression);
			
			this.oldText = this.node.textContent;
			this.run();
		}

		/**
			@override
			@public
		*/
		public run(){
			super.run();
			this.node.innerHTML = this.expression.value;
		}

		/**
			@override
			@public
		*/
		public unbind(){
			super.unbind();
			this.node.textContent = this.oldText;
		}
	}
}