// ui bindings
document.addEventListener("DOMContentLoaded", function ui_closure() {
  [{cls:".dpad-up", cmd:"Input.Up"},
   {cls:".dpad-down", cmd:"Input.Down"},
   {cls:".dpad-left", cmd:"Input.Left"},
   {cls:".dpad-right", cmd:"Input.Right"},
   {cls:".dpad-back", cmd:"Input.Back"},
   {cls:".dpad-menu", cmd:"Input.ContextMenu"},
   {cls:".dpad-select", cmd:"Input.Select"},
   {cls:".dpad-home", cmd:"Input.Home"},
   {cls:".dpad-pg-up", cmd:"Input.ExecuteAction", param: { action: "pageup" } },
   {cls:".dpad-pg-down", cmd:"Input.ExecuteAction", param: { action: "pagedown" } }]
   .forEach(x => {
    document.querySelector(x.cls).onclick = () => RPC.send(new RpcObject(x.cmd, x.param));
  });

  document.querySelector(".dpad").onkeypress = evt => {
    var cmd, param;
    switch (evt.key) {
      case "Enter":
	  case " ":
        cmd = "Input.Select"
        break;
	  case "Home":
	    cmd = "Input.Home";
		break;
      case "Backspace":
        cmd = "Input.Back"
        break;
      case "Left":
        cmd = "Input.Left";
        break;
      case "Up":
        cmd = "Input.Up";
        break;
      case "Right":
        cmd = "Input.Right";
        break;
      case "Down":
        cmd = "Input.Down";
        break;
	  case "c":
	    cmd = "Input.ContextMenu";
		break;
	  case "PageUp":
	    cmd="Input.ExecuteAction";
		param = { action: "pageup" };
		break;
	  case "PageDown":
	    cmd="Input.ExecuteAction";
		param = { action: "pagedown" };
		break;
		
      default:
        break;
    }
	
    if (cmd) {
      RPC.send(new RpcObject(cmd, param));
    } else {
      console.info("Unhandled keypress", evt);
    }
  }
}, false);