export class GameControllers {

  protected _supported:boolean;
  protected _connected:boolean;

  public get supported ():boolean {
    return this._supported;
  }

  public get connected ():boolean {
    return this._connected;
  }

  public getFirstGamepad ():Gamepad {
    for (let i = 0; i < this.controllers.length; i++) {
      if (this.controllers[i] != null) {
        return this.controllers[i];
      }
    }
  }

  public controllers:Gamepad[];

  constructor () {

    this._supported = navigator['getGamepads'] || navigator['webkitGetGamepads'];
    this.controllers = [];

    window.addEventListener("gamepadconnected", () => { this.gamepadConnected });
    window.addEventListener("gamepaddisconnected", () => { this.gamepadDisconnected });

    if (this._supported) {
      setInterval(() => { this.scan(); }, 50);
    }

  }

  public scan () {

    if (!this.supported) {
      return;
    }

    var gamepads:Gamepad[] = navigator['getGamepads'] ? navigator.getGamepads() : (navigator['webkitGetGamepads'] ? navigator['webkitGetGamepads']() : []);
        
    for (var i = 0; i < gamepads.length; i++) {
        
        if (gamepads[i]) {
            this.controllers[gamepads[i].index] = gamepads[i];
        }
        
    }

  }

  gamepadConnected (e:GamepadEvent) {
        
    console.log("Gamepad connected", e);

    if (e.gamepad) {
      this.controllers[e.gamepad.index] = e.gamepad;
      this._connected = true;
    }
  }

  gamepadDisconnected (e:GamepadEvent) {

    console.log("Gamepad disconnected", e);
    this.controllers[e.gamepad.index] = null;

    this._connected = false;

    this.controllers.forEach(function (gamepad) {
      if (gamepad != null) {
        this._connected = true;
      }
    });
    
  }

}