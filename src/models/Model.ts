namespace Models {

  export class Model {

    public bodies:Util.BaseModel<Geom.IBody>;
    public boundaries:Util.BaseModel<Geom.IPolygon>;
    public ray:Geom.IRay;
 
    public init ():any {
      
      this.boundaries = new Util.BaseModel();
      this.bodies = new Util.BaseModel();
      this.ray = new ProjectedRay();

      return this;

    }

  }

}