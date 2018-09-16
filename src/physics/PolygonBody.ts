namespace Physics {

  export interface IPolygonBody extends Geom.IPolygon {
    isSector:boolean;
  }

  export class PolygonBody extends Geom.Polygon implements IPolygonBody {

    public isSector:boolean;

    constructor (vertices:Array<Geom.IPoint>) {

      super(vertices);

    }

  }

}