namespace Models {

  export class Projectile extends Physics.BaseParticle implements Util.Identifiable {

    public id:number;

    constructor (x:number = 0, y:number = 0, lifespan:number = 0, size:number = 0) {

      super(x, y, lifespan, size);

      this.id = Util.IdentityService.newIdentity();

    }    

  }

}