class Main {

  public static app:App;
  public static controller:AppController;

  public static main():void {

    this.app = new App().init();
    this.controller = new AppController().init(this.app);
    this.controller.start();

  }

}

// folderol

window.onload = function () {
  Main.main();
  window.document.head.setAttribute("has-main",  "yes");
}

window.onblur = function () {
  Main.app.start();
}

window.onfocus = function () {
  Main.app.stop();
}

// get parcel to refresh on TypeScript bundle export
if (document.head.getAttribute("has-main") == "yes") {
  window.location.reload();
}