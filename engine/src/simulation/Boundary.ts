// Migrated from namespace Simulation to ES module
import { PolygonBody } from '../physics/PolygonBody';
import { Identifiable, IdentityService } from '../models/Identity';
import { IContactable } from '../physics/Contact';
import { IPoint } from '../geom/IGeom';

export class Boundary extends PolygonBody implements Identifiable, IContactable {
  public id: number;
  public contactMask: number;
  public resolveMask: number;

  constructor(vertices?: Array<IPoint>) {
    super(vertices);
    this.id = IdentityService.newIdentity();
    this.resolveMask = 0b11111111;
    this.contactMask = 0b11111111;
    this.segments.forEach(seg => {
      seg.id = IdentityService.newIdentity();
      seg.parentID = this.id;
    });
  }
}