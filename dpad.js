// ui bindings
document.addEventListener("DOMContentLoaded", function ui_closure() {
  [{cls:".dpad-up", cmd:"Input.Up"},
   {cls:".dpad-down", cmd:"Input.Down"},
   {cls:".dpad-left", cmd:"Input.Left"},
   {cls:".dpad-right", cmd:"Input.Right"},
   {cls:".dpad-back", cmd:"Input.Back"},
   {cls:".dpad-menu", cmd:"Input.ContextMenu"},
   {cls:".dpad-select", cmd:"Input.Select"}].forEach(x => {
    document.querySelector(x.cls).onclick = () => RPC.send(x.cmd);
  });

  document.querySelector(".dpad").onkeypress = evt => {
    var cmd;
    switch (evt.keyCode) {
      case 13: // enter
        cmd = "Input.Select"
        break;
      case 8: // backspace
        cmd = "Input.Back"
        break;
      case 37:
        cmd = "Input.Left";
        break;
      case 38:
        cmd = "Input.Up";
        break;
      case 39:
        cmd = "Input.Right";
        break;
      case 40:
        cmd = "Input.Down";
        break;
      default:
        break;
    }
    if (!cmd && evt.charCode == 99) { // "c"
      cmd = "Input.ContextMenu";
    }
    if (cmd) {
      RPC.send(cmd);
    } else {
      console.info("Unhandled keypress", evt);
    }
  }
}, false);