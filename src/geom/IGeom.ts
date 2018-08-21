namespace Geom {

  export interface IPoint {
    x:number;
    y:number;
  }

  export interface IPoint {
    x: number;
    y: number;
  }

  export interface IRect extends IPoint {
    w: number;
    h: number;
  }

  export interface IAreaRect extends IRect {
    area: number;
  }

  export interface IBounds extends IRect {
    size: number;
  }

}