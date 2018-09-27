namespace Physics {

  export interface IParticle extends Geom.IPoint, ITemporal {
    velocity:Geom.IPoint;
    size:number;
  }

  export class BaseParticle extends Geom.Point implements IParticle {

    public velocity:Geom.IPoint;
    public size:number;
    public age:number;
    public lifespan:number;

    constructor (x:number = 0, y:number = 0, size:number = 0, lifespan:number = 0) {

      super(x, y);

      this.size = size;
      this.age = 0;
      this.lifespan = lifespan;

    }

  }

}