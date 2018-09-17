namespace Controllers {

  export class Simulation implements Util.IController<Models.Model, null> {

    protected model:Models.Model;
    protected bodyQuadMap:Geom.SpatialQuadMap<Models.Item>;
    protected boundaryQuadMap:Geom.PolygonQuadMap<Models.Boundary>;
    protected bodyBoundaryMap:Geom.SpatialPolygonMap<Models.Boundary, Models.Item>;

    protected bodyBodyContacts:Array<Physics.BodyBodyContact>;
    protected bodyBodyContactIndices:Array<boolean>;
    protected bodyBoundaryContacts:Array<Physics.BodyBoundaryContact>;

    public initWithModelAndView(model:Models.Model):any {

      this.model = model;
      this.bodyQuadMap = new Geom.SpatialQuadMap(100).init();
      this.boundaryQuadMap = new Geom.PolygonQuadMap(100, 20).init();
      this.bodyBoundaryMap = new Geom.SpatialPolygonMap().init();

      return this;

    }

    protected build () {

      // add items to quadmaps

      this.model.bodies.items.forEach(body => {
        this.bodyQuadMap.addItem(body);
      });

      // add bounaries to quadmaps

      this.model.boundaries.items.forEach(boundary => {
        this.boundaryQuadMap.addItem(boundary);
      });

      // compare boundaries to find sectors (normal boundaries within normal boundaries)

      this.model.boundaries.items.forEach(boundary => {
        this.model.boundaries.items.forEach(otherBoundary => {
          if (boundary != otherBoundary) {
            if (!boundary.inverted && Geom.polygonInPolygon(boundary, otherBoundary)) {
              boundary.isSector = true;
              return;
            }
          }
        })
      });

      // add boundaries to body-boundary map (map of which bodies are inside which boundaries)

      let bs = this.model.boundaries.items.filter(n => n); // get rid of empty values
      bs.forEach(boundary => {
        this.bodyBoundaryMap.addPolygon(boundary);
      })

    }

    public start () {

      this.build();

    }

    private getBodyBodyContacts (itemA:Models.Item, itemB:Models.Item):void {

      if (itemA == itemB) {
        return;
      }

      let contactPairIdx = Util.Pairing.cantorPair(itemA.id, itemB.id);

      if (itemA.bounds.shape == Geom.SHAPE_ORTHO) {
        return;
      }

      if (this.bodyBodyContacts[contactPairIdx]) {
        return;
      }

      if (Geom.boundsIntersect(itemA.bounds, itemB.bounds, true)) {

        let penetration = Geom.resolvePenetrationBetweenBounds(itemA.bounds, itemB.bounds, itemA.constraints, itemB.constraints, true);

        if (penetration && !isNaN(penetration.x) && !isNaN(penetration.y)) {
          this.bodyBodyContactIndices[contactPairIdx] = true;
          this.bodyBodyContacts.push(new Physics.BodyBodyContact(penetration, itemA, itemB));
        }

      }

    }

    private getBodyBoundaryContacts (item:Models.Item, seg:Geom.ISegment):void {

      let parentPoly = this.model.boundaries.getItemByID(seg.parentID);

      if (parentPoly.isSector) {
        return;
      }

      let penetration = Geom.resolvePenetrationSegmentRound(seg.ptA, seg.ptB, item.bounds);

      if (penetration) {
   
        this.bodyBoundaryContacts.push(new Physics.BodyBoundaryContact(penetration, item, seg));

      }

    }

    public update = () => {

      this.bodyBodyContacts = [];
      this.bodyBoundaryContacts = [];
      this.bodyBodyContactIndices = [];

      var items = this.model.bodies.items;

      items.forEach(item => {
        item.bounds.anchor.x += item.velocity.x;
        item.bounds.anchor.y += item.velocity.y;
      });

      // update quads
      
      items.forEach(item => {
        this.bodyQuadMap.updateItem(item);
      });

      // forward body collision check

      items.forEach(item => {

        let itemA = item as Models.Item;
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

      // forward boundary collision check

      items.forEach(item => {
        if (item.bounds.shape == Geom.SHAPE_ROUND) {
          let itemA = item as Models.Item;
          let quad = this.boundaryQuadMap.getQuadFromPoint(item.bounds.anchor);
          if (quad) {
            quad.forEach(seg => {
              this.getBodyBoundaryContacts(itemA, seg);
            })
          }
        }
      });

      this.bodyBodyContacts.forEach(contact => {
        Physics.resolveContact(contact);
      });

      this.bodyBoundaryContacts.forEach(contact => {
        Physics.resolveContact(contact);
      })
      
      // update quads and sectors
      // apply sector properties to body

      items.forEach(item => {

        this.bodyQuadMap.updateItem(item);
        this.bodyBoundaryMap.updateItem(item);

        let boundary = this.bodyBoundaryMap.getItemPolygon(item);

        if (boundary) {
          item.velocity.x *= 1 - boundary.drag;
          item.velocity.y *= 1 - boundary.drag;
        }

      });
      

      // ray check

      let r = this.model.ray;
      r.angle += 1 * Math.PI / 180;
      let pt = r.project(400);

      let hitPts:Array<Geom.IPointHit> = [];

      let qcoords = Geom.gridPointsAlongLineWithThickness(r.origin.x, r.origin.y, pt.x, pt.y, 100, 20);

      let boundaryQuads = this.boundaryQuadMap.getQuadsFromCoords(qcoords, true);
      
      boundaryQuads.forEach(quad => {
        quad.forEach(seg => {
          let intPt = Geom.lineLineIntersect(r.origin.x, r.origin.y, pt.x, pt.y, seg.ptA.x, seg.ptA.y, seg.ptB.x, seg.ptB.y);

          if (intPt != null) {
            hitPts.push(new Geom.PointHit(r.origin, intPt, seg.parentID))
          }
        });
      });

      let bodyQuads = this.bodyQuadMap.getQuadsFromCoords(qcoords, true);

      bodyQuads.forEach(quad => {
        quad.forEach(body => {

          let intPts = Geom.boundsLineIntersect(body.bounds, r.origin, pt);

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
        pt = hitPts[0].pt;
      }

      // end ray check

    }

    public stop () {

      console.log("stopping...");

    }

  }

}