namespace Controllers {

  export class SimulationAPI<T extends Geom.IPolygon & Util.Identifiable, K extends Util.Identifiable & Geom.ISpatial> {

    protected readonly bodyGrid:Geom.SpatialGrid<K>;
    protected readonly boundaryGrid:Geom.PolygonGrid<T>;
    protected readonly bodyBoundaryMap:Geom.SpatialPolygonMap<T, K>;

    constructor (bodyGrid:Geom.SpatialGrid<K>, boundaryGrid:Geom.PolygonGrid<T>, bodyBoundaryMap:Geom.SpatialPolygonMap<T, K>) {

      this.bodyGrid = bodyGrid;
      this.boundaryGrid = boundaryGrid;
      this.bodyBoundaryMap = bodyBoundaryMap;

      return this;

    }

    /**
     * Finds bodies near a point
     * @param pt point to check nearness
     * @param range how far is near
     */
    public bodiesNear (pt:Geom.IPoint, range:number):Array<K> {

      return this.bodyGrid.getItemsNear(pt, range);

    }

    /**
     * Finds bodies near another body, filtering out bodies not in front. Useful for sight-based AI
     * @param body subject body
     * @param range near range
     * @param withinAngle angle delta from front
     */
    public bodiesNearAndInFront (body:Geom.ISpatial, range:number, withinAngle:number = 0.5):Array<K> {
      
      let frontBodies:Array<K> = [];
      let ptA = body.bounds.anchor;
      let nearItems = this.bodiesNear(ptA, range);
      
      nearItems.forEach(bodyB => {
        let ptB = bodyB.bounds.anchor;
        let ang = Geom.normalizeAngle(0 - Geom.angleBetween(ptA.x, ptA.y, ptB.x, ptB.y) + Math.PI * 0.5);
        let angDelta = Geom.normalizeAngle(body.rotation - ang);
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