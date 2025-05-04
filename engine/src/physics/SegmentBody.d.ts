import { Ray } from '../geom/BaseGeom';
import { PointHit } from '../geom/Helpers';
import { IRayCastable } from '../geom/IGeom';
export interface ISegmentBody extends IRayCastable {
    isBoundary: boolean;
    cor: number;
    pressure: number;
}
export declare class SegmentBody implements ISegmentBody {
    ray: Ray;
    hits: PointHit[];
    isBoundary: boolean;
    cor: number;
    pressure: number;
    constructor();
    initWithOriginAndAngle(ox: number, oy: number, angle: number, length?: number, parentID?: number): void;
}
