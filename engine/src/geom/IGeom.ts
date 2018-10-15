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

  export interface IRectangle {
    x1:number;
    y1:number;
    x2:number;
    y2:number;
  }

  export interface ICircle {
    center:IPoint;
    radius:number;
  }

  export interface ISegment extends Models.IChild {
    ptA:IPoint;
    ptB:IPoint;
  }

  export interface IPolygon {
    vertices:Array<IPoint>;
    segments:Array<ISegment>;
    boundingBox:IRectangle;
    area:number;
    inverted:boolean;
  }

  export interface IRay {
    origin:IPoint;
    angle:number;
    project(len:number):IPoint;
  }

  export interface IPointHit extends Models.IChild {
    pt:IPoint;
    angle:number;
    dist:number;
  }

}