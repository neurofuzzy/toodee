/// <reference path="../geom/BaseSpatial.ts" />

namespace Physics {

  export interface IBody extends Geom.ISpatial {
    constraints:Geom.IConstraints;
    velocity:Geom.IPoint;
    cor:number;
    initWithBoundsAndConstraints(bounds:Geom.IBounds, constraints:Geom.IConstraints):any;
  }

  export class BaseBody extends Geom.BaseSpatial implements IBody {
  
    public constraints:Geom.IConstraints;
    public velocity:Geom.IPoint;
    public cor:number;

    public initWithBoundsAndConstraints(bounds:Geom.IBounds, constraints:Geom.IConstraints):any {

      this.initWithBounds(bounds);
      this.constraints = constraints;
      this.velocity = new Geom.Point();
      this.cor = 1;

      return this;

    }

  }

}