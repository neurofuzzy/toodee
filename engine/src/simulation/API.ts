import { Entity } from './Entity';
import { Projectile } from './Projectile';
import { Boundary } from './Boundary';
import { Beam } from './Beam';
import { Model } from './Model';
import { IPolygon, IPoint, IBounds } from '../geom/IGeom';
import { ISpatial } from '../geom/ISpatial';
import { Point, Ray } from '../geom/BaseGeom';
import { SpatialGrid } from '../geom/SpatialGrid';
import { PolygonGrid } from '../geom/PolygonGrid';
import { SpatialPolygonMap } from '../geom/SpatialPolygonMap';
import { normalizeAngle, angleBetween, cellCoordsAlongLineWithThickness, lineLineIntersect, boundsLineIntersect, rotatePoint, maxPoint, xyToAngle, PointHit, HIT_TYPE_SEGMENT, HIT_TYPE_SHAPE } from '../geom/Helpers';
import { EventDispatcher, EventType, IEventListenerFunc, Identifiable } from '../models/Events';

export class API<T extends IPolygon & Identifiable, K extends Identifiable & ISpatial> {

  protected readonly model:Model;
  protected readonly bodyGrid:SpatialGrid<K>;
  protected readonly boundaryGrid:PolygonGrid<T>;
  protected readonly bodyBoundaryMap:SpatialPolygonMap<T, K>;
  protected forces:Array<any>; // Assuming Physics.IForce is not available, replace with correct type
  protected dispatcher:EventDispatcher<Entity | Projectile | Boundary | Beam>;

  constructor (model:Model, bodyGrid:SpatialGrid<K>, boundaryGrid:PolygonGrid<T>, bodyBoundaryMap:SpatialPolygonMap<T, K>, forces:Array<any>, dispatcher:EventDispatcher<Entity | Projectile | Boundary | Beam>) {

    this.model = model;
    this.bodyGrid = bodyGrid;
    this.boundaryGrid = boundaryGrid;
    this.bodyBoundaryMap = bodyBoundaryMap;
    this.forces = forces;
    this.dispatcher = dispatcher;

    return this;

  }

  /**
   * Adds a listener function to receive events when objects are added or removed from a model
   * @param listener IEventListenerFunc<Entity | Projectile | Boundary | Beam>
   * @param scope scope object to use as _this_
   */
  public addModelListener (listener:IEventListenerFunc<Entity | Projectile | Boundary | Beam>, scope:any):void {

    this.model.bodies.addListener(listener, scope)
    this.model.projectiles.addListener(listener, scope)
    this.model.boundaries.addListener(listener, scope)
    this.model.beams.addListener(listener, scope);
  
  }

  /**
   * Adds a listener function to receive events when objects make contact with eachother or boundaries
   * @param listener IEventListenerFunc<Entity | Projectile | Boundary | Beam>
   * @param scope scope object to use as _this_
   */
  public addContactListener (listener:IEventListenerFunc<Entity | Projectile | Boundary | Beam>, scope:any):void {

    this.dispatcher.addListener(listener, scope);

  }

  /**
   * Adds a listener function to receive events when object enter or leave boundary areas
   * @param listener IEventListenerFunc<T>
   * @param scope scope object to use as _this_
   */
  public addBoundaryCrossListener (listener:IEventListenerFunc<T>, scope:any):void {

    this.bodyBoundaryMap.addListener(listener, scope);

  }

  /**
   * Adds a force to the simulation
   * @param force
   */
  public addForce (force:any) { // Assuming Physics.IForce is not available, replace with correct type

    this.forces.push(force);

  }

  public applyImpulse (toEntity:Entity, x:number, y:number):void {

    toEntity.velocity.x += x;
    toEntity.velocity.y += y;

  }

  /**
   * Removes forces that act on a particular id
   * @param id
   */
  public removeForcesByParentID (id:number):void {

    let i = this.forces.length;

    while (i--) {
      let force = this.forces[i];
      if (force.parentID == id) {
        this.forces.splice(i, 1);
      }
    }

  }

  /**
   * Finds bodies near a point
   * @param focusPt point to check nearness
   * @param range how far is near
   */
  public bodiesNear (focalPt:IPoint, range:number):Array<K> {

    return this.bodyGrid.getItemsNear(focalPt, range);

  }

