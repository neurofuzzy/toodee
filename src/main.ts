class Main {

  public static app:App;

  public static main():void {

    this.app = new App().init();
    this.app.start();

  }

}

// folderol

window.onload = function () {
  //Main.main();
  window['Main'] = Main;
  Main.main();
}

window.onblur = function () {
  Main.app.pause();
}

window.onfocus = function () {
  Main.app.resume();
}

if (window['Main']) {
  window.location.reload();
}
