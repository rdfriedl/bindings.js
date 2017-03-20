import {OneWayBinding} from '../Binding';

export default class HTMLBinding extends OneWayBinding{
	public static id: string = 'html';
	private oldText: string;

	constructor(node:HTMLBRElement, expression: string){
		super(node, expression);

		this.oldText = this.node.textContent;
		this.run();
	}

	public run(){
		super.run();
		this.node.innerHTML = this.expression.value;
	}

	public unbind(){
		super.unbind();
		this.node.textContent = this.oldText;
	}
}
