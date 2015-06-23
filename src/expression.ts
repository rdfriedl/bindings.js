/// <reference path="bindings.ts" />

module bindings{
	export class Expression{
		public success: boolean = true;
		public value: any = undefined;
		public dependencies: any[] = [];

		constructor(public node: Node, public expression:any, public scope:bindings.Scope){

		}

		public run():any{
			var data: any = {
				value: undefined,
				success: true,
			}
			var variables: any = {
				$modal: (this.scope.modal)? this.scope.modal.scope.object : undefined,
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
				alert: bindings.noop,
				eval: bindings.noop
			}

			var variables:any = {
				$modal: (this.scope.modal)? this.buildContext(this.scope.modal.scope,data) : undefined,
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
			}

			this.dependencies = data.requires;

			return data;
		}

		private buildContext(scope: bindings.Scope, requires: any = { requires: [], gets: [], sets: [] }, dontSet: boolean = false): any {
			var object: any = (scope.object instanceof Array) ? [] : {};
			var get: Function = function(scope, object, index, requires) {
				if (requires.gets.indexOf(scope.values[index]) == -1) {
					requires.requires.push(scope.values[index]);
					requires.gets.push(scope.values[index]);
				}

				if (scope.values[index] instanceof bindings.Scope) {
					return this.buildContext(scope.values[index], requires, dontSet).context;
				}
				else if (scope.values[index] instanceof bindings.Value) {
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

			return {
				context: object,
				requires: requires
			};
		}
	}
}