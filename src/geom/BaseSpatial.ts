namespace Geom {

  export class BaseSpatial implements ISpatial {

    public bounds:IRect;
    public position:IPoint;
    public rotation:number;

    constructor () {
    }

    public initWithPositionAndSize (x:number = 0, y:number = 0, w:number = 0, h:number = 0, r:number = 0):ISpatial {

      this.bounds = new Rect(0 - w * 0.5, 0 - h * 0.5, w, h);
      this.position = new Point(x, y);
      this.rotation = r;

      return this;

    }

  }

}