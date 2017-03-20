import {OneWayBinding} from '../Binding';

export default class StyleBinding extends OneWayBinding{
	public static id: string = 'style';

	constructor(node: HTMLElement, expression: string, public style: string){
		super(node, expression);
		this.run();
	}

	public run(){
		super.run();

		this.node.style[this.style] = this.expression.value;
	}
}
