class App {

  public model:Util.IModel<Util.IModelItem & Geom.IBody>
  public view:Util.IView;
  public controller:Util.IController;

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