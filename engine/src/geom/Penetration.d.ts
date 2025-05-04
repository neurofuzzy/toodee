import { IPoint, IBounds } from './IGeom';
interface IConstraints {
    lockX?: boolean;
    lockY?: boolean;
}
export declare function resolvePenetrationBetweenBounds(bA: IBounds, bB: IBounds, cA: IConstraints, cB: IConstraints, useShapes?: boolean): IPoint;
export declare function getPenetrationSegmentRound(segPtA: IPoint, segPtB: IPoint, b: IBounds, resolve: boolean, twoSidedSegment?: boolean): IPoint;
export {};
