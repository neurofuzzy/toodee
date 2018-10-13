namespace Simulation {

  export class Model {

    public bodies:Models.BaseCollection<Entity>;
    public projectiles:Models.BaseCollection<Projectile>;
    public boundaries:Models.BaseCollection<Boundary>;
    public ray:Geom.Ray;
    public rayHit:Geom.IPointHit;
 
    public init ():any {
      
      this.boundaries = new Models.BaseCollection().init();
      this.projectiles = new Models.BaseCollection().init();
      this.bodies = new Models.BaseCollection().init();
      this.ray = new Geom.Ray();

      return this;

    }

  }

}