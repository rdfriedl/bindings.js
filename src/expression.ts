/// <reference path="bindings.ts" />

module bindings{
	export class expression{
		public success: boolean = true;
		public value: any = undefined;
		public dependencies: any[] = [];

		constructor(public attr:Attr,public scope:bindings.Scope){

		}

		public run():any{
			var data: any = {
				value: undefined,
				success: true,
			}
			var addedScope: any = {
				$modal: (this.scope.modal)? this.scope.modal.scope.object : undefined,
				$parent: (this.scope.parent)? this.scope.parent.object : undefined
			};

			var funcString: string = 'new Function("addedScope","', args = [];
			var context = this.scope.object;
			args.push(addedScope);

			funcString += 'with(this){';
			funcString += 'with(addedScope){';
			funcString += 'return ';
			funcString += this.attr.value;
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
				requires: [], //all values in this src
				sets: [], //array of values set
				gets: [] //array of values got
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

			var addedScope:any = {
				$modal: (this.scope.modal)? this.buildContextFromScope(this.scope.modal.scope,data) : undefined,
				$parent: (this.scope.parent)? this.buildContextFromScope(this.scope.parent,data) : undefined
			};

			var funcString: string = 'new Function("hidden","addedScope",', args: any[] = [];
			var context: any = {};

			args.push(hidden);
			args.push(addedScope);

			//build context
			context = this.buildContextFromScope(this.scope,data);

			funcString += '"';
			funcString += 'with(this){';
			funcString += 'with(hidden){';
			funcString += 'with(addedScope){';
			funcString += 'return ';
			funcString += this.attr.value;
			funcString += '}';
			funcString += '}';
			funcString += '}';
			funcString += '")';
			var func: Function = eval(funcString);

			try{
				func.apply(context,args);
			}
			catch(e){
				data.success = false;
			}

			this.dependencies = data.requires;

			return data;
		}

		private buildContextFromScope(scope:bindings.Scope,data:any):any{
			var object: any = (scope.object instanceof Array) ? [] : {};
			for (var i in scope.values) {

				object.__defineGetter__(i,function(object,i,data,fn){
					if(data.gets.indexOf(this.values[i]) == -1){
						data.requires.push(this.values[i]);
						data.gets.push(this.values[i]);
					}

					if(this.values[i].value instanceof Function){
						if(this.values[i] instanceof bindings.Scope){
							return fn(this.values[i]);;
						}
						else{
							return this.values[i].value;
						}
					}
				}.bind(scope,object,i,data,this.buildContextFromScope))

				object.__defineSetter__(i,function(object,i,data,fn,val){
					data.requires.push(this.values[i]);
					data.sets.push(this.values[i]);
					
					// this.values[i].setValue(val);
					// object[i] = val;
				}.bind(scope,object,i,data,this.buildContextFromScope))
			};
			return object;
		}
	}
}