/// <reference path="../physics/Particle.ts" />

namespace Models {

  export class Projectile extends Physics.BaseParticle implements Util.Identifiable {

    public id:number;

    constructor () {

      super();

      this.id = Util.IdentityService.newIdentity();

    }    

  }

}