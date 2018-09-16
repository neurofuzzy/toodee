namespace Physics {

  export interface IPolygonBody extends Geom.IPolygon {
    isSector:boolean;
    drag:number;
  }

  export class PolygonBody extends Geom.Polygon implements IPolygonBody {

    public isSector:boolean;
    public drag:number;

    constructor (vertices:Array<Geom.IPoint>, drag:number = 0) {

      super(vertices);

      this.drag = drag;

    }

  }

}