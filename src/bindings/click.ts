import {EventBinding} from '../Binding';

export default class ClickBinding extends EventBinding{
	public static id: string = 'click';

	constructor(node: HTMLElement, expression: string){
		super(node, expression);

		this.domEvents = ['click'];
		this.updateEvents();
	}
}
