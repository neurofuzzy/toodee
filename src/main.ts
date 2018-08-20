class Main {

  private static app:App;

  public static main():void {

    this.app = new App();
    this.app.start();

    document.body.appendChild(this.app.view.view);

  }

}

window.onload = function () {
  Main.main();
}