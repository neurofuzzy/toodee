class Delegate implements IEngineDelegate {

  protected engine: Engine;
  protected paused: boolean;
  protected started: boolean;
  protected step: number = 0;
  protected api: Simulation.API<Simulation.Boundary, Simulation.Entity>;
  protected view: Models.IView<Simulation.Model>;
  protected beams: Simulation.Beam[];
  protected prando:any;

  protected totalObjects: number = 0;

  public init(engine: Engine): any {

    this.engine = engine;
    this.api = this.engine.api;
    this.api.addModelListener(this.onModelEvent, this);
    this.api.addContactListener(this.onContactEvent, this);
    this.api.addBoundaryCrossListener(this.onBoundaryCrossEvent, this);
    this.view = new Views.TestView().initWithModel(this.engine.model);
    this.beams = [];

    let seed;

    seed = 978;
    //seed = 34895;
    //seed = 361;

    this.prando = new Prando(seed);

    return this;

  }

  protected build() {

    var model = this.engine.model;
    var sim = this.engine.simulation;

    // make a boundary

    let vertices: Array<Geom.IPoint> = [];
    let cenX = 400;
    let cenY = 300;
    let w = 60;
    let h = 300;

    vertices.push(new Geom.Point(cenX - w, cenY - h));
    vertices.push(new Geom.Point(cenX - w, cenY + h));
    vertices.push(new Geom.Point(cenX + w, cenY + h));
    vertices.push(new Geom.Point(cenX + w, cenY - h));

    let bnd = new Simulation.Boundary(vertices);
    bnd.drag = 0;
    bnd.cor = 0.5;

    model.boundaries.addItem(bnd);

    // forces

    let aforce = new Physics.AreaForce(3, 0 - Math.PI * 0.5).initWithParentID(bnd.id);
    sim.api.addForce(aforce);

    window.addEventListener("keyup", e => {
      this.onKeyPress(e);
    });

    window["print"] = () => {
      console.log(this.toJSON());
    }

  }

  public start() {

    console.log("starting...");
    this.build();
    this.view.build();

    this.engine.simulation.start();

    this.started = true;

    window.requestAnimationFrame(() => { this.update() })

  }

  public update() {

    if (this.started) {
      window.requestAnimationFrame(() => { this.update() })
    }

    if (this.paused) {
      return
    }

    var sim = this.engine.simulation;

    // bodies

    if (this.step % 50 === 0 && this.totalObjects < 31) {

      let cenX = 400;
      let cenY = 300;
      let w = 60;
      let h = 300;
      let sizes = [15, 15, 20, 20, 30];

      let x = cenX - w + this.prando.next(0, w * 1.8 + 15);
      let y = cenY - h + 40;

      let wh = sizes[this.prando.nextInt(0, 123) % sizes.length];

      let b = new Geom.Bounds(x, y, wh, wh, Math.floor(Math.random() * 2 + 1));
      let c = new Geom.Constraints();

      b.shape = Geom.SHAPE_ROUND;
      c.lockX = c.lockY = false;

      var item: Simulation.Entity = new Simulation.Entity().initWithBoundsAndConstraints(b, c);

      this.engine.model.bodies.addItem(item);

      this.totalObjects++;

    }


    sim.update();
    sim.update();
    sim.update();

    if (this.step % 10 === 0) {
      this.view.update();
    }

    this.step++;

  }

  public stop() {

    console.log("stopping...");
    this.started = false;
    // TODO: cleanup

  }


  public pause() {

    if (!this.started) {
      return;
    }

    this.paused = true;

  }

  public resume() {

    if (!this.started) {
      return;
    }

    this.paused = false;

  }

  public onModelEvent(event: Models.IEvent<Simulation.Entity | Simulation.Boundary | Simulation.Projectile>) {

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

  public onContactEvent(event: Models.IEvent<any>) {

    // console.log("contact", event.source.id, event.target.id)

  }

  public onBoundaryCrossEvent(event: Models.IEvent<any>) {

    //  console.log("boundary", event.type, event.source.id, event.target.id)

  }

  protected onKeyPress(event:KeyboardEvent) {

    

  }

  protected toJSON() {

    const out = [];

    this.engine.model.bodies.items.forEach(b => {
      out.push({
        x: b.bounds.anchor.x,
        y: b.bounds.anchor.y,
        r: b.bounds.hw,
      });
    });

    return JSON.stringify(out, null, "  ");

  }

}

