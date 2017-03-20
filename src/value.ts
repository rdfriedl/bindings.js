import EventEmiter from './EventEmiter';

export default class Value extends EventEmiter {
	constructor(public key: string = '', public value: any, public parent: Scope){
		super();
	}

	public dispose(){

	}

	public setValue(value:any):any{
		this.value = value;
		this.update()
		return this.value;
	}

	public updateValue(value:any){
		this.parent.updateKey(this.key, value);
	}

	/**
	 * fires the change evnet
	 */
	public update(){
		this.emit('change', this.value);
	}
}

import Scope from './Scope';
