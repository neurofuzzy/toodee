import { Entity } from './Entity';
import { Projectile } from './Projectile';
import { Boundary } from './Boundary';
import { Beam } from './Beam';
import { Model } from './Model';
import { IPolygon, IPoint } from '../geom/IGeom';
import { ISpatial } from '../geom/ISpatial';
import { Ray } from '../geom/BaseGeom';
import { SpatialGrid } from '../geom/SpatialGrid';
import { PolygonGrid } from '../geom/PolygonGrid';
import { SpatialPolygonMap } from '../geom/SpatialPolygonMap';
import { PointHit } from '../geom/Helpers';
import { EventDispatcher, IEventListenerFunc, Identifiable } from '../models/Events';
export declare class API<T extends IPolygon & Identifiable, K extends Identifiable & ISpatial> {
    protected readonly model: Model;
    protected readonly bodyGrid: SpatialGrid<K>;
    protected readonly boundaryGrid: PolygonGrid<T>;
    protected readonly bodyBoundaryMap: SpatialPolygonMap<T, K>;
    protected forces: Array<any>;
    protected dispatcher: EventDispatcher<Entity | Projectile | Boundary | Beam>;
    constructor(model: Model, bodyGrid: SpatialGrid<K>, boundaryGrid: PolygonGrid<T>, bodyBoundaryMap: SpatialPolygonMap<T, K>, forces: Array<any>, dispatcher: EventDispatcher<Entity | Projectile | Boundary | Beam>);
    /**
     * Adds a listener function to receive events when objects are added or removed from a model
     * @param listener IEventListenerFunc<Entity | Projectile | Boundary | Beam>
     * @param scope scope object to use as _this_
     */
    addModelListener(listener: IEventListenerFunc<Entity | Projectile | Boundary | Beam>, scope: any): void;
    /**
     * Adds a listener function to receive events when objects make contact with eachother or boundaries
     * @param listener IEventListenerFunc<Entity | Projectile | Boundary | Beam>
     * @param scope scope object to use as _this_
     */
    addContactListener(listener: IEventListenerFunc<Entity | Projectile | Boundary | Beam>, scope: any): void;
    /**
     * Adds a listener function to receive events when object enter or leave boundary areas
     * @param listener IEventListenerFunc<T>
     * @param scope scope object to use as _this_
     */
    addBoundaryCrossListener(listener: IEventListenerFunc<T>, scope: any): void;
    /**
     * Adds a force to the simulation
     * @param force
     */
    addForce(force: any): void;
    applyImpulse(toEntity: Entity, x: number, y: number): void;
    /**
     * Removes forces that act on a particular id
     * @param id
     */
    removeForcesByParentID(id: number): void;
    /**
     * Finds bodies near a point
     * @param focusPt point to check nearness
     * @param range how far is near
     */
    bodiesNear(focalPt: IPoint, range: number): Array<K>;
    /**
     * Finds bodies near another body, filtering out bodies not in front. Useful for sight-based AI
     * @param focusPt focal point
     * @param range near range
     * @param facingAngle
     * @param withinAngle angle delta from front
     */
    bodiesNearAndInFront(focalPt: IPoint, range: number, facingAngle: number, withinAngle?: number): Array<K>;
    /**
     * Projects a ray and returns a list of bodies that intersect, closest first
     * @param ray a ray to project
     */
    raycast(ray: Ray): Array<PointHit>;
    launchFrom(item: Entity, speed?: number, angle?: number, projectile?: Projectile | null): Projectile;
    launchFromWithDeltaXY(item: Entity, speed?: number, deltaX?: number, deltaY?: number, projectile?: Projectile | null): Projectile;
    castFrom(item: Entity, range?: number, beam?: Beam | null): Beam;
}
