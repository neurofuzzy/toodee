class Main {

  public static engine:Engine;
  public static delegate:Delegate;

  public static main():void { 

    this.engine = new Engine().init();
    this.delegate = new Delegate().init(this.engine);
    this.delegate.start();

  }

}

// folderol

window.onload = function () {
  Main.main();
  window.document.head.setAttribute("has-main",  "yes");
}

window.onblur = function () {
  Main.delegate.start();
}

window.onfocus = function () {
  Main.delegate.stop();
}

// get parcel to refresh on TypeScript bundle export
if (document.head.getAttribute("has-main") == "yes") {
  window.location.reload();
}