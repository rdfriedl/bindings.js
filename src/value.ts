/// <reference path="bindings.ts" />

module bindings{
	export class Value extends bindings.EventEmiter {
		public key: string = '';
		public value: any;
		public parent: bindings.Scope;
		/**
			@constructs bindings.Value
			@extends bindings.EventEmiter
			@arg {string} key
			@arg {*} value
			@arg {bindings.Scope} parent
		*/
		constructor(key:string,value:any,parent:bindings.Scope){
			super();

			this.key = key;
			this.value = value;
			this.parent = parent;
		}

		public dispose(){
			
		}

		/**
			@public
			@arg {*} value
		*/
		public setValue(value:any):any{
			this.value = value;
			this.update()
			return this.value;
		}

		/**
			@public
			@arg {*} value
		*/
		public updateValue(value:any){
			this.parent.updateKey(this.key, value);
		}

		/**
			fires the change evnet
			@public
		*/
		public update(){
			this.emit('change', this.value);
		}
	}
}