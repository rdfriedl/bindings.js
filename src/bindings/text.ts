import {OneWayBinding} from '../Binding';

export default class TextBinding extends OneWayBinding{
	public static id: string = 'text';
	private oldText: string;

	constructor(node:HTMLBRElement, expression: string){
		super(node, expression);

		this.oldText = this.node.textContent;
		this.run();
	}

	public run(){
		super.run();
		this.node.innerText = this.expression.value;
	}

	public unbind(){
		super.unbind();
		this.node.textContent = this.oldText;
	}
}
