/// <reference path="../util/BaseItems.ts" />

namespace Models {

  export class Item extends Util.SpatialItem implements Util.IModelItem {

    public id:number;

    constructor () {

      super();

      this.id = Util.IdentityService.newIdentity();

    }

  }

}