var RpcObject = (function RpcConstructor_closure() {
	"use strict";
	const rpcLogNone = 0;
	const rpcLogError = 1;
	const rpcLogSuccess = 2;

	function logPromise(x) { console.log(x); return x; }
	function errorPromise(x) { console.error(x); throw x; }

	var rpcId = 1;
	var output = function RpcObject(method, params) {
	  this.method = method;
	  if (params) { this.params = params; }
	  this.id = rpcId++;
	  this.jsonrpc = "2.0";
	};
	output.LogLevel = 1;
	return output;
}());