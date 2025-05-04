import { SegmentBody } from '../physics/SegmentBody';
import { Identifiable, IChild } from '../models/Identity';
import { IContactable } from '../physics/Contact';
export declare class Beam extends SegmentBody implements Identifiable, IChild, IContactable {
    id: number;
    parentID: number;
    constrainRotationToParent: boolean;
    isSoft: boolean;
    contactMask: number;
    resolveMask: number;
    constructor();
    initWithOriginAndAngle(ox: number, oy: number, angle: number, length?: number, parentID?: number): void;
}
