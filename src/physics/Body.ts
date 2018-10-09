/// <reference path="../util/geom/BaseSpatial.ts" />

namespace Physics {

  export interface IBody extends Util.Geom.ISpatial {
    constraints:Util.Geom.IConstraints;
    velocity:Util.Geom.IPoint;
    initWithBoundsAndConstraints(bounds:Util.Geom.IBounds, constraints:Util.Geom.IConstraints):any;
  }

  export class BaseBody extends Util.Geom.BaseSpatial implements IBody {
  
    public constraints:Util.Geom.IConstraints;
    public velocity:Util.Geom.IPoint;

    public initWithBoundsAndConstraints(bounds:Util.Geom.IBounds, constraints:Util.Geom.IConstraints):any {

      this.initWithBounds(bounds);
      this.constraints = constraints;
      this.velocity = new Util.Geom.Point();

      return this;

    }

  }

}