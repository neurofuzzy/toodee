import { IBounds, IPoint } from '../geom/IGeom';
import { BaseSpatial } from '../geom/BaseSpatial';
export interface IBody {
    bounds: IBounds;
    velocity: IPoint;
    cor: number;
    constraints: any;
    initWithBoundsAndConstraints(bounds: IBounds, constraints: any): any;
}
export declare class BaseBody extends BaseSpatial implements IBody {
    velocity: IPoint;
    cor: number;
    constraints: any;
    initWithBoundsAndConstraints(bounds: IBounds, constraints: any): this;
}
