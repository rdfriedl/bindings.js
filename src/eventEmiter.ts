export default class EventEmiter {
	/**
		an array of event listeners\
		@member
		@private
		@type {Object[]}
	*/
	private events: Object = {};

	/**
		@constructs EventEmiter
	*/
	constructor() {
	}

	/**
		binds a listener to an event
		@public
		@param {string} event
		@param {function} listener
		@param {Object} [ctx] - the object to run the call back on
	*/
	public on(event: string, fn: Function, ctx: any = undefined) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		if (ctx) fn = fn.bind(ctx);
		this.events[event].push(fn);
	}

	/**
		unbinds a listener from an event
		@public
		@param {string} event
		@param {function} listener
	*/
	public off(event: string, fn: Function) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		if (this.events[event].indexOf(fn) !== -1) {
			this.events[event].splice(this.events[event].indexOf(fn), 1);
		}
	}

	/**
		binds a listener that is only called once to an event
		@public
		@param {string} event
		@param {function} listener
		@param {Object} [ctx] - the object to run the call back on
	*/
	public once(event: string, fn: Function, ctx: any = undefined) {
		this.on(event, function(event, _this) {
			if (fn) fn();
			this.off(event, _this);
		}.bind(this), ctx);
	}

	/**
		fires an event
		@public
		@param {string} event
		@param {*} [data]
	*/
	public emit(event: string, data: any = undefined) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		for (var i = 0; i < this.events[event].length; i++) {
			this.events[event][i](data);
		};
	}
}
