// Migrated from namespace Geom to ES module
import { IBounds } from './IGeom';

export class BaseSpatial {
  public bounds!: IBounds;
  public rotation!: number;

  constructor() {}

  public initWithBounds(bounds: IBounds): this {
    this.bounds = bounds;
    this.rotation = 0;
    return this;
  }
}