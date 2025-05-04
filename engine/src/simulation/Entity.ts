// Migrated from namespace Simulation to ES module
import { BaseBody } from '../physics/Body';
import { Identifiable, IdentityService } from '../models/Identity';
import { IContactable } from '../physics/Contact';

export class Entity extends BaseBody implements Identifiable, IContactable {
  public id: number;
  public contactMask: number;
  public resolveMask: number;

  constructor() {
    super();
    this.id = IdentityService.newIdentity();
    this.resolveMask = 0b11111111;
    this.contactMask = 0b11111111;
  }
}