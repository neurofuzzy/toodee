namespace Models {

  export class Model {

    public bodies:Util.BaseModel<Item>;
    public boundaries:Util.BaseModel<Boundary>;
    public ray:ProjectedRay;
 
    public init ():any {
      
      this.boundaries = new Util.BaseModel();
      this.bodies = new Util.BaseModel();
      this.ray = new ProjectedRay();

      return this;

    }

  }

}