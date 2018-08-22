namespace Geom {

  export interface ISpatial {
    bounds:IBounds;
    rotation:number;
    initWithBounds(bounds:IBounds, r:number):any;
  }

  export interface IBody extends ISpatial {
    rigid:boolean;
  }

}