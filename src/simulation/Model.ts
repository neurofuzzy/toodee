namespace Simulation {

  export class Model {

    public bodies:Util.BaseCollection<Entity>;
    public projectiles:Util.BaseCollection<Projectile>;
    public boundaries:Util.BaseCollection<Boundary>;
    public ray:Util.Geom.Ray;
    public rayHit:Util.Geom.IPointHit;
 
    public init ():any {
      
      this.boundaries = new Util.BaseCollection().init();
      this.projectiles = new Util.BaseCollection().init();
      this.bodies = new Util.BaseCollection().init();
      this.ray = new Util.Geom.Ray();

      return this;

    }

  }

}