/// <reference path="../geom/BaseGeom.ts" />

namespace Physics {

  export interface ISegmentBody extends Geom.IRayCastable {
    isBoundary:boolean;
    cor:number;
  }

  export class SegmentBody implements ISegmentBody {

    public ray:Geom.Ray;
    public hits:Geom.PointHit[];
    public isBoundary:boolean;
    public cor:number;

    constructor () {

    }

    public initWithOriginAndAngle (ox:number, oy:number, angle:number) {

      this.ray = new Geom.Ray(ox, oy, angle);

    }

  }

}