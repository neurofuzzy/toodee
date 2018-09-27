namespace Physics {

  export interface IParticle extends Geom.IPoint {
    velocity:Geom.IPoint;
    size:number;
    initWithSize(size:number):any;
  }

  export class BaseParticle extends Geom.Point implements IParticle {

    public velocity:Geom.IPoint;
    public size:number;

    public initWithSize(size:number):any {

      this.velocity = new Geom.Point();
      this.size = size;

      return this;

    }

  }

}