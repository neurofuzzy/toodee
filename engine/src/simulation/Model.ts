// Migrated from namespace Simulation to ES module
import { BaseCollection } from '../models/BaseCollection';
import { ChildCollection } from '../models/ChildCollection';
import { Entity } from './Entity';
import { Projectile } from './Projectile';
import { Boundary } from './Boundary';
import { Beam } from './Beam';
import { Ray } from '../geom/BaseGeom';
import { PointHit } from '../geom/Helpers';

export class Model {
  public bodies: BaseCollection<Entity>;
  public projectiles: BaseCollection<Projectile>;
  public boundaries: BaseCollection<Boundary>;
  public beams: ChildCollection<Beam>;
  public ray: Ray;
  public rayHit: PointHit;

  public init(): this {
    this.boundaries = new BaseCollection<Boundary>().init();
    this.projectiles = new BaseCollection<Projectile>().init();
    this.bodies = new BaseCollection<Entity>().init();
    this.beams = new ChildCollection<Beam>().init();
    this.ray = new Ray();
    return this;
  }
}