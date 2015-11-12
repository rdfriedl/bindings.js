/// <reference path="bindings.ts" />

module bindings{
	export class Binding {
		/**
			@public
			@static
			@member
			@type {string}
		*/
		public static id: string = '';
		/**
			@public
			@member
			@type {bindings.Expression}
		*/
		public expression: bindings.Expression;
		/**
			@public
			@member
			@type {node}
		*/
		public node: Node;
		/**
			@public
			@static
			@member
			@type {Number}
		*/
		public static priority: number = 0;
		/**
			@public
			@member
			@readonly
			@memberof bindings.Binding
			@type {bindings.Scope}
		*/
		public get scope(){
			return this.node.__scope__;
		}

		/**
			@constructs bindings.Binding
		*/
		constructor() {

		}
		
		public run(){

		}

		public unbind(){
			
		}
	}
	export class OneWayBinding extends bindings.Binding{
		/**
			a list of scopes or values this binding is listening to
			@public
			@member
			@type {bindings.Scope|bindings.Value}
		*/
		private dependencies: any[] = []; //a list of scopes and values this bindings uses
		/**
			@public
			@member
			@type {boolean}
		*/
		private updateDependenciesOnChange: boolean = false;

		/**
			@constructs bindings.OneWayBinding
			@extends bindings.Binding
			@arg {Node} node - the html node to use in the binding
			@arg {String} expression - the expression to use for this binding
		*/
		constructor(public node: HTMLElement, expression: string){
			super();
			this.expression = new bindings.Expression(node, expression, this.scope);

			this.updateDependencies();
		}

		/**
			this is called when one of the {@link bindings.OneWayBinding#dependencies dependencies} change
			@public
		*/
		public dependencyChange() {
			if(this.updateDependenciesOnChange){
				this.updateDependencies();
			}
			this.run();
		}

		/** 
			this is called when the expresion changes 
			@public
			@override
		*/
		public run(){
			super.run();
			this.expression.run();

			if(this.dependencies.length == 0 && !this.expression.success){ //if there are no depenencies and are expression failed then bind to are scope
				this.dependencies.push(this.scope);
				this.bindDependencies();
				this.updateDependenciesOnChange = true; //when dependecies change update them
			}
		}

		/** 
			unbinds the binding from the html node
			@public
			@override
		*/
		public unbind(){
			this.unbindDependencies();
		}

		/**
			@public
		*/
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

		/**
			@constructs bindings.TwoWayBinding TwoWayBinding
			@extends bindings.OneWayBinding
			@arg {Node} node - the html node to use in the binding
			@arg {String} expression - the expression to use for this binding
		*/
		constructor(node: HTMLElement, expression: string){
			super(node, expression);

			//update the node
			this.run();

			this.bindEvents();
		}

		/**
			this is called when the dom changes
			@arg {Event} event - the event
		*/
		public change(event:Event){
			this.dontUpdate = true; //dont update (call this.run) the node
		}

		/**
			@public
			@override
		*/
		public dependencyChange(){
			if(!this.dontUpdate){
				super.dependencyChange();
			}
			this.dontUpdate = false;
		}

		/**
			@public
			@override
		*/
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

		/**
			@constructs bindings.EventBinding EventBinding
			@extends bindings.Binding
			@arg {Node} node - the html node to use in the binding
			@arg {String} expression - the expression to use for this binding
		*/
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

		/**
			@public
			@override
		*/
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

		/**
			@constructs bindings.InlineBinding InlineBinding
			@extends bindings.Binding
			@arg {Node} node - the html node to use in the binding
		*/
		constructor(public node: Node){
			super();
			this.expression = new bindings.Expression(node, <string> node.nodeValue, this.scope);
			this.updateDependencies();

			this.run();
		}

		public dependencyChange(){
			if(this.updateDependenciesOnChange){
				this.updateDependencies();
			}
			this.run();
		}

		/**
			@public
			@override
		*/
		public run(){
			this.expression.run();

			this.node.nodeValue = this.expression.value;

			if(this.dependencies.length == 0 && !this.expression.success){ //if there are no depenencies and are expression failed then bind to are scope
				this.dependencies.push(this.scope);
				this.bindDependencies();
				this.updateDependenciesOnChange = true; //when dependecies change update them
			}
		}

		/**
			@public
			@override
		*/
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

/**
	@namespace bindingTypes
*/
module bindingTypes {
	/**
		@func getBinding
		@memberof bindingTypes
		@arg {string} type - the type of binding
	*/
	export function getBinding(type: string){
		var binding: bindings.Binding;
		for(var i in this){
			if(this[i].id == type){
				return this[i];
			}
		}
		return binding;
	}
	/**
		create a binding with type that is attached to the node
		@func getBinding
		@memberof bindingTypes
		@arg {string[]|string} type - the type of binding
		@arg {Node} node - the html node
		@arg {string} expresion - the expresion for this binding to use
		@return binding.Binding
	*/
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