class Main {

  public static app:App;

  public static main():void {

    this.app = new App().init();
    this.app.start();

  }

}

// folderol

window.onload = function () {
  Main.main();
  window.document.head.setAttribute("has-main",  "yes");
}

window.onblur = function () {
  Main.app.pause();
}

window.onfocus = function () {
  Main.app.resume();
}

// get parcel to refresh on TypeScript bundle export
if (document.head.getAttribute("has-main") == "yes") {
  window.location.reload();
}
