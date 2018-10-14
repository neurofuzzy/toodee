namespace Physics {

  export interface IImpulse {
    power:number;
    angle:number;
  }

  export interface IForce extends IImpulse, ITemporal, Models.IChild {
    // mixed interface
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

    public parentID:number;
    public age:number;
    public lifespan:number;

    constructor (power:number, angle:number = 0, lifespan:number = 0) {

      super(power, angle);

      this.age = 0;
      this.lifespan = lifespan;

    }

  }

  export class PropulsionForce extends Force {

    public initWithParentID(parentID:number):PropulsionForce {

      this.parentID = parentID;
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

    public initWithParentID (parentID:number):AreaForce {

      this.parentID = parentID;

      return this;

    }


  }

}