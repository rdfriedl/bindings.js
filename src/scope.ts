/// <reference path="bindings.ts" />

module bindings {
	export class Scope extends bindings.EventEmiter {
		public values: any;
		private observer;
		/**
			@constructs bindings.Scope
			@arg {string} key
			@arg {object} object
			@arg {bindings.Modal} modal
			@arg {bindings.Scope} [parent]
			@extends bindings.EventEmiter
		*/
		constructor(public key: string, public object: Object, public modal: bindings.Modal, public parent:bindings.Scope = undefined) {
			super();

			this.values = (object instanceof Array) ? [] : {};
			this.setKeys(this.object);

			//watch for changes
			this.observer = this.objectChange.bind(this);
			Object.observe(this.object, this.observer);
		}

		public dispose(){
			Object.unobserve(this.object, this.observer);
		}

		public getKey(value:any){
			for (var i in this.values) {
				if(this.values[i].value == value){
					return i;
				}
			};
		}

		public setKey(key:string,value:any,dontFire:boolean = false){
			if(this.values[key] == undefined){
				//add it
				if(typeof value == 'object'){
					this.values[key] = new bindings.Scope(key,value,this.modal,this);
				}
				else{
					this.values[key] = new bindings.Value(key,value,this);
				}
			}

			if(this.values[key] instanceof bindings.Value){
				this.values[key].setValue(value);
			}
			else if(this.values[key] instanceof bindings.Scope){
				this.values[key].setKeys(value);
			}
			if(!dontFire) this.update();
		}

		public setKeys(keys:any,dontFire:boolean = false){
			for (var i in keys) {
				this.setKey(i,keys[i],true);
			};
			if(!dontFire) this.update();
		}

		public removeKey(key:string,dontFire:boolean = false){
			this.values[key].dispose();
			delete this.values[key];
			if(!dontFire) this.emit('change',this);
		}

		public updateKey(key:string,value:any){ //update key on modal object
			this.object[key] = value;
		}
		public updateKeys(keys:any){ //update key on modal object
			for(var i in keys){
				this.updateKey(i,keys[i]);
			}
		}

		public update(){
			this.emit('change',this.object);
		}

		/**
			called when the object changes
			@private
		*/
		private objectChange(data:any){
			for (var i = 0; i < data.length; i++) {
				if(data[i].name == '_bindings') continue;

				switch(data[i].type){
					case 'add':
						this.setKey(data[i].name,data[i].object[data[i].name],true);
						this.update();
						break;
					case 'update':
						this.setKey(data[i].name,data[i].object[data[i].name],true);
						break;
					case 'delete':
						this.removeKey(data[i].name,true);
						this.update();
						break;
				}
			}
			// this.update(); dont update at end, only update if a key is delete/added
		}

		/**
			@override
			@arg {string} event
			@arg {*} [data]
			@arg {string} [direction]
		*/
		public emit(event: string, data: any = undefined,direction: string = ''){
			super.emit(event, data);

			switch(direction){
				case 'down':
					for(var i in this.values){
						if(this.values[i] instanceof bindings.Scope){
							this.values[i].emit(event, data, direction);
						}
						else{
							this.values[i].emit(event, data);
						}
					}
					break;
				case 'up':
					if(this.parent){
						this.parent.emit(event, data, direction);
					}
					break;
			}
		}
	}
}