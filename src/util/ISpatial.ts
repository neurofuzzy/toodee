namespace Util {

  export interface ISpatial {
    bounds:IRect;
    position:IPoint;
    rotation:number;
    initWithPositionAndSize(x:number, y:number, w:number, h:number):ISpatial;
  }

}