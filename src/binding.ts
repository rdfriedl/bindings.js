/// <reference path="bindings.ts" />

module bindings{
	export class Binding {
		public static id: string = '';
		public expression: bindings.Expression;
		public node: Node;
		public static priority: number = 0;

		public get scope(){
			return this.node.__scope__;
		}

		constructor() {

		}

		public run(){

		}

		public unbind(){
			
		}
	}
	export class OneWayBinding extends bindings.Binding{
		private dependencies: any[] = []; //a list of scopes and values this bindings uses
		private updateDependenciesOnChange: boolean = false;
		constructor(public node: HTMLElement, expression: string){
			super();
			this.expression = new bindings.Expression(node, expression, this.scope);

			this.updateDependencies();
		}

		public dependencyChange() {
			if(this.updateDependenciesOnChange){
				this.updateDependencies(); //todo: for some reason this freezes the page...?
			}
			this.run();
		}

		public run(){ //this is called when the expresion changes
			super.run();
			this.expression.run();

			if(this.dependencies.length == 0 && !this.expression.success){ //if there are no depenencies and are expression failed then bind to are scope
				this.dependencies.push(this.scope);
				this.bindDependencies();
				this.updateDependenciesOnChange = true; //when dependecies change update them
			}
		}

		public unbind(){ //remove every thing
			this.unbindDependencies();
		}

		public getDependencies(refresh: boolean = false): any[]{
			if(refresh || this.dependencies == undefined){
				//get dependencies
				this.dependencies = this.expression.getDependencies().requires;
			}
			return this.dependencies;
		}

		public updateDependencies(){
			this.unbindDependencies();
			this.getDependencies(true);
			this.bindDependencies();
		}

		public bindDependencies(){
			for (var i: number = 0; i < this.dependencies.length; i++){
				this.dependencies[i].on('change', this.dependencyChange.bind(this));
			}
		}

		public unbindDependencies(){
			for (var i: number = 0; i < this.dependencies.length; i++){
				this.dependencies[i].off('change', this.dependencyChange.bind(this));
			}
		}
	}
	export class TwoWayBinding extends bindings.OneWayBinding{
		public domEvents: string[] = []; //add events to this list to bind to them
		private dontUpdate: boolean = false;
		constructor(node: HTMLElement, expression: string){
			super(node, expression);

			//update the node
			this.run();

			this.bindEvents();
		}

		public change(event:Event){ //this is called when the dom changes
			this.dontUpdate = true; //dont update (call this.run) the node
		}

		public dependencyChange(){
			if(!this.dontUpdate){
				super.dependencyChange();
			}
			this.dontUpdate = false;
		}

		public unbind(){
			super.unbind();

			this.unbindEvents();
		}

		public updateEvents(){
			this.unbindEvents();
			this.bindEvents();
		}

		public bindEvents(){
			for (var i = 0; i < this.domEvents.length; i++){
				this.node.addEventListener(this.domEvents[i], this.change.bind(this));
			}
		}

		public unbindEvents(){
			for (var i = 0; i < this.domEvents.length; i++){
				this.node.removeEventListener(this.domEvents[i], this.change.bind(this));
			}
		}
	}
	export class EventBinding extends bindings.Binding{
		public domEvents: string[] = [];

		constructor(public node: HTMLElement, expression: string){
			super();
			this.expression = new bindings.Expression(node, expression, this.scope);

			this.bindEvents();
		}

		public change(event:Event){
			this.expression.run();

			if(this.expression.value instanceof Function && this.scope){
				//run it on the scope
				this.expression.value.call(this.scope.object, event);
			}
		}

		public unbind(){
			super.unbind();

			this.unbindEvents();
		}

		public updateEvents(){
			this.unbindEvents();
			this.bindEvents();
		}

		public bindEvents(){
			for (var i = 0; i < this.domEvents.length; i++){
				this.node.addEventListener(this.domEvents[i], this.change.bind(this));
			}
		}

		public unbindEvents(){
			for (var i = 0; i < this.domEvents.length; i++){
				this.node.removeEventListener(this.domEvents[i], this.change.bind(this));
			}
		}
	}
	export class InlineBinding extends bindings.Binding{
		private dependencies: any[] = []; //a list of scopes and values this bindings uses
		private updateDependenciesOnChange: boolean = false;
		public expression: bindings.Expression;

		public get scope(){
			return this.node.__scope__;
		}

		constructor(public node: Node){
			super();
			this.expression = new bindings.Expression(node, <string> node.nodeValue, this.scope);
			this.updateDependencies();

			this.run();
		}

		public dependencyChange(){
			if(this.updateDependenciesOnChange){
				this.updateDependencies(); //todo: for some reason this freezes the page...?
			}
			this.run();
		}

		public run(){
			this.expression.run();

			this.node.nodeValue = this.expression.value;

			if(this.dependencies.length == 0 && !this.expression.success){ //if there are no depenencies and are expression failed then bind to are scope
				this.dependencies.push(this.scope);
				this.bindDependencies();
				this.updateDependenciesOnChange = true; //when dependecies change update them
			}
		}

		public unbind(){ //remove every thing
			this.unbindDependencies();
		}

		public getDependencies(refresh: boolean = false): any[]{
			if(refresh || this.dependencies == undefined){
				//get dependencies
				this.dependencies = this.expression.getDependencies().requires;
			}
			return this.dependencies;
		}

		public updateDependencies(){
			this.unbindDependencies();
			this.getDependencies(true);
			this.bindDependencies();
		}

		public bindDependencies(){
			for (var i = 0; i < this.dependencies.length; i++){
				this.dependencies[i].on('change', this.dependencyChange.bind(this));
			}
		}

		public unbindDependencies(){
			for (var i = 0; i < this.dependencies.length; i++){
				this.dependencies[i].off('change', this.dependencyChange.bind(this));
			}
		}
	}
}

module bindingTypes{
	export function getBinding(type: string){
		var binding: bindings.Binding;
		for(var i in this){
			if(this[i].id == type){
				return this[i];
			}
		}
		return binding;
	}
	export function createBinding(type: any, node: HTMLElement, expression: string): bindings.Binding {
		if (!(type instanceof Array)) {
			type = [type];
		}
		var binding: bindings.Binding;
		var id: string = type[0];
		type.splice(0, 1); //remove first entry
		var data: string = type.join('-');
		for(var i in this){
			if(this[i].id == id){
				binding = <bindings.Binding> new this[i](node, expression, data);
				break;
			}
		}
		return binding;
	}
}