/// <reference path="../bindings.ts" />

module bindingTypes{
	export class ClassBinding extends bindings.OneWayBinding {
		public static id: string = 'class';

		/**
			@constructs bindingTypes.ClassBinding
			@extends bindings.OneWayBinding
		*/
		constructor(node: HTMLElement, expression: string, public bindClass: string){
			super(node, expression);
			this.run();
		}

		/**
			@public
			@override
		*/
		public run(){
			super.run();
			
			if(this.expression.value && !this.hasClass()){
				this.addClass();
			}
			else if(this.hasClass()){
				this.removeClass()
			}
		}

		/** @private */
		private addClass(){
			this.node.className += ' '+this.bindClass;
			this.node.className = this.node.className.trim()
		}

		/** @private */
		private removeClass(){
			this.node.className = this.node.className.replace(new RegExp('(?:^|\s)'+this.bindClass+'(?!\S)','g'), '' )
			this.node.className = this.node.className.trim()
		}

		/** @private */
		private hasClass(): boolean{
			return this.node.className.indexOf(this.bindClass) !== -1;
		}
	}
}