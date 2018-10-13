/// <reference path="../lib/physics/PolygonBody.ts" />

namespace Simulation {

  export class Boundary extends Physics.PolygonBody implements Util.Identifiable, Physics.IContactable {
    
    public id:number;

    public contactMask:number;
    public resolveMask:number;

    constructor (vertices?:Array<Geom.IPoint>) {

      super(vertices);

      this.id = Util.IdentityService.newIdentity();
      this.resolveMask = 0b11111111;
      this.contactMask = 0b11111111;

      this.segments.forEach(seg => {
        seg.parentID = this.id;
      });

    }

  }

}