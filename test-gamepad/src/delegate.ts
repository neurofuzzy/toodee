import { Engine } from '../../engine/src/Engine';
import * as Simulation from '../../engine/src/simulation';
import * as Models from '../../engine/src/models';
import * as Geom from '../../engine/src/geom';
import { TestView } from '../../test-common/src/views/TestView';
import { GameControllers } from './GameControllers';

export class Delegate {
  
  protected engine:Engine;
  protected paused:boolean;
  protected started:boolean;
  protected step:number = 0;
  protected api:Simulation.API<Simulation.Boundary, Simulation.Entity>;
  protected view:Models.IView<Simulation.Model>;
  protected gameControllers:GameControllers;
  protected beams:Simulation.Beam[]

  public init(engine:Engine):any {

    this.engine = engine;
    this.api = this.engine.api;
    this.api.addModelListener(this.onModelEvent, this);
    this.api.addContactListener(this.onContactEvent, this);
    this.api.addBoundaryCrossListener(this.onBoundaryCrossEvent, this);
    this.view = new TestView().initWithModel(this.engine.model);
    this.gameControllers = new GameControllers();
    this.beams = [];

    this.gameControllers.scan();

    Simulation.MAXVEL = 6;

    return this;

  }

  protected build () {

    var model = this.engine.model;
    var sim = this.engine.simulation;

    // make a boundary

    let vertices:Array<Geom.IPoint> = [];
    let len = 3;
    let radius = 350;
    let cenX = 400;
    let cenY = 240;

    for (let i = 0; i < len; i++) {

      let ang = i * (360 / len) * Math.PI / 180; 
      let rr = radius;
      let x = rr * Math.sin(ang);
      let y = rr * Math.cos(ang);
      vertices.push(new Geom.Point(x + cenX, y + cenY));

    }

    let bnd = new Simulation.Boundary(vertices);
    bnd.drag = 0.01;
    bnd.cor = 0.5;
    model.boundaries.addItem(bnd);

    // smalle poly sector

    vertices = [];
    len = 3;
    radius = 100;

    for (let i = 0; i < len; i++) {

      let ang = Math.PI + (i * (360 / len) * Math.PI / 180); 
      let rr = radius;
      let x = rr * Math.sin(ang);
      let y = rr * Math.cos(ang);
      vertices.push(new Geom.Point(x + cenX, y + cenY - 40));

    }

    bnd = new Simulation.Boundary(vertices);
    bnd.cor = 0.5;
    bnd.isSector = true;
    model.boundaries.addItem(bnd);

    // beams

    len = 3;
    radius = 100;

    for (let i = 0; i < len; i++) {

      let ang = 0 - (i * (360 / len) * Math.PI / 180); 
      let ang2 = 0 - ((i - 1) * (360 / len) * Math.PI / 180); 
      let rr = radius;
      let x = rr * Math.sin(ang);
      let y = rr * Math.cos(ang);
      let x2 = rr * Math.sin(ang2);
      let y2 = rr * Math.cos(ang2);
      let beam = new Simulation.Beam();
      beam.initWithOriginAndAngle(x + cenX, y + cenY + 80, 0 - Math.PI * 0.5 - Geom.angleBetween(x2, y2, x, y), radius * 2);
      beam.isBoundary = true;
      beam.parentID = 1;
      model.beams.addItem(beam);
      this.beams.push(beam);

    }

    console.log(model.beams.items.size)
    
    // add initial objects

    len = 2;

    for (let i = 0; i < len; i++) {

      let b = new Geom.Bounds(300 + Math.random() * 200, 150 + Math.random() * 200, 10, 10, Math.floor(Math.random() * 2 + 1));
      let c = new Geom.Constraints();

      b.shape = Geom.SHAPE_ROUND;
      c.lockX = c.lockY = false;

      var item:Simulation.Entity = new Simulation.Entity().initWithBoundsAndConstraints(b, c);
      
      model.bodies.addItem(item);

    }
  
  }

  public start () {

    console.log("starting...");
    this.build();
    this.view.build();

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

    // add new ones

    /*
    if (this.step % 120 == 0 && !this.paused) {

      let b = new Geom.Bounds(300 + Math.random() * 200, 150 + Math.random() * 200, 10, 10, Math.floor(Math.random() * 2 + 1));
      let c = new Geom.Constraints();

      b.shape = Geom.SHAPE_ROUND;
      c.lockX = c.lockY = false;

      let item:Simulation.Entity = new Simulation.Entity().initWithBoundsAndConstraints(b, c);
      
      model.bodies.addItem(item);

    }
    */

    // 


    let gamepad = this.gameControllers.getFirstGamepad();

    if (gamepad) {

      let a = gamepad.axes;

      for (let i = 0; i < 1; i++) { //model.bodies.items.length; i++) {

        let item = model.bodies.items[i];

        let deltaX = a[0] * 0.25;
        let deltaY = a[1] * 0.25;

        if (Math.abs(deltaX) < 0.1) {
          deltaX = 0;
        }

        
        if (Math.abs(deltaY) < 0.1) {
          deltaY = 0;
        }

        if (deltaX != 0 || deltaY != 0) {
          let ang = Geom.normalizeAngle(Geom.xyToAngle(deltaX, deltaY) + 90 * Math.PI / 180);
          item.rotation = ang;
        }
        this.api.applyImpulse(item, deltaX, deltaY);

      }

      // beams

      if (gamepad.buttons[0].pressed) {

        for (let i = 0; i < 1; i++) { //model.bodies.items.length; i++) {
          
          let item = model.bodies.items[i];
          
          let beam = model.beams.getItemByParentID(item.id);

          if (!beam) {
            beam = new Simulation.Beam();
            beam.initWithOriginAndAngle(item.bounds.anchor.x, item.bounds.anchor.y, item.rotation, 500, item.id);
            // beam.isBoundary = true;
            beam.constrainRotationToParent = true;
            model.beams.addItem(beam);
          }

        }

      } else {

        model.beams.reset();

        if (this.step % 240 < 120) {
          this.beams.forEach(beam => {
            model.beams.addItem(beam);
          });
        }

      }

      // projectiles

      if (this.step % 5 == 0) {

        for (let i = 0; i < 1; i++) { //model.bodies.items.length; i++) {

          let item = model.bodies.items[i];

          let deltaX = a[2] * 0.25;
          let deltaY = a[3] * 0.25;
  
          if (Math.abs(deltaX) < 0.1) {
            deltaX = 0;
          }
  
          
          if (Math.abs(deltaY) < 0.1) {
            deltaY = 0;
          }

          if (deltaX != 0 || deltaY != 0) {

            this.api.launchFromWithDeltaXY(item, 3, deltaX, deltaY);
            
          }

        }
      }

      //item.velocity.x = a[0];
      //item.velocity.y = a[1];

    }

    // double simulation update
    this.engine.simulation.update();
    this.engine.simulation.update(true);
    
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
    
    //console.log("contact", event)

  }

  public onBoundaryCrossEvent(event:Models.IEvent<any>) {
    
    //console.log("boundary", event.type, event.source, event.target)

  }

}