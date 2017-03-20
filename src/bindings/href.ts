import {OneWayBinding} from '../Binding';
import {setAttr} from '../utils';

export default class HrefBinding extends OneWayBinding{
	public static id: string = 'href';

	constructor(node: HTMLElement, expression: string){
		super(node, expression);
		this.run();
	}

	public run(){
		super.run();

		setAttr(this.node, 'href', this.expression.value);
	}
}
