/// <reference path="eventEmiter.ts" />
/// <reference path="modal.ts" />
/// <reference path="scope.ts" />
/// <reference path="value.ts" />
/// <reference path="binding.ts" />
/// <reference path="expression.ts" />
//types
/// <reference path="bindings/click.ts" />
/// <reference path="bindings/enabled.ts" />
/// <reference path="bindings/disabled.ts" />
/// <reference path="bindings/foreach.ts" />
/// <reference path="bindings/if.ts" />
/// <reference path="bindings/ifnot.ts" />
/// <reference path="bindings/live-update.ts" />
/// <reference path="bindings/repeat.ts" />
/// <reference path="bindings/submit.ts" />
/// <reference path="bindings/text.ts" />
/// <reference path="bindings/value.ts" />
/// <reference path="bindings/with.ts" />
/// <reference path="bindings/visible.ts" />

module bindings {
	export function createModal(object:any = {},element:any = document){
		if (element instanceof Document) element = element.body;

		var modal: bindings.Modal = new bindings.Modal(object, element);

		object._bindings = modal;

		return object;
	}
	export function applyBindings(modal:any = {},element:any = document): void{
		if (element instanceof Document) element = element.body;

		if(modal instanceof bindings.Modal){
			modal.applyBindings(element)
		}
		else if(modal._bindings instanceof bindings.Modal){
			modal._bindings.applyBindings(element)
		}
	}
	export function duplicateObject(obj2:any,count:number = 20):Object{
		if(obj2 instanceof Object && obj2 !== null){
			// count = (count !== undefined)? count : 20;
			if(count > 0){
				// see if its an array
				if(obj2.hasOwnProperty('length')){
					var obj: any[] = new Array(0);
					for (var i: number = 0; i < obj2.length; i++) {
						if(typeof obj2[i] !== 'object'){
							obj[i] = obj2[i]
						}
						else{
							obj[i] = this.duplicateObject(obj2[i],count-1)
						}
					};
				}
				else{
					var obj: any[];
					for (var k in obj2){
						if(!(obj2[k] instanceof Object)){
							obj[k] = obj2[k]
						}
						else{
							obj[k] = this.duplicateObject(obj2[k],count-1)
						}
					}
				}
			}
			return obj;
		}
		else{
			return obj2
		}
	}
	export function noop():void{}
}

interface ObjectConstructor  {
	unobserve(beingObserved: any, callback: (update: any) => any) : void;
	observe(beingObserved: any, callback: (update: any) => any) : void;
}

interface HTMLElement{
	__scope__: bindings.Scope;
	__bindings__: bindings.Binding[];
}