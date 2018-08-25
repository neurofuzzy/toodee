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

    public ptA:IPoint;
    public ptB:IPoint;

    constructor (xA:number = 0, yA:number = 0, xB:number = 0, yB:number = 0) {

      this.ptA = new Point(xA, yA);
      this.ptB = new Point(xB, yB);

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