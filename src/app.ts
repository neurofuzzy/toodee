class App {

  public view:PIXI.Application;

  constructor () {

    this.view = new PIXI.Application();

  }

  public start () {

    console.log("starting...");

    var rect = new PIXI.Graphics()
      .beginFill(0x00ff00)
      .drawRect(40, 40, 200, 200);

    // Add to the stage
    this.view.stage.addChild(rect);

  }

}

window.onload = function () {
  Main.main();
}