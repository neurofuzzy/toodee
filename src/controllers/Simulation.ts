namespace Controllers {

  export class Simulation implements Util.IController<Models.Model, null> {

    protected model:Models.Model;
    protected bodyQuadMap:Geom.SpatialQuadMap;
    protected boundaryQuadMap:Geom.PolygonQuadMap;

    protected bodyBodyContacts:Array<BodyBodyContact>;
    protected bodyBoundaryContacts:Array<BodyBoundaryContact>;

    public initWithModelAndView(model:Models.Model):any {

      this.model = model;
      this.bodyQuadMap = new Geom.SpatialQuadMap(100).init();
      this.boundaryQuadMap = new Geom.PolygonQuadMap(100, 20).init();

      return this;

    }

    protected build () {

      // add items to quadmaps

      this.model.bodies.items.forEach(body => {
        this.bodyQuadMap.addItem(body);
      });

      this.model.boundaries.items.forEach(boundary => {
        this.boundaryQuadMap.addItem(boundary);
      })

    }

    public start () {

      this.build();

    }

    private getBodyBodyContacts (itemA:Models.Item, itemB:Models.Item):void {

      if (itemA == itemB) {
        return;
      }

      if (Geom.boundsIntersect(itemA.bounds, itemB.bounds, true)) {

        Geom.resolvePenetrationBetweenBounds(itemA.bounds, itemB.bounds, itemA.constraints, itemB.constraints, true);
        this.bodyBodyContacts.push(new BodyBodyContact(itemA, itemB));

      }

    }

    private getBodyBoundaryContacts (item:Models.Item, seg:Geom.ISegment):void {

      if (Geom.resolvePenetrationSegmentRound(seg.ptA, seg.ptB, item.bounds)) {
      
        this.bodyBoundaryContacts.push(new BodyBoundaryContact(item, seg));

      }

    }

    public update = () => {

      this.bodyBodyContacts = [];
      this.bodyBoundaryContacts = [];

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

      // update quads
      
      items.forEach(item => {
        this.bodyQuadMap.updateItem(item);
      });

      // forward collision check

      items.forEach(itemA => {

        let quads = this.bodyQuadMap.getSurroundingQuads(itemA);

        quads.forEach(quad => {
  
          if (quad != null) {
  
            quad.forEach(item => {
  
              var itemB = item as Models.Item;
              this.getBodyBodyContacts(itemA, itemB);

            });

          }

        });

      });

      // forward collision check with boundaries

      items.forEach(item => {
        if (item.bounds.shape == Geom.SHAPE_ROUND) {
          let quad = this.boundaryQuadMap.getQuadFromPoint(item.bounds.anchor);
          if (quad) {
            quad.forEach(seg => {
              this.getBodyBoundaryContacts(item, seg);
            })
          }
        }
      });
      
      // REVERSE STEP 

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

      // reverse collision check

      var ritemA;
      
      for (let i = items.length - 1; i >= 0; i--) {

        ritemA = items[i];

        let quads = this.bodyQuadMap.getSurroundingQuads(ritemA);

        quads.forEach(quad => {
  
          if (quad != null) {

            for (let j = quad.length - 1; j >= 0; j--) {
  
              var ritemB = quad[j] as Models.Item;
              this.getBodyBodyContacts(ritemA, ritemB);

            }

          }

        });

      }

      // reverse collision check with boundaries

      for (let i = items.length - 1; i >= 0; i--) {

        ritemA = items[i];

        if (ritemA.bounds.shape == Geom.SHAPE_ROUND) {
          let quad = this.boundaryQuadMap.getQuadFromPoint(ritemA.bounds.anchor);
          if (quad && quad.length > 0) {
            for (let j = quad.length - 1; j >= 0; j--) {
              let rseg = quad[j];
              this.getBodyBoundaryContacts(ritemA, rseg);
            }
          }
        }

      }
      
      // update quads

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

    }

    public stop () {

      console.log("stopping...");

    }

  }

}