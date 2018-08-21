namespace Util {

  export interface IRectangle {
    x:number;
    y:number;
    w:number;
    h:number;
    initWithSize(x:number, y:number, w:number, h:number):IRectangle;
  }

  export interface IPoint2d {
    x:number;
    y:number;
    initWithPosition (x:number, y:number):IPoint2d;
  }

  export interface ISpatial {
    bounds:IRectangle;
    position:IPoint2d;
    rotation:number;
    initWithPositionAndSize(x:number, y:number, w:number, h:number):ISpatial;
  }

}