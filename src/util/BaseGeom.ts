namespace Util {

  export class Rect implements IRect {

    public x:number;
    public y:number;
    public w:number;
    public h:number;

    constructor (x:number = 0, y:number = 0, w:number = 0, h:number = 0) {

      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;

    }

  }

  export class Point implements IPoint {

    public x:number;
    public y:number;

    constructor (x:number = 0, y:number = 0) {

      this.x = x;
      this.y = y;

    }

  }

}