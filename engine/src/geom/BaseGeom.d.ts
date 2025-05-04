import { IPoint, IBounds, IRectangle, ISegment, IPolygon, IRay } from './IGeom';
export declare class Bounds implements IBounds {
    anchor: IPoint;
    hw: number;
    hh: number;
    shape: number;
    constructor(x?: number, y?: number, hw?: number, hh?: number, shape?: number);
    clone(): IBounds;
}
export declare class Point implements IPoint {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    add(pt: IPoint): void;
    clone(): IPoint;
}
export declare class Ray implements IRay {
    id: number;
    parentID: number;
    ptA: IPoint;
    ptB: IPoint;
    protected _angle: number;
    protected _length: number;
    get angle(): number;
    set angle(val: number);
    get length(): number;
    set length(val: number);
    constructor(ox?: number, oy?: number, angle?: number, length?: number, parentID?: number);
    protected projectRay(): void;
    align(withPosition: IPoint, angle?: number): void;
    clone(): IRay;
}
export declare class Rectangle implements IRectangle {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    constructor(x1: number, x2: number, y1: number, y2: number);
    clone(): IRectangle;
}
export declare class Segment implements ISegment {
    id: number;
    parentID: number;
    ptA: IPoint;
    ptB: IPoint;
    constructor(ptA: IPoint, ptB: IPoint, parentID?: number);
    clone(): ISegment;
}
export declare class Polygon implements IPolygon {
    vertices: Array<IPoint>;
    segments: Array<ISegment>;
    boundingBox: IRectangle;
    area: number;
    inverted: boolean;
    constructor(vertices: Array<IPoint>);
    clone(): IPolygon;
}
