export class Binding {
	public static id: string = '';
	public expression: Expression;
	public node: Node;
	public static priority: number = 0;

	public get scope(): Scope{
		return this.node.__scope__;
	}

	public run(){}
	public unbind(){}
}

export class OneWayBinding extends Binding{
	/** a list of scopes or values this binding is listening to */
	private dependencies: any[] = [];
	private updateDependenciesOnChange: boolean = false;

	constructor(public node: HTMLElement, expression: string){
		super();
		this.expression = new Expression(node, expression, this.scope);

		this.updateDependencies();
	}

	/** this is called when one of the dependencies change */
	public dependencyChange() {
		if(this.updateDependenciesOnChange){
			this.updateDependencies();
		}
		this.run();
	}

	/** this is called when the expresion changes */
	public run(){
		super.run();
		this.expression.run();

		if(this.dependencies.length == 0 && !this.expression.success){ //if there are no depenencies and are expression failed then bind to are scope
			this.dependencies.push(this.scope);
			this.bindDependencies();
			this.updateDependenciesOnChange = true; //when dependecies change update them
		}
	}

	/** unbinds the binding from the html node */
	public unbind(){
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

export class TwoWayBinding extends OneWayBinding{
	public domEvents: string[] = []; //add events to this list to bind to them
	private dontUpdate: boolean = false;

	constructor(node: HTMLElement, expression: string){
		super(node, expression);

		//update the node
		this.run();

		this.bindEvents();
	}

	/** this is called when the dom changes */
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

export class EventBinding extends Binding{
	public domEvents: string[] = [];

	constructor(public node: HTMLElement, expression: string){
		super();
		this.expression = new Expression(node, expression, this.scope);

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

export class InlineBinding extends Binding{
	private dependencies: any[] = []; //a list of scopes and values this bindings uses
	private updateDependenciesOnChange: boolean = false;
	public expression: Expression;

	public get scope(): Scope{
		return this.node.__scope__;
	}

	constructor(public node: Node){
		super();
		this.expression = new Expression(node, <string> node.nodeValue, this.scope);
		this.updateDependencies();

		this.run();
	}

	public dependencyChange(){
		if(this.updateDependenciesOnChange){
			this.updateDependencies();
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

export {Binding as default};

import Scope from './Scope';
import Expression from './Expression';
