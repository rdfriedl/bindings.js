/// <reference path="bindings.ts" />

class EventEmiter{
	private events: Object = {};

	public on(event:string,fn:Function,ctx:any = undefined){
		if(!this.events[event]){
			this.events[event] = [];
		}
		if(ctx) fn = fn.bind(ctx);
		this.events[event].push(fn);
	}

	public off(event:string,fn:Function){
		if(!this.events[event]){
			this.events[event] = [];
		}
		if(this.events[event].indexOf(fn) !== -1){
			this.events[event].splice(this.events[event].indexOf(fn),1);
		}
	}

	public once(event:string,fn:Function,ctx:any = undefined){
		this.on(event,function(event,_this){
			if (fn) fn();
			this.off(event, _this);
		}.bind(this),ctx);
	}
	
	public emit(event:string,data:any = undefined){
		if(!this.events[event]){
			this.events[event] = [];
		}
		for (var i = 0; i < this.events[event].length; i++) {
		 	this.events[event][i](data);
	 	};
	}
}