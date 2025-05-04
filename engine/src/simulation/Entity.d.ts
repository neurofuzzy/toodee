import { BaseBody } from '../physics/Body';
import { Identifiable } from '../models/Identity';
import { IContactable } from '../physics/Contact';
export declare class Entity extends BaseBody implements Identifiable, IContactable {
    id: number;
    contactMask: number;
    resolveMask: number;
    constructor();
}
