namespace Util {

  export class Rectangle implements IRectangle {

    public x:number;
    public y:number;
    public w:number;
    public h:number;

    public initWithSize (x:number = 0, y:number = 0, w:number = 0, h:number = 0):IRectangle {

      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;

      return this;

    }

  }

  export class Point2d implements IPoint2d {

    public x:number;
    public y:number;

    public initWithPosition (x:number = 0, y:number = 0):IPoint2d {

      this.x = x;
      this.y = y;

      return this;

    }

  }

  export class SpatialItem implements ISpatial {

    public bounds:IRectangle;
    public position:IPoint2d;
    public rotation:number;

    constructor () {
    }

    public initWithPositionAndSize (x:number = 0, y:number = 0, w:number = 0, h:number = 0, r:number = 0):ISpatial {

      this.bounds = new Rectangle().initWithSize(0 - w * 0.5, 0 - h * 0.5, w, h);
      this.position = new Point2d().initWithPosition(x, y);
      this.rotation = r;

      return this;

    }

  }

}