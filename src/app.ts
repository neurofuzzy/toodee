class App {

  public model:Models.Model;
  public view:Views.View;
  public controller:Controllers.Controller;

  constructor () {

  }

  public init ():App {

    this.model = new Models.Model().init();
    this.view = new Views.View().initWithModel(this.model);
    this.controller = new Controllers.Controller().initWithModelAndView(this.model, this.view);

    return this;

  }

  public start () {

    this.controller.start()

  }

}