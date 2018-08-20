class App {

  public model:Models.Model;
  public view:Views.View;
  public rects:Array<PIXI.Graphics>;

  constructor () {

    this.model = new Models.Model().init();
    this.view = new Views.View().initWithModel(this.model)
    this.rects = [];

    this.build();

  }

  private build () {

    this.model.build();
    this.view.build();

  }

  public start () {

    console.log("starting...");

    this.view.pixi.ticker.add(this.update);

  }

  public update = () => {

    this.model.update();
    this.view.update();

  }

  public stop () {

    console.log("stopping...");

    this.view.pixi.ticker.remove(this.update);

  }

}