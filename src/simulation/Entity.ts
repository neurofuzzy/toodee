namespace Simulation {

  export class Entity
   extends Physics.BaseBody implements Util.Identifiable, Physics.IContactable {

    public id:number;

    public contactMask:number;
    public resolveMask:number;

    constructor () {

      super();

      this.id = Util.IdentityService.newIdentity();
      this.resolveMask = 0b11111111;
      this.contactMask = 0b11111111;

    }

  }

}