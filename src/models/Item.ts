namespace Models {

  export class Item implements Util.IRenderable {

    public x:number;
    public y:number;
    public w:number;
    public h:number;
    public r:number;

    constructor () {

      this.x = 0;
      this.y = 0;
      this.w = 0;
      this.h = 0;
      this.r = 0;
      
    }

  }

}