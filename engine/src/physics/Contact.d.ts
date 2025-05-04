import { IPoint, IPointHit, ISegment } from '../geom/IGeom';
import { BaseBody } from './Body';
export interface IContactable {
    contactMask: number;
    resolveMask: number;
}
export declare class IContact<B> {
    penetration: IPoint;
    itemA: BaseBody;
    itemB: B;
}
export declare class BaseContact<B> implements IContact<B> {
    penetration: IPoint;
    itemA: BaseBody;
    itemB: B;
    corAB: number;
    constructor(penetration: IPoint, itemA: BaseBody, itemB: B, corAB?: number);
}
export declare class BodyBodyContact extends BaseContact<BaseBody> {
}
export declare class BodySegmentBodyContact extends BaseContact<any> {
    hitPoint: IPointHit;
}
export declare class BodyBoundaryContact extends BaseContact<ISegment> {
}
export declare function resolveContact(contact: IContact<BaseBody | ISegment | any>): void;
