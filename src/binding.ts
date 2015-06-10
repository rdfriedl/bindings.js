/// <reference path="bindings.ts" />

module bindings{
	export class Binding {
		public static id: string = '';
		public expression: bindings.expression;

		public get scope(){
			return this.element.__scope__;
		}

		constructor(public element: HTMLElement, public attr: Attr) {
			this.expression = new bindings.expression(attr, this.scope);
		}

		public run(){

		}

		public unbind(){
			
		}
	}
	export class OneWayBinding extends bindings.Binding{
		private dependencies: any[] = []; //a list of scopes and values this bindings uses
		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			this.updateDependencies();
		}

		public dependencyChange(){
			this.run();
		}

		public run(){
			super.run();
			this.expression.run();
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
			this.getDependencies(true);
			this.unbindDependencies();
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
		constructor(element: HTMLElement, attr: Attr){
			super(element, attr);

			this.bindEvents();
		}

		public change(event:Event){
			this.dontUpdate = true; //dont update (call this.run) the element
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
				this.element.addEventListener(this.domEvents[i], this.change.bind(this));
			}
		}

		public unbindEvents(){
			for (var i = 0; i < this.domEvents.length; i++){
				this.element.removeEventListener(this.domEvents[i], this.change.bind(this));
			}
		}
	}
	export class EventBinding extends bindings.Binding{
		public domEvents: string[] = [];

		constructor(public element: HTMLElement, public attr: Attr){
			super(element, attr);

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
				this.element.addEventListener(this.domEvents[i], this.change.bind(this));
			}
		}

		public unbindEvents(){
			for (var i = 0; i < this.domEvents.length; i++){
				this.element.removeEventListener(this.domEvents[i], this.change.bind(this));
			}
		}
	}
}

module bindingTypes{
	export function createBinding(type:string,element:HTMLElement, attr:Attr): bindings.Binding{
		var binding: bindings.Binding;
		for(var i in this){
			if(this[i].id == type){
				binding = <bindings.Binding> new this[i](element, attr);
				break;
			}
		}
		return binding;
	}
}