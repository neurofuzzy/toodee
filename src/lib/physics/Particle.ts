namespace Physics {

  export interface IParticle extends ITemporal, Models.IChild {
    position:Geom.IPoint;
    velocity:Geom.IPoint;
    size:number;
    initWithPositionSizeAndLifespan (position:Geom.IPoint, size:number, lifespan:number):any;
  }

  export class BaseParticle implements IParticle {

    public parentID:number;
    public position:Geom.IPoint;
    public velocity:Geom.IPoint;
    public age:number;
    public lifespan:number;
    public size:number;

    constructor () {

    }

    public initWithPositionSizeAndLifespan (position:Geom.IPoint, size:number = 0, lifespan:number = 0):any {

      this.position = position;
      this.velocity = new Geom.Point();
      this.size = size;
      this.age = 0;
      this.lifespan = lifespan;

      return this;

    }

  }

}