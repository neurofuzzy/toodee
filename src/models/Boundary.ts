namespace Models {

  export class Boundary extends Geom.Polygon implements Util.IModelItem {

    public id:number;

    constructor (vertices?:Array<Geom.IPoint>) {

      super(vertices);

      this.id = Util.IdentityService.newIdentity();

      this.segments.forEach(seg => {
        seg.parentID = this.id;
      });

    }

  }

}