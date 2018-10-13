class App {

  public model:Simulation.Model;
  public view:Views.View;
  public controller:AppController;

  constructor () {

  }

  public init ():App {

    this.model = new Simulation.Model().init();
    this.view = new Views.View().initWithModel(this.model);
    this.controller = new AppController().initWithModelAndView(this.model, this.view);

    return this;

  }

  public start () {

    this.controller.start();

  }

  public pause () {

    this.controller.pause();

  }

  public resume () {

    this.controller.resume();

  }

}