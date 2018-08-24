namespace Controllers {

  export class Controller implements Util.IController {

    protected model:Util.IModel<Util.IModelItem & Geom.IBody>;
    protected view:Util.IView
    protected quadMap:Geom.QuadMap;

    public initWithModelAndView(model:Util.IModel<Util.IModelItem & Geom.IBody>, view:Util.IView):Controller {

      this.model = model;
      this.view = view;
      this.quadMap = new Geom.QuadMap(100);

      return this;

    }

    protected build () {

      for (let i = 0; i < 1000; i++) {
  
        var x = 20 + Math.random() * 1480;
        var y = 20 + Math.random() * 560;
 
        var b = new Geom.Bounds(x, y, 10, 10, Math.floor(Math.random() * 2 + 1));
        var c = new Geom.Constraints();

        if (b.shape == Geom.SHAPE_ORTHO) {
          b.anchor.x = Math.floor(b.anchor.x / 20) * 20;
          b.anchor.y = Math.floor(b.anchor.y / 20) * 20;
        }

        if (b.shape == Geom.SHAPE_ROUND) {
          c.lockX = c.lockY = false;
        }
  
        var item = new Models.Item().initWithBoundsAndConstraints(b, c);

        this.model.addItem(item);
  
      }

      // add items to quadmap
      this.model.items.forEach(item => {
        this.quadMap.addItem(item);
      })


  
  
    }

    public start () {

      console.log("starting...");
      this.build();

      this.view.ticker.add(this.update);

    }

    private countIntersections (itemA:Models.Item):number {

      let hits = 0;

      let quads = this.quadMap.getSurroundingQuads(itemA);

      quads.forEach(quad => {
        if (quad != null) {
          quad.forEach(item => {
            var itemB = item as Models.Item;
            if (itemA == itemB) {
              return;
            }
            if (Geom.boundsIntersect(itemA.bounds, itemB.bounds, true)) {
              Geom.resolvePenetrationBetweenBounds(itemA.bounds, itemB.bounds, itemA.constraints, itemB.constraints, true)
              hits++;
            }
          });
        }
      });
/*
      this.model.items.forEach(itemB => {
        if (itemA.id == itemB.id) {
          return;
        }
        if (Geom.boundsIntersect(itemA.bounds, itemB.bounds, true)) {
          Geom.resolvePenetrationBetweenBounds(itemA.bounds, itemB.bounds, itemA.constraints, itemB.constraints, true)
          hits++;
        }
      })
*/
      return hits;


    }

    public update = () => {

      var items = this.model.items;
      
      items.forEach(item => {

        // fake gravity
        if (!item.constraints.lockY) {

          item.bounds.anchor.y += 4;
          
          if (item.bounds.anchor.y + item.bounds.hh > 600) {
            item.bounds.anchor.y = 600 - item.bounds.hh;
          }

        }

      });
      
      items.forEach(item => {
        this.quadMap.updateItem(item);
      });

      items.forEach(item => {
        let a = this.countIntersections(item);
        item.rotation = 0.2 + a * 0.3;
      });

      
      // reverse collision check
      var ritem;
      
      for (let i = items.length - 1; i >= 0; i--) {
        ritem = items[i];
        let a = this.countIntersections(ritem);
        ritem.rotation = 0.2 + a * 0.3;
      };
      

      /*
      // gravity sort

      var gitems = items.concat();
      gitems.sort((itemA, itemB) => {
        if (itemA.bounds.anchor.y < itemB.bounds.anchor.y) {
          return -1;
        } else if (itemA.bounds.anchor.y > itemB.bounds.anchor.y) {
          return 1;
        }
        return 0;
      });

      gitems.forEach(item => {
        let a = this.countIntersections(item);
        item.rotation = 0.2 + a * 0.3;
      });

      gitems.reverse();
      gitems.forEach(item => {
        let a = this.countIntersections(item);
        item.rotation = 0.2 + a * 0.3;
      });

      */

      items.forEach(item => {
        this.quadMap.updateItem(item);
      });

      this.view.update();

    }

    public stop () {

      console.log("stopping...");

      this.view.ticker.remove(this.update);

    }

  }

}