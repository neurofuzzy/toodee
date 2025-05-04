import { BaseCollection } from '../models/BaseCollection';
import { ChildCollection } from '../models/ChildCollection';
import { Entity } from './Entity';
import { Projectile } from './Projectile';
import { Boundary } from './Boundary';
import { Beam } from './Beam';
import { Ray } from '../geom/BaseGeom';
import { PointHit } from '../geom/Helpers';
export declare class Model {
    bodies: BaseCollection<Entity>;
    projectiles: BaseCollection<Projectile>;
    boundaries: BaseCollection<Boundary>;
    beams: ChildCollection<Beam>;
    ray: Ray;
    rayHit: PointHit;
    init(): this;
}
