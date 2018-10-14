class AppController {
  
  protected app:App;
  protected paused:boolean;
  protected started:boolean;
  protected step:number = 0;

  public init(app:App):any {

    this.app = app;
    this.app.simulation.api.addContactListener(this.onContactEvent, this);
    this.app.simulation.api.addBoundaryListener(this.onBoundaryEvent, this);

    return this;

  }

  protected build () {

    var model = this.app.model;
    var sim = this.app.simulation;

    let masks = [
      0b00000001,
      0b00000010,
      0b00000100,
      0b00001000, 
    ];

    let bndMask = 0b00001111;

    for (let i = 0; i < 600; i++) {

      let x = 20 + Math.random() * 1480;
      let y = 20 + Math.random() * 560;
      let wh = Math.random() * 10 + 5

      let b = new Geom.Bounds(x, y, wh, wh, Math.floor(Math.random() * 2 + 1));
      let c = new Geom.Constraints();

      b.shape = Geom.SHAPE_ROUND;
      c.lockX = c.lockY = false;

      if (Math.random() > 0.75) {
        b.shape = Geom.SHAPE_ORTHO;
      }
      
      if (b.shape == Geom.SHAPE_ORTHO) {
        b.anchor.x = Math.floor(b.anchor.x / 20) * 20;
        b.anchor.y = Math.floor(b.anchor.y / 20) * 20;
        c.lockX = c.lockY = true;
      }

      var item:Simulation.Entity = new Simulation.Entity().initWithBoundsAndConstraints(b, c);
      item.contactMask = item.resolveMask = masks[item.id % 4];

      // give a random velocity
      if (b.shape == Geom.SHAPE_ROUND) {

        item.velocity.x = (Math.random() - 0.5) * 5;
        item.velocity.y = (Math.random() - 0.5) * 5;

      }

      model.bodies.addItem(item);

    }

    // make a boundary

    let vertices:Array<Geom.IPoint> = [];
    let len = 12;
    let radius = 350;
    let cenX = 400;
    let cenY = 300;

    for (let i = 0; i < len; i++) {

      let ang = i * (360 / len) * Math.PI / 180; 
      let rr = radius + Math.random() * 300 - 100;
      let x = rr * Math.sin(ang);
      let y = rr * Math.cos(ang);
      vertices.push(new Geom.Point(x + cenX, y + cenY));

    }

    let bnd = new Simulation.Boundary(vertices);
    bnd.contactMask = bnd.resolveMask = bndMask;

    model.boundaries.addItem(bnd);

    // smaller sector poly

    vertices = [];
    len = 8;
    radius = 100;

    for (let i = 0; i < len; i++) {

      let ang = (i * (360 / len) * Math.PI / 180); 
      let rr = radius * 1.5 + Math.random() * 100 - 50;
      let x = rr * Math.sin(ang);
      let y = rr * Math.cos(ang);
      vertices.push(new Geom.Point(x + cenX - 100, y + cenY));

    }

    bnd = new Simulation.Boundary(vertices);
    bnd.contactMask = bnd.resolveMask = bndMask;
    bnd.drag = 0.1;

    model.boundaries.addItem(bnd);

    // even smaller sector poly

    vertices = [];
    len = 8;
    radius = 100;

    for (let i = 0; i < len; i++) {

      let ang = (i * (360 / len) * Math.PI / 180); 
      let rr = radius + Math.random() * 60 - 50;
      let x = rr * Math.sin(ang);
      let y = rr * Math.cos(ang);
      vertices.push(new Geom.Point(x + cenX - 100, y + cenY));

    }

    bnd = new Simulation.Boundary(vertices);
    bnd.contactMask = bnd.resolveMask = bndMask;
    let smallBoundaryID = bnd.id;

    model.boundaries.addItem(bnd);

    // smaller inverted poly

    vertices = [];
    len = 8;
    radius = 100;

    for (let i = 0; i < len; i++) {

      let ang = 0 - (i * (360 / len) * Math.PI / 180); 
      let rr = radius + Math.random() * 25 - 25;
      let x = rr * Math.sin(ang);
      let y = rr * Math.cos(ang);
      vertices.push(new Geom.Point(x + cenX + 100, y + cenY));

    }

    bnd = new Simulation.Boundary(vertices);
    bnd.contactMask = bnd.resolveMask = bndMask;

    model.boundaries.addItem(bnd);

    // test ray
    let r = model.ray;
    let ro = r.origin;
    ro.x = 400;
    ro.y = 400;

    // forces
    // let pforce = new Physics.ProximityForce(5).initWithOriginAndRange({ x: 200, y: 200 }, 200);
    // sim.api.addForce(pforce);

    let aforce = new Physics.AreaForce(5, Math.PI * 0.5).initWithParentID(smallBoundaryID);
    sim.api.addForce(aforce);

    //let ppforce = new Physics.PropulsionForce(5).initWithParentID(1);
    //sim.api.addForce(ppforce);

  }

  public start () {

    console.log("starting...");
    this.build();

    this.app.simulation.start();

    this.app.view.ticker.add(this.update);
    //this.view.ticker.add(this.update);

  }

  public update = () => {

    var model = this.app.model;
    var sim = this.app.simulation;

    sim.update();
    // sim.update();

    // ray 
    let r = model.ray;

    // near items check

    let cen = { x: 400, y:300 };
    cen.x += 200 * Math.sin(Date.now() / 5000);
    cen.y += 200 * Math.cos(Date.now() / 5000);
    let rad = 150;
    let b = 0b00101;

    r.origin.x = cen.x;
    r.origin.y = cen.y;
    r.angle = Geom.normalizeAngle(Math.PI * 2 - Geom.angleBetween(cen.x, cen.y, 400, 300));

    let nearItems = sim.api.bodiesNearAndInFront(r.origin, 150, r.angle, 0.5);
    nearItems.forEach(item => {
      item.rotation = 0;
    });

    // ray check

    let hitPts = sim.api.raycast(r, 400);

    model.rayHit = hitPts[0];

    if (model.rayHit) {
      let hitItem = model.bodies.getItemByID(model.rayHit.parentID);
      if (hitItem) {
        hitItem.rotation = -1;
      }
    }

    // end ray check

    // projectile madness

    let masks = [
      0b00000001,
      0b00000010,
      0b00000100,
      0b00001000, 
    ];

    if (this.step % 3 == 0) {
      for (var i = 0; i < 10; i++) {
        let vel = new Geom.Point(2, 0);
        Geom.rotatePoint(vel, Math.random() * Math.PI * 2);
        let pos = new Geom.Point(Math.random() * 800, Math.random() * 600);
        let bullet = new Simulation.Projectile().initWithPositionSizeAndLifespan(pos, 5, 360);
        bullet.contactMask = bullet.resolveMask = masks[bullet.id % 4];
        bullet.velocity.x = vel.x;
        bullet.velocity.y = vel.y;
        model.projectiles.addItem(bullet);
      }
    }

    this.app.view.update();

    this.step++;

  }

  public stop () {

    console.log("stopping...");

    this.app.view.ticker.remove(this.update);

  }

  
  public pause () {

    if (!this.started) {
      return;
    }

    if (!this.paused) {
      this.app.view.ticker.remove(this.update);
      this.paused = true;
    }

  }

  public resume () {

    if (!this.started) {
      return;
    }

    if (this.paused) {
      this.app.view.ticker.add(this.update);
      this.paused = false;
    }

  }

  public onContactEvent(event:Models.IEvent<any>) {

   // console.log("contact", event.sourceID, event.targetID)

  }

  public onBoundaryEvent(event:Models.IEvent<any>) {
    
  //  console.log("boundary", event.type, event.sourceID, event.targetID)

  }

}