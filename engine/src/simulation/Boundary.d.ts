import { PolygonBody } from '../physics/PolygonBody';
import { Identifiable } from '../models/Identity';
import { IContactable } from '../physics/Contact';
import { IPoint, IPolygon, IRectangle, ISegment } from '../geom/IGeom';
export declare class Boundary extends PolygonBody implements Identifiable, IContactable, IPolygon {
    id: number;
    bounds: any;
    area: number;
    vertices: Array<IPoint>;
    segments: Array<ISegment>;
    boundingBox: IRectangle;
    inverted: boolean;
    resolveMask: number;
    contactMask: number;
    constructor(vertices?: Array<IPoint>);
    clone(): IPolygon;
}
