/// <reference path="../geom/BaseGeom.ts" />

namespace Physics {

  export interface IPolygonBody extends Geom.IPolygon {
    isSector:boolean;
    drag:number;
    cor:number;
  }

  export class PolygonBody extends Geom.Polygon implements IPolygonBody {

    public isSector:boolean;
    public drag:number;
    public cor:number;

    constructor (vertices:Array<Geom.IPoint>) {

      super(vertices);
      this.drag = 0.01;
      this.cor = 1;

    }

  }

}