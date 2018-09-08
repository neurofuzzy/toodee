namespace Models {

  export class Item extends Geom.BaseBody implements Util.IModelItem {

    public id:number;

    constructor () {

      super();

      this.id = Util.IdentityService.newIdentity();

    }

  }

}