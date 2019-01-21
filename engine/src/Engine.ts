class Engine {

  public model:Simulation.Model;
  public simulation:Simulation.Controller;

  public init ():Engine {

    this.model = new Simulation.Model().init();
    this.simulation = new Simulation.Controller().initWithModel(this.model);

    return this;

  }

  public start ():void {

    this.simulation.start();

  }

  public update ():void {

    this.simulation.update();

  }

  public stop ():void {

    this.simulation.stop();

  }

  get api ():Simulation.API<Simulation.Boundary, Simulation.Entity> {

    return this.simulation.api;
    
  }

}

interface IEngineDelegate {

  init(engine:Engine):any;
  start():void;
  update():void;
  stop():void;
  pause():void;
  resume():void;
  onModelEvent(event:Models.IEvent<Simulation.Entity | Simulation.Boundary | Simulation.Projectile>):void;
  onContactEvent(event:Models.IEvent<any>):void;
  onBoundaryCrossEvent(event:Models.IEvent<any>):void;

}
