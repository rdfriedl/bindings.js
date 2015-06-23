/// <reference path="bindings.ts" />

module bindings{
	export class Binding {
		public static id: string = '';
		public expression: bindings.Expression;
		public node: Node;

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
		constructor(public node: HTMLElement, attr: Attr){
			super();
			this.expression = new bindings.Expression(node, attr.value, this.scope);

			this.updateDependencies();
		}

		public dependencyChange(){
			if(this.updateDependenciesOnChange){
				this.updateDependencies(); //todo: for some reason this freezes the page...?
			}
			this.run();
		}

		public run(){
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
		constructor(node: HTMLElement, attr: Attr){
			super(node, attr);

			this.bindEvents();
		}

		public change(event:Event){
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

		constructor(public node: HTMLElement, public attr: Attr){
			super();
			this.expression = new bindings.Expression(node, attr.value, this.scope);

			this.bindEvents();
		}

		public change(event:Event){
			this.expression.run();
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
}

module bindingTypes{
	export function createBinding(type:string, node:HTMLElement, attr:Attr): bindings.Binding{
		var binding: bindings.Binding;
		for(var i in this){
			if(this[i].id == type){
				binding = <bindings.Binding> new this[i](node, attr);
				break;
			}
		}
		return binding;
	}
}