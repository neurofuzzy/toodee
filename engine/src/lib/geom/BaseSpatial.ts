namespace Geom {

  export class BaseSpatial implements ISpatial {

    public bounds:IBounds;
    public rotation:number;

    constructor () {

    }

    public initWithBounds(bounds:IBounds):any {

      this.bounds = bounds;
      this.rotation = 0;

      return this;

    }

  }

}