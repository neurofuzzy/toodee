namespace Simulation {

  export enum EventType {
    Contact = 4,
  }

  export enum EventContext {
    Simulation = 1,
    Boundary = 2,
  }

  export var MAXVEL:number = 12;

  export class Controller implements Models.IModelController<Model> {

    protected model:Model;
    protected bodyGrid:Geom.SpatialGrid<Entity>;
    protected boundaryGrid:Geom.PolygonGrid<Boundary>;
    protected bodyBoundaryMap:Geom.SpatialPolygonMap<Boundary, Entity>;

    protected bodyBodyContacts:Array<Physics.BodyBodyContact>;
    protected bodyBodyContactIndices:Array<boolean>;
    protected bodyBoundaryContacts:Array<Physics.BodyBoundaryContact>;
    protected bodySegmentContactIndices:Array<boolean>;
    protected bodyBeamContacts:Array<Physics.BodySegmentBodyContact>;
    protected bodyBeamContactIndices:Array<boolean>;
    protected forces:Array<Physics.IForce>;
    protected dispatcher:Models.IEventDispatcher<Entity | Projectile | Boundary | Beam>;
    protected _api:API<Boundary, Entity>

    get api ():API<Boundary, Entity> {
      return this._api;
    }

    public initWithModel(model:Model):any {

      this.model = model;
      this.reset();
      return this;

    }

    public reset ():void {

      this.dispatcher = new Models.EventDispatcher<Entity | Projectile | Boundary | Beam>().init();
      this.bodyGrid = new Geom.SpatialGrid(100).init();
      this.boundaryGrid = new Geom.PolygonGrid(100, 20).init();
      this.bodyBoundaryMap = new Geom.SpatialPolygonMap().init();
      this.forces = [];
      this._api = new API(this.model, this.bodyGrid, this.boundaryGrid, this.bodyBoundaryMap, this.forces, this.dispatcher);

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

    private getBodyBodyContacts (itemA:Entity, itemB:Entity):Physics.BodyBodyContact {

      if (itemA == itemB) {
        return;
      }

      if (!(itemA.contactMask & itemB.contactMask)) {
        return;
      }

      let contactPairIdx = Util.Pairing.cantorPair(itemA.id, itemB.id);

      if (itemA.bounds.shape == Geom.SHAPE_ORTHO) {
        return;
      }

      if (this.bodyBodyContactIndices[contactPairIdx]) {
        return;
      }

      if (Geom.boundsIntersect(itemA.bounds, itemB.bounds, true)) {

        if (itemA.resolveMask & itemB.resolveMask) {

          let penetration = Geom.resolvePenetrationBetweenBounds(itemA.bounds, itemB.bounds, itemA.constraints, itemB.constraints, true);

          if (penetration) {
            this.bodyBodyContactIndices[contactPairIdx] = true;
            this.bodyBodyContacts.push(new Physics.BodyBodyContact(penetration, itemA, itemB, itemA.cor * itemB.cor));
          }

        } 
        
        if (this.dispatcher) {
          this.dispatcher.dispatch(EventType.Contact, itemA, itemB);
        }

      }

    }

    private getBodyBoundaryContacts (item:Entity, seg:Geom.ISegment):void {

      let parentPoly = this.model.boundaries.getItemByID(seg.parentID);

      if (parentPoly.isSector) {
        return;
      }

      if (!(item.contactMask & parentPoly.contactMask)) {
        return;
      }

      let contactPairIdx = Util.Pairing.cantorPair(item.id, seg.id);

      if (this.bodySegmentContactIndices[contactPairIdx]) {
        return;
      }

      let resolve = (item.resolveMask & parentPoly.resolveMask) > 0;

      let penetration = Geom.getPenetrationSegmentRound(seg.ptA, seg.ptB, item.bounds, resolve);

      if (penetration) {

        this.bodySegmentContactIndices[contactPairIdx] = true;
        this.bodyBoundaryContacts.push(new Physics.BodyBoundaryContact(penetration, item, seg, item.cor * parentPoly.cor));
        
        if (this.dispatcher) {
          this.dispatcher.dispatch(EventType.Contact, item, parentPoly, penetration);
        }
      }

    }

    private alignBeam (beam:Beam):void {

      if (beam.parentID >= 0) {

        let parent = this.model.bodies.getItemByID(beam.parentID);

        if (parent) {
          
          if (beam.constrainRotationToParent) {
            beam.ray.align(parent.bounds.anchor, Math.PI - parent.rotation)
          } else {
            beam.ray.align(parent.bounds.anchor); //, beam.ray.angle);
          }

        }
        
      }

    }

    private getBodyBeamContacts (beam:Beam):void {

      beam.hits = this._api.raycast(beam.ray);

      let beamTerminated = false;

      beam.hits.forEach(hit => {

        if (beamTerminated) {
          return;
        }

        if (hit.parentID == beam.parentID) {
          return;
        }

        if (hit.type == Geom.HIT_TYPE_SEGMENT) {

          var boundary = this.model.boundaries.getItemByID(hit.parentID);

          if (!boundary.isSector) {

            beam.ray.ptB.x = hit.pt.x;
            beam.ray.ptB.y = hit.pt.y;

            if (this.dispatcher) {
              this.dispatcher.dispatch(EventType.Contact, beam, boundary, 0);
            }
    
            beamTerminated = true;
            return;

          }

        }

        var item = this.model.bodies.getItemByID(hit.parentID);

        if (item == null) {
          return;
        }

        if (!(item.contactMask & beam.contactMask)) {
          return;
        }

        let contactPairIdx = Util.Pairing.cantorPair(item.id, beam.id);

        if (this.bodyBeamContactIndices[contactPairIdx]) {
          return;
        }

        let resolve:boolean = beam.isBoundary && !beam.isSoft && ((item.resolveMask & beam.resolveMask) > 0);
       
        let penetration = Geom.getPenetrationSegmentRound(beam.ray.ptA, beam.ray.ptB, item.bounds, resolve, true);

        if (penetration) {

          this.bodyBeamContactIndices[contactPairIdx] = true;
          let contact = new Physics.BodySegmentBodyContact(penetration, item, beam, item.cor * beam.cor);
          contact.hitPoint = hit;
          this.bodyBeamContacts.push(contact);
          
          if (this.dispatcher) {
            this.dispatcher.dispatch(EventType.Contact, beam, item, penetration);
          }
        }

        if (!beam.isBoundary) {
          beam.ray.ptB.x = hit.pt.x;
          beam.ray.ptB.y = hit.pt.y;
          beamTerminated = true;
        }

      });

    }

    private applyPointAsForce (pt:Geom.IPoint, body:Physics.IBody) {

      if (!body.constraints.lockX) {
        body.velocity.x += pt.x;
      }

      if (!body.constraints.lockY) {
        body.velocity.y += pt.y;
      }

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
        item.bounds.anchor.x += Math.max(0 - Simulation.MAXVEL, Math.min(Simulation.MAXVEL, item.velocity.x));
        item.bounds.anchor.y += Math.max(0 - Simulation.MAXVEL, Math.min(Simulation.MAXVEL, item.velocity.y));
      });

      this.model.projectiles.items.forEach(item => {
        item.position.x += item.velocity.x;
        item.position.y += item.velocity.y;
      });

    }

    public update = (secondPass?:boolean) => {

      this.bodyBodyContacts = [];
      this.bodyBoundaryContacts = [];
      this.bodyBeamContacts = [];
      this.bodyBodyContactIndices = [];
      this.bodySegmentContactIndices = [];
      this.bodyBeamContactIndices = [];

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

        let itemA = item as Entity;
        let cells = this.bodyGrid.getSurroundingCells(itemA);

        cells.forEach(cell => {
  
          if (cell != null) {
  
            cell.forEach(item => {
  
              var itemB = item as Entity;
              this.getBodyBodyContacts(itemA, itemB);

            });

          }

        });

      });

      // body-boundary collision check

      items.forEach(item => {
        if (item.bounds.shape == Geom.SHAPE_ROUND) {
          let itemA = item as Entity;
          let cell = this.boundaryGrid.getCellFromPoint(item.bounds.anchor);
          if (cell) {
            cell.forEach(seg => {
              this.getBodyBoundaryContacts(itemA, seg);
            })
          }
        }
      });

      // resolve accumulated contacts

      if (secondPass) {
        this.bodyBodyContacts.reverse();
        this.bodyBoundaryContacts.reverse();
        this.bodyBeamContacts.reverse();
      }

      this.bodyBodyContacts.forEach(contact => {
        Physics.resolveContact(contact);
      });

      this.bodyBoundaryContacts.forEach(contact => {
        Physics.resolveContact(contact);
      });

      // projectiles

      var projectiles = this.model.projectiles;

      projectiles.items.forEach(projectile => {

        projectile.age++;

        // if end of lifespan
        if (projectile.age > projectile.lifespan) {
          this.model.projectiles.removeItem(projectile);
          return;
        }

        let polygon = this.bodyBoundaryMap.getPolygonFromPoint(projectile.position, true);

        // if out of bounds
        if (!polygon) {
          if (this.dispatcher) {
            this.dispatcher.dispatch(EventType.Contact, projectile, this.bodyBoundaryMap.getOutermostPolygon(), 0);
          }
          this.model.projectiles.removeItem(projectile);
          return;
        }

        // masked out
        if (!(projectile.contactMask & polygon.contactMask)) {
          return;
        }

        // out of bounds by inverted polygon
        if (polygon.inverted) { 

          if (projectile.resolveMask & polygon.resolveMask) {
            if (this.dispatcher) {
              this.dispatcher.dispatch(EventType.Contact, projectile, polygon, 0);
            }
            this.model.projectiles.removeItem(projectile);
          }
          return;

        }

        let hitItems = this.bodyGrid.getItemsUnderPoint(projectile.position);

        // if hit an object
        if (hitItems.length > 0) { 
          
          let didHit = false;

          hitItems.forEach(item => {
            if (!(projectile.contactMask & item.contactMask)) {
              return;
            }
            if (projectile.parentID == item.id) {
              return;
            }
            if (projectile.resolveMask & item.resolveMask) {
              didHit = true;
              if (this.dispatcher) {
                this.dispatcher.dispatch(EventType.Contact, projectile, item, 0);
              }
            }
          });

          if (didHit) {
            this.model.projectiles.removeItem(projectile);
          }

          return;
        }

      });

      // beams

      var beams = this.model.beams;

      beams.items.forEach(beam => {
        
        this.alignBeam(beam);
        this.getBodyBeamContacts(beam);

      });

      this.bodyBeamContacts.forEach(contact => {
        Physics.resolveContact(contact);
      })
      
      // update cells and sectors
      // apply sector properties to body

      items.forEach(item => {

        this.bodyGrid.updateItem(item);
        this.bodyBoundaryMap.updateItem(item);

        let boundary = this.bodyBoundaryMap.getPolygonByItemID(item.id);

        if (boundary) {
          item.velocity.x *= 1 - boundary.drag;
          item.velocity.y *= 1 - boundary.drag;
        }

      });

    }
    
    public stop () {

      console.log("stopping...");

    }

  }

}