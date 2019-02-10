namespace Geom {

  export const SHAPE_ORTHO:number = 1;
  export const SHAPE_ROUND:number = 2;
  export const HIT_TYPE_SHAPE:number = 3;
  export const HIT_TYPE_SEGMENT:number = 4;

  export interface IPoint {
    x:number;
    y:number;
    add(pt:IPoint):void;
    clone():IPoint;
  }

  export interface IPtDist {
    pt:IPoint;
    dist:number;
    clone():IPtDist;
  }

  export interface IBounds {
    anchor:IPoint;
    hw:number
    hh:number;
    shape:number;
    clone():IBounds;
  }

  export interface IRectangle {
    x1:number;
    y1:number;
    x2:number;
    y2:number;
    clone():IRectangle;
  }

  export interface ICircle {
    center:IPoint;
    radius:number;
    clone():ICircle;
  }

  export interface ISegment extends Models.Identifiable, Models.IChild {
    ptA:IPoint;
    ptB:IPoint;
    clone():ISegment;
  }

  export interface IPolygon {
    vertices:Array<IPoint>;
    segments:Array<ISegment>;
    boundingBox:IRectangle;
    area:number;
    inverted:boolean;
    clone():IPolygon;
  }

  export interface IRay extends ISegment {
    angle:number;
    length:number;
    align(withPosition:IPoint, angle?:number);
    clone():IRay;
  }

  export interface IPointHit extends Models.IChild {
    pt:IPoint;
    angle:number;
    dist:number;
    type:number;
    clone():IPointHit;
  }

  export interface IRayCastable {
    ray:IRay;
    hits:IPointHit[];
  }

}