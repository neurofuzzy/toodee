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

  }

}