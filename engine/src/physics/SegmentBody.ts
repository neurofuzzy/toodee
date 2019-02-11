/// <reference path="../geom/BaseGeom.ts" />

namespace Physics {

  export interface ISegmentBody extends Geom.IRayCastable {
    isBoundary:boolean;
    cor:number;
    pressure:number;
  }

  export class SegmentBody implements ISegmentBody {

    public ray:Geom.Ray;
    public hits:Geom.PointHit[];
    public isBoundary:boolean;
    public cor:number;
    public pressure:number;

    constructor () {

      this.isBoundary = false;
      this.cor = 1;
      this.pressure = 0.1;

    }

    public initWithOriginAndAngle (ox:number, oy:number, angle:number, length?:number, parentID?:number) {

      this.ray = new Geom.Ray(ox, oy, angle, length, parentID);

    }

  }

}