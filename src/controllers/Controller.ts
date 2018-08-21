namespace Controllers {

  export class Controller implements Util.IController {

    protected model:Util.IModel<Util.IModelItem & Geom.ISpatial>;
    protected view:Util.IView

    public initWithModelAndView(model:Util.IModel<Util.IModelItem & Geom.ISpatial>, view:Util.IView):Controller {

      this.model = model;
      this.view = view;

      return this;

    }

    protected build () {

      for (let i = 0; i < 100; i++) {
  
        var x = 100 + Math.random() * 600;
        var y = 100 + Math.random() * 400;
  
        var item = new Models.Item().initWithBounds(
          x, 
          y, 
          Math.random() * 20 + 10, 
          Math.random() * 20 + 10
        );

        this.model.addItem(item);
  
      }
  
  
    }

    public start () {

      console.log("starting...");
      this.build();

      this.view.ticker.add(this.update);

    }

    private countIntersections (itemA:Models.Item):number {

      let hits = 0;

      this.model.items.forEach(itemB => {
        if (Geom.boundsIntersect(itemA.bounds, itemB.bounds)) {
          hits++;
        }
      })

      return hits;


    }

    public update = () => {

      this.model.items.forEach(item => {
        item.bounds.anchor.x += Math.random() * 2 - 1;
        item.bounds.anchor.y += Math.random() * 2 - 1;
        let a = this.countIntersections(item);
item.rotation = 0.2 + a * 0.3;
      });

      this.view.update();

    }

    public stop () {

      console.log("stopping...");

      this.view.ticker.remove(this.update);

    }

  }

}