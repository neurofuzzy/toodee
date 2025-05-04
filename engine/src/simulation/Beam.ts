// Migrated from namespace Simulation to ES module
import { SegmentBody } from '../physics/SegmentBody';
import { Identifiable, IChild, IdentityService } from '../models/Identity';
import { IContactable } from '../physics/Contact';
import { Ray } from '../geom/BaseGeom';

export class Beam extends SegmentBody implements Identifiable, IChild, IContactable {
  public id: number;
  public parentID: number;
  public constrainRotationToParent: boolean;
  public isSoft: boolean;
  public contactMask: number;
  public resolveMask: number;

  constructor() {
    super();
    this.id = IdentityService.newIdentity();
    this.resolveMask = 0b11111111;
    this.contactMask = 0b11111111;
  }

  public initWithOriginAndAngle(ox: number, oy: number, angle: number, length?: number, parentID?: number) {
    this.parentID = parentID;
    this.ray = new Ray(ox, oy, angle, length, this.id);
  }
}