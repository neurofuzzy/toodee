namespace Simulation {

  export class API<T extends Geom.IPolygon & Util.Identifiable, K extends Util.Identifiable & Geom.ISpatial> {

    protected readonly bodyGrid:Geom.SpatialGrid<K>;
    protected readonly boundaryGrid:Geom.PolygonGrid<T>;
    protected readonly bodyBoundaryMap:Geom.SpatialPolygonMap<T, K>;
    protected forces:Array<Physics.IForce>;
    protected dispatcher:Util.IEventDispatcher;

    constructor (bodyGrid:Geom.SpatialGrid<K>, boundaryGrid:Geom.PolygonGrid<T>, bodyBoundaryMap:Geom.SpatialPolygonMap<T, K>, forces:Array<Physics.IForce>, dispatcher:Util.IEventDispatcher) {

      this.bodyGrid = bodyGrid;
      this.boundaryGrid = boundaryGrid;
      this.bodyBoundaryMap = bodyBoundaryMap;
      this.forces = forces;
      this.dispatcher = dispatcher;

      return this;

    }

    /**
     * Adds a force to the simulation
     * @param force
     */
    public addForce (force:Physics.IForce) {

      this.forces.push(force);

    }

    /**
     * Removes forces that act on a particular id
     * @param id
     */
    public removeForcesByParentID (id:number) {

      let i = this.forces.length;

      while (i--) {
        let force = this.forces[i];
        if (force.parentID == id) {
          this.forces.splice(i, 1);
        }
      }

    }

    /**
     * Adds a listener function to receive events when objects make contact with eachother or boundaries
     * @param listener Util.IEventListenerFunc
     * @param scope scope object to use as _this_
     */
    public addContactListener (listener:Util.IEventListenerFunc, scope:any):void {

      this.dispatcher.addListener(listener, scope);

    }

    /**
     * Adds a listener function to receive events when object enter or leave boundary areas
     * @param listener Util.IEventListenerFunc
     * @param scope scope object to use as _this_
     */
    public addBoundaryListener (listener:Util.IEventListenerFunc, scope:any):void {

      this.bodyBoundaryMap.addListener(listener, scope);

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
    public raycast (ray:Geom.Ray, range:number):Array<Geom.IPointHit> {
      
      let pt = ray.project(range);

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
              let item = body;
              hitPts.push(new Geom.PointHit(ray.origin, intPt, item.id));
            })
          }

        });

      })

      if (hitPts.length > 0) {
        Geom.PointHit.sort(hitPts);
      }

      return hitPts;

    }

  }

}