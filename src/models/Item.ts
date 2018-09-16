/// <reference path="../physics/Body.ts" />

namespace Models {

  export class Item extends Physics.BaseBody implements Util.Identifiable {

    public id:number;

    constructor () {

      super();

      this.id = Util.IdentityService.newIdentity();

    }

  }

}