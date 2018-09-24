namespace Physics {

  export interface IImpulse {
    power:number;
    angle:number;
  }

  export interface IForce extends IImpulse {
    age:number;
    lifespan:number;
  }

  export class Impulse implements IImpulse {

    public power:number;
    public angle:number;

    constructor (power:number, angle:number = 0) {

      this.power = power;
      this.angle = angle;

    }

  }

  export class Force extends Impulse implements IForce {

    public age:number;
    public lifespan:number;

    constructor (power:number, angle:number = 0, lifespan:number = 0) {

      super(power, angle);

      this.age = 0;
      this.lifespan = lifespan;

    }

  }

  export class PropulsionForce extends Force {

    public parent:Geom.ISpatial;

    public initWithParent(parent:Geom.ISpatial):PropulsionForce {

      this.parent = parent;
      return this;

    }

  }

  export class ProximityForce extends Force {

    public origin:Geom.IPoint;
    public range:number;

    public initWithOriginAndRange (origin:Geom.IPoint, range:number = 0):ProximityForce {

      this.origin = origin;
      this.range = range;

      return this;

    }

  }

  export class AreaForce extends Force {

    public parent:Geom.IPolygon;

    public initWithParent (parent:Geom.IPolygon):AreaForce {

      this.parent = parent;

      return this;

    }


  }

}