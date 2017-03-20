import {TwoWayBinding} from '../Binding';

export default class InputBinding extends TwoWayBinding{
	public static id: string = 'input';

	constructor(public node: HTMLInputElement, expression: string){
		super(<HTMLElement> node, expression);

		this.domEvents = ['input'];
		this.updateEvents();
	}

	public run(){
		super.run();
		this.node.value = this.expression.value;
	}

	public change(event:Event){
		super.change(event);
		var value = this.expression.runOnScope().value;
		if(value instanceof Value)
			value.updateValue(this.node.value);
	}
}

import Value from '../Value';
