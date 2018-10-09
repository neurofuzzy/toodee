/// <reference path="../util/geom/BaseGeom.ts" />

namespace Physics {

  export interface IPolygonBody extends Util.Geom.IPolygon {
    isSector:boolean;
    drag:number;
  }

  export class PolygonBody extends Util.Geom.Polygon implements IPolygonBody {

    public isSector:boolean;
    public drag:number;

    constructor (vertices:Array<Util.Geom.IPoint>) {

      super(vertices);
      this.drag = 0;

    }

  }

}