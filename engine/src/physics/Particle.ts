// Migrated from namespace Physics to ES module
import { ITemporal } from './Temporal';
import { IChild } from '../models/Identity';
import { IPoint } from '../geom/IGeom';
import { Point } from '../geom/BaseGeom';

export interface IParticle extends ITemporal, IChild {
  position: IPoint;
  velocity: IPoint;
  size: number;
  initWithPositionSizeAndLifespan(position: IPoint, size: number, lifespan: number): any;
}

export class BaseParticle implements IParticle {
  public parentID: number;
  public position: IPoint;
  public velocity: IPoint;
  public age: number;
  public lifespan: number;
  public size: number;

  constructor() {
    this.parentID = -1;
    this.position = new Point();
    this.velocity = new Point();
    this.age = 0;
    this.lifespan = 0;
    this.size = 0;
  }

  public initWithPositionSizeAndLifespan(position: IPoint, size: number = 0, lifespan: number = 0): this {
    this.position = position;
    this.velocity = new Point();
    this.size = size;
    this.age = 0;
    this.lifespan = lifespan;
    return this;
  }
}