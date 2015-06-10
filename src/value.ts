/// <reference path="bindings.ts" />

module bindings{
	export class Value extends EventEmiter{
		public key: string = '';
		public value: any;
		public parent: bindings.Scope;
		constructor(key:string,value:any,parent:bindings.Scope){
			super();

			this.key = key;
			this.value = value;
			this.parent = parent;
		}

		public setValue(value:any):any{
			this.value = value;
			this.update()
			return this.value;
		}

		public updateValue(value:any){
			this.parent.updateKey(this.key, value);
		}

		public update(){
			this.emit('change', this.value);
		}
	}
}