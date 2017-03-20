import {OneWayBinding} from '../Binding';

export default class WithBinding extends OneWayBinding{
	public static id: string = 'with';
	public static priority: number = 1;

	constructor(node: HTMLElement, expression: string){
		super(node, expression);
		this.run();
	}

	public run(){
		// super.run(); dont run because we arnt going to use .run on are expression
		var scope: Scope = this.expression.runOnScope().value;

		if(scope instanceof Scope){
			for (var i = 0; i < this.node.childNodes.length; i++){
				var el: Node = this.node.childNodes[i];
				el.__scope__ = scope;
			}
		}
		else{
			throw new Error('bind-with requires a Object or Array');
		}
	}
}

import Scope from '../Scope';
