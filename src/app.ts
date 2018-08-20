class App {

  public view:PIXI.Application;

  constructor () {

    this.view = new PIXI.Application();

  }

  public start () {

    console.log("starting...");

    for (let i = 0; i < 100; i++) {

      var x = Math.random() * 640;
      var y = Math.random() * 640;

      var rect = new PIXI.Graphics()
        .beginFill(0xf0ff00)
        .drawRect(x, y, 20, 20);

      // Add to the stage
      this.view.stage.addChild(rect);

    }

  }

}