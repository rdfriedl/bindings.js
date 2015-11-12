/// <reference path="../bindings.ts" />

module bindingTypes{
	export class ForEachBinding extends bindings.OneWayBinding{
		public static id: string = 'foreach';
		public static priority: number = 3;
		private children: Node[] = [];

		/**
			@constructs bindingTypes.ForEachBinding
			@arg {HTMLElement} node
			@arg {string} expression
			@extends bindings.OneWayBinding
		*/
		constructor(node: HTMLElement, expression: string){
			super(node, expression);
			for (var i = 0; i < this.node.childNodes.length; i++){
				this.children.push(this.node.childNodes[i]);
			}
			this.removeAllChildren();

			this.run();
		}

		/** @private */
		private restoreChildren(){
			for(var i in this.children){
				this.node.appendChild(this.children[i]);
			}
		}

		/** @private */
		private removeAllChildren(){
			while (this.node.childNodes.length !== 0) {
			    this.node.removeChild(this.node.childNodes[0]);
			}
		}

		/**
			@override
			@public
		*/
		public run(){
			// super.run(); dont run because we arnt going to use .run on are expression
			var scope: bindings.Scope = this.expression.runOnScope().value;

			this.removeAllChildren();

			if(scope instanceof bindings.Scope){
				for (var i = 0; i < scope.values.length; i++) {
					for (var k = 0; k < this.children.length; k++) {
						var el: Node = this.children[k].cloneNode(true);
						el.__scope__ = scope.values[i];
						el.__addedScope__ = bindings.extend(el.__addedScope__,{
							$index: i,
							$isFirst: i==0,
							$isLast: i==scope.values.length-1
						});
						this.node.appendChild(el)
					};
				};
			}
			else{
				throw new Error('bind-foreach requires a Object or Array');
			}
		}

		/**
			@override
			@public
		*/
		public unbind(){
			this.removeAllChildren();
			super.unbind();
			this.restoreChildren();
		}
	}
}