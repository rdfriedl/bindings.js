import {OneWayBinding} from '../Binding';

export default class EnabledBinding extends OneWayBinding{
	public static id: string = 'enabled';

	constructor(node: HTMLElement, expression: string){
		super(node, expression);
		this.run();
	}

	public run(){
		super.run();

		if(this.expression.value){
			this.node.removeAttribute('disabled')
		}
		else{
			this.node.setAttribute('disabled','disabled')
		}
	}
}
