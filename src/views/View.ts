namespace Views {

  export class View implements Util.IView {

    protected model:Util.IModel<Util.IModelItem & Geom.ISpatial>;
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

    public initWithModel (model:Util.IModel<Util.IModelItem & Geom.ISpatial>):Util.IView {

      this.model = model;
      this.items = [];
      this.fps =document.getElementById("fps");

      return this;

    }

    protected build () {

      this.model.items.forEach(item => {
  
        var b = item.bounds;
        var gfx = new PIXI.Graphics()
          .beginFill(0xff9900, 0.5)
          .lineStyle(2, 0xffcc00)
          .drawRect(0 - b.hw, 0 - b.hh, b.hw * 2, b.hh * 2);
  
        gfx.x = item.bounds.anchor.x;
        gfx.y = item.bounds.anchor.y;

        // Add to the stage
        this.pixi.stage.addChild(gfx);
        this.items.push(gfx);
  
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