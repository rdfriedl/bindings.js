export default class Expression{
	public success: boolean = true;
	public value: any = undefined;
	public dependencies: any[] = [];

	/**
		@constructs Expression
		@param {node} node - the node to use for this expression
		@param {string} expression
		@param {Scope} scope
	*/
	constructor(public node: Node, public expression:any, public scope:Scope){

	}

	/**
		@public
	*/
	public run():any{
		var data: any = {
			value: undefined,
			success: true,
			error: undefined
		}
		var variables: any = {
			$node: this.node
		};

		var funcString: string = 'new Function("variables","addedScope","', args = [];
		var context = this.buildContext(this.scope).context;
		args.push(variables);
		args.push(this.node.__addedScope__ || {});

		funcString += 'with(this){';
		funcString += 'with(variables){';
		funcString += 'with(addedScope){';
		funcString += 'return ';
		funcString += this.expression;
		funcString += '}';
		funcString += '}';
		funcString += '}';
		funcString += '")';
		var func: Function = eval(funcString);

		try{
			data.value = func.apply(context,args);
		}
		catch(e){
			data.success = false;
			data.error = e;
		}

		this.value = data.value;
		this.success = data.success;

		return data;
	}

	public runOnScope(){
		var data:any = {
			value: undefined,
			success: false
		}
		var _data = this.getDependencies();
		data.value = _data.gets[_data.gets.length-1];
		data.success = !!data.value;
		return data;
	}

	public getDependencies(){
		var data: any = {
			success: true,
			error: undefined,
			requires: [],
			gets: [],
			sets: []
		}
		var hidden: any = {
			console: {},
			window: {},
			navigator:{},
			localStorage: {},
			location: {},
			alert: noop,
			eval: noop
		}

		var variables:any = {
			$node: this.node
		};

		var funcString: string = 'new Function("hidden","variables","addedScope",', args: any[] = [];

		args.push(hidden);
		args.push(variables);
		args.push(this.node.__addedScope__ || {});

		//build context
		var context = this.buildContext(this.scope,data,true);

		funcString += '"';
		funcString += 'with(this){';
		funcString += 'with(hidden){';
		funcString += 'with(variables){';
		funcString += 'with(addedScope){';
		funcString += 'return ';
		funcString += this.expression;
		funcString += '}';
		funcString += '}';
		funcString += '}';
		funcString += '}';
		funcString += '")';
		var func: Function = eval(funcString);

		try{
			func.apply(context.context,args);
		}
		catch(e){
			data.success = false;
			data.error = e;
		}

		this.dependencies = data.requires;

		return data;
	}

	private buildContext(scope: Scope, requires: any = { requires: [], gets: [], sets: [] }, dontSet: boolean = false): any {
		var object: any = (scope.object instanceof Array) ? [] : {};
		var get: Function = function(scope, object, index, requires) {
			if (requires.gets.indexOf(scope.values[index]) == -1) {
				requires.requires.push(scope.values[index]);
				requires.gets.push(scope.values[index]);
			}

			if (scope.values[index] instanceof Scope) {
				return this.buildContext(scope.values[index], requires, dontSet).context;
			}
			else if (scope.values[index] instanceof Value) {
				if (!(scope.values[index].value instanceof Function) || !dontSet) {
					return scope.values[index].value;
				}
			}
		};
		var set: Function = function(scope, object, index, requires, val) { //val is from the setter
			requires.requires.push(scope.values[index]);
			requires.sets.push(scope.values[index]);

			if (!dontSet) {
				scope.object[index] = val;
			}
		};

		for (var i in scope.values) {
			object.__defineGetter__(i,get.bind(this,scope,object,i,requires))
			object.__defineSetter__(i,set.bind(this,scope,object,i,requires))
		};

		//$parent
		if(scope.parent){
			object.__defineGetter__('$parent',function(scope, object, requires, dontSet){
				if (!scope.parent) return;

				if(requires.gets.indexOf(scope.parent) == -1){
					requires.requires.push(scope.parent);
					requires.gets.push(scope.parent);
				}

				return this.buildContext(scope.parent,requires,dontSet).context;
			}.bind(this,scope,object,requires,dontSet))
		}
		else{
			object.$parent = undefined;
		}

		// $Modal
		if(scope.modal){
			object.__defineGetter__('$modal',function(scope, object, requires, dontSet){
				if (!scope.modal) return;

				if(requires.gets.indexOf(scope.modal.scope) == -1){
					requires.requires.push(scope.modal.scope);
					requires.gets.push(scope.modal.scope);
				}

				return this.buildContext(scope.modal.scope,requires,dontSet).context;
			}.bind(this,scope,object,requires,dontSet))
		}
		else{
			object.$modal = undefined
		}

		return {
			context: object,
			requires: requires
		};
	}
}

import Scope from './Scope';
import Value from './Value';
import {noop} from './utils';
