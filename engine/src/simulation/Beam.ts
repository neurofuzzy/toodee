/// <reference path="../physics/SegmentBody.ts" />

namespace Simulation {

  export class Beam extends Physics.SegmentBody implements Models.Identifiable, Models.IChild, Physics.IContactable {

    public id:number;
    public parentID:number;
    public constrainRotationToParent:boolean

    public contactMask:number;
    public resolveMask:number;

    constructor () {

      super();

      this.id = Models.IdentityService.newIdentity();
      this.resolveMask = 0b11111111;
      this.contactMask = 0b11111111;

    }

    public initWithOriginAndAngle (ox:number, oy:number, angle:number, length?:number, parentID?:number) {

      this.parentID = parentID;
      this.ray = new Geom.Ray(ox, oy, angle, length, this.id);

    }

  }

}