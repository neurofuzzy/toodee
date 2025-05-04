import { PolygonBody } from '../physics/PolygonBody';
import { Identifiable } from '../models/Identity';
import { IContactable } from '../physics/Contact';
import { IPoint } from '../geom/IGeom';
export declare class Boundary extends PolygonBody implements Identifiable, IContactable {
    id: number;
    contactMask: number;
    resolveMask: number;
    constructor(vertices?: Array<IPoint>);
}
