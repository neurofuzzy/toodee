namespace Geom {

  export class Bounds implements IBounds {

    public anchor:IPoint;
    public hw:number;
    public hh:number;
    public shape:number;

    constructor (x:number = 0, y:number = 0, hw:number = 0, hh:number = 0, shape:number = SHAPE_ORTHO) {

      this.anchor = new Point(x, y);
      this.hw = hw;
      this.hh = hh;
      this.shape = shape;

    }

  }

  export class Point implements IPoint {

    public x:number;
    public y:number;

    constructor (x:number = 0, y:number = 0) {

      this.x = x;
      this.y = y;

    }

  }

  export class Ray implements IRay {

    public origin:IPoint;
    public angle:number;

    constructor (ox:number = 0, oy:number = 0, angle:number = 0) {

      this.origin = new Point(ox, oy);
      this.angle = angle;

    }

    public project (len:number):IPoint {

      let pt = new Point();

      pt.x = this.origin.x + len * Math.sin(this.angle);
      pt.y = this.origin.y + len * Math.cos(this.angle);

      return pt;

    }

  }

  export class Segment implements ISegment {

    public id:number;
    public parentID:number;
    public ptA:IPoint;
    public ptB:IPoint;

    constructor (ptA:IPoint, ptB:IPoint, parentID:number = -1) {

      this.ptA = ptA;
      this.ptB = ptB;
      this.parentID = parentID;

    }

  }

  export class Polygon implements IPolygon {

    public vertices:Array<IPoint>
    public segments:Array<ISegment>
    public boundingBox:IRectangle;
    public area:number;
    public inverted:boolean;

    constructor (vertices:Array<IPoint>) {

      this.vertices = vertices;
      this.segments = [];
      this.boundingBox = { x1: 100000, x2: -100000, y1: 100000, y2: -100000 }

      let b = this.boundingBox;

      for (var i = 0; i < vertices.length; i++) {

        let ptA = vertices[i];
        let ptB = vertices[(i + 1) % vertices.length];
        let seg = new Segment(ptA, ptB);

        this.segments.push(seg);

        b.x1 = Math.min(ptA.x, b.x1);
        b.x2 = Math.max(ptA.x, b.x2);
        b.y1 = Math.min(ptA.y, b.y1);
        b.y2 = Math.max(ptA.y, b.y2);

      }

      this.area = Math.abs(polygonArea(this.vertices));
      this.inverted = polygonIsClockwise(this.vertices);

    }

  }

  export class PointHit implements IPointHit {

    public parentID:number;
    public pt:IPoint;
    public angle:number;
    public dist:number;

    constructor (origin:IPoint, hitPoint:IPoint, parentID:number = -1) {

      this.pt = hitPoint;
      this.angle = angleBetween(origin.x, origin.y, hitPoint.x, hitPoint.y);
      this.dist = distanceBetween(origin.x, origin.y, hitPoint.x, hitPoint.y);
      this.parentID = parentID;

    }

    static sort (ptHits:Array<PointHit>) {
      ptHits.sort(function (a, b) {
        if (a.dist > b.dist) {
          return 1;
        } else if (a.dist < b.dist) {
          return -1;
        }
        return 0;
      })
    }

  }

}