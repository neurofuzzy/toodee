namespace Physics {

  export interface IParticle extends ITemporal, Util.IChild {
    position:Util.Geom.IPoint;
    velocity:Util.Geom.IPoint;
    size:number;
    initWithPositionSizeAndLifespan (position:Util.Geom.IPoint, size:number, lifespan:number):any;
  }

  export class BaseParticle implements IParticle {

    public parentID:number;
    public position:Util.Geom.IPoint;
    public velocity:Util.Geom.IPoint;
    public age:number;
    public lifespan:number;
    public size:number;

    constructor () {

    }

    public initWithPositionSizeAndLifespan (position:Util.Geom.IPoint, size:number = 0, lifespan:number = 0):any {

      this.position = position;
      this.velocity = new Util.Geom.Point();
      this.size = size;
      this.age = 0;
      this.lifespan = lifespan;

      return this;

    }

  }

}