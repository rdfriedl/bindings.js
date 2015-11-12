/// <reference path="bindings.ts" />

/** @namespace bindings.utils */
module bindings {
	export module utils {

		/**
			@func setAttr
			@memberof bindings.utils
			@arg {node} element - the html element to set the attr on
			@arg {string} attr - the name of the attr
			@arg {*} value
		*/
		export function setAttr(el: HTMLElement, attr: string, value: any) {
			if (value != null)
				el.setAttribute(attr, value);
			else
				el.removeAttribute(attr);
		}

		/**
			loads a json file
			@func loadJSON
			@memberof bindings.utils
			@arg {string} url
			@arg {function} [callback]
			@arg {object|array} defaultObject
			@returns {object|array}
		*/
		export function loadJSON(url: string, cb?: Function, defaultObject?: any) {
			var func: any = bindings.utils.loadJSON;

			func.callbacks = func.callbacks || {};
			func.cache = func.cache || {};
			func.loading = func.loading || {};

			if (!func.cache[url]) {
				func.cache[url] = defaultObject || {};

				this.getJSON(url,'GET',(json)=>{ //done
					func.cache[url].__proto__ = json.__proto__;
					if (json instanceof Array) {
						for (var i = 0; i < json.length; i++) {
							func.cache[url].push(json[i]);
						};
					}
					else {
						for (var i in json) {
							if (json[i] != null) func.cache[url][i] = json[i];
						}
					}

					if (cb) cb(json);

					if (func.callbacks[url]) {
						for (var i = 0; i < func.callbacks[url].length; i++) {
							func.callbacks[url][i](json);
						};
					}
				},(err) => { //fail
					if (cb) cb(false);

					if (func.callbacks[url]) {
						for (var i = 0; i < func.callbacks[url].length; i++) {
							func.callbacks[url][i](false);
						};
					}
				});
			}
			else if (func.loading[url]) {
				func.callbacks[url] = func.callbacks[url] || [];
				func.callbacks[url].push(cb);
			}
			else {
				if (cb) cb(func.cache[url]);
			}
			return func.cache[url];
		}

		/**
			@func getJSON
			@memberof bindings.utils
			@arg {string} url
			@arg {string} [mode=GET]
			@arg {function} [resolve]
			@arg {function} [reject]
			@returns {json}
		*/
		export function getJSON(url: string, mode: string, resolve?: Function, reject?: Function) {
			var xhttp: XMLHttpRequest = new XMLHttpRequest();
			xhttp.onloadend = function() {
				var json: any;

				try{
					json = JSON.parse(xhttp.responseText);
					resolve && resolve(json);
				}
				catch(e){
					reject && reject(e);
				}
			}
			xhttp.open(mode? mode.toUpperCase() : "GET", url, true);
			xhttp.send();
		}
	}
}