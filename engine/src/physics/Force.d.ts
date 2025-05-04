import { IImpulse } from './Impulse';
import { ITemporal } from '../models/Events';
import { IChild } from '../models/IChild';
import { IPoint } from '../geom/IGeom';
export interface IForce extends IImpulse, ITemporal, IChild {
}
export declare class Impulse implements IImpulse {
    power: number;
    angle: number;
    constructor(power: number, angle?: number);
}
export declare class Force extends Impulse implements IForce {
    parentID: number;
    age: number;
    lifespan: number;
    constructor(power: number, angle?: number, lifespan?: number);
}
export declare class PropulsionForce extends Force {
    initWithParentID(parentID: number): PropulsionForce;
}
export declare class ProximityForce extends Force {
    origin: IPoint;
    range: number;
    initWithOriginAndRange(origin: IPoint, range?: number): ProximityForce;
}
export declare class AreaForce extends Force {
    initWithParentID(parentID: number): AreaForce;
}
