import { Polygon } from '../geom/BaseGeom';
import { IPolygon, IPoint } from '../geom/IGeom';
export interface IPolygonBody extends IPolygon {
    isSector: boolean;
    drag: number;
    cor: number;
}
export declare class PolygonBody extends Polygon implements IPolygonBody {
    isSector: boolean;
    drag: number;
    cor: number;
    constructor(vertices: Array<IPoint>);
}
