import { IImpulse } from './Impulse';
import { ITemporal } from '../models/Events';
import { IChild } from '../models/IChild';
import { IPoint } from '../geom/IGeom';

export interface IForce extends IImpulse, ITemporal, IChild {
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

  public parentID!:number;
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

  public origin!:IPoint;
  public range!:number;

  public initWithOriginAndRange (origin:IPoint, range:number = 0):ProximityForce {

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