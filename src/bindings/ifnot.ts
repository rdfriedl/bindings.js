import {OneWayBinding} from '../Binding';

export default class IfNotBinding extends OneWayBinding{
	public static id: string = 'ifnot';
	private children: HTMLElement[] = [];

	constructor(node: HTMLElement, expression: string){
		super(node, expression);
		for (var i = 0; i < this.node.children.length; i++){
			this.children.push(<HTMLElement> this.node.children[i]);
		}

		this.run();
	}

	private restoreChildren(){
		for(var i in this.children){
			this.node.appendChild(this.children[i]);
		}
	}

	private removeChildren(){
		while (this.node.children.length !== 0) {
		    this.node.removeChild(this.node.children[0]);
		}
	}

	public run(){
		super.run();

		if(!this.expression.value){
			this.restoreChildren();
		}
		else{
			this.removeChildren();
		}
	}

	public unbind(){
		super.unbind();
		this.removeChildren();
		this.restoreChildren();
	}
}
