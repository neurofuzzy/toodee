namespace Geom {

  export class BaseSpatial implements ISpatial {

    public bounds:IBounds;
    public rotation:number;

    constructor () {
    }

    public initWithBounds(x:number = 0, y:number = 0, hw:number = 0, hh:number = 0, r:number = 0):any {

      this.bounds = new Bounds(x, y, hw, hh);
      this.rotation = r;

      return this;

    }

  }

}