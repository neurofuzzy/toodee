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

}