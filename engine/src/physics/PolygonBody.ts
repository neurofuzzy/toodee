// Migrated from namespace Physics to ES module
import { Polygon } from '../geom/BaseGeom';
import { IPolygon, IPoint } from '../geom/IGeom';
import { SHAPE_ORTHO, SHAPE_ROUND } from '../geom/Helpers';
import { IdentityService } from '../models/Identity';

export interface IPolygonBody extends IPolygon {
  isSector: boolean;
  drag: number;
  cor: number;
}

export class PolygonBody extends Polygon implements IPolygonBody {
  public id: number;
  public bounds: any;
  public isSector!: boolean;
  public drag: number;
  public cor: number;

  constructor(vertices: Array<IPoint>) {
    super(vertices);
    this.id = typeof IdentityService !== 'undefined' ? IdentityService.newIdentity() : Math.random();
    this.bounds = null; // TODO: set to actual bounds if available
    this.drag = 0.01;
    this.cor = 1;
  }
}