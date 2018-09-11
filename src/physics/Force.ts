namespace Physics {

  export interface IForce extends Geom.IPoint {
    parentID:number;
  }

  export class Force implements IForce {

    public parentID:number;
    public x:number;
    public y:number;

    constructor (x:number = 0, y:number = 0) {

      this.x = x;
      this.y = y;

    }

    static fromContact (contact:IContact<IBody, any>):Array<IForce> {

      let a = contact.itemA;

      if (contact instanceof BodyBodyContact) {

        let forceA = new Force();
        let forceB = new Force();

      }

      if (contact instanceof BodyBoundaryContact) {

        let b = contact.itemB as Geom.ISegment;

      }

      return null;

    }

  }

}