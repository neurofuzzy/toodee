namespace Geom {

  export interface IPoint {
    x:number;
    y:number;
  }

  export interface IBounds {
    anchor:IPoint;
    hw:number
    hh:number;
  }

}