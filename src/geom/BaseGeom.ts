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

  export class Segment implements ISegment {

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

    public segments:Array<ISegment>

    constructor (vertices?:Array<IPoint>) {

      this.segments = [];

      if (vertices != null) {

        for (var i = 0; i < vertices.length; i++) {

          let ptA = vertices[i];
          let ptB = vertices[(i + 1) % vertices.length];
          let seg = new Segment(ptA, ptB);

          this.segments.push(seg);

        }

      }

    }

  }

  export class Ray implements IRay {

    public origin:IPoint;
    public angle:number;

    constructor (ox:number = 0, oy:number = 0, angle:number) {

      this.origin = new Point(ox, oy);
      this.angle = angle;

    }

  }

}