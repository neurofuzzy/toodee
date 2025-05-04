// Migrated from namespace Simulation to ES module
import { SpatialGrid } from '../geom/SpatialGrid';
import { PolygonGrid } from '../geom/PolygonGrid';
import { SpatialPolygonMap } from '../geom/SpatialPolygonMap';
import { boundsIntersect, polygonInPolygon, angleBetween, rotatePoint, SHAPE_ORTHO, SHAPE_ROUND, HIT_TYPE_SEGMENT } from '../geom/Helpers';
import { IPoint, ISegment } from '../geom/IGeom';
import { BodyBodyContact, BodyBoundaryContact, BodySegmentBodyContact, resolveContact } from '../physics/Contact';
import { IBody } from '../physics/Body';
import { API } from './API';
import { cantorPair } from '../util/Pairing';
import { EventDispatcher, EventType } from '../models/Events';
import { Model } from './Model';
import { Point } from '../geom/BaseGeom';
import { resolvePenetrationBetweenBounds, getPenetrationSegmentRound } from '../geom/Penetration';

export enum EventContext {
  Simulation = 1,
  Boundary = 2,
}

export const MAXVEL: number = 12;

export class Controller {
  protected model!: Model;
  protected bodyGrid!: SpatialGrid<any>;
  protected boundaryGrid!: PolygonGrid<any>;
  protected bodyBoundaryMap!: SpatialPolygonMap<any, any>;

  protected bodyBodyContacts: Array<BodyBodyContact> = [];
  protected bodyBodyContactIndices: Array<boolean> = [];
  protected bodyBoundaryContacts: Array<BodyBoundaryContact> = [];
  protected bodySegmentContactIndices: Array<boolean> = [];
  protected bodyBeamContacts: Array<BodySegmentBodyContact> = [];
  protected bodyBeamContactIndices: Array<boolean> = [];
  protected forces: Array<any> = [];
  protected dispatcher!: EventDispatcher<any>;
  protected _api!: API<any, any>;

  get api(): API<any, any> {
    return this._api;
  }

  public initWithModel(model: Model): this {
    this.model = model;
    this.reset();
    return this;
  }

  public reset(): void {
    this.dispatcher = new EventDispatcher<any>().init();
    this.bodyGrid = new SpatialGrid(100).init();
    this.boundaryGrid = new PolygonGrid(100, 20).init();
    this.bodyBoundaryMap = new SpatialPolygonMap().init();
    this.forces = [];
    this._api = new API(this.model, this.bodyGrid, this.boundaryGrid, this.bodyBoundaryMap, this.forces, this.dispatcher);
  }

  protected build() {
    // add items to grid
    for (let i = 0; i < this.model.bodies.items.size; i++) {
      this.bodyGrid.addItem(this.model.bodies.items.get(i));
    }
    // add boundaries to grid
    for (let i = 0; i < this.model.boundaries.items.size; i++) {
      this.boundaryGrid.addItem(this.model.boundaries.items.get(i));
    }
    // compare boundaries to find sectors
    for (let i = 0; i < this.model.boundaries.items.size; i++) {
      let boundary = this.model.boundaries.items.get(i);
      for (let j = 0; j < this.model.boundaries.items.size; j++) {
        let otherBoundary = this.model.boundaries.items.get(j);
        if (boundary != otherBoundary) {
          if (boundary && !boundary.inverted && polygonInPolygon(boundary, otherBoundary)) {
            boundary.isSector = true;
          }
        }
      }
    }
    // add boundaries to body-boundary map
    let bs = [];
    for (let i = 0; i < this.model.boundaries.items.size; i++) {
      if (this.model.boundaries.items.get(i)) bs.push(this.model.boundaries.items.get(i));
    }
    for (let i = 0; i < bs.length; i++) {
      this.bodyBoundaryMap.addPolygon(bs[i]);
    }
  }

  public start() {
    this.build();
  }

  private getBodyBodyContacts(itemA: any, itemB: any): BodyBodyContact | undefined {
    if (itemA == itemB) return;
    if (!(itemA.contactMask & itemB.contactMask)) return;
    let contactPairIdx = cantorPair(itemA.id, itemB.id);
    if (itemA.bounds.shape == SHAPE_ORTHO) return;
    if (this.bodyBodyContactIndices[contactPairIdx]) return;
    if (boundsIntersect(itemA.bounds, itemB.bounds, true)) {
      if (itemA.resolveMask & itemB.resolveMask) {
        const penetration = resolvePenetrationBetweenBounds(itemA.bounds, itemB.bounds, itemA.cor, itemB.cor, true);
        this.bodyBodyContactIndices[contactPairIdx] = true;
        this.bodyBodyContacts.push(new BodyBodyContact(penetration, itemA, itemB, itemA.cor * itemB.cor));
      }
      if (this.dispatcher) {
        this.dispatcher.dispatch(EventType.Contact, itemA, itemB);
      }
    }
    return;
  }

