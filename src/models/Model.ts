namespace Models {

  export class Model {

    public bodies:Util.BaseModel<Physics.IBody>;
    public boundaries:Util.BaseModel<Physics.IPolygonBody>;
    public ray:ProjectedRay;
 
    public init ():any {
      
      this.boundaries = new Util.BaseModel();
      this.bodies = new Util.BaseModel();
      this.ray = new ProjectedRay();

      return this;

    }

  }

}