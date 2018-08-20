namespace Views {

  export class View implements Util.IView {

    protected model:Util.IModel<Util.IModelItem & Util.IRenderable>;
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

    public initWithModel (model:Util.IModel<Util.IModelItem & Util.IRenderable>):Util.IView {

      this.model = model;
      this.items = [];
      this.fps =document.getElementById("fps");

      return this;

    }

    protected build () {

      this.model.items.forEach(item => {
  
        var gfx = new PIXI.Graphics()
          .beginFill(0xff9900, 0.5)
          .lineStyle(2, 0xffcc00)
          .drawRect(0 - item.w / 2, 0 - item.h / 2, item.w, item.h);
  
        gfx.x = item.x;
        gfx.y = item.y;
  
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
        gfx.x = item.x;
        gfx.y = item.y;
        gfx.rotation = item.r;
      });

      this.fps.innerText = this.pixi.ticker.FPS.toString();

    }

  }

}