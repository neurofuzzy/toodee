import { IPoint, IBounds, IRectangle, ISegment, IPolygon, IRay, ICircle, IPointHit } from './IGeom';
import { pointWithinBounds, boundsWithinBounds, boundsIntersect, pointWithinRectangle, rectangleWithinRectangle, rectIntersectsRect, distanceBetween, distanceBetweenSquared, angleBetween, xyToAngle, orthoRoundBoundsIntersect, rotatePointDeg, rotatePoint, scalePoint, lerp, lerpDist, normalizePoint, maxPoint, normalizeAngle, normalizeAngleDeg, dot, length, cross, sub, add, closestPtPointLine, ccw, lineIntersectsLine, lineLineIntersect, lineSide, boundsLineIntersect, circleLineIntersect, rectLineIntersect, cellCoordsAlongLine, cellCoordsAlongLineWithThickness, cellCoordsContainingPolygon, cellCoordsIntersectingCircle, polygonArea, polygonIsClockwise, linePolygonIntersect, pointInPolygon, polygonInPolygon } from './Helpers';
import { SHAPE_ORTHO, SHAPE_ROUND, HIT_TYPE_SHAPE } from './Helpers';
import { IdentityService } from '../models/Identity';

export class Bounds implements IBounds {
  public anchor: IPoint;
  public hw: number;
  public hh: number;
  public shape: number;

  constructor(x: number = 0, y: number = 0, hw: number = 0, hh: number = 0, shape: number = 0) {
    this.anchor = new Point(x, y);
    this.hw = hw;
    this.hh = hh;
    this.shape = shape;
  }

  public clone(): IBounds {
    return new Bounds(this.anchor.x, this.anchor.y, this.hw, this.hh, this.shape);
  }
}

export class Point implements IPoint {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public add(pt: IPoint): void {
    this.x += pt.x;
    this.y += pt.y;
  }

  public clone(): IPoint {
    return new Point(this.x, this.y);
  }
}

export class Ray implements IRay {
  public id!: number;
  public parentID: number;
  public ptA: IPoint;
  public ptB: IPoint;
  protected _angle: number;
  protected _length: number;

  get angle(): number {
    return this._angle;
  }
  set angle(val: number) {
    if (val != this._angle) {
      this._angle = normalizeAngle(val);
      this.projectRay();
    }
  }

  get length(): number {
    return this._length;
  }
  set length(val: number) {
    if (val != this._length) {
      this._length = Math.max(0, val);
      this.projectRay();
    }
  }

  constructor(ox: number = 0, oy: number = 0, angle: number = 0, length: number = 100, parentID: number = -1) {
    this.ptA = new Point(ox, oy);
    this.ptB = new Point(ox, oy);
    this._angle = angle;
    this._length = length;
    this.parentID = parentID;
    this.projectRay();
  }

  protected projectRay(): void {
    this.ptB.x = this.ptA.x + this.length * Math.sin(this.angle);
    this.ptB.y = this.ptA.y + this.length * Math.cos(this.angle);
  }

  public align(withPosition: IPoint, angle: number = this.angle): void {
    this.ptA.x = withPosition.x;
    this.ptA.y = withPosition.y;
    this.angle = angle;
    this.projectRay();
  }

  public clone(): IRay {
    return new Ray(this.ptA.x, this.ptA.y, this.angle, this.length, this.parentID);
  }
}

export class Rectangle implements IRectangle {
  public x1: number;
  public x2: number;
  public y1: number;
  public y2: number;

  constructor(x1: number, x2: number, y1: number, y2: number) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }

  public clone(): IRectangle {
    return new Rectangle(this.x1, this.x2, this.y1, this.y2);
  }
}

export class Segment implements ISegment {
  public id!: number;
  public parentID: number;
  public ptA: IPoint;
  public ptB: IPoint;

  constructor(ptA: IPoint, ptB: IPoint, parentID: number = -1) {
    this.ptA = ptA;
    this.ptB = ptB;
    this.parentID = parentID;
  }

  public clone(): ISegment {
    return new Segment(this.ptA.clone(), this.ptB.clone(), this.parentID);
  }
}

export class Polygon implements IPolygon {
  public id: number;
  public bounds: any;
  public vertices: Array<IPoint>;
  public segments: Array<ISegment>;
  public boundingBox: IRectangle;
  public area: number;
  public inverted: boolean;

  constructor(vertices: Array<IPoint>) {
    this.id = IdentityService.newIdentity();
    this.bounds = null; // TODO: set to actual bounds if available
    this.vertices = vertices;
    this.segments = [];
    this.boundingBox = new Rectangle(100000, -100000, 100000, -100000);
    let b = this.boundingBox;
    for (var i = 0; i < vertices.length; i++) {
      let ptA = vertices[i];
      let ptB = vertices[(i + 1) % vertices.length];
      let seg = new Segment(ptA, ptB);
      this.segments.push(seg);
      b.x1 = Math.min(ptA.x, b.x1);
      b.x2 = Math.max(ptA.x, b.x2);
      b.y1 = Math.min(ptA.y, b.y1);
      b.y2 = Math.max(ptA.y, b.y2);
    }
    this.area = Math.abs(polygonArea(this.vertices));
    this.inverted = polygonIsClockwise(this.vertices);
  }

  public clone(): IPolygon {
    var v = this.vertices.concat();
    return new Polygon(v);
  }
}