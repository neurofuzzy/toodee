import { BaseParticle } from '../physics/Particle';
import { Identifiable } from '../models/Identity';
import { IContactable } from '../physics/Contact';
export declare class Projectile extends BaseParticle implements Identifiable, IContactable {
    id: number;
    contactMask: number;
    resolveMask: number;
    constructor();
}
