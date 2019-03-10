namespace Simulation {

  export class API<T extends Geom.IPolygon & Models.Identifiable, K extends Models.Identifiable & Geom.ISpatial> {

    protected readonly model:Model;
    protected readonly bodyGrid:Geom.SpatialGrid<K>;
    protected readonly boundaryGrid:Geom.PolygonGrid<T>;
    protected readonly bodyBoundaryMap:Geom.SpatialPolygonMap<T, K>;
    protected forces:Array<Physics.IForce>;
    protected dispatcher:Models.IEventDispatcher<Entity | Projectile | Boundary | Beam>;

    constructor (model:Model, bodyGrid:Geom.SpatialGrid<K>, boundaryGrid:Geom.PolygonGrid<T>, bodyBoundaryMap:Geom.SpatialPolygonMap<T, K>, forces:Array<Physics.IForce>, dispatcher:Models.IEventDispatcher<Entity | Projectile | Boundary | Beam>) {

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
     * @param listener Models.IEventListenerFunc<Entity | Projectile | Boundary>
     * @param scope scope object to use as _this_
     */
    public addModelListener (listener:Models.IEventListenerFunc<Entity | Projectile | Boundary | Beam>, scope:any):void {

      this.model.bodies.addListener(listener, scope)
      this.model.projectiles.addListener(listener, scope)
      this.model.boundaries.addListener(listener, scope)
      this.model.beams.addListener(listener, scope);
  
    }

    /**
     * Adds a listener function to receive events when objects make contact with eachother or boundaries
     * @param listener Models.IEventListenerFunc<Entity | Beam | Projectile>
     * @param scope scope object to use as _this_
     */
    public addContactListener (listener:Models.IEventListenerFunc<Entity | Projectile | Boundary | Beam>, scope:any):void {

      this.dispatcher.addListener(listener, scope);

    }

    /**
     * Adds a listener function to receive events when object enter or leave boundary areas
     * @param listener Models.IEventListenerFunc<T>
     * @param scope scope object to use as _this_
     */
    public addBoundaryCrossListener (listener:Models.IEventListenerFunc<T>, scope:any):void {

      this.bodyBoundaryMap.addListener(listener, scope);

    }

    /**
     * Adds a force to the simulation
     * @param force
     */
    public addForce (force:Physics.IForce) {

      this.forces.push(force);

    }

    public applyImpulse (toEntity:Simulation.Entity, x:number, y:number):void {

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
    public bodiesNear (focalPt:Geom.IPoint, range:number):Array<K> {

      return this.bodyGrid.getItemsNear(focalPt, range);

    }

    /**
     * Finds bodies near another body, filtering out bodies not in front. Useful for sight-based AI
     * @param focusPt focal point
     * @param range near range
     * @param facingAngle 
     * @param withinAngle angle delta from front
     */
    public bodiesNearAndInFront (focalPt:Geom.IPoint, range:number, facingAngle:number, withinAngle:number = 0.5):Array<K> {
      
      let frontBodies:Array<K> = [];
      let nearItems = this.bodiesNear(focalPt, range);
      
      nearItems.forEach(bodyB => {
        let ptB = bodyB.bounds.anchor;
        let ang = Geom.normalizeAngle(0 - Geom.angleBetween(focalPt.x, focalPt.y, ptB.x, ptB.y) + Math.PI * 0.5);
        let angDelta = Geom.normalizeAngle(facingAngle - ang);
        if (Math.abs(angDelta) < withinAngle) {
          frontBodies.push(bodyB)
        }
      });

      return frontBodies;

    }

    /**
     * Projects a ray and returns a list of bodies that intersect, closest first
     * @param ray a ray to project
     * @param range how far to project the ray
     */
    public raycast (ray:Geom.Ray):Array<Geom.IPointHit> {
      
      let hitPts:Array<Geom.IPointHit> = [];

      let coords = Geom.cellCoordsAlongLineWithThickness(ray.ptA.x, ray.ptA.y, ray.ptB.x, ray.ptB.y, 100, 20);

      let boundaryCells = this.boundaryGrid.getCellsFromCoords(coords, true);
      
      boundaryCells.forEach(cell => {
        cell.forEach(seg => {
          let intPt = Geom.lineLineIntersect(ray.ptA.x, ray.ptA.y, ray.ptB.x, ray.ptB.y, seg.ptA.x, seg.ptA.y, seg.ptB.x, seg.ptB.y);

          if (intPt != null) {
            hitPts.push(new Geom.PointHit(ray.ptA, intPt, seg.parentID, Geom.HIT_TYPE_SEGMENT))
          }
        });
      });

      let bodyCells = this.bodyGrid.getCellsFromCoords(coords, true);

      bodyCells.forEach(cell => {

        cell.forEach(body => {

          let intPts = Geom.boundsLineIntersect(body.bounds, ray.ptA, ray.ptB);

          if (intPts && intPts.length) {
            intPts.forEach(intPt => {
              let item = body;
              hitPts.push(new Geom.PointHit(ray.ptA, intPt, item.id, Geom.HIT_TYPE_SHAPE));
            })
          }

        });

      })

      if (hitPts.length > 0) {
        Geom.PointHit.sort(hitPts);
      }

      return hitPts;

    }

    public launchFrom (item:Entity, speed:number = 3, angle:number = NaN, projectile:Projectile = null):Projectile {

      if (isNaN(angle)) {
        angle = item.rotation;
      }

      if (projectile == null) {
        projectile = new Simulation.Projectile();
      }

      let pos = item.bounds.anchor.clone();
      projectile.initWithPositionSizeAndLifespan(pos, 5, 360);
      projectile.parentID = item.id;

      let vel = new Geom.Point(speed, 0);
      Geom.rotatePoint(vel, angle);
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

      //Geom.maxPoint(projectile.velocity, 3);
      this.model.projectiles.addItem(projectile);

      return projectile;

    }

    public launchFromWithDeltaXY(item:Entity, speed:number = 3, deltaX:number = 0, deltaY:number = 0, projectile:Projectile = null):Projectile {

      let angle = Geom.normalizeAngle(0 - Geom.xyToAngle(deltaX, deltaY));
      return this.launchFrom(item, speed, angle, projectile);
    
    }

    public castFrom (item:Entity, range:number = 500, beam:Beam = null):Beam {

      beam = new Simulation.Beam();
      beam.initWithOriginAndAngle(item.bounds.anchor.x, item.bounds.anchor.y, item.rotation, range, item.id);

      beam.constrainRotationToParent = true;
      this.model.beams.addItem(beam);

      return beam;

    }

  }

}