var RPC = (function RPC_closure() {
	"use strict";
	
	// retain references to commands while awaiting response from the server
	const commandRegister = {};
	const notificationHandlers = {};
	
	// Adds a handler which will be called-back when the notification is received
	function addNotificationHandler(notification, handler) {
		var handlerList = notificationHandlers[notification];
		if (!handlerList) {
			notificationHandlers[notification] = handlerList = [];
		}
		handlerList.push(handler);
	}
	
	// Removes the given handler from the notification listing
	function removeNotificationHandler(notification, handler) {
		var handlerList = notificationHandlers[notification];
		if (handlerList) {
			notificationHandlers[notification] = handlerList.filter(x => x != handler);
		}
	}
	
	// for a given server response, locate its command and resolve/reject as appropriate
	// response is a WebSocket MessageEvent
	function routeCommand(response) {
	  var data;
	  try {
		data = JSON.parse(response.data); 
	  } catch (e) {
		console.error("Could not parse response " + response.data);
	  }
	  if (!data) { return; }
	  
	  if (data.hasOwnProperty("id")) {
	    // if the response has an "id", it is a response to a previously-issued command
		var cmd = commandRegister[data.id];
		if (!cmd) {
		  console.error("Could not find corresponding command for data", data);
		  return;
		}

		if (data.result) {
		  cmd.resolve(data.result);
		} else if (data.error) {
		  cmd.reject(data.error);
		} else {
		  // this is a very-unexpected state
		  console.error("RPC response had neither \"result\" nor error");
		  cmd.reject(data);
		}
	  } else {
		// if the response has no "id", it's a push-notification
		var handler = notificationHandlers[data.method];
		if (handler) { handler(data); }
		else {
		  // TODO: implement debug levels
		  console.info("Unhandled notification", data);
		}
	  }
	}

	// returns a promise for a websocket
	function getWebsocket() {
	  // The JSON-RPC endpoint path and protocol are not configurable in XBMC
	  const url = new URL("/jsonrpc", location);
	  url.port = 9090; // TODO: handle configurable TCP port in XBMC
	  url.protocol = "ws";
	  var webSocket = new Promise(function(resolve, reject) {
		var ws = new WebSocket(url.href);
		ws.onopen = () => resolve(ws);
		ws.onerror = () => reject(ws);
		// TODO: sensible handling of ws.onclose
		// each incoming message should be routed to the client-issued command
		// which prompted it, or should trigger a notification handler
		ws.onmessage = evt => routeCommand(evt);
	  });
	  // attempt to close the websocket nicely, if at all possible
	  // in Firefox, this typically fails
	  webSocket.then(ws => window.addEventListener('beforeunload', () => ws.close()));
	  return webSocket;
	}

	var wp = getWebsocket();

	// sends the given command; the command must be either a string (in which
	// case it is converted to a JSON-RPC object), or a valid JSON-RPC object
	// returns a promise which is resolved with the result if the command succeeds,
	// or rejected with the error if the command fails
	function sendCommand(cmd) {
	  // ensure that cmd is a valid command
	  if ((typeof cmd) == "string") {
		cmd = new RpcObject(cmd);
	  }
	  if (!cmd.hasOwnProperty("id")) {
		throw Error("Attempted to send command without an ID");
	  }
	  if (cmd.jsonrpc != "2.0") {
		throw Error("Cannot send non-JSONRPC/2.0 commands");
	  }
	  
	  // acquire external references to the promise resolve/reject methods
	  var resolver, rejecter;
	  var p = new Promise((resolve, reject) => {
		resolver = data => resolve(data);
		rejecter = error => reject(error);
	  });
	  
	  // register the above references in the command register
	  commandRegister[cmd.id] = {resolve:resolver, reject:rejecter};
	  
	  // send the command, and return the promise
	  wp.then(ws => ws.send(JSON.stringify(cmd)));
	  return p;
	}

	// couple of basic tests to verify that real commands resolve with their response,
	// and illegal commands reject with an error
	function doTests() {
	  sendCommand(new RpcObject("JSONRPC.Introspect")).then(x => console.log("Introspection: ", x));
	  sendCommand(new RpcObject("VideoLibrary.Getasdfadsf")).catch(x => console.log("Success, error caught: " + x.message));
	}
	
	// expose public methods
	return {
		addNotificationHandler:addNotificationHandler,
		removeNotificationHandler:removeNotificationHandler,
		send:sendCommand,
	};
}());