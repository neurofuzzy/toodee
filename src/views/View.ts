namespace Views {

  export class View implements Util.IView {

    protected model:Util.IModel<Util.IModelItem & Geom.IBody>;
    protected items:Array<PIXI.Graphics>;
    public pixi:PIXI.Application;
    private fps:HTMLElement;

    get ticker ():any {
      return this.pixi.ticker;
    }

    constructor () {

      this.pixi = new PIXI.Application();
      document.body.appendChild(this.pixi.view);

    }

    public initWithModel (model:Util.IModel<Util.IModelItem & Geom.IBody>):Util.IView {

      this.model = model;
      this.items = [];
      this.fps =document.getElementById("fps");

      return this;

    }

    protected build () {

      var colors = [0xff9900, 0x0099ff, 0x9900ff, 0x33ff33]

      this.model.items.forEach((item, idx) => {
  
        var b = item.bounds;
        var lineColor = colors[idx % 4];
        if (item.constraints.lockX) {
          lineColor = 0xffffff;
        }
        var gfx = new PIXI.Graphics()
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
        this.items.push(gfx);

        var dragging = false;
        gfx.interactive = true;
        gfx.buttonMode = true;

        var onDragStart = function (event) {
          // store a reference to the data
          // the reason for this is because of multitouch
          // we want to track the movement of this particular touch
          this.data = event.data;
          this.alpha = 0.5;
          this.dragging = true;
        }
      
        var onDragEnd = function (event) {
          this.alpha = 1;
          this.dragging = false;
          // set the interaction data to null
          this.data = null;
        }
      
        var onDragMove = function (event) {
          if (this.dragging) {
              var newPosition = this.data.getLocalPosition(this.parent);
              this.x = newPosition.x;
              this.y = newPosition.y;
              item.bounds.anchor.x = this.x;
              item.bounds.anchor.y = this.y;
          }
        }

        gfx
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
  
      })
  
    }

    public update () {

      // temp
      if (this.items.length == 0) {
        this.build();
      }
      
      // view update
      this.model.items.forEach((item, idx) => {
        let gfx = this.items[item.id];
        gfx.x = item.bounds.anchor.x;
        gfx.y = item.bounds.anchor.y;
        gfx.alpha = item.rotation;
      });

      this.fps.innerText = this.pixi.ticker.FPS.toString();

    }

  }

}