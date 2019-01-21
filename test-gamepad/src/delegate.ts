class Delegate implements IEngineDelegate {
  
  protected engine:Engine;
  protected paused:boolean;
  protected started:boolean;
  protected step:number = 0;
  protected api:Simulation.API<Simulation.Boundary, Simulation.Entity>;
  protected view:Models.IView<Simulation.Model>;
  protected gameControllers:GameControllers;

  public init(engine:Engine):any {

    this.engine = engine;
    this.api = this.engine.api;
    this.api.addModelListener(this.onModelEvent, this);
    this.api.addContactListener(this.onContactEvent, this);
    this.api.addBoundaryCrossListener(this.onBoundaryCrossEvent, this);
    this.view = new Views.TestView().initWithModel(this.engine.model);
    this.gameControllers = new GameControllers();

    this.gameControllers.scan();

    return this;

  }

  protected build () {

    var model = this.engine.model;
    var sim = this.engine.simulation;

    // make a boundary

    let vertices:Array<Geom.IPoint> = [];
    let len = 12;
    let radius = 250;
    let cenX = 400;
    let cenY = 300;

    for (let i = 0; i < len; i++) {

      let ang = i * (360 / len) * Math.PI / 180; 
      let rr = radius;
      let x = rr * Math.sin(ang);
      let y = rr * Math.cos(ang);
      vertices.push(new Geom.Point(x + cenX, y + cenY));

    }

    let bnd = new Simulation.Boundary(vertices);
    bnd.drag = 0.01;
    model.boundaries.addItem(bnd);

    let b = new Geom.Bounds(400, 300, 10, 10, Math.floor(Math.random() * 2 + 1));
    let c = new Geom.Constraints();

    b.shape = Geom.SHAPE_ROUND;
    c.lockX = c.lockY = false;

    var item:Simulation.Entity = new Simulation.Entity().initWithBoundsAndConstraints(b, c);
    
    model.bodies.addItem(item);
  
  }

  public start () {

    console.log("starting...");
    this.build();

    this.engine.simulation.start();

    this.started = true;

    window.requestAnimationFrame(() => { this.update() })

  }

  public update () {

    if (this.started) {
      window.requestAnimationFrame(() => { this.update() })
    } else {
      return;
    }

    var model = this.engine.model;

    let gamepad = this.gameControllers.getFirstGamepad();

    if (gamepad) {

      let a = gamepad.axes;

      var item = model.bodies.items[0];

      var deltaX = a[0];
      var deltaY = a[1];

      if (Math.abs(deltaX) < 0.1) {
        deltaX = 0;
      }

      if (Math.abs(deltaY) < 0.1) {
        deltaY = 0;
      }

      this.api.applyImpulse(item, deltaX, deltaY);

      //item.velocity.x = a[0];
      //item.velocity.y = a[1];

    }

    this.engine.simulation.update();
    
    this.view.update();

    this.step++;

  }

  public stop () {

    console.log("stopping...");
    this.started = false;

  }

  
  public pause () {

    if (!this.started) {
      return;
    }

    this.paused = true;

  }

  public resume () {

    if (!this.started) {
      return;
    }

    this.paused = false;

  }

  public onModelEvent(event:Models.IEvent<Simulation.Entity | Simulation.Boundary | Simulation.Projectile>) {

    if (event.source instanceof Simulation.Entity) {
      //console.log("entity event", event.type, event.source.id)
    }

    if (event.source instanceof Simulation.Boundary) {
      //console.log("boundary event", event.type, event.source.id)
    }

    if (event.source instanceof Simulation.Projectile) {
      //console.log("projectile event", event.type, event.source.id)
    }
 
  } 

  public onContactEvent(event:Models.IEvent<any>) {

   // console.log("contact", event.sourceID, event.targetID)

  }

  public onBoundaryCrossEvent(event:Models.IEvent<any>) {
    
  //  console.log("boundary", event.type, event.sourceID, event.targetID)

  }

}