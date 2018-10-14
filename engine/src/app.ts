class App {

  public model:Simulation.Model;
  public simulation:Simulation.Controller;
  public view:Views.View;

  public init ():App {

    this.model = new Simulation.Model().init();
    this.simulation = new Simulation.Controller().initWithModel(this.model);
    this.view = new Views.View().initWithModel(this.model);

    return this;

  }

  public start () {

    this.simulation.start();

  }

  public stop () {

    this.simulation.stop();

  }

}