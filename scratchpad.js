const rpcLogNone = 0;
const rpcLogError = 1;
const rpcLogSuccess = 2;

let rpcLogLevel = 1;

function logPromise(x) { console.log(x); return x; }
function errorPromise(x) { console.error(x); throw x; }

let rpcId = 1;
function RpcObject(method, params) {
  this.method = method;
  if (params) { this.params = params; }
  this.id = rpcId++;
  this.jsonrpc = "2.0";
}

function RpcPromise(data) {
  const method = 'POST';
  const endpoint = '/jsonrpc';
  var p = new Promise(function (resolve, reject) {
    var x = new XMLHttpRequest();
    x.open(method, endpoint); //, isAsync, user, pass);
    x.onload = function (evt) {
      if (x.status == 200) {
        var jsonRpcResponse = undefined;
        try {
          jsonRpcResponse = JSON.parse(evt.target.response);
        } catch (ignore) { }
        if (jsonRpcResponse) {
          if (jsonRpcResponse.result !== undefined) {
            resolve(jsonRpcResponse.result);
          } else if (jsonRpcResponse.error !== undefined) {
            reject(jsonRpcResponse.error);
          } else {
            reject(jsonRpcResponse);
          }
        } else {
          reject(Error("Could not parse " + evt.target.response));
        }
      } else {
        reject(Error(x.statusText));
      }
    };
    x.onerror = function() {
      reject(Error("Network error"));
    };
    x.setRequestHeader('Content-Type', 'application/json');
    x.send(JSON.stringify(data));
  });
  
  if (rpcLogLevel >= rpcLogSuccess) {
    p = p.then(logPromise);
  }
  if (rpcLogLevel >= rpcLogError) {
    p = p.catch(errorPromise);
  }
  
  return p;
}

function introspectAll() {
  RpcPromise(new RpcObject("JSONRPC.Introspect")).then(logPromise);
}

function introspectCommand(command) {
  return RpcPromise(new RpcObject("JSONRPC.Introspect", {filter: { id: command, type: "method"} } ))
   .then(result => {
     console.log(result);
     return result;
   })
   .catch(error => console.log("Couldn't find specified command", command));
}