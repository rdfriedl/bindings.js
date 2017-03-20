import {OneWayBinding} from '../Binding';

export default class HiddenBinding extends OneWayBinding{
	public static id: string = 'hidden';

	constructor(node: HTMLElement, expression: string){
		super(node, expression);
		this.run();
	}

	public run(){
		super.run();

		if(this.expression.value){
			this.node.style.display = 'none'
		}
		else{
			this.node.style.display = ''
		}
	}
}
