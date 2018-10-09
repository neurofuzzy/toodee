namespace Util.Geom {

  export interface ISpatial {
    bounds:IBounds;
    rotation:number;
    initWithBounds(bounds:IBounds):any;
  }

}