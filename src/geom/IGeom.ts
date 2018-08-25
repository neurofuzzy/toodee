namespace Geom {

  export const SHAPE_ORTHO:number = 1;
  export const SHAPE_ROUND:number = 2;

  export interface IPoint {
    x:number;
    y:number;
  }

  export interface IPtDist {
    pt:IPoint;
    dist:number;
  }

  export interface IBounds {
    anchor:IPoint;
    hw:number
    hh:number;
    shape:number;
  }

  export interface IPolygon {
    points:Array<IPoint>;
    isClosed:boolean;
  }

  export interface ISegment {
    ptA:IPoint;
    ptB:IPoint;
  }

  export interface IRay {
    origin:IPoint;
    angle:number;
  }

}