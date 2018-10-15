/// <reference path="../physics/Particle.ts" />

namespace Simulation {

  export class Projectile extends Physics.BaseParticle implements Models.Identifiable, Physics.IContactable {

    public id:number;

    public contactMask:number;
    public resolveMask:number;

    constructor () {

      super();

      this.id = Models.IdentityService.newIdentity();
      this.resolveMask = 0b11111111;
      this.contactMask = 0b11111111;

    }    

  }

}