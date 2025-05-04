// Migrated from namespace Physics to ES module
import { Ray } from '../geom/BaseGeom';
import { PointHit } from '../geom/Helpers';
import { IRayCastable, IPoint, ISegment } from '../geom/IGeom';
import { SHAPE_ORTHO, SHAPE_ROUND } from '../geom/Helpers';

export interface ISegmentBody extends IRayCastable {
  isBoundary: boolean;
  cor: number;
  pressure: number;
}

export class SegmentBody implements ISegmentBody {
  public ray: Ray;
  public hits: PointHit[];
  public isBoundary: boolean;
  public cor: number;
  public pressure: number;

  constructor() {
    this.isBoundary = false;
    this.cor = 1;
    this.pressure = 0.1;
  }

  public initWithOriginAndAngle(ox: number, oy: number, angle: number, length?: number, parentID?: number) {
    this.ray = new Ray(ox, oy, angle, length, parentID);
  }
}