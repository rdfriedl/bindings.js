import {EventBinding as _EventBinding} from '../Binding';

export default class EventBinding extends _EventBinding{
	public static id: string = 'event';

	constructor(node: HTMLElement, expression: string, bindEvent: string){
		super(node, expression);

		this.domEvents = [bindEvent];
		this.updateEvents();
	}
}
