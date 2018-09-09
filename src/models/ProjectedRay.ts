namespace Models {

  export class ProjectedRay extends Geom.Ray {

    public endPt:Geom.IPoint;

    constructor (ox:number = 0, oy:number = 0, angle:number = 0) {

      super(ox, oy, angle);

      this.endPt = new Geom.Point();

    }

  }

}