namespace Geom {

  export const SHAPE_ORTHO:number = 1;
  export const SHAPE_ROUND:number = 2;

  export interface IPoint {
    x:number;
    y:number;
  }

  export interface IBounds {
    anchor:IPoint;
    hw:number
    hh:number;
    shape:number;
  }

}