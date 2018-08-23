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

  export class BaseBody extends BaseSpatial {

    public constraints:IConstraints;

    public initWithBoundsAndConstraints(bounds:IBounds, constraints:IConstraints):any {

      this.bounds = bounds;
      this.constraints = constraints;

      return this;

    }

  }

}