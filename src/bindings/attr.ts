import {OneWayBinding} from '../Binding';
import {setAttr} from '../utils';

export default class AttrBinding extends OneWayBinding{
	public static id: string = 'attr';

	constructor(node: HTMLElement, expression: string, public attr: string){
		super(node, expression);
		this.run();
	}

	public run(){
		super.run();

		setAttr(this.node, this.attr, this.expression.value);
	}
}
