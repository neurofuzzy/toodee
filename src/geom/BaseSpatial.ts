namespace Geom {

  export class BaseSpatial implements ISpatial {

    public bounds:IBounds;
    public rotation:number;

    constructor () {
    }

    public initWithBounds(bounds:IBounds, r:number = 0):any {

      this.bounds = bounds;
      this.rotation = r;

      return this;

    }

  }

  export class BaseBody extends BaseSpatial {



  }

}