import { IBounds } from './IGeom';
export declare class BaseSpatial {
    bounds: IBounds;
    rotation: number;
    constructor();
    initWithBounds(bounds: IBounds): this;
}
