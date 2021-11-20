class Main {

  public static engine:Engine;
  public static delegate:Delegate;

  public static main():void { 

    Main.engine = new Engine().init();
    Main.delegate = new Delegate2().init(this.engine);
    Main.delegate.start();

  }

}

// folderol


window.addEventListener("load", () => {
  Main.main();
  window.document.head.setAttribute("has-main",  "yes");
});

window.onblur = function () {
  if (Main.delegate) {
    Main.delegate.pause();
  }
} 

window.onfocus = function () {
  if (Main.delegate) {
    Main.delegate.resume();
  }
}


// get parcel to refresh on TypeScript bundle export
if (document.head.getAttribute("has-main") == "yes") {
  window.location.reload();
}

