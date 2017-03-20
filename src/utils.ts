export function setAttr(el: HTMLElement, attr: string, value: any) {
	if (value != null)
		el.setAttribute(attr, value);
	else
		el.removeAttribute(attr);
}

export function loadJSON(url: string, cb?: Function, defaultObject?: any) {
	let func: any = loadJSON;

	func.callbacks = func.callbacks || {};
	func.cache = func.cache || {};
	func.loading = func.loading || {};

	if (!func.cache[url]) {
		func.cache[url] = defaultObject || {};

		this.getJSON(url,'GET',(json)=>{ //done
			func.cache[url].__proto__ = json.__proto__;
			if (json instanceof Array) {
				for (let i = 0; i < json.length; i++) {
					func.cache[url].push(json[i]);
				};
			}
			else {
				for (let i in json) {
					if (json[i] != null) func.cache[url][i] = json[i];
				}
			}

			if (cb) cb(json);

			if (func.callbacks[url]) {
				for (let i = 0; i < func.callbacks[url].length; i++) {
					func.callbacks[url][i](json);
				};
			}
		},(err) => { //fail
			if (cb) cb(false);

			if (func.callbacks[url]) {
				for (let i = 0; i < func.callbacks[url].length; i++) {
					func.callbacks[url][i](false);
				};
			}
		});
	}
	else if (func.loading[url]) {
		func.callbacks[url] = func.callbacks[url] || [];
		func.callbacks[url].push(cb);
	}
	else {
		if (cb) cb(func.cache[url]);
	}
	return func.cache[url];
}

export function getJSON(url: string, mode: string = 'GET', resolve?: Function, reject?: Function) {
	let xhttp: XMLHttpRequest = new XMLHttpRequest();
	xhttp.onloadend = function() {
		let json: any;

		try{
			json = JSON.parse(xhttp.responseText);
			resolve && resolve(json);
		}
		catch(e){
			reject && reject(e);
		}
	}
	xhttp.open(mode.toUpperCase(), url, true);
	xhttp.send();
}

export function extend(obj: any,obj2: any){
	obj = obj || {};
	obj2 = obj2 || {};
	for(let i in obj2){
		obj[i] = obj2[i];
	}
	return obj;
}

export function noop():void{}

export function clone(obj: any){
	if(typeof obj == 'object'){
		return JSON.parse(JSON.stringify(obj));
	}
}

export function extendNew(o1:any = {},o2:any = {},o3:any = {},o4:any = {}){
	let o = {};
	for(let i in arguments){
		this.extend(o, arguments[i]);
	}
	return o;
}

export function duplicateObject(obj2: any, count: number = 20):any{
	if(obj2 instanceof Object && obj2 !== null){
		// count = (count !== undefined)? count : 20;
		let obj: any = {};
		if(count > 0){
			// see if its an array
			if(obj2.hasOwnProperty('length')){
				obj = new Array(0);
				for (let i: number = 0; i < obj2.length; i++) {
					if(typeof obj2[i] !== 'object'){
						obj[i] = obj2[i]
					}
					else{
						obj[i] = this.duplicateObject(obj2[i],count-1)
					}
				};
			}
			else{
				for (let k in obj2){
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

export function getBinding(type: string){
	var binding: Binding;
	for(var i in bindingTypes){
		if(bindingTypes[i].id == type){
			return bindingTypes[i];
		}
	}
	return binding;
}

export function createBinding(type: any, node: HTMLElement, expression: string): Binding {
	if (!(type instanceof Array)) {
		type = [type];
	}
	var binding: Binding;
	var id: string = type[0];
	type.splice(0, 1); //remove first entry
	var data: string = type.join('-');
	for(var i in bindingTypes){
		if(bindingTypes[i].id == id){
			binding = <Binding> new bindingTypes[i](node, expression, data);
			break;
		}
	}
	return binding;
}

import * as bindingTypes from './bindingTypes';

// extend the object interface
interface ObjectConstructor{
	unobserve(beingObserved: any, callback: (update: any) => any) : void;
	observe(beingObserved: any, callback: (update: any) => any) : void;
}

interface Object{
	unobserve(beingObserved: any, callback: (update: any) => any) : void;
	observe(beingObserved: any, callback: (update: any) => any) : void;
}

import Scope from './Scope';
import Binding from './Binding';
export interface NodeWithScope extends Node{
	__scope__: Scope,
	__bindings__: Binding[],
	__addedScope__: any
}
