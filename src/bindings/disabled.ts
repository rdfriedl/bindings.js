import {OneWayBinding} from '../Binding';

export default class DisabledBinding extends OneWayBinding{
	public static id: string = 'disabled';

	constructor(node: HTMLElement, expression: string){
		super(node, expression);
		this.run();
	}

	public run(){
		super.run();

		if(!this.expression.value){
			this.node.removeAttribute('disabled')
		}
		else{
			this.node.setAttribute('disabled','disabled')
		}
	}
}
