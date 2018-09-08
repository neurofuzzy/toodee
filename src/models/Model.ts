namespace Models {

  export class Model {

    public bodies:Util.BaseModel<Geom.IBody>;
    public boundaries:Util.BaseModel<Geom.IPolygon>;
 
    public init ():any {
      
      this.boundaries = new Util.BaseModel();
      this.bodies = new Util.BaseModel();

      return this;

    }

  }

}