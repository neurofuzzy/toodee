namespace Views {

  export class View implements Util.IView<Models.Model> {

    protected model:Models.Model;
    protected bodies:Array<PIXI.Graphics>;
    protected boundaries:Array<PIXI.Graphics>;
    protected projectiles:Array<PIXI.Graphics>;
    protected ray:PIXI.Graphics;
    protected testGraphic:PIXI.Graphics;

    public pixi:PIXI.Application;
    private fps:HTMLElement;

    private colors = [
      0xff0000,
      0x00ff00,
      0x00ffff,
      0xffff00,
    ]

    get ticker ():any {
      return this.pixi.ticker;
    }

    constructor () {

      this.pixi = new PIXI.Application();
      document.body.appendChild(this.pixi.view);

    }

    public initWithModel (model:Models.Model):any {
 
      this.model = model;
      this.bodies = [];
      this.boundaries = [];
      this.projectiles = [];
      this.fps = document.getElementById("fps");

      this.model.projectiles.addListener(this.onProjectileEvent, this);

      return this;

    }

    protected build () {

      this.pixi.stage.interactive = true;
      this.pixi.stage.hitArea = new PIXI.Rectangle(0, 0, 800, 600);

      // bodies 

      this.model.bodies.items.forEach(item => {
  
        let b = item.bounds;
        let lineColor = this.colors[item.id % 4];
        if (item.constraints.lockX) {
          lineColor = 0xffffff;
        }
        let gfx = new PIXI.Graphics()
          .beginFill(this.colors[item.id % 4], 0.5)
          .lineStyle(2, lineColor);

        if (item.bounds.shape == Util.Geom.SHAPE_ORTHO) {
          gfx.drawRect(0 - b.hw, 0 - b.hh, b.hw * 2, b.hh * 2);
        } else {
          gfx.drawCircle(0, 0, Math.min(b.hw, b.hh));
          gfx.cacheAsBitmap = true;
        }
  
        gfx.x = item.bounds.anchor.x;
        gfx.y = item.bounds.anchor.y;

        // Add to the stage
        this.pixi.stage.addChild(gfx);
        this.bodies.push(gfx);

        // makeDraggable(item, gfx);
  
      })

      // boundaries

      this.model.boundaries.items.forEach((boundary, idx) => {

        let gfx = new PIXI.Graphics().lineStyle(2, 0xffffff, 0.5);

        let bs = boundary.segments;

        if (bs.length > 0) {

          gfx.moveTo(bs[0].ptA.x, bs[0].ptA.y);

          for (let i = 1; i < bs.length; i++) {

            gfx.lineTo(bs[i].ptA.x, bs[i].ptA.y);

          }

          gfx.lineTo(bs[0].ptA.x, bs[0].ptA.y);

        }

        // Add to the stage
        this.pixi.stage.addChild(gfx);
        this.boundaries.push(gfx);

      });

      // ray 
      this.ray = new PIXI.Graphics().lineStyle(2, 0x00ff66, 0.5);

      // Add to the stage
      this.pixi.stage.addChild(this.ray);

      this.testGraphic = new PIXI.Graphics();
      this.pixi.stage.addChild(this.testGraphic);

    }

    public update () {

      // temp
      if (this.bodies.length == 0) {
        this.build();
      }
      
      // view update
      this.model.bodies.items.forEach(item => {
        let gfx = this.bodies[item.id];
        gfx.x = item.bounds.anchor.x;
        gfx.y = item.bounds.anchor.y;
        gfx.alpha = 1 - item.rotation;
      });

      this.model.projectiles.items.forEach(item => {
        let gfx = this.projectiles[item.id];
        gfx.x = item.position.x;
        gfx.y = item.position.y;
      });

      let r = this.model.ray;

      this.ray.clear();

      if (this.model.rayHit != undefined) {
        this.ray.lineStyle(2, 0x00ff66, 0.5);
        this.ray.moveTo(r.origin.x, r.origin.y);
        this.ray.lineTo(this.model.rayHit.pt.x, this.model.rayHit.pt.y);
      }
      
      this.testGraphic.clear();
      this.testGraphic.lineStyle(1, 0x00ffff, 0.5);
      
      let cen = { x: 400, y:300 };
      cen.x += 200 * Math.sin(Date.now() / 5000);
      cen.y += 200 * Math.cos(Date.now() / 5000);
      let rad = 150;
      
      let pts = Util.Geom.cellCoordsIntersectingCircle(cen, rad, 100);

      for (let i = 0; i < pts.length; i++) {
        let pt = pts[i];
        this.testGraphic.drawRect(pt.x * 100, pt.y * 100, 100, 100);
      }

      this.testGraphic.lineStyle(1, 0xff00ff);
      this.testGraphic.drawCircle(cen.x, cen.y, rad);

      // proximity force
      this.testGraphic.lineStyle(1, 0x00ff00);
      this.testGraphic.drawCircle(200, 200, 200);

      this.fps.innerText = this.pixi.ticker.FPS.toString();

    }

    onProjectileEvent(event: Util.IEvent<any>) {

      let gfx:PIXI.Graphics;
      
      switch (event.type) {

        case Util.EventType.Add:

          let p = this.model.projectiles.getItemByID(event.sourceID);
          gfx = new PIXI.Graphics();
          gfx.beginFill(this.colors[p.id % 4], 1);
          gfx.drawRect(0 - p.size * 0.5, 0 - p.size * 0.5, p.size, p.size);
          gfx.x = p.position.x;
          gfx.y = p.position.y;
          this.pixi.stage.addChild(gfx);
          this.projectiles[event.sourceID] = gfx;

          break;

        case Util.EventType.Remove:

          gfx = this.projectiles[event.sourceID];
          if (gfx) {
            this.pixi.stage.removeChild(gfx);
          }

          break;

      }

    }

  }

}