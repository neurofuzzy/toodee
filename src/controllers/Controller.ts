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

      for (let i = 0; i < 300; i++) {
  
        var x = 20 + Math.random() * 1480;
        var y = 20 + Math.random() * 560;
 
        var b = new Geom.Bounds(x, y, 10, 10, Math.floor(Math.random() * 2 + 1));
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
        let rr = radius + Math.random() * 300 - 100;
        let x = rr * Math.sin(ang);
        let y = rr * Math.cos(ang);
        vertices.push(new Geom.Point(x + cenX, y + cenY));

      }

      let bnd = new Models.Boundary(vertices);

      this.model.boundaries.addItem(bnd);
      this.boundaryQuadMap.addItem(bnd);

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
      this.boundaryQuadMap.addItem(bnd);
      

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

      this.view.ticker.add(this.update);
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

      return hits;


    }

    public update = () => {

      var items = this.model.bodies.items;
      
      items.forEach(item => {

        // fake gravity
        if (!item.constraints.lockY) {

         // item.bounds.anchor.y += 1;
          
          if (item.bounds.anchor.y + item.bounds.hh > 600) {
         //   item.bounds.anchor.y = 600 - item.bounds.hh;
          }

        }

      });
      
      items.forEach(item => {
        this.bodyQuadMap.updateItem(item);
      });

      items.forEach(item => {
        let a = this.countIntersections(item);
        item.rotation = 0.2 + a * 0.3;
      });

      // check collisions with boundaries

      items.forEach(item => {
        if (item.bounds.shape == Geom.SHAPE_ROUND) {
          let quad = this.boundaryQuadMap.getQuadFromPoint(item.bounds.anchor);
          if (quad) {
            quad.forEach(seg => {
              Geom.resolvePenetrationSegmentRound(seg.ptA, seg.ptB, item.bounds);
            })
          }
        }
      });
      
      // reverse collision check

      items.forEach(item => {

        // fake gravity
        if (!item.constraints.lockY) {

          //item.bounds.anchor.y += 1;
          
          if (item.bounds.anchor.y + item.bounds.hh > 600) {
         //   item.bounds.anchor.y = 600 - item.bounds.hh;
          }

        }

      });

      var ritem;
      
      for (let i = items.length - 1; i >= 0; i--) {
        ritem = items[i];
        let a = this.countIntersections(ritem);
        ritem.rotation = 0.2 + a * 0.3;
      };


      for (let i = items.length - 1; i >= 0; i--) {
        ritem = items[i];
        if (ritem.bounds.shape == Geom.SHAPE_ROUND) {
          let quad = this.boundaryQuadMap.getQuadFromPoint(ritem.bounds.anchor);
          if (quad && quad.length > 0) {
            for (let j = quad.length - 1; j >= 0; j--) {
              let rseg = quad[j];
              Geom.resolvePenetrationSegmentRound(rseg.ptA, rseg.ptB, ritem.bounds);
            }
          }
        }
      }
      

      items.forEach(item => {
        this.bodyQuadMap.updateItem(item);
      });

      let r = this.model.ray;
      r.angle += 1 * Math.PI / 180;
      r.endPt = r.project(400);

      let hitPts:Array<Geom.IPointHit> = [];

      let qcoords = Geom.gridPointsAlongLineWithThickness(r.origin.x, r.origin.y, r.endPt.x, r.endPt.y, 100, 20);

      let boundaryQuads = this.boundaryQuadMap.getQuadsFromCoords(qcoords, true);
      
      boundaryQuads.forEach(quad => {
        quad.forEach(seg => {
          let intPt = Geom.lineLineIntersect(r.origin.x, r.origin.y, r.endPt.x, r.endPt.y, seg.ptA.x, seg.ptA.y, seg.ptB.x, seg.ptB.y);

          if (intPt != null) {
            hitPts.push(new Geom.PointHit(r.origin, intPt, seg.parentID))
          }
        });
      });

      let bodyQuads = this.bodyQuadMap.getQuadsFromCoords(qcoords, true);

      bodyQuads.forEach(quad => {
        quad.forEach(body => {

          let intPts = Geom.boundsLineIntersect(body.bounds, r.origin, r.endPt);

          if (intPts && intPts.length) {
            intPts.forEach(intPt => {
              let item = body as Models.Item;
              hitPts.push(new Geom.PointHit(r.origin, intPt, item.id));
            })
          }

        })
      })

      if (hitPts.length > 0) {
        Geom.PointHit.sort(hitPts);
        r.endPt = hitPts[0].pt;
      }

      this.view.update();

    }

    public stop () {

      console.log("stopping...");

      this.view.ticker.remove(this.update);

    }

  }

}