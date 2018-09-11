namespace Physics {

  export interface IForce extends Geom.IPoint {

  }

  export class Force implements IForce {

    public x:number;
    public y:number;

    static fromContact (contact:IContact<IBody, any>):IForce {

      return null;

    }

  }

}