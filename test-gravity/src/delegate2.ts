class Delegate2 implements IEngineDelegate {

  protected engine: Engine;
  protected paused: boolean;
  protected started: boolean;
  protected step: number = 0;
  protected api: Simulation.API<Simulation.Boundary, Simulation.Entity>;
  protected view: Models.IView<Simulation.Model>;
  protected beams: Simulation.Beam[];
  protected prando:any;
  protected aforce:Physics.AreaForce;

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
    //seed = 346098;
    seed = 23486;

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
    let w = 120;
    let h = 240;

    // vertices.push(new Geom.Point(cenX - w, cenY - h));
    // vertices.push(new Geom.Point(cenX - w, cenY + h));
    // vertices.push(new Geom.Point(cenX + w, cenY + h));
    // vertices.push(new Geom.Point(cenX + w, cenY - h));

    for (let i = 0; i < 64; i++) {
      const pt = new Geom.Point(0, h);
      Geom.rotatePointDeg(pt, i * (360 / 64));
      pt.x += cenX;
      pt.y += cenY;
      vertices.push(pt);
    }

    let bnd = new Simulation.Boundary(vertices);
    bnd.drag = 0.01;
    bnd.cor = 0.8;

    model.boundaries.addItem(bnd);

    // forces

    this.aforce = new Physics.AreaForce(10, 0 - Math.PI * 0.5).initWithParentID(bnd.id);
    sim.api.addForce(this.aforce);

    const pforce = new Physics.ProximityForce(1, 0).initWithOriginAndRange(new Geom.Point(cenX, cenY), Math.max(w, h));
    sim.api.addForce(pforce);

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

    if (this.step % 2 === 0 && this.totalObjects < 250) {

      let cenX = 400;
      let cenY = 300;
      let w = 120;
      let h = 120;
      let sizes = [10, 10, 15, 15, 15, 20, 20, 25];
      sizes = [12, 18];

      let x = cenX - w * 0.5 + this.prando.next(0, w);
      let y = cenY - h * 0.5 + this.prando.next(0, h);

      let wh = sizes[this.prando.nextInt(0, 123) % sizes.length];
      wh = sizes[this.totalObjects % sizes.length];

      let b = new Geom.Bounds(x, y, wh, wh, Math.floor(Math.random() * 2 + 1));
      let c = new Geom.Constraints();

      b.shape = Geom.SHAPE_ROUND;
      c.lockX = c.lockY = false;

      var item: Simulation.Entity = new Simulation.Entity().initWithBoundsAndConstraints(b, c);
      item.cor = 0.9;

      this.engine.model.bodies.addItem(item);

      const pforce = new Physics.ProximityForce(12, 0).initWithOriginAndRange(item.bounds.anchor, wh * 3);
      sim.api.addForce(pforce);

      this.totalObjects++;

    }

    this.aforce.angle += 0.05;

    sim.update();
    //sim.update();
    //sim.update();

    if (this.step % 1 === 0) {

      let cenX = 400;
      let cenY = 300;
      let imgSize = 48;
      let ih = Math.floor(imgSize * 0.5);
      let circleRadius = 240;

      let gfx = this.view.bodiesGraphics() as PIXI.Graphics[];
      //let ctx = (document.querySelector("#canvas2") as HTMLCanvasElement).getContext("2d");
      //let imageData = ctx.getImageData(0, 0, imgSize, imgSize);
      let imageData = window['_img'];
      if (imageData) {
        gfx.forEach(g => {
          let x = Math.max(0, Math.min(imgSize - 1, Math.floor(ih + (g.position.x - cenX) / (circleRadius / ih))));
          let y = Math.max(0, Math.min(imgSize - 1, Math.floor(ih + (g.position.y - cenY) / (circleRadius / ih))));
          let data = imageData.data[y * (imgSize * 4) + x * 4];
          g.scale.x = 1 - data / 255;
          g.scale.y = 1 - data / 255;
        });
    }

    }

    //if (this.step % 10 === 0) {
      this.view.update();
    //}

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
      let mdist = 1000;
      this.engine.model.bodies.items.forEach(b2 => {
        if (b2 !== b) {
          mdist = Math.min(mdist, Geom.distanceBetween(b.bounds.anchor.x, b.bounds.anchor.y, b2.bounds.anchor.x, b2.bounds.anchor.y) - b2.bounds.hw);
        }
      });
      out.push({
        x: b.bounds.anchor.x,
        y: b.bounds.anchor.y,
        r: Math.max(8, mdist),
      });
    });

    return JSON.stringify(out, null, "  ");

  }

}

