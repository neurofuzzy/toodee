namespace Models {

  export class Model {

    public bodies:Util.BaseModel<Item>;
    public boundaries:Util.BaseModel<Boundary>;
    public ray:Geom.Ray;
    public rayHit:Geom.IPointHit;
 
    public init ():any {
      
      this.boundaries = new Util.BaseModel();
      this.bodies = new Util.BaseModel();
      this.ray = new Geom.Ray();

      return this;

    }

  }

}