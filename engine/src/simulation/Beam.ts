/// <reference path="../physics/SegmentBody.ts" />

namespace Simulation {

  export class Beam extends Physics.SegmentBody implements Models.Identifiable, Models.IChild {

    public id:number;
    public parentID:number;

    constructor () {

      super();
      this.id = Models.IdentityService.newIdentity();

    }

  }

}