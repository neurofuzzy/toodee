/// <reference path="../lib/physics/Body.ts" />

namespace Simulation {

  export class Entity extends Physics.BaseBody implements Models.Identifiable, Physics.IContactable {

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