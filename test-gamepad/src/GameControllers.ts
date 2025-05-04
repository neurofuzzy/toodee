export class GameControllers {

  protected _supported:boolean;
  protected _connected!:boolean;

  public get supported ():boolean {
    return this._supported;
  }

  public get connected ():boolean {
    return this._connected;
  }

  public getFirstGamepad ():Gamepad | null {
    for (let i = 0; i < this.controllers.length; i++) {
      if (this.controllers[i] != null) {
        return this.controllers[i];
      }
    }
    return null;
  }

  public controllers:(Gamepad | null)[];

  constructor () {

    this._supported = !!((navigator as any)['getGamepads'] || (navigator as any)['webkitGetGamepads']);
    this.controllers = [];

    window.addEventListener("gamepadconnected", (e) => { this.gamepadConnected(e as GamepadEvent); });
    window.addEventListener("gamepaddisconnected", (e) => { this.gamepadDisconnected(e as GamepadEvent); });

    if (this._supported) {
      setInterval(() => { this.scan(); }, 50);
    }

  }

  public scan () {

    if (!this.supported) {
      return;
    }

    var gamepads:(Gamepad | null)[] = (navigator as any)['getGamepads'] ? (navigator as any).getGamepads() : ((navigator as any)['webkitGetGamepads'] ? (navigator as any)['webkitGetGamepads']() : []);
        
    for (var i = 0; i < gamepads.length; i++) {
        
        if (gamepads[i]) {
            this.controllers[gamepads[i]!.index] = gamepads[i];
        }
        
    }

  }

  gamepadConnected = (e:GamepadEvent) => {
        
    console.log("Gamepad connected", e);

    if (e.gamepad) {
      this.controllers[e.gamepad.index] = e.gamepad;
      this._connected = true;
    }
  }

  gamepadDisconnected = (e:GamepadEvent) => {

    console.log("Gamepad disconnected", e);
    this.controllers[e.gamepad.index] = null;

    this._connected = false;

    this.controllers.forEach((gamepad) => {
      if (gamepad != null) {
        this._connected = true;
      }
    });
    
  }

}