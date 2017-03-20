import {EventBinding} from '../Binding';

export default class SubmitBinding extends EventBinding{
	public static id: string = 'submit';

	constructor(node: HTMLElement, expression: string){
		super(node, expression);
		this.domEvents = ['submit'];
		this.updateEvents();
	}

	public change(event:Event){
		super.change(event);
		event.preventDefault();
	}
}
