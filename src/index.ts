import Modal from './Modal';
import 'object.observe';

/**
 * creates a {@link Modal} from a Object
 * @func createModal
 * @memberof bindings
 * @param {Object} modal - the object that this modal will use
 * @param {Object} options - a object that contains some options
 * @see {@link Modal}
 * @returns {@link Bindings.Modal}
 */
export function createModal(modalObject:any = {},options:any = {}){
	var modal: Modal = new Modal(modalObject, options);

	modalObject._bindings = modal;

	return modal;
}
/**
 * @func createModal
 * @memberof bindings
 * @param {Modal} modal - the modal to use when applying bindings to the html
 * @param {Node} node - the html element
 */
export function applyBindings(modal:any = {},node:any = document): void{
	if(modal instanceof Modal){
		modal.applyBindings(node)
	}
	else if(modal._bindings instanceof Modal){
		modal._bindings.applyBindings(node)
	}
}

export * from './EventEmiter';
export * from './Expression';
export * from './Binding';
export * from './Modal';
export * from './Scope';
export * from './Value';

import * as bindingTypes from './bindingTypes';
import * as utils from './utils';
export {
	utils,
	bindingTypes
}

import Binding from './Binding';
import Scope from './Scope';
declare global {
	interface Node {
		__scope__: Scope,
		__bindings__: Binding[],
		__addedScope__: any
	}

	interface ObjectConstructor{
		unobserve(beingObserved: any, callback: (update: any) => any) : void;
		observe(beingObserved: any, callback: (update: any) => any) : void;
	}

	interface Object{
		unobserve(beingObserved: any, callback: (update: any) => any) : void;
		observe(beingObserved: any, callback: (update: any) => any) : void;
	}
}
