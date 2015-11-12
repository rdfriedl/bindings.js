/// <reference path="../bindings.ts" />

module bindingTypes{
	export class IfBinding extends bindings.OneWayBinding{
		public static id: string = 'if';
		private children: HTMLElement[] = [];

		/**
			@constructs bindingTypes.IfBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@extends bindings.OneWayBinding
		*/
		constructor(node: HTMLElement, expression: string){
			super(node, expression);
			for (var i = 0; i < this.node.children.length; i++){
				this.children.push(<HTMLElement> this.node.children[i]);
			}

			this.run();
		}

		/** @private */
		private restoreChildren(){
			for(var i in this.children){
				this.node.appendChild(this.children[i]);
			}
		}

		/** @private */
		private removeChildren(){
			while (this.node.children.length !== 0) {
			    this.node.removeChild(this.node.children[0]);
			}
		}

		/**
			@override
			@public
		*/
		public run(){
			super.run();
			
			if(this.expression.value){
				this.restoreChildren();
			}
			else{
				this.removeChildren();
			}
		}

		/**
			@override
			@public
		*/
		public unbind(){
			super.unbind();
			this.removeChildren();
			this.restoreChildren();
		}
	}
}