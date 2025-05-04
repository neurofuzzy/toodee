// Migrated from namespace Physics to ES module
import { IBounds, IPoint } from '../geom/IGeom';
import { BaseSpatial } from '../geom/BaseSpatial';

export interface IBody {
  bounds: IBounds;
  velocity: IPoint;
  cor: number;
  constraints: any;
  initWithBoundsAndConstraints(bounds: IBounds, constraints: any): any;
}

export class BaseBody extends BaseSpatial implements IBody {
  public velocity: IPoint;
  public cor: number;
  public constraints: any;

  public initWithBoundsAndConstraints(bounds: IBounds, constraints: any): this {
    this.initWithBounds(bounds);
    this.constraints = constraints;
    this.velocity = { x: 0, y: 0 } as IPoint;
    this.cor = 1;
    return this;
  }
}