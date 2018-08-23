namespace Controllers {

  export class Controller implements Util.IController {

    protected model:Util.IModel<Util.IModelItem & Geom.IBody>;
    protected view:Util.IView

    public initWithModelAndView(model:Util.IModel<Util.IModelItem & Geom.IBody>, view:Util.IView):Controller {

      this.model = model;
      this.view = view;

      return this;

    }

    protected build () {

      for (let i = 0; i < 100; i++) {
  
        var x = 100 + Math.random() * 600;
        var y = 100 + Math.random() * 400;
 
        var b = new Geom.Bounds(x, y, 20, 20, Math.floor(Math.random() * 2 + 1));
        var c = new Geom.Constraints();

        if (b.shape == Geom.SHAPE_ROUND) {
          c.lockX = c.lockY = false;
        }
  
        var item = new Models.Item().initWithBoundsAndConstraints(b, c);

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
        if (itemA.id == itemB.id) {
          return;
        }
        if (Geom.boundsIntersect(itemA.bounds, itemB.bounds, true)) {
          Geom.resolvePenetrationBetweenBounds(itemA.bounds, itemB.bounds, itemA.constraints, itemB.constraints, true)
          hits++;
        }
      })

      return hits;


    }

    public update = () => {

      
      this.model.items.forEach(item => {

        // fake gravity
        if (!item.constraints.lockY) {

          item.bounds.anchor.y += 4;
          
          if (item.bounds.anchor.y + item.bounds.hh > 600) {
            item.bounds.anchor.y = 600 - item.bounds.hh;
          }

        }

      });
      


      this.model.items.forEach(item => {

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