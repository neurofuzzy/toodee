namespace Physics {

  export interface IParticle extends Geom.IPoint, ITemporal, Util.IChild {
    velocity:Geom.IPoint;
    size:number;
  }

  export class BaseParticle extends Geom.Point implements IParticle {

    public parentID:number;
    public velocity:Geom.IPoint;
    public age:number;
    public lifespan:number;
    public size:number;

    constructor (x:number = 0, y:number = 0, lifespan:number = 0, size:number = 0) {

      super(x, y);

      this.size = size;
      this.age = 0;
      this.lifespan = lifespan;

    }

  }

}