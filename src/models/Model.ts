namespace Models {

  export class Model {

    public bodies:Util.BaseCollection<Item>;
    public projectiles:Util.BaseCollection<Projectile>;
    public boundaries:Util.BaseCollection<Boundary>;
    public ray:Geom.Ray;
    public rayHit:Geom.IPointHit;
 
    public init ():any {
      
      this.boundaries = new Util.BaseCollection().init();
      this.projectiles = new Util.BaseCollection().init();
      this.bodies = new Util.BaseCollection().init();
      this.ray = new Geom.Ray();

      return this;

    }

  }

}