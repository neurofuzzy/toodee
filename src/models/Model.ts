namespace Models {

  export class Model {

    public bodies:Util.BaseCollection<Item>;
    public boundaries:Util.BaseCollection<Boundary>;
    public ray:Geom.Ray;
    public rayHit:Geom.IPointHit;
 
    public init ():any {
      
      this.boundaries = new Util.BaseCollection();
      this.bodies = new Util.BaseCollection();
      this.ray = new Geom.Ray();

      return this;

    }

  }

}