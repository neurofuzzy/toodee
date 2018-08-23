namespace Geom {

  export interface ISpatial {
    bounds:IBounds;
    rotation:number;
    initWithBounds(bounds:IBounds):any;
  }

  export interface IBody extends ISpatial {
    constraints:IConstraints;
    initWithBoundsAndConstraints(bounds:IBounds, constraints:IConstraints):any;
  }

}