  private getBodyBoundaryContacts(item: any, seg: ISegment): void {
    let parentPoly = this.model.boundaries.getItemByID(seg.parentID);

    if (parentPoly && parentPoly.isSector) {
      return;
    }

    if (parentPoly && !(item.contactMask & parentPoly.contactMask)) {
      return;
    }

    let contactPairIdx = cantorPair(item.id, seg.id);

    if (this.bodySegmentContactIndices[contactPairIdx]) {
      return;
    }

    let resolve = parentPoly ? (item.resolveMask & parentPoly.resolveMask) > 0 : false;

    const penetration = getPenetrationSegmentRound(seg.ptA, seg.ptB, item.bounds, resolve, true);

    if (penetration) {
      this.bodySegmentContactIndices[contactPairIdx] = true;
      this.bodyBoundaryContacts.push(new BodyBoundaryContact(penetration, item, seg, item.cor * (parentPoly ? parentPoly.cor : 1)));
    }
    
    if (this.dispatcher) {
      this.dispatcher.dispatch(EventType.Contact, item, parentPoly);
    }
  }

  private alignBeam(beam: any): void {

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

  private getBodyBeamContacts(beam: any): void {

    beam.hits = this._api.raycast(beam.ray);

    let beamTerminated = false;

    beam.hits.forEach(hit => {

      if (beamTerminated) {
        return;
      }

      if (hit.parentID == beam.parentID) {
        return;
      }

      if (hit.type == HIT_TYPE_SEGMENT) {

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

      let contactPairIdx = cantorPair(item.id, beam.id);

      if (this.bodyBeamContactIndices[contactPairIdx]) {
        return;
      }

      let resolve:boolean = beam.isBoundary && !beam.isSoft && ((item.resolveMask & beam.resolveMask) > 0);
     
      const penetration = getPenetrationSegmentRound(beam.ray.ptA, beam.ray.ptB, item.bounds, resolve, true);

      if (penetration) {
        this.bodyBeamContactIndices[contactPairIdx] = true;
        let contact = new BodySegmentBodyContact(penetration, item, beam, item.cor * beam.cor);
        contact.hitPoint = hit;
        this.bodyBeamContacts.push(contact);
      }
      
      if (this.dispatcher) {
        this.dispatcher.dispatch(EventType.Contact, beam, item);
      }
    });

  }

  private applyPointAsForce(pt: IPoint, body: IBody) {

    if (!body.constraints.lockX) {
      body.velocity.x += pt.x;
    }

    if (!body.constraints.lockY) {
      body.velocity.y += pt.y;
    }

  }

  private applyForces() {

    let forcePt = new Point();

    this.forces.forEach(force => {

      if (force instanceof Object && force.type === 'ProximityForce') {

        let bodies = this.api.bodiesNear(force.origin, force.range);

        let ptA = force.origin;

        bodies.forEach(body => {

          if (body.bounds.anchor === force.origin) {
            return;
          }

          let ptB = body.bounds.anchor;
          let angle = 0 - angleBetween(ptA.x, ptA.y, ptB.x, ptB.y);

          forcePt.y = 0;
          forcePt.x = force.power * 0.0166; // 60 frames per second

          rotatePoint(forcePt, force.angle);
          rotatePoint(forcePt, angle);
          this.applyPointAsForce(forcePt, body);

        })

      } else if (force instanceof Object && force.type === 'AreaForce') {

        let bodies = this.bodyBoundaryMap.getItemsWithinPolygonID(force.parentID);

        if (bodies) {

          forcePt.y = 0;
          forcePt.x = force.power * 0.0166; // 60 frames per second
          rotatePoint(forcePt, force.angle);

          bodies.forEach(body => {
            this.applyPointAsForce(forcePt, body);
          });

        }

      } else if (force instanceof Object && force.type === 'PropulsionForce') {

        let body = this.model.bodies.getItemByID(force.parentID);

        if (body) {

          forcePt.y = 0;
          forcePt.x = force.power * 0.0166; // 60 frames per second
          rotatePoint(forcePt, force.angle);
          rotatePoint(forcePt, body.rotation);
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

  private applyVelocities() {

    this.model.bodies.items.forEach(item => {
      item.bounds.anchor.x += Math.max(0 - MAXVEL, Math.min(MAXVEL, item.velocity.x));
      item.bounds.anchor.y += Math.max(0 - MAXVEL, Math.min(MAXVEL, item.velocity.y));
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

      let itemA = item as any;
      let cells = this.bodyGrid.getSurroundingCells(itemA);

      cells.forEach(cell => {
  
        if (cell != null) {
  
          cell.forEach(item => {
  
            var itemB = item as any;
            this.getBodyBodyContacts(itemA, itemB);

          });

        }

      });

    });

    // body-boundary collision check

    items.forEach(item => {
      if (item.bounds.shape == SHAPE_ROUND) {
        let itemA = item as any;
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
      resolveContact(contact);
    });

    this.bodyBoundaryContacts.forEach(contact => {
      resolveContact(contact);
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
      if (polygon && polygon.inverted) { 

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
      resolveContact(contact);
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
  
  public stop() {
    console.log('stopping...');
  }

}