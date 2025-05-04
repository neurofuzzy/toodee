import { ITemporal } from './Temporal';
import { IChild } from '../models/Identity';
import { IPoint } from '../geom/IGeom';
export interface IParticle extends ITemporal, IChild {
    position: IPoint;
    velocity: IPoint;
    size: number;
    initWithPositionSizeAndLifespan(position: IPoint, size: number, lifespan: number): any;
}
export declare class BaseParticle implements IParticle {
    parentID: number;
    position: IPoint;
    velocity: IPoint;
    age: number;
    lifespan: number;
    size: number;
    constructor();
    initWithPositionSizeAndLifespan(position: IPoint, size?: number, lifespan?: number): this;
}
