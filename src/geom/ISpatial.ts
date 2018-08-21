namespace Geom {

  export interface ISpatial {
    bounds:IBounds;
    rotation:number;
    initWithBounds(x:number, y:number, hw:number, hh:number, r:number):any;
  }

}