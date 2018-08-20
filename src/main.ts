class Main {

  private static app:App;

  public static main():void {

    this.app = new App();
    this.app.start();

    document.body.appendChild(this.app.view.view);

  }

}

window.onload = function () {
  //Main.main();
  window['Main'] = Main;
  Main.main();
}

if (window['Main']) {
  window.location.reload();
}