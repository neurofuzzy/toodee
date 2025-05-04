// Interfaces
export interface IPoint {
  x: number;
  y: number;
  add(pt: IPoint): void;
  clone(): IPoint;
}

export interface IPtDist {
  pt: IPoint;
  dist: number;
  clone(): IPtDist;
}

export interface IBounds {
  anchor: IPoint;
  hw: number;
  hh: number;
  shape: number;
  clone(): IBounds;
}

export interface IRectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  clone(): IRectangle;
}

export interface ICircle {
  center: IPoint;
  radius: number;
  clone(): ICircle;
}

// Forward declarations for cross-module types
import type { Identifiable, IChild } from '../models/Identity';

export interface ISegment extends Identifiable, IChild {
  ptA: IPoint;
  ptB: IPoint;
  clone(): ISegment;
}

export interface IPolygonBase {
  id: number;
  bounds: any;
  area?: number;
}

export interface IPolygon extends IPolygonBase {
  vertices: Array<IPoint>;
  segments: Array<ISegment>;
  boundingBox: IRectangle;
  inverted: boolean;
  clone(): IPolygon;
}

export interface IRay extends ISegment {
  angle: number;
  length: number;
  align(withPosition: IPoint, angle?: number): void;
  clone(): IRay;
}

export interface IPointHit extends IChild {
  pt: IPoint;
  angle: number;
  dist: number;
  type: number;
  clone(): IPointHit;
}

export interface IRayCastable {
  ray: IRay;
  hits: IPointHit[];
}