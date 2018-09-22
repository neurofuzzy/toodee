namespace Physics {

  export interface IImpulse {
    origin:Geom.IPoint;
    angle:number;
  }

  export interface IForce extends IImpulse {
    age:number;
    lifespan:number;
  }

  export class Impulse implements IImpulse {

    public origin:Geom.IPoint;
    public angle:number;

    constructor (origin:Geom.IPoint, angle:number = 0) {

      this.origin = origin;
      this.angle = angle;

    }

  }

  export class Force extends Impulse {

    public age:number;
    public lifespan:number;

    public initWithLifespan (lifespan:number):Force {

      this.age = 0;
      this.lifespan = lifespan;

      return this;

    }

  }

  export class ProximityForce extends Force {

    public range:number;

    public initWithRangeAndLifespan (range:number = 0, lifespan:number = 0):ProximityForce {

      super.initWithLifespan(lifespan);
      this.range = range;

      return this;

    }

  }

  export class AreaForce extends Force {

    public parent:Geom.IPolygon;

    public initWithParentAndLifespan (parent:Geom.IPolygon, lifespan:number = 0):AreaForce {

      super.initWithLifespan(lifespan);
      this.parent = parent;

      return this;

    }


  }

}