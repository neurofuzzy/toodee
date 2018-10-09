namespace Util.Geom {

  export interface IConstraints {
    lockX:boolean;
    lockY:boolean;
    lockRotation:boolean;
  }

  export class Constraints implements IConstraints {

    public lockX:boolean;
    public lockY:boolean;
    public lockRotation:boolean;

    constructor (lockX:boolean = true, lockY:boolean = true, lockRotation:boolean = true) {

      this.lockX = lockX;
      this.lockY = lockY;
      this.lockRotation = lockRotation;

    }

  }

}