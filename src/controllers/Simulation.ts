namespace Controllers {

  export class Simulation implements Util.IController<Models.Model, null> {

    protected model:Models.Model;
    protected bodyGrid:Geom.SpatialGrid<Models.Item>;
    protected boundaryGrid:Geom.PolygonGrid<Models.Boundary>;
    protected bodyBoundaryMap:Geom.SpatialPolygonMap<Models.Boundary, Models.Item>;

    protected bodyBodyContacts:Array<Physics.BodyBodyContact>;
    protected bodyBodyContactIndices:Array<boolean>;
    protected bodyBoundaryContacts:Array<Physics.BodyBoundaryContact>;

    public initWithModelAndView(model:Models.Model):any {

      this.model = model;
      this.bodyGrid = new Geom.SpatialGrid(100).init();
      this.boundaryGrid = new Geom.PolygonGrid(100, 20).init();
      this.bodyBoundaryMap = new Geom.SpatialPolygonMap().init();

      return this;

    }

    protected build () {

      // add items to cellmaps

      this.model.bodies.items.forEach(body => {
        this.bodyGrid.addItem(body);
      });

      // add bounaries to cellmaps

      this.model.boundaries.items.forEach(boundary => {
        this.boundaryGrid.addItem(boundary);
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

      // update cells
      
      items.forEach(item => {
        this.bodyGrid.updateItem(item);
      });

      // forward body collision check

      items.forEach(item => {

        let itemA = item as Models.Item;
        let cells = this.bodyGrid.getSurroundingCells(itemA);

        cells.forEach(cell => {
  
          if (cell != null) {
  
            cell.forEach(item => {
  
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
          let cell = this.boundaryGrid.getCellFromPoint(item.bounds.anchor);
          if (cell) {
            cell.forEach(seg => {
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
      
      // update cells and sectors
      // apply sector properties to body

      items.forEach(item => {

        this.bodyGrid.updateItem(item);
        this.bodyBoundaryMap.updateItem(item);

        // temp
        item.rotation = 0.5;

        let boundary = this.bodyBoundaryMap.getItemPolygon(item);

        if (boundary) {
          item.velocity.x *= 1 - boundary.drag;
          item.velocity.y *= 1 - boundary.drag;
        }

      });

      // ray 
      let r = this.model.ray;
  
      // near items check

      let cen = { x: 400, y:300 };
      cen.x += 200 * Math.sin(Date.now() / 5000);
      cen.y += 200 * Math.cos(Date.now() / 5000);
      let rad = 150;

      r.origin.x = cen.x;
      r.origin.y = cen.y;
      r.angle = Geom.normalizeAngle(Math.PI * 2 - Geom.angleBetween(cen.x, cen.y, 400, 300));

      let nearItems = this.itemsNear(cen, rad);

      
      nearItems.forEach(item => {
        let ang = Geom.normalizeAngle(0 - Geom.angleBetween(cen.x, cen.y, item.bounds.anchor.x, item.bounds.anchor.y) + Math.PI * 0.5);
        let angDelta = Geom.normalizeAngle(r.angle - ang);
        if (Math.abs(angDelta) < 0.5) {
          item.rotation = 0;
        }
      });

      // ray check

      let hitPts = this.raycast(r);

      this.model.rayHit = hitPts[0];

      if (this.model.rayHit) {
        let hitItem = this.model.bodies.getItemByID(this.model.rayHit.parentID);
        if (hitItem) {
          hitItem.rotation = -1;
        }
      }

      // end ray check


    }

    public itemsNear (center:Geom.IPoint, radius:number):Array<Models.Item> {

      return this.bodyGrid.getItemsNear(center, radius);

    }
    

    public raycast (ray:Geom.Ray):Array<Geom.IPointHit> {

      let pt = ray.project(400);

      let hitPts:Array<Geom.IPointHit> = [];

      let coords = Geom.cellCoordsAlongLineWithThickness(ray.origin.x, ray.origin.y, pt.x, pt.y, 100, 20);

      let boundaryCells = this.boundaryGrid.getCellsFromCoords(coords, true);
      
      boundaryCells.forEach(cell => {
        cell.forEach(seg => {
          let intPt = Geom.lineLineIntersect(ray.origin.x, ray.origin.y, pt.x, pt.y, seg.ptA.x, seg.ptA.y, seg.ptB.x, seg.ptB.y);

          if (intPt != null) {
            hitPts.push(new Geom.PointHit(ray.origin, intPt, seg.parentID))
          }
        });
      });

      let bodyCells = this.bodyGrid.getCellsFromCoords(coords, true);

      bodyCells.forEach(cell => {
        cell.forEach(body => {

          let intPts = Geom.boundsLineIntersect(body.bounds, ray.origin, pt);

          if (intPts && intPts.length) {
            intPts.forEach(intPt => {
              let item = body as Models.Item;
              hitPts.push(new Geom.PointHit(ray.origin, intPt, item.id));
            })
          }

        })
      })

      if (hitPts.length > 0) {
        Geom.PointHit.sort(hitPts);
      }

      return hitPts;

    }

    public stop () {

      console.log("stopping...");

    }

  }

}