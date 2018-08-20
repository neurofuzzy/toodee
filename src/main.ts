class Main {

  private static app:App;

  public static main():void {

    this.app = new App().init();
    this.app.start();

  }

}

// falderal

window.onload = function () {
  //Main.main();
  window['Main'] = Main;
  Main.main();
}

if (window['Main']) {
  window.location.reload();
}