import {OneWayBinding} from '../Binding';
import {setAttr} from '../utils';

export default class SrcBinding extends OneWayBinding{
	public static id: string = 'src';

	constructor(node: HTMLElement, expression: string){
		super(node, expression);
		this.run();
	}

	public run(){
		super.run();

		setAttr(this.node, 'src', this.expression.value);
	}
}
