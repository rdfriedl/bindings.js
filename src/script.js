/**
 * Reprsents a srcipt on a dom element.
 *
 * @class
 * @param {String} Script - The Script as a String.
 * @param {bindings.Scope} Scope - The scope this script will run on.
 */
bindings.Script = function(srcString,scope){
	if(!(scope instanceof bindings.Scope) && !(scope instanceof bindings.Value)) throw new Error('second argument has to be a Scope or a Value');

	this.string = srcString || '';
	this.scope = scope;

	return this;
}
bindings.Script.prototype = {
	value: undefined,
	success: true,
	string: '',
	scope: undefined,
	requires: undefined,
	eval: bindings._eval,
	update: function(){
		//run string
		var e = this.eval(this.string,this.scope);
		this.value = e.value;
		this.success = e.success;

		return this;
	},
	getRequires: function(refresh){
		if(!this.requires || refresh){
			this.requires = bindings._evalRequires(this.string,this.scope).requires;
		}

		return this.requires;
	},
	setEval: function(evalFunction){ //eval has to return a object containing two values, success and value
		//test function
		try{
			var data = evalFunction('this',this.scope);

			if(data !== undefined){
				if(!data.hasOwnProperty('value') && !data.hasOwnProperty('success')){
					throw new Error('function dose not return a object or returned object is missing values');
				}
			}
			else{
				throw new Error('function dose not return a object');
			}

			this.eval = evalFunction
		}
		catch(e){
			console.error('invalid eval function');
			console.error(e);
		}
	}
}
bindings.Script.prototype.constructor = bindings.Script;