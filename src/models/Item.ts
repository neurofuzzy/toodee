/// <reference path="../geom/BaseSpatial.ts" />

namespace Models {

  export class Item extends Geom.BaseSpatial implements Util.IModelItem {

    public id:number;

    constructor () {

      super();

      this.id = Util.IdentityService.newIdentity();

    }

  }

}