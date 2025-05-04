import { Engine } from '../../engine/src/Engine';
import { Delegate } from './delegate';

class Main {

  public static engine:Engine;
  public static delegate:Delegate;

  public static main():void { 

    Main.engine = new Engine().init();
    Main.delegate = new Delegate().init(this.engine);
    Main.delegate.start();

  }

}

// folderol


window.onload = function () {
  Main.main();
  window.document.head.setAttribute("has-main",  "yes");
}

window.onblur = function () {
  Main.delegate.pause();
} 

window.onfocus = function () {
  Main.delegate.resume();
}


// get parcel to refresh on TypeScript bundle export
if (document.head.getAttribute("has-main") == "yes") {
  window.location.reload();
}
