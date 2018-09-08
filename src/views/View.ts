namespace Views {

  export class View implements Util.IView<Models.Model> {

    protected model:Models.Model;
    protected bodies:Array<PIXI.Graphics>;
    protected boundaries:Array<PIXI.Graphics>;
    public pixi:PIXI.Application;
    private fps:HTMLElement;

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
      this.fps = document.getElementById("fps");

      return this;

    }

    protected build () {

      this.pixi.stage.interactive = true;
      this.pixi.stage.hitArea = new PIXI.Rectangle(0, 0, 800, 600);

      var colors = [0xff9900, 0x0099ff, 0x9900ff, 0x33ff33]

      this.model.bodies.items.forEach((item, idx) => {
  
        let b = item.bounds;
        let lineColor = colors[idx % 4];
        if (item.constraints.lockX) {
          lineColor = 0xffffff;
        }
        let gfx = new PIXI.Graphics()
          .beginFill(colors[idx % 4], 0.5)
          .lineStyle(2, lineColor);

        if (item.bounds.shape == Geom.SHAPE_ORTHO) {
          gfx.drawRect(0 - b.hw, 0 - b.hh, b.hw * 2, b.hh * 2);
        } else {
          gfx.drawCircle(0, 0, Math.min(b.hw, b.hh));
        }
  
        gfx.x = item.bounds.anchor.x;
        gfx.y = item.bounds.anchor.y;

        // Add to the stage
        this.pixi.stage.addChild(gfx);
        this.bodies.push(gfx);

        // makeDraggable(item, gfx);
  
      })

      this.model.boundaries.items.forEach((boundary, idx) => {

        let gfx = new PIXI.Graphics().lineStyle(2, 0xffffff, 0.5);

        let bs = boundary.segments;

        if (bs.length > 0) {

          gfx.moveTo(bs[0].ptA.x, bs[0].ptA.y);

          for (let i = 1; i < bs.length; i++) {

            gfx.lineTo(bs[i].ptA.x, bs[i].ptB.y);

          }

          gfx.lineTo(bs[0].ptA.x, bs[0].ptB.y);

        }

        // Add to the stage
        this.pixi.stage.addChild(gfx);
        this.boundaries.push(gfx);

      });
  
    }

    public update () {

      // temp
      if (this.bodies.length == 0) {
        this.build();
      }
      
      // view update
      this.model.bodies.items.forEach((item, idx) => {
        let gfx = this.bodies[item.id];
        gfx.x = item.bounds.anchor.x;
        gfx.y = item.bounds.anchor.y;
        gfx.alpha = item.rotation;
      });

    /*
      let m = this.model as Models.Model;

      this.testRay.clear();
      this.testRay.lineStyle(1, 0xffffff);
      this.testRay.moveTo(m.testRay.ptA.x, m.testRay.ptA.y);
      this.testRay.lineTo(m.testRay.ptB.x, m.testRay.ptB.y);

      let quads = Geom.gridPointsAlongLineWithThickness(m.testRay.ptA.x, m.testRay.ptA.y, m.testRay.ptB.x, m.testRay.ptB.y, 100, 20);
      //console.log(quads.length);
      quads.forEach(pt => {
        //this.testRay.moveTo(pt.x * 100, pt.y * 100);
        //this.testRay.drawRect(pt.x * 100, pt.y * 100, 100, 100);
      });
      */
      

      this.fps.innerText = this.pixi.ticker.FPS.toString();

    }

  }

}