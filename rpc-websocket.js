const commandRegister = {};
function routeCommand(response) {
  var data;
  try {
    data = JSON.parse(response.data); 
  } catch (e) {
    console.error("Could not parse response " + response.data);
  }
  if (!data) { return; }
  
  if (data.hasOwnProperty("id")) {
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
      cmd.reject(data);
    }
  } else {
    // notification
    var handler = commandRegister[data.method];
    if (handler) { handler(data); }
    else {
      console.info("Unhandled notification", data);
    }
  }
}

function getWebsocket() {
  const url = new URL("/jsonrpc", location);
  url.port = 9090;
  url.protocol = "ws";
  var webSocket = new Promise(function(resolve, reject) {
    var ws = new WebSocket(url.href);
    ws.onopen = () => resolve(ws);
    ws.onerror = () => reject(ws);
    ws.onmessage = evt => routeCommand(evt);
  });
  webSocket.then(ws => window.addEventListener('beforeunload', () => ws.close()));
  return webSocket;
}

let wp = getWebsocket();

function sendCommand(cmd) {
  // TODO: handle bare string commands
  var resolver, rejecter;
  var p = new Promise((resolve, reject) => {
    resolver = data => resolve(data);
    rejecter = error => reject(error);
  });
  commandRegister[cmd.id] = {resolve:resolver, reject:rejecter};
  wp.then(ws => ws.send(JSON.stringify(cmd)));
  return p;
}

function doTests() {
  sendCommand(new RpcObject("JSONRPC.Introspect")).then(x => console.log("Introspection: ", x));
  sendCommand(new RpcObject("VideoLibrary.Getasdfadsf")).catch(x => console.log("Success, error caught: " + x.message));
}