  /**
   * Finds bodies near another body, filtering out bodies not in front. Useful for sight-based AI
   * @param focusPt focal point
   * @param range near range
   * @param facingAngle 
   * @param withinAngle angle delta from front
   */
  public bodiesNearAndInFront (focalPt:IPoint, range:number, facingAngle:number, withinAngle:number = 0.5):Array<K> {
    
    let frontBodies:Array<K> = [];
    let nearItems = this.bodiesNear(focalPt, range);
    
    nearItems.forEach(bodyB => {
      let ptB = bodyB.bounds.anchor;
      let ang = normalizeAngle(0 - angleBetween(focalPt.x, focalPt.y, ptB.x, ptB.y) + Math.PI * 0.5);
      let angDelta = normalizeAngle(facingAngle - ang);
      if (Math.abs(angDelta) < withinAngle) {
        frontBodies.push(bodyB)
      }
    });

    return frontBodies;

  }

  /**
   * Projects a ray and returns a list of bodies that intersect, closest first
   * @param ray a ray to project
   */
  public raycast (ray:Ray):Array<PointHit> {
    
    let hitPts:Array<PointHit> = [];

    let coords = cellCoordsAlongLineWithThickness(ray.ptA.x, ray.ptA.y, ray.ptB.x, ray.ptB.y, 100, 20);

    let boundaryCells = this.boundaryGrid.getCellsFromCoords(coords, true);
    
    boundaryCells.forEach(cell => {
      if (Array.isArray(cell)) {
        cell.forEach(seg => {
          let intPt = lineLineIntersect(ray.ptA.x, ray.ptA.y, ray.ptB.x, ray.ptB.y, seg.ptA.x, seg.ptA.y, seg.ptB.x, seg.ptB.y);

          if (intPt != null) {
            hitPts.push(new PointHit(ray.ptA, intPt, seg.parentID, HIT_TYPE_SEGMENT))
          }
        });
      }
    });

    let bodyCells = this.bodyGrid.getCellsFromCoords(coords, true);

    bodyCells.forEach(cell => {
      if (Array.isArray(cell)) {
        cell.forEach(body => {

          let intPts = boundsLineIntersect(body.bounds, ray.ptA, ray.ptB);

          if (intPts && intPts.length) {
            intPts.forEach(intPt => {
              let item = body;
              hitPts.push(new PointHit(ray.ptA, intPt, item.id, HIT_TYPE_SHAPE));
            })
          }

        });
      }
    })

    if (hitPts.length > 0) {
      PointHit.sort(hitPts);
    }

    return hitPts;

  }

  public launchFrom (item:Entity, speed:number = 3, angle:number = NaN, projectile:Projectile | null = null):Projectile {

    if (isNaN(angle)) {
      angle = item.rotation;
    }

    if (projectile == null) {
      projectile = new Projectile();
    }

    let pos = item.bounds.anchor.clone();
    projectile.initWithPositionSizeAndLifespan(pos, 5, 360);
    projectile.parentID = item.id;

    let vel = new Point(speed, 0);
    rotatePoint(vel, angle);
    let bv = projectile.velocity;
    let iv = item.velocity;
    bv.x = vel.x;
    bv.y = vel.y;

    if (bv.x > 0) {
      bv.x = Math.max(bv.x, bv.x + iv.x);
    } else {
      bv.x = Math.min(bv.x, bv.x + iv.x);
    }

    if (bv.y > 0) {
      bv.y = Math.max(bv.y, bv.y + iv.y);
    } else {
      bv.y = Math.min(bv.y, bv.y + iv.y);
    }

    //maxPoint(projectile.velocity, 3);
    this.model.projectiles.addItem(projectile);

    return projectile;

  }

  public launchFromWithDeltaXY(item:Entity, speed:number = 3, deltaX:number = 0, deltaY:number = 0, projectile:Projectile | null = null):Projectile {

    let angle = normalizeAngle(0 - xyToAngle(deltaX, deltaY));
    return this.launchFrom(item, speed, angle, projectile);
  
  }

  public castFrom (item:Entity, range:number = 500, beam:Beam | null = null):Beam {

    if (beam == null) {
      beam = new Beam();
    }
    beam.initWithOriginAndAngle(item.bounds.anchor.x, item.bounds.anchor.y, item.rotation, range, item.id);

    beam.constrainRotationToParent = true;
    this.model.beams.addItem(beam);

    return beam;

  }

}