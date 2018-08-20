namespace Views {

  export class View implements Util.IView {

    protected model:Util.IModel<Util.IRenderable>;
    protected items:Array<PIXI.Graphics>;
    public pixi:PIXI.Application;

    constructor () {

      this.pixi = new PIXI.Application();
      document.body.appendChild(this.pixi.view);

    }

    public initWithModel (model:Util.IModel<Util.IRenderable>):View {

      this.model = model;
      this.items = [];
      return this;

    }

    public build () {

      this.model.items.forEach(item => {
  
        var gfx = new PIXI.Graphics()
          .beginFill(0xf0ff00)
          .drawRect(0 - item.w / 2, 0 - item.h / 2, item.w, item.h);
  
        gfx.x = item.x;
        gfx.y = item.y;
  
        // Add to the stage
        this.pixi.stage.addChild(gfx);
        this.items.push(gfx);
  
      })
  
    }

    public update () {
      
      // view update
      this.model.items.forEach((item, idx) => {
        let gfx = this.items[idx];
        gfx.x = item.x;
        gfx.y = item.y;
        gfx.rotation = item.r;
      });

    }

  }

}