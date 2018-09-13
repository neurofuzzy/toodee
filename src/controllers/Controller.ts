namespace Controllers {

  export class Controller implements Util.IController<Models.Model, Views.View> {

    protected model:Models.Model;
    protected view:Views.View;
    protected simulation:Simulation;

    public initWithModelAndView(model:Models.Model, view:Views.View):any {

      this.model = model;
      this.view = view;
      this.simulation = new Simulation().initWithModelAndView(model);

      return this;

    }

    protected build () {

      for (let i = 0; i < 600; i++) {
  
        var x = 20 + Math.random() * 1480;
        var y = 20 + Math.random() * 560;
        var wh = Math.random() * 10 + 5
 
        var b = new Geom.Bounds(x, y, wh, wh, Math.floor(Math.random() * 2 + 1));
        var c = new Geom.Constraints();

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
  
        var item:Models.Item = new Models.Item().initWithBoundsAndConstraints(b, c);

        // give a random velocity
        if (b.shape == Geom.SHAPE_ROUND) {

          item.velocity.x = (Math.random() - 0.5) * 5;
          item.velocity.y = (Math.random() - 0.5) * 5;

        }

        this.model.bodies.addItem(item);
  
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

      let bnd = new Models.Boundary(vertices);

      this.model.boundaries.addItem(bnd);

      // smaller inverted poly

      vertices = [];
      len = 8;
      radius = 100;

      for (let i = 0; i < len; i++) {

        let ang = 0 - (i * (360 / len) * Math.PI / 180); 
        let rr = radius + Math.random() * 100 - 50;
        let x = rr * Math.sin(ang);
        let y = rr * Math.cos(ang);
        vertices.push(new Geom.Point(x + cenX, y + cenY));

      }

      bnd = new Models.Boundary(vertices);

      this.model.boundaries.addItem(bnd);

      // test ray
      let r = this.model.ray;
      let ro = r.origin;
      ro.x = 400;
      ro.y = 400;
      r.endPt = r.project(200);

    }

    public start () {

      console.log("starting...");
      this.build();

      this.simulation.start();

      this.view.ticker.add(this.update);
      //this.view.ticker.add(this.update);

    }

    public update = () => {

      this.simulation.update();
      this.view.update();

    }

    public stop () {

      console.log("stopping...");

      this.view.ticker.remove(this.update);

    }

  }

}