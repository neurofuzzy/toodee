/// <reference path="../util/BaseModel.ts" />

namespace Models {

  export class Model extends Util.BaseModel<Geom.IBody> {

    public boundary:Geom.IPolygon;
 
    constructor () {
      super();
    }

    public init ():any {
      
      super.init();
      return this;

    }

  }

}