namespace Views {

  export class View implements Util.IView {

    protected model:Util.IModel<Util.IModelItem & Util.ISpatial>;
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

    public initWithModel (model:Util.IModel<Util.IModelItem & Util.ISpatial>):Util.IView {

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
          .drawRect(item.bounds.x, item.bounds.y, item.bounds.w, item.bounds.h);
  
        gfx.x = item.position.x;
        gfx.y = item.position.y;

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
        gfx.x = item.position.x;
        gfx.y = item.position.y;
        gfx.rotation = item.rotation;
      });

      this.fps.innerText = this.pixi.ticker.FPS.toString();

    }

  }

}