namespace Controllers {

  export class Simulation implements Util.IModelController<Models.Model> {

    protected model:Models.Model;
    protected bodyGrid:Geom.SpatialGrid<Models.Item>;
    protected boundaryGrid:Geom.PolygonGrid<Models.Boundary>;
    protected bodyBoundaryMap:Geom.SpatialPolygonMap<Models.Boundary, Models.Item>;

    protected bodyBodyContacts:Array<Physics.BodyBodyContact>;
    protected bodyBodyContactIndices:Array<boolean>;
    protected bodyBoundaryContacts:Array<Physics.BodyBoundaryContact>;
    protected forces:Array<Physics.IForce>;

    public api:SimulationAPI<Models.Boundary, Models.Item>;

    public initWithModel(model:Models.Model):any {

      this.model = model;
      this.reset();
      return this;

    }

    public reset ():void {

      this.bodyGrid = new Geom.SpatialGrid(100).init();
      this.boundaryGrid = new Geom.PolygonGrid(100, 20).init();
      this.bodyBoundaryMap = new Geom.SpatialPolygonMap().init();
      this.forces = [];

      this.api = new SimulationAPI(this.bodyGrid, this.boundaryGrid, this.bodyBoundaryMap, this.forces);

    }

    protected build () {

      // add items to grid

      this.model.bodies.items.forEach(body => {
        this.bodyGrid.addItem(body);
      });

      // add boundaries to grid

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

        if (penetration) {
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

    private applyPointAsForce (pt:Geom.IPoint, body:Physics.IBody) {

      body.velocity.x += pt.x;
      body.velocity.y += pt.y;

    }

    private applyForces () {

      let forcePt = new Geom.Point();

      this.forces.forEach(force => {

        if (force instanceof Physics.ProximityForce) {

          let bodies = this.api.bodiesNear(force.origin, force.range);

          let ptA = force.origin;

          bodies.forEach(body => {

            let ptB = body.bounds.anchor;
            let angle = 0 - Geom.angleBetween(ptA.x, ptA.y, ptB.x, ptB.y);

            forcePt.y = 0;
            forcePt.x = force.power * 0.0166; // 60 frames per second

            Geom.rotatePoint(forcePt, force.angle);
            Geom.rotatePoint(forcePt, angle);
            this.applyPointAsForce(forcePt, body);

          })

        } else if (force instanceof Physics.AreaForce) {

          let bodies = this.bodyBoundaryMap.getItemsWithinPolygonID(force.parentID);

          if (bodies) {

            forcePt.y = 0;
            forcePt.x = force.power * 0.0166; // 60 frames per second
            Geom.rotatePoint(forcePt, force.angle);

            bodies.forEach(body => {
              this.applyPointAsForce(forcePt, body);
            });

          }

        } else if (force instanceof Physics.PropulsionForce) {

          let body = this.model.bodies.getItemByID(force.parentID);

          if (body) {

            forcePt.y = 0;
            forcePt.x = force.power * 0.0166; // 60 frames per second
            Geom.rotatePoint(forcePt, force.angle);
            Geom.rotatePoint(forcePt, body.rotation);
            this.applyPointAsForce(forcePt, body);

          }

        }

        if (force.lifespan > 0) {
          force.age++;
        }

      });

      // remove spent forces

      let i = this.forces.length;

      while (i--) {
        let force = this.forces[i];
        if (force.lifespan > 0 && force.age > force.lifespan) {
          this.forces.splice(i, 1);
        }
      }

    }

    private applyVelocities () {

      this.model.bodies.items.forEach(item => {
        item.bounds.anchor.x += item.velocity.x;
        item.bounds.anchor.y += item.velocity.y;
      });

    }

    public update = () => {

      this.bodyBodyContacts = [];
      this.bodyBoundaryContacts = [];
      this.bodyBodyContactIndices = [];

      var items = this.model.bodies.items;

      // apply forces to velocities

      this.applyForces();

      // apply velocities to positions

      this.applyVelocities();

      // update cells
      
      items.forEach(item => {
        this.bodyGrid.updateItem(item);
      });

      // body-body collision check

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

      // body-boundary collision check

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

      // resove accumulated contacts

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

        let boundary = this.bodyBoundaryMap.getPolygonByItemID(item.id);

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

      let nearItems = this.api.bodiesNearAndInFront(r.origin, 150, r.angle, 0.5);
      nearItems.forEach(item => {
        item.rotation = 0;
      });

      // ray check

      let hitPts = this.api.raycast(r, 400);

      this.model.rayHit = hitPts[0];

      if (this.model.rayHit) {
        let hitItem = this.model.bodies.getItemByID(this.model.rayHit.parentID);
        if (hitItem) {
          hitItem.rotation = -1;
        }
      }

      // end ray check


    }
    
    public stop () {

      console.log("stopping...");

    }

  }

}