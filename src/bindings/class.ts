import {OneWayBinding} from '../Binding';

export default class ClassBinding extends OneWayBinding {
	public static id: string = 'class';

	constructor(node: HTMLElement, expression: string, public bindClass: string){
		super(node, expression);
		this.run();
	}

	public run(){
		super.run();

		if(this.expression.value && !this.hasClass()){
			this.addClass();
		}
		else if(this.hasClass()){
			this.removeClass()
		}
	}

	private addClass(){
		this.node.className += ' '+this.bindClass;
		this.node.className = this.node.className.trim()
	}

	private removeClass(){
		this.node.className = this.node.className.replace(new RegExp('(?:^|\s)'+this.bindClass+'(?!\S)','g'), '' )
		this.node.className = this.node.className.trim()
	}

	private hasClass(): boolean{
		return this.node.className.indexOf(this.bindClass) !== -1;
	}
}
