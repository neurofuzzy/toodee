namespace Controllers {

  export class Controller implements Util.IController<Models.Model, Views.View> {

    protected model:Models.Model;
    protected view:Views.View;
    protected bodyQuadMap:Geom.SpatialQuadMap;
    protected boundaryQuadMap:Geom.PolygonQuadMap;
    protected rayForward:boolean;

    public initWithModelAndView(model:Models.Model, view:Views.View):Controller {

      this.model = model;
      this.view = view;
      this.bodyQuadMap = new Geom.SpatialQuadMap(100).init();
      this.boundaryQuadMap = new Geom.PolygonQuadMap(100, 20).init();

      return this;

    }

    protected build () {

      for (let i = 0; i < 500; i++) {
  
        var x = 20 + Math.random() * 1480;
        var y = 20 + Math.random() * 560;
 
        var b = new Geom.Bounds(x, y, 10, 10, Math.floor(Math.random() * 2 + 1));
        var c = new Geom.Constraints();

        b.shape = Geom.SHAPE_ROUND;
        c.lockX = c.lockY = false;

        /*
        if (b.shape == Geom.SHAPE_ORTHO) {
          b.anchor.x = Math.floor(b.anchor.x / 20) * 20;
          b.anchor.y = Math.floor(b.anchor.y / 20) * 20;
        } else {

        }
        */
  
        var item = new Models.Item().initWithBoundsAndConstraints(b, c);

        this.model.bodies.addItem(item);
  
      }

      // add items to quadmap
      this.model.bodies.items.forEach(item => {
        this.bodyQuadMap.addItem(item);
      });

      // make a boundary

      let vertices:Array<Geom.IPoint> = [];
      let len = 12;
      let radius = 200;
      let cenX = 400;
      let cenY = 300;

      for (let i = 0; i < len; i++) {

        let ang = i * (360 / len) * Math.PI / 180; 
        let x = radius * Math.sin(ang);
        let y = radius * Math.cos(ang);
        vertices.push(new Geom.Point(x + cenX, y + cenY));

      }

      let bnd = new Models.Boundary(vertices);

      this.model.boundaries.addItem(bnd);
      this.boundaryQuadMap.addItem(bnd);


    }

    public start () {

      console.log("starting...");
      this.build();

      this.view.ticker.add(this.update);

    }

    private countIntersections (itemA:Models.Item):number {

      let hits = 0;

      let quads = this.bodyQuadMap.getSurroundingQuads(itemA);

      quads.forEach(quad => {
        if (quad != null) {
          quad.forEach(item => {
            var itemB = item as Models.Item;
            if (itemA == itemB) {
              return;
            }
            if (Geom.boundsIntersect(itemA.bounds, itemB.bounds, true)) {
              Geom.resolvePenetrationBetweenBounds(itemA.bounds, itemB.bounds, itemA.constraints, itemB.constraints, true)
              hits++;
            }
          });
        }
      });
/*
      this.model.items.forEach(itemB => {
        if (itemA.id == itemB.id) {
          return;
        }
        if (Geom.boundsIntersect(itemA.bounds, itemB.bounds, true)) {
          Geom.resolvePenetrationBetweenBounds(itemA.bounds, itemB.bounds, itemA.constraints, itemB.constraints, true)
          hits++;
        }
      })
*/
      return hits;


    }

    public update = () => {

      var items = this.model.bodies.items;
      
      items.forEach(item => {

        // fake gravity
        if (!item.constraints.lockY) {

          item.bounds.anchor.y += 1;
          
          if (item.bounds.anchor.y + item.bounds.hh > 600) {
            item.bounds.anchor.y = 600 - item.bounds.hh;
          }

        }

      });
      
      items.forEach(item => {
        this.bodyQuadMap.updateItem(item);
      });

      items.forEach(item => {
        let a = this.countIntersections(item);
        item.rotation = 0.2 + a * 0.3;
        //item.rotation = 0.2;
      });

      /*

      // test ray

      var m = this.model as Models.Model;
      var ray = m.testRay;
      
      if (this.rayForward) {
        if (ray.ptB.x < 880) {
          ray.ptB.x+=5;
        } else {
          this.rayForward = false;
        }
      } else {
        if (ray.ptB.x > 0) {
          ray.ptB.x-=5;
        } else {
          this.rayForward = true;
        }
      }

      let coords = Geom.gridPointsAlongLineWithThickness(m.testRay.ptA.x, m.testRay.ptA.y, m.testRay.ptB.x, m.testRay.ptB.y, 100, 20);

      let quads = this.quadMap.getQuadsFromCoords(coords, true);

      quads.forEach(quad => {
        quad.forEach(item => {
          item.rotation = 1;
          Geom.resolvePenetrationSegmentRound(ray.ptA, ray.ptB, item.bounds);
        });
      });
      */

      // check collisions with boundaries

      items.forEach(item => {
        let quad = this.boundaryQuadMap.getQuadFromPoint(item.bounds.anchor);

        if (quad) {
          quad.forEach(seg => {
            Geom.resolvePenetrationSegmentRound(seg.ptA, seg.ptB, item.bounds);
          })
        }
      });

      
      // reverse collision check

      var ritem;
      
      for (let i = items.length - 1; i >= 0; i--) {
        ritem = items[i];
        let a = this.countIntersections(ritem);
        //ritem.rotation = 0.2 + a * 0.3;
      };

      /*
      for (let j = quads.length - 1; j >= 0; j--) {

        let items = quads[j];

        for (let i = items.length - 1; i >= 0; i--) {
          ritem = items[i];
          Geom.resolvePenetrationSegmentRound(ray.ptA, ray.ptB, ritem.bounds);
        };

      }
      */

      items.forEach(item => {
        this.bodyQuadMap.updateItem(item);
      });

      this.view.update();

    }

    public stop () {

      console.log("stopping...");

      this.view.ticker.remove(this.update);

    }

  }

}