class Engine {

  public model:Simulation.Model;
  public simulation:Simulation.Controller;

  public init ():Engine {

    this.model = new Simulation.Model().init();
    this.simulation = new Simulation.Controller().initWithModel(this.model);

    return this;

  }

  public start () {

    this.simulation.start();

  }

  public stop () {

    this.simulation.stop();

  }

  get api () {

    return this.simulation.api;
    
  }

}