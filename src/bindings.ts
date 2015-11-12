/// <reference path="eventEmiter.ts" />
/// <reference path="utils.ts" />
/// <reference path="modal.ts" />
/// <reference path="scope.ts" />
/// <reference path="value.ts" />
/// <reference path="binding.ts" />
/// <reference path="expression.ts" />
//types
/// <reference path="bindings/attr.ts" />
/// <reference path="bindings/class.ts" />
/// <reference path="bindings/click.ts" />
/// <reference path="bindings/disabled.ts" />
/// <reference path="bindings/enabled.ts" />
/// <reference path="bindings/event.ts" />
/// <reference path="bindings/foreach.ts" />
/// <reference path="bindings/href.ts" />
/// <reference path="bindings/html.ts" />
/// <reference path="bindings/if.ts" />
/// <reference path="bindings/ifnot.ts" />
/// <reference path="bindings/input.ts" />
/// <reference path="bindings/repeat.ts" />
/// <reference path="bindings/src.ts" />
/// <reference path="bindings/style.ts" />
/// <reference path="bindings/submit.ts" />
/// <reference path="bindings/text.ts" />
/// <reference path="bindings/value.ts" />
/// <reference path="bindings/visible.ts" />
/// <reference path="bindings/hidden.ts" />
/// <reference path="bindings/with.ts" />

/**
	@namespace bindings
*/
module bindings {
	/**
		creates a {@link bindings.Modal} from a Object
		@func createModal
		@memberof bindings
		@arg {Object} modal - the object that this modal will use
		@arg {Object} options - a object that contains some options
		@see {@link bindings.Modal}
		@returns {@link Bindings.Modal}
	*/
	export function createModal(modalObject:any = {},options:any = {}){
		var modal: bindings.Modal = new bindings.Modal(modalObject, options);

		modalObject._bindings = modal;

		return modal;
	}
	/**
		@func createModal
		@memberof bindings
		@arg {bindings.Modal} modal - the modal to use when applying bindings to the html
		@arg {Node} node - the html element
	*/
	export function applyBindings(modal:any = {},node:any = document): void{
		if(modal instanceof bindings.Modal){
			modal.applyBindings(node)
		}
		else if(modal._bindings instanceof bindings.Modal){
			modal._bindings.applyBindings(node)
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
	export function clone(obj: any){
		if(typeof obj == 'object'){
			return JSON.parse(JSON.stringify(obj));
		}
	}
	export function extend(obj: any,obj2: any){
		obj = obj || {};
		obj2 = obj2 || {};
		for(var i in obj2){
			obj[i] = obj2[i];
		}
		return obj;
	}
	export function extendNew(o1:any = {},o2:any = {},o3:any = {},o4:any = {}){
		var o = {};
		for(var i in arguments){
			this.extend(o, arguments[i]);
		}
		return o;
	}
}

interface ObjectConstructor{
	unobserve(beingObserved: any, callback: (update: any) => any) : void;
	observe(beingObserved: any, callback: (update: any) => any) : void;
}

interface Object{
	unobserve(beingObserved: any, callback: (update: any) => any) : void;
	observe(beingObserved: any, callback: (update: any) => any) : void;
}

interface Node{
	__scope__: bindings.Scope;
	__bindings__: bindings.Binding[];
	__addedScope__: any;
}
