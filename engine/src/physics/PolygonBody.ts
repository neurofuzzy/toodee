// Migrated from namespace Physics to ES module
import { Polygon } from '../geom/BaseGeom';
import { IPolygon, IPoint } from '../geom/IGeom';
import { SHAPE_ORTHO, SHAPE_ROUND } from '../geom/Helpers';

export interface IPolygonBody extends IPolygon {
  isSector: boolean;
  drag: number;
  cor: number;
}

export class PolygonBody extends Polygon implements IPolygonBody {
  public isSector!: boolean;
  public drag: number;
  public cor: number;

  constructor(vertices: Array<IPoint>) {
    super(vertices);
    this.drag = 0.01;
    this.cor = 1;
  }
}